const path = require("node:path");
const { readConfig, writeConfigAtomic, getConfigPath } = require("../services/config");
const { createReport } = require("../services/report");
const { parseConnectPairs, usageError } = require("../parser");
const { resolvePolicy } = require("../services/policy");
const {
  buildDiscoveryReport,
  matchRepoCandidate,
  materializeAndDiscover,
} = require("../services/connect-discovery");
const {
  confirmYesNo,
  isInteractiveTerminal,
  nonInteractiveAskError,
  promptSelectMany,
  promptSelectOne,
  userRejected,
} = require("../services/interactive");
const { EXIT_CODES } = require("../constants");

const LEGACY_DEPRECATION_WARNING =
  "connect: --repo/--url flag pairs are deprecated; use `qui connect <url> [repo [...uilibs]]`.";

function isLegacyConnectSyntax(rawArgv) {
  return rawArgv.some((token) => token === "--repo");
}

function printDiscoveryListing(searchLevels, candidates) {
  process.stdout.write(`Discovering repos (search-levels=${searchLevels})…\n\n`);
  process.stdout.write("Repos:\n");
  for (let i = 0; i < candidates.length; i += 1) {
    const c = candidates[i];
    const uilibList = c.uilibs.length > 0 ? c.uilibs.join(", ") : "(none)";
    process.stdout.write(`  ${i + 1}) ${c.id} → uilibs: ${uilibList}\n`);
  }
  process.stdout.write("\n");
}

function printConnectUpdatePlan(cwd, config) {
  const configPath = path.resolve(getConfigPath(cwd));
  const targetDir = path.resolve(cwd, config.targetPath);
  process.stdout.write("Command will update:\n");
  process.stdout.write(` ${configPath}\n`);
  process.stdout.write("Target folder:\n");
  process.stdout.write(` ${targetDir}\n\n`);
}

function isExplicitConnect(repoPositional, uilibPositionals, flags) {
  return Boolean(repoPositional) && (uilibPositionals.length > 0 || flags.all);
}

function mergeUilibs(existingUilibs, incomingUilibs) {
  const existing = [...existingUilibs];
  const added = incomingUilibs.filter((name) => !existing.includes(name));
  return {
    uilibs: [...existing, ...added],
    added,
    existing,
  };
}

function buildConnectFooterLines(repoId, exists, mergeResult) {
  if (!exists) {
    return [`Connected ${repoId} with uilibs: ${mergeResult.uilibs.join(", ")}`];
  }
  const lines = [
    `Repo '${repoId}' already exists in qui.config.json with uilibs: ${mergeResult.existing.join(", ")}`,
  ];
  if (mergeResult.added.length > 0) {
    lines.push(`Added uilibs: ${mergeResult.added.join(", ")}`);
  }
  return lines;
}

function shouldSkipConnectConfirm(flags) {
  return Boolean(flags.yes || flags.force || flags.auto);
}

function buildRemovePlan(repoId, existingRepo, uilibsToRemove, configPath) {
  if (uilibsToRemove.length === 0) {
    return {
      removeEntireRepo: true,
      remainingUilibs: [],
      description: [
        "Will remove repo:",
        `  ${repoId}`,
        "From config:",
        `  ${configPath}`,
        `Configured uilibs: ${existingRepo.uilibs.join(", ")}`,
      ].join("\n"),
    };
  }

  const remainingUilibs = existingRepo.uilibs.filter((name) => !uilibsToRemove.includes(name));
  const removeEntireRepo = remainingUilibs.length === 0;
  if (removeEntireRepo) {
    return {
      removeEntireRepo: true,
      remainingUilibs,
      description: [
        "Will remove uilib(s):",
        `  ${uilibsToRemove.join(", ")}`,
        `From repo: ${repoId}`,
        "Repo will be removed (no uilibs would remain).",
        "Config:",
        `  ${configPath}`,
      ].join("\n"),
    };
  }

  return {
    removeEntireRepo: false,
    remainingUilibs,
    description: [
      "Will remove uilib(s):",
      `  ${uilibsToRemove.join(", ")}`,
      `From repo: ${repoId}`,
      `Remaining uilibs: ${remainingUilibs.join(", ")}`,
      "Config:",
      `  ${configPath}`,
    ].join("\n"),
  };
}

