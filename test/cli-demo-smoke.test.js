const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const { spawnSync } = require("node:child_process");
const fs = require("node:fs");
const path = require("node:path");

const pkgRoot = path.resolve(__dirname, "..");
const quiBin = path.join(pkgRoot, "bin", "qui.js");
const repoRoot = pkgRoot;
const demoRoot = path.join(repoRoot, "demo");

function runQui(args, cwd) {
  return spawnSync(process.execPath, [quiBin, ...args], {
    cwd,
    encoding: "utf8",
    env: { ...process.env },
  });
}

describe("CLI smoke (global)", () => {
  test("help exits 0 and prints usage", () => {
    const r = runQui(["help"], pkgRoot);
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stdout, /qui-client/i);
    assert.match(r.stdout, /Usage:/);
  });

  test("--help exits 0", () => {
    const r = runQui(["--help"], pkgRoot);
    assert.equal(r.status, 0, r.stderr);
    assert.match(r.stdout, /qui-client/i);
  });
});

describe("CLI smoke (demo workspace)", () => {
  test("verify --json exits 0 and returns envelope", (t) => {
    if (!fs.existsSync(path.join(demoRoot, "qui.config.json"))) {
      t.skip();
      return;
    }
    const r = runQui(["verify", "--json"], demoRoot);
    assert.equal(r.status, 0, r.stderr || r.stdout);
    const out = r.stdout.trim();
    const report = JSON.parse(out);
    assert.equal(report.schemaVersion, "qui-report/v1");
    assert.equal(report.command, "verify");
    assert.equal(report.ok, true);
  });

  test("diff --json exits 0", (t) => {
    if (!fs.existsSync(path.join(demoRoot, "qui.config.json"))) {
      t.skip();
      return;
    }
    const r = runQui(["diff", "--json"], demoRoot);
    assert.equal(r.status, 0, r.stderr || r.stdout);
    const report = JSON.parse(r.stdout.trim());
    assert.equal(report.command, "diff");
  });

  test("generate --dry-run exits 0 (ts-morph meta pipeline)", (t) => {
    if (!fs.existsSync(path.join(demoRoot, "qui.config.json"))) {
      t.skip();
      return;
    }
    const r = runQui(["generate", "--dry-run"], demoRoot);
    assert.equal(r.status, 0, r.stderr || r.stdout);
    assert.match(r.stdout, /\[OK\]\s+generate/i);
    assert.match(r.stdout, /exit\s+0/i);
  });

  test("generate --dry-run --json ends with qui-report envelope", (t) => {
    if (!fs.existsSync(path.join(demoRoot, "qui.config.json"))) {
      t.skip();
      return;
    }
    const r = runQui(["generate", "--dry-run", "--json"], demoRoot);
    assert.equal(r.status, 0, r.stderr || r.stdout);
    const combined = r.stdout;
    assert.match(combined, /"schemaVersion"\s*:\s*"qui-report\/v1"/);
    assert.match(combined, /"command"\s*:\s*"generate"/);
    assert.match(combined, /"ok"\s*:\s*true/);
  });

  test("generate-demo --dry-run --json plans routes without writing", (t) => {
    if (!fs.existsSync(path.join(demoRoot, "qui.config.json"))) {
      t.skip();
      return;
    }
    const r = runQui(["generate-demo", "--dry-run", "--json"], demoRoot);
    assert.equal(r.status, 0, r.stderr || r.stdout);
    const report = JSON.parse(r.stdout.trim());
    assert.equal(report.command, "generate-demo");
    assert.equal(report.ok, true);
    assert.ok(report.summary.planned >= 1);
    assert.equal(report.summary.applied, 0);
    assert.ok(
      report.warnings.some((w) => String(w).includes("dry-run") || String(w).includes("no files")),
    );
  });
});
