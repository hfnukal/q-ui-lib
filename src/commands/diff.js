const fs = require("node:fs");
const path = require("node:path");
const { readConfig } = require("../services/config");
const { resolveRepo, resolveSourceContext, parseRepoSelector } = require("../services/source-resolver");
const { prepareSourceWorkspace } = require("../services/source-workspace");
const { createReport } = require("../services/report");
const { ensureRelativeUnderCwd } = require("../services/component-files");
const {
  resolveComponentSpec,
  resolvePositionalToHit,
  parseMeta,
  parseUserComponentSpec,
  toComponentKey,
} = require("../services/component-catalog");
const {
  compareComponentDirectories,
  compareComponentMetadata,
  formatDependencyChanges,
  renderComponentDiff,
  resolveComponentAction,
} = require("../services/component-diff");
const { EXIT_CODES } = require("../constants");

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

function inferRepoForInstalledComponent(config, component, fallbackRepoName) {
  const registry =
    typeof component.meta?.registry === "string" && component.meta.registry.trim().length > 0
      ? component.meta.registry.trim()
      : component.uilib;
  const repoNames = Object.keys(config.repos || {});
  const byRegistry = repoNames.filter((repoName) =>
    Array.isArray(config.repos[repoName]?.uilibs) &&
    config.repos[repoName].uilibs.includes(registry)
  );
  if (byRegistry.length === 1) return byRegistry[0];
  if (byRegistry.length > 1) {
    const byUilib = byRegistry.filter((repoName) =>
      config.repos[repoName].uilibs.includes(component.uilib)
    );
    if (byUilib.length > 0) return byUilib[0];
    return byRegistry[0];
  }
  const byUilib = repoNames.filter((repoName) =>
    Array.isArray(config.repos[repoName]?.uilibs) &&
    config.repos[repoName].uilibs.includes(component.uilib)
  );
  if (byUilib.length > 0) return byUilib[0];
  return fallbackRepoName;
}

function repoSelectorForComponent(config, component, flagsRepo, fallbackRepoName) {
  if (flagsRepo) {
    const parsed = parseRepoSelector(flagsRepo);
    if (parsed.uilib) return flagsRepo;
    return `${parsed.repo}/${component.uilib}`;
  }
  const repoName = inferRepoForInstalledComponent(config, component, fallbackRepoName);
  return `${repoName}/${component.uilib}`;
}

function matchesRepoFilter(config, component, flagsRepo, fallbackRepoName) {
  if (!flagsRepo) return true;
  const parsed = parseRepoSelector(flagsRepo);
  const repoName = inferRepoForInstalledComponent(config, component, fallbackRepoName);
  if (parsed.repo && parsed.repo !== repoName) return false;
  if (parsed.uilib && parsed.uilib !== component.uilib) return false;
  return true;
}

function localLookupSpec(parsed) {
  if (parsed.kind === "triple") return toComponentKey(parsed.uilib, parsed.slug);
  if (parsed.kind === "uilib-slug") return toComponentKey(parsed.uilib, parsed.slug);
  return parsed.slug;
}

function preferredUilibFromParsed(parsed, flagsRepo) {
  if (parsed.kind === "triple") return parsed.uilib;
  if (parsed.kind === "uilib-slug") return parsed.uilib;
  return flagsRepo ? parseRepoSelector(flagsRepo).uilib : null;
}

function repoSelectorFromParsed(parsed, flagsRepo, config, component, fallbackRepoName) {
  if (parsed.kind === "triple") return `${parsed.repo}/${parsed.uilib}`;
  return repoSelectorForComponent(config, component, flagsRepo, fallbackRepoName);
}

