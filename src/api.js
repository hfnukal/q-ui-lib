const { parseArgv } = require("./parser");
const { EXIT_CODES } = require("./constants");
const { runInit } = require("./commands/init");
const { runConnect } = require("./commands/connect");
const { runVerify } = require("./commands/verify");
const { runDiff } = require("./commands/diff");
const { runAdd } = require("./commands/add");
const { runList } = require("./commands/list");
const { runUpdate } = require("./commands/update");
const { runRemove } = require("./commands/remove");
const { runGenerate } = require("./commands/generate");
const { runGenerateDemo } = require("./commands/generate-demo");
const { runClone } = require("./commands/clone");
const { runPush } = require("./commands/push");
const { runRoute } = require("./commands/route");
const { runTemplate } = require("./commands/template");
const { runInstall } = require("./commands/install");
const { runExport } = require("./commands/export");
const { runRegister } = require("./commands/register");

/**
 * @typedef {object} QuiContext
 * @property {string} cwd
 * @property {Record<string, string | boolean | undefined>} flags
 * @property {string[]} positionals
 * @property {string[]} rawArgv
 */

/**
 * @param {Partial<QuiContext> & Pick<QuiContext, "cwd">} input
 * @returns {QuiContext}
 */
function createContext(input) {
  return {
    cwd: input.cwd,
    flags: input.flags || {},
    positionals: input.positionals || [],
    rawArgv: input.rawArgv || [],
  };
}

/**
 * @param {string} command
 * @param {QuiContext} context
 */
async function runCommand(command, context) {
  switch (command) {
    case "init":
      return runInit(context);
    case "connect":
      return runConnect(context);
    case "verify":
      return runVerify(context);
    case "diff":
      return runDiff(context);
    case "add":
      return runAdd(context);
    case "list":
      return runList(context);
    case "update":
      return runUpdate(context);
    case "remove":
      return runRemove(context);
    case "generate":
      return runGenerate(context);
    case "generate-demo":
      return runGenerateDemo(context);
    case "clone":
      return runClone(context);
    case "push":
      return runPush(context);
    case "route":
      return runRoute(context);
    case "template":
      return runTemplate(context);
    case "install":
      return runInstall(context);
    case "export":
      return runExport(context);
    case "register":
      return runRegister(context);
    default: {
      const err = new Error(`Unknown command '${command}'.`);
      err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
      throw err;
    }
  }
}

/**
 * Parse argv the same way as the `qui` binary, then run the command.
 *
 * @param {string[]} argv Command + args (e.g. `["list", "base/button"]`).
 * @param {{ cwd?: string }} [options]
 */
async function runArgv(argv, options = {}) {
  const parsed = parseArgv(argv);
  if (parsed.flags.ref) {
    const err = new Error("--ref is not supported. Use --url <git-url>#<ref>.");
    err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
    throw err;
  }
  const context = createContext({
    cwd: options.cwd || process.cwd(),
    flags: parsed.flags,
    rawArgv: argv.slice(1),
    positionals: parsed.positionals,
  });
  return runCommand(parsed.command, context);
}

module.exports = {
  createContext,
  runArgv,
  runCommand,
};
