const { readConfig } = require("../services/config");
const { createReport } = require("../services/report");
const { resolveRepo } = require("../services/source-resolver");
const { EXIT_CODES } = require("../constants");

async function runVerify(context) {
  const { cwd, flags } = context;
  const { config } = readConfig(cwd);
  const resolved = resolveRepo(config, flags.repo);
  const hasError = resolved.repo.connected === false;

  const items = [
    {
      component: "*",
      status: hasError ? "error" : "ok",
      code: hasError ? "REPO_NOT_CONNECTED" : "CONFIG_VALID",
      message: hasError
        ? `Repo '${resolved.repoName}' is present but not connected.`
        : `Repo '${resolved.repoName}' is configured.`,
      details: {
        url: resolved.repo.url,
        componentsRoot: resolved.repo.componentsRoot,
      },
    },
  ];
  const errors = hasError ? [`Repo '${resolved.repoName}' is not connected.`] : [];
  const ciMismatch = Boolean(flags.ci && errors.length > 0);
  const exitCode = ciMismatch ? EXIT_CODES.VERIFY_DIFF_MISMATCH : hasError ? EXIT_CODES.CONFIG_SCHEMA_ERROR : EXIT_CODES.SUCCESS;

  return createReport({
    command: "verify",
    ok: errors.length === 0,
    exitCode,
    repoSelector: flags.repo || resolved.repoName,
    targetPath: config.targetPath,
    summary: { checked: items.length, changed: 0, warnings: 0, errors: errors.length },
    items,
    errors,
  });
}

module.exports = { runVerify };
