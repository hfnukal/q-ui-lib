const fs = require("node:fs");
const path = require("node:path");
const { readConfig } = require("../services/config");
const { resolveSourceContext } = require("../services/source-resolver");
const { prepareSourceWorkspace } = require("../services/source-workspace");
const { createReport } = require("../services/report");
const { collectNpmDependencies } = require("../services/dependency-graph");
const { installMissingDependencies } = require("../services/npm-dependencies");
const {
  ensureRelativeUnderCwd,
  copyComponentDirectory,
  assertNoCaseInsensitiveCollision,
} = require("../services/component-files");
const { resolvePolicy } = require("../services/policy");
const { EXIT_CODES } = require("../constants");

function readMeta(componentDir) {
  const metaPath = path.join(componentDir, "meta.generated.json");
  if (!fs.existsSync(metaPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(metaPath, "utf8"));
  } catch {
    return null;
  }
}

function collectComponentSlugs(currentDir, prefix = "") {
  if (!fs.existsSync(currentDir)) return [];
  const slugs = [];
  for (const entry of fs.readdirSync(currentDir)) {
    const entryPath = path.join(currentDir, entry);
    if (!fs.statSync(entryPath).isDirectory()) continue;
    const slug = prefix ? `${prefix}/${entry}` : entry;
    if (fs.existsSync(path.join(entryPath, "meta.generated.json"))) {
      slugs.push(slug);
    }
    slugs.push(...collectComponentSlugs(entryPath, slug));
  }
  return slugs;
}

function listSubdirs(parentDir) {
  if (!fs.existsSync(parentDir)) return [];
  return fs
    .readdirSync(parentDir)
    .filter((name) => fs.statSync(path.join(parentDir, name)).isDirectory());
}

function listInstalledComponents(targetDir) {
  const installed = [];
  for (const uilib of listSubdirs(targetDir)) {
    const uilibDir = path.join(targetDir, uilib);
    for (const slug of collectComponentSlugs(uilibDir)) {
      installed.push(`${uilib}/${slug}`);
    }
  }
  return installed;
}

function parseComponentKey(key) {
  const value = String(key || "").trim();
  const [uilib, ...rest] = value.split("/");
  const slug = rest.join("/");
  if (!uilib || !slug) return null;
  return { uilib, slug };
}

function readInstalledComponentMeta(targetDir, componentKey) {
  const parsed = parseComponentKey(componentKey);
  if (!parsed) return null;
  return readMeta(path.join(targetDir, parsed.uilib, parsed.slug));
}

function inferRepoForInstalledComponent(config, componentKey, fallbackRepoName, targetDir) {
  const parsed = parseComponentKey(componentKey);
  if (!parsed) return fallbackRepoName;
  const meta = readInstalledComponentMeta(targetDir, componentKey);
  const registry =
    typeof meta?.registry === "string" && meta.registry.trim().length > 0
      ? meta.registry.trim()
      : parsed.uilib;
  const repoNames = Object.keys(config.repos || {});
  const byRegistry = repoNames.filter((repoName) =>
    Array.isArray(config.repos[repoName]?.uilibs) &&
    config.repos[repoName].uilibs.includes(registry)
  );
  if (byRegistry.length === 1) return byRegistry[0];
  if (byRegistry.length > 1) {
    const byUilib = byRegistry.filter((repoName) =>
      config.repos[repoName].uilibs.includes(parsed.uilib)
    );
    if (byUilib.length > 0) return byUilib[0];
    return byRegistry[0];
  }
  const byUilib = repoNames.filter((repoName) =>
    Array.isArray(config.repos[repoName]?.uilibs) &&
    config.repos[repoName].uilibs.includes(parsed.uilib)
  );
  if (byUilib.length > 0) return byUilib[0];
  return fallbackRepoName;
}

function groupInstalledSeedsByRepo(config, componentKeys, defaultRepoName, targetDir) {
  const map = new Map();
  for (const key of componentKeys) {
    const repoName = inferRepoForInstalledComponent(config, key, defaultRepoName, targetDir);
    if (!map.has(repoName)) map.set(repoName, []);
    map.get(repoName).push(key);
  }
  for (const repoName of map.keys()) {
    map.set(repoName, [...new Set(map.get(repoName))]);
  }
  return map;
}

function listSourceUilibs(componentsRootDir) {
  return listSubdirs(componentsRootDir);
}

function toComponentKey(uilib, slug) {
  return `${uilib}/${slug}`;
}

function hasComponentMeta(componentDir) {
  return fs.existsSync(path.join(componentDir, "meta.generated.json"));
}

