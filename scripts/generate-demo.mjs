/**
 * Generátor demo routes z JSDoc komponent.
 *
 * Pro každou komponentu čte `components/<slug>/index.tsx`, parsuje:
 *   @title        — nadpis stránky
 *   @description  — popis komponenty pod nadpisem
 *   @example <title>
 *   Popis sekce (plain text, `backticks` → <code>).
 *   ```tsx
 *   <JSX kód />
 *   ```
 *
 * Výstup: `<targetApp>/<routesDir>/<slug>/index.tsx` (default routesDir = `src/routes/components`)
 *
 * Použití:
 *   node scripts/generate-demo.mjs [--target ./demo] [--components-dir ./demo/src/components/ui] [--routes-dir src/routes/qui-demo] [slug1 slug2 ...]
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

// ─── CLI args ─────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
let targetApp = path.join(repoRoot, "demo");
let componentsDir = path.join(repoRoot, "components");
let routesRelative = "src/routes/components";
const slugFilter = new Set();

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--target" && args[i + 1]) {
    targetApp = path.resolve(args[++i]);
  } else if (args[i] === "--components-dir" && args[i + 1]) {
    componentsDir = path.resolve(args[++i]);
  } else if (args[i] === "--routes-dir" && args[i + 1]) {
    routesRelative = args[++i].replace(/\\/g, "/");
  } else if (!args[i].startsWith("--")) {
    slugFilter.add(args[i]);
  }
}

const routeParts = String(routesRelative).split(/[/\\]/).filter(Boolean);
const routesDir = path.join(targetApp, ...routeParts);

// ─── JSDoc parser ─────────────────────────────────────────────────────────────

/**
 * @param {string} text  full source file text
 * @returns {{ title: string|null, description: string|null, examples: Array<{title:string, desc:string, code:string}> }}
 */
function parseJsDoc(text) {
  // First JSDoc block at the top of the file
  const blockMatch = text.match(/^\/\*\*([\s\S]*?)\*\//);
  if (!blockMatch) return { title: null, description: null, examples: [] };

  const body = blockMatch[1]
    .split("\n")
    .map((l) => l.replace(/^\s*\*\s?/, ""))
    .join("\n");

  let title = null;
  let description = null;
  /** @type {Array<{title:string, desc:string, code:string}>} */
  const examples = [];

  // Split on @ tags
  const tagSections = body.split(/(?=^@)/m);

  for (const section of tagSections) {
    const trimmed = section.trim();
    if (!trimmed) continue;

    if (trimmed.startsWith("@title ")) {
      title = trimmed.slice("@title ".length).trim();
    } else if (trimmed.startsWith("@description")) {
      description = trimmed.slice("@description".length).replace(/^\s/, "").trim();
    } else if (trimmed.startsWith("@example")) {
      const rest = trimmed.slice("@example".length).replace(/^\s/, "");
      const lines = rest.split("\n");
      const exTitle = lines[0].trim() || "Příklad";
      const body = lines.slice(1).join("\n");

      // Extract code block
      const codeMatch = body.match(/```(?:tsx|ts|jsx|js)?\n([\s\S]*?)```/);
      const code = codeMatch ? codeMatch[1].trimEnd() : "";

      // Description = text before the code block
      const descRaw = codeMatch
        ? body.slice(0, body.indexOf("```")).trim()
        : body.trim();

      examples.push({ title: exTitle, desc: descRaw, code });
    }
  }

  return { title, description, examples };
}

// ─── Code helpers ─────────────────────────────────────────────────────────────

/**
 * Escape text for use inside JSX element text (not inside `{…}` expressions).
 * Prevents `<`/`>` from starting bogus tags, `{`/`}` from opening JSX expressions,
 * and fixes `&`.
 * @param {string} s
 */
function escapeJsxText(s) {
  return s
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/\{/g, "&#123;")
    .replace(/\}/g, "&#125;");
}

