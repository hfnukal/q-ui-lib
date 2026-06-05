const fs = require("node:fs");
const path = require("node:path");
const { EXIT_CODES } = require("../constants");
const { resolveSourceContext } = require("./source-resolver");
const { prepareSourceWorkspace } = require("./source-workspace");
const { syncTemplateToProject } = require("./template-sync");

const SECTION_KEYWORDS = new Set(["components", "templates", "routes"]);

function usageError(message) {
  const err = new Error(message);
  err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
  throw err;
}

function notFoundError(spec, kind) {
  const err = new Error(`${kind} source '${spec}' not found in configured repositories.`);
  err.exitCode = EXIT_CODES.SOURCE_GIT_NETWORK_ERROR;
  return err;
}

/**
 * @param {string} spec repo/uilib/folder or repo/uilib/folder/subpath...
 */
function parseUilibPackSpec(spec) {
  const parts = String(spec)
    .split("/")
    .map((p) => p.trim())
    .filter(Boolean);
  if (parts.length < 3) {
    usageError(
      `Invalid pack spec '${spec}'. Expected <repo>/<uilib>/<folder> or <repo>/<uilib>/<folder>/<subpath...>.`
    );
  }
  return {
    repo: parts[0],
    uilib: parts[1],
    folder: parts[2],
    subpath: parts.length > 3 ? parts.slice(3).join("/") : null,
    spec,
  };
}

function isUilibPackSpec(spec) {
  return String(spec).split("/").filter(Boolean).length >= 3;
}

function isSectionKeyword(spec) {
  return SECTION_KEYWORDS.has(String(spec).trim().toLowerCase());
}

function resolvePackSourceDir(cwd, config, parsed, packKind) {
  const subdir = packKind === "routes" ? "routes" : "template";
  const source = resolveSourceContext(cwd, config, parsed.repo);
  if (!source.repo.uilibs.includes(parsed.uilib)) {
    const err = new Error(
      `uilib '${parsed.uilib}' is not configured for repo '${parsed.repo}' in qui.config.json.`
    );
    err.exitCode = EXIT_CODES.CONFIG_SCHEMA_ERROR;
    throw err;
  }
  const workspace = prepareSourceWorkspace(source);
  try {
    const packRoot = path.join(
      workspace.rootPath,
      source.repo.componentsRoot,
      parsed.uilib,
      parsed.folder,
      subdir
    );
    const sourceDir = parsed.subpath ? path.join(packRoot, parsed.subpath) : packRoot;
    if (!fs.existsSync(sourceDir)) {
      throw notFoundError(parsed.spec, packKind === "routes" ? "Routes" : "Template");
    }
    return { source, workspace, sourceDir, packRoot };
  } catch (error) {
    workspace.cleanup();
    throw error;
  }
}

async function syncUilibPack({
  cwd,
  config,
  spec,
  packKind,
  targetRoot,
  targetSubpath,
  policy,
  flags,
}) {
  const parsed = parseUilibPackSpec(spec);
  const { workspace, sourceDir } = resolvePackSourceDir(cwd, config, parsed, packKind);
  const targetDir = targetSubpath ? path.join(targetRoot, targetSubpath) : targetRoot;
  try {
    const { items, warnings } = await syncTemplateToProject({
      templateRoot: sourceDir,
      targetRoot: targetDir,
      policy,
      flags,
    });
    return {
      items: items.map((item) => ({
        ...item,
        target: path.join(path.relative(cwd, targetDir), item.target),
      })),
      warnings,
      packSpec: parsed.spec,
      sourceDir,
      targetDir,
    };
  } finally {
    workspace.cleanup();
  }
}

module.exports = {
  SECTION_KEYWORDS,
  isSectionKeyword,
  isUilibPackSpec,
  parseUilibPackSpec,
  syncUilibPack,
};
