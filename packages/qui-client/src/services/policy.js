function resolvePolicy(flags, configPolicy = {}) {
  const base = {
    onError: "ask",
    interactive: true,
    npmInstallMode: "ask",
  };
  const resolved = {
    ...base,
    ...configPolicy,
  };

  if (flags.onError) resolved.onError = flags.onError;
  if (flags.auto) {
    resolved.interactive = true;
    resolved.npmInstallMode = "auto";
  }
  if (flags.force) {
    resolved.interactive = false;
    resolved.onError = "warn";
    resolved.npmInstallMode = "force";
  }
  return resolved;
}

module.exports = {
  resolvePolicy,
};
