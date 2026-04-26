const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const pkgRoot = path.resolve(__dirname, "..");
const quiBin = path.join(pkgRoot, "bin", "qui.js");
const { EXIT_CODES } = require("../src/constants");

test("init rejects more than one positional directory", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qui-init-pos-"));
  try {
    const r = spawnSync(process.execPath, [quiBin, "init", "a", "b", "--json"], {
      cwd: tmp,
      encoding: "utf8",
    });
    assert.equal(r.status, EXIT_CODES.USAGE_PARSER_ERROR);
    const report = JSON.parse(r.stdout.trim());
    assert.equal(report.ok, false);
    assert.ok(String(report.errors[0] || "").includes("at most one"));
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test("init --dry-run --json in empty directory (no qui.config written)", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qui-init-smoke-"));
  try {
    // Non-empty root: avoid running create-qwik in an empty tmp dir during tests.
    fs.writeFileSync(
      path.join(tmp, "package.json"),
      `${JSON.stringify({ name: "qui-init-smoke", private: true }, null, 2)}\n`,
      "utf8"
    );
    const r = spawnSync(process.execPath, [quiBin, "init", "--dry-run", "--json"], {
      cwd: tmp,
      encoding: "utf8",
    });
    assert.equal(r.status, 0, r.stderr || r.stdout);
    const report = JSON.parse(r.stdout.trim());
    assert.equal(report.command, "init");
    assert.equal(report.ok, true);
    assert.ok(report.summary.planned >= 1);
    assert.equal(report.summary.applied, 0);
    assert.equal(fs.existsSync(path.join(tmp, "qui.config.json")), false);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
