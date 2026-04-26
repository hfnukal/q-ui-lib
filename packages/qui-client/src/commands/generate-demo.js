const fs = require("node:fs");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { readConfig } = require("../services/config");
const { resolvePolicy } = require("../services/policy");
const { ensureRelativeUnderCwd } = require("../services/component-files");
const { createReport } = require("../services/report");
const { getQuiClientRoot } = require("../services/runtime-paths");
const { syncTemplateToProject } = require("../services/template-sync");
const { EXIT_CODES } = require("../constants");
const { runAdd } = require("./add");

/** Echo user-facing `qui …` steps on stderr so `--json` stdout stays a single envelope. */
function logGenerateDemoCommand(line) {
  process.stderr.write(`${line}\n`);
}

function normalizeRouteSegment(flag) {
  const raw = String(flag || "/qui-demo").replace(/^\/+/, "").replace(/\/+$/, "");
  return raw || "qui-demo";
}

function findInstalledComponentSlugs(baseDir) {
  /** @type {Array<{ slug: string, uiLib: string | null }>} */
  const components = [];
  function walk(dir) {
    if (!fs.existsSync(dir)) return;
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    if (entries.some((entry) => entry.isFile() && entry.name === "index.tsx")) {
      const relDir = path.relative(baseDir, dir);
      const segments = relDir.split(path.sep).filter(Boolean);
      const slug = path.basename(dir);
      const uiLib = segments.length > 1 ? segments[0] : null;
      components.push({ slug, uiLib });
      return;
    }
    for (const entry of entries) {
      if (entry.isDirectory()) walk(path.join(dir, entry.name));
    }
  }
  walk(baseDir);
  const deduped = new Map();
  for (const component of components) {
    deduped.set(`${component.uiLib || ""}/${component.slug}`, component);
  }
  return [...deduped.values()].sort((a, b) => {
    const libA = a.uiLib || "";
    const libB = b.uiLib || "";
    return libA.localeCompare(libB) || a.slug.localeCompare(b.slug);
  });
}

async function runGenerateDemo(context) {
  const { cwd, positionals, flags } = context;
  const { config } = readConfig(cwd);
  const policy = resolvePolicy(flags, config.policy);
  const targetPath = flags.targetPath || config.targetPath;
  const targetDir = ensureRelativeUnderCwd(cwd, targetPath);
  const routeSeg = normalizeRouteSegment(flags.routeBase);
  const routesDirRel = path.posix.join("src", "routes", routeSeg);
  const scriptPath = path.join(getQuiClientRoot(), "scripts", "generate-demo.mjs");
  const templateRoot = path.join(getQuiClientRoot(), "templates", "demo");

  if (!fs.existsSync(targetDir)) {
    return createReport({
      command: "generate-demo",
      ok: false,
      exitCode: EXIT_CODES.CONFIG_SCHEMA_ERROR,
      targetPath,
      errors: [`targetPath '${targetPath}' does not exist.`],
    });
  }

  if (!fs.existsSync(scriptPath)) {
    return createReport({
      command: "generate-demo",
      ok: false,
      exitCode: EXIT_CODES.UNEXPECTED_RUNTIME_ERROR,
      errors: [`Missing generator script at ${scriptPath}.`],
    });
  }

  const templateSync = await syncTemplateToProject({
    templateRoot,
    targetRoot: cwd,
    policy,
    flags,
  });

  if (flags.dryRun) {
    const installedComponents = findInstalledComponentSlugs(targetDir);
    const selected =
      positionals.length > 0
        ? installedComponents.filter((component) => positionals.includes(component.slug))
        : installedComponents;
    const items = [...templateSync.items];
    for (const component of selected) {
      const routeParts = [routesDirRel, "components"];
      if (component.uiLib) routeParts.push(component.uiLib);
      routeParts.push(component.slug, "index.tsx");
      items.push({
        action: "modify",
        target: path.join(...routeParts),
        status: "planned",
      });
    }
    return createReport({
      command: "generate-demo",
      ok: true,
      exitCode: EXIT_CODES.SUCCESS,
      targetPath,
      summary: {
        planned: items.filter((x) => x.status === "planned").length,
        applied: items.filter((x) => x.status === "applied").length,
        skipped: items.filter((x) => x.status === "skipped").length,
        failed: 0,
      },
      items,
      warnings: [
        ...templateSync.warnings,
        "--dry-run: generate-demo script was not executed; no component routes written.",
      ],
    });
  }

  logGenerateDemoCommand("Running: qui add --all qui-demo");
  const addReportQuiDemo = await runAdd({
    cwd,
    flags: { ...flags, all: true },
    positionals: ["qui-demo"],
    rawArgv: [],
  });
  logGenerateDemoCommand("Running: qui add --all base");
  const addReportBase = await runAdd({
    cwd,
    flags: { ...flags, all: true },
    positionals: ["base"],
    rawArgv: [],
  });

  const genArgs = [
    scriptPath,
    "--target",
    cwd,
    "--components-dir",
    targetDir,
    "--routes-dir",
    routesDirRel.replace(/\\/g, "/"),
    ...positionals,
  ];
  const result = spawnSync(process.execPath, genArgs, {
    cwd,
    encoding: "utf8",
    stdio: ["inherit", "pipe", "pipe"],
  });
  if (result.stderr) process.stderr.write(result.stderr);
  if (result.status !== 0) {
    return createReport({
      command: "generate-demo",
      ok: false,
      exitCode: EXIT_CODES.UNEXPECTED_RUNTIME_ERROR,
      targetPath,
      errors: [
        (result.stderr || result.stdout || "").trim() || "generate-demo script failed.",
      ],
    });
  }

  const warnings = [
    ...templateSync.warnings,
    ...(addReportQuiDemo.warnings || []),
    ...(addReportBase.warnings || []),
  ];
  const scriptLog = (result.stdout || "").trim();
  if (scriptLog) warnings.push(scriptLog);

  const items = [...templateSync.items];
  const componentRoutesRoot = path.join(cwd, "src", "routes", routeSeg, "components");
  if (fs.existsSync(componentRoutesRoot)) {
    function collectRouteFiles(dir) {
      for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
        const entryPath = path.join(dir, entry.name);
        if (entry.isDirectory()) {
          collectRouteFiles(entryPath);
          continue;
        }
        if (entry.isFile() && entry.name === "index.tsx") {
          items.push({
            action: "modify",
            target: path.relative(cwd, entryPath),
            status: "applied",
          });
        }
      }
    }
    collectRouteFiles(componentRoutesRoot);
  }

  return createReport({
    command: "generate-demo",
    ok: true,
    exitCode: EXIT_CODES.SUCCESS,
    targetPath,
    summary: {
      planned: 0,
      applied: items.filter((x) => x.status === "applied").length,
      skipped: items.filter((x) => x.status === "skipped").length,
      failed: 0,
    },
    items,
    warnings,
  });
}

module.exports = { runGenerateDemo };
