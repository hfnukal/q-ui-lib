const fs = require("node:fs");
const path = require("node:path");
const { EXIT_CODES } = require("../constants");
const {
  filesAreEquivalentForReplace,
  isInteractiveTerminal,
  nonInteractiveAskError,
  promptTemplateConflict,
} = require("./interactive");

const IGNORED_DIR_NAMES = new Set(["node_modules", "dist", "tmp", ".git"]);
const IGNORED_FILE_NAMES = new Set([".DS_Store"]);

function listTemplateFiles(dir, base = dir, acc = []) {
  if (!fs.existsSync(dir)) return acc;
  const entries = fs.readdirSync(dir, { withFileTypes: true });
  for (const ent of entries) {
    if (IGNORED_FILE_NAMES.has(ent.name)) continue;
    const full = path.join(dir, ent.name);
    if (ent.isDirectory()) {
      if (IGNORED_DIR_NAMES.has(ent.name)) continue;
      listTemplateFiles(full, base, acc);
    } else {
      acc.push(path.relative(base, full));
    }
  }
  return acc;
}

async function chooseConflictAction(rel, policy, flags, paths) {
  if (flags.force) return "overwrite";
  if (flags.auto) return "template-postfix";
  if (flags.yes) return "overwrite";
  if (policy.onError === "warn") return "template-postfix";
  if (policy.onError === "fail") {
    const err = new Error("Template conflict and onError=fail policy.");
    err.exitCode = EXIT_CODES.POLICY_FAIL_STOP;
    throw err;
  }
  if (policy.onError === "ask") {
    if (policy.interactive === false || !isInteractiveTerminal()) {
      throw nonInteractiveAskError("Template conflict requires a decision.");
    }
    return promptTemplateConflict(rel, paths.existingPath, paths.templatePath);
  }
  const err = new Error("Template conflict requires decision (unknown onError policy).");
  err.exitCode = EXIT_CODES.USER_REJECTED_PLAN;
  throw err;
}

function templatePostfixPath(filePath) {
  const ext = path.extname(filePath);
  const base = filePath.slice(0, filePath.length - ext.length);
  return `${base}-template${ext}`;
}

async function syncTemplateToProject({ templateRoot, targetRoot, policy, flags }) {
  if (!fs.existsSync(templateRoot)) {
    return { items: [], warnings: ["Template root not found; skipping template sync."] };
  }
  const relPaths = listTemplateFiles(templateRoot).sort();
  const items = [];
  const warnings = [];

  for (const rel of relPaths) {
    const sourcePath = path.join(templateRoot, rel);
    const targetPath = path.join(targetRoot, rel);
    const sourceBuffer = fs.readFileSync(sourcePath);
    const exists = fs.existsSync(targetPath);

    if (!exists) {
      if (flags.dryRun) {
        items.push({ action: "create", target: rel, status: "planned" });
      } else {
        fs.mkdirSync(path.dirname(targetPath), { recursive: true });
        fs.copyFileSync(sourcePath, targetPath);
        items.push({ action: "create", target: rel, status: "applied" });
      }
      continue;
    }

    const targetBuffer = fs.readFileSync(targetPath);
    if (sourceBuffer.equals(targetBuffer)) {
      items.push({ action: "noop", target: rel, status: "skipped" });
      continue;
    }

    if (filesAreEquivalentForReplace(targetPath, sourcePath)) {
      items.push({
        action: "noop",
        target: rel,
        status: "skipped",
        details: { reason: "equivalent_to_template" },
      });
      continue;
    }

    if (flags.dryRun && policy.onError === "ask" && !flags.yes && !flags.auto && !flags.force) {
      items.push({
        action: "modify",
        target: rel,
        status: "planned",
        details: { conflict: true, note: "needs resolution when not dry-run" },
      });
      warnings.push(
        `Dry-run: template would conflict on ${rel}; use --yes/--auto/--force or run without --dry-run.`
      );
      continue;
    }

    const conflictAction = await chooseConflictAction(rel, policy, flags, {
      templatePath: sourcePath,
      existingPath: targetPath,
    });
    if (conflictAction === "skip") {
      items.push({ action: "noop", target: rel, status: "skipped", details: { conflictAction } });
      warnings.push(`Conflict on ${rel} skipped by user.`);
      continue;
    }
    if (conflictAction === "overwrite") {
      if (flags.dryRun) {
        items.push({ action: "modify", target: rel, status: "planned", details: { conflictAction } });
      } else {
        fs.copyFileSync(sourcePath, targetPath);
        items.push({ action: "modify", target: rel, status: "applied", details: { conflictAction } });
      }
      continue;
    }

    const postfixTargetPath = templatePostfixPath(targetPath);
    const postfixRel = path.relative(targetRoot, postfixTargetPath);
    if (flags.dryRun) {
      items.push({ action: "create", target: postfixRel, status: "planned", details: { conflictAction } });
    } else {
      fs.mkdirSync(path.dirname(postfixTargetPath), { recursive: true });
      fs.copyFileSync(sourcePath, postfixTargetPath);
      items.push({ action: "create", target: postfixRel, status: "applied", details: { conflictAction } });
    }
    warnings.push(`Conflict on ${rel} solved by template-postfix.`);
  }

  return { items, warnings };
}

module.exports = {
  syncTemplateToProject,
};
