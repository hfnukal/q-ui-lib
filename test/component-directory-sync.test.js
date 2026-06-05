const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const path = require("node:path");
const { runAdd } = require("../src/commands/add");
const { runRemove } = require("../src/commands/remove");
const { runUpdate } = require("../src/commands/update");
const {
  copyComponentDirectory,
  removeComponentDirectory,
} = require("../src/services/component-files");
const sourceWorkspace = require("../src/services/source-workspace");

const pkgRoot = path.resolve(__dirname, "..");

function listRelativeFiles(rootDir, prefix = "") {
  if (!fs.existsSync(rootDir)) return [];
  const files = [];
  for (const entry of fs.readdirSync(rootDir, { withFileTypes: true })) {
    const rel = prefix ? `${prefix}/${entry.name}` : entry.name;
    const full = path.join(rootDir, entry.name);
    if (entry.isDirectory()) {
      files.push(...listRelativeFiles(full, rel));
    } else {
      files.push(rel);
    }
  }
  return files.sort();
}

function writeMultiFileComponent(compDir) {
  fs.mkdirSync(compDir, { recursive: true });
  fs.writeFileSync(path.join(compDir, "index.tsx"), 'import { helper } from "./helper";\nexport default () => helper;\n');
  fs.writeFileSync(path.join(compDir, "helper.ts"), "export const helper = 1;\n");
  fs.writeFileSync(path.join(compDir, "meta.generated.json"), "{}\n");
}

function writeQuiConfig(cwd, sourceRoot) {
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
}

function mockGitWorkspace(cwd, t) {
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
}

describe("copyComponentDirectory", () => {
  test("copies all files in a component directory", () => {
    const root = fs.mkdtempSync(path.join(pkgRoot, ".tmp-copy-test-"));
    try {
      const sourceDir = path.join(root, "source", "web", "card");
      const targetDir = path.join(root, "target", "web", "card");
      writeMultiFileComponent(sourceDir);

      copyComponentDirectory(sourceDir, targetDir);

      assert.deepEqual(listRelativeFiles(targetDir), listRelativeFiles(sourceDir));
      assert.match(fs.readFileSync(path.join(targetDir, "index.tsx"), "utf8"), /from "\.\/helper"/);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });

  test("mirrors source and removes extra local files on re-copy", () => {
    const root = fs.mkdtempSync(path.join(pkgRoot, ".tmp-copy-test-"));
    try {
      const sourceDir = path.join(root, "source", "web", "card");
      const targetDir = path.join(root, "target", "web", "card");
      writeMultiFileComponent(sourceDir);
      copyComponentDirectory(sourceDir, targetDir);

      fs.writeFileSync(path.join(targetDir, "extra-local.txt"), "local\n");
      fs.unlinkSync(path.join(targetDir, "helper.ts"));

      copyComponentDirectory(sourceDir, targetDir);

      assert.deepEqual(listRelativeFiles(targetDir), listRelativeFiles(sourceDir));
      assert.equal(fs.existsSync(path.join(targetDir, "extra-local.txt")), false);
      assert.ok(fs.existsSync(path.join(targetDir, "helper.ts")));
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
});

describe("component directory sync commands", () => {
  test("add copies all component files and remove deletes the whole directory", async (t) => {
    const cwd = fs.mkdtempSync(path.join(pkgRoot, ".tmp-add-multi-file-"));
    t.after(() => fs.rmSync(cwd, { recursive: true, force: true }));

    const sourceRoot = path.join(cwd, "source");
    const compDir = path.join(sourceRoot, "components", "web", "card");
    writeMultiFileComponent(compDir);
    writeQuiConfig(cwd, sourceRoot);
    mockGitWorkspace(cwd, t);

    const addReport = await runAdd({
      cwd,
      flags: { yes: true },
      positionals: ["testrepo/web/card"],
    });
    const destDir = path.join(cwd, "src/ui/web/card");

    assert.equal(addReport.ok, true);
    assert.deepEqual(listRelativeFiles(destDir), listRelativeFiles(compDir));

    const removeReport = await runRemove({
      cwd,
      flags: { yes: true },
      positionals: ["web/card"],
    });

    assert.equal(removeReport.ok, true);
    assert.equal(fs.existsSync(destDir), false);
  });

  test("update mirrors source files and drops local-only extras", async (t) => {
    const cwd = fs.mkdtempSync(path.join(pkgRoot, ".tmp-update-multi-file-"));
    t.after(() => fs.rmSync(cwd, { recursive: true, force: true }));

    const sourceRoot = path.join(cwd, "source");
    const compDir = path.join(sourceRoot, "components", "web", "card");
    writeMultiFileComponent(compDir);

    const targetDir = path.join(cwd, "src/ui/web/card");
    fs.mkdirSync(targetDir, { recursive: true });
    fs.writeFileSync(path.join(targetDir, "index.tsx"), "export const VERSION = 1;\n");
    fs.writeFileSync(path.join(targetDir, "extra-local.txt"), "local\n");

    writeQuiConfig(cwd, sourceRoot);
    mockGitWorkspace(cwd, t);

    const report = await runUpdate({
      cwd,
      flags: { yes: true },
      positionals: ["web/card"],
    });

    assert.equal(report.ok, true);
    assert.deepEqual(listRelativeFiles(targetDir), listRelativeFiles(compDir));
    assert.equal(fs.existsSync(path.join(targetDir, "extra-local.txt")), false);
    assert.ok(fs.existsSync(path.join(targetDir, "helper.ts")));
  });

  test("removeComponentDirectory deletes helper files too", () => {
    const root = fs.mkdtempSync(path.join(pkgRoot, ".tmp-remove-multi-file-"));
    try {
      const componentDir = path.join(root, "web", "card");
      writeMultiFileComponent(componentDir);

      assert.equal(removeComponentDirectory(componentDir), true);
      assert.equal(fs.existsSync(componentDir), false);
    } finally {
      fs.rmSync(root, { recursive: true, force: true });
    }
  });
});
