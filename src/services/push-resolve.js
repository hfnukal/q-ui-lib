const fs = require("node:fs");
const path = require("node:path");
const { EXIT_CODES } = require("../constants");
const { parseRepoSelector } = require("./source-resolver");
const { ensureRelativeUnderCwd } = require("./component-files");

function toComponentKey(uilib, slug) {
  return `${uilib}/${slug}`;
}

function readMeta(componentDir) {
  const metaPath = path.join(componentDir, "meta.generated.json");
  if (!fs.existsSync(metaPath)) return null;
  try {
    return JSON.parse(fs.readFileSync(metaPath, "utf8"));
  } catch {
    return null;
  }
}

function collectComponentSlugs(currentDir, prefix = "") {
  if (!fs.existsSync(currentDir)) return [];
  const slugs = [];
  for (const entry of fs.readdirSync(currentDir)) {
    const entryPath = path.join(currentDir, entry);
    if (!fs.statSync(entryPath).isDirectory()) continue;
    const slug = prefix ? `${prefix}/${entry}` : entry;
    if (fs.existsSync(path.join(entryPath, "meta.generated.json"))) {
      slugs.push(slug);
    }
    slugs.push(...collectComponentSlugs(entryPath, slug));
  }
  return slugs;
}

function listSubdirs(parentDir) {
  if (!fs.existsSync(parentDir)) return [];
  return fs
    .readdirSync(parentDir)
    .filter((name) => fs.statSync(path.join(parentDir, name)).isDirectory());
}

function listInstalledComponents(targetDir) {
  const installed = [];
  for (const uilib of listSubdirs(targetDir)) {
    const uilibDir = path.join(targetDir, uilib);
    for (const slug of collectComponentSlugs(uilibDir)) {
      const dir = path.join(uilibDir, slug);
      installed.push({
        key: toComponentKey(uilib, slug),
        uilib,
        slug,
        dir,
        meta: readMeta(dir),
      });
    }
  }
  return installed;
}

function reposWithUilib(config, uilibName) {
  return Object.keys(config.repos || {}).filter((repoName) =>
    (config.repos[repoName].uilibs || []).includes(uilibName)
  );
}

function parsePushComponentSpec(spec, config) {
  const value = String(spec || "").trim();
  if (!value) return null;
  const parts = value.split("/").filter(Boolean);

  if (parts.length === 1) {
    return { repo: null, uilib: null, slug: parts[0] };
  }

  if (parts.length === 2) {
    const [first, second] = parts;
    if (config.repos[first] && config.repos[first].uilibs.includes(second)) {
      const err = new Error(`'${value}' is a repo/uilib scope, not a component.`);
      err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
      throw err;
    }
    return { repo: null, uilib: first, slug: second };
  }

  const [first, second, ...rest] = parts;
  if (config.repos[first] && config.repos[first].uilibs.includes(second)) {
    return { repo: first, uilib: second, slug: rest.join("/") };
  }
  return { repo: null, uilib: first, slug: [second, ...rest].join("/") };
}

function resolveInstalledComponentSpec(installed, orderedUilibs, spec, preferredUilib) {
  const value = String(spec || "").trim();
  if (!value) return null;
  const byKey = new Map(installed.map((component) => [component.key, component]));
  if (byKey.has(value)) return byKey.get(value);

  if (value.includes("/")) {
    const [uilib, ...rest] = value.split("/");
    const slug = rest.join("/");
    if (!uilib || !slug) return null;
    return byKey.get(toComponentKey(uilib, slug)) || null;
  }

  const candidates = [];
  if (preferredUilib) candidates.push(preferredUilib);
  for (const uilib of orderedUilibs) {
    if (!candidates.includes(uilib)) candidates.push(uilib);
  }

  const directMatch = installed.find(
    (component) => candidates.includes(component.uilib) && component.slug === value
  );
  if (directMatch) return directMatch;

  for (const uilib of candidates) {
    for (const component of installed) {
      if (component.uilib !== uilib) continue;
      const name = typeof component.meta?.name === "string" ? component.meta.name.trim() : "";
      const registry =
        typeof component.meta?.registry === "string" ? component.meta.registry.trim() : "";
      const leaf = component.slug.split("/").pop();
      const aliases = new Set([leaf, name].filter(Boolean));
      if (registry) {
        aliases.add(`${registry}/${leaf}`);
        if (name) aliases.add(`${registry}/${name}`);
      }
      if (aliases.has(value)) {
        return component;
      }
    }
  }
  return null;
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
    const parsed = parsePushComponentSpec(spec, config);
    if (!parsed) continue;

    let component;
    if (parsed.uilib) {
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

    const repoName = findRepoForPush(config, component.uilib, parsed.repo, flags.repo);
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
  parsePushComponentSpec,
  resolvePushComponents,
  listInstalledComponents,
};
