/**
 * Bundles all `meta.generated.json` files under the demo UI tree into
 * `qui-demo/demo-component-props/meta-registry.generated.json` for Edge-safe runtime lookup.
 *
 * Usage:
 *   node scripts/generate-meta-registry.mjs [--target ./demo] [--components-dir ./demo/src/components/ui]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const repoRoot = path.resolve(__dirname, "..");

const args = process.argv.slice(2);
let targetApp = path.join(repoRoot, "demo");
let componentsDir = path.join(targetApp, "src/components/ui");

for (let i = 0; i < args.length; i++) {
  if (args[i] === "--target" && args[i + 1]) {
    targetApp = path.resolve(args[++i]);
  } else if (args[i] === "--components-dir" && args[i + 1]) {
    componentsDir = path.resolve(args[++i]);
  }
}

const registryOut = path.join(
  targetApp,
  "src/components/ui/qui-demo/demo-component-props/meta-registry.generated.json",
);

/** @param {string} dir */
function walkMetaFiles(dir, out = []) {
  if (!fs.existsSync(dir)) return out;
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const full = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      walkMetaFiles(full, out);
      continue;
    }
    if (entry.isFile() && entry.name === "meta.generated.json") {
      out.push(full);
    }
  }
  return out;
}

/** @type {Record<string, unknown>} */
const registry = {};

for (const metaPath of walkMetaFiles(componentsDir)) {
  const indexPath = path.join(path.dirname(metaPath), "index.tsx");
  if (!fs.existsSync(indexPath)) continue;

  const key = path
    .relative(targetApp, indexPath)
    .split(path.sep)
    .join("/");

  try {
    registry[key] = JSON.parse(fs.readFileSync(metaPath, "utf8"));
  } catch (err) {
    console.warn(
      `[generate-meta-registry] Skipping invalid JSON: ${metaPath} (${/** @type {Error} */ (err).message})`,
    );
  }
}

fs.mkdirSync(path.dirname(registryOut), { recursive: true });
fs.writeFileSync(registryOut, `${JSON.stringify(registry, null, 2)}\n`, "utf8");

console.log(
  `generate-meta-registry: wrote ${Object.keys(registry).length} entries → ${path.relative(repoRoot, registryOut)}`,
);
