const fs = require("node:fs");
const path = require("node:path");
const { readConfig } = require("../services/config");
const { resolveSourceContext } = require("../services/source-resolver");
const { createReport } = require("../services/report");
const { resolvePushComponents } = require("../services/push-resolve");
const { runPushWorkflow, stripGitFragment } = require("../services/push-repo");
const { isInteractiveTerminal, promptText } = require("../services/interactive");
const { resolvePolicy } = require("../services/policy");
const { EXIT_CODES } = require("../constants");

function normalizeUrl(u) {
  return stripGitFragment(String(u || "")).replace(/\/$/, "");
}

function validateMetaForPush(meta, repoSelector, repoUrl) {
  if (!meta || typeof meta !== "object") {
    const err = new Error("meta.generated.json missing or invalid.");
    err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
    throw err;
  }
  if (meta.quiSource) {
    if (meta.quiSource.repo && meta.quiSource.repo !== repoSelector) {
      const err = new Error(
        `meta.quiSource.repo '${meta.quiSource.repo}' does not match '${repoSelector}'.`,
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
  const { config } = readConfig(cwd);
  const pushScope = resolvePushComponents(cwd, config, positionals, flags);
  const source = resolveSourceContext(cwd, config, pushScope.repoSelector);

  if (source.repoName !== pushScope.repoName) {
    const err = new Error(
      `Resolved repo '${source.repoName}' does not match push target '${pushScope.repoName}'.`,
    );
    err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
    throw err;
  }
  if (source.targetUilib !== pushScope.uilib) {
    const err = new Error(
      `Resolved uilib '${source.targetUilib}' does not match push target '${pushScope.uilib}'.`,
    );
    err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
    throw err;
  }
  if (source.remoteUrl.startsWith("file://")) {
    const err = new Error("push requires a git remote URL (https/ssh/git@), not file://.");
    err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
    throw err;
  }

  const sourceAppComponentDirs = {};
  for (const component of pushScope.components) {
    const metaPath = path.join(component.dir, "meta.generated.json");
    if (!fs.existsSync(metaPath)) {
      const err = new Error(`Cannot push missing component: ${component.spec}`);
      err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
      throw err;
    }
    const meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
    validateMetaForPush(meta, pushScope.repoSelector, source.repo.url);
    sourceAppComponentDirs[component.slug] = component.dir;
  }

  const slugs = pushScope.components.map((component) => component.slug);
  const baseBranch = flags.baseBranch || null;
  const defaultTitle = `qui push: ${pushScope.components.map((component) => component.spec).join(", ")}`;
  const policy = resolvePolicy(flags, config.policy);
  let commitTitle = flags.title;
  if (!commitTitle) {
    if (policy.interactive !== false && isInteractiveTerminal()) {
      commitTitle = await promptText("Commit title (also used as PR title)", defaultTitle);
    } else {
      commitTitle = defaultTitle;
    }
  }
  const dryRun = Boolean(flags.dryRun);

  try {
    const result = runPushWorkflow({
      remoteUrl: source.repo.url,
      baseBranch,
      componentsRoot: source.repo.componentsRoot,
      uilib: pushScope.uilib,
      slugs,
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
      repoSelector: pushScope.repoSelector,
      targetPath: pushScope.targetPath,
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
          baseBranch: result.baseBranch,
          committed: result.committed,
          pushed: result.pushed,
          pullRequest: result.pullRequest,
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
