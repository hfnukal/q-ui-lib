const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const { parseArgv } = require("../src/parser");
const { EXIT_CODES } = require("../src/constants");

describe("parseArgv", () => {
  test("parses command and boolean flags", () => {
    const r = parseArgv(["add", "btn", "--dry-run", "--json"]);
    assert.equal(r.command, "add");
    assert.deepEqual(r.positionals, ["btn"]);
    assert.equal(r.flags.dryRun, true);
    assert.equal(r.flags.json, true);
  });

  test("parses value flags with kebab-case to camelCase", () => {
    const r = parseArgv(["generate", "--target-path", "src/ui", "--on-error", "fail"]);
    assert.equal(r.flags.targetPath, "src/ui");
    assert.equal(r.flags.onError, "fail");
  });

  test("throws on unknown option", () => {
    assert.throws(() => parseArgv(["init", "--not-real"]), (e) => {
      assert.equal(e.exitCode, EXIT_CODES.USAGE_PARSER_ERROR);
      return e.message.includes("Unknown option");
    });
  });

  test("throws when value flag missing value", () => {
    assert.throws(() => parseArgv(["connect", "--search-levels"]), (e) => {
      assert.equal(e.exitCode, EXIT_CODES.USAGE_PARSER_ERROR);
      return true;
    });
  });

  test("rejects removed --components-root flag", () => {
    assert.throws(() => parseArgv(["connect", "--components-root", "components"]), (e) => {
      assert.equal(e.exitCode, EXIT_CODES.USAGE_PARSER_ERROR);
      return e.message.includes("Unknown option");
    });
  });

  test("help command (--help or literal help)", () => {
    assert.equal(parseArgv(["--help"]).command, "help");
    assert.equal(parseArgv(["help"]).command, "help");
    assert.equal(parseArgv(["-h"]).command, "help");
  });

  test("help command with topic", () => {
    const r = parseArgv(["help", "remove"]);
    assert.equal(r.command, "help");
    assert.deepEqual(r.positionals, ["remove"]);
  });

  test("command-level --help flag", () => {
    const r = parseArgv(["add", "--help"]);
    assert.equal(r.command, "add");
    assert.equal(r.flags.help, true);
  });
});

describe("parseArgv connect flags", () => {
  test("parses --search-levels", () => {
    const r = parseArgv(["connect", "file://../lib", "--search-levels", "3"]);
    assert.equal(r.flags.searchLevels, "3");
  });

  test("parses --remove", () => {
    const r = parseArgv(["connect", "--remove", "componentsextra", "app"]);
    assert.equal(r.flags.remove, true);
    assert.deepEqual(r.positionals, ["componentsextra", "app"]);
  });
});
