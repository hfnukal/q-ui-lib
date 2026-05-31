/**
 * Copies demo/.vercel/output → .vercel/output for `vercel deploy --prebuilt` at repo root.
 * Usage: node scripts/sync-demo-vercel-output.mjs
 */
import fs from "node:fs";
import path from "node:path";
import { fileURLToPath } from "node:url";

const repoRoot = path.resolve(path.dirname(fileURLToPath(import.meta.url)), "..");
const src = path.join(repoRoot, "demo", ".vercel", "output");
const dest = path.join(repoRoot, ".vercel", "output");

if (!fs.existsSync(src)) {
  console.error(
    `Missing ${path.relative(repoRoot, src)}. Run npm run demo:build first.`,
  );
  process.exit(1);
}

fs.rmSync(dest, { recursive: true, force: true });
fs.mkdirSync(path.dirname(dest), { recursive: true });
fs.cpSync(src, dest, { recursive: true });

console.log(
  `Synced ${path.relative(repoRoot, src)} → ${path.relative(repoRoot, dest)}`,
);
