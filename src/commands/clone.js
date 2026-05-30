const fs = require("node:fs");
const path = require("node:path");
const { readConfig } = require("../services/config");
const {
  ensureRelativeUnderCwd,
  copyComponentDirectory,
  assertNoCaseInsensitiveCollision,
} = require("../services/component-files");
const { createReport } = require("../services/report");
const { resolveSourceContext } = require("../services/source-resolver");
const { EXIT_CODES } = require("../constants");

function updateMetaForClone(metaPath, sourceComponent, newComponent, sourceSelector, source) {
  const now = new Date().toISOString();
  const existing = fs.existsSync(metaPath)
    ? JSON.parse(fs.readFileSync(metaPath, "utf8"))
    : {};
  const prevDepth = Number(existing?.quiSource?.cloneDepth || 0);
  const next = {
    ...existing,
    name: newComponent,
    quiSource: {
      repo: sourceSelector,
      url: `${source.remoteUrl}${source.ref ? `#${source.ref}` : ""}`,
      sourcePath: `${source.componentsSubpath}/${sourceComponent}`,
      installedAt: now,
      originComponent: sourceComponent,
      clonedAt: now,
      cloneDepth: prevDepth > 0 ? prevDepth + 1 : 1,
    },
  };
  fs.writeFileSync(metaPath, `${JSON.stringify(next, null, 2)}\n`, "utf8");
}

function updateComponentDirective(indexPath, newComponent) {
  if (!fs.existsSync(indexPath)) return;
  const content = fs.readFileSync(indexPath, "utf8");
  const updated = content.replace(
    /^(\s*\*\s*@component\s+)([^\s]+)$/m,
    `$1${newComponent}`
  );
  fs.writeFileSync(indexPath, updated, "utf8");
}

async function runClone(context) {
  const { cwd, flags, positionals } = context;
  const { config } = readConfig(cwd);
  if (positionals.length < 2) {
    const err = new Error("clone requires <source-component> <new-component>.");
    err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
    throw err;
  }
  const [sourceComponent, newComponent] = positionals;
  const source = resolveSourceContext(cwd, config, flags.repo);
  const targetPath = flags.targetPath || config.targetPath;
  const targetDir = ensureRelativeUnderCwd(cwd, targetPath);
  const srcDir = path.join(targetDir, sourceComponent);
  const dstDir = path.join(targetDir, newComponent);
  if (!fs.existsSync(srcDir)) {
    const err = new Error(`Source component '${sourceComponent}' is not installed in targetPath.`);
    err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
    throw err;
  }
  if (fs.existsSync(dstDir) && !flags.force) {
    const err = new Error(`Target component '${newComponent}' already exists. Use --force.`);
    err.exitCode = EXIT_CODES.POLICY_FAIL_STOP;
    throw err;
  }
  if (!flags.dryRun) {
    assertNoCaseInsensitiveCollision(targetDir, newComponent);
    copyComponentDirectory(srcDir, dstDir);
    const indexPath = path.join(dstDir, "index.tsx");
    if (fs.existsSync(indexPath)) {
      const content = fs.readFileSync(indexPath, "utf8");
      fs.writeFileSync(
        indexPath,
        content.replace(new RegExp(sourceComponent, "g"), newComponent),
        "utf8"
      );
      updateComponentDirective(indexPath, newComponent);
    }
    const metaPath = path.join(dstDir, "meta.generated.json");
    updateMetaForClone(
      metaPath,
      sourceComponent,
      newComponent,
      flags.repo || `${source.repoName}/${source.targetUilib}`,
      source
    );
  }
  const status = flags.dryRun ? "planned" : "applied";
  return createReport({
    command: "clone",
    ok: true,
    exitCode: EXIT_CODES.SUCCESS,
    repoSelector: flags.repo || `${source.repoName}/${source.targetUilib}`,
    targetPath,
    summary: {
      planned: flags.dryRun ? 1 : 0,
      applied: flags.dryRun ? 0 : 1,
      skipped: 0,
      failed: 0,
    },
    items: [
      {
        action: "create",
        target: path.relative(cwd, dstDir),
        status,
        details: { sourceComponent, newComponent },
      },
    ],
  });
}

module.exports = { runClone };
