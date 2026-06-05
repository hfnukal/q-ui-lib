const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const pkgRoot = path.resolve(__dirname, "..");
const quiBin = path.join(pkgRoot, "bin", "qui.js");
const { readManifestFile } = require("../src/services/manifest");

function localManifest(name, manifestFile = `${name}.manifest.json`) {
  const src = path.join(pkgRoot, "components", name, manifestFile);
  const manifest = readManifestFile(src);
  manifest.config.repos.quibase.url = `file://${pkgRoot}/`;
  return manifest;
}

test("base.manifest.json validates and dry-run installs", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qui-manifest-base-"));
  try {
    const manifestPath = path.join(tmp, "manifest.json");
    fs.writeFileSync(manifestPath, `${JSON.stringify(localManifest("base"), null, 2)}\n`, "utf8");
    const r = spawnSync(
      process.execPath,
      [quiBin, "install", manifestPath, tmp, "--no-init", "--dry-run", "--yes", "--json"],
      { cwd: pkgRoot, encoding: "utf8" },
    );
    assert.equal(r.status, 0, r.stderr || r.stdout);
    const report = JSON.parse(r.stdout.trim());
    assert.equal(report.ok, true);
    assert.ok(report.items.length > 0);
    assert.equal(fs.existsSync(path.join(tmp, "qui.config.json")), false);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test("install runs init by default on empty directory (dry-run)", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qui-manifest-init-"));
  try {
    const manifestPath = path.join(tmp, "manifest.json");
    fs.writeFileSync(manifestPath, `${JSON.stringify(localManifest("base"), null, 2)}\n`, "utf8");
    const r = spawnSync(
      process.execPath,
      [quiBin, "install", manifestPath, tmp, "--dry-run", "--yes", "--json"],
      { cwd: pkgRoot, encoding: "utf8" },
    );
    assert.equal(r.status, 0, r.stderr || r.stdout);
    const report = JSON.parse(r.stdout.trim());
    assert.equal(report.ok, true);
    assert.equal(report.details?.init, true);
    assert.ok(
      report.items.some((item) => item.target === "qui.config.json"),
      "expected init to plan qui.config.json",
    );
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});

test("qui-demo demo.manifest.json validates and dry-run installs", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qui-manifest-demo-"));
  try {
    const manifestPath = path.join(tmp, "manifest.json");
    fs.writeFileSync(
      manifestPath,
      `${JSON.stringify(localManifest("qui-demo", "demo.manifest.json"), null, 2)}\n`,
      "utf8",
    );
    const r = spawnSync(
      process.execPath,
      [quiBin, "install", manifestPath, tmp, "--no-init", "--dry-run", "--yes", "--json"],
      { cwd: pkgRoot, encoding: "utf8" },
    );
    assert.equal(r.status, 0, r.stderr || r.stdout);
    const report = JSON.parse(r.stdout.trim());
    assert.equal(report.ok, true);
    assert.ok(report.items.length > 0);
  } finally {
    fs.rmSync(tmp, { recursive: true, force: true });
  }
});