async function confirmConnectRemove(description, flags) {
  if (flags.dryRun || shouldSkipConnectConfirm(flags)) {
    return;
  }
  if (!isInteractiveTerminal()) {
    throw nonInteractiveAskError("Remove operation requires confirmation.");
  }
  const ok = await confirmYesNo(`${description}\n\nProceed with removal?`);
  if (!ok) {
    throw userRejected("Declined remove operation.");
  }
}

async function runConnectRemove(context) {
  const { cwd, positionals, flags } = context;
  const { config } = readConfig(cwd);

  if (positionals.length === 0) {
    usageError("connect --remove requires <repo> [uilib...].");
  }
  if (flags.all) {
    usageError("connect --remove cannot be combined with --all.");
  }

  const repoId = positionals[0];
  const uilibsToRemove = positionals.slice(1);
  const existingRepo = config.repos[repoId];
  if (!existingRepo) {
    usageError(`Repo '${repoId}' not found in qui.config.json.`);
  }

  for (const uilib of uilibsToRemove) {
    if (!existingRepo.uilibs.includes(uilib)) {
      usageError(
        `Uilib '${uilib}' is not configured for repo '${repoId}'. Configured: ${existingRepo.uilibs.join(", ")}`
      );
    }
  }

  const configPath = path.resolve(getConfigPath(cwd));
  const plan = buildRemovePlan(repoId, existingRepo, uilibsToRemove, configPath);

  if (plan.removeEntireRepo && Object.keys(config.repos).length === 1) {
    usageError("Cannot remove the last repo from qui.config.json.");
  }

  if (!flags.json) {
    process.stdout.write(`${plan.description}\n\n`);
  }

  await confirmConnectRemove(plan.description, flags);

  const nextConfig = JSON.parse(JSON.stringify(config));
  const itemStatus = flags.dryRun ? "planned" : "applied";
  let items;
  let footerLines;

  if (plan.removeEntireRepo) {
    delete nextConfig.repos[repoId];
    items = [
      {
        action: "delete",
        target: `repos.${repoId}`,
        status: itemStatus,
        details: {
          repo: repoId,
          removedUilibs: [...existingRepo.uilibs],
        },
      },
    ];
    footerLines = [`Removed repo '${repoId}'.`];
  } else {
    nextConfig.repos[repoId] = {
      ...existingRepo,
      uilibs: plan.remainingUilibs,
    };
    items = [
      {
        action: "modify",
        target: `repos.${repoId}`,
        status: itemStatus,
        details: {
          repo: repoId,
          removedUilibs: uilibsToRemove,
          uilibs: plan.remainingUilibs,
        },
      },
    ];
    footerLines = [
      `Removed uilib(s) from '${repoId}': ${uilibsToRemove.join(", ")}`,
      `Remaining uilibs: ${plan.remainingUilibs.join(", ")}`,
    ];
  }

  const warnings = [];
  if (!flags.dryRun) {
    writeConfigAtomic(cwd, nextConfig);
  } else {
    warnings.push("--dry-run: qui.config.json was not modified.");
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
    warnings,
    targetPath: nextConfig.targetPath,
    footer: footerLines,
  });
}

