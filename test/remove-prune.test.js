const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const {
  listEmptyParentsAfterRemove,
  pruneEmptyParentDirectories,
  removeComponentDirectory,
} = require("../src/services/component-files");

function writeComponent(dir) {
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.tsx"), "export {};\n", "utf8");
  fs.writeFileSync(path.join(dir, "meta.generated.json"), "{}\n", "utf8");
}

test("pruneEmptyParentDirectories removes empty uilib folder", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "qui-remove-prune-"));
  const targetDir = path.join(root, "src", "components", "ui");
  const componentDir = path.join(targetDir, "web", "hero");
  writeComponent(componentDir);

  assert.ok(removeComponentDirectory(componentDir));
  const pruned = pruneEmptyParentDirectories(componentDir, targetDir);
  assert.deepEqual(pruned, [path.join(targetDir, "web")]);
  assert.equal(fs.existsSync(path.join(targetDir, "web")), false);
  assert.ok(fs.existsSync(targetDir));
});

test("listEmptyParentsAfterRemove plans uilib prune when only one component", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "qui-remove-prune-dry-"));
  const targetDir = path.join(root, "src", "components", "ui");
  const componentDir = path.join(targetDir, "web", "hero");
  writeComponent(componentDir);

  const planned = listEmptyParentsAfterRemove(componentDir, targetDir);
  assert.deepEqual(planned, [path.join(targetDir, "web")]);
});

test("pruneEmptyParentDirectories keeps uilib with other components", () => {
  const root = fs.mkdtempSync(path.join(os.tmpdir(), "qui-remove-prune-sibling-"));
  const targetDir = path.join(root, "src", "components", "ui");
  const heroDir = path.join(targetDir, "web", "hero");
  const bannerDir = path.join(targetDir, "web", "banner");
  writeComponent(heroDir);
  writeComponent(bannerDir);

  assert.ok(removeComponentDirectory(heroDir));
  const pruned = pruneEmptyParentDirectories(heroDir, targetDir);
  assert.deepEqual(pruned, []);
  assert.ok(fs.existsSync(path.join(targetDir, "web")));
});
