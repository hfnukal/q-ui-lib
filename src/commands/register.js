const fs = require("node:fs");
const path = require("node:path");
const { readConfig, writeConfigAtomic } = require("../services/config");
const { ensureRelativeUnderCwd } = require("../services/component-files");
const { createReport } = require("../services/report");
const { hasRootIndex } = require("../services/component-catalog");
const { EXIT_CODES } = require("../constants");

function usageError(message) {
  const err = new Error(message);
  err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
  throw err;
}

function parseRegisterSpec(spec) {
  const trimmed = String(spec).trim().replace(/\/+$/, "");
  const parts = trimmed.split("/").filter(Boolean);
  if (parts.length !== 2) {
    usageError(
      "register requires exactly one positional: <repo>/<uilib>/ (trailing slash optional)."
    );
  }
  return { repo: parts[0], uilib: parts[1] };
}

function listLocalUilibSlugs(targetDir, uilib) {
  const uilibDir = path.join(targetDir, uilib);
  if (!fs.existsSync(uilibDir) || !fs.statSync(uilibDir).isDirectory()) {
    return null;
  }
  const slugs = [];
  for (const slug of fs.readdirSync(uilibDir)) {
    const componentDir = path.join(uilibDir, slug);
    if (!fs.statSync(componentDir).isDirectory()) continue;
    if (hasRootIndex(componentDir)) slugs.push(slug);
  }
  return slugs.sort();
}

async function runRegister(context) {
  const { cwd, flags, positionals } = context;
  if (positionals.length !== 1) {
    usageError("register requires exactly one positional: <repo>/<uilib>/.");
  }

  const { repo, uilib } = parseRegisterSpec(positionals[0]);
  const { config, configPath } = readConfig(cwd);
  const targetPath = flags.targetPath || config.targetPath;
  const targetDir = ensureRelativeUnderCwd(cwd, targetPath);

  const repoEntry = config.repos[repo];
  if (!repoEntry) {
    const err = new Error(
      `Repo '${repo}' is not in qui.config.json. Connect it first with 'qui connect <url> ${repo} …'.`
    );
    err.exitCode = EXIT_CODES.CONFIG_SCHEMA_ERROR;
    throw err;
  }

  const slugs = listLocalUilibSlugs(targetDir, uilib);
  if (slugs === null) {
    const err = new Error(
      `Uilib '${uilib}' not found under '${targetPath}/'. Install or clone components there first.`
    );
    err.exitCode = EXIT_CODES.SOURCE_GIT_NETWORK_ERROR;
    throw err;
  }
  if (slugs.length === 0) {
    const err = new Error(
      `Uilib '${uilib}' under '${targetPath}/' has no components (missing index.tsx/index.ts).`
    );
    err.exitCode = EXIT_CODES.SOURCE_GIT_NETWORK_ERROR;
    throw err;
  }

  const existingUilibs = repoEntry.uilibs || [];
  const alreadyRegistered = existingUilibs.includes(uilib);
  const warnings = [];
  if (!repoEntry.connected) {
    warnings.push(`Repo '${repo}' is marked connected: false in qui.config.json.`);
  }

  const items = [];
  if (alreadyRegistered) {
    items.push({
      action: "noop",
      target: "qui.config.json",
      status: "skipped",
      details: { repo, uilib, reason: "already_registered" },
    });
    return createReport({
      command: "register",
      ok: true,
      exitCode: EXIT_CODES.SUCCESS,
      repoSelector: `${repo}/${uilib}`,
      targetPath,
      summary: { planned: 0, applied: 0, skipped: 1, failed: 0 },
      items,
      warnings,
      details: { components: slugs.length, slugs },
    });
  }

  const nextConfig = {
    ...config,
    repos: {
      ...config.repos,
      [repo]: {
        ...repoEntry,
        uilibs: [...existingUilibs, uilib],
      },
    },
  };

  if (flags.dryRun) {
    items.push({
      action: "modify",
      target: path.relative(cwd, configPath),
      status: "planned",
      details: { repo, uilib, added: true },
    });
  } else {
    writeConfigAtomic(cwd, nextConfig);
    items.push({
      action: "modify",
      target: path.relative(cwd, configPath),
      status: "applied",
      details: { repo, uilib, added: true },
    });
  }

  return createReport({
    command: "register",
    ok: true,
    exitCode: EXIT_CODES.SUCCESS,
    repoSelector: `${repo}/${uilib}`,
    targetPath,
    summary: {
      planned: items.filter((x) => x.status === "planned").length,
      applied: items.filter((x) => x.status === "applied").length,
      skipped: 0,
      failed: 0,
    },
    items,
    warnings,
    details: { components: slugs.length, slugs },
  });
}

module.exports = { runRegister, parseRegisterSpec, listLocalUilibSlugs };
