const { test } = require("node:test");
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");

const repoRoot = path.resolve(__dirname, "..");
const scriptPath = path.join(repoRoot, "scripts", "generate-demo.mjs");

function runGenerateDemo(cwd, args = []) {
  return spawnSync(process.execPath, [scriptPath, ...args], {
    cwd,
    encoding: "utf8",
  });
}

test("generate-demo removes stale component routes", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "qui-generate-demo-prune-"));
  const componentsDir = path.join(root, "src", "components", "ui");
  const routesDir = path.join(root, "src", "routes", "qui-demo");
  const staleRouteDir = path.join(routesDir, "components", "web", "hero");
  fs.mkdirSync(staleRouteDir, { recursive: true });
  fs.writeFileSync(
    path.join(staleRouteDir, "index.tsx"),
    'import { component$ } from "@builder.io/qwik";\nexport default component$(() => null);\n',
  );

  fs.mkdirSync(path.join(componentsDir, "base", "button"), { recursive: true });
  fs.writeFileSync(
    path.join(componentsDir, "base", "button", "index.tsx"),
    `/**
 * @title Button
 * @example Basic
 * \`\`\`tsx
 * <Button>Click</Button>
 * \`\`\`
 */
export const Button = () => null;
`,
  );

  const result = runGenerateDemo(root, [
    "--target",
    root,
    "--components-dir",
    componentsDir,
    "--routes-dir",
    "src/routes/qui-demo",
  ]);

  assert.equal(result.status, 0, result.stderr || result.stdout);
  assert.match(result.stdout, /Removed stale route:/);
  assert.equal(fs.existsSync(staleRouteDir), false);
  assert.equal(
    fs.existsSync(path.join(routesDir, "components", "base", "button", "index.tsx")),
    true,
  );
});
