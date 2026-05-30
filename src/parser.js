const { EXIT_CODES } = require("./constants");

const GLOBAL_BOOLEAN_FLAGS = new Set(["auto", "force", "dry-run", "yes", "json", "all", "ci"]);
const GLOBAL_VALUE_FLAGS = new Set([
  "on-error",
  "repo",
  "url",
  "target-path",
  "components-root",
  "uilibs",
  "connected",
  "ref",
  "base-branch",
  "title",
  "route-base",
  "branch",
  "routes-dir",
  "components-dir",
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
  if (!command || command === "--help" || command === "-h" || command === "help") {
    return { command: "help", positionals: [], flags: {}, raw: [] };
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

function parseConnectPairs(rawArgs) {
  const pairs = [];
  for (let i = 0; i < rawArgs.length; i += 1) {
    const token = rawArgs[i];
    if (token === "--repo") {
      const repo = rawArgs[i + 1];
      const urlFlag = rawArgs[i + 2];
      const url = rawArgs[i + 3];
      if (!repo || urlFlag !== "--url" || !url) {
        usageError("connect requires strict pairing: --repo <repo> --url <url>.");
      }
      pairs.push({ repo, url });
      i += 3;
      continue;
    }
    if (token === "--url") {
      usageError("connect does not allow --url without immediately preceding --repo.");
    }
  }
  if (pairs.length === 0) {
    usageError("connect requires at least one --repo <repo> --url <url> pair.");
  }
  return pairs;
}

module.exports = {
  parseArgv,
  parseConnectPairs,
  usageError,
};
