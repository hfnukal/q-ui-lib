const { readConfig, writeConfigAtomic } = require("../services/config");
const { createReport } = require("../services/report");
const { parseConnectPairs } = require("../parser");
const { resolvePolicy } = require("../services/policy");
const {
  confirmYesNo,
  isInteractiveTerminal,
  nonInteractiveAskError,
  userRejected,
} = require("../services/interactive");
const { EXIT_CODES } = require("../constants");

async function runConnect(context) {
  const { cwd, rawArgv, flags } = context;
  const pairs = parseConnectPairs(rawArgv);
  const { config } = readConfig(cwd);
  const policy = resolvePolicy(flags, config.policy);

  const componentsRoot = flags.componentsRoot || "components";
  const uilibs = flags.uilibs
    ? flags.uilibs.split(",").map((x) => x.trim()).filter(Boolean)
    : ["base"];
  const connected = flags.connected ? flags.connected === "true" : true;

  const nextConfig = JSON.parse(JSON.stringify(config));
  const items = [];
  for (const pair of pairs) {
    const exists = Boolean(nextConfig.repos[pair.repo]);
    if (exists && policy.onError === "fail" && !flags.force && !flags.auto && !flags.yes) {
      const err = new Error(
        `Repo '${pair.repo}' already exists. Failing due to onError=fail policy.`
      );
      err.exitCode = EXIT_CODES.POLICY_FAIL_STOP;
      throw err;
    }
    if (
      exists &&
      policy.onError === "ask" &&
      !flags.force &&
      !flags.auto &&
      !flags.yes &&
      !flags.dryRun
    ) {
      if (policy.interactive === false || !isInteractiveTerminal()) {
        throw nonInteractiveAskError(`Repo '${pair.repo}' already exists.`);
      }
      const ok = await confirmYesNo(`Overwrite existing repo '${pair.repo}'?`);
      if (!ok) {
        throw userRejected("Declined repo overwrite.");
      }
    }
    nextConfig.repos[pair.repo] = {
      url: pair.url,
      componentsRoot,
      uilibs,
      connected,
    };
    const itemStatus = flags.dryRun ? "planned" : "applied";
    items.push({
      action: exists ? "modify" : "create",
      target: `repos.${pair.repo}`,
      status: itemStatus,
      details: { url: pair.url },
    });
  }
  if (!flags.dryRun) {
    writeConfigAtomic(cwd, nextConfig);
  }

  return createReport({
    command: "connect",
    ok: true,
    exitCode: EXIT_CODES.SUCCESS,
    summary: {
      planned: items.filter((x) => x.status === "planned").length,
      applied: items.filter((x) => x.status === "applied").length,
      skipped: 0,
      failed: 0,
    },
    items,
    warnings: flags.dryRun ? ["--dry-run: qui.config.json was not modified."] : [],
    targetPath: nextConfig.targetPath,
  });
}

module.exports = { runConnect };
