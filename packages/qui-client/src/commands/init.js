const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const {
  createDefaultConfig,
  getConfigPath,
  writeConfigAtomic,
  writeConfigAtomicAt,
} = require("../services/config");
const { createReport } = require("../services/report");
const { resolvePolicy } = require("../services/policy");
const { getQuiClientRoot, getQuiFeaturePackageRoot } = require("../services/runtime-paths");
const { syncTemplateToProject } = require("../services/template-sync");
const { EXIT_CODES } = require("../constants");
const {
  filesAreEquivalentForReplace,
  isInteractiveTerminal,
  promptTemplateConflict,
} = require("../services/interactive");

function readConfigPolicyOnly(configPath) {
  if (!fs.existsSync(configPath)) return {};
  try {
    const raw = JSON.parse(fs.readFileSync(configPath, "utf8"));
    if (
      raw &&
      typeof raw.policy === "object" &&
      raw.policy !== null &&
      !Array.isArray(raw.policy)
    ) {
      return raw.policy;
    }
  } catch {
    /* ignore */
  }
  return {};
}

/** @returns {string|undefined} */
function readTargetPathFromConfigFile(configPath) {
  if (!fs.existsSync(configPath)) return undefined;
  try {
    const raw = JSON.parse(fs.readFileSync(configPath, "utf8"));
    if (typeof raw.targetPath === "string") return raw.targetPath;
  } catch {
    /* ignore */
  }
  return undefined;
}

function quiConfigPostfixPath(configPath) {
  const dir = path.dirname(configPath);
  const fn = path.basename(configPath);
  const ext = path.extname(fn);
  const stem = fn.slice(0, -ext.length);
  return path.join(dir, `${stem}-template${ext}`);
}

/**
 * Directory is missing or has no entries — safe to scaffold Qwik "empty" starter.
 * @param {string} absDir
 */
function isScaffoldEmptyRoot(absDir) {
  if (!fs.existsSync(absDir)) return true;
  try {
    return fs.readdirSync(absDir).length === 0;
  } catch {
    return false;
  }
}

function toPosixPath(p) {
  return p.split(path.sep).join("/");
}

/**
 * @param {string} projectRoot
 * @param {string} featureRoot
 * @param {{ dryRun: boolean }} opts
 * @returns {{ item: object|null, warning?: string }}
 */
function addQuiFeatureDependency(projectRoot, featureRoot, opts) {
  const pkgPath = path.join(projectRoot, "package.json");
  if (!fs.existsSync(pkgPath)) {
    return {
      item: null,
      warning: "Nelze přidat qui-feature: v kořeni projektu chybí package.json.",
    };
  }
  if (!fs.existsSync(path.join(featureRoot, "package.json"))) {
    return {
      item: null,
      warning:
        "Balíček qui-feature nebyl nalezen vedle qui-client (očekává se monorepo packages/qui-feature); závislost se nepřidá.",
    };
  }

  const rel = path.relative(projectRoot, featureRoot);
  const posixRel = toPosixPath(rel);
  const fileSpec = posixRel.startsWith(".") ? `file:${posixRel}` : `file:./${posixRel}`;

  let raw;
  try {
    raw = fs.readFileSync(pkgPath, "utf8");
  } catch (e) {
    return {
      item: null,
      warning: `package.json nelze přečíst: ${/** @type {Error} */ (e).message}`,
    };
  }

  let pkg;
  try {
    pkg = JSON.parse(raw);
  } catch {
    return { item: null, warning: "package.json není platný JSON; qui-feature se nepřidá." };
  }
  if (!pkg || typeof pkg !== "object") {
    return { item: null, warning: "package.json má neočekávaný tvar; qui-feature se nepřidá." };
  }

  const prevKey =
    pkg.dependencies && typeof pkg.dependencies === "object" ? pkg.dependencies["qui-feature"] : undefined;

  if (prevKey === fileSpec) {
    return {
      item: {
        action: "noop",
        target: "package.json",
        status: "skipped",
        details: { reason: "qui-feature_dep_unchanged" },
      },
    };
  }

  if (opts.dryRun) {
    return {
      item: {
        action: "modify",
        target: "package.json",
        status: "planned",
        details: { dep: "qui-feature", spec: fileSpec },
      },
    };
  }

  pkg.dependencies = typeof pkg.dependencies === "object" && pkg.dependencies !== null ? pkg.dependencies : {};
  pkg.dependencies["qui-feature"] = fileSpec;
  const next = `${JSON.stringify(pkg, null, 2)}\n`;
  const tempPath = `${pkgPath}.${Date.now()}.tmp`;
  fs.writeFileSync(tempPath, next, "utf8");
  fs.renameSync(tempPath, pkgPath);

  return {
    item: {
      action: "modify",
      target: "package.json",
      status: "applied",
      details: { dep: "qui-feature", spec: fileSpec, previous: prevKey },
    },
  };
}

