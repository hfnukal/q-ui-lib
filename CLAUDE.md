# CLAUDE.md — q-ui-lib

**What:** Qwik UI components + CLI **`qui`** shipped as the npm package **`qui-client`**. Apps install sources into a configured `targetPath` via `qui add` / `qui update` / … — not a traditional publishable UI npm. Styling: Tailwind + tokens ([COLORS.md](./COLORS.md)). Behavior: prefer `@qwik-ui/headless` where it fits ([docs/BASE_COMPONENTS.md](./docs/BASE_COMPONENTS.md), [CREATE.md](./CREATE.md)).

**Layout**

- **`components/<uilib>/<slug>/`** — each component: `index.tsx` (or `index.ts`), `meta.generated.json` (generated). Example: `components/base/button/`.
- **`components/base/utilities/`** — shared helpers used by base components (not a separate top-level `components/utilities/` in the current tree).
- **`packages/qui-client/`** — canonical CLI (`qui`); tests and `scripts/generate-meta.mjs`.
- **`demo/`** — Qwik workspace used as a sample app; synced UI under `demo/src/components/ui/…`.
- **`template/`** — optional workspace; **`cli/index.js`** — legacy Commander flow still present for older workflows; new work should use **`qui-client`**.

**Commands** (repo root unless noted)

```bash
# Run qui from PATH (workspace installs devDependency qui-client)
npm run qui -- <command> [options]
```

`qui` expects **`qui.config.json`** in the **current working directory** (typically your app root, e.g. `cd demo` before `update` / `add`).

```bash
npm run test:qui-client
npm run publish:qui-client
```

**Metadata (`meta.generated.json`)** on library sources under `components/`:

```bash
npm run generate-meta -w qui-client
```

In a consumer app (cwd = app with `qui.config.json`): `qui generate`.

**Creating or updating components** — workflow, headless pitfalls, metadata rules: **[CREATE.md](./CREATE.md)**. Metadata pipeline details: **[docs/META_GEN.md](./docs/META_GEN.md)** (some npm names there may still say `generate:meta`; the wired script is `generate-meta` in `qui-client`). Registry / API tree: **[docs/REGISTRY.md](./docs/REGISTRY.md)**.

**CLI / config contract:** [README.md](./README.md), [docs/CLI_MIGRATION.md](./docs/CLI_MIGRATION.md), [docs/MIGRATION_FROM_LEGACY_CLI.md](./docs/MIGRATION_FROM_LEGACY_CLI.md), [packages/qui-client/README.md](./packages/qui-client/README.md).

**Overview:** [docs/Q_UI_LIB.md](./docs/Q_UI_LIB.md).

---

### Token / context efficiency (for agents)

**Before reading**

- Open **only** files the task needs. Do not preload long docs or whole demo routes.
- Prefer **search** (`grep`, codebase search), then read a **slice** of a file (`offset`/`limit`).
- Component work: **[CREATE.md](./CREATE.md)** + `components/<uilib>/<slug>/index.tsx` first; open **docs/BASE_COMPONENTS.md** / **COLORS.md** when headless shape or tokens are unclear.

**While editing**

- **Smallest viable change** — no drive-by refactors or doc edits the user did not ask for.
- **Reply:** diffs or short snippets; link paths instead of dumping whole files.

**Avoid unless necessary**

- Reading `meta.generated.json` in full — use when changing the metadata pipeline or public API surface.
- Re-reading the same file in one turn without edits.
- Images, logs, build artifacts, lockfiles.

**Default reply style:** short and task-shaped; long explanations only if the user asks.
