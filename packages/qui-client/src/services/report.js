const { REPORT_SCHEMA_VERSION } = require("../constants");

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
}) {
  return {
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
}

function printReport(report, jsonMode) {
  if (jsonMode) {
    process.stdout.write(`${JSON.stringify(report, null, 2)}\n`);
    return;
  }

  const status = report.ok ? "OK" : "FAIL";
  process.stdout.write(`[${status}] ${report.command} (exit ${report.exitCode})\n`);
  if (report.warnings.length > 0) {
    process.stdout.write(`Warnings: ${report.warnings.join(" | ")}\n`);
  }
  if (report.errors.length > 0) {
    process.stdout.write(`Errors: ${report.errors.join(" | ")}\n`);
  }
  const footer = report.footer && report.footer.length > 0 ? report.footer : [];
  for (const line of footer) {
    process.stdout.write(`${line}\n`);
  }
}

module.exports = {
  createReport,
  printReport,
};
