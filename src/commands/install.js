const fs = require("node:fs");
const path = require("node:path");
const { writeConfigAtomic, getConfigPath } = require("../services/config");
const { createReport } = require("../services/report");
const { EXIT_CODES } = require("../constants");
const { readManifestFile } = require("../services/manifest");
const { runAdd } = require("./add");
const { runInit } = require("./init");
const { runRoute, DEFAULT_ROUTES_PATH } = require("./route");
const { runTemplate, DEFAULT_TEMPLATE_TARGET } = require("./template");

function usageError(message) {
  const err = new Error(message);
  err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
  throw err;
}

function normalizeComponentSpec(spec) {
  const trimmed = String(spec).trim();
  if (trimmed.endsWith("/")) {
    return { kind: "uilib-all", value: trimmed.slice(0, -1) };
  }
  return { kind: "component", value: trimmed };
}

async function runInstall(context) {
  const { cwd, flags, positionals } = context;
  if (positionals.length === 0 || positionals.length > 2) {
    usageError("install requires <manifest.json> and optional <path> (default .).");
  }

  const manifestPath = path.resolve(cwd, positionals[0]);
  const installRoot = positionals[1] ? path.resolve(cwd, positionals[1]) : cwd;
  const manifest = readManifestFile(manifestPath);

  const items = [];
  const warnings = [];
  const childContext = {
    cwd: installRoot,
    flags,
    positionals: [],
    rawArgv: context.rawArgv,
  };

  const initRan = !flags.noInit;
  if (initRan) {
    const repoNames = Object.keys(manifest.config.repos || {});
    const firstRepoName = repoNames[0];
    const firstRepo = firstRepoName ? manifest.config.repos[firstRepoName] : null;
    const initPositional =
      path.resolve(installRoot) === path.resolve(cwd) ? "." : path.relative(cwd, installRoot);
    const initReport = await runInit({
      cwd,
      flags: {
        ...flags,
        targetPath: flags.targetPath || manifest.config.targetPath,
        ...(firstRepoName ? { repo: firstRepoName } : {}),
        ...(firstRepo?.url ? { url: firstRepo.url } : {}),
      },
      positionals: [initPositional],
      rawArgv: context.rawArgv,
    });
    items.push(...(initReport.items || []));
    warnings.push(...(initReport.warnings || []));
    if (!initReport.ok) {
      return createReport({
        command: "install",
        ok: false,
        exitCode: initReport.exitCode,
        targetPath: path.relative(cwd, installRoot) || ".",
        items,
        warnings,
        errors: initReport.errors || ["init failed during install."],
      });
    }
  }

  const configTarget = path.join(installRoot, "qui.config.json");
  const hadConfigBefore = fs.existsSync(configTarget);
  writeConfigAtomic(installRoot, manifest.config);
  items.push({
    action: "modify",
    target: path.relative(cwd, configTarget),
    status: flags.dryRun ? "planned" : "applied",
  });

  const installTargetPath = flags.targetPath || manifest.config.targetPath;
  fs.mkdirSync(path.join(installRoot, installTargetPath), { recursive: true });

  const componentSpecs = manifest.components || [];
  for (const spec of componentSpecs) {
    const normalized = normalizeComponentSpec(spec);
    if (normalized.kind === "uilib-all") {
      const addReport = await runAdd({
        ...childContext,
        positionals: [normalized.value],
        flags: { ...flags, all: true },
      });
      items.push(...addReport.items);
      warnings.push(...(addReport.warnings || []));
      continue;
    }
    childContext.positionals = [normalized.value];
    const addReport = await runAdd(childContext);
    items.push(...addReport.items);
    warnings.push(...(addReport.warnings || []));
  }

  const templatePath = manifest.templatePath || DEFAULT_TEMPLATE_TARGET;
  for (const spec of manifest.templates || []) {
    childContext.positionals = [spec];
    const templateReport = await runTemplate({
      ...childContext,
      flags: { ...flags, templatePath },
    });
    items.push(...templateReport.items);
    warnings.push(...(templateReport.warnings || []));
  }

  for (const spec of manifest.routes || []) {
    childContext.positionals = [spec];
    const routeReport = await runRoute(childContext);
    items.push(...routeReport.items);
    warnings.push(...(routeReport.warnings || []));
  }

  if (flags.dryRun && !hadConfigBefore) {
    fs.rmSync(getConfigPath(installRoot), { force: true });
  }

  return createReport({
    command: "install",
    ok: true,
    exitCode: EXIT_CODES.SUCCESS,
    targetPath: path.relative(cwd, installRoot) || ".",
    summary: {
      planned: items.filter((x) => x.status === "planned").length,
      applied: items.filter((x) => x.status === "applied").length,
      skipped: items.filter((x) => x.status === "skipped").length,
      failed: 0,
    },
    items,
    warnings,
    details: {
      manifest: path.relative(cwd, manifestPath),
      init: initRan,
      routesPath: DEFAULT_ROUTES_PATH,
      templatePath,
      components: componentSpecs.length,
      templates: (manifest.templates || []).length,
      routes: (manifest.routes || []).length,
    },
  });
}

module.exports = { runInstall };
