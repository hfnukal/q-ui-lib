const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const { spawnSync } = require("node:child_process");

const pkgRoot = path.resolve(__dirname, "..");
const quiBin = path.join(pkgRoot, "bin", "qui.js");
const { EXIT_CODES } = require("../src/constants");
const { CONFIG_SCHEMA_VERSION } = require("../src/constants");
const {
  parseUilibPackSpec,
  isUilibPackSpec,
} = require("../src/services/uilib-pack");
const {
  buildManifest,
  parseExportSections,
  validateManifest,
} = require("../src/services/manifest");
const { parseRegisterSpec } = require("../src/commands/register");

describe("uilib-pack", () => {
  test("parseUilibPackSpec splits repo/uilib/folder/subpath", () => {
    const parsed = parseUilibPackSpec("quibase/base/routescomp/[slug]");
    assert.deepEqual(parsed, {
      repo: "quibase",
      uilib: "base",
      folder: "routescomp",
      subpath: "[slug]",
      spec: "quibase/base/routescomp/[slug]",
    });
  });

  test("isUilibPackSpec requires at least three segments", () => {
    assert.equal(isUilibPackSpec("base/button"), false);
    assert.equal(isUilibPackSpec("quibase/base/routescomp"), true);
  });
});

describe("manifest", () => {
  test("parseExportSections honors section keywords", () => {
    const r = parseExportSections(["routes", "quibase/base/routescomp"]);
    assert.equal(r.sections.components, false);
    assert.equal(r.sections.templates, false);
    assert.equal(r.sections.routes, true);
    assert.deepEqual(r.routeSpecs, ["quibase/base/routescomp"]);
  });

  test("buildManifest trims repos to referenced sources", () => {
    const config = {
      configSchemaVersion: CONFIG_SCHEMA_VERSION,
      targetPath: "src/components/ui",
      repos: {
        quibase: {
          url: "file://../",
          componentsRoot: "components",
          uilibs: ["base"],
          connected: true,
        },
        extra: {
          url: "file://../extra",
          componentsRoot: "components",
          uilibs: ["web"],
          connected: true,
        },
      },
    };
    const manifest = buildManifest({
      config,
      componentSpecs: ["base/button"],
      templateSpecs: [],
      routeSpecs: [],
      sections: { components: true, templates: false, routes: false },
    });
    assert.ok(manifest.config.repos.quibase);
    assert.equal(manifest.config.repos.extra, undefined);
    validateManifest(manifest);
  });
});

function writeQuiConfig(dir, url) {
  fs.writeFileSync(
    path.join(dir, "qui.config.json"),
    `${JSON.stringify(
      {
        configSchemaVersion: CONFIG_SCHEMA_VERSION,
        targetPath: "src/components/ui",
        repos: {
          local: {
            url,
            componentsRoot: "components",
            uilibs: ["base"],
            connected: true,
          },
        },
      },
      null,
      2,
    )}\n`,
    "utf8",
  );
}

function writeSourcePacks(sourceRoot) {
  const routesDir = path.join(sourceRoot, "components", "base", "routescomp", "routes");
  const templateDir = path.join(sourceRoot, "components", "base", "mytemplate", "template");
  fs.mkdirSync(path.join(routesDir, "[slug]"), { recursive: true });
  fs.mkdirSync(templateDir, { recursive: true });
  fs.writeFileSync(path.join(routesDir, "index.tsx"), "export const Route = () => null;\n", "utf8");
  fs.writeFileSync(path.join(routesDir, "[slug]", "index.tsx"), "export const Slug = () => null;\n", "utf8");
  fs.writeFileSync(path.join(templateDir, "entry.tsx"), "export const Entry = () => null;\n", "utf8");
}

describe("register", () => {
  test("parseRegisterSpec accepts trailing slash", () => {
    assert.deepEqual(parseRegisterSpec("quibase/mycustom/"), {
      repo: "quibase",
      uilib: "mycustom",
    });
  });

  test("register adds uilib from targetPath to connected repo", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qui-register-"));
    try {
      writeQuiConfig(tmp, "file://../");
      const targetDir = path.join(tmp, "src", "components", "ui", "mycustom", "widget");
      fs.mkdirSync(targetDir, { recursive: true });
      fs.writeFileSync(path.join(targetDir, "index.tsx"), "export const Widget = () => null;\n", "utf8");

      const r = spawnSync(
        process.execPath,
        [quiBin, "register", "local/mycustom/", "--json"],
        { cwd: tmp, encoding: "utf8" },
      );
      assert.equal(r.status, 0, r.stderr || r.stdout);
      const config = JSON.parse(fs.readFileSync(path.join(tmp, "qui.config.json"), "utf8"));
      assert.ok(config.repos.local.uilibs.includes("mycustom"));
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });

  test("register rejects unknown repo", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qui-register-repo-"));
    try {
      writeQuiConfig(tmp, "file://../");
      const r = spawnSync(
        process.execPath,
        [quiBin, "register", "missing/mycustom/", "--json"],
        { cwd: tmp, encoding: "utf8" },
      );
      assert.equal(r.status, EXIT_CODES.CONFIG_SCHEMA_ERROR);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
    }
  });
});

describe("route/template CLI", () => {
  test("route copies routes pack into src/routes", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qui-route-"));
    const sourceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "qui-route-src-"));
    try {
      writeSourcePacks(sourceRoot);
      writeQuiConfig(tmp, `file://${sourceRoot}`);
      const r = spawnSync(
        process.execPath,
        [quiBin, "route", "local/base/routescomp", "--yes", "--json"],
        { cwd: tmp, encoding: "utf8" },
      );
      assert.equal(r.status, 0, r.stderr || r.stdout);
      assert.ok(fs.existsSync(path.join(tmp, "src", "routes", "index.tsx")));
      assert.ok(fs.existsSync(path.join(tmp, "src", "routes", "[slug]", "index.tsx")));
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
      fs.rmSync(sourceRoot, { recursive: true, force: true });
    }
  });

  test("template copies template pack into src", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qui-template-"));
    const sourceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "qui-template-src-"));
    try {
      writeSourcePacks(sourceRoot);
      writeQuiConfig(tmp, `file://${sourceRoot}`);
      const r = spawnSync(
        process.execPath,
        [quiBin, "template", "local/base/mytemplate", "--yes", "--json"],
        { cwd: tmp, encoding: "utf8" },
      );
      assert.equal(r.status, 0, r.stderr || r.stdout);
      assert.ok(fs.existsSync(path.join(tmp, "src", "entry.tsx")));
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
      fs.rmSync(sourceRoot, { recursive: true, force: true });
    }
  });

  test("route subpath installs only selected segment", () => {
    const tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qui-route-sub-"));
    const sourceRoot = fs.mkdtempSync(path.join(os.tmpdir(), "qui-route-sub-src-"));
    try {
      writeSourcePacks(sourceRoot);
      writeQuiConfig(tmp, `file://${sourceRoot}`);
      const r = spawnSync(
        process.execPath,
        [quiBin, "route", "local/base/routescomp/[slug]", "--yes", "--json"],
        { cwd: tmp, encoding: "utf8" },
      );
      assert.equal(r.status, 0, r.stderr || r.stdout);
      assert.ok(fs.existsSync(path.join(tmp, "src", "routes", "[slug]", "index.tsx")));
      assert.equal(fs.existsSync(path.join(tmp, "src", "routes", "index.tsx")), false);
    } finally {
      fs.rmSync(tmp, { recursive: true, force: true });
      fs.rmSync(sourceRoot, { recursive: true, force: true });
    }
  });
});
