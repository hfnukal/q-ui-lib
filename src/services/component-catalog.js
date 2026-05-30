const fs = require("node:fs");
const path = require("node:path");
const { EXIT_CODES } = require("../constants");
const { resolveSourceContext, parseRepoSelector } = require("./source-resolver");
const { prepareSourceWorkspace } = require("./source-workspace");

function toComponentKey(uilib, slug) {
  return `${uilib}/${slug}`;
}

function hasRootIndex(componentDir) {
  return (
    fs.existsSync(path.join(componentDir, "index.tsx")) ||
    fs.existsSync(path.join(componentDir, "index.ts"))
  );
}

function parseMeta(componentDir) {
  const metaPath = path.join(componentDir, "meta.generated.json");
  if (!fs.existsSync(metaPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(metaPath, "utf8"));
  } catch {
    return null;
  }
}

function orderedRepoNames(config) {
  return Object.keys(config.repos || {});
}

function repoNamesForSearch(config, flagsRepo) {
  const names = orderedRepoNames(config);
  if (!flagsRepo) return names;
  const p = parseRepoSelector(flagsRepo);
  if (!p.repo) return names;
  if (!config.repos[p.repo]) {
    const err = new Error(`Repo '${p.repo}' not found in config.`);
    err.exitCode = EXIT_CODES.CONFIG_SCHEMA_ERROR;
    throw err;
  }
  return [p.repo];
}

/** When --repo is repo/uilib, bare slug resolution checks only that uilib in the selected repo(s). */
function uilibsForBareSlugSearch(source, flagsRepo) {
  if (!flagsRepo) return source.repo.uilibs;
  const p = parseRepoSelector(flagsRepo);
  if (p.uilib != null) {
    if (!source.repo.uilibs.includes(p.uilib)) {
      const err = new Error(
        `uilib '${p.uilib}' is not listed for repo '${source.repoName}' in qui.config.json.`
      );
      err.exitCode = EXIT_CODES.CONFIG_SCHEMA_ERROR;
      throw err;
    }
    return [p.uilib];
  }
  return source.repo.uilibs;
}

/** Which uilib directories to include for `add --all` / `list --all` without extra scope. */
function orderedUilibsForRepoWideAll(flagsRepo, source) {
  if (!flagsRepo) return source.repo.uilibs;
  const p = parseRepoSelector(flagsRepo);
  if (p.repo && p.repo !== source.repoName) {
    return source.repo.uilibs;
  }
  if (p.uilib != null) {
    if (!source.repo.uilibs.includes(p.uilib)) {
      const err = new Error(
        `uilib '${p.uilib}' is not listed for repo '${source.repoName}' in qui.config.json.`
      );
      err.exitCode = EXIT_CODES.CONFIG_SCHEMA_ERROR;
      throw err;
    }
    return [p.uilib];
  }
  return source.repo.uilibs;
}

function notFoundError(spec) {
  const err = new Error(`Component or scope '${spec}' not found in source repositories.`);
  err.exitCode = EXIT_CODES.SOURCE_GIT_NETWORK_ERROR;
  return err;
}

function withWorkspace(cwd, config, repoSelector, fn) {
  const source = resolveSourceContext(cwd, config, repoSelector);
  const workspace = prepareSourceWorkspace(source);
  try {
    const componentsRootDir = path.join(workspace.rootPath, source.repo.componentsRoot);
    return fn({ source, workspace, componentsRootDir });
  } finally {
    workspace.cleanup();
  }
}

function findBareSlug(cwd, config, slug, flagsRepo) {
  const repos = repoNamesForSearch(config, flagsRepo);
  for (const repoName of repos) {
    const hit = withWorkspace(cwd, config, repoName, ({ source, componentsRootDir }) => {
      const uilibs = uilibsForBareSlugSearch(source, flagsRepo);
      for (const uilib of uilibs) {
        const dir = path.join(componentsRootDir, uilib, slug);
        if (hasRootIndex(dir)) {
          return { repoName, uilib, slug, seedKey: toComponentKey(uilib, slug) };
        }
      }
      return null;
    });
    if (hit) return hit;
  }
  return null;
}

function findUilibSlug(cwd, config, uilib, slug, flagsRepo) {
  const repos = repoNamesForSearch(config, flagsRepo);
  for (const repoName of repos) {
    const hit = withWorkspace(cwd, config, repoName, ({ componentsRootDir }) => {
      const dir = path.join(componentsRootDir, uilib, slug);
      if (hasRootIndex(dir)) {
        return { repoName, uilib, slug, seedKey: toComponentKey(uilib, slug) };
      }
      return null;
    });
    if (hit) return hit;
  }
  return null;
}

