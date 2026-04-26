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
  fs.cpSync(sourceDir, targetDir, { recursive: true, force: true });
}

function removeComponentDirectory(targetDir) {
  if (!fs.existsSync(targetDir)) return false;
  fs.rmSync(targetDir, { recursive: true, force: true });
  return true;
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
  removeComponentDirectory,
};
