const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { EXIT_CODES } = require("../constants");
const {
  confirmYesNo,
  isInteractiveTerminal,
  nonInteractiveAskError,
  userRejected,
} = require("./interactive");

function detectPackageManager(cwd) {
  if (fs.existsSync(path.join(cwd, "pnpm-lock.yaml"))) return "pnpm";
  if (fs.existsSync(path.join(cwd, "yarn.lock"))) return "yarn";
  if (fs.existsSync(path.join(cwd, "bun.lockb"))) return "bun";
  if (fs.existsSync(path.join(cwd, "package-lock.json"))) return "npm";
  return "npm";
}

function readExistingPackages(cwd) {
  const packageJsonPath = path.join(cwd, "package.json");
  if (!fs.existsSync(packageJsonPath)) return new Set();
  const data = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  const all = new Set();
  for (const key of ["dependencies", "devDependencies", "peerDependencies", "optionalDependencies"]) {
    const group = data[key];
    if (group && typeof group === "object") {
      for (const pkg of Object.keys(group)) all.add(pkg);
    }
  }
  return all;
}

/** @param {string} spec */
function packageNameFromSpec(spec) {
  if (spec.startsWith("@")) {
    const parts = spec.split("/");
    return parts.length >= 2 ? `${parts[0]}/${parts[1]}` : spec;
  }
  return spec.split("@")[0] || spec;
}

/**
 * @param {string[]} packages
 * @param {{ dev?: boolean }} [options]
 */
function runInstall(cwd, packages, options = {}) {
  const { dev = false } = options;
  const manager = detectPackageManager(cwd);
  const devFlag = dev ? (manager === "npm" ? ["--save-dev"] : ["-D"]) : [];
  const commandByManager = {
    npm: ["install", ...devFlag, ...packages],
    pnpm: ["add", ...devFlag, ...packages],
    yarn: ["add", ...devFlag, ...packages],
    bun: ["add", ...(dev ? ["-d"] : []), ...packages],
  };
  const args = commandByManager[manager] || commandByManager.npm;
  const result = spawnSync(manager, args, { cwd, stdio: "inherit" });
  if (result.status !== 0) {
    const err = new Error(`Failed to install npm dependencies via ${manager}.`);
    err.exitCode = EXIT_CODES.DEPENDENCY_INSTALL_ERROR;
    throw err;
  }
  return packages;
}

/**
 * @param {string | string[] | { dependencies?: string[], devDependencies?: string[] }} packagesOrGroups
 */
function normalizeInstallGroups(packagesOrGroups) {
  if (Array.isArray(packagesOrGroups)) {
    return {
      dependencies: [...packagesOrGroups],
      devDependencies: [],
    };
  }
  if (typeof packagesOrGroups === "string") {
    return { dependencies: [packagesOrGroups], devDependencies: [] };
  }
  return {
    dependencies: Array.isArray(packagesOrGroups.dependencies) ? packagesOrGroups.dependencies : [],
    devDependencies: Array.isArray(packagesOrGroups.devDependencies)
      ? packagesOrGroups.devDependencies
      : [],
  };
}

async function installMissingDependencies(cwd, packagesOrGroups, flags, policy = {}) {
  const groups = normalizeInstallGroups(packagesOrGroups);
  const existing = readExistingPackages(cwd);
  const missingProd = groups.dependencies.filter((pkg) => !existing.has(packageNameFromSpec(pkg)));
  const missingDev = groups.devDependencies.filter((pkg) => !existing.has(packageNameFromSpec(pkg)));
  const missing = [...missingProd, ...missingDev];
  if (missing.length === 0) {
    return { missing: [], installed: [], skipped: [] };
  }

  if (flags.dryRun) {
    return { missing, installed: [], skipped: missing };
  }

  const mode = policy.npmInstallMode || "ask";
  const forceInstall = Boolean(flags.force || mode === "force");
  const autoInstall = Boolean(flags.auto || mode === "auto");
  const yesInstall = Boolean(flags.yes);

  const doInstall = async () => {
    const installed = [];
    if (missingProd.length > 0) {
      installed.push(...runInstall(cwd, missingProd, { dev: false }));
    }
    if (missingDev.length > 0) {
      installed.push(...runInstall(cwd, missingDev, { dev: true }));
    }
    return { missing, installed, skipped: [] };
  };

  if (forceInstall || autoInstall || yesInstall) {
    return doInstall();
  }

  if (mode !== "ask") {
    return { missing, installed: [], skipped: missing };
  }

  if (policy.interactive === false || !isInteractiveTerminal()) {
    throw nonInteractiveAskError("npm install requires confirmation.");
  }
  const ok = await confirmYesNo(`Install missing packages: ${missing.join(", ")}?`, true);
  if (!ok) {
    throw userRejected("Declined npm install.");
  }
  return doInstall();
}

