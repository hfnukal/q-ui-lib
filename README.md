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

Current commands:

- `init` - creates/updates `qui.config.json` and syncs the app template files.
- `connect` - adds or edits repositories in `qui.config.json`.
- `verify` - verifies the configuration and the connection state of the selected repository.
- `diff` - currently a minimal diff report (migration status).
- `add` - adds components into `targetPath` and pulls in dependencies (including npm deps).
- `update` - overwrites installed components with a newer source.
- `remove` - removes components and, where applicable, drops unused npm dependencies.
- `generate` - regenerates `meta.generated.json` for components in `targetPath` (based on `index.tsx`/`index.ts`).
- `generate-demo` - syncs the demo template files and generates/updates demo routes in `src/routes/<route-base>/components/...` for the installed components.
- `clone` - clones a locally installed component under a new name.
- `push` - pushes modified components from the app back to the remote Git repository.

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

Global flags supported by the current parser:

- Bool: `--auto`, `--force`, `--dry-run`, `--yes`, `--json`, `--all`, `--ci`
- Value: `--on-error`, `--repo`, `--url`, `--target-path`, `--components-root`, `--uilibs`, `--connected`, `--base-branch`, `--title`, `--route-base`, `--branch`, `--routes-dir`, `--components-dir`

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
