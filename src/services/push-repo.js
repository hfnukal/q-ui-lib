const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { runGitWithRetry } = require("./git");
const { EXIT_CODES } = require("../constants");

function stripGitFragment(url) {
  const i = String(url).indexOf("#");
  return i >= 0 ? String(url).slice(0, i) : String(url);
}

function parseGitHubRepo(remoteUrl) {
  const normalized = stripGitFragment(remoteUrl);
  const match = normalized.match(/github\.com[/:]([^/]+)\/([^/.]+?)(?:\.git)?$/i);
  if (!match) return null;
  return `${match[1]}/${match[2]}`;
}

function commandExists(command) {
  const result = spawnSync("which", [command], { encoding: "utf8" });
  return result.status === 0;
}

function normalizeBaseBranch(checkedOut) {
  if (!checkedOut) return "main";
  return String(checkedOut).replace(/^origin\//, "");
}

function cloneRepo(cloneUrl, destDir) {
  if (fs.existsSync(destDir)) {
    fs.rmSync(destDir, { recursive: true, force: true });
  }
  fs.mkdirSync(path.dirname(destDir), { recursive: true });
  runGitWithRetry(["clone", "--depth", "1", cloneUrl, destDir], { cwd: os.tmpdir() });
}

function tryCheckoutBase(cloneDir, baseBranch) {
  const candidates = [...new Set([baseBranch, "main", "master"].filter(Boolean))];
  for (const b of candidates) {
    try {
      runGitWithRetry(["checkout", b], { cwd: cloneDir });
      return b;
    } catch {
      try {
        runGitWithRetry(["fetch", "--depth", "1", "origin", b], { cwd: cloneDir });
        runGitWithRetry(["checkout", b], { cwd: cloneDir });
        return b;
      } catch {
        try {
          runGitWithRetry(["checkout", `origin/${b}`], { cwd: cloneDir });
          return `origin/${b}`;
        } catch {
          /* try next */
        }
      }
    }
  }
  return null;
}

function gitStatusPorcelain(cloneDir) {
  const r = runGitWithRetry(["status", "--porcelain"], { cwd: cloneDir });
  return (r.stdout || "").trim();
}

function commitAll(cloneDir, message) {
  const status = gitStatusPorcelain(cloneDir);
  if (!status) return false;
  runGitWithRetry(["add", "-A"], { cwd: cloneDir });
  runGitWithRetry(["commit", "-m", message], { cwd: cloneDir });
  return true;
}

function pushBranch(cloneDir, branchName) {
  runGitWithRetry(["push", "-u", "origin", branchName], { cwd: cloneDir });
}

function tryCreatePullRequest({ remoteUrl, headBranch, baseBranch, title, dryRun }) {
  const githubRepo = parseGitHubRepo(remoteUrl);
  if (!githubRepo) {
    return {
      created: false,
      reason: "not-github",
      message: "PR creation skipped (remote is not GitHub).",
    };
  }
  if (!commandExists("gh")) {
    return {
      created: false,
      reason: "gh-missing",
      message: `Branch pushed. Create a PR manually: https://github.com/${githubRepo}/compare/${baseBranch}...${headBranch}`,
    };
  }
  if (dryRun) {
    return {
      created: false,
      reason: "dry-run",
      message: `Would create PR on ${githubRepo}: ${headBranch} -> ${baseBranch}`,
    };
  }

  const args = [
    "pr",
    "create",
    "--repo",
    githubRepo,
    "--head",
    headBranch,
    "--base",
    baseBranch,
    "--title",
    title,
    "--body",
    "Automated PR from `qui push`.",
  ];
  const result = spawnSync("gh", args, { encoding: "utf8" });
  if (result.status !== 0) {
    const detail = (result.stderr || result.stdout || "").trim();
    return {
      created: false,
      reason: "gh-failed",
      message:
        detail ||
        `Branch pushed. Create a PR manually: https://github.com/${githubRepo}/compare/${baseBranch}...${headBranch}`,
    };
  }
  const url = (result.stdout || "").trim();
  return {
    created: true,
    reason: "created",
    url,
    message: url ? `Pull request created: ${url}` : "Pull request created.",
  };
}

function runPushWorkflow({
  remoteUrl,
  baseBranch,
  componentsRoot,
  uilib,
  slugs,
  sourceAppComponentDirs,
  commitMessage,
  dryRun,
  branchName,
}) {
  const tempParent = fs.mkdtempSync(path.join(os.tmpdir(), "qui-push-"));
  const cloneDir = path.join(tempParent, "repo");
  const items = [];
  const warnings = [];
  let pullRequest = null;

  try {
    const cloneUrl = stripGitFragment(remoteUrl);
    cloneRepo(cloneUrl, cloneDir);

    const checkedOut = tryCheckoutBase(cloneDir, baseBranch);
    if (!checkedOut) {
      warnings.push("Could not checkout base branch; using clone default HEAD.");
    }
    const resolvedBaseBranch = normalizeBaseBranch(checkedOut);

    const finalBranch =
      branchName ||
      `qui/push-${slugs.join("-").replace(/[^a-z0-9-]+/gi, "-").slice(0, 48)}-${Date.now()}`;
    runGitWithRetry(["checkout", "-b", finalBranch], { cwd: cloneDir });

    for (const slug of slugs) {
      const src = sourceAppComponentDirs[slug];
      const dest = path.join(cloneDir, componentsRoot, uilib, slug);
      if (!fs.existsSync(src)) {
        const err = new Error(`Missing source directory for '${slug}'.`);
        err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
        throw err;
      }
      fs.mkdirSync(path.dirname(dest), { recursive: true });
      fs.cpSync(src, dest, { recursive: true });
      items.push({
        action: "modify",
        target: `${componentsRoot}/${uilib}/${slug}`,
        status: dryRun ? "planned" : "applied",
      });
    }

    if (dryRun) {
      runGitWithRetry(["add", "-A"], { cwd: cloneDir });
      const diff = runGitWithRetry(["diff", "--cached", "--stat"], { cwd: cloneDir });
      if (diff.stdout) warnings.push(diff.stdout.trim());
      runGitWithRetry(["reset", "--hard", "HEAD"], { cwd: cloneDir });
      runGitWithRetry(["clean", "-fd"], { cwd: cloneDir });
      pullRequest = tryCreatePullRequest({
        remoteUrl,
        headBranch: finalBranch,
        baseBranch: resolvedBaseBranch,
        title: commitMessage,
        dryRun: true,
      });
      if (pullRequest.message) warnings.push(pullRequest.message);
      return {
        items,
        warnings,
        branch: finalBranch,
        baseBranch: resolvedBaseBranch,
        committed: false,
        pushed: false,
        pullRequest,
      };
    }

    const committed = commitAll(cloneDir, commitMessage);
    if (!committed) {
      warnings.push("No git changes to commit after copying components.");
      return {
        items,
        warnings,
        branch: finalBranch,
        baseBranch: resolvedBaseBranch,
        committed: false,
        pushed: false,
        pullRequest: null,
      };
    }

    pushBranch(cloneDir, finalBranch);
    pullRequest = tryCreatePullRequest({
      remoteUrl,
      headBranch: finalBranch,
      baseBranch: resolvedBaseBranch,
      title: commitMessage,
      dryRun: false,
    });
    if (pullRequest.message) {
      if (pullRequest.created) {
        warnings.push(pullRequest.message);
      } else {
        warnings.push(pullRequest.message);
      }
    }
    return {
      items,
      warnings,
      branch: finalBranch,
      baseBranch: resolvedBaseBranch,
      committed: true,
      pushed: true,
      pullRequest,
    };
  } finally {
    fs.rmSync(tempParent, { recursive: true, force: true });
  }
}

module.exports = {
  runPushWorkflow,
  stripGitFragment,
  parseGitHubRepo,
  tryCreatePullRequest,
};
