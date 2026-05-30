const fs = require("node:fs");
const path = require("node:path");
const { readConfig } = require("../services/config");
const { resolveSourceContext } = require("../services/source-resolver");
const { createReport } = require("../services/report");
const {
  ensureRelativeUnderCwd,
  listEmptyParentsAfterRemove,
  pruneEmptyParentDirectories,
  removeComponentDirectory,
} = require("../services/component-files");
const { uninstallDependencies } = require("../services/npm-dependencies");
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

function toComponentKey(uilib, slug) {
  return `${uilib}/${slug}`;
}

function hasComponentMeta(componentDir) {
  return fs.existsSync(path.join(componentDir, "meta.generated.json"));
}

function listInstalledComponents(targetDir) {
  const installed = [];
  for (const uilib of listSubdirs(targetDir)) {
    const uilibDir = path.join(targetDir, uilib);
    for (const slug of collectComponentSlugs(uilibDir)) {
      const dir = path.join(uilibDir, slug);
      installed.push({
        key: toComponentKey(uilib, slug),
        uilib,
        slug,
        dir,
        meta: readMeta(dir),
      });
    }
  }
  return installed;
}

function resolveInstalledComponentSpec(installed, orderedUilibs, spec, preferredUilib) {
  const value = String(spec || "").trim();
  if (!value) return null;
  const byKey = new Map(installed.map((component) => [component.key, component]));
  if (byKey.has(value)) return byKey.get(value);

  if (value.includes("/")) {
    const [uilib, ...rest] = value.split("/");
    const slug = rest.join("/");
    if (!uilib || !slug) return null;
    const key = toComponentKey(uilib, slug);
    return byKey.get(key) || null;
  }

  const candidates = [];
  if (preferredUilib) candidates.push(preferredUilib);
  for (const uilib of orderedUilibs) {
    if (!candidates.includes(uilib)) candidates.push(uilib);
  }

  const directMatch = installed.find(
    (component) => candidates.includes(component.uilib) && component.slug === value
  );
  if (directMatch) return directMatch;

  for (const uilib of candidates) {
    for (const component of installed) {
      if (component.uilib !== uilib) continue;
      const name = typeof component.meta?.name === "string" ? component.meta.name.trim() : "";
      const registry =
        typeof component.meta?.registry === "string" ? component.meta.registry.trim() : "";
      const leaf = component.slug.split("/").pop();
      const aliases = new Set([leaf, name].filter(Boolean));
      if (registry) {
        aliases.add(`${registry}/${leaf}`);
        if (name) aliases.add(`${registry}/${name}`);
      }
      if (aliases.has(value)) {
        return component;
      }
    }
  }
  return null;
}

function findDependents(installed, orderedUilibs, keysToRemove) {
  const toRemove = new Set(keysToRemove);
  const dependents = [];
  for (const component of installed) {
    if (toRemove.has(component.key)) continue;
    const deps = Array.isArray(component.meta?.dependencies) ? component.meta.dependencies : [];
    for (const dep of deps) {
      const depResolved = resolveInstalledComponentSpec(
        installed,
        orderedUilibs,
        dep,
        component.uilib
      );
      if (depResolved && toRemove.has(depResolved.key)) {
        dependents.push({ component: component.key, dependsOn: depResolved.key });
      }
    }
  }
  return dependents;
}

function collectRemovedNpmDeps(installedComponents) {
  const deps = new Set();
  for (const component of installedComponents) {
    const npmDeps = Array.isArray(component.meta?.npmDependencies)
      ? component.meta.npmDependencies
      : [];
    for (const dep of npmDeps) deps.add(dep);
  }
  return [...deps];
}

function collectRemainingNpmDeps(installed, removingKeys) {
  const removingSet = new Set(removingKeys);
  const all = new Set();
  for (const component of installed) {
    if (removingSet.has(component.key)) continue;
    const deps = Array.isArray(component.meta?.npmDependencies) ? component.meta.npmDependencies : [];
    for (const dep of deps) all.add(dep);
  }
  return all;
}

