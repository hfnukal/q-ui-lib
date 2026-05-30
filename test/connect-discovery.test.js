const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const path = require("node:path");
const {
  discoverRepos,
  matchRepoCandidate,
  parseSearchLevels,
} = require("../src/services/connect-discovery");
const {
  parseConnectInput,
  toFileUrl,
} = require("../src/services/connect-url");
const { EXIT_CODES } = require("../src/constants");

const pkgRoot = path.resolve(__dirname, "..");

describe("parseConnectInput", () => {
  test("file URL resolves to absolute scan root", () => {
    const parsed = parseConnectInput(`file://${pkgRoot}`, pkgRoot);
    assert.equal(parsed.sourceKind, "file");
    assert.equal(parsed.scanRootAbs, pkgRoot);
  });

  test("GitHub tree permalink normalizes to clone URL and scope", () => {
    const parsed = parseConnectInput(
      "https://github.com/hfnukal/q-ui-lib/tree/main/componentsextra",
      pkgRoot
    );
    assert.equal(parsed.sourceKind, "git");
    assert.equal(parsed.remoteUrl, "https://github.com/hfnukal/q-ui-lib.git");
    assert.equal(parsed.ref, "main");
    assert.equal(parsed.storedGitUrl, "https://github.com/hfnukal/q-ui-lib.git#main");
    assert.equal(parsed.permalinkScope, "componentsextra");
  });
});

describe("parseSearchLevels", () => {
  test("defaults to 2", () => {
    assert.equal(parseSearchLevels(undefined), 2);
  });

  test("rejects invalid values", () => {
    assert.throws(() => parseSearchLevels("-1"), (e) => {
      assert.equal(e.exitCode, EXIT_CODES.USAGE_PARSER_ERROR);
      return true;
    });
  });
});

describe("discoverRepos", () => {
  test("monorepo root finds root, componenttest, and componentsextra", () => {
    const { candidates } = discoverRepos(pkgRoot, {
      searchLevels: 2,
      componentsDirName: "components",
      sourceKind: "file",
    });
    const ids = candidates.map((c) => c.id);
    assert.ok(ids.includes("q-ui-lib") || ids.includes(path.basename(pkgRoot)));
    assert.ok(ids.includes("componenttest"));
    assert.ok(ids.includes("componentsextra"));
  });

  test("scoped path finds single repo", () => {
    const scoped = path.join(pkgRoot, "componentsextra");
    const { candidates } = discoverRepos(scoped, {
      searchLevels: 2,
      componentsDirName: "components",
      sourceKind: "file",
    });
    assert.equal(candidates.length, 1);
    assert.equal(candidates[0].id, "componentsextra");
    assert.equal(candidates[0].componentsRoot, "components");
    assert.deepEqual(candidates[0].uilibs.sort(), ["app", "jabko", "web"].sort());
    assert.equal(candidates[0].storedUrl, toFileUrl(scoped));
  });

  test("search-levels 0 only checks scan root", () => {
    const { candidates } = discoverRepos(pkgRoot, {
      searchLevels: 0,
      componentsDirName: "components",
      sourceKind: "file",
    });
    assert.equal(candidates.length, 1);
    assert.ok(candidates[0].uilibs.includes("base"));
    assert.ok(!candidates.some((c) => c.id === "componenttest"));
  });

  test("git-style componentsRoot is relative to clone root", () => {
    const { candidates } = discoverRepos(pkgRoot, {
      searchLevels: 2,
      componentsDirName: "components",
      sourceKind: "git",
      gitCloneRootAbs: pkgRoot,
      storedGitUrl: "https://github.com/hfnukal/q-ui-lib.git#main",
      gitRemoteUrl: "https://github.com/hfnukal/q-ui-lib.git",
    });
    const componenttest = candidates.find((c) => c.id === "componenttest");
    assert.ok(componenttest);
    assert.equal(componenttest.componentsRoot, "componenttest/components");
    assert.equal(componenttest.storedUrl, "https://github.com/hfnukal/q-ui-lib.git#main");
  });
});

describe("matchRepoCandidate", () => {
  const candidates = [
    {
      id: "componenttest",
      relativePath: "componenttest",
      repoRootAbs: path.join(pkgRoot, "componenttest"),
      uilibs: ["qui-test-simple"],
    },
    {
      id: "componentsextra",
      relativePath: "componentsextra",
      repoRootAbs: path.join(pkgRoot, "componentsextra"),
      uilibs: ["app"],
    },
  ];

  test("matches by id", () => {
    assert.equal(matchRepoCandidate(candidates, "componenttest").id, "componenttest");
  });

  test("rejects unknown repo with hints", () => {
    assert.throws(() => matchRepoCandidate(candidates, "missing"), (e) => {
      assert.equal(e.exitCode, EXIT_CODES.USAGE_PARSER_ERROR);
      return e.message.includes("Discovered");
    });
  });
});
