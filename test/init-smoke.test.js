const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const pkgRoot = path.resolve(__dirname, "..");
const quiBin = path.join(pkgRoot, "bin", "qui.js");
const { EXIT_CODES } = require("../src/constants");
const { resolveInitMode } = require("../src/commands/init");

test("resolveInitMode: qui-client in package.json without qui.config is bootstrap", () => {
  assert.equal(
    resolveInitMode({ emptyScaffoldRoot: false, hasQwikApp: true, hasQuiConfigFile: false }),
    "qwik_bootstrap",
  );
});

test("resolveInitMode: template sync only when qui.config exists", () => {
  assert.equal(
    resolveInitMode({ emptyScaffoldRoot: false, hasQwikApp: true, hasQuiConfigFile: true }),
    "qwik_sync_templates",
  );
});

test("resolveInitMode: empty root scaffolds Qwik", () => {
  assert.equal(
    resolveInitMode({ emptyScaffoldRoot: true, hasQwikApp: false, hasQuiConfigFile: false }),
    "scaffold_empty",
  );
});

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

test("init --dry-run --json with Qwik + qui-client but no qui.config plans config create", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qui-init-qwik-bootstrap-"));
  try {
    fs.writeFileSync(
      path.join(tmp, "package.json"),
      `${JSON.stringify(
        {
          name: "qwik-bootstrap-test",
          private: true,
          dependencies: {
            "@builder.io/qwik": "^1.0.0",
            "@builder.io/qwik-city": "^1.0.0",
          },
          devDependencies: { "qui-client": "^0.1.0" },
        },
        null,
        2,
      )}\n`,
      "utf8",
    );
    fs.writeFileSync(path.join(tmp, "qwik.config.ts"), "export default {};\n", "utf8");
    const r = spawnSync(process.execPath, [quiBin, "init", "--dry-run", "--json"], {
      cwd: tmp,
      encoding: "utf8",
    });
    assert.equal(r.status, 0, r.stderr || r.stdout);
    const report = JSON.parse(r.stdout.trim());
    assert.equal(report.ok, true);
    const configItem = report.items.find((x) => x.target === "qui.config.json");
    assert.ok(configItem, "expected qui.config.json in report items");
    assert.equal(configItem.status, "planned");
    assert.equal(fs.existsSync(path.join(tmp, "qui.config.json")), false);
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