/**
 * Scaffolds Qwik in an empty root: `npm create qwik@latest` (empty template), then Tailwind via Qwik CLI.
 * @param {string} outDirAbs absolute project root
 * @param {string} cwd process cwd (for report-relative targets)
 * @param {{ dryRun: boolean }} opts
 * @returns {{ ok: boolean, message?: string, items?: object[] }}
 */
function runEmptyRootScaffold(outDirAbs, cwd, opts) {
  const relRoot = path.relative(cwd, outDirAbs) || ".";
  if (opts.dryRun) {
    return {
      ok: true,
      items: [
        {
          action: "create",
          target: relRoot,
          status: "planned",
          details: { step: "npm create qwik@latest -- empty <root> -i true --force" },
        },
        {
          action: "modify",
          target: relRoot,
          status: "planned",
          details: { step: "cd <root> && npx qwik add tailwind --skipConfirmation true" },
        },
      ],
    };
  }
  const shell = process.platform === "win32";
  const create = spawnSync(
    "npm",
    ["create", "qwik@latest", "--", "empty", outDirAbs, "-i", "true", "--force"],
    {
      stdio: "inherit",
      shell,
      env: process.env,
    }
  );
  if (create.error) {
    return { ok: false, message: create.error.message || String(create.error) };
  }
  if (create.status !== 0) {
    const stderr = (create.stderr && String(create.stderr)) || "";
    const stdout = (create.stdout && String(create.stdout)) || "";
    return {
      ok: false,
      message: `npm create qwik@latest skončil s kódem ${create.status}. ${stderr || stdout || "(bez výstupu)"}`.trim(),
    };
  }

  const tailwind = spawnSync(
    "npx",
    ["qwik", "add", "tailwind", "--skipConfirmation", "true"],
    {
      cwd: outDirAbs,
      stdio: "inherit",
      shell,
      env: process.env,
    }
  );
  if (tailwind.error) {
    return { ok: false, message: tailwind.error.message || String(tailwind.error) };
  }
  if (tailwind.status !== 0) {
    const stderr = (tailwind.stderr && String(tailwind.stderr)) || "";
    const stdout = (tailwind.stdout && String(tailwind.stdout)) || "";
    return {
      ok: false,
      message: `npx qwik add tailwind skončil s kódem ${tailwind.status}. ${stderr || stdout || "(bez výstupu)"}`.trim(),
    };
  }

  return {
    ok: true,
    items: [
      {
        action: "create",
        target: relRoot,
        status: "applied",
        details: { step: "npm create qwik@latest empty" },
      },
      {
        action: "modify",
        target: relRoot,
        status: "applied",
        details: { step: "npx qwik add tailwind" },
      },
    ],
  };
}

function formatInitFooter(initRootAbs, cwd) {
  const display =
    initRootAbs === path.resolve(cwd) ? "." : toPosixPath(path.relative(cwd, initRootAbs)) || initRootAbs;
  const cdPath = display === "." ? "." : display;
  return [
    "",
    "Shrnutí:",
    `  qui je nainstalované v: ${initRootAbs}`,
    "  Přidejte komponenty:",
    `    cd ${cdPath}`,
    "    npx qui add <components to add>",
  ];
}