async function runRemove(context) {
  const { cwd, flags, positionals } = context;
  const { config } = readConfig(cwd);
  const source = resolveSourceContext(cwd, config, flags.repo);
  const policy = resolvePolicy(flags, config.policy);
  const targetPath = flags.targetPath || config.targetPath;
  const targetDir = ensureRelativeUnderCwd(cwd, targetPath);
  const installed = listInstalledComponents(targetDir);
  const installedUilibs = listSubdirs(targetDir);
  const configuredUilibs = Array.isArray(source.repo?.uilibs) ? source.repo.uilibs : [];
  const orderedUilibs = [...new Set([...installedUilibs, ...configuredUilibs])];

  if (flags.all && positionals.length > 0) {
    const err = new Error("Cannot combine explicit components with --all.");
    err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
    throw err;
  }
  if (flags.all && !flags.repo) {
    const err = new Error("remove --all requires --repo.");
    err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
    throw err;
  }

  let componentsToRemove = [];
  if (flags.all) {
    componentsToRemove = installed;
  } else {
    componentsToRemove = [...new Set(positionals)].map((spec) => {
      const resolved = resolveInstalledComponentSpec(installed, orderedUilibs, spec, null);
      if (!resolved) {
        const err = new Error(`Component '${spec}' not found in target '${targetDir}'.`);
        err.exitCode = EXIT_CODES.SOURCE_GIT_NETWORK_ERROR;
        throw err;
      }
      return resolved;
    });
  }
  if (componentsToRemove.length === 0) {
    const err = new Error("remove requires components or --all.");
    err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
    throw err;
  }

  const removeKeys = componentsToRemove.map((component) => component.key);
  const dependents = findDependents(installed, orderedUilibs, removeKeys);
  const warnings = [];
  if (dependents.length > 0 && !flags.force) {
    const details = dependents.map((x) => `${x.component}->${x.dependsOn}`).join(", ");
    if (policy.onError === "warn") {
      warnings.push(`Reverse dependencies detected (${details}). Continuing due to warn policy.`);
    } else {
      const err = new Error(
        `Cannot remove components with reverse dependencies (${details}). Use --force to override.`
      );
      err.exitCode = EXIT_CODES.POLICY_FAIL_STOP;
      throw err;
    }
  }

  const items = [];
  const removedNpmDeps = collectRemovedNpmDeps(componentsToRemove);
  const remainingNpmDeps = collectRemainingNpmDeps(installed, removeKeys);
  const uninstallCandidates = removedNpmDeps.filter((dep) => !remainingNpmDeps.has(dep));
  const npmResult = await uninstallDependencies(cwd, uninstallCandidates, flags, policy);

  for (const component of componentsToRemove) {
    const dir = component.dir;
    if (flags.dryRun) {
      items.push({ action: "delete", target: path.relative(cwd, dir), status: "planned" });
      for (const parent of listEmptyParentsAfterRemove(dir, targetDir)) {
        items.push({
          action: "delete",
          target: path.relative(cwd, parent),
          status: "planned",
        });
      }
      continue;
    }
    const removed = removeComponentDirectory(dir);
    items.push({
      action: "delete",
      target: path.relative(cwd, dir),
      status: removed ? "applied" : "skipped",
    });
    if (removed) {
      for (const parent of pruneEmptyParentDirectories(dir, targetDir)) {
        items.push({
          action: "delete",
          target: path.relative(cwd, parent),
          status: "applied",
        });
      }
    }
  }
  for (const pkg of uninstallCandidates) {
    items.push({
      action: "uninstall",
      target: pkg,
      status: npmResult.removed.includes(pkg) ? "applied" : "planned",
    });
  }
  if (npmResult.skipped.length > 0) {
    warnings.push(`Npm uninstall skipped for: ${npmResult.skipped.join(", ")}`);
  }

  return createReport({
    command: "remove",
    ok: true,
    exitCode: EXIT_CODES.SUCCESS,
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

module.exports = { runRemove };
