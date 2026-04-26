const { spawnSync } = require("node:child_process");
const os = require("node:os");
const { EXIT_CODES } = require("../constants");

function runGit(args, options = {}) {
  const cwd = options.cwd ?? os.tmpdir();
  const result = spawnSync("git", args, {
    cwd,
    stdio: options.stdio ?? "pipe",
    encoding: options.encoding ?? "utf8",
  });
  if (result.status !== 0) {
    const msg = (result.stderr || result.stdout || "").trim() || `git ${args.join(" ")} failed.`;
    const err = new Error(msg);
    err.exitCode = EXIT_CODES.SOURCE_GIT_NETWORK_ERROR;
    throw err;
  }
  return result;
}

function runGitWithRetry(args, options = {}) {
  try {
    return runGit(args, options);
  } catch (firstError) {
    const message = String(firstError.message || "");
    const looksTransient =
      /timed out|temporary|TLS|network|ECONN|Connection reset|could not resolve host/i.test(
        message
      );
    if (!looksTransient) {
      throw firstError;
    }
    return runGit(args, options);
  }
}

module.exports = {
  runGit,
  runGitWithRetry,
};
