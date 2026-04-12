/**
 * Přidá nebo nahradí úvodní blok @component / @title / @version v components/<slug>/index.tsx.
 * Hodnoty ber z existujícího JSDoc; chybějící doplní: @title z PascalCase názvu složky, @version „1.0.0“.
 * Obsah od prvního @example do konce bloku zachová (víceřádkové příklady).
 */
import fs from "fs";
import path from "path";
import { fileURLToPath } from "url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const componentsDir = path.join(repoRoot, "components");

/** @param {string} kebab */
function kebabToPascal(kebab) {
  return kebab
    .split("-")
    .filter(Boolean)
    .map((s) => s.charAt(0).toUpperCase() + s.slice(1))
    .join("");
}

/**
 * @param {string} body — tělo prvního /** … *\/ bez ohraničení
 * @returns {string | null}
 */
function extractPreservedTailFromBody(body) {
  const lines = body.split("\n");
  const startIdx = lines.findIndex((line) => {
    const t = line.replace(/^\s*\*\s?/, "").trim();
    return t.startsWith("@example");
  });
  if (startIdx === -1) return null;
  return lines.slice(startIdx).join("\n");
}

/**
 * @param {string} text
 * @returns {{ component: string | null, title: string | null, version: string | null }}
 */
function parseComponentDirectiveBlock(text) {
  const m = text.match(/^\s*\/\*\*([\s\S]*?)\*\//);
  if (!m || !m[1].includes("@component")) {
    return { component: null, title: null, version: null };
  }
  const body = m[1];
  /** @type {{ component: string | null, title: string | null, version: string | null }} */
  const out = { component: null, title: null, version: null };
  for (const raw of body.split("\n")) {
    const line = raw.replace(/^\s*\*\s?/, "").trim();
    if (!line.startsWith("@")) continue;
    if (line.startsWith("@component "))
      out.component = line.slice("@component ".length).trim();
    else if (line.startsWith("@title ")) out.title = line.slice("@title ".length).trim();
    else if (line.startsWith("@version ")) out.version = line.slice("@version ".length).trim();
  }
  return out;
}

/** @param {string} component @param {string} title @param {string} version @param {string | null} preservedTail */
function buildBlock(component, title, version, preservedTail) {
  const head = `/**\n * @component ${component}\n * @title ${title}\n * @version ${version}`;
  if (preservedTail) {
    return `${head}\n${preservedTail}\n */\n\n`;
  }
  return `${head}\n */\n\n`;
}

const TAG_RE = /^\s*\/\*\*[\s\S]*?@component\s+[\w-]+[\s\S]*?\*\/\s*\n?/;

/**
 * @param {string} source
 * @param {string} block
 */
function applyBlock(source, block) {
  if (TAG_RE.test(source)) return source.replace(TAG_RE, block);
  return block + source.replace(/^\uFEFF?/, "");
}

/** Rekurzivně najde všechny složky s index.tsx pod baseDir. */
function findComponentDirs(baseDir) {
  const results = [];
  function walk(dir) {
    const entries = fs.readdirSync(dir, { withFileTypes: true });
    if (entries.some((e) => e.isFile() && e.name === "index.tsx")) {
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

function main() {
  let n = 0;
  for (const compDir of findComponentDirs(componentsDir)) {
    const folder = path.basename(compDir);
    const indexTsx = path.join(compDir, "index.tsx");

    const src = fs.readFileSync(indexTsx, "utf8");
    const m = src.match(/^\s*\/\*\*([\s\S]*?)\*\//);
    const body = m?.[1] ?? "";
    const preservedTail = extractPreservedTailFromBody(body);
    const parsed = parseComponentDirectiveBlock(src);
    const version =
      typeof parsed.version === "string" && parsed.version.trim()
        ? parsed.version.trim()
        : "1.0.0";
    const title =
      typeof parsed.title === "string" && parsed.title.trim()
        ? parsed.title.trim()
        : kebabToPascal(folder);
    const block = buildBlock(folder, title, version, preservedTail);
    fs.writeFileSync(indexTsx, applyBlock(src, block), "utf8");
    n++;
  }
  console.log(`sync-component-directives: upraveno ${n} souborů index.tsx`);
}

main();
