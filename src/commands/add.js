const fs = require("node:fs");
const path = require("node:path");
const { readConfig } = require("../services/config");
const { resolveSourceContext } = require("../services/source-resolver");
const { prepareSourceWorkspace } = require("../services/source-workspace");
const { createReport } = require("../services/report");
const { installMissingDependencies } = require("../services/npm-dependencies");
const {
  ensureRelativeUnderCwd,
  copyComponentDirectory,
  assertNoCaseInsensitiveCollision,
} = require("../services/component-files");
const { resolvePolicy } = require("../services/policy");
const { EXIT_CODES } = require("../constants");
const {
  collectSeedsForAllScopedRepoUilib,
  collectSeedsForAllScopedUilib,
  expandDependencies,
  groupSeedKeysByRepo,
  hasRootIndex,
  listSlugsInUilibDir,
  notFoundError,
  orderedUilibsForRepoWideAll,
  parseAllScopeSpec,
  resolveSeedHitsFromPositionals,
  toComponentKey,
} = require("../services/component-catalog");

function listInstalledComponentKeys(targetDir) {
  const installed = new Set();
  if (!fs.existsSync(targetDir)) return installed;
  for (const uilib of fs.readdirSync(targetDir)) {
    const uilibDir = path.join(targetDir, uilib);
    if (!fs.statSync(uilibDir).isDirectory()) continue;
    for (const slug of fs.readdirSync(uilibDir)) {
      const componentDir = path.join(uilibDir, slug);
      if (!fs.statSync(componentDir).isDirectory()) continue;
      if (hasRootIndex(componentDir)) {
        installed.add(toComponentKey(uilib, slug));
      }
    }
  }
  return installed;
}

function dedupeExpandedByInstallKey(components) {
  const out = [];
  const seen = new Set();
  for (const c of components) {
    if (seen.has(c.key)) continue;
    seen.add(c.key);
    out.push(c);
  }
  return out;
}

function formatRepoSelector(flagsRepo, seedHits) {
  if (flagsRepo) return flagsRepo;
  const repos = [...new Set(seedHits.map((h) => h.repoName))];
  if (repos.length === 1) return repos[0];
  return repos.join("|");
}