function findTriple(cwd, config, repo, uilib, slug) {
  if (!config.repos[repo]) {
    const err = new Error(`Repo '${repo}' not found in config.`);
    err.exitCode = EXIT_CODES.CONFIG_SCHEMA_ERROR;
    throw err;
  }
  return withWorkspace(cwd, config, `${repo}/${uilib}`, ({ componentsRootDir }) => {
    const dir = path.join(componentsRootDir, uilib, slug);
    if (!hasRootIndex(dir)) return null;
    return { repoName: repo, uilib, slug, seedKey: toComponentKey(uilib, slug) };
  });
}

function parseUserComponentSpec(spec) {
  const value = String(spec || "").trim();
  if (!value) return null;
  const parts = value.split("/").filter(Boolean);
  if (parts.length === 1) return { kind: "slug", slug: parts[0] };
  if (parts.length === 2) return { kind: "uilib-slug", uilib: parts[0], slug: parts[1] };
  return { kind: "triple", repo: parts[0], uilib: parts[1], slug: parts.slice(2).join("/") };
}

function parseLocalComponentSpec(spec, config) {
  const parsed = parseUserComponentSpec(spec);
  if (!parsed) return null;
  if (
    parsed.kind === "uilib-slug" &&
    config.repos[parsed.uilib] &&
    config.repos[parsed.uilib].uilibs.includes(parsed.slug)
  ) {
    const err = new Error(`'${spec}' is a repo/uilib scope, not a component.`);
    err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
    throw err;
  }
  return parsed;
}

function parseAllScopeSpec(spec) {
  const value = String(spec || "").trim();
  if (!value) return null;
  const parts = value.split("/").filter(Boolean);
  if (parts.length === 1) return { kind: "uilib", uilib: parts[0] };
  if (parts.length === 2) return { kind: "repo-uilib", repo: parts[0], uilib: parts[1] };
  const err = new Error("--all scope must be <uilib> or <repo>/<uilib>.");
  err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
  throw err;
}

function listSlugsInUilibDir(componentsRootDir, uilib) {
  const uilibDir = path.join(componentsRootDir, uilib);
  if (!fs.existsSync(uilibDir) || !fs.statSync(uilibDir).isDirectory()) return [];
  return fs
    .readdirSync(uilibDir)
    .filter((slug) => hasRootIndex(path.join(uilibDir, slug)));
}

function collectSeedsForAllScopedUilib(cwd, config, uilibName, flagsRepo) {
  const repos = repoNamesForSearch(config, flagsRepo);
  for (const repoName of repos) {
    const seeds = withWorkspace(cwd, config, repoName, ({ componentsRootDir }) => {
      const slugs = listSlugsInUilibDir(componentsRootDir, uilibName);
      if (slugs.length === 0) return null;
      return slugs.map((slug) => ({
        repoName,
        uilib: uilibName,
        slug,
        seedKey: toComponentKey(uilibName, slug),
      }));
    });
    if (seeds && seeds.length > 0) return seeds;
  }
  return null;
}

function collectSeedsForAllScopedRepoUilib(cwd, config, repo, uilib) {
  const seeds = withWorkspace(cwd, config, `${repo}/${uilib}`, ({ componentsRootDir }) => {
    const slugs = listSlugsInUilibDir(componentsRootDir, uilib);
    return slugs.map((slug) => ({
      repoName: repo,
      uilib,
      slug,
      seedKey: toComponentKey(uilib, slug),
    }));
  });
  return seeds.length > 0 ? seeds : null;
}

function resolveComponentSpec(componentsRootDir, orderedUilibs, spec, preferredUilib) {
  const value = String(spec || "").trim();
  if (!value) return null;
  if (value.includes("/")) {
    const [uilib, ...rest] = value.split("/");
    const slug = rest.join("/");
    if (!uilib || !slug) return null;
    const dir = path.join(componentsRootDir, uilib, slug);
    if (!hasRootIndex(dir)) return null;
    return { key: toComponentKey(uilib, slug), uilib, slug, dir };
  }

  const candidates = [];
  if (preferredUilib) candidates.push(preferredUilib);
  for (const uilib of orderedUilibs) {
    if (!candidates.includes(uilib)) candidates.push(uilib);
  }
  for (const uilib of candidates) {
    const dir = path.join(componentsRootDir, uilib, value);
    if (hasRootIndex(dir)) {
      return { key: toComponentKey(uilib, value), uilib, slug: value, dir };
    }
  }
  return null;
}

