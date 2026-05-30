const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { runUpdate } = require("../src/commands/update");
const sourceWorkspace = require("../src/services/source-workspace");

const pkgRoot = path.resolve(__dirname, "..");

describe("runUpdate", () => {
  test("resolves bare slug from git repo workspace and updates installed component", async (t) => {
    const cwd = fs.mkdtempSync(path.join(pkgRoot, ".tmp-update-test-"));
    t.after(() => fs.rmSync(cwd, { recursive: true, force: true }));

    const sourceRoot = path.join(cwd, "source");
    const compDir = path.join(sourceRoot, "components", "web", "hero");
    fs.mkdirSync(compDir, { recursive: true });
    fs.writeFileSync(path.join(compDir, "index.tsx"), "export const VERSION = 2;");

    const targetDir = path.join(cwd, "src/ui/web/hero");
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(path.join(targetDir, "index.tsx"), "export const VERSION = 1;");

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

    const report = await runUpdate({
      cwd,
      flags: { yes: true },
      positionals: ["hero"],
    });

    assert.equal(report.ok, true);
    assert.match(fs.readFileSync(path.join(targetDir, "index.tsx"), "utf8"), /VERSION = 2/);
    assert.equal(fs.existsSync(workspaceRoot), false);
  });

  test("requires confirmation without --yes in non-interactive mode", async (t) => {
    const cwd = fs.mkdtempSync(path.join(pkgRoot, ".tmp-update-test-"));
    t.after(() => fs.rmSync(cwd, { recursive: true, force: true }));

    const sourceRoot = path.join(cwd, "source");
    const compDir = path.join(sourceRoot, "components", "web", "hero");
    fs.mkdirSync(compDir, { recursive: true });
    fs.writeFileSync(path.join(compDir, "index.tsx"), "export default () => null;");

    const targetDir = path.join(cwd, "src/ui/web/hero");
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(path.join(targetDir, "index.tsx"), "export default () => null;");

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

    await assert.rejects(
      () =>
        runUpdate({
          cwd,
          flags: {},
          positionals: ["hero"],
        }),
      (err) => err.message.includes("Update requires confirmation.")
    );
  });

  test("rejects update when component is not installed", async (t) => {
    const cwd = fs.mkdtempSync(path.join(pkgRoot, ".tmp-update-test-"));
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

    await assert.rejects(
      () =>
        runUpdate({
          cwd,
          flags: { yes: true },
          positionals: ["hero"],
        }),
      (err) => err.message.includes("is not installed")
    );
  });

  test("update --all scoped to uilib updates installed components with --yes", async (t) => {
    const cwd = fs.mkdtempSync(path.join(pkgRoot, ".tmp-update-test-"));
    t.after(() => fs.rmSync(cwd, { recursive: true, force: true }));

    const sourceRoot = path.join(cwd, "source");
    for (const slug of ["hero", "banner"]) {
      const compDir = path.join(sourceRoot, "components", "web", slug);
      fs.mkdirSync(compDir, { recursive: true });
      fs.writeFileSync(path.join(compDir, "index.tsx"), `export const SLUG = "${slug}";`);
    }

    for (const slug of ["hero", "banner"]) {
      const targetDir = path.join(cwd, "src/ui/web", slug);
      fs.mkdirSync(targetDir, { recursive: true });
      fs.writeFileSync(path.join(targetDir, "index.tsx"), "export const SLUG = 'old';");
    }

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

    const report = await runUpdate({
      cwd,
      flags: { all: true, yes: true },
      positionals: ["web/"],
    });

    assert.equal(report.ok, true);
    assert.match(fs.readFileSync(path.join(cwd, "src/ui/web/hero/index.tsx"), "utf8"), /hero/);
    assert.match(fs.readFileSync(path.join(cwd, "src/ui/web/banner/index.tsx"), "utf8"), /banner/);
  });

  test("update --all requires confirmation without --yes in non-interactive mode", async (t) => {
    const cwd = fs.mkdtempSync(path.join(pkgRoot, ".tmp-update-test-"));
    t.after(() => fs.rmSync(cwd, { recursive: true, force: true }));

    const sourceRoot = path.join(cwd, "source");
    const compDir = path.join(sourceRoot, "components", "web", "hero");
    fs.mkdirSync(compDir, { recursive: true });
    fs.writeFileSync(path.join(compDir, "index.tsx"), "export const SLUG = 'hero';");

    const targetDir = path.join(cwd, "src/ui/web/hero");
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(path.join(targetDir, "index.tsx"), "export const SLUG = 'old';");

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

    await assert.rejects(
      () =>
        runUpdate({
          cwd,
          flags: { all: true },
          positionals: ["web/"],
        }),
      (err) => err.message.includes("Update requires confirmation.")
    );
  });
});
