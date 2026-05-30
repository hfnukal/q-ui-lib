const fs = require("node:fs");
const path = require("node:path");
const { usageError } = require("../parser");
const { createGitWorkspace } = require("./source-workspace");
const {
  gitRepoNameFromRemoteUrl,
  parseConnectInput,
  toFileUrl,
} = require("./connect-url");

function isDirectory(dirPath) {
  try {
    return fs.existsSync(dirPath) && fs.statSync(dirPath).isDirectory();
  } catch {
    return false;
  }
}

function listImmediateSubdirs(dirPath) {
  if (!isDirectory(dirPath)) return [];
  return fs
    .readdirSync(dirPath)
    .filter((name) => isDirectory(path.join(dirPath, name)));
}

function hasRootIndex(componentDir) {
  return (
    fs.existsSync(path.join(componentDir, "index.tsx")) ||
    fs.existsSync(path.join(componentDir, "index.ts")) ||
    fs.existsSync(path.join(componentDir, "meta.generated.json"))
  );
}

function scanUilibs(componentsDirAbs) {
  const uilibs = [];
  const warnings = [];
  for (const name of listImmediateSubdirs(componentsDirAbs)) {
    const uilibDir = path.join(componentsDirAbs, name);
    const childNames = listImmediateSubdirs(uilibDir);
    const hasComponent = childNames.some((child) => hasRootIndex(path.join(uilibDir, child)));
    if (hasComponent) {
      uilibs.push(name);
    } else if (childNames.length > 0 || fs.readdirSync(uilibDir).length > 0) {
      warnings.push(`Uilib directory '${name}' has no qualifying components and was excluded.`);
    }
  }
  return { uilibs: uilibs.sort(), warnings };
}

function deriveRepoId(dirAbs, depth, gitCloneRootAbs, gitRemoteUrl) {
  if (depth === 0 && gitCloneRootAbs && path.resolve(dirAbs) === path.resolve(gitCloneRootAbs)) {
    return gitRepoNameFromRemoteUrl(gitRemoteUrl || path.basename(dirAbs));
  }
  return path.basename(dirAbs);
}

function posixRelative(fromAbs, toAbs) {
  return path.relative(fromAbs, toAbs).split(path.sep).join("/");
}

/**
 * Discover repo candidates under scan root R within depth N.
 * @param {string} scanRootAbs
 * @param {object} options
 */
function discoverRepos(scanRootAbs, options) {
  const {
    searchLevels,
    componentsDirName,
    gitCloneRootAbs = null,
    sourceKind,
    storedGitUrl = null,
    gitRemoteUrl = null,
  } = options;

  if (!isDirectory(scanRootAbs)) {
    usageError(`Connect URL resolves to a missing directory: ${scanRootAbs}`);
  }

  const byRoot = new Map();
  const allWarnings = [];

  function consider(dirAbs, depth, relativeFromScanRoot) {
    if (depth > searchLevels) return;

    const componentsDirAbs = path.join(dirAbs, componentsDirName);
    if (isDirectory(componentsDirAbs)) {
      const { uilibs, warnings } = scanUilibs(componentsDirAbs);
      allWarnings.push(...warnings);

      const componentsRoot =
        sourceKind === "git" && gitCloneRootAbs
          ? posixRelative(gitCloneRootAbs, componentsDirAbs)
          : "components";
      const storedUrl =
        sourceKind === "git" ? storedGitUrl : toFileUrl(dirAbs);

      const candidate = {
        id: deriveRepoId(dirAbs, depth, gitCloneRootAbs, gitRemoteUrl),
        repoRootAbs: dirAbs,
        componentsDirAbs,
        componentsRoot,
        storedUrl,
        uilibs,
        relativePath: relativeFromScanRoot === "." ? "." : relativeFromScanRoot,
      };

      const key = path.resolve(dirAbs);
      if (!byRoot.has(key)) {
        byRoot.set(key, candidate);
      }
    }

    if (depth >= searchLevels) return;
    for (const child of listImmediateSubdirs(dirAbs)) {
      const childAbs = path.join(dirAbs, child);
      const childRelative =
        relativeFromScanRoot === "."
          ? child
          : path.posix.join(relativeFromScanRoot.replace(/\\/g, "/"), child);
      consider(childAbs, depth + 1, childRelative);
    }
  }

  consider(scanRootAbs, 0, ".");

  const candidates = [...byRoot.values()].sort((a, b) => {
    const pathCmp = a.relativePath.localeCompare(b.relativePath);
    if (pathCmp !== 0) return pathCmp;
    return a.id.localeCompare(b.id);
  });

  return { candidates, warnings: allWarnings };
}

