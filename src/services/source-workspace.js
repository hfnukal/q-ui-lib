const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { runGitWithRetry } = require("./git");

function createGitWorkspace(remoteUrl, ref) {
  const tempRoot = fs.mkdtempSync(path.join(os.tmpdir(), "qui-client-src-"));
  runGitWithRetry(["clone", "--depth", "1", remoteUrl, tempRoot], { cwd: os.tmpdir() });
  if (ref) {
    runGitWithRetry(["fetch", "--depth", "1", "origin", ref], { cwd: tempRoot });
    runGitWithRetry(["checkout", ref], { cwd: tempRoot });
  }
  return {
    rootPath: tempRoot,
    cleanup: () => fs.rmSync(tempRoot, { recursive: true, force: true }),
  };
}

function prepareSourceWorkspace(source) {
  if (source.sourceType === "file") {
    return { rootPath: source.sourceRoot, cleanup: () => {} };
  }
  return createGitWorkspace(source.remoteUrl, source.ref);
}

module.exports = {
  prepareSourceWorkspace,
};
