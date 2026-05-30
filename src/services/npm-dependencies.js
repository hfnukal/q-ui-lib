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

function runInstall(cwd, missing) {
  const manager = detectPackageManager(cwd);
  const commandByManager = {
    npm: ["install", ...missing],
    pnpm: ["add", ...missing],
    yarn: ["add", ...missing],
    bun: ["add", ...missing],
  };
  const args = commandByManager[manager] || commandByManager.npm;
  const result = spawnSync(manager, args, { cwd, stdio: "inherit" });
  if (result.status !== 0) {
    const err = new Error(`Failed to install npm dependencies via ${manager}.`);
    err.exitCode = EXIT_CODES.DEPENDENCY_INSTALL_ERROR;
    throw err;
  }
  return { missing, installed: missing, skipped: [] };
}

async function installMissingDependencies(cwd, packages, flags, policy = {}) {
  const existing = readExistingPackages(cwd);
  const missing = packages.filter((pkg) => !existing.has(pkg));
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

  if (forceInstall || autoInstall || yesInstall) {
    return runInstall(cwd, missing);
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
  return runInstall(cwd, missing);
}

function runUninstall(cwd, toRemove) {
  const manager = detectPackageManager(cwd);
  const commandByManager = {
    npm: ["uninstall", ...toRemove],
    pnpm: ["remove", ...toRemove],
    yarn: ["remove", ...toRemove],
    bun: ["remove", ...toRemove],
  };
  const args = commandByManager[manager] || commandByManager.npm;
  const result = spawnSync(manager, args, { cwd, stdio: "inherit" });
  if (result.status !== 0) {
    const err = new Error(`Failed to uninstall npm dependencies via ${manager}.`);
    err.exitCode = EXIT_CODES.DEPENDENCY_INSTALL_ERROR;
    throw err;
  }
  return { removed: toRemove, skipped: [] };
}

async function uninstallDependencies(cwd, packages, flags, policy = {}) {
  const existing = readExistingPackages(cwd);
  const toRemove = packages.filter((pkg) => existing.has(pkg));
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

  if (forceUn || autoUn || yesUn) {
    return runUninstall(cwd, toRemove);
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
  return runUninstall(cwd, toRemove);
}

module.exports = {
  installMissingDependencies,
  readExistingPackages,
  uninstallDependencies,
};