function resolveSingleDiffTarget(cwd, config, spec, flags, targetDir, fallbackRepoName) {
  const parsed = parseUserComponentSpec(spec);
  if (!parsed) {
    const err = new Error(
      "Invalid component spec. Use [<repo>/][<uilib>/]<component>."
    );
    err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
    throw err;
  }

  const installed = listInstalledComponents(targetDir);
  const installedUilibs = listSubdirs(targetDir);
  const flagsRepo = parsed.kind === "triple" ? `${parsed.repo}/${parsed.uilib}` : flags.repo;
  const parsedRepo = flagsRepo ? parseRepoSelector(flagsRepo) : null;
  const preferredUilib = preferredUilibFromParsed(parsed, flags.repo);
  const configuredUilibs = parsedRepo?.repo
    ? config.repos[parsedRepo.repo]?.uilibs || []
    : [];
  const orderedUilibs = [...new Set([...installedUilibs, ...configuredUilibs])];
  const lookupSpec = localLookupSpec(parsed);
  const local = resolveInstalledComponentSpec(
    installed,
    orderedUilibs,
    lookupSpec,
    preferredUilib
  );

  if (local) {
    return {
      key: local.key,
      uilib: local.uilib,
      slug: local.slug,
      localDir: local.dir,
      localMeta: local.meta,
      repoSelector: repoSelectorFromParsed(parsed, flags.repo, config, local, fallbackRepoName),
    };
  }

  const hit = resolvePositionalToHit(cwd, config, spec, flagsRepo);
  if (!hit) {
    const err = new Error(`Component '${spec}' not found locally or in configured repositories.`);
    err.exitCode = EXIT_CODES.SOURCE_GIT_NETWORK_ERROR;
    throw err;
  }

  return {
    key: hit.seedKey,
    uilib: hit.uilib,
    slug: hit.slug,
    localDir: path.join(targetDir, hit.uilib, hit.slug),
    localMeta: readMeta(path.join(targetDir, hit.uilib, hit.slug)),
    repoSelector: flagsRepo || `${hit.repoName}/${hit.uilib}`,
  };
}

function resolveDiffTargets(cwd, config, flags, componentSpec, targetDir, fallbackRepoName) {
  if (componentSpec) {
    return [resolveSingleDiffTarget(cwd, config, componentSpec, flags, targetDir, fallbackRepoName)];
  }

  const installed = listInstalledComponents(targetDir);
  const targets = [];
  for (const component of installed) {
    if (!matchesRepoFilter(config, component, flags.repo, fallbackRepoName)) continue;
    targets.push({
      key: component.key,
      uilib: component.uilib,
      slug: component.slug,
      localDir: component.dir,
      localMeta: component.meta,
      repoSelector: repoSelectorForComponent(config, component, flags.repo, fallbackRepoName),
    });
  }
  if (targets.length === 0) {
    const err = new Error("No installed components matched the diff scope.");
    err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
    throw err;
  }
  return targets;
}

function groupTargetsByRepoSelector(targets) {
  const map = new Map();
  for (const target of targets) {
    if (!map.has(target.repoSelector)) map.set(target.repoSelector, []);
    map.get(target.repoSelector).push(target);
  }
  return map;
}

function compareTargetWithRemote(target, componentsRootDir, orderedUilibs) {
  const remote = resolveComponentSpec(componentsRootDir, orderedUilibs, target.key, target.uilib);
  const remoteDir = remote?.dir || null;
  const remoteMeta = remoteDir ? parseMeta(remoteDir) : null;
  if (!remoteDir) {
    const tree = compareComponentDirectories(
      target.localDir,
      path.join(componentsRootDir, ".qui-missing-remote")
    );
    return {
      component: target.key,
      action: "remove",
      files: tree.files,
      dependencies: [],
      details: "Component exists locally but was not found in the configured remote source.",
      footerLines: renderComponentDiff(
        target.localDir,
        path.join(componentsRootDir, ".qui-missing-remote"),
        target.key
      ),
    };
  }

  const tree = compareComponentDirectories(target.localDir, remoteDir);

  const dependencyDiff = compareComponentMetadata(target.localMeta, remoteMeta);
  const action = resolveComponentAction({
    localExists: tree.localExists,
    remoteExists: tree.remoteExists,
    files: tree.files,
    dependenciesChanged: dependencyDiff.changed,
  });
  const dependencies = formatDependencyChanges(dependencyDiff);
  const footerLines =
    action === "noop" ? [] : renderComponentDiff(target.localDir, remoteDir, target.key);

  return {
    component: target.key,
    action,
    files: tree.files,
    dependencies,
    details:
      action === "noop"
        ? "Local component matches remote source."
        : `Remote source differs from local install (${tree.files.length} file change(s)).`,
    footerLines,
  };
}

