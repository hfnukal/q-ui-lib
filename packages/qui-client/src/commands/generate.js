const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { createReport } = require("../services/report");
const { ensureRelativeUnderCwd } = require("../services/component-files");
const { readConfig } = require("../services/config");
const { getQuiClientRoot } = require("../services/runtime-paths");
const { EXIT_CODES } = require("../constants");

function findComponentDirsForReport(baseDir) {
  /** @type {string[]} */
  const results = [];
  const hasRootIndex = (entries) =>
    entries.some(
      (e) => e.isFile() && (e.name === "index.tsx" || e.name === "index.ts")
    );
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    const hasIndex = hasRootIndex(entries);
    if (hasIndex) {
      results.push(dir);
      return;
    }
    for (const e of entries) {
      if (e.isDirectory()) walk(path.join(dir, e.name));
    }
  }
  walk(baseDir);
  return results;
}

async function runGenerate(context) {
  const { cwd, flags } = context;
  const { config } = readConfig(cwd);
  const targetPath = flags.targetPath || config.targetPath;
  const targetDir = ensureRelativeUnderCwd(cwd, targetPath);
  const scriptPath = path.join(getQuiClientRoot(), "scripts", "generate-meta.mjs");

  if (!fs.existsSync(scriptPath)) {
    return createReport({
      command: "generate",
      ok: false,
      exitCode: EXIT_CODES.UNEXPECTED_RUNTIME_ERROR,
      targetPath,
      errors: [`generate-meta script missing: ${scriptPath}`],
    });
  }

  if (!fs.existsSync(targetDir)) {
    return createReport({
      command: "generate",
      ok: true,
      exitCode: EXIT_CODES.SUCCESS,
      targetPath,
      summary: { planned: 0, applied: 0, skipped: 0, failed: 0 },
      items: [],
      warnings: [`Target path ${targetPath} does not exist; nothing to generate.`],
    });
  }

  const componentsAbs = path.resolve(targetDir);
  const genArgs = [
    scriptPath,
    "--app-root",
    path.resolve(cwd),
    "--components-dir",
    componentsAbs,
  ];
  if (flags.dryRun) genArgs.push("--dry-run");

  const result = spawnSync(process.execPath, genArgs, {
    cwd: path.resolve(cwd),
    encoding: "utf8",
    stdio: ["inherit", "pipe", "pipe"],
  });
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.stdout) process.stdout.write(result.stdout);

  if (result.status !== 0) {
    return createReport({
      command: "generate",
      ok: false,
      exitCode: EXIT_CODES.UNEXPECTED_RUNTIME_ERROR,
      targetPath,
      errors: [
        (result.stderr || result.stdout || "").trim() || "generate-meta script failed.",
      ],
    });
  }

  const items = [];
  const status = flags.dryRun ? "planned" : "applied";
  for (const dir of findComponentDirsForReport(componentsAbs)) {
    const metaPath = path.join(dir, "meta.generated.json");
    const existed = fs.existsSync(metaPath);
    items.push({
      action: existed ? "modify" : "create",
      target: path.relative(cwd, metaPath),
      status,
    });
  }

  return createReport({
    command: "generate",
    ok: true,
    exitCode: EXIT_CODES.SUCCESS,
    targetPath,
    summary: {
      planned: items.filter((x) => x.status === "planned").length,
      applied: items.filter((x) => x.status === "applied").length,
      skipped: 0,
      failed: 0,
    },
    items,
  });
}

module.exports = { runGenerate };