function expandDependencies(componentsRootDir, orderedUilibs, seedSpecs, repoName) {
  const queue = [];
  const ordered = [];
  const seen = new Set();
  const unresolvedDeps = [];
  const npmPackages = new Set();
  const explicitSeeds = new Set();

  for (const seed of [...new Set(seedSpecs)]) {
    const resolvedSeed = resolveComponentSpec(componentsRootDir, orderedUilibs, seed, null);
    if (!resolvedSeed) {
      const err = new Error(`Component '${seed}' not found in source repository.`);
      err.exitCode = EXIT_CODES.SOURCE_GIT_NETWORK_ERROR;
      throw err;
    }
    explicitSeeds.add(resolvedSeed.key);
    queue.push(resolvedSeed.key);
  }

  while (queue.length > 0) {
    const nextSpec = queue.shift();
    const resolved = resolveComponentSpec(componentsRootDir, orderedUilibs, nextSpec, null);
    if (!resolved) {
      const err = new Error(`Component '${nextSpec}' not found in source repository.`);
      err.exitCode = EXIT_CODES.SOURCE_GIT_NETWORK_ERROR;
      throw err;
    }
    if (seen.has(resolved.key)) continue;
    seen.add(resolved.key);
    ordered.push({ ...resolved, repoName });
    const meta = parseMeta(resolved.dir);
    const deps = Array.isArray(meta?.dependencies) ? meta.dependencies : [];
    const npmDeps = Array.isArray(meta?.npmDependencies) ? meta.npmDependencies : [];
    for (const pkg of npmDeps) npmPackages.add(pkg);

    for (const dep of deps) {
      const depResolved = resolveComponentSpec(
        componentsRootDir,
        orderedUilibs,
        dep,
        resolved.uilib
      );
      if (!depResolved) {
        unresolvedDeps.push(`${dep} (required by ${resolved.key})`);
        continue;
      }
      if (!seen.has(depResolved.key)) queue.push(depResolved.key);
    }
  }

  return {
    components: ordered,
    npmPackages: [...npmPackages].sort(),
    unresolvedDeps,
    explicitSeeds,
  };
}

function resolvePositionalToHit(cwd, config, positional, flagsRepo) {
  const parsed = parseUserComponentSpec(positional);
  if (!parsed) return null;
  if (parsed.kind === "slug") {
    return findBareSlug(cwd, config, parsed.slug, flagsRepo);
  }
  if (parsed.kind === "uilib-slug") {
    return findUilibSlug(cwd, config, parsed.uilib, parsed.slug, flagsRepo);
  }
  return findTriple(cwd, config, parsed.repo, parsed.uilib, parsed.slug);
}

function resolveSeedHitsFromPositionals(cwd, config, positionals, flagsRepo) {
  const hits = [];
  for (const p of positionals) {
    const hit = resolvePositionalToHit(cwd, config, p, flagsRepo);
    if (!hit) throw notFoundError(p);
    hits.push(hit);
  }
  return hits;
}

function groupSeedKeysByRepo(seedHits) {
  const map = new Map();
  for (const h of seedHits) {
    if (!map.has(h.repoName)) map.set(h.repoName, []);
    map.get(h.repoName).push(h.seedKey);
  }
  for (const repoName of map.keys()) {
    map.set(repoName, [...new Set(map.get(repoName))]);
  }
  return map;
}

module.exports = {
  collectSeedsForAllScopedRepoUilib,
  collectSeedsForAllScopedUilib,
  expandDependencies,
  findBareSlug,
  findTriple,
  findUilibSlug,
  groupSeedKeysByRepo,
  hasRootIndex,
  listSlugsInUilibDir,
  notFoundError,
  orderedRepoNames,
  orderedUilibsForRepoWideAll,
  parseAllScopeSpec,
  parseLocalComponentSpec,
  parseMeta,
  parseUserComponentSpec,
  resolveComponentSpec,
  resolvePositionalToHit,
  resolveSeedHitsFromPositionals,
  toComponentKey,
  uilibsForBareSlugSearch,
  withWorkspace,
};
