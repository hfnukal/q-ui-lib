# qui-client

**`qui`** is a tool for managing UI components in Qwik apps. It copies components as **source code** into your project, keeps them in sync with upstream Git repositories, and helps you maintain your own component libraries — shared openly or privately on your own Git hosting.

The npm package **`qui-client`** ships the CLI plus this repository’s canonical component sources under **`components/`** (the default **`base`** ui-lib).

**Live demo:** [q-ui-lib.vercel.app/qui-demo](https://q-ui-lib.vercel.app/qui-demo) — browse components, theme editor, and examples.

## What you can do

| Goal | How |
|------|-----|
| Start from a proven base set | Connect the **base** repository (shadcn-style Qwik components built on `@qwik-ui/headless`) and `qui add` what you need |
| Compose your own components | Install primitives, then **`qui clone`** or edit copies under `targetPath`; regenerate metadata with **`qui generate`** |
| Run your own design system | Create a Git repo with one or more **`uilib`** namespaces, **`qui connect`**, and share it internally or as open source |
| Stay up to date with upstream | **`qui diff`** / **`qui update`** pull changes from configured repos (`https`, `ssh`, or `file://`) |
| Contribute fixes upstream | **`qui push`** opens a branch and GitHub PR (via `gh`) when you improve a component in a remote source repo |

Multiple **repos** and **ui-libs** can live in one `qui.config.json` — for example the public **base** set plus your company’s `web` or `brand` library.

## Why qui

- **Source in your app** — components live under `targetPath` (e.g. `src/components/ui`); you own the files and can customize freely.
- **Git-native workflow** — sources are ordinary repositories; refs and remotes are part of `repos.<name>.url`.
- **Dependency-aware installs** — `meta.generated.json` tracks component and npm dependencies; `add` / `update` resolve them automatically.
- **Fork-friendly** — clone, rename, and combine existing pieces without losing traceability to upstream.

## Quick start

**New app** — use an empty directory; do not run `npm i qui-client` first (init scaffolds Qwik and adds config):

```bash
mkdir my-app && cd my-app
npx qui-client@latest init
npx qui-client add button input
```

**Existing Qwik app** — from the app package root:

```bash
npx qui-client@latest init
npx qui-client add button input
```

The npm package is **`qui-client`**; the CLI command is **`qui`**. Use `npx qui-client@latest …` without a local install, or `npx qui …` after `npm i -D qui-client` (init adds it for new apps). `qui.config.json` marks a project as initialized—having `qui-client` in `package.json` alone does not.

**Monorepo** — scaffold into a subfolder (keeps the repo root separate):

```bash
npx qui-client@latest init apps/web
cd apps/web && npx qui add button input
```

Point at a local clone when developing this monorepo (from the repository root):

```bash
npm run qui -- init --repo local-dev --url file://../ --target-path src/components/ui
```

Typical next steps: **`qui connect`** additional repos, **`qui list`** / **`qui diff`**, **`qui update`** when upstream changes, **`qui push`** when you want to send fixes back.

Full command reference, config schema, and maintainer scripts: **[CONTRIBUTING.md](CONTRIBUTING.md)**.

## Components

Each component lives in one folder under a **ui-lib** namespace:

```text
components/<uilib>/<slug>/     # source repo (e.g. components/base/button/)
<targetPath>/<uilib>/<slug>/  # after qui add (e.g. src/components/ui/base/button/)
```

| File | Role |
|------|------|
| `index.tsx` | Qwik implementation (`component$` or compound `export const X = { Root, … }`) |
| `meta.generated.json` | Generated metadata (props, dependencies, `apiTree`) — run `qui generate`, do not edit by hand |

### Standard Qwik component

- Prefer **`@qwik-ui/headless`** where it fits; otherwise semantic HTML + ARIA.
- Export a typed props interface in the **same file** when you want props documented in metadata (see [CREATE.md](CREATE.md), [docs/META_GEN.md](docs/META_GEN.md)).
- Style with design tokens from [COLORS.md](COLORS.md) (Tailwind classes tied to the token set).
- **Compound** components export one object with PascalCase parts (`Tabs.Root`, `Tabs.List`, …); part names drive the generated `apiTree`.

### Documentation and examples (JSDoc)

The **leading** `/** … */` block on `index.tsx` feeds the demo generator and human docs:

| Tag | Purpose |
|-----|---------|
| `@component` | Slug (leaf folder name, e.g. `button`) |
| `@title` | Page heading in the demo |
| `@version` | Version string stored in metadata |
| `@description` | Optional intro under the title |
| `@example <title>` | Section title, short prose, then a fenced **tsx** code block with runnable JSX |

Multiple `@example` blocks become separate sections (live preview + code tabs). See [components/base/button/index.tsx](components/base/button/index.tsx) for a full pattern.

After changing source or installed copies, regenerate metadata and (in an app) demo routes:

```bash
qui generate
qui generate-demo
```

## Demo

The **live component browser** (e.g. [q-ui-lib.vercel.app/qui-demo](https://q-ui-lib.vercel.app/qui-demo)) is built from **installed** components under `targetPath`, not directly from the library git tree.

1. **`qui add`** copies components into `targetPath/<uilib>/<slug>/`.
2. **`qui generate-demo`** scans each `index.tsx`, parses the top JSDoc (`@title`, `@description`, `@example`), and writes Qwik City routes under `src/routes/<route-base>/components/…` (default route base **`/qui-demo`**).
3. Generated pages import the real component and render each example with **`CodeExample`** / **`TabExample`** / **`TabCode`** (from the `qui-demo` ui-lib, installed via the same CLI).

```bash
# App root (directory with qui.config.json)
qui add button tabs
qui generate-demo
qui generate-demo button          # only listed slugs
qui generate-demo --route-base /docs/ui
```

Stale routes for removed components are pruned on the next run. Details: [UI_TEST.md](UI_TEST.md), `scripts/generate-demo.mjs`.

## QUI syntax

General shape (run from the app root that contains `qui.config.json`):

```bash
qui <command> [positionals...] [--flags]
npx qui-client@latest <command> …   # without a local install
```

**Component spec:** `button` or `base/button` (optional `repo/uilib/slug` when multiple sources are configured). See [CONTRIBUTING.md](CONTRIBUTING.md) for flags (`--repo`, `--force`, `--yes`, `--dry-run`, `--json`, …).

| Command | What it does | Example |
|---------|----------------|---------|
| `init` | Scaffold Qwik (empty dir), or add `qui.config.json` + app templates | `npx qui-client@latest init` · `qui init apps/web` |
| `connect` | Register or remove source repos / ui-libs in config | `qui connect https://github.com/acme/ui.git acme --all` · `qui connect --remove acme --yes` |
| `add` | Copy components into `targetPath` (+ deps) | `qui add button base/tabs` · `qui add --all base` |
| `update` | Refresh installed copies from remote | `qui update button --yes` · `qui update --all base` |
| `remove` | Delete local installs | `qui remove base/button` · `qui remove --all base --yes` |
| `list` | Browse repos, ui-libs, install status | `qui list` · `qui list base/button` |
| `diff` | Compare install vs source (read-only) | `qui diff` · `qui diff base/button --ci` |
| `verify` | Check config / repo connectivity | `qui verify --repo quibase` |
| `generate` | Regenerate `meta.generated.json` under `targetPath` | `qui generate` |
| `generate-demo` | Build demo routes from JSDoc | `qui generate-demo` |
| `clone` | Fork an installed component under a new name | `qui clone base/button base/icon-button` |
| `push` | Push local changes back to a git remote (PR via `gh`) | `qui push base/button --title "fix: button focus"` |
| `route` | Copy a uilib route pack into `src/routes` | `qui route quibase/base/routescomp` |
| `template` | Copy a uilib template pack into `src` | `qui template quibase/base/mytemplate` |
| `install` | Run `init`, then apply a `manifest.json` (config + components + templates + routes) | `qui install manifest.json` · `qui install manifest.json --no-init` |
| `export` | Write `manifest.json` from the current project | `qui export` · `qui export components button` |
| `register` | Register a local uilib under `targetPath` with a connected repo | `qui register quibase/myuilib/` |

Config file: **`qui.config.json`** (`targetPath`, `repos.<name>.url`, `uilibs`, …). Git refs belong in the URL: `https://…/repo.git#main`.

### Routes and templates in source repos

Within a ui-lib, use **separate folder names** for installable components vs route/template packs:

```text
# Installable component (qui add / update / remove)
components/<uilib>/<slug>/
  index.tsx          # or index.ts — required for CLI discovery
  meta.generated.json
  helper.ts          # optional co-located modules (copied with the component)

# Route or template pack only (qui route / qui template — not a component)
components/<uilib>/<pack-folder>/
  routes/            # Qwik City routes (route command)
    index.tsx
    layout.tsx
    [slug]/index.tsx
  template/          # app scaffolding files (template command)
    ...
```

**Do not put `index.ts(x)` at the root of a pack-only folder.** The CLI treats any directory with a root `index.ts` or `index.tsx` as a component (`list`, `add --all`, dependency expansion). `add` / `update` copy the **entire** directory into `targetPath`, so a root index would also pull `routes/` and `template/` into `src/components/…` — the wrong place. Reference pack folders only from manifest `templates[]` / `routes[]` or explicit `qui template` / `qui route` specs (e.g. `quibase/base/app`, `quibase/qui-demo/demo`).

If you need both a UI component and a demo route pack, use two folders (e.g. `demo-layout` + `demo`) or rely on **`qui generate-demo`** for generated demo routes from installed components.

- **`qui route <repo>/<uilib>/<folder>`** copies `routes/` into `src/routes` (optional subpath, e.g. `.../routescomp/[slug]`).
- **`qui template <repo>/<uilib>/<folder>`** copies `template/` into `src/`.
- On overwrite conflicts, both commands offer the same choices as component updates: overwrite, save as `*-template*`, diff, or skip.

### Manifest install / export

Use a **`manifest.json`** to reproduce or share a full setup:

```json
{
  "schemaVersion": "qui-manifest/v1",
  "config": { "...": "qui.config.json contents" },
  "components": ["base/", "qui-demo/codeexample", "button"],
  "templates": ["quibase/base/mytemplate"],
  "routes": ["quibase/base/routescomp", "quibase/base/routescomp/[slug]"]
}
```

- **`qui install <manifest.json> [<path>]`** — runs **`qui init`** first (Qwik scaffold in an empty dir, `templates/app`, `qui-client`), then writes manifest `config` and runs `add` / `template` / `route` for each entry (`<path>` defaults to `.`). Use **`--no-init`** to skip the init step.
- **`qui export [components] [templates] [routes] [filters…]`** — creates `manifest.json`; trims `config.repos` to only repositories referenced in the manifest.

## Programmatic API

Besides the `qui` binary, **`qui-client`** exposes the same commands as importable functions — useful for a custom CLI (`myqui`) or automation without spawning a subprocess.

```js
const { createContext, runAdd, printReport } = require("qui-client");

const report = await runAdd(
  createContext({
    cwd: "/path/to/app", // directory with qui.config.json
    positionals: ["button", "input"],
    flags: { yes: true, auto: true },
  })
);

printReport(report);
process.exit(report.exitCode);
```

Or parse argv like the binary: `runArgv(["add", "button", "--yes"], { cwd })`.

TypeScript consumers get types from `src/index.d.ts` (`import { runList } from "qui-client"`). Full reference: **[CONTRIBUTING.md — Programmatic API](CONTRIBUTING.md#programmatic-api-requirequi-client)**.

## Inspiration

Thanks to **[Qwik UI](https://qwikui.com/)** (headless primitives and patterns) and **[shadcn/ui](https://ui.shadcn.com/)** (copy-into-your-app, own-the-source model) for ideas that shaped **qui** and the **base** component set.

## Related docs

- [CONTRIBUTING.md](CONTRIBUTING.md) — CLI reference, programmatic API, `qui.config.json`, local development, demo deploy
- [docs/Q_UI_LIB.md](docs/Q_UI_LIB.md) — architecture overview
- [docs/CLI_MIGRATION.md](docs/CLI_MIGRATION.md) — CLI contract and migration notes
- [CREATE.md](CREATE.md) — creating and updating components in a source repo
