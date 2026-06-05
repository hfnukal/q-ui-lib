const { EXIT_CODES } = require("./constants");

const GLOBAL_BOOLEAN_FLAGS = new Set([
  "auto",
  "force",
  "dry-run",
  "yes",
  "json",
  "all",
  "ci",
  "remove",
  "no-init",
  "help",
]);
const GLOBAL_VALUE_FLAGS = new Set([
  "on-error",
  "repo",
  "url",
  "target-path",
  "connected",
  "ref",
  "base-branch",
  "title",
  "route-base",
  "routes-path",
  "template-path",
  "output",
  "branch",
  "search-levels",
]);

function usageError(message) {
  const err = new Error(message);
  err.exitCode = EXIT_CODES.USAGE_PARSER_ERROR;
  throw err;
}

function normalizeFlagName(name) {
  return name.replace(/-([a-z])/g, (_, c) => c.toUpperCase());
}

function parseArgv(argv) {
  const [command, ...rest] = argv;
  if (!command || command === "--help" || command === "-h") {
    return { command: "help", positionals: [], flags: {}, raw: [] };
  }
  if (command === "help") {
    const topic = rest.find((token) => !token.startsWith("--")) || null;
    return { command: "help", positionals: topic ? [topic] : [], flags: {}, raw: rest };
  }

  const positionals = [];
  const flags = {};
  const raw = [];

  for (let i = 0; i < rest.length; i += 1) {
    const token = rest[i];
    raw.push(token);
    if (!token.startsWith("--")) {
      positionals.push(token);
      continue;
    }
    const flag = token.slice(2);
    if (GLOBAL_BOOLEAN_FLAGS.has(flag)) {
      flags[normalizeFlagName(flag)] = true;
      continue;
    }
    if (GLOBAL_VALUE_FLAGS.has(flag)) {
      const value = rest[i + 1];
      if (!value || value.startsWith("--")) {
        usageError(`Missing value for --${flag}`);
      }
      raw.push(value);
      i += 1;
      flags[normalizeFlagName(flag)] = value;
      continue;
    }
    usageError(`Unknown option --${flag}`);
  }
  return { command, positionals, flags, raw };
}

module.exports = {
  parseArgv,
  usageError,
};
