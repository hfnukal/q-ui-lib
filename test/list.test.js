const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { createDefaultConfig } = require("../src/services/config");
const { parseListScope } = require("../src/commands/list");
const { EXIT_CODES } = require("../src/constants");

const pkgRoot = path.resolve(__dirname, "..");
const quiBin = path.join(pkgRoot, "bin", "qui.js");

function runList(cwd, args) {
  return spawnSync(process.execPath, [quiBin, "list", ...args], {
    cwd,
    encoding: "utf8",
  });
}

describe("parseListScope", () => {
  const config = {
    repos: {
      root: { uilibs: ["base"] },
      componentsextra: { uilibs: ["app", "jabko", "web"] },
    },
  };

  test("no args lists repos", () => {
    assert.deepEqual(parseListScope([], config, {}), { kind: "repos" });
  });

  test("repo name lists uilibs", () => {
    assert.deepEqual(parseListScope(["componentsextra"], config, {}), {
      kind: "uilibs",
      repo: "componentsextra",
    });
  });

  test("repo/uilib lists components", () => {
    assert.deepEqual(parseListScope(["componentsextra/app"], config, {}), {
      kind: "components",
      repo: "componentsextra",
      uilib: "app",
    });
  });

  test("--all without scope", () => {
    assert.deepEqual(parseListScope([], config, { all: true }), { kind: "all-components" });
  });

  test("--all with repo", () => {
    assert.deepEqual(parseListScope(["componentsextra"], config, { all: true }), {
      kind: "all-components",
      repo: "componentsextra",
    });
  });
});

test("list prints configured repos", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qui-list-repos-"));
  const cfg = createDefaultConfig("local-dev", "file://../", {
    targetPath: "src/components/ui",
  });
  cfg.repos.componenttest = {
    url: "file://../componenttest",
    componentsRoot: "components",
    uilibs: ["qui-test-simple"],
    connected: true,
  };
  fs.writeFileSync(path.join(tmp, "qui.config.json"), `${JSON.stringify(cfg, null, 2)}\n`, "utf8");

  const r = runList(tmp, ["--json"]);
  assert.equal(r.status, 0, r.stderr || r.stdout);
  const report = JSON.parse(r.stdout.trim());
  assert.equal(report.command, "list");
  assert.deepEqual(report.footer, ["[repo] local-dev", "[repo] componenttest"]);
});

test("list repo prints configured uilibs", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qui-list-uilibs-"));
  const scoped = path.join(pkgRoot, "componentsextra");
  const cfg = createDefaultConfig("local", "https://example.com/lib.git", {
    targetPath: "src/components/ui",
  });
  cfg.repos.componentsextra = {
    url: `file://${scoped}`,
    componentsRoot: "components",
    uilibs: ["app", "jabko", "web"],
    connected: true,
  };
  fs.writeFileSync(path.join(tmp, "qui.config.json"), `${JSON.stringify(cfg, null, 2)}\n`, "utf8");

  const r = runList(tmp, ["componentsextra", "--json"]);
  assert.equal(r.status, 0, r.stderr || r.stdout);
  const report = JSON.parse(r.stdout.trim());
  assert.deepEqual(report.footer, [
    "Repo  componentsextra:",
    "[lib] app",
    "[lib] jabko",
    "[lib] web",
  ]);
});

test("list repo/uilib prints components with install status", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qui-list-cmp-"));
  const scoped = path.join(pkgRoot, "componentsextra");
  const cfg = createDefaultConfig("local", "https://example.com/lib.git", {
    targetPath: "src/components/ui",
  });
  cfg.repos.componentsextra = {
    url: `file://${scoped}`,
    componentsRoot: "components",
    uilibs: ["app"],
    connected: true,
  };
  fs.writeFileSync(path.join(tmp, "qui.config.json"), `${JSON.stringify(cfg, null, 2)}\n`, "utf8");

  const targetDir = path.join(tmp, "src/components/ui/app/dashboard");
  fs.mkdirSync(targetDir, { recursive: true });
  fs.writeFileSync(path.join(targetDir, "index.tsx"), "export default () => null;\n");

  const r = runList(tmp, ["componentsextra/app", "--json"]);
  assert.equal(r.status, 0, r.stderr || r.stdout);
  const report = JSON.parse(r.stdout.trim());
  assert.equal(report.footer[0], "Repo  componentsextra/app:");
  assert.ok(report.footer.some((line) => line === "[cmp] dashboard  ✓"));
  assert.ok(report.footer.some((line) => line === "[cmp] dashboard-graph  ○"));
});

test("list rejects multiple scope args", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qui-list-usage-"));
  fs.writeFileSync(
    path.join(tmp, "qui.config.json"),
    `${JSON.stringify(createDefaultConfig("local", "file://../"), null, 2)}\n`
  );
  const r = runList(tmp, ["a", "b"]);
  assert.equal(r.status, EXIT_CODES.USAGE_PARSER_ERROR, r.stdout);
});
