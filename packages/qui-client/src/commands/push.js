const fs = require("node:fs");
const path = require("node:path");
const { readConfig } = require("../services/config");
const { resolveSourceContext } = require("../services/source-resolver");
const { ensureRelativeUnderCwd } = require("../services/component-files");
const { createReport } = require("../services/report");
const { runPushWorkflow, stripGitFragment } = require("../services/push-repo");
const { EXIT_CODES } = require("../constants");

function normalizeUrl(u) {
  return stripGitFragment(String(u || "")).replace(/\/$/, "");
}

function parseRepoUilib(flagsRepo) {
  const parts = String(flagsRepo || "").split("/");
  if (parts.length !== 2 || !parts[0] || !parts[1]) {
    const err = new Error("push requires --repo <repo>/<uilib> (exactly one slash).");
    err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
    throw err;
  }
  return { repoKey: parts[0], uilib: parts[1] };
}

function validateMetaForPush(meta, flagsRepo, repoUrl) {
  if (!meta || typeof meta !== "object") {
    const err = new Error("meta.generated.json missing or invalid.");
    err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
    throw err;
  }
  if (meta.quiSource) {
    if (meta.quiSource.repo && meta.quiSource.repo !== flagsRepo) {
      const err = new Error(
        `meta.quiSource.repo '${meta.quiSource.repo}' does not match --repo '${flagsRepo}'.`,
      );
      err.exitCode = EXIT_CODES.POLICY_FAIL_STOP;
      throw err;
    }
    if (meta.quiSource.url && normalizeUrl(meta.quiSource.url) !== normalizeUrl(repoUrl)) {
      const err = new Error("meta.quiSource.url does not match configured repo URL (metadata drift).");
      err.exitCode = EXIT_CODES.POLICY_FAIL_STOP;
      throw err;
    }
  }
}

async function runPush(context) {
  const { cwd, flags, positionals } = context;
  if (!flags.repo) {
    const err = new Error("push requires --repo <repo/uilib>.");
    err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
    throw err;
  }
  if (positionals.length === 0) {
    const err = new Error("push requires at least one component.");
    err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
    throw err;
  }

  const { repoKey, uilib } = parseRepoUilib(flags.repo);
  const { config } = readConfig(cwd);
  const source = resolveSourceContext(cwd, config, flags.repo);
  if (source.repoName !== repoKey) {
    const err = new Error(`Resolved repo '${source.repoName}' does not match --repo key '${repoKey}'.`);
    err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
    throw err;
  }
  if (source.targetUilib !== uilib) {
    const err = new Error(`Resolved uilib '${source.targetUilib}' does not match --repo uilib '${uilib}'.`);
    err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
    throw err;
  }

  const targetPath = flags.targetPath || config.targetPath;
  const targetDir = ensureRelativeUnderCwd(cwd, targetPath);
  if (source.remoteUrl.startsWith("file://")) {
    const err = new Error("push requires a git remote URL (https/ssh/git@), not file://.");
    err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
    throw err;
  }

  const sourceAppComponentDirs = {};
  for (const slug of positionals) {
    const compDir = path.join(targetDir, slug);
    const metaPath = path.join(compDir, "meta.generated.json");
    if (!fs.existsSync(metaPath)) {
      const err = new Error(`Cannot push missing component: ${slug}`);
      err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
      throw err;
    }
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
    validateMetaForPush(meta, flags.repo, source.repo.url);
    sourceAppComponentDirs[slug] = compDir;
  }

  const baseBranch = flags.baseBranch || null;
  const commitTitle = flags.title || `qui push: ${positionals.join(", ")}`;
  const dryRun = Boolean(flags.dryRun);

  try {
    const result = runPushWorkflow({
      remoteUrl: source.repo.url,
      baseBranch,
      uilib,
      slugs: positionals,
      sourceAppComponentDirs,
      commitMessage: commitTitle,
      dryRun,
      branchName: flags.branch || null,
    });

    const applied = result.items.filter((i) => i.status === "applied").length;
    const planned = result.items.filter((i) => i.status === "planned").length;

    return createReport({
      command: "push",
      ok: true,
      exitCode: EXIT_CODES.SUCCESS,
      repoSelector: flags.repo,
      targetPath,
      summary: {
        planned: dryRun ? planned : 0,
        applied: dryRun ? 0 : applied,
        skipped: 0,
        failed: 0,
      },
      items: result.items.map((item) => ({
        ...item,
        details: {
          branch: result.branch,
          committed: result.committed,
          pushed: result.pushed,
          dryRun,
        },
      })),
      warnings: result.warnings,
    });
  } catch (e) {
    if (Number.isInteger(e.exitCode)) throw e;
    const err = new Error(e.message || "push failed.");
    err.exitCode = EXIT_CODES.SOURCE_GIT_NETWORK_ERROR;
    throw err;
  }
}

module.exports = { runPush };
