const { readConfig } = require("../services/config");
const { ensureRelativeUnderCwd } = require("../services/component-files");
const { resolvePolicy } = require("../services/policy");
const { createReport } = require("../services/report");
const { EXIT_CODES } = require("../constants");
const { parseUilibPackSpec, syncUilibPack } = require("../services/uilib-pack");

const DEFAULT_TEMPLATE_TARGET = "src";

function usageError(message) {
  const err = new Error(message);
  err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
  throw err;
}

async function runTemplate(context) {
  const { cwd, flags, positionals } = context;
  if (positionals.length !== 1) {
    usageError("template requires exactly one positional: <repo>/<uilib>/<folder>[/<subpath...>].");
  }

  const { config } = readConfig(cwd);
  const policy = resolvePolicy(flags, config.policy);
  const templateTarget = flags.templatePath || DEFAULT_TEMPLATE_TARGET;
  const targetRoot = ensureRelativeUnderCwd(cwd, templateTarget);
  const parsed = parseUilibPackSpec(positionals[0]);

  const { items, warnings, packSpec } = await syncUilibPack({
    cwd,
    config,
    spec: positionals[0],
    packKind: "template",
    targetRoot,
    targetSubpath: parsed.subpath,
    policy,
    flags,
  });

  return createReport({
    command: "template",
    ok: true,
    exitCode: EXIT_CODES.SUCCESS,
    repoSelector: packSpec,
    targetPath: templateTarget,
    summary: {
      planned: items.filter((x) => x.status === "planned").length,
      applied: items.filter((x) => x.status === "applied").length,
      skipped: items.filter((x) => x.status === "skipped").length,
      failed: 0,
    },
    items,
    warnings,
  });
}

module.exports = { runTemplate, DEFAULT_TEMPLATE_TARGET };
