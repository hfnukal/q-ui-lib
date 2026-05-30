const fs = require("node:fs");
const path = require("node:path");
const { EXIT_CODES } = require("../constants");
const { parseLocalComponentSpec } = require("./component-catalog");
const { parseRepoSelector } = require("./source-resolver");
const { ensureRelativeUnderCwd } = require("./component-files");
const {
  listInstalledComponents,
  listSubdirs,
  resolveInstalledComponentSpec,
  toComponentKey,
} = require("./installed-components");

function reposWithUilib(config, uilibName) {
  return Object.keys(config.repos || {}).filter((repoName) =>
    (config.repos[repoName].uilibs || []).includes(uilibName)
  );
}

function findRepoForPush(config, uilib, explicitRepo, flagsRepo) {
  const parsedFlags = flagsRepo ? parseRepoSelector(flagsRepo) : { repo: null, uilib: null };
  const preferredRepo = explicitRepo || parsedFlags.repo || null;
  const matches = reposWithUilib(config, uilib);

  if (preferredRepo) {
    if (!config.repos[preferredRepo]) {
      const err = new Error(`Repo '${preferredRepo}' not found in config.`);
      err.exitCode = EXIT_CODES.CONFIG_SCHEMA_ERROR;
      throw err;
    }
    if (!matches.includes(preferredRepo)) {
      const err = new Error(
        `Uilib '${uilib}' is not listed for repo '${preferredRepo}' in qui.config.json.`
      );
      err.exitCode = EXIT_CODES.CONFIG_SCHEMA_ERROR;
      throw err;
    }
    return preferredRepo;
  }

  const gitMatches = matches.filter((name) => !String(config.repos[name].url).startsWith("file://"));
  if (gitMatches.length === 1) return gitMatches[0];
  if (gitMatches.length > 1) {
    const err = new Error(
      `Uilib '${uilib}' exists in multiple git repos (${gitMatches.join(", ")}); use <repo>/${uilib}/<component> or --repo.`
    );
    err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
    throw err;
  }
  if (matches.length === 1) {
    const err = new Error(
      `push requires a git remote URL (https/ssh/git@), not file:// for repo '${matches[0]}'.`
    );
    err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
    throw err;
  }
  const err = new Error(`No repo configured for uilib '${uilib}'.`);
  err.exitCode = EXIT_CODES.CONFIG_SCHEMA_ERROR;
  throw err;
}

function resolvePushComponents(cwd, config, positionals, flags) {
  if (positionals.length === 0) {
    const err = new Error("push requires at least one component: [<repo>/][<uilib>/]<component>.");
    err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
    throw err;
  }

  const targetPath = flags.targetPath || config.targetPath;
  const targetDir = ensureRelativeUnderCwd(cwd, targetPath);
  const installed = listInstalledComponents(targetDir);
  const installedUilibs = listSubdirs(targetDir);
  const parsedFlags = flags.repo ? parseRepoSelector(flags.repo) : { repo: null, uilib: null };
  const configuredUilibs = parsedFlags.repo
    ? config.repos[parsedFlags.repo]?.uilibs || []
    : Object.values(config.repos || {}).flatMap((repo) => repo.uilibs || []);
  const orderedUilibs = [...new Set([parsedFlags.uilib, ...installedUilibs, ...configuredUilibs].filter(Boolean))];

  const resolved = [];
  for (const spec of [...new Set(positionals)]) {
    const parsed = parseLocalComponentSpec(spec, config);
    if (!parsed) continue;

    let component;
    if (parsed.kind === "triple") {
      const key = toComponentKey(parsed.uilib, parsed.slug);
      component = installed.find((entry) => entry.key === key) || null;
      if (!component) {
        const err = new Error(`Component '${spec}' not found in target '${targetPath}'.`);
        err.exitCode = EXIT_CODES.SOURCE_GIT_NETWORK_ERROR;
        throw err;
      }
    } else if (parsed.kind === "uilib-slug") {
      const key = toComponentKey(parsed.uilib, parsed.slug);
      component = installed.find((entry) => entry.key === key) || null;
      if (!component) {
        const err = new Error(`Component '${spec}' not found in target '${targetPath}'.`);
        err.exitCode = EXIT_CODES.SOURCE_GIT_NETWORK_ERROR;
        throw err;
      }
    } else {
      component = resolveInstalledComponentSpec(installed, orderedUilibs, parsed.slug, parsedFlags.uilib);
      if (!component) {
        const err = new Error(`Component '${spec}' not found in target '${targetPath}'.`);
        err.exitCode = EXIT_CODES.SOURCE_GIT_NETWORK_ERROR;
        throw err;
      }
    }

    const explicitRepo = parsed.kind === "triple" ? parsed.repo : null;
    const repoName = findRepoForPush(config, component.uilib, explicitRepo, flags.repo);
    resolved.push({
      spec,
      repoName,
      uilib: component.uilib,
      slug: component.slug,
      dir: component.dir,
      meta: component.meta,
      repoSelector: `${repoName}/${component.uilib}`,
    });
  }

  const repoNames = [...new Set(resolved.map((entry) => entry.repoName))];
  const uilibs = [...new Set(resolved.map((entry) => entry.uilib))];
  if (repoNames.length > 1 || uilibs.length > 1) {
    const err = new Error("push supports only one repo/uilib per invocation.");
    err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
    throw err;
  }

  return {
    targetPath,
    targetDir,
    repoName: repoNames[0],
    uilib: uilibs[0],
    repoSelector: `${repoNames[0]}/${uilibs[0]}`,
    components: resolved,
  };
}

module.exports = {
  resolvePushComponents,
  listInstalledComponents,
};
