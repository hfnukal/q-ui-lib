/**
 * Přidá nebo nahradí úvodní blok @component / @title / @version v components/<slug>/index.tsx
 * podle meta.json (version; title = meta.title nebo PascalCase ze složky).
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

/** @param {string} component @param {string} title @param {string} version */
function buildBlock(component, title, version) {
  return `/**\n * @component ${component}\n * @title ${title}\n * @version ${version}\n */\n\n`;
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

function main() {
  let n = 0;
  for (const d of fs.readdirSync(componentsDir, { withFileTypes: true })) {
    if (!d.isDirectory()) continue;
    const folder = d.name;
    const indexTsx = path.join(componentsDir, folder, "index.tsx");
    const metaPath = path.join(componentsDir, folder, "meta.json");
    if (!fs.existsSync(indexTsx)) continue;
    if (!fs.existsSync(metaPath)) {
      console.warn(`[sync-directives] přeskočeno (chybí meta.json): ${folder}`);
      continue;
    }
    let meta;
    try {
      meta = JSON.parse(fs.readFileSync(metaPath, "utf8"));
    } catch (e) {
      console.warn(`[sync-directives] špatné meta.json: ${folder}`, e);
      continue;
    }
    const version = typeof meta.version === "string" && meta.version.trim() ? meta.version.trim() : "1.0.0";
    const component = folder;
    const title =
      typeof meta.title === "string" && meta.title.trim()
        ? meta.title.trim()
        : kebabToPascal(folder);
    const block = buildBlock(component, title, version);
    const src = fs.readFileSync(indexTsx, "utf8");
    fs.writeFileSync(indexTsx, applyBlock(src, block), "utf8");
    n++;
  }
  console.log(`sync-component-directives: upraveno ${n} souborů index.tsx`);
}

main();
