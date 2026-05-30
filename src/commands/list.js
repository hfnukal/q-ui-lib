const fs = require("node:fs");
const path = require("node:path");
const { readConfig } = require("../services/config");
const { parseRepoSelector, resolveSourceContext } = require("../services/source-resolver");
const { prepareSourceWorkspace } = require("../services/source-workspace");
const { createReport } = require("../services/report");
const { ensureRelativeUnderCwd } = require("../services/component-files");
const { EXIT_CODES } = require("../constants");
const {
  findBareSlug,
  findTriple,
  findUilibSlug,
  hasRootIndex,
  listSlugsInUilibDir,
  notFoundError,
  orderedRepoNames,
  toComponentKey,
} = require("../services/component-catalog");
function listInstalledComponentKeys(targetDir) {
  const installed = new Set();
  if (!fs.existsSync(targetDir)) return installed;
  for (const uilib of fs.readdirSync(targetDir)) {
    const uilibDir = path.join(targetDir, uilib);
    if (!fs.statSync(uilibDir).isDirectory()) continue;
    for (const slug of fs.readdirSync(uilibDir)) {
      const componentDir = path.join(uilibDir, slug);
      if (!fs.statSync(componentDir).isDirectory()) continue;
      if (hasRootIndex(componentDir)) {
        installed.add(toComponentKey(uilib, slug));
      }
    }
  }
  return installed;
}

function usageError(message) {
  const err = new Error(message);
  err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
  throw err;
}

function configError(message) {
  const err = new Error(message);
  err.exitCode = EXIT_CODES.CONFIG_SCHEMA_ERROR;
  throw err;
}

function reposWithUilib(config, uilibName) {
  return orderedRepoNames(config).filter((repoName) =>
    config.repos[repoName].uilibs.includes(uilibName)
  );
}

function resolveRepoFromFlags(config, flagsRepo) {
  if (!flagsRepo) return null;
  const parsed = parseRepoSelector(flagsRepo);
  if (!parsed.repo) return null;
  if (!config.repos[parsed.repo]) {
    configError(`Repo '${parsed.repo}' not found in config.`);
  }
  return parsed.repo;
}

function parseListScope(positionals, config, flags) {
  if (positionals.length > 1) {
    usageError("list accepts at most one scope argument (<repo>, <repo>/<uilib>, or <component>).");
  }

  if (positionals.length === 0) {
    return flags.all ? { kind: "all-components" } : { kind: "repos" };
  }

  const spec = String(positionals[0] || "").trim();
  if (!spec) usageError("list scope argument must be non-empty.");
  const parts = spec.split("/").filter(Boolean);

  if (parts.length === 1) {
    const name = parts[0];
    if (config.repos[name]) {
      return flags.all
        ? { kind: "all-components", repo: name }
        : { kind: "uilibs", repo: name };
    }

    const matches = reposWithUilib(config, name);
    if (matches.length === 1) {
      return { kind: "components", repo: matches[0], uilib: name };
    }
    if (matches.length > 1) {
      const forcedRepo = resolveRepoFromFlags(config, flags.repo);
      if (forcedRepo && config.repos[forcedRepo].uilibs.includes(name)) {
        return { kind: "components", repo: forcedRepo, uilib: name };
      }
      usageError(
        `Uilib '${name}' exists in multiple repos (${matches.join(", ")}); use <repo>/${name} or --repo.`
      );
    }

    return { kind: "component-search", slug: name };
  }

  if (parts.length === 2) {
    const [first, second] = parts;
    if (config.repos[first]) {
      if (!config.repos[first].uilibs.includes(second)) {
        configError(`Uilib '${second}' is not listed for repo '${first}' in qui.config.json.`);
      }
      return { kind: "components", repo: first, uilib: second };
    }
    return { kind: "component-search", uilib: first, slug: second };
  }

  const [repo, uilib, ...rest] = parts;
  if (!config.repos[repo]) {
    configError(`Repo '${repo}' not found in config.`);
  }
  if (!config.repos[repo].uilibs.includes(uilib)) {
    configError(`Uilib '${uilib}' is not listed for repo '${repo}' in qui.config.json.`);
  }
  return { kind: "component", repo, uilib, slug: rest.join("/") };
}

function assertRepoExists(config, repoName) {
  if (!config.repos[repoName]) {
    configError(`Repo '${repoName}' not found in config.`);
  }
}

function collectAllComponentEntries(cwd, config, repoFilter) {
  const repos = repoFilter ? [repoFilter] : orderedRepoNames(config);
  const entries = [];

  for (const repoName of repos) {
    assertRepoExists(config, repoName);
    const source = resolveSourceContext(cwd, config, repoName);
    const workspace = prepareSourceWorkspace(source);
    try {
      const componentsRootDir = path.join(workspace.rootPath, source.repo.componentsRoot);
      for (const uilib of source.repo.uilibs) {
        for (const slug of listSlugsInUilibDir(componentsRootDir, uilib)) {
          entries.push({ repoName, uilib, slug });
        }
      }
    } finally {
      workspace.cleanup();
    }
  }

  return entries;
}

const INSTALLED_ICON = "✓";
const NOT_INSTALLED_ICON = "○";

