const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { createReport } = require("../services/report");
const { ensureRelativeUnderCwd } = require("../services/component-files");
const { readConfig } = require("../services/config");
const { getQuiClientRoot } = require("../services/runtime-paths");
const { EXIT_CODES } = require("../constants");

const HEADLESS_PKG = "@qwik-ui/headless";
const TS_MORPH_PKG = "ts-morph@^27.0.2";

/** @param {string} componentDir */
function resolveComponentIndexPath(componentDir) {
  const tsx = path.join(componentDir, "index.tsx");
  if (fs.existsSync(tsx)) return tsx;
  const ts = path.join(componentDir, "index.ts");
  if (fs.existsSync(ts)) return ts;
  return null;
}

/**
 * True if the component entry imports from @qwik-ui/headless (static or dynamic import / export from).
 * @param {string} indexPath
 */
function componentReferencesHeadless(indexPath) {
  let text;
  try {
    text = fs.readFileSync(indexPath, "utf8");
  } catch {
    return false;
  }
  return (
    /from\s+["']@qwik-ui\/headless(?:\/[^"']*)?["']/.test(text) ||
    /import\s*\(\s*["']@qwik-ui\/headless(?:\/[^"']*)?["']\s*\)/.test(text) ||
    /export\s+[^;]+?\sfrom\s+["']@qwik-ui\/headless(?:\/[^"']*)?["']/.test(text)
  );
}

/**
 * Ensures meta.generated.json lists @qwik-ui/headless when the component source imports it.
 * generate-meta omits packages already present on the repo baseline package.json; consumers still need this for qui add.
 * @param {string} componentDir
 */
function ensureHeadlessNpmDependencyInMeta(componentDir) {
  const indexPath = resolveComponentIndexPath(componentDir);
  if (!indexPath || !componentReferencesHeadless(indexPath)) return;

  const metaPath = path.join(componentDir, "meta.generated.json");
  if (!fs.existsSync(metaPath)) return;

  let meta;
  try {
    meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
  } catch {
    return;
  }

  const deps = Array.isArray(meta.npmDependencies) ? [...meta.npmDependencies] : [];
  if (deps.includes(HEADLESS_PKG)) return;

  deps.push(HEADLESS_PKG);
  deps.sort();
  meta.npmDependencies = deps;

  fs.writeFileSync(metaPath, `${JSON.stringify(meta, null, 2)}\n`, "utf8");
}

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
    if (entry.name === "ui-component-introspect.ts") continue;
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
  const hasTsMorph = deps.some((d) => d === "ts-morph" || d.startsWith("ts-morph@"));
  if (hasTsMorph) {
    meta.npmDependencies = deps
      .map((d) => (d === "ts-morph" ? TS_MORPH_PKG : d))
      .sort();
  } else {
    deps.push(TS_MORPH_PKG);
    deps.sort();
    meta.npmDependencies = deps;
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
      ensureHeadlessNpmDependencyInMeta(dir);
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
