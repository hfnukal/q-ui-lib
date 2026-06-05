# Changelog

All notable changes to `qui-client` are documented here. For the full CLI contract (exit codes, JSON report schema, flags), see [docs/CLI_MIGRATION.md](https://github.com/honzicekdev/q-ui-lib/blob/main/docs/CLI_MIGRATION.md).

## 0.1.3

### Added

- **Programmatic API** — import `qui-client` as a library (`require("qui-client")` / `import … from "qui-client"`) and call commands without spawning the `qui` binary.
- Entry points: `src/index.js` (runtime), `src/index.d.ts` (TypeScript types), `src/api.js` (`createContext`, `runCommand`, `runArgv`).
- Exported `run*` functions for every built-in command (`runAdd`, `runList`, `runInit`, …) plus `parseArgv`, `createReport`, `printReport`, `EXIT_CODES`.
- `package.json`: `"main"`, `"types"`, and `"exports"` for the library entry (binary `qui` unchanged).
- Tests: `test/api.test.js`.
- Docs: programmatic API section in [README.md](README.md) and [CONTRIBUTING.md](CONTRIBUTING.md).

### Changed

- `src/cli.js` delegates command dispatch to `src/api.js`; `process.exit` remains only in the binary entry.

## 0.1.2

### Added

- **`npmDevDependencies`** in `meta.generated.json` — npm packages needed only as dev dependencies (e.g. imports from auxiliary component files, or packages listed in the app’s `devDependencies`).
- Metadata generator (`scripts/generate-meta.mjs`) classifies npm imports by the app `package.json` section (`dependencies` vs `devDependencies`) and writes `npmDependencies` / `npmDevDependencies` accordingly.
- **`add` / `update`** install missing `npmDevDependencies` with `--save-dev` (pnpm/yarn/bun: `-D`).
- **`remove`** uninstalls orphaned `npmDevDependencies` the same way as runtime `npmDependencies`.
- **`init`** — explicit mode helpers (`resolveInitMode`, `collectInitWarnings`, `hasQwikConfigFile`) and clearer warnings when `qui-client` is installed before Qwik exists, or when `qwik.config.*` is missing.
- Tests: expanded `test/init-smoke.test.js` for init mode/warning behaviour.

### Changed

- **`init` mode detection** — `qwik_sync_templates` requires an existing `qui.config.json` (not merely `qui-client` in `package.json`); existing Qwik apps without config use `qwik_bootstrap` even when `qui-client` is already a devDependency.
- **`dependency-graph`**, **`component-catalog`**, **`component-diff`** — account for `npmDevDependencies` in resolution and diff output.
- **`generate`** — simplified npm metadata handling; ensures `ts-morph` stays in `npmDevDependencies` when needed.
- Regenerated **`meta.generated.json`** for all `base` and `qui-demo` components.
- Docs: `npmDevDependencies` described in [CONTRIBUTING.md](CONTRIBUTING.md), [docs/META_GEN.md](docs/META_GEN.md), [docs/REGISTRY.md](docs/REGISTRY.md), [README.md](README.md), [docs/CLI_MIGRATION.md](docs/CLI_MIGRATION.md).

## 0.1.0

Initial published shape of the standalone CLI (historically under `packages/qui-client`; **canonical source is now the repository root**).

### Added

- Binary `qui` (`bin/qui.js`) implementing commands: `init`, `connect`, `verify`, `diff`, `add`, `update`, `remove`, `generate`, `generate-demo`, `clone`, `push`.
- Config schema **`qui-config/v1`** (`qui.config.json`): `targetPath`, `repos{ url, componentsRoot, uilibs, connected }`, optional `policy`.
- JSON output **`qui-report/v1`** via `--json`.
- `generate` runs embedded **`generate-meta.mjs`** (ts-morph) against `targetPath`.
- `--dry-run` where applicable (including **`connect`**: no config write; duplicate repo + `onError=ask` skips prompt in dry-run).
- Tests: `npm test` from the package root (repository root in this monorepo).

### Package metadata

- `repository`, `bugs`, `homepage`, `keywords`, `engines` (Node `>=18`) for npm.

### Breaking vs older monorepo CLI (`cli/index.js`)

- Configuration is **repos-only**; there is **no** `root` / `defaultRepo` object as in older design docs.
- Git ref must be passed as **`url#ref`**, not `--ref`.
- Behaviour and exit codes follow [docs/CLI_MIGRATION.md](https://github.com/honzicekdev/q-ui-lib/blob/main/docs/CLI_MIGRATION.md), not legacy Commander-based `cli/index.js` (removed from this repo).