async function confirmRepoOverwrite(repoId, exists, policy, flags) {
  if (!exists) return;

  if (!flags.dryRun && policy.onError === "fail" && !flags.force && !flags.auto && !flags.yes) {
    const err = new Error(
      `Repo '${repoId}' already exists. Failing due to onError=fail policy.`
    );
    err.exitCode = EXIT_CODES.POLICY_FAIL_STOP;
    throw err;
  }
  if (
    !flags.dryRun &&
    policy.onError === "ask" &&
    !flags.force &&
    !flags.auto &&
    !flags.yes
  ) {
    if (policy.interactive === false || !isInteractiveTerminal()) {
      throw nonInteractiveAskError(`Repo '${repoId}' already exists.`);
    }
    const ok = await confirmYesNo(`Overwrite existing repo '${repoId}'?`);
    if (!ok) {
      throw userRejected("Declined repo overwrite.");
    }
  }
}

async function runConnectLegacy(context) {
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
  const warnings = [LEGACY_DEPRECATION_WARNING];

  for (const pair of pairs) {
    const exists = Boolean(config.repos[pair.repo]);
    await confirmRepoOverwrite(pair.repo, exists, policy, flags);
    nextConfig.repos[pair.repo] = {
      url: pair.url,
      componentsRoot,
      uilibs,
      connected,
    };
    items.push({
      action: exists ? "modify" : "create",
      target: `repos.${pair.repo}`,
      status: flags.dryRun ? "planned" : "applied",
      details: { url: pair.url, componentsRoot, uilibs },
    });
  }

  if (!flags.dryRun) {
    writeConfigAtomic(cwd, nextConfig);
  }
  if (flags.dryRun) {
    warnings.push("--dry-run: qui.config.json was not modified.");
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
    warnings,
    targetPath: nextConfig.targetPath,
  });
}

