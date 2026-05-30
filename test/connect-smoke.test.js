const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");
const { createDefaultConfig } = require("../src/services/config");

const pkgRoot = path.resolve(__dirname, "..");
const quiBin = path.join(pkgRoot, "bin", "qui.js");

function runConnect(cwd, args) {
  return spawnSync(process.execPath, [quiBin, "connect", ...args], {
    cwd,
    encoding: "utf8",
  });
}

test("connect without URL positional exits 2 (legacy --repo/--url pairs removed)", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qui-connect-legacy-"));
  fs.writeFileSync(
    path.join(tmp, "qui.config.json"),
    `${JSON.stringify(createDefaultConfig("local", "https://example.com/lib.git"), null, 2)}\n`,
    "utf8"
  );

  const r = runConnect(tmp, [
    "--repo",
    "upstream",
    "--url",
    "https://example.com/upstream.git",
    "--dry-run",
    "--json",
  ]);
  assert.equal(r.status, 2, r.stderr || r.stdout);
  assert.match(r.stderr || r.stdout, /requires <url>/);
});

test("modern connect file URL with repo and uilibs writes expected config shape", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qui-connect-modern-"));
  const cfg = createDefaultConfig("local", "https://example.com/lib.git", {
    targetPath: "src/components/ui",
  });
  fs.writeFileSync(
    path.join(tmp, "qui.config.json"),
    `${JSON.stringify(cfg, null, 2)}\n`,
    "utf8"
  );

  const scoped = path.join(pkgRoot, "componentsextra");
  const r = runConnect(tmp, [
    `file://${scoped}`,
    "componentsextra",
    "app",
    "web",
    "--yes",
    "--json",
  ]);
  assert.equal(r.status, 0, r.stderr || r.stdout);
  const report = JSON.parse(r.stdout.trim());
  assert.equal(report.ok, true);
  assert.ok(report.discovery);
  assert.ok(report.discovery.repos.length >= 1);

  const saved = JSON.parse(fs.readFileSync(path.join(tmp, "qui.config.json"), "utf8"));
  assert.ok(saved.repos.componentsextra);
  assert.equal(saved.repos.componentsextra.componentsRoot, "components");
  assert.equal(saved.repos.componentsextra.url, `file://${scoped}`);
  assert.deepEqual(saved.repos.componentsextra.uilibs, ["app", "web"]);
});

test("modern connect --all conflict with uilib positionals exits 2", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qui-connect-conflict-"));
  fs.writeFileSync(
    path.join(tmp, "qui.config.json"),
    `${JSON.stringify(createDefaultConfig("local", "https://example.com/lib.git"), null, 2)}\n`,
    "utf8"
  );

  const r = runConnect(tmp, [
    `file://${path.join(pkgRoot, "componentsextra")}`,
    "componentsextra",
    "app",
    "--all",
    "--json",
  ]);
  assert.equal(r.status, 2, r.stderr || r.stdout);
});

test("modern connect new repo id does not prompt overwrite", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qui-connect-new-repo-"));
  fs.writeFileSync(
    path.join(tmp, "qui.config.json"),
    `${JSON.stringify(createDefaultConfig("local", "https://example.com/lib.git"), null, 2)}\n`,
    "utf8"
  );

  const scoped = path.join(pkgRoot, "componentsextra");
  const r = spawnSync(
    process.execPath,
    [
      quiBin,
      "connect",
      `file://${scoped}`,
      "componentsextra",
      "web",
      "--json",
    ],
    { cwd: tmp, encoding: "utf8", input: "" }
  );
  assert.equal(r.status, 0, r.stderr || r.stdout);
  const report = JSON.parse(r.stdout.trim());
  assert.equal(report.ok, true);
  assert.equal(report.items[0].action, "create");
  assert.ok(!/Overwrite existing repo/i.test(r.stderr || r.stdout));
});