/**
 * @param {string[]} packages
 * @param {{ dev?: boolean }} [options]
 */
function runUninstall(cwd, packages, options = {}) {
  const { dev = false } = options;
  const manager = detectPackageManager(cwd);
  const devFlag = dev ? (manager === "npm" ? ["--save-dev"] : ["-D"]) : [];
  const commandByManager = {
    npm: ["uninstall", ...devFlag, ...packages],
    pnpm: ["remove", ...devFlag, ...packages],
    yarn: ["remove", ...devFlag, ...packages],
    bun: ["remove", ...(dev ? ["-d"] : []), ...packages],
  };
  const args = commandByManager[manager] || commandByManager.npm;
  const result = spawnSync(manager, args, { cwd, stdio: "inherit" });
  if (result.status !== 0) {
    const err = new Error(`Failed to uninstall npm dependencies via ${manager}.`);
    err.exitCode = EXIT_CODES.DEPENDENCY_INSTALL_ERROR;
    throw err;
  }
  return packages;
}

function readPackagesBySection(cwd) {
  const packageJsonPath = path.join(cwd, "package.json");
  const prod = new Set();
  const dev = new Set();
  if (!fs.existsSync(packageJsonPath)) return { prod, dev };
  const data = JSON.parse(fs.readFileSync(packageJsonPath, "utf8"));
  for (const key of ["dependencies", "peerDependencies", "optionalDependencies"]) {
    const group = data[key];
    if (group && typeof group === "object") {
      for (const pkg of Object.keys(group)) prod.add(pkg);
    }
  }
  const devGroup = data.devDependencies;
  if (devGroup && typeof devGroup === "object") {
    for (const pkg of Object.keys(devGroup)) dev.add(pkg);
  }
  return { prod, dev };
}

/**
 * @param {string | string[] | { dependencies?: string[], devDependencies?: string[] }} packagesOrGroups
 */
function normalizeUninstallGroups(packagesOrGroups) {
  if (Array.isArray(packagesOrGroups)) {
    return { dependencies: [...packagesOrGroups], devDependencies: [] };
  }
  if (typeof packagesOrGroups === "string") {
    return { dependencies: [packagesOrGroups], devDependencies: [] };
  }
  return {
    dependencies: Array.isArray(packagesOrGroups.dependencies) ? packagesOrGroups.dependencies : [],
    devDependencies: Array.isArray(packagesOrGroups.devDependencies)
      ? packagesOrGroups.devDependencies
      : [],
  };
}

async function uninstallDependencies(cwd, packagesOrGroups, flags, policy = {}) {
  const groups = normalizeUninstallGroups(packagesOrGroups);
  const { prod, dev } = readPackagesBySection(cwd);
  const toRemoveProd = groups.dependencies
    .map(packageNameFromSpec)
    .filter((pkg) => prod.has(pkg));
  const toRemoveDev = groups.devDependencies
    .map(packageNameFromSpec)
    .filter((pkg) => dev.has(pkg));
  const toRemove = [...toRemoveProd, ...toRemoveDev];
  if (toRemove.length === 0) {
    return { removed: [], skipped: [] };
  }

  if (flags.dryRun) {
    return { removed: [], skipped: toRemove };
  }

  const mode = policy.npmInstallMode || "ask";
  const forceUn = Boolean(flags.force || mode === "force");
  const autoUn = Boolean(flags.auto || mode === "auto");
  const yesUn = Boolean(flags.yes);

  const doUninstall = () => {
    const removed = [];
    if (toRemoveProd.length > 0) {
      removed.push(...runUninstall(cwd, toRemoveProd, { dev: false }));
    }
    if (toRemoveDev.length > 0) {
      removed.push(...runUninstall(cwd, toRemoveDev, { dev: true }));
    }
    return { removed, skipped: [] };
  };

  if (forceUn || autoUn || yesUn) {
    return doUninstall();
  }

  if (mode !== "ask") {
    return { removed: [], skipped: toRemove };
  }

  if (policy.interactive === false || !isInteractiveTerminal()) {
    throw nonInteractiveAskError("npm uninstall requires confirmation.");
  }
  const ok = await confirmYesNo(`Remove unused npm packages: ${toRemove.join(", ")}?`);
  if (!ok) {
    throw userRejected("Declined npm uninstall.");
  }
  return doUninstall();
}

module.exports = {
  installMissingDependencies,
  packageNameFromSpec,
  readExistingPackages,
  readPackagesBySection,
  uninstallDependencies,
};
