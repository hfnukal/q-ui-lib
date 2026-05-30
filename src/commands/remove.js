const fs = require("node:fs");
const path = require("node:path");
const { readConfig } = require("../services/config");
const { createReport } = require("../services/report");
const {
  ensureRelativeUnderCwd,
  listEmptyParentsAfterRemove,
  pruneEmptyParentDirectories,
  removeComponentDirectory,
} = require("../services/component-files");
const { uninstallDependencies } = require("../services/npm-dependencies");
const { resolvePolicy } = require("../services/policy");
const {
  confirmYesNo,
  isInteractiveTerminal,
  nonInteractiveAskError,
  userRejected,
} = require("../services/interactive");
const {
  listInstalledComponents,
  listSubdirs,
  resolveInstalledComponentSpec,
} = require("../services/installed-components");
const { EXIT_CODES } = require("../constants");

function usageError(message) {
  const err = new Error(message);
  err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
  throw err;
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

function parseRemoveAllUilib(spec) {
  const parts = String(spec || "").trim().split("/").filter(Boolean);
  if (parts.length !== 1) {
    usageError("remove --all scope must be a uilib name (e.g. remove --all web).");
  }
  return parts[0];
}

async function confirmRemove(componentsToRemove, flags) {
  if (flags.dryRun || flags.yes || flags.force || flags.auto) return;
  if (!isInteractiveTerminal()) {
    throw nonInteractiveAskError("remove requires confirmation.");
  }
  const keys = componentsToRemove.map((component) => component.key).join(", ");
  const ok = await confirmYesNo(
    `Remove ${componentsToRemove.length} component(s): ${keys}?`
  );
  if (!ok) {
    throw userRejected("Declined remove operation.");
  }
}

async function runRemove(context) {
  const { cwd, flags, positionals } = context;
  const { config } = readConfig(cwd);
  const policy = resolvePolicy(flags, config.policy);
  const targetPath = flags.targetPath || config.targetPath;
  const targetDir = ensureRelativeUnderCwd(cwd, targetPath);
  const installed = listInstalledComponents(targetDir);
  const installedUilibs = listSubdirs(targetDir);
  const configuredUilibs = Object.values(config.repos || {}).flatMap((repo) => repo.uilibs || []);
  const orderedUilibs = [...new Set([...installedUilibs, ...configuredUilibs])];

  let componentsToRemove = [];

  if (flags.all) {
    if (positionals.length !== 1) {
      usageError("remove --all requires exactly one uilib argument (e.g. remove --all web).");
    }
    const uilib = parseRemoveAllUilib(positionals[0]);
    componentsToRemove = installed.filter((component) => component.uilib === uilib);
    if (componentsToRemove.length === 0) {
      usageError(`No installed components found in uilib '${uilib}'.`);
    }
  } else {
    if (positionals.length === 0) {
      usageError("remove requires <uilib>/<component>... or <uilib> --all.");
    }
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

  await confirmRemove(componentsToRemove, flags);

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
