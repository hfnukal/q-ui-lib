const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { createReport } = require("../services/report");
const { ensureRelativeUnderCwd } = require("../services/component-files");
const { readConfig } = require("../services/config");
const { getQuiClientRoot } = require("../services/runtime-paths");
const { EXIT_CODES } = require("../constants");

const TS_MORPH_PKG = "ts-morph@^27.0.2";

/** @param {string} componentDir */
function componentReferencesTsMorph(componentDir) {
  let entries;
  try {
    entries = fs.readdirSync(componentDir, { withFileTypes: true });
  } catch {
    return false;
  }
  for (const entry of entries) {
    if (!entry.isFile()) continue;
    if (!/\.tsx?$/.test(entry.name)) continue;
    const filePath = path.join(componentDir, entry.name);
    let text;
    try {
      text = fs.readFileSync(filePath, "utf8");
    } catch {
      continue;
    }
    if (
      /from\s+["']ts-morph(?:\/[^"']*)?["']/.test(text) ||
      /import\s*\(\s*["']ts-morph(?:\/[^"']*)?["']\s*\)/.test(text)
    ) {
      return true;
    }
  }
  return false;
}

/**
 * Ensures meta.generated.json pins ts-morph when auxiliary component files import it.
 * generate-meta may list bare "ts-morph"; consumer apps need v27+ (not vercel's transitive v12).
 * @param {string} componentDir
 */
function ensureTsMorphNpmDependencyInMeta(componentDir) {
  if (!componentReferencesTsMorph(componentDir)) return;

  const metaPath = path.join(componentDir, "meta.generated.json");
  if (!fs.existsSync(metaPath)) return;

  let meta;
  try {
    meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
  } catch {
    return;
  }

  const deps = Array.isArray(meta.npmDependencies) ? [...meta.npmDependencies] : [];
  meta.npmDependencies = deps
    .filter((d) => d !== "ts-morph" && !d.startsWith("ts-morph@"))
    .sort();

  const devDeps = Array.isArray(meta.npmDevDependencies) ? [...meta.npmDevDependencies] : [];
  const hasTsMorph = devDeps.some((d) => d === "ts-morph" || d.startsWith("ts-morph@"));
  if (hasTsMorph) {
    meta.npmDevDependencies = devDeps
      .map((d) => (d === "ts-morph" ? TS_MORPH_PKG : d))
      .sort();
  } else {
    devDeps.push(TS_MORPH_PKG);
    devDeps.sort();
    meta.npmDevDependencies = devDeps;
  }

  fs.writeFileSync(metaPath, `${JSON.stringify(meta, null, 2)}\n`, "utf8");
}

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

  if (!flags.dryRun) {
    for (const dir of findComponentDirsForReport(componentsAbs)) {
      ensureTsMorphNpmDependencyInMeta(dir);
    }
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
