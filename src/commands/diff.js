const { readConfig } = require("../services/config");
const { resolveRepo } = require("../services/source-resolver");
const { createReport } = require("../services/report");
const { EXIT_CODES } = require("../constants");

async function runDiff(context) {
  const { cwd, flags } = context;
  const { config } = readConfig(cwd);
  const resolved = resolveRepo(config, flags.repo);
  const hasMismatch = resolved.repo.connected === false;

  const items = [
    {
      component: "*",
      action: hasMismatch ? "update" : "noop",
      files: [],
      dependencies: [],
      details: hasMismatch
        ? "Repo is configured but disconnected; update required before sync."
        : "Diff engine not fully migrated yet; config-only verification passed.",
    },
  ];
  const warnings = hasMismatch
    ? ["Repo is disconnected; diff reports pending reconnect."]
    : ["Diff implementation is currently minimal."];
  const ciMismatch = Boolean(flags.ci && hasMismatch);
  const exitCode = ciMismatch ? EXIT_CODES.VERIFY_DIFF_MISMATCH : EXIT_CODES.SUCCESS;

  return createReport({
    command: "diff",
    ok: !hasMismatch,
    exitCode,
    repoSelector: flags.repo || resolved.repoName,
    targetPath: config.targetPath,
    summary: { checked: 1, changed: hasMismatch ? 1 : 0, warnings: warnings.length, errors: 0 },
    items,
    warnings,
  });
}

module.exports = { runDiff };
