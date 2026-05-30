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
const { getQuiClientRoot } = require("../services/runtime-paths");
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

/** @param {string} pkgPath */
function readPackageJsonAt(pkgPath) {
  if (!fs.existsSync(pkgPath)) return null;
  try {
    const pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
    return pkg && typeof pkg === "object" ? pkg : null;
  } catch {
    return null;
  }
}

/** @param {object|null|undefined} pkg */
function hasQwikApp(pkg) {
  if (!pkg) return false;
  const d =
    pkg.dependencies && typeof pkg.dependencies === "object" && pkg.dependencies !== null
      ? pkg.dependencies
      : {};
  const dd =
    pkg.devDependencies && typeof pkg.devDependencies === "object" && pkg.devDependencies !== null
      ? pkg.devDependencies
      : {};
  const qwik = d["@builder.io/qwik"] ?? dd["@builder.io/qwik"];
  const city = d["@builder.io/qwik-city"] ?? dd["@builder.io/qwik-city"];
  return Boolean(qwik && city);
}

/** @param {object|null|undefined} pkg */
function hasQuiClientDependency(pkg) {
  if (!pkg) return false;
  const d =
    pkg.dependencies && typeof pkg.dependencies === "object" && pkg.dependencies !== null
      ? pkg.dependencies
      : {};
  const dd =
    pkg.devDependencies && typeof pkg.devDependencies === "object" && pkg.devDependencies !== null
      ? pkg.devDependencies
      : {};
  return d["qui-client"] != null || dd["qui-client"] != null;
}

function toPosixPath(p) {
  return p.split(path.sep).join("/");
}

/**
 * @param {string} projectRoot
 * @param {string} clientRoot  kořen balíčku qui-client (monorepo root)
 * @param {{ dryRun: boolean }} opts
 * @returns {{ item: object|null, warning?: string }}
 */
function addQuiClientDevDependency(projectRoot, clientRoot, opts) {
  const pkgPath = path.join(projectRoot, "package.json");
  if (!fs.existsSync(pkgPath)) {
    return {
      item: null,
      warning: "Nelze přidat qui-client: v kořeni projektu chybí package.json.",
    };
  }
  if (!fs.existsSync(path.join(clientRoot, "package.json"))) {
    return {
      item: null,
      warning: "Balíček qui-client nebyl nalezen u očekávaného kořene repozitáře; devDependency se nepřidá.",
    };
  }

  const rel = path.relative(projectRoot, clientRoot);
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
    return { item: null, warning: "package.json není platný JSON; qui-client se nepřidá." };
  }
  if (!pkg || typeof pkg !== "object") {
    return { item: null, warning: "package.json má neočekávaný tvar; qui-client se nepřidá." };
  }

  const deps =
    pkg.dependencies && typeof pkg.dependencies === "object" && pkg.dependencies !== null
      ? pkg.dependencies
      : {};
  const devDeps =
    pkg.devDependencies && typeof pkg.devDependencies === "object" && pkg.devDependencies !== null
      ? pkg.devDependencies
      : {};
  const prevDep = deps["qui-client"];
  const prevDev = devDeps["qui-client"];

  if (prevDev === fileSpec && (prevDep === undefined || prevDep === null)) {
    return {
      item: {
        action: "noop",
        target: "package.json",
        status: "skipped",
        details: { reason: "qui-client_dev_dep_unchanged" },
      },
    };
  }

  if (opts.dryRun) {
    return {
      item: {
        action: "modify",
        target: "package.json",
        status: "planned",
        details: { dep: "qui-client", spec: fileSpec, section: "devDependencies" },
      },
    };
  }

  pkg.dependencies = typeof pkg.dependencies === "object" && pkg.dependencies !== null ? { ...pkg.dependencies } : {};
  pkg.devDependencies =
    typeof pkg.devDependencies === "object" && pkg.devDependencies !== null ? { ...pkg.devDependencies } : {};
  delete pkg.dependencies["qui-client"];
  pkg.devDependencies["qui-client"] = fileSpec;
  const next = `${JSON.stringify(pkg, null, 2)}\n`;
  const tempPath = `${pkgPath}.${Date.now()}.tmp`;
  fs.writeFileSync(tempPath, next, "utf8");
  fs.renameSync(tempPath, pkgPath);

  return {
    item: {
      action: "modify",
      target: "package.json",
      status: "applied",
      details: {
        dep: "qui-client",
        spec: fileSpec,
        section: "devDependencies",
        previous: { dependencies: prevDep, devDependencies: prevDev },
      },
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
  const configPath = getConfigPath(initRoot);
  const packageJsonPath = path.join(initRoot, "package.json");
  const existingPkg = readPackageJsonAt(packageJsonPath);
  const hasQuiConfigFile = fs.existsSync(configPath);

  /**
   * - scaffold_empty: prázdný kořen → Qwik scaffold + šablona (--force u sync).
   * - qwik_bootstrap: existující Qwik bez qui.config a bez qui-client → doplnění jako po scaffoldu (bez npm create).
   * - qwik_sync_templates: Qwik + qui-client → jen synchronizace `templates/app`.
   * - default: ostatní neprázdné kořeny.
   */
  const initMode = emptyScaffoldRoot
    ? "scaffold_empty"
    : hasQwikApp(existingPkg) && hasQuiClientDependency(existingPkg)
      ? "qwik_sync_templates"
      : hasQwikApp(existingPkg) && !hasQuiConfigFile && !hasQuiClientDependency(existingPkg)
        ? "qwik_bootstrap"
        : "default";

  const initFlags = initMode === "scaffold_empty" ? { ...flags, force: true } : flags;

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
  const policy = resolvePolicy(initFlags, readConfigPolicyOnly(configPath));

  const config = createDefaultConfig(repo, url, {
    targetPath,
  });

  const configWarnings = [...scaffoldWarnings];
  let configItem = null;

  const skipQuiConfigWrites =
    initMode === "qwik_sync_templates" && hasQuiConfigFile;

  if (skipQuiConfigWrites) {
    configItem = {
      action: "noop",
      target: "qui.config.json",
      status: "skipped",
      details: { reason: "template_sync_only" },
    };
  } else if (!fs.existsSync(configPath)) {
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
    configItem?.details?.conflictAction === "skip" ||
    configItem?.details?.reason === "template_sync_only";
  const reportTargetPath = useExistingConfigTargetPath
    ? readTargetPathFromConfigFile(configPath) ?? config.targetPath
    : config.targetPath;

  const items = [...qwikScaffoldItems, configItem, ...templateSync.items].filter(Boolean);

  let quiClientDepItem = null;
  const depRes = addQuiClientDevDependency(initRoot, getQuiClientRoot(), {
    dryRun: Boolean(flags.dryRun),
  });
  quiClientDepItem = depRes.item;
  if (depRes.warning) configWarnings.push(depRes.warning);

  if (
    !flags.dryRun &&
    quiClientDepItem &&
    quiClientDepItem.status === "applied" &&
    quiClientDepItem.action === "modify"
  ) {
    const shell = process.platform === "win32";
    const npm = spawnSync("npm", ["install"], {
      cwd: initRoot,
      stdio: "inherit",
      shell,
      env: process.env,
    });
    if (npm.error) {
      configWarnings.push(`npm install: ${npm.error.message || String(npm.error)}`);
    } else if (npm.status !== 0) {
      configWarnings.push(
        `npm install po doplnění qui-client skončil s kódem ${npm.status}. Spusťte ručně v kořeni projektu.`,
      );
    }
  }

  const allItems = quiClientDepItem ? [...items, quiClientDepItem] : items;

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
