const fs = require("node:fs");
const { REPORT_SCHEMA_VERSION } = require("../constants");

function writeStdout(text) {
  fs.writeSync(process.stdout.fd, text);
}

function createReport({
  command,
  ok = true,
  exitCode = 0,
  repoSelector = null,
  targetPath = null,
  summary = {},
  items = [],
  warnings = [],
  errors = [],
  footer = [],
  details,
}) {
  const report = {
    schemaVersion: REPORT_SCHEMA_VERSION,
    command,
    ok,
    exitCode,
    repoSelector,
    targetPath,
    summary,
    items,
    warnings,
    errors,
    footer,
    timestamp: new Date().toISOString(),
  };
  if (details !== undefined) {
    report.details = details;
  }
  return report;
}

function printReport(report, jsonMode) {
  if (jsonMode) {
    writeStdout(`${JSON.stringify(report, null, 2)}\n`);
    return;
  }

  const status = report.ok ? "OK" : "FAIL";
  writeStdout(`[${status}] ${report.command} (exit ${report.exitCode})\n`);
  if (report.warnings.length > 0) {
    writeStdout(`Warnings: ${report.warnings.join(" | ")}\n`);
  }
  if (report.errors.length > 0) {
    writeStdout(`Errors: ${report.errors.join(" | ")}\n`);
  }
  const footer = report.footer && report.footer.length > 0 ? report.footer : [];
  for (const line of footer) {
    writeStdout(`${line}\n`);
  }
}

module.exports = {
  createReport,
  printReport,
};
