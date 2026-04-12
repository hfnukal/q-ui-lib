/**
 * Jednorázový migrační skript:
 * Přečte existující demo routes (demo/src/routes/components/<slug>/index.tsx),
 * extrahuje popis stránky a @example sekce, zapíše je jako JSDoc
 * do components/base/<slug>/index.tsx.
 *
 * Použití:
 *   node scripts/migrate-demo-to-jsdoc.mjs [slug1 slug2 ...]
 */

import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");
const demoRoutesDir = path.join(repoRoot, "demo", "src", "routes", "components");
const baseDir = path.join(repoRoot, "components", "base");

const slugFilter = new Set(process.argv.slice(2));

// ─── JSX text cleanup ─────────────────────────────────────────────────────────

/**
 * Convert JSX text content to clean plain text:
 *  - {" "} → space
 *  - <code ...>text</code> → `text`
 *  - strip remaining HTML/JSX tags
 *  - collapse whitespace
 * @param {string} jsx
 * @returns {string}
 */
function jsxToText(jsx) {
  return jsx
    .replace(/\{"\s*"\}/g, " ")                          // {" "} → space
    .replace(/<code[^>]*>\s*([\s\S]*?)\s*<\/code>/g, "`$1`") // <code> → backticks
    .replace(/<[^>]+>/g, "")                              // strip remaining tags
    .replace(/\{\/\*[\s\S]*?\*\/\}/g, "")                 // strip {/* comments */}
    .replace(/\s*\n\s*/g, " ")                            // collapse newlines
    .replace(/ {2,}/g, " ")                               // collapse spaces
    .trim();
}

// ─── Code variable extraction ─────────────────────────────────────────────────

/**
 * Extract `const name = `...`` template literal variables from source.
 * @param {string} source
 * @returns {Map<string, string>}
 */
function extractCodeVariables(source) {
  const vars = new Map();
  // Match: const varName = `...`; — backtick template literal
  // Use a state-machine approach to handle nested backticks escaped as \`
  const re = /const\s+(\w+)\s*=\s*`/g;
  let m;
  while ((m = re.exec(source)) !== null) {
    const name = m[1];
    const start = m.index + m[0].length;
    // Walk forward to find the closing unescaped backtick
    let i = start;
    let content = "";
    while (i < source.length) {
      if (source[i] === "\\" && source[i + 1] === "`") {
        content += "`";
        i += 2;
      } else if (source[i] === "`") {
        break;
      } else {
        content += source[i];
        i++;
      }
    }
    vars.set(name, content);
  }
  return vars;
}

// ─── Block extractors ─────────────────────────────────────────────────────────

/**
 * Extract the page description from the <p class="mt-2 max-w-prose..."> block.
 * @param {string} source
 * @returns {string|null}
 */
function extractPageDescription(source) {
  const m = source.match(/<p\s[^>]*mt-2[^>]*max-w-prose[^>]*>([\s\S]*?)<\/p>/);
  if (!m) return null;
  return jsxToText(m[1]) || null;
}

/**
 * Extract sections: { title, desc, code }[]
 * @param {string} source
 * @param {Map<string, string>} codeVars
 * @returns {Array<{title:string, desc:string, code:string}>}
 */
function extractSections(source, codeVars) {
  const sections = [];

  // Find all <section ...> blocks (non-greedy between sections)
  const sectionRe = /<section\b[^>]*>([\s\S]*?)<\/section>/g;
  let sm;
  while ((sm = sectionRe.exec(source)) !== null) {
    const body = sm[1];

    // Title from <h2>
    const h2m = body.match(/<h2\b[^>]*>([\s\S]*?)<\/h2>/);
    if (!h2m) continue;
    const title = jsxToText(h2m[1]);
    if (!title) continue;

    // Find <CodeExample> block inside section
    const ceM = body.match(/<CodeExample\b[^>]*>([\s\S]*?)<\/CodeExample>/);
    if (!ceM) continue;
    const ceBody = ceM[1];

    // Desc
    const descM = ceBody.match(/<Desc\b[^>]*>([\s\S]*?)<\/Desc>/);
    const desc = descM ? jsxToText(descM[1]) : "";

    // TabCode — inline template literal or variable reference
    const tabCodeM = ceBody.match(/<TabCode\b[^>]*>([\s\S]*?)<\/TabCode>/);
    if (!tabCodeM) continue;
    const tabCodeContent = tabCodeM[1].trim();

    let code = "";
    // Inline: {`...`}
    const inlineM = tabCodeContent.match(/^\{`([\s\S]*)`\}$/);
    if (inlineM) {
      code = inlineM[1];
    } else {
      // Variable reference: {varName}
      const varM = tabCodeContent.match(/^\{(\w+)\}$/);
      if (varM && codeVars.has(varM[1])) {
        code = codeVars.get(varM[1]);
      }
    }

    if (!code) continue;

    sections.push({ title, desc, code });
  }

  return sections;
}

