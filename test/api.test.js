const assert = require("node:assert");
const path = require("node:path");
const test = require("node:test");
const {
  createContext,
  runArgv,
  runCommand,
  runList,
  EXIT_CODES,
} = require("../src/index");

const repoRoot = path.resolve(__dirname, "..");

test("runList returns a report without spawning qui binary", async () => {
  const report = await runList(
    createContext({
      cwd: repoRoot,
      positionals: [],
      flags: { json: true },
    })
  );
  assert.equal(report.command, "list");
  assert.equal(report.ok, true);
  assert.equal(report.exitCode, EXIT_CODES.SUCCESS);
});

test("runArgv parses flags like the qui binary", async () => {
  const report = await runArgv(["list", "--json"], { cwd: repoRoot });
  assert.equal(report.command, "list");
  assert.equal(report.ok, true);
});

test("runCommand rejects unknown commands", async () => {
  await assert.rejects(
    () =>
      runCommand("not-a-command", createContext({ cwd: repoRoot })),
    (error) => {
      assert.equal(error.exitCode, EXIT_CODES.USAGE_PARSER_ERROR);
      return true;
    }
  );
});
