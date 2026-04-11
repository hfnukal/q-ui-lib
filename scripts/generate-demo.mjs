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
 * Converts backtick-quoted words to <code> JSX elements.
 * "Prop `variant`: `primary`" →  'Prop <code class="text-caption-1">variant</code>: <code class="text-caption-1">primary</code>'
 * @param {string} text
 * @returns {string}  JSX-safe string (may contain <code> tags)
 */
function inlineCode(text) {
  return text.replace(/`([^`]+)`/g, '<code class="text-caption-1">$1</code>');
}

/**
 * Escape a string for embedding in a JS template literal.
 * @param {string} s
 */
function escapeTemplateLiteral(s) {
  return s.replace(/\\/g, "\\\\").replace(/`/g, "\\`").replace(/\$\{/g, "\\${");
}

/**
 * Collect top-level import lines from a code block and return
 * { imports: string[], body: string } where body has those lines removed.
 * @param {string} code
 */
function splitImports(code) {
  const lines = code.split("\n");
  const importLines = [];
  const bodyLines = [];
  let inImport = false;
  for (const line of lines) {
    if (/^import\s/.test(line)) {
      importLines.push(line);
      inImport = true;
    } else if (inImport && /^\s/.test(line)) {
      importLines.push(line);
    } else {
      inImport = false;
      bodyLines.push(line);
    }
  }
  return { imports: importLines, body: bodyLines.join("\n").trim() };
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

  const pageTitle = parsed.title || componentName;
  const pageDesc = parsed.description || "";

  // Collect extra imports from all example code blocks
  const extraImports = new Set();
  let needsDollar = false;

  const sections = parsed.examples.map(({ title, desc, code }) => {
    const { imports, body: jsxBody } = splitImports(code);
    for (const imp of imports) extraImports.add(imp);
    if (/\$\(/.test(jsxBody)) needsDollar = true;

    const descJsx = desc ? inlineCode(desc) : "";
    const codeString = escapeTemplateLiteral(code);

    // Indent jsxBody for TabExample (2 levels: section > CodeExample > TabExample > content)
    const indentedJsx = jsxBody
      .split("\n")
      .map((l) => (l ? "            " + l : ""))
      .join("\n");

    return `
      <section class="space-y-3">
        <h2 class="text-headline text-label">${title}</h2>
        <CodeExample>${
          descJsx
            ? `
          <Desc>${descJsx}</Desc>`
            : ""
        }
          <TabExample>
${indentedJsx}
          </TabExample>
          <TabCode>{\`${codeString}\`}</TabCode>
        </CodeExample>
      </section>`;
  });

  const qwikImports = needsDollar ? `import { $, component$ } from "@builder.io/qwik";` : `import { component$ } from "@builder.io/qwik";`;
  const extraImportBlock = [...extraImports].length
    ? "\n" + [...extraImports].join("\n")
    : "";

  const descBlock = pageDesc
    ? `
        <p class="mt-2 max-w-prose text-body text-secondary-label">
          ${inlineCode(pageDesc)}
        </p>`
    : "";

  return `${qwikImports}
import { ${componentName} } from "~/components/ui/${slug}";${extraImportBlock}
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";

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
