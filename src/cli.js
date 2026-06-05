#!/usr/bin/env node
const { parseArgv } = require("./parser");
const { createReport, printReport } = require("./services/report");
const { EXIT_CODES } = require("./constants");
const { printHelp, printCommandHelp } = require("./help");
const { createContext, runCommand } = require("./api");

async function main() {
  try {
    const argv = process.argv.slice(2);
    const parsed = parseArgv(argv);
    if (parsed.command === "help") {
      const topic = parsed.positionals[0];
      if (topic) {
        printCommandHelp(topic);
      } else {
        printHelp();
      }
      process.exit(EXIT_CODES.SUCCESS);
      return;
    }
    if (parsed.flags.help) {
      printCommandHelp(parsed.command);
      process.exit(EXIT_CODES.SUCCESS);
      return;
    }
    if (parsed.flags.ref) {
      const err = new Error("--ref is not supported. Use --url <git-url>#<ref>.");
      err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
      throw err;
    }

    const context = createContext({
      cwd: process.cwd(),
      flags: parsed.flags,
      rawArgv: argv.slice(1),
      positionals: parsed.positionals,
    });
    const report = await runCommand(parsed.command, context);
    printReport(report, parsed.flags.json);
    process.exit(report.exitCode);
  } catch (error) {
    const exitCode = Number.isInteger(error.exitCode)
      ? error.exitCode
      : EXIT_CODES.UNEXPECTED_RUNTIME_ERROR;
    const report = createReport({
      command: "runtime",
      ok: false,
      exitCode,
      errors: [error.message || "Unexpected runtime error."],
    });
    printReport(report, process.argv.includes("--json"));
    process.exit(exitCode);
  }
}

main();
