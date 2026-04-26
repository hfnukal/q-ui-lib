const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const {
  parseRepoSelector,
  splitUrlAndRef,
  resolveRepo,
} = require("../src/services/source-resolver");
const { EXIT_CODES } = require("../src/constants");

describe("parseRepoSelector", () => {
  test("repo only", () => {
    assert.deepEqual(parseRepoSelector("lib"), { repo: "lib", uilib: null });
  });

  test("repo/uilib", () => {
    assert.deepEqual(parseRepoSelector("lib/base"), { repo: "lib", uilib: "base" });
  });

  test("invalid throws", () => {
    assert.throws(() => parseRepoSelector("a/b/c"), (e) => e.exitCode === EXIT_CODES.USAGE_PARSER_ERROR);
  });
});

describe("splitUrlAndRef", () => {
  test("with hash ref", () => {
    assert.deepEqual(splitUrlAndRef("https://x.com/a.git#v1"), {
      remoteUrl: "https://x.com/a.git",
      ref: "v1",
    });
  });

  test("no ref", () => {
    assert.deepEqual(splitUrlAndRef("https://x.com/a.git"), {
      remoteUrl: "https://x.com/a.git",
      ref: null,
    });
  });
});

describe("resolveRepo", () => {
  const config = {
    repos: {
      first: {
        url: "file:///tmp/lib",
        componentsRoot: "components",
        uilibs: ["base"],
        connected: true,
      },
      second: {
        url: "https://github.com/x/y.git",
        componentsRoot: "c",
        uilibs: ["x"],
        connected: false,
      },
    },
  };

  test("first repo when selector empty", () => {
    const r = resolveRepo(config, undefined);
    assert.equal(r.repoName, "first");
  });

  test("explicit repo name", () => {
    const r = resolveRepo(config, "second");
    assert.equal(r.repoName, "second");
    assert.equal(r.repo.connected, false);
  });

  test("missing repo", () => {
    assert.throws(() => resolveRepo(config, "nope"), (e) => e.exitCode === EXIT_CODES.CONFIG_SCHEMA_ERROR);
  });
});
