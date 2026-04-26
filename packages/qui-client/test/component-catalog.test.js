const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const { EXIT_CODES } = require("../src/constants");
const {
  parseUserComponentSpec,
  parseAllScopeSpec,
  groupSeedKeysByRepo,
} = require("../src/services/component-catalog");

describe("parseUserComponentSpec", () => {
  test("slug", () => {
    assert.deepEqual(parseUserComponentSpec("button"), { kind: "slug", slug: "button" });
  });

  test("uilib/slug", () => {
    assert.deepEqual(parseUserComponentSpec("base/button"), {
      kind: "uilib-slug",
      uilib: "base",
      slug: "button",
    });
  });

  test("repo/uilib/slug", () => {
    assert.deepEqual(parseUserComponentSpec("lib/base/button"), {
      kind: "triple",
      repo: "lib",
      uilib: "base",
      slug: "button",
    });
  });

  test("triple with slug path", () => {
    assert.deepEqual(parseUserComponentSpec("lib/base/nested/btn"), {
      kind: "triple",
      repo: "lib",
      uilib: "base",
      slug: "nested/btn",
    });
  });
});

describe("parseAllScopeSpec", () => {
  test("uilib only", () => {
    assert.deepEqual(parseAllScopeSpec("base"), { kind: "uilib", uilib: "base" });
  });

  test("repo/uilib", () => {
    assert.deepEqual(parseAllScopeSpec("lib/base"), { kind: "repo-uilib", repo: "lib", uilib: "base" });
  });

  test("invalid throws", () => {
    assert.throws(() => parseAllScopeSpec("a/b/c"), (e) => e.exitCode === EXIT_CODES.USAGE_PARSER_ERROR);
  });
});

describe("groupSeedKeysByRepo", () => {
  test("groups and dedupes", () => {
    const m = groupSeedKeysByRepo([
      { repoName: "a", seedKey: "base/b1" },
      { repoName: "a", seedKey: "base/b1" },
      { repoName: "b", seedKey: "base/b2" },
    ]);
    assert.deepEqual([...m.entries()], [
      ["a", ["base/b1"]],
      ["b", ["base/b2"]],
    ]);
  });
});
