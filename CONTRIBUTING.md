# Contributing to qui-client

Thanks for your interest in improving the project. **The root of this repository is the npm package `qui-client`** (the **`qui`** command): the CLI copies and synchronizes Qwik UI components from Git sources into an app; the canonical component sources for development live in **`components/`**.

Target usage and product overview: [README.md](README.md).

## License

The root `package.json` declares the **MIT** license. By contributing, you agree that your code will be distributed under the same terms (unless agreed otherwise in the PR).

## Local development

- **Node.js**: use the version your team uses for Qwik 1.x (an LTS release is a safe choice).
- **Install dependencies** (monorepo, workspaces):

  ```bash
  npm install
  ```

- **CLI from the monorepo** (same as `npx qui …` after installing `qui-client`):

  ```bash
  npm run qui -- <command> [options]
  ```

Every command except `init` reads **`qui.config.json`** from the **current working directory** (`init` creates it).

## Tests

Changes to the CLI should pass the tests:

```bash
npm test
```

End-to-end UI tests: `npm run test:e2e` (see [UI_TEST.md](UI_TEST.md)).

## Components and metadata

- Components typically live under `components/<uilib>/<name>/` (e.g. `components/base/button/`).
- The **`meta.generated.json`** file describes a component's dependencies; after changing props/dependencies keep it in sync:

  ```bash
  npm run generate-meta
  ```

  In a consumer app (cwd with `qui.config.json`): `qui generate`.

- Document new or significantly changed components in the PR (what changes for consumers of the library).

## Pull requests

1. **One topical change** per PR (easier to review and revert).
2. **PR description**: what it solves, why, how to verify (commands, manual steps for UI).
3. **Regression risks**: changes to the CLI or to the component structure can break an existing `qui.config.json` — for breaking changes, state this explicitly.

## Extending beyond the "core"

The library is designed so you can connect **multiple sources** (`repos`) and **`uilib`s** in `qui.config.json`. You can keep your own component sets in a separate repository and connect them via `qui connect`; this repo is mainly for shared components and the development of `qui-client`.

---

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

