const { createContext, runArgv, runCommand } = require("./api");
const { parseArgv } = require("./parser");
const { createReport, printReport } = require("./services/report");
const { EXIT_CODES, REPORT_SCHEMA_VERSION, CONFIG_SCHEMA_VERSION } = require("./constants");

module.exports = {
  createContext,
  runArgv,
  runCommand,
  parseArgv,
  createReport,
  printReport,
  EXIT_CODES,
  REPORT_SCHEMA_VERSION,
  CONFIG_SCHEMA_VERSION,
  runInit: require("./commands/init").runInit,
  runConnect: require("./commands/connect").runConnect,
  runVerify: require("./commands/verify").runVerify,
  runDiff: require("./commands/diff").runDiff,
  runAdd: require("./commands/add").runAdd,
  runList: require("./commands/list").runList,
  runUpdate: require("./commands/update").runUpdate,
  runRemove: require("./commands/remove").runRemove,
  runGenerate: require("./commands/generate").runGenerate,
  runGenerateDemo: require("./commands/generate-demo").runGenerateDemo,
  runClone: require("./commands/clone").runClone,
  runPush: require("./commands/push").runPush,
  runRoute: require("./commands/route").runRoute,
  runTemplate: require("./commands/template").runTemplate,
  runInstall: require("./commands/install").runInstall,
  runExport: require("./commands/export").runExport,
  runRegister: require("./commands/register").runRegister,
};