function formatInstallStatus(installed) {
  return installed ? INSTALLED_ICON : NOT_INSTALLED_ICON;
}

function formatComponentLine(slug, installed) {
  return `[cmp] ${slug}  ${formatInstallStatus(installed)}`;
}

function buildComponentFooterForUilib(scopeLabel, uilib, slugs, installed) {
  const footer = [`Repo  ${scopeLabel}:`];
  for (const slug of slugs.sort()) {
    footer.push(formatComponentLine(slug, installed.has(toComponentKey(uilib, slug))));
  }
  return footer;
}

function resolveComponentHit(cwd, config, scope, flagsRepo) {
  if (scope.kind === "component") {
    const hit = findTriple(cwd, config, scope.repo, scope.uilib, scope.slug);
    if (!hit) throw notFoundError(`${scope.repo}/${scope.uilib}/${scope.slug}`);
    return hit;
  }

  const spec = scope.uilib ? `${scope.uilib}/${scope.slug}` : scope.slug;
  const hit = scope.uilib
    ? findUilibSlug(cwd, config, scope.uilib, scope.slug, flagsRepo)
    : findBareSlug(cwd, config, scope.slug, flagsRepo);
  if (!hit) throw notFoundError(spec);
  return hit;
}

async function runList(context) {
  const { cwd, flags, positionals } = context;
  const { config } = readConfig(cwd);
  const targetPath = flags.targetPath || config.targetPath;
  const targetDir = ensureRelativeUnderCwd(cwd, targetPath);
  const installed = listInstalledComponentKeys(targetDir);
  const scope = parseListScope(positionals, config, flags);

  let footer = [];
  let items = [];
  let repoSelector = flags.repo || null;

  if (scope.kind === "repos") {
    footer = orderedRepoNames(config).map((name) => `[repo] ${name}`);
    items = footer.map((line) => ({ kind: "repo", name: line.slice(7) }));
  } else if (scope.kind === "uilibs") {
    assertRepoExists(config, scope.repo);
    repoSelector = scope.repo;
    const uilibs = config.repos[scope.repo].uilibs;
    footer = [`Repo  ${scope.repo}:`, ...uilibs.map((name) => `[lib] ${name}`)];
    items = uilibs.map((name) => ({ kind: "uilib", repo: scope.repo, name }));
  } else if (scope.kind === "components") {
    assertRepoExists(config, scope.repo);
    repoSelector = `${scope.repo}/${scope.uilib}`;
    const source = resolveSourceContext(cwd, config, scope.repo);
    const workspace = prepareSourceWorkspace(source);
    let slugs;
    try {
      const componentsRootDir = path.join(workspace.rootPath, source.repo.componentsRoot);
      slugs = listSlugsInUilibDir(componentsRootDir, scope.uilib);
    } finally {
      workspace.cleanup();
    }
    if (slugs.length === 0) {
      throw notFoundError(`${scope.repo}/${scope.uilib}`);
    }
    footer = buildComponentFooterForUilib(
      `${scope.repo}/${scope.uilib}`,
      scope.uilib,
      slugs,
      installed
    );
    items = slugs.map((slug) => ({
      kind: "component",
      repo: scope.repo,
      uilib: scope.uilib,
      slug,
      installed: installed.has(toComponentKey(scope.uilib, slug)),
    }));
  } else if (scope.kind === "all-components") {
    const entries = collectAllComponentEntries(cwd, config, scope.repo);
    if (entries.length === 0) {
      const label = scope.repo || "selected scope";
      throw notFoundError(label);
    }
    repoSelector = scope.repo || "all";
    footer = entries
      .sort((a, b) =>
        `${a.repoName}/${a.uilib}/${a.slug}`.localeCompare(`${b.repoName}/${b.uilib}/${b.slug}`)
      )
      .map((entry) => {
        const prefix = `[cmp] ${entry.repoName}/${entry.uilib}/${entry.slug}`;
        return `${prefix}  ${formatInstallStatus(
          installed.has(toComponentKey(entry.uilib, entry.slug))
        )}`;
      });
    items = entries.map((entry) => ({
      kind: "component",
      repo: entry.repoName,
      uilib: entry.uilib,
      slug: entry.slug,
      installed: installed.has(toComponentKey(entry.uilib, entry.slug)),
    }));
  } else if (scope.kind === "component" || scope.kind === "component-search") {
    const hit = resolveComponentHit(cwd, config, scope, flags.repo);
    repoSelector = `${hit.repoName}/${hit.uilib}`;
    footer = [
      `Repo  ${hit.repoName}/${hit.uilib}:`,
      formatComponentLine(hit.slug, installed.has(toComponentKey(hit.uilib, hit.slug))),
    ];
    items = [
      {
        kind: "component",
        repo: hit.repoName,
        uilib: hit.uilib,
        slug: hit.slug,
        installed: installed.has(toComponentKey(hit.uilib, hit.slug)),
      },
    ];
  }

  return createReport({
    command: "list",
    ok: true,
    exitCode: EXIT_CODES.SUCCESS,
    repoSelector,
    targetPath,
    summary: { lines: footer.length },
    items,
    footer,
  });
}

module.exports = { runList, parseListScope, listInstalledComponentKeys };