test("explicit connect merges uilibs into existing repo without overwrite prompt", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qui-connect-merge-"));
  const cfg = createDefaultConfig("local", "https://example.com/lib.git");
  cfg.repos.componentsextra = {
    url: "https://github.com/hfnukal/q-ui-lib.git",
    componentsRoot: "componentsextra/components",
    uilibs: ["web"],
    connected: true,
  };
  fs.writeFileSync(
    path.join(tmp, "qui.config.json"),
    `${JSON.stringify(cfg, null, 2)}\n`,
    "utf8"
  );

  const scoped = path.join(pkgRoot, "componentsextra");
  const r = spawnSync(
    process.execPath,
    [quiBin, "connect", `file://${scoped}`, "componentsextra", "app", "--json"],
    { cwd: tmp, encoding: "utf8", input: "" }
  );
  assert.equal(r.status, 0, r.stderr || r.stdout);
  assert.ok(!/Overwrite existing repo/i.test(r.stderr || r.stdout));

  const saved = JSON.parse(fs.readFileSync(path.join(tmp, "qui.config.json"), "utf8"));
  assert.deepEqual(saved.repos.componentsextra.uilibs, ["web", "app"]);

  const report = JSON.parse(r.stdout.trim());
  assert.equal(report.items[0].action, "modify");
  assert.deepEqual(report.items[0].details.addedUilibs, ["app"]);
  assert.ok(report.footer.some((line) => line.includes("already exists")));
  assert.ok(report.footer.some((line) => line.includes("Added uilibs: app")));
});

test("non-interactive multi-repo discovery without repo positional exits 2 with candidates", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qui-connect-multi-"));
  fs.writeFileSync(
    path.join(tmp, "qui.config.json"),
    `${JSON.stringify(createDefaultConfig("local", "https://example.com/lib.git"), null, 2)}\n`,
    "utf8"
  );

  const r = runConnect(tmp, [`file://${pkgRoot}`, "--all", "--json"]);
  assert.equal(r.status, 2, r.stderr || r.stdout);
  const report = JSON.parse(r.stdout.trim());
  assert.equal(report.ok, false);
  assert.ok(Array.isArray(report.discovery.repos));
  assert.ok(report.discovery.repos.length > 1);
  assert.equal(report.items.length, 0);
});

test("connect --remove uilib with --yes updates config", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qui-connect-remove-uilib-"));
  const cfg = createDefaultConfig("local", "https://example.com/lib.git");
  cfg.repos.componentsextra = {
    url: "https://github.com/hfnukal/q-ui-lib.git",
    componentsRoot: "componentsextra/components",
    uilibs: ["app", "web"],
    connected: true,
  };
  fs.writeFileSync(
    path.join(tmp, "qui.config.json"),
    `${JSON.stringify(cfg, null, 2)}\n`,
    "utf8"
  );

  const r = runConnect(tmp, ["--remove", "componentsextra", "app", "--yes", "--json"]);
  assert.equal(r.status, 0, r.stderr || r.stdout);
  const saved = JSON.parse(fs.readFileSync(path.join(tmp, "qui.config.json"), "utf8"));
  assert.deepEqual(saved.repos.componentsextra.uilibs, ["web"]);
  const report = JSON.parse(r.stdout.trim());
  assert.equal(report.items[0].action, "modify");
  assert.deepEqual(report.items[0].details.removedUilibs, ["app"]);
});

test("connect --remove repo with --yes deletes repo entry", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qui-connect-remove-repo-"));
  const cfg = createDefaultConfig("local", "https://example.com/lib.git");
  cfg.repos.componentsextra = {
    url: "https://github.com/hfnukal/q-ui-lib.git",
    componentsRoot: "componentsextra/components",
    uilibs: ["web"],
    connected: true,
  };
  fs.writeFileSync(
    path.join(tmp, "qui.config.json"),
    `${JSON.stringify(cfg, null, 2)}\n`,
    "utf8"
  );

  const r = runConnect(tmp, ["--remove", "componentsextra", "--yes", "--json"]);
  assert.equal(r.status, 0, r.stderr || r.stdout);
  const saved = JSON.parse(fs.readFileSync(path.join(tmp, "qui.config.json"), "utf8"));
  assert.equal(saved.repos.componentsextra, undefined);
  assert.ok(saved.repos.local);
});

test("connect --remove without --yes in non-interactive mode exits 6", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qui-connect-remove-ask-"));
  const cfg = createDefaultConfig("local", "https://example.com/lib.git");
  cfg.repos.componentsextra = {
    url: "https://github.com/hfnukal/q-ui-lib.git",
    componentsRoot: "componentsextra/components",
    uilibs: ["web"],
    connected: true,
  };
  fs.writeFileSync(
    path.join(tmp, "qui.config.json"),
    `${JSON.stringify(cfg, null, 2)}\n`,
    "utf8"
  );

  const r = spawnSync(
    process.execPath,
    [quiBin, "connect", "--remove", "componentsextra", "web", "--json"],
    { cwd: tmp, encoding: "utf8", input: "" }
  );
  assert.equal(r.status, 6, r.stderr || r.stdout);
});