async function runConnectModern(context) {
  const { cwd, positionals, flags } = context;
  const { config } = readConfig(cwd);
  const policy = resolvePolicy(flags, config.policy);

  if (positionals.length === 0) {
    usageError("connect requires <url> as the first positional argument.");
  }

  if (flags.all && positionals.length > 2) {
    usageError("--all cannot be combined with explicit uilib positional names.");
  }

  const inputUrl = positionals[0];
  const repoPositional = positionals[1] || null;
  const uilibPositionals = flags.all ? [] : positionals.slice(2);

  if (!flags.all && !repoPositional && uilibPositionals.length > 0) {
    usageError("Uilib positionals require a repo positional after <url>.");
  }

  const connected = flags.connected ? flags.connected === "true" : true;
  const componentsDirName = flags.componentsRoot || "components";
  const explicitConnect = isExplicitConnect(repoPositional, uilibPositionals, flags);

  const materialized = materializeAndDiscover(cwd, inputUrl, {
    searchLevels: flags.searchLevels,
    componentsDirName,
  });

  try {
    const { candidates, warnings: discoveryWarnings, searchLevels } = materialized;

    if (candidates.length === 0) {
      usageError("No component repositories discovered at the connect URL.");
    }

    if (!flags.json && !explicitConnect) {
      printDiscoveryListing(searchLevels, candidates);
      for (const warning of discoveryWarnings) {
        process.stdout.write(`Warning: ${warning}\n`);
      }
      if (discoveryWarnings.length > 0) process.stdout.write("\n");
    }

    let selectedCandidate;
    if (repoPositional) {
      selectedCandidate = matchRepoCandidate(candidates, repoPositional);
    } else if (candidates.length === 1) {
      selectedCandidate = candidates[0];
    } else if (isInteractiveTerminal()) {
      const choice = await promptSelectOne(
        "Select repo:",
        candidates.map((c) => ({
          label: `${c.id} → uilibs: ${c.uilibs.join(", ") || "(none)"}`,
          value: c.id,
        }))
      );
      selectedCandidate = candidates.find((c) => c.id === choice);
    } else {
      const discovery = buildDiscoveryReport(inputUrl, searchLevels, candidates);
      const report = createReport({
        command: "connect",
        ok: false,
        exitCode: EXIT_CODES.USAGE_PARSER_ERROR,
        summary: { planned: 0, applied: 0, skipped: 0, failed: 0 },
        items: [],
        warnings: discoveryWarnings,
        errors: [
          "Multiple repositories discovered; specify [repo] in non-interactive mode.",
        ],
        targetPath: config.targetPath,
      });
      report.discovery = discovery;
      return report;
    }

    if (!selectedCandidate) {
      usageError("Failed to resolve selected repository.");
    }

    let selectedUilibs;
    if (flags.all) {
      selectedUilibs = [...selectedCandidate.uilibs];
    } else if (uilibPositionals.length > 0) {
      selectedUilibs = [];
      for (const name of uilibPositionals) {
        if (!selectedCandidate.uilibs.includes(name)) {
          usageError(
            `Unknown uilib '${name}' for repo '${selectedCandidate.id}'. Available: ${selectedCandidate.uilibs.join(", ") || "(none)"}`
          );
        }
        selectedUilibs.push(name);
      }
    } else if (selectedCandidate.uilibs.length === 1) {
      selectedUilibs = [...selectedCandidate.uilibs];
    } else if (isInteractiveTerminal()) {
      selectedUilibs = await promptSelectMany(
        `Select uilibs for ${selectedCandidate.id}:`,
        selectedCandidate.uilibs.map((name) => ({ label: name, value: name })),
        {
          beforeQuestion: () => {
            if (!flags.json) printConnectUpdatePlan(cwd, config);
          },
        }
      );
    } else {
      throw nonInteractiveAskError(
        `Repo '${selectedCandidate.id}' has multiple uilibs; use --all or list uilib names.`
      );
    }

    if (selectedUilibs.length === 0) {
      usageError(`Repo '${selectedCandidate.id}' has no connectable uilibs.`);
    }

    const repoId = selectedCandidate.id;
    const existingRepo = config.repos[repoId];
    const exists = Boolean(existingRepo);

    let mergeResult;
    if (exists && explicitConnect) {
      mergeResult = mergeUilibs(existingRepo.uilibs, selectedUilibs);
    } else {
      if (exists) {
        await confirmRepoOverwrite(repoId, exists, policy, flags);
      }
      mergeResult = {
        uilibs: selectedUilibs,
        added: selectedUilibs,
        existing: exists ? [...existingRepo.uilibs] : [],
      };
    }

    const nextConfig = JSON.parse(JSON.stringify(config));
    nextConfig.repos[repoId] = {
      url: selectedCandidate.storedUrl,
      componentsRoot: selectedCandidate.componentsRoot,
      uilibs: mergeResult.uilibs,
      connected,
    };

    const itemStatus = flags.dryRun ? "planned" : "applied";
    const items = [
      {
        action: exists ? "modify" : "create",
        target: `repos.${repoId}`,
        status: itemStatus,
        details: {
          url: selectedCandidate.storedUrl,
          componentsRoot: selectedCandidate.componentsRoot,
          uilibs: mergeResult.uilibs,
          addedUilibs: mergeResult.added,
        },
      },
    ];

    const warnings = [...discoveryWarnings];
    if (!flags.dryRun) {
      writeConfigAtomic(cwd, nextConfig);
    } else {
      warnings.push("--dry-run: qui.config.json was not modified.");
    }

    const discovery = buildDiscoveryReport(
      inputUrl,
      searchLevels,
      candidates,
      repoId
    );

    const footerLines =
      exists && explicitConnect
        ? buildConnectFooterLines(repoId, true, mergeResult)
        : [`Connected ${repoId} with uilibs: ${mergeResult.uilibs.join(", ")}`];

    const report = createReport({
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
      warnings,
      targetPath: nextConfig.targetPath,
      footer: footerLines,
    });
    report.discovery = discovery;
    return report;
  } finally {
    materialized.cleanup();
  }
}

async function runConnect(context) {
  if (context.flags.remove) {
    return runConnectRemove(context);
  }
  if (isLegacyConnectSyntax(context.rawArgv)) {
    return runConnectLegacy(context);
  }
  return runConnectModern(context);
}

module.exports = {
  runConnect,
  buildRemovePlan,
  shouldSkipConnectConfirm,
};
