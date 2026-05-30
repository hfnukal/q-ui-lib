const fs = require("node:fs");
const path = require("node:path");
const { readConfig } = require("../services/config");
const { resolveSourceContext, resolveRepo, parseRepoSelector } = require("../services/source-resolver");
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
  isInteractiveTerminal,
  nonInteractiveAskError,
  promptUpdateConfirm,
  userRejected,
} = require("../services/interactive");
const { renderComponentDiff } = require("../services/component-diff");
const {
  expandDependencies,
  groupSeedKeysByRepo,
  hasRootIndex,
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

function listInstalledComponentsForAll(targetDir) {
  const components = [];
  if (!fs.existsSync(targetDir)) return components;
  for (const uilib of fs.readdirSync(targetDir)) {
    const uilibDir = path.join(targetDir, uilib);
    if (!fs.statSync(uilibDir).isDirectory()) continue;
    for (const slug of fs.readdirSync(uilibDir)) {
      const componentDir = path.join(uilibDir, slug);
      if (!fs.statSync(componentDir).isDirectory()) continue;
      if (hasRootIndex(componentDir)) {
        components.push({ key: toComponentKey(uilib, slug), uilib, slug });
      }
    }
  }
  return components;
}

function inferRepoForInstalledComponent(config, component, fallbackRepoName) {
  const registry =
    typeof component.meta?.registry === "string" && component.meta.registry.trim().length > 0
      ? component.meta.registry.trim()
      : component.uilib;
  const repoNames = Object.keys(config.repos || {});
  const byRegistry = repoNames.filter(
    (repoName) =>
      Array.isArray(config.repos[repoName]?.uilibs) &&
      config.repos[repoName].uilibs.includes(registry)
  );
  if (byRegistry.length === 1) return byRegistry[0];
  if (byRegistry.length > 1) {
    const byUilib = byRegistry.filter((repoName) =>
      config.repos[repoName].uilibs.includes(component.uilib)
    );
    if (byUilib.length > 0) return byUilib[0];
    return byRegistry[0];
  }
  const byUilib = repoNames.filter(
    (repoName) =>
      Array.isArray(config.repos[repoName]?.uilibs) &&
      config.repos[repoName].uilibs.includes(component.uilib)
  );
  if (byUilib.length > 0) return byUilib[0];
  return fallbackRepoName;
}

function readInstalledMeta(targetDir, key) {
  const [uilib, ...rest] = key.split("/");
  const slug = rest.join("/");
  const metaPath = path.join(targetDir, uilib, slug, "meta.generated.json");
  if (!fs.existsSync(metaPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(metaPath, "utf8"));
  } catch {
    return null;
  }
}

function matchesRepoFilter(config, component, meta, flagsRepo, fallbackRepoName) {
  if (!flagsRepo) return true;
  const parsed = parseRepoSelector(flagsRepo);
  const repoName = inferRepoForInstalledComponent(
    config,
    { uilib: component.uilib, meta },
    fallbackRepoName
  );
  if (parsed.repo && parsed.repo !== repoName) return false;
  if (parsed.uilib && parsed.uilib !== component.uilib) return false;
  return true;
}

function filterInstalledByAllScope(
  installedComponents,
  scope,
  config,
  fallbackRepoName,
  flagsRepo,
  targetDir
) {
  return installedComponents.filter((component) => {
    const meta = readInstalledMeta(targetDir, component.key);
    if (scope.kind === "uilib" && component.uilib !== scope.uilib) return false;
    if (scope.kind === "repo-uilib") {
      const repoName = inferRepoForInstalledComponent(
        config,
        { uilib: component.uilib, meta },
        fallbackRepoName
      );
      if (repoName !== scope.repo || component.uilib !== scope.uilib) return false;
    }
    return matchesRepoFilter(config, component, meta, flagsRepo, fallbackRepoName);
  });
}

function groupInstalledByRepo(config, installedComponents, fallbackRepoName, flagsRepo, targetDir) {
  const map = new Map();
  for (const component of installedComponents) {
    const meta = readInstalledMeta(targetDir, component.key);
    if (!matchesRepoFilter(config, component, meta, flagsRepo, fallbackRepoName)) continue;
    const repoName = inferRepoForInstalledComponent(
      config,
      { uilib: component.uilib, meta },
      fallbackRepoName
    );
    if (!map.has(repoName)) map.set(repoName, []);
    map.get(repoName).push(component.key);
  }
  for (const repoName of map.keys()) {
    map.set(repoName, [...new Set(map.get(repoName))]);
  }
  return map;
}

function skipConfirmation(flags) {
  return Boolean(flags.yes || flags.force || flags.auto || flags.dryRun);
}

function printUpdatePlanDiffs(components, targetDir) {
  for (const component of components) {
    const localDir = path.join(targetDir, component.uilib, component.slug);
    const lines = renderComponentDiff(localDir, component.dir, component.key);
    if (lines.length === 0) {
      process.stdout.write(`--- ${component.key} (no file changes)\n\n`);
      continue;
    }
    process.stdout.write(`${lines.join("\n")}\n\n`);
  }
}

async function confirmUpdate(expandedFlat, targetDir, flags) {
  if (skipConfirmation(flags)) return;
  const lines = expandedFlat.map((c) => `  ${c.key}`).join("\n");
  const message = `Overwrite ${expandedFlat.length} installed component(s) from source?\n${lines}`;
  if (!isInteractiveTerminal()) {
    throw nonInteractiveAskError("Update requires confirmation.");
  }
  const choice = await promptUpdateConfirm(message, () => {
    printUpdatePlanDiffs(expandedFlat, targetDir);
  });
  if (choice === "no") throw userRejected("Update cancelled.");
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

function formatRepoSelector(flagsRepo, seedHits, byRepo) {
  if (flagsRepo) return flagsRepo;
  if (seedHits) {
    const repos = [...new Set(seedHits.map((h) => h.repoName))];
    if (repos.length === 1) return repos[0];
    if (repos.length > 1) return repos.join("|");
  }
  if (byRepo && byRepo.size === 1) return [...byRepo.keys()][0];
  if (byRepo && byRepo.size > 1) return [...byRepo.keys()].join("|");
  return null;
}

function notInstalledError(spec, targetPath) {
  const err = new Error(`Component '${spec}' is not installed under '${targetPath}'.`);
  err.exitCode = EXIT_CODES.SOURCE_GIT_NETWORK_ERROR;
  return err;
}

function usageError(message) {
  const err = new Error(message);
  err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
  throw err;
}

async function runUpdate(context) {
  const { cwd, flags, positionals } = context;
  const { config } = readConfig(cwd);
  const { repoName: fallbackRepoName } = resolveRepo(config, flags.repo);
  const policy = resolvePolicy(flags, config.policy);
  const targetPath = flags.targetPath || config.targetPath;
  const targetDir = ensureRelativeUnderCwd(cwd, targetPath);
  const installed = listInstalledComponentKeys(targetDir);

  if (flags.all && positionals.length > 1) {
    usageError("update --all accepts at most one scope argument (<uilib> or <repo>/<uilib>).");
  }

  let byRepo;
  let seedHits = null;

  if (flags.all) {
    let installedComponents = listInstalledComponentsForAll(targetDir);
    if (positionals.length === 1) {
      const scope = parseAllScopeSpec(positionals[0]);
      installedComponents = filterInstalledByAllScope(
        installedComponents,
        scope,
        config,
        fallbackRepoName,
        flags.repo,
        targetDir
      );
    }
    if (installedComponents.length === 0) {
      usageError("update --all found no installed components in the selected scope.");
    }
    byRepo = groupInstalledByRepo(
      config,
      installedComponents,
      fallbackRepoName,
      flags.repo,
      targetDir
    );
    if ([...byRepo.values()].every((keys) => keys.length === 0)) {
      usageError("update --all found no installed components in the selected scope.");
    }
  } else {
    if (positionals.length === 0) {
      usageError(
        "update requires at least one component spec ([<repo>/][<uilib>/][<component>]) or --all."
      );
    }
    seedHits = resolveSeedHitsFromPositionals(cwd, config, positionals, flags.repo);
    for (let i = 0; i < seedHits.length; i += 1) {
      if (!installed.has(seedHits[i].seedKey)) {
        throw notInstalledError(positionals[i], targetPath);
      }
    }
    byRepo = groupSeedKeysByRepo(seedHits);
  }

  const warnings = [];
  const mergedComponents = [];
  const npmPackages = new Set();
  const activeWorkspaces = [];

  for (const [repoName, seedKeys] of byRepo) {
    if (seedKeys.length === 0) continue;
    const source = resolveSourceContext(cwd, config, repoName);
    const workspace = prepareSourceWorkspace(source);
    activeWorkspaces.push(workspace);
    const componentsRootDir = path.join(workspace.rootPath, source.repo.componentsRoot);
    const orderedUilibs = source.repo.uilibs;
    const expanded = expandDependencies(componentsRootDir, orderedUilibs, seedKeys, repoName);
    mergedComponents.push(...expanded.components);
    for (const pkg of expanded.npmPackages) npmPackages.add(pkg);
    if (expanded.unresolvedDeps.length > 0) {
      warnings.push(
        `[${repoName}] Some dependencies referenced in meta.generated.json were not found in source: ${expanded.unresolvedDeps.join(", ")}`
      );
    }
  }

  const expandedFlat = dedupeExpandedByInstallKey(mergedComponents);
  if (expandedFlat.length === 0) {
    const err = new Error("No components resolved for update.");
    err.exitCode = EXIT_CODES.SOURCE_GIT_NETWORK_ERROR;
    throw err;
  }

  await confirmUpdate(expandedFlat, targetDir, flags);

  const npmResult = await installMissingDependencies(cwd, [...npmPackages].sort(), flags, policy);
  const items = [];

  try {
    for (const component of expandedFlat) {
      const sourceDir = component.dir;
      const targetUilibDir = path.join(targetDir, component.uilib);
      const destDir = path.join(targetUilibDir, component.slug);
      if (flags.dryRun) {
        items.push({ action: "modify", target: path.relative(cwd, destDir), status: "planned" });
        continue;
      }
      assertNoCaseInsensitiveCollision(targetUilibDir, component.slug);
      copyComponentDirectory(sourceDir, destDir);
      items.push({ action: "modify", target: path.relative(cwd, destDir), status: "applied" });
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
    command: "update",
    ok: true,
    exitCode: EXIT_CODES.SUCCESS,
    repoSelector: formatRepoSelector(flags.repo, seedHits, byRepo),
    targetPath,
    summary: {
      planned: items.filter((x) => x.status === "planned").length,
      applied: items.filter((x) => x.status === "applied").length,
      skipped: 0,
      failed: 0,
    },
    items,
    warnings,
  });
}

module.exports = { runUpdate };
