#!/usr/bin/env node
const { parseArgv } = require("./parser");
const { createReport, printReport } = require("./services/report");
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

function printHelp() {
  process.stdout.write(
    [
      "qui-client",
      "",
      "Usage:",
      "  qui <command> [options]",
      "",
      "Commands:",
      "  init [dir]      Initialize qui.config.json (optional project root; empty dir scaffolds Qwik)",
      "  connect <url> [repo [...uilibs]] [--all]  Add or update repos in qui.config.json",
      "  connect --remove <repo> [uilib...]         Remove repo or uilib from qui.config.json",
      "  verify          Validate config/repo selection",
      "  diff            Compare installed components with remote source",
      "  add|list|remove|generate|generate-demo|clone",
      "  update [<repo>/][<uilib>/][<component>...]",
      "  update --all [<uilib>|<repo>/<uilib>]",
      "  push [<repo>/][<uilib>/]<component...>",
      "",
      "Global flags:",
      "  --repo <repo|repo/uilib>",
      "  --on-error <ask|warn|fail>",
      "  --route-base /qui-demo   (generate-demo)",
      "  --base-branch <branch>   (push)",
      "  --branch <name>          (push)",
      "  --auto --force --dry-run --yes --json",
      "",
    ].join("\n")
  );
}

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
    default: {
      const err = new Error(`Unknown command '${command}'.`);
      err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
      throw err;
    }
  }
}

async function main() {
  try {
    const argv = process.argv.slice(2);
    const parsed = parseArgv(argv);
    if (parsed.command === "help") {
      printHelp();
      process.exit(EXIT_CODES.SUCCESS);
      return;
    }
    if (parsed.flags.ref) {
      const err = new Error("--ref is not supported. Use --url <git-url>#<ref>.");
      err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
      throw err;
    }

    const context = {
      cwd: process.cwd(),
      flags: parsed.flags,
      rawArgv: argv.slice(1),
      positionals: parsed.positionals,
    };
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
