const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { runDiff } = require("../src/commands/diff");
const {
  compareComponentDirectories,
  compareComponentMetadata,
  resolveComponentAction,
} = require("../src/services/component-diff");

describe("component-diff helpers", () => {
  test("detects file and dependency changes", () => {
    const local = fs.mkdtempSync(path.join(os.tmpdir(), "qui-diff-local-"));
    const remote = fs.mkdtempSync(path.join(os.tmpdir(), "qui-diff-remote-"));
    fs.writeFileSync(path.join(local, "index.tsx"), "local\n");
    fs.writeFileSync(path.join(remote, "index.tsx"), "remote\n");
    fs.writeFileSync(path.join(remote, "extra.txt"), "new\n");

    const tree = compareComponentDirectories(local, remote);
    assert.deepEqual(tree.files, [
      { path: "extra.txt", changeType: "create" },
      { path: "index.tsx", changeType: "modify" },
    ]);

    const deps = compareComponentMetadata(
      { dependencies: ["a"], npmDependencies: ["left-pkg"] },
      { dependencies: ["a", "b"], npmDependencies: ["right-pkg"] }
    );
    assert.equal(deps.changed, true);
    assert.equal(
      resolveComponentAction({
        localExists: true,
        remoteExists: true,
        files: tree.files,
        dependenciesChanged: deps.changed,
      }),
      "update"
    );

    fs.rmSync(local, { recursive: true, force: true });
    fs.rmSync(remote, { recursive: true, force: true });
  });
});

describe("runDiff", () => {
  test("reports update when local and remote differ", async () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "qui-diff-cmd-"));
    const sourceRoot = path.join(cwd, "source");
    const localRoot = path.join(cwd, "src/ui");
    const remoteHero = path.join(sourceRoot, "components", "web", "hero");
    const localHero = path.join(localRoot, "web", "hero");

    fs.mkdirSync(remoteHero, { recursive: true });
    fs.mkdirSync(localHero, { recursive: true });
    fs.writeFileSync(path.join(remoteHero, "index.tsx"), "export const Remote = 1;\n");
    fs.writeFileSync(path.join(localHero, "index.tsx"), "export const Local = 1;\n");
    fs.writeFileSync(
      path.join(localHero, "meta.generated.json"),
      JSON.stringify({ name: "hero", registry: "web", dependencies: [], npmDependencies: [] })
    );
    fs.writeFileSync(
      path.join(remoteHero, "meta.generated.json"),
      JSON.stringify({ name: "hero", registry: "web", dependencies: [], npmDependencies: [] })
    );
    fs.writeFileSync(
      path.join(cwd, "qui.config.json"),
      JSON.stringify({
        configSchemaVersion: "qui-config/v1",
        targetPath: "src/ui",
        repos: {
          remote: {
            url: `file://${sourceRoot}`,
            componentsRoot: "components",
            uilibs: ["web"],
            connected: true,
          },
        },
      })
    );

    const report = await runDiff({
      cwd,
      flags: {},
      positionals: ["hero"],
    });

    assert.equal(report.ok, true);
    assert.equal(report.summary.changed, 1);
    assert.equal(report.items[0].component, "web/hero");
    assert.equal(report.items[0].action, "update");
    assert.deepEqual(report.items[0].files, [{ path: "index.tsx", changeType: "modify" }]);
    assert.match(report.footer.join("\n"), /index\.tsx/);

    fs.rmSync(cwd, { recursive: true, force: true });
  });

  test("--ci fails when remote differs", async () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "qui-diff-ci-"));
    const sourceRoot = path.join(cwd, "source");
    const localHero = path.join(cwd, "src/ui/web/hero");
    const remoteHero = path.join(sourceRoot, "components/web/hero");
    fs.mkdirSync(localHero, { recursive: true });
    fs.mkdirSync(remoteHero, { recursive: true });
    fs.writeFileSync(path.join(localHero, "index.tsx"), "local\n");
    fs.writeFileSync(path.join(remoteHero, "index.tsx"), "remote\n");
    fs.writeFileSync(
      path.join(cwd, "qui.config.json"),
      JSON.stringify({
        configSchemaVersion: "qui-config/v1",
        targetPath: "src/ui",
        repos: {
          remote: {
            url: `file://${sourceRoot}`,
            componentsRoot: "components",
            uilibs: ["web"],
            connected: true,
          },
        },
      })
    );

    const report = await runDiff({
      cwd,
      flags: { ci: true },
      positionals: ["web/hero"],
    });

    assert.equal(report.ok, false);
    assert.equal(report.exitCode, 9);
    assert.equal(report.summary.changed, 1);

    fs.rmSync(cwd, { recursive: true, force: true });
  });

  test("reports add when component exists only remotely", async () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "qui-diff-add-"));
    const sourceRoot = path.join(cwd, "source");
    const remoteHero = path.join(sourceRoot, "components/web/hero");
    fs.mkdirSync(path.join(cwd, "src/ui"), { recursive: true });
    fs.mkdirSync(remoteHero, { recursive: true });
    fs.writeFileSync(path.join(remoteHero, "index.tsx"), "export const Remote = 1;\n");
    fs.writeFileSync(
      path.join(cwd, "qui.config.json"),
      JSON.stringify({
        configSchemaVersion: "qui-config/v1",
        targetPath: "src/ui",
        repos: {
          remote: {
            url: `file://${sourceRoot}`,
            componentsRoot: "components",
            uilibs: ["web"],
            connected: true,
          },
        },
      })
    );

    const report = await runDiff({
      cwd,
      flags: {},
      positionals: ["remote/web/hero"],
    });

    assert.equal(report.items[0].action, "add");
    assert.deepEqual(report.items[0].files, [{ path: "index.tsx", changeType: "create" }]);

    fs.rmSync(cwd, { recursive: true, force: true });
  });

  test("diffs multiple component positionals", async () => {
    const cwd = fs.mkdtempSync(path.join(os.tmpdir(), "qui-diff-multi-"));
    const sourceRoot = path.join(cwd, "source");
    const localRoot = path.join(cwd, "src/ui");

    for (const slug of ["hero", "button"]) {
      const remoteDir = path.join(sourceRoot, "components", "web", slug);
      const localDir = path.join(localRoot, "web", slug);
      fs.mkdirSync(remoteDir, { recursive: true });
      fs.mkdirSync(localDir, { recursive: true });
      fs.writeFileSync(path.join(remoteDir, "index.tsx"), `export const Remote${slug} = 1;\n`);
      fs.writeFileSync(path.join(localDir, "index.tsx"), `export const Local${slug} = 1;\n`);
      fs.writeFileSync(
        path.join(localDir, "meta.generated.json"),
        JSON.stringify({ name: slug, registry: "web", dependencies: [], npmDependencies: [] })
      );
      fs.writeFileSync(
        path.join(remoteDir, "meta.generated.json"),
        JSON.stringify({ name: slug, registry: "web", dependencies: [], npmDependencies: [] })
      );
    }

    fs.writeFileSync(
      path.join(cwd, "qui.config.json"),
      JSON.stringify({
        configSchemaVersion: "qui-config/v1",
        targetPath: "src/ui",
        repos: {
          remote: {
            url: `file://${sourceRoot}`,
            componentsRoot: "components",
            uilibs: ["web"],
            connected: true,
          },
        },
      })
    );

    const report = await runDiff({
      cwd,
      flags: {},
      positionals: ["web/hero", "web/button"],
    });

    assert.equal(report.summary.checked, 2);
    assert.equal(report.summary.changed, 2);

    fs.rmSync(cwd, { recursive: true, force: true });
  });
});
