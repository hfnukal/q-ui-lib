# qui-client

**The root of this repository is the npm package `qui-client`:** the **`qui`** CLI plus the canonical Qwik UI component sources in **`components/`**. Components are pulled into an app as **source code** (copied into `targetPath`); synchronization happens from Git repositories according to `qui.config.json`.

## Quick start

```bash
# In your app
npm i -D qui-client

# Initialize config + template files
npx qui init

# Add source components
npx qui add button input
```

When developing **inside this repository** (a clone of the monorepo):

```bash
npm install
npm run qui -- <command> [options]
```

## CLI (`qui`)

General shape:

```bash
qui <command> [positionals...] [--flags]
```

- The first non-flag token is the **command**; the rest are **positionals** (e.g. component specs).
- Flags can appear in any order. Boolean flags take no value (`--dry-run`); value flags take the next token (`--repo acme`).
- An unknown `--flag`, a value flag with a missing value, or an unknown command exits with code `2` (usage error).
- `--help`, `-h`, `help`, or no command prints usage and exits `0`.
- `--ref` is parsed but **rejected** at runtime — encode a ref in the URL instead: `--url <git-url>#<ref>`.
- Every command except `init` reads `qui.config.json` from the **current working directory** (`init` creates it).

A **component spec** is either a bare slug (`button`) or a `uilib/slug` pair (`base/button`); see [Repo vs ui-lib + component lookup](#repo-vs-ui-lib--component-lookup).

### `init` — scaffold/initialize a project

```bash
qui init [dir]
```

- `[dir]` — optional project root (at most one; default `.`). An **empty** directory is scaffolded with `npm create qwik@latest` (empty template) + Tailwind.
- Writes/updates `qui.config.json`, syncs `templates/app` into the project, and adds `qui-client` as a `file:` devDependency (then runs `npm install`).
- Config defaults come from flags: `--repo` (default `local-dev`), `--url` (default `file://../`), `--target-path` (default `src/components/ui`), `--components-root`, `--uilibs` (comma-separated), `--connected` (`true`/`false`, default `true`).
- Existing-config conflict is resolved by policy/flags: `--force`/`--yes` overwrite, `--auto` writes a `qui.config-template.json`, `--on-error fail` aborts, `--on-error ask` (default) prompts interactively. `--dry-run` previews without writing.

### `connect` — add/update repos in config

```bash
qui connect --repo <repo> --url <url> [--repo <repo2> --url <url2> ...]
```

- Requires **strict pairing**: each `--repo` must be immediately followed by `--url` (at least one pair). A `--url` without a preceding `--repo` is an error.
- Applies to each repo: `--components-root` (default `components`), `--uilibs` (comma-separated, default `base`), `--connected` (`true`/`false`, default `true`).
- Overwriting an existing repo follows `--on-error` (`ask` default / `warn` / `fail`); `--force`/`--auto`/`--yes` skip the prompt. `--dry-run` leaves the config untouched.

### `verify` — validate config/repo selection

```bash
qui verify [--repo <repo>]
```

- Reports whether the selected repo (or the first repo) is configured and `connected`.
- `--ci` turns a not-connected repo into a non-zero exit (`9`, verify/diff mismatch).

### `diff` — minimal migration diff report

```bash
qui diff [--repo <repo>] [--ci]
```

- Currently a minimal report (config-only verification). A disconnected repo is reported as a pending change; with `--ci` that yields exit `9`.

### `add` — install components into `targetPath`

```bash
qui add <component...>
qui add --all [<uilib>|<repo>/<uilib>]
```

- Without `--all`: at least one component spec is required (`button`, `web/button`, …); `--repo` selects/forces the source repo.
- With `--all`: install everything in scope — no scope arg = the whole selected repo's `uilibs`; one scope arg `<uilib>` or `<repo>/<uilib>` narrows it. `--all` accepts at most one scope arg.
- Component dependencies from `meta.generated.json` are pulled in automatically; missing npm dependencies are installed (controlled by `--auto`/`--force` and `--on-error`).
- `--target-path` overrides the config target. `--dry-run` previews; already-installed components are skipped.

### `list` — resolve/preview components without installing

```bash
qui list <component...>
qui list --all [<uilib>|<repo>/<uilib>]
```

- Same selection rules as `add` (including dependency expansion), but it only prints the resolved fully-qualified keys (`<repo>/<uilib>/<slug>`) — nothing is written.

### `update` — overwrite installed components from source

```bash
qui update <component...>
qui update --all
```

- `--all` re-installs every installed component; it **cannot** be combined with explicit components.
- Without `--repo`, `--all` infers each component's source repo from its installed metadata. `--repo`, `--target-path`, and `--dry-run` behave as in `add`.

### `remove` — delete installed components

```bash
qui remove <component...>
qui remove --all --repo <repo>
```

- `--all` removes every installed component and **requires** `--repo`; it cannot be combined with explicit components.
- Removing a component that others depend on is blocked unless `--force` (or `--on-error warn`). Unused npm dependencies are uninstalled. `--target-path` / `--dry-run` supported.

### `generate` — regenerate component metadata

```bash
qui generate
```

- Regenerates `meta.generated.json` for every component under `targetPath` (from `index.tsx`/`index.ts`) and ensures `@qwik-ui/headless` is listed when imported. `--target-path` / `--dry-run` supported.

### `generate-demo` — build demo routes

```bash
qui generate-demo [<slug>...]
```

- Syncs `templates/demo`, runs `add --all qui-demo` and `add --all base`, then generates demo routes under `src/routes/<route-base>/components/...`.
- `--route-base` sets the route segment (default `/qui-demo`). Optional positional slugs limit which components get routes. `--target-path` / `--dry-run` supported.

### `clone` — copy an installed component under a new name

```bash
qui clone <source-component> <new-component>
```

- Requires exactly two positionals. The source must already be installed in `targetPath`. Copies the directory, rewrites references/`@component`, and records clone provenance in `meta.generated.json`.
- `--force` overwrites an existing target; `--repo` / `--target-path` / `--dry-run` supported.

### `push` — publish modified components back to a remote

```bash
qui push --repo <repo>/<uilib> <component...>
```

- `--repo` is **required** and must be `<repo>/<uilib>` (exactly one slash); at least one component is required.
- The repo URL must be a real git remote (`https`/`ssh`/`git@`) — `file://` is rejected. Component metadata is validated against the configured repo/url.
- `--base-branch <branch>` and `--branch <name>` control the push branch; `--title <msg>` sets the commit message (default `qui push: <components>`). `--dry-run` previews the workflow.

## `qui.config.json` (schema `qui-config/v1`)

The CLI works against the configuration in the app root:

```json
{
  "configSchemaVersion": "qui-config/v1",
  "targetPath": "src/components/ui",
  "repos": {
    "local-dev": {
      "url": "file://../",
      "componentsRoot": "components",
      "uilibs": ["base"],
      "connected": true
    }
  }
}
```

Notes:

- `targetPath` must be a relative path.
- `repos.<name>.url` supports `file://`, `http(s)://`, `ssh://` and `git@...`.
- Source selection happens via `--repo <repo>` or `--repo <repo>/<uilib>` (for `push`, `<repo>/<uilib>` is required).
- Each `repo` may contain multiple `uilib`s (the `repos.<name>.uilibs` array).

## Repo vs ui-lib + component lookup

- A `repo` is a source Git repository (where components are read from).
- A `uilib` is a namespace/set of components inside a single repo (e.g. `base`, `web`).
- When you call `qui add button` without `--repo`, the CLI uses the first repo in the config and, within it, the first `uilib` where the component is found.
- When you call `qui add web/button`, the component is looked up directly in the `uilib` `web` (within the selected repo).
- When you call `qui add --repo mycommon web/button`, you specify both the repo (`mycommon`) and the `uilib` (`web`).
- During `add`, the dependencies from `meta.generated.json` (`dependencies` and `npmDependencies`) are added automatically.
- The same principle for specifying components (`button` vs `web/button`) and selecting the source (`--repo`) also applies to `update` and `remove`.

## `base`, `qui-demo` and the generated demo app

- **`base`** is the foundational `uilib` (shadcn-style components) — other sets (`qui-demo`, your own `uilib`) are expected to build on it. For a **full reference demo** it therefore makes sense to have the **entire `base`** in the target app (not just a subset).
- **`qui-demo`** contains supporting components for the generated demo (layout, example index, etc.) and **depends on `base`**. In a given repo's `qui.config.json`, both namespaces therefore belong in `repos.<name>.uilibs`, e.g. `["base", "qui-demo"]`.
- **`templates/demo`** (in this repo, next to the package root) is not a "finished demo app" but the **inputs for the CLI** — `generate-demo` assembles files in the target Qwik app from them.
- **`generate-demo`** creates demo routes and examples from the components already added in `targetPath`; the **example texts** come from the components' **JSDoc** (where the generator supports it).

### Typical sequence: init → all components for the demo → generate-demo

1. **`qui init`** — `qui.config.json` + syncing templates into the app (see `init` above).
2. **`qui add --repo <repo> --all`** — adds **all** components from **all** `uilib`s listed for that repo in the config. For a demo with the full `base` and the shell from `qui-demo`, first set `uilibs` to both `base` and `qui-demo`, then run `add --all`. **The `--repo` flag is required** (without it, `--all` will not run). Alternative: add only selected components, e.g. `qui add button input`.
3. **`qui generate-demo`** — e.g. with `--route-base /qui-demo` generates/updates the demo routes for the already-installed components.

To keep things clear, the **canonical CLI commands** remain here; optional npm scripts (e.g. regenerating the example app with a single command) may wrap these steps **only for development in this repository** — see [CONTRIBUTING.md](CONTRIBUTING.md).

## Most common examples

```bash
# 1) Initialize config
npx qui init --repo local-dev --url file://../ --target-path src/components/ui

# 2) Connect remote repo
npx qui connect --repo acme --url https://github.com/acme/ui-kit.git

# 3) Add/update/remove components
npx qui add button accordion
npx qui update --all
npx qui remove accordion

# 4) Metadata + demo routes
npx qui generate
npx qui generate-demo --route-base /qui-demo

# 5) Verify / diff
npx qui verify --repo acme
npx qui diff --repo acme --ci
```

## Global flags

All flags are parsed globally (any command may accept them; each command uses the subset relevant to it).

**Boolean** (no value):

- `--auto` — non-interactive "auto" policy (e.g. auto-install npm deps, write `*-template` on config conflict).
- `--force` — force/overwrite; sets policy to non-interactive `warn`, forces npm install/overwrite.
- `--yes` — assume "yes" for confirmations (overwrite on conflict).
- `--dry-run` — preview only; no files/config/git changes are written.
- `--all` — operate on the whole scope (see `add`/`list`/`update`/`remove`).
- `--ci` — turn a `verify`/`diff` mismatch into a non-zero exit code.
- `--json` — emit a single JSON report envelope on stdout.

**Value** (consume the next token):

- `--on-error <ask|warn|fail>` — conflict/error policy (default `ask`).
- `--repo <repo|repo/uilib>` — source selector (`push` requires `<repo>/<uilib>`).
- `--url <url>` — repo URL (`init`/`connect`); supports `file://`, `http(s)://`, `ssh://`, `git@…`, and `…#<ref>`.
- `--target-path <path>` — override the configured `targetPath`.
- `--components-root <dir>` — repo's components root (default `components`).
- `--uilibs <a,b,c>` — comma-separated uilib list.
- `--connected <true|false>` — mark a repo connected (default `true`).
- `--base-branch <branch>` / `--branch <name>` / `--title <msg>` — `push` branch/commit options.
- `--route-base </segment>` — `generate-demo` route base (default `/qui-demo`).
- `--components-dir <dir>` / `--routes-dir <dir>` — generator path overrides.
- `--ref <ref>` — **rejected**; encode the ref in `--url` as `<git-url>#<ref>` instead.

### Exit codes

`0` success · `1` unexpected runtime error · `2` usage/parser error · `3` config/schema error · `4` source/git/network error · `5` policy fail-stop · `6` user rejected plan · `7` scope safety violation · `8` dependency install error · `9` verify/diff mismatch.

## Scripts in this repository

In the root `package.json`:

- `npm run qui -- ...` — runs the `qui` CLI (`node ./bin/qui.js`).
- `npm test` — CLI tests (`test/*.test.js`).
- `npm run generate-meta` — regenerates `meta.generated.json` for the sources in `./components`.
- `npm publish` — publishes the `qui-client` package (the tarball contents are controlled by the `files` field in `package.json`).

## Related docs

- [CONTRIBUTING.md](CONTRIBUTING.md)
- [CLAUDE.md](CLAUDE.md)
- [docs/CLI_MIGRATION.md](docs/CLI_MIGRATION.md)
- [docs/MIGRATION_FROM_LEGACY_CLI.md](docs/MIGRATION_FROM_LEGACY_CLI.md)
- [docs/QUI_CLIENT.md](docs/QUI_CLIENT.md)