function collectMutatingFlagWarnings(flags) {
  const warnings = [];
  if (flags.auto) warnings.push("--auto is ignored by diff (read-only command).");
  if (flags.force) warnings.push("--force is ignored by diff (read-only command).");
  if (flags.dryRun) warnings.push("--dry-run is ignored by diff (read-only command).");
  if (flags.yes) warnings.push("--yes is ignored by diff (read-only command).");
  return warnings;
}

async function runDiff(context) {
  const { cwd, flags, positionals } = context;
  if (positionals.length > 1) {
    const err = new Error(
      "diff accepts at most one component spec in the form [<repo>/][<uilib>/]<component>."
    );
    err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
    throw err;
  }
  const componentSpec = positionals[0] || null;
  const { config } = readConfig(cwd);
  const resolved = resolveRepo(config, flags.repo);
  const disconnected = resolved.repo.connected === false;
  const targetPath = flags.targetPath || config.targetPath;
  const targetDir = ensureRelativeUnderCwd(cwd, targetPath);
  const warnings = collectMutatingFlagWarnings(flags);

  if (disconnected) {
    warnings.push("Repo is disconnected; diff reports pending reconnect.");
    const ciMismatch = Boolean(flags.ci);
    return createReport({
      command: "diff",
      ok: !ciMismatch,
      exitCode: ciMismatch ? EXIT_CODES.VERIFY_DIFF_MISMATCH : EXIT_CODES.SUCCESS,
      repoSelector: flags.repo || resolved.repoName,
      targetPath,
      summary: { checked: 1, changed: 1, warnings: warnings.length, errors: 0 },
      items: [
        {
          component: componentSpec || "*",
          action: "update",
          files: [],
          dependencies: [],
          details: "Repo is configured but disconnected; update required before sync.",
        },
      ],
      warnings,
      footer: [],
    });
  }

  const targets = resolveDiffTargets(
    cwd,
    config,
    flags,
    componentSpec,
    targetDir,
    resolved.repoName
  );
  const byRepo = groupTargetsByRepoSelector(targets);
  const items = [];
  const footer = [];

  for (const [repoSelector, repoTargets] of byRepo) {
    const source = resolveSourceContext(cwd, config, repoSelector);
    const workspace = prepareSourceWorkspace(source);
    try {
      const componentsRootDir = path.join(workspace.rootPath, source.repo.componentsRoot);
      const installedUilibs = listSubdirs(targetDir);
      const configuredUilibs = Array.isArray(source.repo?.uilibs) ? source.repo.uilibs : [];
      const sourceUilibs = listSubdirs(componentsRootDir);
      const orderedUilibs = [...new Set([...installedUilibs, ...configuredUilibs, ...sourceUilibs])];
      for (const target of repoTargets) {
        const item = compareTargetWithRemote(target, componentsRootDir, orderedUilibs);
        items.push(item);
        footer.push(...item.footerLines);
        if (item.footerLines.length > 0) footer.push("");
      }
    } finally {
      workspace.cleanup();
    }
  }

  const changed = items.filter((item) => item.action !== "noop").length;
  const ciMismatch = Boolean(flags.ci && changed > 0);
  const cleanedFooter = footer.filter((line, index, all) => !(line === "" && index === all.length - 1));

  return createReport({
    command: "diff",
    ok: !ciMismatch,
    exitCode: ciMismatch ? EXIT_CODES.VERIFY_DIFF_MISMATCH : EXIT_CODES.SUCCESS,
    repoSelector:
      flags.repo ||
      (byRepo.size === 1 ? [...byRepo.keys()][0] : [...byRepo.keys()].join("|")),
    targetPath,
    summary: {
      checked: items.length,
      changed,
      warnings: warnings.length,
      errors: 0,
    },
    items: items.map(({ footerLines, ...item }) => item),
    warnings,
    footer: cleanedFooter,
  });
}

module.exports = { runDiff, parseDiffComponentSpec: parseUserComponentSpec };
