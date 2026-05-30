const path = require("node:path");
const { EXIT_CODES } = require("../constants");

function parseRepoSelector(selector) {
  if (!selector) return { repo: null, uilib: null };
  const parts = String(selector).split("/");
  if (parts.length === 1 && parts[0]) {
    return { repo: parts[0], uilib: null };
  }
  if (parts.length === 2 && parts[0] && parts[1]) {
    return { repo: parts[0], uilib: parts[1] };
  }
  const err = new Error("Invalid --repo selector. Use <repo> or <repo>/<uilib>.");
  err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
  throw err;
}

function splitUrlAndRef(url) {
  const [remoteUrl, ref] = String(url).split("#");
  return { remoteUrl, ref: ref || null };
}

function resolveFileSourcePath(cwd, fileUrl) {
  const filePath = fileUrl.replace(/^file:\/\//, "");
  if (path.isAbsolute(filePath)) {
    return filePath;
  }
  return path.resolve(cwd, filePath);
}

function resolveRepo(config, repoSelector) {
  const names = Object.keys(config.repos || {});
  if (names.length === 0) {
    const err = new Error("No repos configured.");
    err.exitCode = EXIT_CODES.CONFIG_SCHEMA_ERROR;
    throw err;
  }

  const parsedSelector = parseRepoSelector(repoSelector);
  const repoName = parsedSelector.repo || names[0];
  const repo = config.repos[repoName];
  if (!repo) {
    const err = new Error(`Repo '${repoName}' not found in config.`);
    err.exitCode = EXIT_CODES.CONFIG_SCHEMA_ERROR;
    throw err;
  }
  return { repoName, uilib: parsedSelector.uilib, repo };
}

function resolveSourceContext(cwd, config, repoSelector) {
  const resolved = resolveRepo(config, repoSelector);
  const { remoteUrl, ref } = splitUrlAndRef(resolved.repo.url);
  const uilib = resolved.uilib || resolved.repo.uilibs[0];
  if (!uilib) {
    const err = new Error(`Repo '${resolved.repoName}' does not define any uilib.`);
    err.exitCode = EXIT_CODES.CONFIG_SCHEMA_ERROR;
    throw err;
  }
  return {
    ...resolved,
    ref,
    sourceType: remoteUrl.startsWith("file://") ? "file" : "git",
    remoteUrl,
    sourceRoot:
      remoteUrl.startsWith("file://") ? resolveFileSourcePath(cwd, remoteUrl) : null,
    targetUilib: uilib,
    componentsSubpath: path.join(resolved.repo.componentsRoot, uilib),
    componentsDir:
      remoteUrl.startsWith("file://")
        ? path.join(resolveFileSourcePath(cwd, remoteUrl), resolved.repo.componentsRoot, uilib)
        : null,
  };
}

module.exports = {
  parseRepoSelector,
  resolveRepo,
  resolveSourceContext,
  splitUrlAndRef,
};