/**
 * JSDoc description → safe JSX inside `<Desc>` / page copy:
 * decode HTML entities, then `` `word` `` → `<code>…</code>` with escaped spans.
 * @param {string} text
 */
function formatJsxDescription(text) {
  const decoded = decodeBasicHtmlEntities(text);
  const parts = decoded.split(/(`[^`]+`)/g);
  return parts
    .map((part) => {
      if (part.startsWith("`") && part.endsWith("`") && part.length >= 2) {
        const inner = part.slice(1, -1);
        return `<code class="text-caption-1">${escapeJsxText(inner)}</code>`;
      }
      return escapeJsxText(part);
    })
    .join("");
}

/**
 * Escape a string for embedding in a JS template literal.
 * @param {string} s
 */
function escapeTemplateLiteral(s) {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

/**
 * JSDoc examples often use invalid placeholders like `onClick$={...}`.
 * Replace with a no-op Qwik handler so generated routes typecheck.
 * @param {string} code
 */
function sanitizeExampleCode(code) {
  return code.replace(
    /(\b[a-zA-Z_$][\w$]*\$)\s*=\s*\{\s*\.\.\.\s*\}/g,
    "$1={() => {}}",
  );
}

/**
 * Decode a few HTML entities that sometimes appear in JSDoc backticks.
 * @param {string} text
 */
function decodeBasicHtmlEntities(text) {
  return text
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">");
}

/**
 * @param {string} mod
 * @param {string} slug
 * @param {string|null} uiLib
 */
function isUiModuleForSlug(mod, slug, uiLib = null) {
  const escapedSlug = slug.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
  const anyUiLibPath = new RegExp(`^~/components/ui/[^/]+/${escapedSlug}$`);
  const libPath = uiLib ? `~/components/ui/${uiLib}/${slug}` : null;
  return (
    anyUiLibPath.test(mod) ||
    mod === libPath ||
    mod === `~/components/ui/${slug}` ||
    mod === `~/components/ui/base/${slug}` ||
    mod === `../${slug}` ||
    mod === `./${slug}`
  );
}

/**
 * Drop import lines that only re-import the page's primary component from
 * `~/components/ui/<slug>` (already added by renderRoute). Keeps lines that
 * import other symbols from the same module.
 * @param {string} imp
 * @param {string} slug
 * @param {string} componentName PascalCase slug, e.g. ButtonGroup
 * @param {string|null} uiLib
 */
function isRedundantPrimaryComponentImport(imp, slug, componentName, uiLib = null) {
  const fromM = imp.match(/\bfrom\s+["']([^"']+)["']\s*;?\s*$/);
  if (!fromM) return false;
  const mod = fromM[1];
  if (!isUiModuleForSlug(mod, slug, uiLib)) return false;
  const namedM = imp.match(/import\s*\{([^}]*)\}\s*from/);
  if (!namedM) return false;
  const names = namedM[1]
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (s.includes(" as ") ? s.split(/\s+as\s+/)[1].trim() : s));
  return names.length === 1 && names[0] === componentName;
}

/**
 * @param {string} imp full import statement
 * @param {string} slug
 * @param {string} componentName
 * @param {string|null} uiLib
 */
function importBlockImportsNameFromUi(imp, slug, componentName, uiLib = null) {
  const fromM = imp.match(/\bfrom\s+["']([^"']+)["']/);
  if (!fromM || !isUiModuleForSlug(fromM[1], slug, uiLib)) return false;
  const namedM = imp.match(/import\s*\{([^}]*)\}\s*from/s);
  if (!namedM) return false;
  const names = namedM[1]
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (s.includes(" as ") ? s.split(/\s+as\s+/)[0].trim() : s));
  return names.includes(componentName);
}

/**
 * @param {string} imp
 * @returns {string|null}
 */
function parseImportFromModule(imp) {
  const fromM = imp.match(/\bfrom\s+["']([^"']+)["']/);
  return fromM ? fromM[1] : null;
}

/**
 * @param {string} imp
 * @returns {string[]|null}
 */
function parseNamedImportIds(imp) {
  const namedM = imp.match(/import\s*\{([^}]*)\}\s*from/s);
  if (!namedM) return null;
  return namedM[1]
    .split(",")
    .map((s) => s.trim())
    .filter(Boolean)
    .map((s) => (s.includes(" as ") ? s.split(/\s+as\s+/)[0].trim() : s));
}

/**
 * Drop import blocks whose symbols are a strict subset of another import from the same module.
 * @param {string[]} imports
 */
function dropSubsetImportsFromSameModule(imports) {
  const list = [...imports];
  return list.filter((imp, i) => {
    const from = parseImportFromModule(imp);
    const ids = parseNamedImportIds(imp);
    if (!from || !ids || ids.length === 0) return true;
    return !list.some((other, j) => {
      if (i === j) return false;
      const fromO = parseImportFromModule(other);
      if (fromO !== from) return false;
      const idsO = parseNamedImportIds(other);
      if (!idsO || idsO.length <= ids.length) return false;
      return ids.every((n) => idsO.includes(n));
    });
  });
}

/**
 * True when the code uses Qwik's `$()` QRL factory (not `component$(` / `useFoo$(`).
 * @param {string} code
 */
function containsQrlDollarCall(code) {
  return /(?:^|[^A-Za-z0-9_$])\$\(/.test(code);
}

/**
 * Collect top-level import statements from a code block and return
 * { imports: string[], body: string } where body has those removed.
 * Each entry in `imports` is a full statement (supports multiline `import { … }`).
 * Strips leading ` * ` from JSDoc-wrapped example lines before parsing.
 * @param {string} code
 */
function splitImports(code) {
  const lines = code.split("\n").map((l) => l.replace(/^\s*\*\s?/, "").replace(/\s+$/, ""));
  /** @type {string[]} */
  const importBlocks = [];
  const bodyLines = [];
  let buf = [];
  let inImport = false;

  const flushImport = () => {
    if (buf.length) {
      importBlocks.push(buf.join("\n"));
      buf = [];
    }
  };

  for (const line of lines) {
    if (/^import\s/.test(line)) {
      flushImport();
      buf = [line];
      if (/;\s*$/.test(line)) {
        flushImport();
        inImport = false;
      } else {
        inImport = true;
      }
    } else if (inImport) {
      buf.push(line);
      if (/;\s*$/.test(line)) {
        flushImport();
        inImport = false;
      }
    } else {
      bodyLines.push(line);
    }
  }
  flushImport();

  return { imports: importBlocks, body: bodyLines.join("\n").trim() };
}

/**
 * Split a code body into { preamble, jsx }.
 * Preamble = leading const/let/var/function/export statements before the first JSX line.
 * JSX = everything from the first line whose trimmed content starts with `<` (a tag).
 * Do not use `{` as a split point — lines like `{LANGS.map(...)}` inside `return (` would
 * be mistaken for a JSX root and break hoisted/preamble wrapping.
 * @param {string} body
 * @returns {{ preamble: string, jsx: string }}
 */
function splitPreamble(body) {
  const lines = body.split("\n");
  for (let i = 0; i < lines.length; i++) {
    const t = lines[i].trimStart();
    if (t.startsWith("<")) {
      const preamble = lines.slice(0, i).join("\n").trimEnd();
      const jsx = lines.slice(i).join("\n").trim();
      return { preamble, jsx };
    }
  }
  return { preamble: "", jsx: body };
}

/**
 * Detect a named component definition pattern:
 *   (export) const Name = component$(…)
 *   (export) function Name(…) { … }
 * Returns the component name, or null.
 * @param {string} body
 * @returns {string|null}
 */
function detectNamedComponent(body) {
  const m = body.match(
    /^(?:export\s+)?const\s+([A-Z][\w]*)\s*=\s*component\$/m,
  );
  if (m) return m[1];
  const mFn = body.match(/^export\s+function\s+([A-Z][\w]*)\s*\(/m);
  return mFn ? mFn[1] : null;
}

/**
 * Build the content for <TabExample>.
 * - Pure JSX body → inline directly.
 * - Body with preamble (const declarations) + JSX → IIFE wrapper.
 * - Named component definition → caller should hoist; this returns null (sentinel).
 * @param {string} body  code body after import removal
 * @param {string} indent  indentation prefix for each line inside TabExample
 * @returns {string}
 */
function buildTabExampleContent(body, indent) {
  const { preamble, jsx } = splitPreamble(body);

  if (!preamble) {
    // Pure JSX — indent each line directly
    return jsx
      .split("\n")
      .map((l) => (l ? indent + l : ""))
      .join("\n");
  }

  // Has preamble — wrap in IIFE: {(() => { <preamble>; return (<jsx>); })()}
  const ind2 = indent + "  ";
  const ind3 = indent + "    ";
  const reindent = (block, base) =>
    block
      .split("\n")
      .map((l) => (l.trim() ? base + l : ""))
      .join("\n");

  return (
    `${indent}{(() => {\n` +
    `${reindent(preamble, ind2)}\n` +
    `${ind2}return (\n` +
    `${reindent(jsx, ind3)}\n` +
    `${ind2});\n` +
    `${indent}})()}`
  );
}

// ─── Route renderer ───────────────────────────────────────────────────────────

/**
 * @param {string} slug
 * @param {string|null} uiLib
 * @param {{ title:string|null, description:string|null, examples: Array<{title:string,desc:string,code:string}> }} parsed
 */
function renderRoute(slug, uiLib, parsed) {
  const componentName = slug
    .split("-")
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");

  const pageTitle = escapeJsxText(parsed.title || componentName);
  const pageDesc = parsed.description || "";

  // Collect extra imports from all example code blocks
  const extraImports = new Set();
  /** @type {string[]} Named component definitions hoisted to file level */
  const hoisted = [];

  const sections = parsed.examples.map(({ title, desc, code }) => {
    code = sanitizeExampleCode(code);
    const { imports, body: jsxBody } = splitImports(code);
    for (const imp of imports) extraImports.add(imp);

    const descJsx = desc ? formatJsxDescription(desc) : "";
    const codeString = escapeTemplateLiteral(code);

    // Detect component definitions that must be hoisted to file level
    const namedComp = detectNamedComponent(jsxBody);
    let tabExampleContent;
    if (namedComp) {
      // Named: export const Foo = component$(...) — hoist as-is
      hoisted.push(jsxBody);
      tabExampleContent = `            <${namedComp} />`;
    } else if (/^export\s+default\s+component\$/.test(jsxBody)) {
      // Anonymous default export — give it a unique name and hoist
      const autoName = `_Example${hoisted.length + 1}`;
      hoisted.push(jsxBody.replace(/^export\s+default\s+component\$/, `export const ${autoName} = component$`));
      tabExampleContent = `            <${autoName} />`;
    } else {
      tabExampleContent = buildTabExampleContent(jsxBody, "            ");
    }

    return `
      <section class="space-y-3">
        <h2 class="text-headline text-label">${escapeJsxText(title)}</h2>
        <CodeExample>${
          descJsx
            ? `
          <Desc>${descJsx}</Desc>`
            : ""
        }
          <TabExample>
${tabExampleContent}
          </TabExample>
          <TabCode>{\`${codeString}\`}</TabCode>
        </CodeExample>
      </section>`;
  });

  // QRL factory `$()` — only keep `$` import when examples/hoisted actually use it
  let combinedForDollar = hoisted.join("\n");
  for (const ex of parsed.examples) {
    const c = sanitizeExampleCode(ex.code);
    combinedForDollar += "\n" + splitImports(c).body;
  }

  // Merge all @builder.io/qwik named imports from examples into one import line
  const qwikSymbols = new Set(["component$"]);
  for (const imp of extraImports) {
    if (imp.includes('"@builder.io/qwik"')) {
      const m = imp.match(/import\s*\{([^}]+)\}/);
      if (m) m[1].split(",").map((s) => s.trim()).filter(Boolean).forEach((s) => qwikSymbols.add(s));
    }
  }
  if (containsQrlDollarCall(combinedForDollar)) qwikSymbols.add("$");
  else qwikSymbols.delete("$");

  const previewBlob = hoisted.join("\n") + sections.join("\n");
  const previewUsesMain =
    new RegExp(`<${componentName}\\b`).test(previewBlob) ||
    new RegExp(`\\.${componentName}\\b`).test(previewBlob);
  const exampleImportsPrimaryFromAnyUiLib = [...extraImports].some((imp) => {
    const fromM = imp.match(/\bfrom\s+["']([^"']+)["']\s*;?\s*$/);
    if (!fromM) return false;
    if (!/^~\/components\/ui\//.test(fromM[1])) return false;
    const ids = parseNamedImportIds(imp);
    return Boolean(ids && ids.includes(componentName));
  });
  const exampleAlreadyImportsPrimary = [...extraImports].some((imp) =>
    importBlockImportsNameFromUi(imp, slug, componentName, uiLib),
  );
  const mainImportNeeded =
    previewUsesMain &&
    !exampleAlreadyImportsPrimary &&
    !exampleImportsPrimaryFromAnyUiLib;

  const qwikImports = `import { ${[...qwikSymbols].sort().join(", ")} } from "@builder.io/qwik";`;

  // Remove imports already covered at file level (qwik + main component when present)
  let filteredExtraImports = [...extraImports].filter((imp) => {
    if (imp.includes('"@builder.io/qwik"') || imp.includes("'@builder.io/qwik'"))
      return false;
    if (
      mainImportNeeded &&
      isRedundantPrimaryComponentImport(imp, slug, componentName, uiLib)
    )
      return false;
    return true;
  });
  filteredExtraImports = [...new Set(filteredExtraImports)];
  filteredExtraImports = dropSubsetImportsFromSameModule(filteredExtraImports);
  const extraImportBlock = filteredExtraImports.length
    ? "\n" + filteredExtraImports.join("\n")
    : "";

  const descBlock = pageDesc
    ? `
        <p class="mt-2 max-w-prose text-body text-secondary-label">
          ${formatJsxDescription(pageDesc)}
        </p>`
    : "";

  const hoistedBlock = hoisted.length ? "\n" + hoisted.join("\n\n") + "\n" : "";

  const componentImportPath = uiLib
    ? `~/components/ui/${uiLib}/${slug}`
    : `~/components/ui/base/${slug}`;
  const mainImportLine = mainImportNeeded
    ? `\nimport { ${componentName} } from "${componentImportPath}";`
    : "";

  return `${qwikImports}${mainImportLine}${extraImportBlock}
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/ui/qui-demo/codeexample";
${hoistedBlock}
export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">${pageTitle}</h1>${descBlock}
      </div>
${sections.join("\n")}
    </div>
  );
});
`;
}

// ─── package.json (Qwik + Vite) ───────────────────────────────────────────────

/**
 * Same rule as Qwik starter `vite.config.ts` / `errorOnDuplicatesPkgDeps`:
 * any package listed under `dependencies` whose name matches `/qwik/i` must
 * not stay in `dependencies` — move to `devDependencies` (keeps existing
 * dev range if the name is already there).
 * @param {string} targetApp absolute app root
 * @returns {boolean} whether package.json was written
 */
function moveQwikNamedDepsToDevDependencies(targetApp) {
  const pkgPath = path.join(targetApp, "package.json");
  if (!fs.existsSync(pkgPath)) return false;
  let pkg;
  try {
    pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  } catch {
    return false;
  }
  const deps =
    pkg.dependencies && typeof pkg.dependencies === "object" ? { ...pkg.dependencies } : {};
  const devDeps =
    pkg.devDependencies && typeof pkg.devDependencies === "object"
      ? { ...pkg.devDependencies }
      : {};
  const qwikish = /qwik/i;
  let changed = false;
  for (const name of Object.keys(deps)) {
    if (!qwikish.test(name)) continue;
    if (!(name in devDeps)) devDeps[name] = deps[name];
    delete deps[name];
    changed = true;
  }
  if (!changed) return false;
  pkg.dependencies = deps;
  pkg.devDependencies = devDeps;
  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");
  return true;
}

/**
 * Po `qui generate-demo` musí mít aplikace `qui-client` v devDependencies (`file:` → kořen balíčku).
 * Odstraní legacy `qui-feature`, přesune `qui-client` z dependencies, doplní chybějící / opraví spec.
 * @param {string} targetApp absolute app root
 * @returns {boolean} whether package.json was written
 */
function ensureQuiClientDevDependency(targetApp) {
  const pkgPath = path.join(targetApp, "package.json");
  if (!fs.existsSync(pkgPath)) return false;
  let pkg;
  try {
    pkg = JSON.parse(fs.readFileSync(pkgPath, "utf8"));
  } catch {
    return false;
  }
  if (!pkg || typeof pkg !== "object") return false;

  const deps =
    pkg.dependencies && typeof pkg.dependencies === "object" ? { ...pkg.dependencies } : {};
  const devDeps =
    pkg.devDependencies && typeof pkg.devDependencies === "object"
      ? { ...pkg.devDependencies }
      : {};

  const rel = path.relative(targetApp, repoRoot);
  const posixRel = rel.split(path.sep).join("/");
  const fileSpec = posixRel.startsWith(".") ? `file:${posixRel}` : `file:./${posixRel}`;

  let changed = false;
  if (deps["qui-feature"] || devDeps["qui-feature"]) {
    delete deps["qui-feature"];
    delete devDeps["qui-feature"];
    devDeps["qui-client"] = fileSpec;
    changed = true;
  }
  if (deps["qui-client"]) {
    if (!devDeps["qui-client"]) devDeps["qui-client"] = deps["qui-client"];
    delete deps["qui-client"];
    changed = true;
  }
  if (devDeps["qui-client"] !== fileSpec) {
    devDeps["qui-client"] = fileSpec;
    changed = true;
  }

  if (!changed) return false;

  pkg.dependencies = deps;
  pkg.devDependencies = devDeps;
  fs.writeFileSync(pkgPath, `${JSON.stringify(pkg, null, 2)}\n`, "utf8");
  return true;
}

// ─── Route paths & stale cleanup ──────────────────────────────────────────────

function usesNestedComponentRoutes(routesDir) {
  return path.basename(routesDir) !== "components";
}

/**
 * @param {string} slug
 * @param {string|null} uiLib
 * @param {string} routesDir
 */
function resolveRouteDir(slug, uiLib, routesDir) {
  const nested = usesNestedComponentRoutes(routesDir);
  if (nested) {
    return uiLib
      ? path.join(routesDir, "components", uiLib, slug)
      : path.join(routesDir, "components", slug);
  }
  return uiLib ? path.join(routesDir, uiLib, slug) : path.join(routesDir, slug);
}

/**
 * @param {string} routesDir
 */
function getComponentRoutesRoot(routesDir) {
  return usesNestedComponentRoutes(routesDir)
    ? path.join(routesDir, "components")
    : routesDir;
}

/**
 * @param {string} removedDir
 * @param {string} boundaryDir
 */
function pruneEmptyParentDirectories(removedDir, boundaryDir) {
  const boundary = path.resolve(boundaryDir);
  let current = path.dirname(path.resolve(removedDir));
  while (current !== boundary && (current + path.sep).startsWith(boundary + path.sep)) {
    if (!fs.existsSync(current)) break;
    if (fs.readdirSync(current).length > 0) break;
    fs.rmdirSync(current);
    current = path.dirname(current);
  }
}

/**
 * Remove demo routes whose source component no longer exists under componentsDir.
 * Skipped when generating a slug subset (same rule as partial writes).
 * @param {{ routesDir: string, componentsDir: string, targetApp: string, slugFilter: Set<string> }} opts
 * @returns {number}
 */
function pruneStaleComponentRoutes({ routesDir, componentsDir, targetApp, slugFilter }) {
  if (slugFilter.size > 0) return 0;

  const componentRoutesRoot = getComponentRoutesRoot(routesDir);
  if (!fs.existsSync(componentRoutesRoot)) return 0;

  let removed = 0;

  /** @param {string} dir */
  function walkRoutes(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    if (entries.some((entry) => entry.isFile() && entry.name === "index.tsx")) {
      const rel = path.relative(componentRoutesRoot, dir);
      const segments = rel.split(path.sep).filter(Boolean);
      if (segments.length === 0) return;

      const slug = segments[segments.length - 1];
      const uiLib = segments.length > 1 ? segments[0] : null;
      const componentPath = uiLib
        ? path.join(componentsDir, uiLib, slug, "index.tsx")
        : path.join(componentsDir, slug, "index.tsx");

      if (!fs.existsSync(componentPath)) {
        fs.rmSync(dir, { recursive: true, force: true });
        console.log(`Removed stale route: ${path.relative(targetApp, dir)}`);
        pruneEmptyParentDirectories(dir, componentRoutesRoot);
        removed++;
      }
      return;
    }

    for (const entry of entries) {
      if (entry.isDirectory()) walkRoutes(path.join(dir, entry.name));
    }
  }

  walkRoutes(componentRoutesRoot);
  return removed;
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  if (!fs.existsSync(componentsDir)) {
    console.error(`Components directory not found: ${componentsDir}`);
    process.exit(1);
  }
  fs.mkdirSync(routesDir, { recursive: true });

  // Collect component dirs (flat or nested)
  /** @type {string[]} */
  const componentDirs = [];
  function walk(dir) {
    const entries = fs
      .readdirSync(dir, { withFileTypes: true })
      .sort((a, b) => a.name.localeCompare(b.name));
    if (entries.some((e) => e.isFile() && e.name === "index.tsx")) {
      componentDirs.push(dir);
      return;
    }
    for (const e of entries) {
      if (e.isDirectory()) walk(path.join(dir, e.name));
    }
  }
  walk(componentsDir);

  let written = 0;
  let skipped = 0;

  for (const compDir of componentDirs) {
    const slug = path.basename(compDir);
    if (slugFilter.size > 0 && !slugFilter.has(slug)) continue;

    const indexPath = path.join(compDir, "index.tsx");
    const source = fs.readFileSync(indexPath, "utf8");
    const parsed = parseJsDoc(source);

    if (!parsed.title && parsed.examples.length === 0) {
      skipped++;
      continue;
    }

    const relCompDir = path.relative(componentsDir, compDir);
    const relSegments = relCompDir.split(path.sep).filter(Boolean);
    const uiLib = relSegments.length > 1 ? relSegments[0] : null;
    const routeDir = resolveRouteDir(slug, uiLib, routesDir);
    const routePath = path.join(routeDir, "index.tsx");
    fs.mkdirSync(routeDir, { recursive: true });
    fs.writeFileSync(routePath, renderRoute(slug, uiLib, parsed), "utf8");
    console.log(`Generated: ${path.relative(targetApp, routePath)}`);
    written++;
  }

  const removed = pruneStaleComponentRoutes({
    routesDir,
    componentsDir,
    targetApp,
    slugFilter,
  });

  const appRoot = path.resolve(targetApp);
  if (ensureQuiClientDevDependency(appRoot)) {
    console.log(
      "generate-demo: ensured qui-client in devDependencies (file: → repo root); run npm install in the app if needed",
    );
  }
  if (moveQwikNamedDepsToDevDependencies(appRoot)) {
    console.log(
      "generate-demo: moved qwik-related packages from dependencies → devDependencies (vite.config rule, /qwik/i on package name)",
    );
  }

  console.log(
    `generate-demo: written ${written}, skipped (no JSDoc) ${skipped}, removed stale ${removed}`,
  );
}

main();
