const { test, describe, before, after } = require("node:test");
const assert = require("node:assert/strict");
const fs = require("node:fs");
const os = require("node:os");
const path = require("node:path");
const {
  validateConfig,
  readConfig,
  createDefaultConfig,
} = require("../src/services/config");
const { CONFIG_SCHEMA_VERSION, EXIT_CODES } = require("../src/constants");

describe("validateConfig", () => {
  test("accepts minimal valid config", () => {
    const c = {
      configSchemaVersion: CONFIG_SCHEMA_VERSION,
      targetPath: "src/components/ui",
      repos: {
        a: {
          url: "https://example.com/r.git",
          componentsRoot: "components",
          uilibs: ["base"],
          connected: true,
        },
      },
    };
    assert.doesNotThrow(() => validateConfig(c));
  });

  test("rejects absolute targetPath", () => {
    const c = {
      configSchemaVersion: CONFIG_SCHEMA_VERSION,
      targetPath: "/abs/path",
      repos: {
        a: {
          url: "https://example.com/r.git",
          componentsRoot: "c",
          uilibs: ["base"],
          connected: true,
        },
      },
    };
    assert.throws(() => validateConfig(c), (e) => {
      assert.equal(e.exitCode, EXIT_CODES.CONFIG_SCHEMA_ERROR);
      return e.message.includes("relative");
    });
  });

  test("rejects bad url", () => {
    const c = {
      configSchemaVersion: CONFIG_SCHEMA_VERSION,
      targetPath: "src/x",
      repos: {
        a: {
          url: "not-a-url",
          componentsRoot: "c",
          uilibs: ["base"],
          connected: true,
        },
      },
    };
    assert.throws(() => validateConfig(c), (e) => e.exitCode === EXIT_CODES.CONFIG_SCHEMA_ERROR);
  });

  test("rejects unknown top-level key", () => {
    const c = {
      configSchemaVersion: CONFIG_SCHEMA_VERSION,
      targetPath: "src/x",
      extra: 1,
      repos: {
        a: {
          url: "https://example.com/r.git",
          componentsRoot: "c",
          uilibs: ["base"],
          connected: true,
        },
      },
    };
    assert.throws(() => validateConfig(c), /Unknown config key/);
  });
});

describe("readConfig", () => {
  let tmp;
  before(() => {
    tmp = fs.mkdtempSync(path.join(os.tmpdir(), "qui-config-test-"));
    const cfg = createDefaultConfig("dev", "https://example.com/x.git", {
      targetPath: "src/ui",
    });
    fs.writeFileSync(path.join(tmp, "qui.config.json"), JSON.stringify(cfg, null, 2), "utf8");
  });
  after(() => {
    if (tmp) fs.rmSync(tmp, { recursive: true, force: true });
  });

  test("reads and validates qui.config.json from cwd", () => {
    const { config } = readConfig(tmp);
    assert.equal(config.targetPath, "src/ui");
    assert.equal(config.repos.dev.url, "https://example.com/x.git");
  });

  test("throws when config missing", () => {
    const empty = fs.mkdtempSync(path.join(os.tmpdir(), "qui-empty-"));
    try {
      assert.throws(() => readConfig(empty), (e) => e.exitCode === EXIT_CODES.CONFIG_SCHEMA_ERROR);
    } finally {
      fs.rmSync(empty, { recursive: true, force: true });
    }
  });
});
