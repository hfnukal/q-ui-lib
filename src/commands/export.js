const path = require("node:path");
const { readConfig } = require("../services/config");
const { ensureRelativeUnderCwd } = require("../services/component-files");
const { createReport } = require("../services/report");
const { EXIT_CODES } = require("../constants");
const {
  buildManifest,
  filterComponentSpecs,
  listInstalledComponentSpecs,
  parseExportSections,
  writeManifestFile,
} = require("../services/manifest");

const DEFAULT_MANIFEST_NAME = "manifest.json";

function usageError(message) {
  const err = new Error(message);
  err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
  throw err;
}

async function runExport(context) {
  const { cwd, flags, positionals } = context;
  const { config } = readConfig(cwd);
  const targetPath = flags.targetPath || config.targetPath;
  const targetDir = ensureRelativeUnderCwd(cwd, targetPath);
  const manifestName = flags.output || DEFAULT_MANIFEST_NAME;
  const manifestPath = path.resolve(cwd, manifestName);

  const { sections, componentFilters, templateSpecs, routeSpecs } = parseExportSections(positionals);
  const installed = listInstalledComponentSpecs(targetDir);
  const componentSpecs = sections.components
    ? filterComponentSpecs(installed, componentFilters)
    : [];

  if (sections.components && componentSpecs.length === 0 && componentFilters.length > 0) {
    usageError("export found no installed components matching the provided filters.");
  }

  const manifest = buildManifest({
    config,
    componentSpecs,
    templateSpecs,
    routeSpecs,
    sections,
  });

  if (flags.dryRun) {
    return createReport({
      command: "export",
      ok: true,
      exitCode: EXIT_CODES.SUCCESS,
      targetPath,
      summary: {
        planned: 1,
        applied: 0,
        skipped: 0,
        failed: 0,
      },
      items: [
        {
          action: "create",
          target: path.relative(cwd, manifestPath),
          status: "planned",
          details: { manifest },
        },
      ],
    });
  }

  writeManifestFile(manifestPath, manifest);
  return createReport({
    command: "export",
    ok: true,
    exitCode: EXIT_CODES.SUCCESS,
    targetPath,
    summary: {
      planned: 0,
      applied: 1,
      skipped: 0,
      failed: 0,
    },
    items: [
      {
        action: "create",
        target: path.relative(cwd, manifestPath),
        status: "applied",
        details: {
          components: componentSpecs.length,
          templates: templateSpecs.length,
          routes: routeSpecs.length,
        },
      },
    ],
  });
}

module.exports = { runExport, DEFAULT_MANIFEST_NAME };