async function runAdd(context) {
  const { cwd, flags, positionals } = context;
  const { config } = readConfig(cwd);
  const policy = resolvePolicy(flags, config.policy);
  const targetPath = flags.targetPath || config.targetPath;
  const targetDir = ensureRelativeUnderCwd(cwd, targetPath);

  if (flags.all && positionals.length > 1) {
    const err = new Error("add --all accepts at most one scope argument (<uilib> or <repo>/<uilib>).");
    err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
    throw err;
  }

  let seedHits;
  if (flags.all && positionals.length === 1) {
    const scope = parseAllScopeSpec(positionals[0]);
    if (scope.kind === "uilib") {
      seedHits = collectSeedsForAllScopedUilib(cwd, config, scope.uilib, flags.repo);
    } else {
      seedHits = collectSeedsForAllScopedRepoUilib(cwd, config, scope.repo, scope.uilib);
    }
    if (!seedHits || seedHits.length === 0) {
      throw notFoundError(positionals[0]);
    }
  } else if (flags.all) {
    const source = resolveSourceContext(cwd, config, flags.repo);
    const workspace = prepareSourceWorkspace(source);
    try {
      const componentsRootDir = path.join(workspace.rootPath, source.repo.componentsRoot);
      const uilibs = orderedUilibsForRepoWideAll(flags.repo, source);
      seedHits = uilibs.flatMap((uilib) =>
        listSlugsInUilibDir(componentsRootDir, uilib).map((slug) => ({
          repoName: source.repoName,
          uilib,
          slug,
          seedKey: toComponentKey(uilib, slug),
        }))
      );
    } finally {
      workspace.cleanup();
    }
    if (seedHits.length === 0) {
      const err = new Error("add --all found no components in the selected scope.");
      err.exitCode = EXIT_CODES.SOURCE_GIT_NETWORK_ERROR;
      throw err;
    }
  } else {
    if (positionals.length === 0) {
      const err = new Error("add requires at least one component or --all.");
      err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
      throw err;
    }
    seedHits = resolveSeedHitsFromPositionals(cwd, config, positionals, flags.repo);
  }

  const installed = listInstalledComponentKeys(targetDir);
  const byRepo = groupSeedKeysByRepo(seedHits);
  const warnings = [];
  const mergedComponents = [];
  const npmPackages = new Set();
  const activeWorkspaces = [];

  for (const [repoName, seedKeys] of byRepo) {
    const source = resolveSourceContext(cwd, config, repoName);
    const workspace = prepareSourceWorkspace(source);
    activeWorkspaces.push(workspace);
    const componentsRootDir = path.join(workspace.rootPath, source.repo.componentsRoot);
    const orderedUilibs = source.repo.uilibs;
    const expanded = expandDependencies(componentsRootDir, orderedUilibs, seedKeys, repoName);
    mergedComponents.push(...expanded.components);
    for (const pkg of expanded.npmPackages) npmPackages.add(pkg);
    const autoAdded = expanded.components.filter((c) => !expanded.explicitSeeds.has(c.key));
    if (autoAdded.length > 0) {
      warnings.push(
        `[${repoName}] Missing component dependencies were auto-added: ${autoAdded.map((x) => x.key).join(", ")}`
      );
    }
    if (expanded.unresolvedDeps.length > 0) {
      warnings.push(
        `[${repoName}] Some dependencies referenced in meta.generated.json were not found in source: ${expanded.unresolvedDeps.join(", ")}`
      );
    }
  }

  const expandedFlat = dedupeExpandedByInstallKey(mergedComponents);

  const npmResult = await installMissingDependencies(cwd, [...npmPackages].sort(), flags, policy);
  const items = [];

  try {
    for (const component of expandedFlat) {
      const sourceDir = component.dir;
      const targetUilibDir = path.join(targetDir, component.uilib);
      const destDir = path.join(targetUilibDir, component.slug);
      const alreadyInstalled = installed.has(component.key);
      if (flags.dryRun) {
        const status = alreadyInstalled ? "skipped" : "planned";
        items.push({ action: "create", target: path.relative(cwd, destDir), status });
        continue;
      }
      if (alreadyInstalled) {
        items.push({ action: "create", target: path.relative(cwd, destDir), status: "skipped" });
        continue;
      }
      assertNoCaseInsensitiveCollision(targetUilibDir, component.slug);
      copyComponentDirectory(sourceDir, destDir);
      installed.add(component.key);
      items.push({ action: "create", target: path.relative(cwd, destDir), status: "applied" });
    }
  } finally {
    for (const workspace of activeWorkspaces) workspace.cleanup();
  }

  for (const pkg of npmResult.missing) {
    items.push({
      action: "install",
      target: pkg,
      status: npmResult.installed.includes(pkg) ? "applied" : "planned",
    });
  }
  if (npmResult.skipped.length) {
    warnings.push(`Missing npm deps not installed: ${npmResult.skipped.join(", ")}`);
    if (policy.onError === "fail") {
      const err = new Error("npm dependency installation required by policy.");
      err.exitCode = EXIT_CODES.POLICY_FAIL_STOP;
      throw err;
    }
  }

  return createReport({
    command: "add",
    ok: true,
    exitCode: EXIT_CODES.SUCCESS,
    repoSelector: formatRepoSelector(flags.repo, seedHits),
    targetPath,
    summary: {
      planned: items.filter((x) => x.status === "planned").length,
      applied: items.filter((x) => x.status === "applied").length,
      skipped: items.filter((x) => x.status === "skipped").length,
      failed: 0,
    },
    items,
    warnings,
  });
}

module.exports = { runAdd };
