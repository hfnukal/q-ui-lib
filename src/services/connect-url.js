const path = require("node:path");
const { EXIT_CODES } = require("../constants");
const { usageError } = require("../parser");

const GIT_URL_PATTERN =
  /^(https?:\/\/.+|ssh:\/\/.+|git@.+:.+)(#.+)?$/;

const GITHUB_TREE_PATTERN =
  /^https?:\/\/github\.com\/([^/]+)\/([^/]+)\/tree\/([^/]+)(?:\/(.*))?$/;

const GITLAB_TREE_PATTERN =
  /^https?:\/\/gitlab\.com\/([^/]+)\/([^/]+)\/-\/tree\/([^/]+)(?:\/(.*))?$/;

function validateUrl(url) {
  return /^(file:\/\/.+|https?:\/\/.+|ssh:\/\/.+|git@.+:.+)(#.+)?$/.test(url);
}

function resolveFileSourcePath(cwd, fileUrl) {
  const filePath = fileUrl.replace(/^file:\/\//, "");
  if (path.isAbsolute(filePath)) {
    return path.resolve(filePath);
  }
  return path.resolve(cwd, filePath);
}

function toFileUrl(absPath) {
  const normalized = path.resolve(absPath);
  return `file://${normalized}`;
}

function gitRepoNameFromRemoteUrl(remoteUrl) {
  const withoutGit = remoteUrl.replace(/\.git$/, "");
  const segment = withoutGit.split("/").pop() || withoutGit.split(":").pop() || "repo";
  return segment.replace(/\.git$/, "") || "repo";
}

function normalizeHostPermalink(inputUrl) {
  const github = inputUrl.match(GITHUB_TREE_PATTERN);
  if (github) {
    const [, owner, repo, ref, scope] = github;
    const remoteUrl = `https://github.com/${owner}/${repo.replace(/\.git$/, "")}.git`;
    return {
      sourceKind: "git",
      remoteUrl,
      ref,
      storedGitUrl: `${remoteUrl}#${ref}`,
      permalinkScope: scope ? scope.replace(/\/$/, "") : null,
    };
  }

  const gitlab = inputUrl.match(GITLAB_TREE_PATTERN);
  if (gitlab) {
    const [, owner, repo, ref, scope] = gitlab;
    const remoteUrl = `https://gitlab.com/${owner}/${repo.replace(/\.git$/, "")}.git`;
    return {
      sourceKind: "git",
      remoteUrl,
      ref,
      storedGitUrl: `${remoteUrl}#${ref}`,
      permalinkScope: scope ? scope.replace(/\/$/, "") : null,
    };
  }

  return null;
}

/**
 * Parse connect `<url>` input into materialization hints.
 * @param {string} inputUrl
 * @param {string} cwd
 */
function parseConnectInput(inputUrl, cwd) {
  if (!inputUrl || inputUrl.startsWith("--")) {
    usageError("connect requires <url> as the first positional argument.");
  }

  const permalink = normalizeHostPermalink(inputUrl);
  if (permalink) {
    return permalink;
  }

  if (inputUrl.startsWith("file://")) {
    const absPath = resolveFileSourcePath(cwd, inputUrl);
    return {
      sourceKind: "file",
      remoteUrl: null,
      ref: null,
      storedGitUrl: null,
      permalinkScope: null,
      scanRootAbs: absPath,
      gitCloneRootAbs: null,
    };
  }

  if (!GIT_URL_PATTERN.test(inputUrl)) {
    usageError(
      `Unsupported connect URL '${inputUrl}'. Use file://, git clone URL, or GitHub/GitLab tree permalink.`
    );
  }

  const hashIndex = inputUrl.indexOf("#");
  const remoteUrl = hashIndex >= 0 ? inputUrl.slice(0, hashIndex) : inputUrl;
  const ref = hashIndex >= 0 ? inputUrl.slice(hashIndex + 1) : null;
  if (!validateUrl(inputUrl)) {
    usageError(`Unsupported connect URL '${inputUrl}'.`);
  }

  return {
    sourceKind: "git",
    remoteUrl,
    ref,
    storedGitUrl: ref ? `${remoteUrl}#${ref}` : remoteUrl,
    permalinkScope: null,
    scanRootAbs: null,
    gitCloneRootAbs: null,
  };
}

module.exports = {
  gitRepoNameFromRemoteUrl,
  parseConnectInput,
  resolveFileSourcePath,
  toFileUrl,
  validateUrl,
};
