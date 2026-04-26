# CLAUDE.md — qui-client (monorepo root)

**What:** This repository root **is** the npm package **`qui-client`**: the **`qui`** CLI plus canonical Qwik UI **source components** under `components/`. Apps install copies into a configured `targetPath` via `qui add` / `qui update` / … — not a traditional publishable UI-only npm. Styling: Tailwind + tokens ([COLORS.md](./COLORS.md)). Behavior: prefer `@qwik-ui/headless` where it fits ([docs/BASE_COMPONENTS.md](./docs/BASE_COMPONENTS.md), [CREATE.md](./CREATE.md)).

**Layout**

- **`components/<uilib>/<slug>/`** — each component: `index.tsx` (or `index.ts`), `meta.generated.json` (generated). Example: `components/base/button/`.
- **`components/base/utilities/`** — shared helpers used by base components (not a separate top-level `components/utilities/` in the current tree).
- **`bin/`**, **`src/`**, **`scripts/`**, **`templates/`** — canonical CLI (`qui`); tests under `test/`; `scripts/generate-meta.mjs`.
- **`packages/qui-feature/`** — Qwik starter feature (Tailwind v4, tokens); `qui init` can add it as a `file:` devDependency when present in this monorepo layout.

**Commands** (repo root)

```bash
# Run qui (same entry as npx qui after npm i -D qui-client)
npm run qui -- <command> [options]
```

`qui` expects **`qui.config.json`** in the **current working directory** (typically your app root, e.g. `cd demo` before `update` / `add`).

```bash
npm test
npm publish
```

**Metadata (`meta.generated.json`)** on library sources under `components/`:

```bash
npm run generate-meta
```

In a consumer app (cwd = app with `qui.config.json`): `qui generate`.

**Creating or updating components** — workflow, headless pitfalls, metadata rules: **[CREATE.md](./CREATE.md)**. Metadata pipeline details: **[docs/META_GEN.md](./docs/META_GEN.md)** (the wired script is `generate-meta` at repo root). Registry / API tree: **[docs/REGISTRY.md](./docs/REGISTRY.md)**.

**CLI / config contract:** [README.md](./README.md), [docs/CLI_MIGRATION.md](./docs/CLI_MIGRATION.md), [docs/MIGRATION_FROM_LEGACY_CLI.md](./docs/MIGRATION_FROM_LEGACY_CLI.md).

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
