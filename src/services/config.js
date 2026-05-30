const fs = require("node:fs");
const path = require("node:path");
const {
  CONFIG_SCHEMA_VERSION,
  DEFAULT_TARGET_PATH,
  EXIT_CODES,
} = require("../constants");

const ALLOWED_TOP_LEVEL_KEYS = new Set([
  "configSchemaVersion",
  "targetPath",
  "policy",
  "repos",
]);
const ALLOWED_POLICY_KEYS = new Set([
  "onError",
  "interactive",
  "npmInstallMode",
  "packageManager",
]);
const ALLOWED_REPO_KEYS = new Set(["url", "componentsRoot", "uilibs", "connected"]);

function ensureObject(value, message) {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    throwConfigError(message);
  }
}

function throwConfigError(message) {
  const err = new Error(message);
  err.exitCode = EXIT_CODES.CONFIG_SCHEMA_ERROR;
  throw err;
}

function getConfigPath(cwd) {
  return path.join(cwd, "qui.config.json");
}

function validateUrl(url) {
  return /^(file:\/\/.+|https?:\/\/.+|ssh:\/\/.+|git@.+:.+)(#.+)?$/.test(url);
}

function validateConfig(config) {
  ensureObject(config, "Config must be an object.");
  for (const key of Object.keys(config)) {
    if (!ALLOWED_TOP_LEVEL_KEYS.has(key)) {
      throwConfigError(`Unknown config key: ${key}`);
    }
  }
  if (config.configSchemaVersion !== CONFIG_SCHEMA_VERSION) {
    throwConfigError(
      `configSchemaVersion must be '${CONFIG_SCHEMA_VERSION}'.`
    );
  }
  if (typeof config.targetPath !== "string" || config.targetPath.length === 0) {
    throwConfigError("targetPath must be a non-empty string.");
  }
  if (path.isAbsolute(config.targetPath)) {
    throwConfigError("targetPath must be relative.");
  }
  ensureObject(config.repos, "repos must be an object.");
  if (Object.keys(config.repos).length === 0) {
    throwConfigError("repos must contain at least one repo.");
  }

  if (config.policy !== undefined) {
    ensureObject(config.policy, "policy must be an object.");
    for (const key of Object.keys(config.policy)) {
      if (!ALLOWED_POLICY_KEYS.has(key)) {
        throwConfigError(`Unknown policy key: ${key}`);
      }
    }
  }

  for (const [repoName, repo] of Object.entries(config.repos)) {
    ensureObject(repo, `repos.${repoName} must be an object.`);
    for (const key of Object.keys(repo)) {
      if (!ALLOWED_REPO_KEYS.has(key)) {
        throwConfigError(`Unknown repos.${repoName} key: ${key}`);
      }
    }
    if (typeof repo.url !== "string" || !validateUrl(repo.url)) {
      throwConfigError(`repos.${repoName}.url has unsupported format.`);
    }
    if (typeof repo.componentsRoot !== "string" || repo.componentsRoot.length === 0) {
      throwConfigError(`repos.${repoName}.componentsRoot must be a non-empty string.`);
    }
    if (!Array.isArray(repo.uilibs) || repo.uilibs.length === 0) {
      throwConfigError(`repos.${repoName}.uilibs must be a non-empty array.`);
    }
    if (!repo.uilibs.every((item) => typeof item === "string" && item.length > 0)) {
      throwConfigError(`repos.${repoName}.uilibs must contain non-empty strings.`);
    }
    if (typeof repo.connected !== "boolean") {
      throwConfigError(`repos.${repoName}.connected must be boolean.`);
    }
  }
}

function readConfig(cwd) {
  const configPath = getConfigPath(cwd);
  if (!fs.existsSync(configPath)) {
    throwConfigError("Missing qui.config.json.");
  }
  let parsed;
  try {
    parsed = JSON.parse(fs.readFileSync(configPath, "utf8"));
  } catch {
    throwConfigError("qui.config.json is not valid JSON.");
  }
  validateConfig(parsed);
  return { config: parsed, configPath };
}

function writeConfigAtomicAt(configPath, config) {
  validateConfig(config);
  const tempPath = `${configPath}.${Date.now()}.tmp`;
  fs.writeFileSync(tempPath, `${JSON.stringify(config, null, 2)}\n`, "utf8");
  fs.renameSync(tempPath, configPath);
  return configPath;
}

function writeConfigAtomic(cwd, config) {
  return writeConfigAtomicAt(getConfigPath(cwd), config);
}

function createDefaultConfig(repoName, url, options = {}) {
  return {
    configSchemaVersion: CONFIG_SCHEMA_VERSION,
    targetPath: options.targetPath || DEFAULT_TARGET_PATH,
    repos: {
      [repoName]: {
        url,
        componentsRoot: options.componentsRoot || "components",
        uilibs: options.uilibs || ["base"],
        connected: options.connected !== false,
      },
    },
  };
}

module.exports = {
  createDefaultConfig,
  getConfigPath,
  readConfig,
  validateConfig,
  writeConfigAtomic,
  writeConfigAtomicAt,
};
