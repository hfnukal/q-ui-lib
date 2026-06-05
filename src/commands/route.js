const { readConfig } = require("../services/config");
const { ensureRelativeUnderCwd } = require("../services/component-files");
const { resolvePolicy } = require("../services/policy");
const { createReport } = require("../services/report");
const { EXIT_CODES } = require("../constants");
const { parseUilibPackSpec, syncUilibPack } = require("../services/uilib-pack");

const DEFAULT_ROUTES_PATH = "src/routes";

function usageError(message) {
  const err = new Error(message);
  err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
  throw err;
}

async function runRoute(context) {
  const { cwd, flags, positionals } = context;
  if (positionals.length !== 1) {
    usageError("route requires exactly one positional: <repo>/<uilib>/<folder>[/<subpath...>].");
  }

  const { config } = readConfig(cwd);
  const policy = resolvePolicy(flags, config.policy);
  const routesPath = flags.routesPath || DEFAULT_ROUTES_PATH;
  const targetRoot = ensureRelativeUnderCwd(cwd, routesPath);
  const parsed = parseUilibPackSpec(positionals[0]);

  const { items, warnings, packSpec } = await syncUilibPack({
    cwd,
    config,
    spec: positionals[0],
    packKind: "routes",
    targetRoot,
    targetSubpath: parsed.subpath,
    policy,
    flags,
  });

  return createReport({
    command: "route",
    ok: true,
    exitCode: EXIT_CODES.SUCCESS,
    repoSelector: packSpec,
    targetPath: routesPath,
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

module.exports = { runRoute, DEFAULT_ROUTES_PATH };
