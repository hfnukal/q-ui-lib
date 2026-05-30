const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { runAdd } = require("../src/commands/add");
const sourceWorkspace = require("../src/services/source-workspace");

const pkgRoot = path.resolve(__dirname, "..");

describe("runAdd git workspace lifecycle", () => {
  test("copies components before git workspace cleanup", async (t) => {
    const cwd = fs.mkdtempSync(path.join(pkgRoot, ".tmp-add-test-"));
    t.after(() => fs.rmSync(cwd, { recursive: true, force: true }));

    const sourceRoot = path.join(cwd, "source");
    const compDir = path.join(sourceRoot, "components", "web", "hero");
    fs.mkdirSync(compDir, { recursive: true });
    fs.writeFileSync(path.join(compDir, "index.tsx"), "export default () => null;");

    fs.writeFileSync(
      path.join(cwd, "qui.config.json"),
      JSON.stringify({
        configSchemaVersion: "qui-config/v1",
        targetPath: "src/ui",
        repos: {
          testrepo: {
            url: `file://${sourceRoot}`,
            componentsRoot: "components",
            uilibs: ["web"],
            connected: true,
          },
        },
      })
    );

    const origPrepare = sourceWorkspace.prepareSourceWorkspace;
    let workspaceRoot = null;
    sourceWorkspace.prepareSourceWorkspace = (source) => {
      workspaceRoot = fs.mkdtempSync(path.join(cwd, ".git-workspace-"));
      fs.cpSync(source.sourceRoot, workspaceRoot, { recursive: true });
      return {
        rootPath: workspaceRoot,
        cleanup: () => fs.rmSync(workspaceRoot, { recursive: true, force: true }),
      };
    };
    t.after(() => {
      sourceWorkspace.prepareSourceWorkspace = origPrepare;
    });

    const report = await runAdd({
      cwd,
      flags: {},
      positionals: ["testrepo/web/hero"],
    });

    assert.equal(report.ok, true);
    assert.ok(fs.existsSync(path.join(cwd, "src/ui/web/hero/index.tsx")));
    assert.equal(fs.existsSync(workspaceRoot), false);
  });
});
