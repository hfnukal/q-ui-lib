const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { createDefaultConfig } = require("../src/services/config");

const pkgRoot = path.resolve(__dirname, "..");
const quiBin = path.join(pkgRoot, "bin", "qui.js");

test("connect --dry-run --json does not modify qui.config.json", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qui-connect-smoke-"));
  const cfgPath = path.join(tmp, "qui.config.json");
  const cfg = createDefaultConfig("local", "https://example.com/lib.git", {
    targetPath: "src/components/ui",
  });
  fs.writeFileSync(cfgPath, `${JSON.stringify(cfg, null, 2)}\n`, "utf8");
  const before = fs.readFileSync(cfgPath, "utf8");

  const r = spawnSync(
    process.execPath,
    [
      quiBin,
      "connect",
      "--repo",
      "upstream",
      "--url",
      "https://example.com/upstream.git",
      "--dry-run",
      "--json",
    ],
    { cwd: tmp, encoding: "utf8" },
  );
  assert.equal(r.status, 0, r.stderr || r.stdout);
  const report = JSON.parse(r.stdout.trim());
  assert.equal(report.command, "connect");
  assert.equal(report.ok, true);
  assert.ok(report.summary.planned >= 1);
  assert.equal(report.summary.applied, 0);
  assert.ok(
    report.warnings.some((w) => String(w).includes("dry-run") || String(w).includes("not modified")),
  );
  assert.equal(fs.readFileSync(cfgPath, "utf8"), before);
  const cfgAfter = JSON.parse(fs.readFileSync(cfgPath, "utf8"));
  assert.equal(Object.keys(cfgAfter.repos).length, 1);
  assert.ok(cfgAfter.repos.local);
});
