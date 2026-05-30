const COMPONENTS_DIR_NAME = "components";

const COMMAND_SUMMARY = {
  init: "Initialize qui.config.json (optional project root; empty dir scaffolds Qwik)",
  connect: "Add, update, or remove repos in qui.config.json",
  verify: "Validate config/repo selection",
  diff: "Compare installed components with remote source",
  add: "Install components into targetPath",
  list: "Browse configured repos, uilibs, and components",
  update: "Overwrite installed components from source",
  remove: "Delete installed components",
  generate: "Regenerate component metadata under targetPath",
  "generate-demo": "Build demo routes for installed components",
  clone: "Copy an installed component under a new name",
  push: "Publish modified components back to a remote git repo",
};

const COMMAND_DETAIL = {
  init: [
    "Usage:",
    "  qui init [dir]",
    "",
    "Options:",
    "  --repo <name>         Default repo id (default: local-dev)",
    "  --url <url>           Default repo URL (default: file://../)",
    "  --target-path <path>  Component install path (default: src/components/ui)",
    "  --force --yes --auto --dry-run --on-error <ask|warn|fail>",
  ].join("\n"),
  connect: [
    "Usage:",
    "  qui connect <url> [repo [...uilibs]] [--all]",
    "  qui connect --remove <repo> [uilib...]",
    "",
    "Connect discovers repos/uilibs at <url> and writes qui.config.json entries.",
    "Remove edits config only (does not delete installed files).",
    "",
    "Options:",
    "  --all              Include all discovered uilibs for the repo",
    "  --remove           Remove repo or uilib(s) from config",
    "  --search-levels N  Discovery depth (default: 2)",
    "  --connected true|false",
    "  --yes --dry-run --json",
  ].join("\n"),
  verify: [
    "Usage:",
    "  qui verify [--repo <repo>]",
    "",
    "Options:",
    "  --repo <repo>  Repo to validate (default: first repo)",
    "  --ci           Non-zero exit when repo is not connected",
    "  --json",
  ].join("\n"),
  diff: [
    "Usage:",
    "  qui diff [[<repo>/][<uilib>/]<component>...]",
    "",
    "Compare local installs with remote source. With no args, diffs all installed.",
    "Each positional can be a component, uilib, or repo scope.",
    "",
    "Options:",
    "  --repo <repo|repo/uilib>  Filter scope",
    "  --target-path <path>",
    "  --ci --json",
  ].join("\n"),
  add: [
    "Usage:",
    "  qui add <component...>",
    "  qui add --all [<uilib>|<repo>/<uilib>]",
    "",
    "Install components from configured repos into targetPath.",
    "Without scope, add --all prompts for repo and uilib interactively.",
    "",
    "Options:",
    "  --repo <repo|repo/uilib>",
    "  --target-path <path>",
    "  --all --dry-run --auto --force --yes --on-error <ask|warn|fail> --json",
  ].join("\n"),
  list: [
    "Usage:",
    "  qui list",
    "  qui list [<repo>]",
    "  qui list [<repo>/][<uilib>/][<component>]",
    "  qui list --all [<repo>]",
    "",
    "Options:",
    "  --repo <repo>  Disambiguate bare uilib names",
    "  --all          List all remote catalog components",
    "  --json",
  ].join("\n"),
  update: [
    "Usage:",
    "  qui update [<repo>/][<uilib>/][<component>...]",
    "  qui update --all [<uilib>|<repo>/<uilib>]",
    "",
    "Overwrite installed components from source. Prompts before overwrite unless --yes.",
    "",
    "Options:",
    "  --repo <repo|repo/uilib>",
    "  --target-path <path>",
    "  --all --yes --auto --force --dry-run --json",
  ].join("\n"),
  remove: [
    "Usage:",
    "  qui remove <uilib>/<component>...",
    "  qui remove --all <uilib>",
    "",
    "Delete installed components under targetPath (local only).",
    "Prompts for confirmation unless --yes.",
    "",
    "Options:",
    "  --target-path <path>",
    "  --yes --force --dry-run --on-error <ask|warn|fail> --json",
  ].join("\n"),
  generate: [
    "Usage:",
    "  qui generate",
    "",
    "Regenerate meta.generated.json for components under targetPath.",
    "",
    "Options:",
    "  --target-path <path>",
    "  --dry-run --json",
  ].join("\n"),
  "generate-demo": [
    "Usage:",
    "  qui generate-demo [<slug>...]",
    "",
    "Sync demo template, ensure qui-demo/base components, generate demo routes.",
    "",
    "Options:",
    "  --route-base </segment>  Route segment (default: /qui-demo)",
    "  --target-path <path>",
    "  --dry-run --json",
  ].join("\n"),
  clone: [
    "Usage:",
    "  qui clone [<uilib>/]<source> [<uilib>/]<new-name>",
    "",
    "Copy an installed component directory under a new name (local only).",
    "",
    "Options:",
    "  --repo <repo|repo/uilib>",
    "  --target-path <path>",
    "  --force --dry-run --json",
  ].join("\n"),
  push: [
    "Usage:",
    "  qui push [<repo>/][<uilib>/]<component...>",
    "",
    "Push modified local components to a git remote and open a PR when possible.",
    "",
    "Options:",
    "  --repo <repo|repo/uilib>",
    "  --base-branch <branch>  --branch <name>  --title <msg>",
    "  --dry-run --json",
  ].join("\n"),
};

function printHelp() {
  const lines = [
    "qui-client",
    "",
    "Usage:",
    "  qui <command> [options]",
    "  qui help <command>",
    "  qui <command> --help",
    "",
    "Commands:",
  ];
  for (const [name, summary] of Object.entries(COMMAND_SUMMARY)) {
    lines.push(`  ${name.padEnd(16)} ${summary}`);
  }
  lines.push(
    "",
    "Global flags:",
    "  --repo <repo|repo/uilib>     Source selector",
    "  --target-path <path>         Override qui.config.json targetPath",
    "  --on-error <ask|warn|fail>   Conflict/error policy",
    "  --auto --force --yes         Non-interactive confirmations",
    "  --dry-run                    Preview without writing",
    "  --all                        Bulk scope (see command help)",
    "  --ci                         CI mismatch exit for verify/diff",
    "  --json                       JSON report on stdout",
    "",
    "Run `qui help <command>` for detailed usage."
  );
  process.stdout.write(`${lines.join("\n")}\n`);
}

function printCommandHelp(command) {
  const summary = COMMAND_SUMMARY[command];
  const detail = COMMAND_DETAIL[command];
  if (!summary || !detail) {
    const err = new Error(`Unknown command '${command}'.`);
    err.exitCode = 2;
    throw err;
  }
  process.stdout.write(`${command} — ${summary}\n\n${detail}\n\n`);
}

module.exports = {
  COMPONENTS_DIR_NAME,
  COMMAND_SUMMARY,
  printHelp,
  printCommandHelp,
};
