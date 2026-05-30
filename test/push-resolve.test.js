const { test } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { parseLocalComponentSpec } = require("../src/services/component-catalog");
const { resolvePushComponents } = require("../src/services/push-resolve");

function writeComponent(root, uilib, slug, meta = {}) {
  const dir = path.join(root, uilib, slug);
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, "index.tsx"), "export default () => null;\n", "utf8");
  fs.writeFileSync(
    path.join(dir, "meta.generated.json"),
    `${JSON.stringify({ name: slug.split("/").pop(), registry: uilib, ...meta }, null, 2)}\n`,
    "utf8"
  );
}

test("parseLocalComponentSpec supports repo/uilib/slug and uilib/slug", () => {
  const config = {
    repos: {
      componentsextra: { uilibs: ["web"] },
      local: { uilibs: ["base"] },
    },
  };
  assert.deepEqual(parseLocalComponentSpec("hero", config), {
    kind: "slug",
    slug: "hero",
  });
  assert.deepEqual(parseLocalComponentSpec("web/hero", config), {
    kind: "uilib-slug",
    uilib: "web",
    slug: "hero",
  });
  assert.deepEqual(parseLocalComponentSpec("componentsextra/web/hero", config), {
    kind: "triple",
    repo: "componentsextra",
    uilib: "web",
    slug: "hero",
  });
});

test("parseLocalComponentSpec rejects repo/uilib scope", () => {
  const config = {
    repos: {
      componentsextra: { uilibs: ["web"] },
    },
  };
  assert.throws(() => parseLocalComponentSpec("componentsextra/web", config), (err) => {
    assert.equal(err.exitCode, 2);
    assert.match(err.message, /repo\/uilib scope/);
    return true;
  });
});

test("resolvePushComponents maps bare hero to componentsextra/web/hero", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qui-push-resolve-"));
  const targetPath = "src/components/ui";
  const targetDir = path.join(tmp, targetPath);
  writeComponent(targetDir, "web", "hero");

  fs.writeFileSync(
    path.join(tmp, "qui.config.json"),
    `${JSON.stringify(
      {
        configSchemaVersion: "qui-config/v1",
        targetPath,
        repos: {
          componentsextra: {
            url: "https://github.com/hfnukal/q-ui-lib.git",
            componentsRoot: "componentsextra/components",
            uilibs: ["web"],
            connected: true,
          },
          "local-dev": {
            url: "file://../",
            componentsRoot: "components",
            uilibs: ["base"],
            connected: true,
          },
        },
      },
      null,
      2
    )}\n`,
    "utf8"
  );

  const scope = resolvePushComponents(tmp, JSON.parse(fs.readFileSync(path.join(tmp, "qui.config.json"), "utf8")), [
    "hero",
  ], {});

  assert.equal(scope.repoName, "componentsextra");
  assert.equal(scope.uilib, "web");
  assert.equal(scope.repoSelector, "componentsextra/web");
  assert.equal(scope.components.length, 1);
  assert.equal(scope.components[0].slug, "hero");
  assert.match(scope.components[0].dir, /web[/\\]hero$/);
});

test("resolvePushComponents accepts explicit web/hero and componentsextra/web/hero", () => {
  const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qui-push-resolve-"));
  const targetPath = "src/components/ui";
  const targetDir = path.join(tmp, targetPath);
  writeComponent(targetDir, "web", "hero");
  const config = {
    configSchemaVersion: "qui-config/v1",
    targetPath,
    repos: {
      componentsextra: {
        url: "https://github.com/hfnukal/q-ui-lib.git",
        componentsRoot: "componentsextra/components",
        uilibs: ["web"],
      },
    },
  };
  fs.writeFileSync(path.join(tmp, "qui.config.json"), `${JSON.stringify(config, null, 2)}\n`, "utf8");

  const byUilib = resolvePushComponents(tmp, config, ["web/hero"], {});
  assert.equal(byUilib.repoSelector, "componentsextra/web");

  const byTriple = resolvePushComponents(tmp, config, ["componentsextra/web/hero"], {});
  assert.equal(byTriple.repoSelector, "componentsextra/web");
});