// ─── JSDoc writer ─────────────────────────────────────────────────────────────

/**
 * Replace the leading JSDoc block in a component source with an updated one
 * that includes @description and @example tags.
 * Preserves @component, @title, @version.
 * @param {string} componentSrc
 * @param {string|null} description
 * @param {Array<{title:string, desc:string, code:string}>} examples
 * @returns {string}
 */
function updateJsDoc(componentSrc, description, examples) {
  // Extract current @component, @title, @version
  const blockM = componentSrc.match(/^(\/\*\*([\s\S]*?)\*\/)/);
  if (!blockM) return componentSrc; // no JSDoc block — skip

  const body = blockM[2];
  const compM = body.match(/@component\s+(\S+)/);
  const titleM = body.match(/@title\s+(.+)/);
  const versionM = body.match(/@version\s+(\S+)/);

  const comp = compM ? compM[1].trim() : "";
  const title = titleM ? titleM[1].trim() : "";
  const version = versionM ? versionM[1].trim() : "1.0.0";

  const lines = [" * @component " + comp];
  if (title) lines.push(" * @title " + title);
  lines.push(" * @version " + version);

  if (description) {
    lines.push(" *");
    lines.push(" * @description " + description);
  }

  for (const ex of examples) {
    lines.push(" *");
    lines.push(` * @example ${ex.title}`);
    if (ex.desc) lines.push(` * ${ex.desc}`);
    lines.push(" * ```tsx");
    for (const codeLine of ex.code.split("\n")) {
      lines.push(` * ${codeLine}`);
    }
    lines.push(" * ```");
  }

  const newBlock = "/**\n" + lines.join("\n") + "\n */";
  return componentSrc.replace(blockM[1], newBlock);
}

// ─── Main ─────────────────────────────────────────────────────────────────────

function main() {
  const slugs = fs.readdirSync(demoRoutesDir).filter((s) => {
    if (slugFilter.size > 0 && !slugFilter.has(s)) return false;
    return fs.existsSync(path.join(demoRoutesDir, s, "index.tsx"));
  });

  let written = 0, skipped = 0;

  for (const slug of slugs) {
    const demoPath = path.join(demoRoutesDir, slug, "index.tsx");
    const compPath = path.join(baseDir, slug, "index.tsx");

    if (!fs.existsSync(compPath)) {
      console.warn(`  skip ${slug} — no component source`);
      skipped++;
      continue;
    }

    const demoSrc = fs.readFileSync(demoPath, "utf8");
    const compSrc = fs.readFileSync(compPath, "utf8");

    const codeVars = extractCodeVariables(demoSrc);
    const description = extractPageDescription(demoSrc);
    const examples = extractSections(demoSrc, codeVars);

    if (!description && examples.length === 0) {
      console.warn(`  skip ${slug} — nothing extracted from demo`);
      skipped++;
      continue;
    }

    const updated = updateJsDoc(compSrc, description, examples);
    if (updated === compSrc) {
      console.warn(`  skip ${slug} — no JSDoc block to update`);
      skipped++;
      continue;
    }

    fs.writeFileSync(compPath, updated, "utf8");
    console.log(`  ✓ ${slug} — ${examples.length} example(s)`);
    written++;
  }

  console.log(`\nmigrate-demo-to-jsdoc: updated ${written}, skipped ${skipped}`);
}

main();
