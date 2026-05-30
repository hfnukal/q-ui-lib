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
  listInstalledComponents,
  listSubdirs,
  resolveInstalledComponentSpec,
} = require("../services/installed-components");
const {
  compareComponentDirectories,
  compareComponentMetadata,
  formatDependencyChanges,
  renderComponentDiff,
  resolveComponentAction,
} = require("../services/component-diff");
const { EXIT_CODES } = require("../constants");

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

function installedTargetFromComponent(config, component, flagsRepo, fallbackRepoName) {
  return {
    key: component.key,
    uilib: component.uilib,
    slug: component.slug,
    localDir: component.dir,
    localMeta: component.meta,
    repoSelector: repoSelectorForComponent(config, component, flagsRepo, fallbackRepoName),
  };
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
    localMeta: null,
    repoSelector: flagsRepo || `${hit.repoName}/${hit.uilib}`,
  };
}

function expandDiffScope(cwd, config, flags, spec, targetDir, fallbackRepoName) {
  const value = String(spec || "").trim();
  if (!value) return [];

  const parts = value.split("/").filter(Boolean);
  const installed = listInstalledComponents(targetDir);

  if (parts.length === 1 && config.repos[parts[0]]) {
    const repoName = parts[0];
    return installed
      .filter((component) => inferRepoForInstalledComponent(config, component, fallbackRepoName) === repoName)
      .filter((component) => matchesRepoFilter(config, component, flags.repo, fallbackRepoName))
      .map((component) => installedTargetFromComponent(config, component, flags.repo, fallbackRepoName));
  }

  if (
    parts.length === 2 &&
    config.repos[parts[0]] &&
    config.repos[parts[0]].uilibs.includes(parts[1])
  ) {
    const [, uilib] = parts;
    const repoName = parts[0];
    return installed
      .filter((component) => component.uilib === uilib)
      .filter((component) => inferRepoForInstalledComponent(config, component, fallbackRepoName) === repoName)
      .filter((component) => matchesRepoFilter(config, component, flags.repo, fallbackRepoName))
      .map((component) => installedTargetFromComponent(config, component, flags.repo, fallbackRepoName));
  }

  const uilibDir = path.join(targetDir, parts[0]);
  if (parts.length === 1 && fs.existsSync(uilibDir) && fs.statSync(uilibDir).isDirectory()) {
    const uilib = parts[0];
    return installed
      .filter((component) => component.uilib === uilib)
      .filter((component) => matchesRepoFilter(config, component, flags.repo, fallbackRepoName))
      .map((component) => installedTargetFromComponent(config, component, flags.repo, fallbackRepoName));
  }

  return [resolveSingleDiffTarget(cwd, config, spec, flags, targetDir, fallbackRepoName)];
}

function resolveDiffTargets(cwd, config, flags, positionals, targetDir, fallbackRepoName) {
  if (positionals.length === 0) {
    const installed = listInstalledComponents(targetDir);
    const targets = installed
      .filter((component) => matchesRepoFilter(config, component, flags.repo, fallbackRepoName))
      .map((component) => installedTargetFromComponent(config, component, flags.repo, fallbackRepoName));
    if (targets.length === 0) {
      const err = new Error("No installed components matched the diff scope.");
      err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
      throw err;
    }
    return targets;
  }

  const byKey = new Map();
  for (const spec of positionals) {
    for (const target of expandDiffScope(cwd, config, flags, spec, targetDir, fallbackRepoName)) {
      byKey.set(target.key, target);
    }
  }
  if (byKey.size === 0) {
    const err = new Error("No components matched the diff scope.");
    err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
    throw err;
  }
  return [...byKey.values()];
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

async function runDiff(context) {
  const { cwd, flags, positionals } = context;
  const { config } = readConfig(cwd);
  const resolved = resolveRepo(config, flags.repo);
  const disconnected = resolved.repo.connected === false;
  const targetPath = flags.targetPath || config.targetPath;
  const targetDir = ensureRelativeUnderCwd(cwd, targetPath);
  const warnings = [];

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
          component: positionals[0] || "*",
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
    positionals,
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