function parseSearchLevels(value) {
  if (value === undefined || value === null || value === "") {
    return 2;
  }
  const parsed = Number.parseInt(String(value), 10);
  if (!Number.isInteger(parsed) || parsed < 0) {
    usageError("--search-levels must be a non-negative integer.");
  }
  return parsed;
}

function matchRepoCandidate(candidates, selector) {
  const trimmed = String(selector || "").trim();
  if (!trimmed) {
    usageError("Repo selector must be a non-empty string.");
  }

  const byId = candidates.filter((c) => c.id === trimmed);
  if (byId.length === 1) return byId[0];
  if (byId.length > 1) {
    usageError(`Repo id '${trimmed}' is ambiguous. Candidates: ${byId.map((c) => c.id).join(", ")}`);
  }

  const byRelative = candidates.filter((c) => {
    const rel = c.relativePath.replace(/\\/g, "/");
    return rel === trimmed || rel.endsWith(`/${trimmed}`) || c.id === trimmed;
  });
  if (byRelative.length === 1) return byRelative[0];

  const suffixMatches = candidates.filter((c) => {
    const rel = c.relativePath.replace(/\\/g, "/");
    return rel.endsWith(`/${trimmed}`) || rel === trimmed || c.repoRootAbs.endsWith(path.sep + trimmed);
  });
  if (suffixMatches.length === 1) return suffixMatches[0];

  const hint = candidates.map((c) => `${c.id} (${c.relativePath})`).join(", ");
  usageError(`Unknown repo '${trimmed}'. Discovered: ${hint || "(none)"}`);
}

function buildDiscoveryReport(inputUrl, searchLevels, candidates, selectedId = null) {
  return {
    url: inputUrl,
    searchLevels,
    repos: candidates.map((c) => ({
      id: c.id,
      componentsRoot: c.componentsRoot,
      uilibs: c.uilibs,
      selected: selectedId != null && c.id === selectedId,
    })),
  };
}

/**
 * Materialize source tree and run discovery.
 * Caller must invoke cleanup() when done.
 */
function materializeAndDiscover(cwd, inputUrl, options) {
  const parsed = parseConnectInput(inputUrl, cwd);
  const searchLevels = parseSearchLevels(options.searchLevels);
  const componentsDirName = options.componentsDirName || "components";

  if (parsed.sourceKind === "file") {
    const scanRootAbs = parsed.scanRootAbs;
    const result = discoverRepos(scanRootAbs, {
      searchLevels,
      componentsDirName,
      sourceKind: "file",
    });
    return {
      inputUrl,
      searchLevels,
      scanRootAbs,
      cleanup: () => {},
      ...result,
    };
  }

  const workspace = createGitWorkspace(parsed.remoteUrl, parsed.ref);
  const gitCloneRootAbs = workspace.rootPath;
  let scanRootAbs = gitCloneRootAbs;
  if (parsed.permalinkScope) {
    scanRootAbs = path.join(gitCloneRootAbs, parsed.permalinkScope);
  }

  try {
    const result = discoverRepos(scanRootAbs, {
      searchLevels,
      componentsDirName,
      gitCloneRootAbs,
      sourceKind: "git",
      storedGitUrl: parsed.storedGitUrl,
      gitRemoteUrl: parsed.remoteUrl,
    });
    return {
      inputUrl,
      searchLevels,
      scanRootAbs,
      cleanup: () => workspace.cleanup(),
      ...result,
    };
  } catch (error) {
    workspace.cleanup();
    throw error;
  }
}

module.exports = {
  buildDiscoveryReport,
  discoverRepos,
  hasRootIndex,
  matchRepoCandidate,
  materializeAndDiscover,
  parseSearchLevels,
  scanUilibs,
};
