const fs = require("node:fs");
const path = require("node:path");
const { EXIT_CODES } = require("../constants");

function ensureRelativeUnderCwd(cwd, relativePath) {
  if (path.isAbsolute(relativePath)) {
    const err = new Error("targetPath must be relative.");
    err.exitCode = EXIT_CODES.CONFIG_SCHEMA_ERROR;
    throw err;
  }
  const resolved = path.resolve(cwd, relativePath);
  const normalizedCwd = path.resolve(cwd) + path.sep;
  if (!(resolved + path.sep).startsWith(normalizedCwd)) {
    const err = new Error("Resolved targetPath is outside application root.");
    err.exitCode = EXIT_CODES.SCOPE_SAFETY_VIOLATION;
    throw err;
  }
  const realCwd = fs.realpathSync(path.resolve(cwd));
  const realResolved = fs.existsSync(resolved)
    ? fs.realpathSync(resolved)
    : path.resolve(path.dirname(resolved));
  const normalized = realCwd + path.sep;
  if (!(realResolved + path.sep).startsWith(normalized)) {
    const err = new Error("Resolved path escapes application root via symlink.");
    err.exitCode = EXIT_CODES.SCOPE_SAFETY_VIOLATION;
    throw err;
  }
  return resolved;
}

function copyComponentDirectory(sourceDir, targetDir) {
  fs.mkdirSync(path.dirname(targetDir), { recursive: true });
  if (fs.existsSync(targetDir)) {
    fs.rmSync(targetDir, { recursive: true, force: true });
  }
  fs.cpSync(sourceDir, targetDir, { recursive: true, force: true });
}

function removeComponentDirectory(targetDir) {
  if (!fs.existsSync(targetDir)) return false;
  fs.rmSync(targetDir, { recursive: true, force: true });
  return true;
}

function listEmptyParentsAfterRemove(removedDir, boundaryDir) {
  const boundary = path.resolve(boundaryDir);
  const removedRoot = path.resolve(removedDir);
  const excluded = new Set([removedRoot]);
  const toPrune = [];
  let current = path.dirname(removedRoot);

  while (current !== boundary && (current + path.sep).startsWith(boundary + path.sep)) {
    if (!fs.existsSync(current)) break;
    const entries = fs.readdirSync(current);
    const hasKept = entries.some((name) => {
      const entryPath = path.join(current, name);
      for (const excludedPath of excluded) {
        if (entryPath === excludedPath || entryPath.startsWith(excludedPath + path.sep)) {
          return false;
        }
      }
      return true;
    });
    if (hasKept) break;
    toPrune.push(current);
    excluded.add(current);
    current = path.dirname(current);
  }
  return toPrune;
}

function pruneEmptyParentDirectories(removedDir, boundaryDir) {
  const boundary = path.resolve(boundaryDir);
  const pruned = [];
  let current = path.dirname(path.resolve(removedDir));

  while (current !== boundary && (current + path.sep).startsWith(boundary + path.sep)) {
    if (!fs.existsSync(current)) break;
    if (fs.readdirSync(current).length > 0) break;
    fs.rmdirSync(current);
    pruned.push(current);
    current = path.dirname(current);
  }
  return pruned;
}

function assertNoCaseInsensitiveCollision(baseDir, slug) {
  if (!fs.existsSync(baseDir)) return;
  const lower = slug.toLowerCase();
  const collisions = fs.readdirSync(baseDir).filter((entry) => entry.toLowerCase() === lower);
  if (collisions.length > 0 && !collisions.includes(slug)) {
    const err = new Error(
      `Case-insensitive slug collision for '${slug}' with existing '${collisions[0]}'.`
    );
    err.exitCode = EXIT_CODES.POLICY_FAIL_STOP;
    throw err;
  }
}

module.exports = {
  assertNoCaseInsensitiveCollision,
  copyComponentDirectory,
  ensureRelativeUnderCwd,
  listEmptyParentsAfterRemove,
  pruneEmptyParentDirectories,
  removeComponentDirectory,
};
