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
 * Výstup: `<targetApp>/src/routes/components/<slug>/index.tsx`
 *
 * Použití:
 *   node scripts/generate-demo.mjs [--target ./demo] [slug1 slug2 ...]
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const componentsDir = path.join(repoRoot, "components");

// ─── CLI args ─────────────────────────────────────────────────────────────────

const args = process.argv.slice(2);
let targetApp = path.join(repoRoot, "demo");
const slugFilter = new Set();

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--target" && args[i + 1]) {
    targetApp = path.resolve(args[++i]);
  } else if (!args[i].startsWith("--")) {
    slugFilter.add(args[i]);
  }
}

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
 * Drop import lines that only re-import the page's primary component from
 * `~/components/ui/<slug>` (already added by renderRoute). Keeps lines that
 * import other symbols from the same module.
 * @param {string} imp
 * @param {string} slug
 * @param {string} componentName PascalCase slug, e.g. ButtonGroup
 */
function isRedundantPrimaryComponentImport(imp, slug, componentName) {
  const fromM = imp.match(/\bfrom\s+["']([^"']+)["']\s*;?\s*$/);
  if (!fromM) return false;
  const mod = fromM[1];
  if (mod !== `~/components/ui/${slug}` && mod !== `../${slug}` && mod !== `./${slug}`)
    return false;
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
 */
function importBlockImportsNameFromUi(imp, slug, componentName) {
  const fromM = imp.match(/\bfrom\s+["']([^"']+)["']/);
  if (!fromM || fromM[1] !== `~/components/ui/${slug}`) return false;
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
 * @param {{ title:string|null, description:string|null, examples: Array<{title:string,desc:string,code:string}> }} parsed
 */
function renderRoute(slug, parsed) {
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
  const exampleAlreadyImportsPrimary = [...extraImports].some((imp) =>
    importBlockImportsNameFromUi(imp, slug, componentName),
  );
  const mainImportNeeded = previewUsesMain && !exampleAlreadyImportsPrimary;

  const qwikImports = `import { ${[...qwikSymbols].sort().join(", ")} } from "@builder.io/qwik";`;

  // Remove imports already covered at file level (qwik + main component when present)
  let filteredExtraImports = [...extraImports].filter((imp) => {
    if (imp.includes('"@builder.io/qwik"') || imp.includes("'@builder.io/qwik'"))
      return false;
    if (
      mainImportNeeded &&
      isRedundantPrimaryComponentImport(imp, slug, componentName)
    )
      return false;
    return true;
  });
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

  const mainImportLine = mainImportNeeded
    ? `\nimport { ${componentName} } from "~/components/ui/${slug}";`
    : "";

  return `${qwikImports}${mainImportLine}${extraImportBlock}
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";
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

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const routesDir = path.join(targetApp, "src", "routes", "components");
  if (!fs.existsSync(routesDir)) {
    console.error(`Routes directory not found: ${routesDir}`);
    process.exit(1);
  }

  // Collect component dirs (flat or nested)
  /** @type {string[]} */
  const componentDirs = [];
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
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

    const routeDir = path.join(routesDir, slug);
    const routePath = path.join(routeDir, "index.tsx");
    fs.mkdirSync(routeDir, { recursive: true });
    fs.writeFileSync(routePath, renderRoute(slug, parsed), "utf8");
    console.log(`Generated: ${path.relative(repoRoot, routePath)}`);
    written++;
  }

  console.log(`generate-demo: written ${written}, skipped (no JSDoc) ${skipped}`);
}

main();
