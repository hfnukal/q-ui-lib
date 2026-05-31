/**
 * Ensures demo/vercel.json keeps Qwik SSR devCommand after `qwik add vercel-edge`.
 * Usage: node scripts/patch-demo-vercel-json.mjs [demoDir]
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const demoDir = path.resolve(repoRoot, process.argv[2] || "demo");
const vercelJsonPath = path.join(demoDir, "vercel.json");
const devCommand = "vite --mode ssr --port $PORT";

if (!fs.existsSync(vercelJsonPath)) {
  fs.writeFileSync(
    vercelJsonPath,
    `${JSON.stringify({ devCommand, headers: [] }, null, 2)}\n`,
    "utf8",
  );
  process.exit(0);
}

/** @type {Record<string, unknown>} */
const config = JSON.parse(fs.readFileSync(vercelJsonPath, "utf8"));
if (config.devCommand === devCommand) process.exit(0);

config.devCommand = devCommand;
fs.writeFileSync(vercelJsonPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