async function resolveExistingQuiConfig({ configPath, config, flags, policy }) {
  if (flags.force) {
    return { kind: "overwrite" };
  }
  if (flags.auto) {
    return { kind: "postfix" };
  }
  if (flags.yes) {
    return { kind: "overwrite" };
  }
  if (policy.onError === "warn") {
    return { kind: "postfix" };
  }
  if (policy.onError === "fail") {
    return {
      kind: "fail",
      errors: [
        "qui.config.json already exists (onError=fail). Delete it, change policy, or use --force to overwrite.",
      ],
    };
  }
  if (policy.onError === "ask") {
    if (flags.dryRun && !flags.yes && !flags.auto) {
      return {
        kind: "dry_ask",
        warning:
          "Dry-run: qui.config.json would conflict; use --yes/--auto/--force or run without --dry-run.",
      };
    }
    if (policy.interactive === false || !isInteractiveTerminal()) {
      return {
        kind: "fail",
        errors: [
          "qui.config.json already exists. Use --force to overwrite, or --yes / --auto, or run interactively to choose overwrite / save as *-template* / skip / diff.",
        ],
      };
    }
    const tmpDir = fs.mkdtempSync(path.join(os.tmpdir(), "qui-init-"));
    const proposedPath = path.join(tmpDir, "qui.config.json");
    fs.writeFileSync(proposedPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
    try {
      const choice = await promptTemplateConflict("qui.config.json", configPath, proposedPath, {
        title: "Config conflict: qui.config.json",
      });
      if (choice === "overwrite") return { kind: "overwrite" };
      if (choice === "skip") return { kind: "skip" };
      return { kind: "postfix" };
    } finally {
      fs.rmSync(tmpDir, { recursive: true, force: true });
    }
  }
  return {
    kind: "fail",
    errors: ["qui.config.json already exists and policy could not be resolved."],
  };
}

async function runInit(context) {
  const { cwd, flags, positionals = [] } = context;
  if (positionals.length > 1) {
    const err = new Error(
      `init accepts at most one project root directory; got: ${positionals.map((p) => JSON.stringify(p)).join(", ")}`
    );
    err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
    throw err;
  }

  const initRoot = path.resolve(cwd, positionals[0] || ".");
  /** Zaznamenat před scaffoldem: po vytvoření Qwiku už adresář není prázdný. */
  const emptyScaffoldRoot = isScaffoldEmptyRoot(initRoot);
  const initFlags = emptyScaffoldRoot ? { ...flags, force: true } : flags;

  const scaffoldWarnings = [];
  /** @type {object[]} */
  let qwikScaffoldItems = [];

  if (emptyScaffoldRoot) {
    if (flags.dryRun) {
      const planned = runEmptyRootScaffold(initRoot, cwd, { dryRun: true });
      qwikScaffoldItems = planned.items || [];
      scaffoldWarnings.push(
        "Dry-run: v prázdném kořeni by se spustilo `npm create qwik@latest -- empty <root> -i true --force`, poté v kořeni `npx qwik add tailwind --skipConfirmation true`."
      );
    } else {
      const q = runEmptyRootScaffold(initRoot, cwd, { dryRun: false });
      if (!q.ok) {
        return createReport({
          command: "init",
          ok: false,
          exitCode: EXIT_CODES.UNEXPECTED_RUNTIME_ERROR,
          errors: [q.message || "Vytvoření Qwik projektu (npm create qwik + tailwind) selhalo."],
        });
      }
      qwikScaffoldItems = q.items || [];
    }
  }

  const repo = flags.repo || "local-dev";
  const url = flags.url || "file://../";
  const targetPath = flags.targetPath || "src/components/ui";
  const configPath = getConfigPath(initRoot);
  const noQuiConfigBeforeInit = !fs.existsSync(configPath);
  const policy = resolvePolicy(initFlags, readConfigPolicyOnly(configPath));

  const config = createDefaultConfig(repo, url, {
    targetPath,
    componentsRoot: flags.componentsRoot,
    uilibs: flags.uilibs ? flags.uilibs.split(",").map((x) => x.trim()).filter(Boolean) : undefined,
    connected: flags.connected ? flags.connected === "true" : true,
  });

  const configWarnings = [...scaffoldWarnings];
  let configItem = null;

  if (!fs.existsSync(configPath)) {
    if (flags.dryRun) {
      configItem = { action: "create", target: "qui.config.json", status: "planned" };
    } else {
      writeConfigAtomic(initRoot, config);
      configItem = { action: "create", target: "qui.config.json", status: "applied" };
    }
  } else {
    const tmpCompare = fs.mkdtempSync(path.join(os.tmpdir(), "qui-init-cmp-"));
    const proposedComparePath = path.join(tmpCompare, "qui.config.json");
    fs.writeFileSync(proposedComparePath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
    let configMatchesProposed = false;
    try {
      configMatchesProposed = filesAreEquivalentForReplace(configPath, proposedComparePath);
    } finally {
      fs.rmSync(tmpCompare, { recursive: true, force: true });
    }

    if (configMatchesProposed) {
      configItem = {
        action: "noop",
        target: "qui.config.json",
        status: "skipped",
        details: { reason: "equivalent_to_proposed" },
      };
    } else {
      const resolution = await resolveExistingQuiConfig({ configPath, config, flags: initFlags, policy });
      if (resolution.kind === "fail") {
        return createReport({
          command: "init",
          ok: false,
          exitCode: EXIT_CODES.POLICY_FAIL_STOP,
          errors: resolution.errors,
        });
      }
      if (resolution.kind === "dry_ask") {
        configWarnings.push(resolution.warning);
        configItem = {
          action: "modify",
          target: "qui.config.json",
          status: "planned",
          details: { conflict: true, note: "needs resolution when not dry-run" },
        };
      } else if (resolution.kind === "skip") {
        configItem = {
          action: "noop",
          target: "qui.config.json",
          status: "skipped",
          details: { conflictAction: "skip" },
        };
        configWarnings.push("Existing qui.config.json kept (skipped).");
      } else if (resolution.kind === "postfix") {
        const postfixAbs = quiConfigPostfixPath(configPath);
        const postfixRel = path.relative(initRoot, postfixAbs);
        if (flags.dryRun) {
          configItem = {
            action: "create",
            target: postfixRel,
            status: "planned",
            details: { conflictAction: "postfix" },
          };
        } else {
          fs.mkdirSync(path.dirname(postfixAbs), { recursive: true });
          writeConfigAtomicAt(postfixAbs, config);
          configItem = {
            action: "create",
            target: postfixRel,
            status: "applied",
            details: { conflictAction: "postfix" },
          };
        }
        configWarnings.push(`Existing qui.config.json kept; new defaults written to ${postfixRel}.`);
      } else if (resolution.kind === "overwrite") {
        if (flags.dryRun) {
          configItem = {
            action: "modify",
            target: "qui.config.json",
            status: "planned",
            details: { conflictAction: "overwrite" },
          };
        } else {
          writeConfigAtomic(initRoot, config);
          configItem = {
            action: "modify",
            target: "qui.config.json",
            status: "applied",
            details: { conflictAction: "overwrite" },
          };
        }
      }
    }
  }

  const templateRoot = path.join(getQuiClientRoot(), "templates", "app");
  const templateSync = await syncTemplateToProject({
    templateRoot,
    targetRoot: initRoot,
    policy,
    flags: initFlags,
  });

  const useExistingConfigTargetPath =
    configItem?.details?.reason === "equivalent_to_proposed" ||
    configItem?.details?.conflictAction === "skip";
  const reportTargetPath = useExistingConfigTargetPath
    ? readTargetPathFromConfigFile(configPath) ?? config.targetPath
    : config.targetPath;

  const items = [...qwikScaffoldItems, configItem, ...templateSync.items].filter(Boolean);

  let quiFeatureItem = null;
  const createdOrPlannedNewQuiConfig =
    configItem &&
    configItem.target === "qui.config.json" &&
    configItem.action === "create" &&
    (configItem.status === "applied" || configItem.status === "planned");

  if (noQuiConfigBeforeInit && createdOrPlannedNewQuiConfig) {
    const depRes = addQuiFeatureDependency(initRoot, getQuiFeaturePackageRoot(), {
      dryRun: Boolean(flags.dryRun),
    });
    quiFeatureItem = depRes.item;
    if (depRes.warning) configWarnings.push(depRes.warning);
  }

  const allItems = quiFeatureItem ? [...items, quiFeatureItem] : items;

  const footer = formatInitFooter(initRoot, cwd);

  return createReport({
    command: "init",
    ok: true,
    exitCode: EXIT_CODES.SUCCESS,
    repoSelector: repo,
    targetPath: reportTargetPath,
    summary: {
      planned: allItems.filter((x) => x.status === "planned").length,
      applied: allItems.filter((x) => x.status === "applied").length,
      skipped: allItems.filter((x) => x.status === "skipped").length,
      failed: 0,
    },
    items: allItems,
    warnings: [...configWarnings, ...templateSync.warnings],
    footer,
  });
}

module.exports = { runInit };
