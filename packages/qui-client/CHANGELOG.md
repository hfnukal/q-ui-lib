# Changelog

All notable changes to `qui-client` are documented here. For the full CLI contract (exit codes, JSON report schema, flags), see the monorepo document [docs/CLI_MIGRATION.md](https://github.com/honzicekdev/q-ui-lib/blob/main/docs/CLI_MIGRATION.md).

## 0.1.0

Initial published shape of the standalone CLI (`packages/qui-client`).

### Added

- Binary `qui` (`bin/qui.js`) implementing commands: `init`, `connect`, `verify`, `diff`, `add`, `update`, `remove`, `generate`, `generate-demo`, `clone`, `push`.
- Config schema **`qui-config/v1`** (`qui.config.json`): `targetPath`, `repos{ url, componentsRoot, uilibs, connected }`, optional `policy`.
- JSON output **`qui-report/v1`** via `--json`.
- `generate` runs embedded **`generate-meta.mjs`** (ts-morph) against `targetPath`.
- `--dry-run` where applicable (including **`connect`**: no config write; duplicate repo + `onError=ask` skips prompt in dry-run).
- Tests: `npm test` in package; from monorepo root: `npm run test:qui-client`.

### Package metadata

- `repository`, `bugs`, `homepage`, `keywords`, `engines` (Node `>=18`) for npm.

### Breaking vs older monorepo CLI (`cli/index.js`)

- Configuration is **repos-only**; there is **no** `root` / `defaultRepo` object as in older design docs.
- Git ref must be passed as **`url#ref`**, not `--ref`.
- Behaviour and exit codes follow [docs/CLI_MIGRATION.md](https://github.com/honzicekdev/q-ui-lib/blob/main/docs/CLI_MIGRATION.md), not legacy Commander-based `cli/index.js`.