A **component spec** is either a bare slug (`button`) or a `uilib/slug` pair (`base/button`); see [Repo vs ui-lib + component lookup](#repo-vs-ui-lib--component-lookup).

### `init` — scaffold/initialize a project

```bash
qui init [dir]
```

- `[dir]` — optional project root (at most one; default `.`). An **empty** directory is scaffolded with `npm create qwik@latest` (empty template) + Tailwind.
- **Init modes** (auto-detected): empty dir → Qwik scaffold; Qwik without `qui.config.json` → bootstrap (config + templates, even if `qui-client` is already in `package.json`); Qwik with existing `qui.config.json` → template sync only; other non-empty dirs → config + templates with a warning if `qui-client` was installed before Qwik exists.
- Writes/updates `qui.config.json`, syncs `templates/app` into the project, and adds `qui-client` as a `file:` devDependency when missing (then runs `npm install`).
- Config defaults come from flags: `--repo` (default `quibase`), `--url` (default `https://github.com/hfnukal/q-ui-lib.git`), `--target-path` (default `src/components/ui`). Other repo fields (`componentsRoot`, `uilibs`, `connected`) use schema defaults in the written config.
- Existing-config conflict is resolved by policy/flags: `--force`/`--yes` overwrite, `--auto` writes a `qui.config-template.json`, `--on-error fail` aborts, `--on-error ask` (default) prompts interactively. `--dry-run` previews without writing.
- **Quick start:** prefer `npx qui@latest init` in an empty folder or `npx qui init apps/web` in a monorepo; avoid `npm i -D qui-client` before the first `init` on a greenfield root (a non-empty root without Qwik will not scaffold).

### `connect` — add, update, or remove repos in config

**Connect** (discover source repos and write `repos.*` entries):

```bash
qui connect <url> [repo [...uilibs]] [--all] [options]
```

- `<url>` — `file://…`, git clone URL (`https://…`, `git@…`, `ssh://…`), or GitHub/GitLab tree permalink. Optional ref: `<url>#<branch|tag|commit>`.
- Discovers repo candidates under the URL (`--search-levels`, default `2`) and their uilibs. Interactive TTY prompts for repo/uilib when omitted; non-interactive mode requires explicit `[repo]`, uilib names, or `--all`.
- **`qui connect <url> <repo> <uilib…>`** — merges uilibs into an existing repo entry (no overwrite prompt); new uilib names are appended.
- **`qui connect <url> <repo> --all`** — merges all discovered uilibs for that repo.
- Writes `url`, `componentsRoot`, `uilibs`, and `connected` (`--connected`, default `true`) into `qui.config.json`. Does **not** install components — use `add` / `update` for that.
- Overwriting an existing repo (interactive selection) follows `--on-error` (`ask` default / `warn` / `fail`); `--force`/`--auto`/`--yes` skip the prompt. `--dry-run` leaves the config untouched.

**Remove** (edit config only — does not delete installed files under `targetPath`):

```bash
qui connect --remove <repo> [uilib...] [--yes]
```

- **`--remove <repo>`** — delete the entire `repos.<repo>` entry.
- **`--remove <repo> <uilib…>`** — remove uilib(s) from the repo; if none remain, the repo entry is removed.
- Prints what will be removed and asks for confirmation unless `--yes` (also `--auto` / `--force`).

See [src/commands/connect.md](src/commands/connect.md) for discovery rules and JSON report shape.

### `verify` — validate config/repo selection

```bash
qui verify [--repo <repo>]
```

- Reports whether the selected repo (or the first repo) is configured and `connected`.
- `--ci` turns a not-connected repo into a non-zero exit (`9`, verify/diff mismatch).

### `diff` — compare installed components with remote source

```bash
qui diff [[<repo>/][<uilib>/]<component|uilib|repo>...] [--repo <repo|repo/uilib>] [--ci] [--json]
```

- Read-only: compares files under `targetPath` with the matching component in the configured source repo (`file://` or git clone from `repos.<name>.url`).
- Each positional can be a **component** (`hero`, `web/hero`), a **uilib** (`web`), or a **repo** (`componentsextra`). Multiple positionals are supported.
- With **no positional**, diffs every installed component (optionally filtered by `--repo <repo>` or `--repo <repo>/<uilib>`).
- Resolves the local install when present; otherwise looks up the component in the remote catalog (reported as `add`). When `<repo>/` or `<uilib>/` is omitted, the source repo is inferred from installed metadata (`registry` / uilib); `--repo` disambiguates a bare slug.
- Prints a unified diff per changed component (`git diff --no-index`). With `--json`, returns `qui-report/v1` items: `component`, `action` (`add|update|remove|noop`), `files[]` (`path`, `changeType`), and `dependencies`.
- A disconnected repo is reported as a pending change. `--ci` exits `9` when any component differs from remote (or the repo is disconnected).

### `add` — install components into `targetPath`

```bash
qui add <component...>
qui add --all [<uilib>|<repo>/<uilib>]
```

- Without `--all`: at least one component spec is required (`button`, `web/button`, …); `--repo` selects/forces the source repo.
- With `--all`: install everything in scope. **No scope arg** prompts interactively for repo and uilib(s). One scope arg `<uilib>` or `<repo>/<uilib>` narrows it. `--all` accepts at most one scope arg. In non-interactive mode, a scope is required.
- Component dependencies from `meta.generated.json` are pulled in automatically; missing npm dependencies are installed (controlled by `--auto`/`--force` and `--on-error`).
- `--target-path` overrides the config target. `--dry-run` previews; already-installed components are skipped.

### `list` — browse configured repos, uilibs, and components

```bash
qui list
qui list [<repo>]
qui list [<repo>/][<uilib>/][<component>]
qui list --all
qui list <repo> --all
```

- With **no arguments**, lists every configured repo (`[repo] …`).
- With **`<repo>`**, lists that repo's configured uilibs (`[lib] …`).
- With **`<repo>/<uilib>`**, lists source components in that uilib and whether each is already installed under `targetPath` (`[cmp] …  ✓|○`).
- A **component spec** (`button`, `web/button`, `myrepo/web/button`) lists that component and its install status.
- **`--all`** without a scope lists every component from every configured repo/uilib; **`--all`** with `<repo>` limits to that repo.
- **`--repo`** disambiguates a bare uilib name when it exists in multiple repos. Nothing is written to disk.

### `update` — overwrite installed components from source

```bash
qui update [<repo>/][<uilib>/][<component>...]
qui update --all [<uilib>|<repo>/<uilib>]
qui update <uilib>/ --all
```

- Component specs match `add` / `push`: bare slug (`hero`), `uilib/slug` (`web/hero`), or `repo/uilib/slug` (`componentsextra/web/hero`). Each named component must already be installed under `targetPath`.
- Source is resolved from configured repos (local `file://` or git clone); dependencies from `meta.generated.json` are refreshed automatically.
- **Confirmation:** every update prompts before overwriting — `[y] yes overwrite`, `[n] no`, or `[d] diff` (unified diff vs remote). Skipped only with `--yes` (also `--auto` / `--force`). Non-interactive runs without those flags exit `6`.
- **`--all`** updates every **installed** component in scope. No scope = all installed; `<uilib>` or `<repo>/<uilib>` (trailing `/` optional, e.g. `web/`) limits to that uilib.
- Without `--repo`, `--all` infers each component's source repo from its installed metadata. `--target-path` and `--dry-run` behave as in `add`.

### `remove` — delete installed components

```bash
qui remove <uilib>/<component>...
qui remove --all <uilib>
```

- Operates on **local installs only** (specs are `uilib/slug` paths under `targetPath`, not remote triples).
- `--all <uilib>` removes every installed component in that uilib. Prompts for confirmation unless `--yes` (also `--auto` / `--force`).
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
qui clone [<uilib>/]<source-component> [<uilib>/]<new-component>
```

- Requires exactly two positionals. Each path is relative to `targetPath` (the folder under `src/components/ui`, etc.). Use a bare slug when the component sits at the top level (`button` → `targetPath/button/`); use `<uilib>/<component>` when it is nested (`web/hero` → `targetPath/web/hero/`).
- Example: `qui clone web/hero web/hero1` copies `targetPath/web/hero/` to `targetPath/web/hero1/`.
- The source must already be installed at that path. Copies the directory, rewrites references/`@component`, and records clone provenance in `meta.generated.json`.
- `--force` overwrites an existing target; `--repo` / `--target-path` / `--dry-run` supported.

### `push` — publish modified components back to a remote

```bash
qui push [<repo>/][<uilib>/]<component...>
```

- At least one **installed** component spec is required. The CLI reads from `targetPath`, resolves the uilib, and maps it to the git repo that lists that uilib in `qui.config.json` (e.g. `hero` → `web/hero` → `componentsextra/components/web/hero` when `web` belongs to `componentsextra`).
- Component specs follow the same shape as `add` / `remove`: bare slug (`hero`), `uilib/slug` (`web/hero`), or `repo/uilib/slug` (`componentsextra/web/hero`). All components in one invocation must belong to the same `repo/uilib`.
- `--repo <repo>` or `--repo <repo>/<uilib>` optionally disambiguates when a uilib exists in multiple repos or to narrow bare-slug lookup.
- The target repo URL must be a real git remote (`https`/`ssh`/`git@`) — `file://` is rejected. Component metadata (`quiSource`) is validated against the resolved repo/url when present.
- Workflow: clone remote → create branch → copy files under `repos.<name>.componentsRoot/<uilib>/<component>/` → commit → push → open a GitHub PR via `gh pr create` when `gh` is available (otherwise prints a compare URL).
- `--base-branch <branch>` and `--branch <name>` control the push branch. `--title <msg>` sets the commit and PR title; in an interactive terminal, you are prompted when `--title` is omitted (default suggestion: `qui push: <components>`). `--dry-run` previews the workflow without pushing.

## `qui.config.json` (schema `qui-config/v1`)

The CLI works against the configuration in the app root:

```json
{
  "configSchemaVersion": "qui-config/v1",
  "targetPath": "src/components/ui",
  "repos": {
    "quibase": {
      "url": "https://github.com/hfnukal/q-ui-lib.git",
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
- Source selection happens via `--repo <repo>` or `--repo <repo>/<uilib>`. For `push`, the repo is usually inferred from the component's uilib; use `--repo` to disambiguate.
- Each `repo` may contain multiple `uilib`s (the `repos.<name>.uilibs` array).

## Repo vs ui-lib + component lookup

- A `repo` is a source Git repository (where components are read from).
- A `uilib` is a namespace/set of components inside a single repo (e.g. `base`, `web`).
- When you call `qui add button` without `--repo`, the CLI uses the first repo in the config and, within it, the first `uilib` where the component is found.
- When you call `qui add web/button`, the component is looked up directly in the `uilib` `web` (within the selected repo).
- When you call `qui add --repo mycommon web/button`, you specify both the repo (`mycommon`) and the `uilib` (`web`).
- During `add`, the dependencies from `meta.generated.json` (`dependencies`, `npmDependencies`, and `npmDevDependencies`) are added automatically.
- The same principle for specifying components (`button` vs `web/button`) and selecting the source (`--repo`) also applies to `update`, `remove`, and `push`.

## `base`, `qui-demo` and the generated demo app

**Live demo:** [https://q-ui-lib.vercel.app/qui-demo](https://q-ui-lib.vercel.app/qui-demo)

- **`base`** is the foundational `uilib` (shadcn-style components) — other sets (`qui-demo`, your own `uilib`) are expected to build on it. For a **full reference demo** it therefore makes sense to have the **entire `base`** in the target app (not just a subset).
- **`qui-demo`** contains supporting components for the generated demo (layout, example index, etc.) and **depends on `base`**. In a given repo's `qui.config.json`, both namespaces therefore belong in `repos.<name>.uilibs`, e.g. `["base", "qui-demo"]`.
- **`templates/demo`** (in this repo, next to the package root) is not a "finished demo app" but the **inputs for the CLI** — `generate-demo` assembles files in the target Qwik app from them.
- **`generate-demo`** creates demo routes and examples from the components already added in `targetPath`; the **example texts** come from the components' **JSDoc** (where the generator supports it).

### Typical sequence: init → all components for the demo → generate-demo

1. **`qui init`** — `qui.config.json` + syncing templates into the app (see `init` above).
2. **`qui add --all base`** (and `qui add --all qui-demo` when needed) — adds all components from the selected uilib(s). Without a scope, `add --all` prompts for repo and uilib interactively. Alternative: add only selected components, e.g. `qui add button input`.
3. **`qui generate-demo`** — e.g. with `--route-base /qui-demo` generates/updates the demo routes for the already-installed components.

### `demo/` is generated, not committed

The **`demo/`** Qwik app is a **local build artifact**. It is listed in `.gitignore` and is **not** part of the published git tree. Sources of truth are **`components/`**, **`templates/app`**, and **`templates/demo`**.

Regenerate it after pulling changes or when you need a fresh showcase:

```bash
npm run demo:prepare
# or the alias:
npm run qui:createdemo
cd demo && npm run dev
```

Browse component examples at [q-ui-lib.vercel.app/qui-demo](https://q-ui-lib.vercel.app/qui-demo) or locally at `/qui-demo/components/base/<slug>/` (default route base).

### Publish the demo to Vercel (manual, developer machine)

Deployment is **intentionally manual** — there is no automatic deploy on push to GitHub. A maintainer builds and publishes from a clone of this repo.

**Prerequisites:** [Vercel CLI](https://vercel.com/docs/cli) installed and logged in (`vercel login`). Link the project once from the repo root (`vercel link`) if you have not already.

| Script | Purpose |
|--------|---------|
| `npm run demo:prepare` | `qui init demo` + `add --all base` + `qui:addtest` + `generate-demo` |
| `npm run demo:build` | Prepare demo, add the Vercel Edge adapter (`qwik add vercel-edge`), install deps, run `qwik build` |
| `npm run demo:run` | Start [Vercel Dev](https://vercel.com/docs/cli/dev) for the `demo/` app (default http://localhost:3000) |
| `npm run demo:deploy` | `demo:build`, sync output to `.vercel/output`, then `vercel deploy --prebuilt --prod` |

```bash
# From the repository root (after npm install)
npm run demo:run    # local Vercel Dev (http://localhost:3000)
npm run demo:deploy # build + publish to production
```

Root **`vercel.json`** sets `buildCommand` to `npm run demo:build` and `outputDirectory` to `demo/.vercel/output` (Qwik Vercel Edge adapter output). The build reads components via `file://../` in generated `qui.config.json` and includes **`componenttest/`** uilibs via `qui:addtest`, so deploy from a **full monorepo clone**, not from the npm tarball alone.

> **Note:** Fix any `demo/` build blockers listed in [docs/KNOWN_ISSUES.md](docs/KNOWN_ISSUES.md) before deploying.

## Most common examples

```bash
# 1) Initialize (empty dir scaffolds Qwik; existing Qwik gets config + templates)
npx qui@latest init
# Monorepo: npx qui@latest init apps/web

# Monorepo dev: point at local clone instead
npx qui init --repo local-dev --url file://../ --target-path src/components/ui

# 2) Connect a source repo (discover + pick uilibs)
npx qui connect file://../ componentsextra app web
npx qui connect https://github.com/acme/ui-kit.git my-lib --all

# 2b) Remove a repo or uilib from config
npx qui connect --remove componentsextra app --yes

# 3) Add/update/remove/list components
npx qui add button accordion
npx qui list
npx qui list componentsextra/app
npx qui update hero
npx qui update web/hero --yes
npx qui update web/ --all
npx qui update --all --yes
npx qui remove accordion

# 4) Metadata + demo routes
npx qui generate
npx qui generate-demo --route-base /qui-demo

# 5) Push local changes back to a source repo
npx qui push hero
npx qui push web/hero --title "Fix hero spacing"

# 6) Verify / diff
npx qui verify --repo acme
npx qui diff hero
npx qui diff web/hero
npx qui diff componentsextra/web/hero
npx qui diff --repo componentsextra/web --ci
```

## Global flags

All flags are parsed globally (any command may accept them; each command uses the subset relevant to it).

**Boolean** (no value):

- `--auto` — non-interactive "auto" policy (e.g. auto-install npm deps, write `*-template` on config conflict).
- `--force` — force/overwrite; sets policy to non-interactive `warn`, forces npm install/overwrite.
- `--yes` — assume "yes" for confirmations (overwrite on conflict).
- `--dry-run` — preview only; no files/config/git changes are written.
- `--all` — operate on the whole scope (see `add`/`update`/`remove`; on `connect`, include all discovered uilibs for a repo; on `list`, enumerate all components).
- `--remove` — `connect` remove mode: drop a repo or uilib(s) from `qui.config.json`.
- `--ci` — turn a `verify`/`diff` mismatch into a non-zero exit code.
- `--json` — emit a single JSON report envelope on stdout.

**Value** (consume the next token):

- `--on-error <ask|warn|fail>` — conflict/error policy (default `ask`).
- `--repo <repo|repo/uilib>` — source selector; optional scope hint for `push` when a uilib exists in multiple repos.
- `--url <url>` — repo URL (`init` only); supports `file://`, `http(s)://`, `ssh://`, `git@…`, and `…#<ref>`.
- `--target-path <path>` — override the configured `targetPath`.
- `--search-levels <n>` — `connect` discovery depth from URL root (default `2`).
- `--connected <true|false>` — mark a repo connected on `connect` (default `true`).
- `--base-branch <branch>` / `--branch <name>` / `--title <msg>` — `push` branch/commit/PR title options.
- `--route-base </segment>` — `generate-demo` route base (default `/qui-demo`).
- `--ref <ref>` — **rejected**; encode the ref in `--url` as `<git-url>#<ref>` instead.

Run `qui help <command>` or `qui <command> --help` for detailed per-command usage.

### Exit codes

`0` success · `1` unexpected runtime error · `2` usage/parser error · `3` config/schema error · `4` source/git/network error · `5` policy fail-stop · `6` user rejected plan · `7` scope safety violation · `8` dependency install error · `9` verify/diff mismatch.

## Scripts in this repository

In the root `package.json`:

- `npm run qui -- ...` — runs the `qui` CLI (`node ./bin/qui.js`).
- `npm test` — CLI tests (`test/*.test.js`).
- `npm run test:e2e` — Playwright tests against a local `demo/` dev server (see [UI_TEST.md](UI_TEST.md)).
- `npm run generate-meta` — regenerates `meta.generated.json` for the sources in `./components`.
- `npm run demo:prepare` — regenerate the local `demo/` app (`qui init` + `add --all base` + `generate-demo`). Alias: `npm run qui:createdemo` (prints dev-server hint).
- `npm run demo:build` — production build of the demo (includes Vercel Edge adapter via `qwik add vercel-edge`).
- `npm run demo:run` — local Vercel Dev server (`vercel dev`, http://localhost:3000).
- `npm run demo:deploy` — build locally and publish to Vercel with `vercel deploy --prebuilt --prod` (manual; see [Publish the demo to Vercel](#publish-the-demo-to-vercel-manual-developer-machine)).
- `npm publish` — publishes the `qui-client` package (the tarball contents are controlled by the `files` field in `package.json`).

## Documentation

- [README.md](README.md) — purpose, use cases, quick start
- [CLAUDE.md](CLAUDE.md) — agent-oriented monorepo notes
- [docs/CLI_MIGRATION.md](docs/CLI_MIGRATION.md) — CLI contract
- [docs/MIGRATION_FROM_LEGACY_CLI.md](docs/MIGRATION_FROM_LEGACY_CLI.md)
- [docs/QUI_CLIENT.md](docs/QUI_CLIENT.md)
- [CREATE.md](CREATE.md) — authoring components in source repos
- [docs/META_GEN.md](docs/META_GEN.md) — metadata pipeline

You can open questions and suggestions as an issue; for larger changes a short description in an issue first saves time for both sides.