function resolveComponentSpec(componentsRootDir, orderedUilibs, spec, preferredUilib) {
  const value = String(spec || "").trim();
  if (!value) return null;
  if (value.includes("/")) {
    const [uilib, ...rest] = value.split("/");
    const slug = rest.join("/");
    if (!uilib || !slug) return null;
    const dir = path.join(componentsRootDir, uilib, slug);
    if (!hasComponentMeta(dir)) return null;
    return { key: toComponentKey(uilib, slug), uilib, slug, dir };
  }

  const candidates = [];
  if (preferredUilib) candidates.push(preferredUilib);
  for (const uilib of orderedUilibs) {
    if (!candidates.includes(uilib)) candidates.push(uilib);
  }

  for (const uilib of candidates) {
    const directDir = path.join(componentsRootDir, uilib, value);
    if (hasComponentMeta(directDir)) {
      return { key: toComponentKey(uilib, value), uilib, slug: value, dir: directDir };
    }
  }

  for (const uilib of candidates) {
    const uilibDir = path.join(componentsRootDir, uilib);
    for (const slug of collectComponentSlugs(uilibDir)) {
      const dir = path.join(uilibDir, slug);
      const meta = readMeta(dir);
      const name = typeof meta?.name === "string" ? meta.name.trim() : "";
      const registry = typeof meta?.registry === "string" ? meta.registry.trim() : "";
      const leaf = slug.split("/").pop();
      const aliases = new Set([leaf, name].filter(Boolean));
      if (registry) {
        aliases.add(`${registry}/${leaf}`);
        if (name) aliases.add(`${registry}/${name}`);
      }
      if (aliases.has(value)) {
        return { key: toComponentKey(uilib, slug), uilib, slug, dir };
      }
    }
  }
  return null;
}

function expandDependencies(componentsRootDir, orderedUilibs, seedSpecs) {
  const queue = [];
  const ordered = [];
  const seen = new Set();

  for (const seed of [...new Set(seedSpecs)]) {
    const resolvedSeed = resolveComponentSpec(componentsRootDir, orderedUilibs, seed, null);
    if (!resolvedSeed) {
      const err = new Error(`Component '${seed}' not found in source '${componentsRootDir}'.`);
      err.exitCode = EXIT_CODES.SOURCE_GIT_NETWORK_ERROR;
      throw err;
    }
    queue.push(resolvedSeed.key);
  }

  while (queue.length > 0) {
    const nextSpec = queue.shift();
    const resolved = resolveComponentSpec(componentsRootDir, orderedUilibs, nextSpec, null);
    if (!resolved) {
      const err = new Error(`Component '${nextSpec}' not found in source '${componentsRootDir}'.`);
      err.exitCode = EXIT_CODES.SOURCE_GIT_NETWORK_ERROR;
      throw err;
    }
    if (seen.has(resolved.key)) continue;
    seen.add(resolved.key);
    ordered.push(resolved);
    const meta = readMeta(resolved.dir);
    const deps = Array.isArray(meta?.dependencies) ? meta.dependencies : [];
    for (const dep of deps) {
      const depResolved = resolveComponentSpec(
        componentsRootDir,
        orderedUilibs,
        dep,
        resolved.uilib
      );
      if (!depResolved) continue;
      if (!seen.has(depResolved.key)) queue.push(depResolved.key);
    }
  }

  return ordered;
}

async function runUpdate(context) {
  const { cwd, flags, positionals } = context;
  const { config } = readConfig(cwd);
  const source = resolveSourceContext(cwd, config, flags.repo);
  const policy = resolvePolicy(flags, config.policy);
  const targetPath = flags.targetPath || config.targetPath;
  const targetDir = ensureRelativeUnderCwd(cwd, targetPath);

  if (flags.all && positionals.length > 0) {
    const err = new Error("Cannot combine explicit components with --all.");
    err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
    throw err;
  }

  let seeds = positionals;
  if (flags.all) {
    seeds = listInstalledComponents(targetDir);
  }
  if (seeds.length === 0) {
    const err = new Error("update requires components or --all.");
    err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
    throw err;
  }

  const warnings = [];
  const byRepo =
    flags.all && !flags.repo
      ? groupInstalledSeedsByRepo(config, seeds, source.repoName, targetDir)
      : new Map([[source.repoName, seeds]]);
  const items = [];
  const npmPackages = new Set();

  for (const [repoName, repoSeeds] of byRepo) {
    const repoSource = flags.repo ? source : resolveSourceContext(cwd, config, repoName);
    const workspace = prepareSourceWorkspace(repoSource);
    try {
      const componentsRootDir = path.join(workspace.rootPath, repoSource.repo.componentsRoot);
      const installedUilibs = listSubdirs(targetDir);
      const configuredUilibs = Array.isArray(repoSource.repo?.uilibs) ? repoSource.repo.uilibs : [];
      const sourceUilibs = listSourceUilibs(componentsRootDir);
      const orderedUilibs = [...new Set([...installedUilibs, ...configuredUilibs, ...sourceUilibs])];
      const expanded = expandDependencies(componentsRootDir, orderedUilibs, repoSeeds);
      const expandedKeys = expanded.map((component) => component.key);
      for (const pkg of collectNpmDependencies(componentsRootDir, expandedKeys)) {
        npmPackages.add(pkg);
      }

      for (const component of expanded) {
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
      workspace.cleanup();
    }
  }

  const npmResult = await installMissingDependencies(cwd, [...npmPackages].sort(), flags, policy);

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
    repoSelector: flags.repo || (byRepo.size === 1 ? [...byRepo.keys()][0] : [...byRepo.keys()].join("|")),
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
