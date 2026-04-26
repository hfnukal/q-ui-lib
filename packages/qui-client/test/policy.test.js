const { test, describe } = require("node:test");
const assert = require("node:assert/strict");
const { resolvePolicy } = require("../src/services/policy");

describe("resolvePolicy", () => {
  test("defaults", () => {
    const p = resolvePolicy({}, {});
    assert.equal(p.onError, "ask");
    assert.equal(p.npmInstallMode, "ask");
    assert.equal(p.interactive, true);
  });

  test("--force disables interactive and sets warn + npm force", () => {
    const p = resolvePolicy({ force: true }, { onError: "fail" });
    assert.equal(p.interactive, false);
    assert.equal(p.onError, "warn");
    assert.equal(p.npmInstallMode, "force");
  });

  test("--auto sets npm auto", () => {
    const p = resolvePolicy({ auto: true }, {});
    assert.equal(p.npmInstallMode, "auto");
  });

  test("config policy merged then CLI onError wins", () => {
    const p = resolvePolicy({ onError: "fail" }, { onError: "warn" });
    assert.equal(p.onError, "fail");
  });
});
