const path = require("node:path");
const { readConfig } = require("../services/config");
const { resolveSourceContext } = require("../services/source-resolver");
const { prepareSourceWorkspace } = require("../services/source-workspace");
const { createReport } = require("../services/report");
const { EXIT_CODES } = require("../constants");
const {
  collectSeedsForAllScopedRepoUilib,
  collectSeedsForAllScopedUilib,
  expandDependencies,
  groupSeedKeysByRepo,
  listSlugsInUilibDir,
  notFoundError,
  orderedUilibsForRepoWideAll,
  parseAllScopeSpec,
  resolveSeedHitsFromPositionals,
  toComponentKey,
} = require("../services/component-catalog");

function formatRepoSelector(flagsRepo, seedHits) {
  if (flagsRepo) return flagsRepo;
  const repos = [...new Set(seedHits.map((h) => h.repoName))];
  if (repos.length === 1) return repos[0];
  return repos.join("|");
}

async function runList(context) {
  const { cwd, flags, positionals } = context;
  const { config } = readConfig(cwd);
  const targetPath = flags.targetPath || config.targetPath;

  if (flags.all && positionals.length > 1) {
    const err = new Error("list --all accepts at most one scope argument (<uilib> or <repo>/<uilib>).");
    err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
    throw err;
  }

  let seedHits;
  if (flags.all && positionals.length === 1) {
    const scope = parseAllScopeSpec(positionals[0]);
    if (scope.kind === "uilib") {
      seedHits = collectSeedsForAllScopedUilib(cwd, config, scope.uilib, flags.repo);
    } else {
      seedHits = collectSeedsForAllScopedRepoUilib(cwd, config, scope.repo, scope.uilib);
    }
    if (!seedHits || seedHits.length === 0) {
      throw notFoundError(positionals[0]);
    }
  } else if (flags.all) {
    const source = resolveSourceContext(cwd, config, flags.repo);
    const workspace = prepareSourceWorkspace(source);
    try {
      const componentsRootDir = path.join(workspace.rootPath, source.repo.componentsRoot);
      const uilibs = orderedUilibsForRepoWideAll(flags.repo, source);
      seedHits = uilibs.flatMap((uilib) =>
        listSlugsInUilibDir(componentsRootDir, uilib).map((slug) => ({
          repoName: source.repoName,
          uilib,
          slug,
          seedKey: toComponentKey(uilib, slug),
        }))
      );
    } finally {
      workspace.cleanup();
    }
    if (seedHits.length === 0) {
      const err = new Error("list --all found no components in the selected scope.");
      err.exitCode = EXIT_CODES.SOURCE_GIT_NETWORK_ERROR;
      throw err;
    }
  } else {
    if (positionals.length === 0) {
      const err = new Error("list requires at least one component or --all.");
      err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
      throw err;
    }
    seedHits = resolveSeedHitsFromPositionals(cwd, config, positionals, flags.repo);
  }

  const byRepo = groupSeedKeysByRepo(seedHits);
  const mergedComponents = [];
  const warnings = [];

  for (const [repoName, seedKeys] of byRepo) {
    const source = resolveSourceContext(cwd, config, repoName);
    const workspace = prepareSourceWorkspace(source);
    try {
      const componentsRootDir = path.join(workspace.rootPath, source.repo.componentsRoot);
      const orderedUilibs = source.repo.uilibs;
      const expanded = expandDependencies(componentsRootDir, orderedUilibs, seedKeys, repoName);
      mergedComponents.push(...expanded.components);
      const autoAdded = expanded.components.filter((c) => !expanded.explicitSeeds.has(c.key));
      if (autoAdded.length > 0) {
        warnings.push(
          `[${repoName}] Missing component dependencies were auto-added: ${autoAdded.map((x) => x.key).join(", ")}`
        );
      }
      if (expanded.unresolvedDeps.length > 0) {
        warnings.push(
          `[${repoName}] Some dependencies referenced in meta.generated.json were not found in source: ${expanded.unresolvedDeps.join(", ")}`
        );
      }
    } finally {
      workspace.cleanup();
    }
  }

  const lines = [
    ...new Set(mergedComponents.map((c) => `${c.repoName}/${c.uilib}/${c.slug}`)),
  ].sort();

  return createReport({
    command: "list",
    ok: true,
    exitCode: EXIT_CODES.SUCCESS,
    repoSelector: formatRepoSelector(flags.repo, seedHits),
    targetPath,
    summary: { lines: lines.length },
    items: [],
    warnings,
    footer: lines,
  });
}

module.exports = { runList };
