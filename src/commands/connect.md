# `connect` command spec

Add, update, or remove component source repos in `qui.config.json` by pointing at a URL and optionally selecting repo(s) and uilib(s), or by removing existing entries with `--remove`.

**Status:** implemented.

---

## Syntax

### Connect (add / update)

```bash
qui connect <url> [repo [...uilibs]] [--all] [options]
```

| Part | Required | Description |
|------|----------|-------------|
| `<url>` | yes | Source location: `file://…`, git clone URL (`https://…`, `git@…`, `ssh://…`), or normalizable host permalink (GitHub/GitLab `…/tree/<ref>/<path>`). Ref via `#<branch\|tag\|commit>` in clone URLs. |
| `[repo]` | no | Repo id to connect. When omitted, user picks from discovered repos (interactive) or must disambiguate in non-interactive mode. |
| `[...uilibs]` | no | One or more uilib names after `repo`. When omitted, user picks uilibs (interactive) unless `--all`. |
| `--all` | no | Include **all** discovered uilibs for the selected repo(s). Mutually exclusive with explicit uilib positionals. |

### Remove

```bash
qui connect --remove <repo> [uilib...] [options]
```

| Part | Required | Description |
|------|----------|-------------|
| `<repo>` | yes | Repo id to remove from `qui.config.json`. |
| `[uilib...]` | no | One or more uilib names to remove from the repo. When omitted, the **entire repo entry** is removed. |

Remove operates on **`qui.config.json` only** — it does not delete installed component folders under `targetPath`. No URL or discovery is performed.

| Case | Result |
|------|--------|
| `--remove componentsextra` | Delete `repos.componentsextra` |
| `--remove componentsextra app` | Remove `app` from `repos.componentsextra.uilibs` |
| `--remove componentsextra app jabko` | Remove both uilibs from the repo |
| Last uilib removed from a repo | Delete the repo entry (if other repos remain) |
| Last repo in config | Usage error — at least one repo must remain |

**Confirmation:** interactive mode prints a plan describing what will be removed and asks `Proceed with removal? [y/N]`. Skipped with `--yes` (also `--auto` / `--force` for CI parity). Non-interactive without confirmation flags → exit `6`.

**Mutually exclusive with connect:** `--remove` cannot be combined with `<url>`, `--all`, or legacy `--repo` / `--url` pairs.

### Connect-specific flags

| Flag | Default | Description |
|------|---------|-------------|
| `--search-levels <n>` | `2` | Max directory depth (from URL root) to search for repo candidates. See [Repo discovery](#repo-discovery). |
| `--components-root <dir>` | `components` | Name of the components directory segment used to identify a repo. Override only for non-standard layouts. |
| `--connected <true\|false>` | `true` | Written to `repos.<id>.connected`. |
| `--remove` | — | Remove mode: delete `<repo>` or uilib(s) from `qui.config.json`. See [Remove](#remove). |
| `--uilibs <a,b,c>` | — | **Deprecated for connect.** Use positional uilibs or `--all`. Kept only for backward compatibility during migration; positional/`--all` wins. |

Global flags (`--dry-run`, `--yes`, `--auto`, `--force`, `--on-error`, `--json`) apply as elsewhere.

### Legacy syntax (deprecated)

```bash
qui connect --repo <repo> --url <url> [--repo <repo2> --url <url2> ...]
```

Still accepted until removal; emits a warning. New invocations should use positional `<url>`.

---

## Concepts

### Repo

A **repo** is a directory that contains a **`components/`** subdirectory (name configurable via `--components-root`, default `components`).

Examples in this monorepo:

| Scan root | Repo id | `componentsRoot` (relative to stored URL root) |
|-----------|---------|------------------------------------------------|
| Repository root (`.`) | `q-ui-lib` or derived from URL basename | `components` |
| `componenttest/` | `componenttest` | `components` |
| `componentsextra/` | `componentsextra` | `components` |

The **stored `url`** is always the **repo root** (the directory that is the parent of `components/`), not the monorepo root when the repo lives in a subfolder.

For git monorepos, `url` is the **clone URL** (whole repository); the subfolder is expressed in `componentsRoot`:

```json
{
  "componenttest": {
    "url": "https://github.com/hfnukal/q-ui-lib.git#cb14e8d…",
    "componentsRoot": "componenttest/components",
    "uilibs": ["qui-test-simple", "qui-test-layout", "qui-test-complex", "qui-test-html-tags"],
    "connected": true
  }
}
```

### Uilib

A **uilib** is an immediate subdirectory of `<repo>/components/` that contains at least one component (child directory with `index.tsx` / `index.ts` or `meta.generated.json`).

Examples:

| Repo | Uilibs |
|------|--------|
| root `components/` | `base`, `qui-demo` |
| `componentsextra/` | `app`, `jabko`, `web` |
| `componenttest/` | `qui-test-simple`, `qui-test-layout`, `qui-test-complex`, `qui-test-html-tags` |

Component path convention (unchanged): `<componentsRoot>/<uilib>/<slug>/`.

---

## URL resolution

### `file://`

Resolve to a local directory (absolute or relative to cwd). No network access.

### Git clone URL

Materialize tree for discovery:

1. Shallow clone (`git clone --depth 1`) to a temp directory.
2. If `#ref` present, fetch and checkout ref.
3. Run discovery on clone root (or scoped subpath; see permalinks).
4. Discard temp directory after connect completes (unless `--dry-run` lists only).

Format must pass existing `validateUrl` (`https://`, `ssh://`, `git@host:path`, optional `#ref`).

### Host permalinks (optional normalizer)

Translate web URLs into clone URL + scan scope:

| Input | Normalized `url` | Scan scope inside clone |
|-------|------------------|-------------------------|
| `https://github.com/org/repo/tree/main/componenttest` | `https://github.com/org/repo.git#main` | `componenttest/` |
| `https://github.com/org/repo/tree/<sha>/componentsextra` | `https://github.com/org/repo.git#<sha>` | `componentsextra/` |

If scope points at a single repo folder, discovery returns one candidate (repo step can be skipped when `[repo]` matches).

---

## Repo discovery

### Algorithm

Given resolved filesystem root `R` and `--search-levels N` (default `2`):

1. Let `componentsDirName = --components-root` (default `components`).
2. Collect **repo candidates** among directories reachable from `R` within depth `N`:
   - **Level 0:** if `R/<componentsDirName>/` exists → candidate with id = basename(`R`) or git repo name when `R` is clone root.
   - **Level 1…N:** for each subdirectory `D` of `R` (recursively up to depth `N`), if `D/<componentsDirName>/` exists → candidate with id = basename(`D`).
3. De-duplicate by absolute path; sort candidates by relative path, then id.
4. For each candidate, **scan uilibs**: list subdirs of `D/<componentsDirName>/` that qualify as uilibs (see above).

Depth is measured from `R`: depth of `R` itself is 0, its immediate children 1, etc.

### Examples (`--search-levels 2`, default)

Scan root = monorepo root:

```
Found repos:
  1) q-ui-lib          components/           uilibs: base, qui-demo
  2) componenttest      componenttest/components/   uilibs: qui-test-simple, …
  3) componentsextra    componentsextra/components/ uilibs: app, jabko, web
```

Scan root = `file:///…/componentsextra`:

```
Found repos:
  1) componentsextra   components/   uilibs: app, jabko, web
```

### `--search-levels`

- Integer ≥ `0`.
- `0` — only check `R` itself (no child scan).
- `1` — `R` and immediate children.
- `2` — default; covers flat repos and one nesting level (`componenttest/`, `componentsextra/` under monorepo root).

Invalid value → usage error (exit `2`).

---

## User flow

### 1. Discover

Resolve `<url>`, run [repo discovery](#repo-discovery). Always produce a **discovery report** (stdout or `--json`) listing every repo and its uilibs — **even when only one repo exists**.

### 2. Select repo(s)

| Condition | Behavior |
|-----------|----------|
| `[repo]` positional given | Select matching candidate by id or path suffix. Must match exactly one; else usage error listing candidates. **No repo prompt.** |
| No `[repo]`, interactive TTY | Prompt: choose one repo (or multi-select if extended later; v1: single repo per invocation). |
| No `[repo]`, non-interactive | Fail with exit `2` / `6`; `--json` includes `discovery.repos[]` for caller to retry with `[repo]`. |

When `[repo]` is given, connect proceeds automatically for that repo.

### 3. Select uilibs

| Condition | Behavior |
|-----------|----------|
| `--all` | Set `uilibs` to all discovered uilibs for the repo. No uilib prompt. |
| Uilib positionals after `[repo]` | Set `uilibs` to listed names (must exist). No uilib prompt. |
| Neither, interactive TTY | List all uilibs for the repo; user selects subset (multi-select). |
| Neither, non-interactive | Fail unless exactly one uilib exists (auto-select) or user passes `--all` / uilib positionals. |

**Listing rule:** always show the full uilib list for the chosen repo before selection (or in `--json` discovery output), whether or not the user will pick interactively.

### 4. Write config

For each connected repo, write or update `qui.config.json`:

```json
{
  "repos": {
    "<repoId>": {
      "url": "<normalized url>",
      "componentsRoot": "<relative path to components dir from clone/file root>",
      "uilibs": ["…"],
      "connected": true
    }
  }
}
```

- **`componentsRoot`:** path from git/file root to the `components/` directory (e.g. `components`, `componenttest/components`).
- **Overwrite:** existing `repos.<id>` follows global `--on-error` / `--force` / `--yes` / `--auto` policy (same as current `connect.js`).

### 5. `--dry-run`

Run discovery and selection (prompts allowed unless `--yes`/`--force`). Do **not** write `qui.config.json`. Report planned `repos.*` entries in JSON envelope.

---

## Parser rules

1. First positional after `connect` is always `<url>` (must not start with `--`).
2. After `<url>`, positionals are parsed as:
   - If next token matches a discovered repo id → `repo`, then remaining non-flag tokens are uilib names until `--` or next flag.
   - **Pre-discovery parsing:** repo/uilib positionals are validated after URL resolution and discovery; unknown repo/uilib → usage error with hints.
3. `--all` cannot be combined with explicit uilib positionals → usage error.
4. `--ref` remains rejected; ref belongs in `<url>#ref`.
5. Unknown options → usage error (exit `2`).

---

## Examples

### Interactive — monorepo file URL

```bash
qui connect file:///Users/me/q-ui-lib
```

```
Discovering repos (search-levels=2)…

Repos:
  1) q-ui-lib       → uilibs: base, qui-demo
  2) componenttest  → uilibs: qui-test-simple, qui-test-layout, qui-test-complex, qui-test-html-tags
  3) componentsextra → uilibs: app, jabko, web

Select repo [1-3]: 3

Uilibs for componentsextra:
  1) app
  2) jabko
  3) web

Select uilibs (comma-separated, or 'all'): 1,3

Connected componentsextra with uilibs: app, web
```

### Auto repo + interactive uilibs

```bash
qui connect file:///Users/me/q-ui-lib/componentsextra componentsextra
```

Skips repo prompt; lists uilibs `app`, `jabko`, `web` for selection.

### Auto repo + explicit uilibs

```bash
qui connect file://../componenttest componenttest qui-test-simple qui-test-layout
```

Writes config with those two uilibs only.

### Auto repo + all uilibs

```bash
qui connect file://../componentsextra componentsextra --all
```

### Git URL + repo

```bash
qui connect https://github.com/hfnukal/q-ui-lib.git#main componenttest --all
```

### GitHub permalink (scoped)

```bash
qui connect https://github.com/hfnukal/q-ui-lib/tree/main/componentsextra --all
```

Single repo discovered under scope; `--all` adds `app`, `jabko`, `web`.

### Non-interactive

```bash
qui connect file://../componenttest componenttest --all --yes --json
```

### Deeper monorepo layout

```bash
qui connect file:///path/to/sources --search-levels 3
```

### Remove repo

```bash
qui connect --remove componentsextra
```

```
Will remove repo:
  componentsextra
From config:
  /Users/me/demo/qui.config.json
Configured uilibs: app, web

Proceed with removal? [y/N]
```

### Remove uilib

```bash
qui connect --remove componentsextra app --yes
```

```
Will remove uilib(s):
  app
From repo: componentsextra
Remaining uilibs: web
Config:
  /Users/me/demo/qui.config.json

[OK] connect (exit 0)
Removed uilib(s) from 'componentsextra': app
Remaining uilibs: web
```

### Remove uilib (non-interactive)

```bash
qui connect --remove componentsextra app --yes --json
```

---

## JSON report (`--json`)

Extend `qui-report/v1` items with discovery metadata:

```json
{
  "command": "connect",
  "ok": true,
  "discovery": {
    "url": "file:///…",
    "searchLevels": 2,
    "repos": [
      {
        "id": "componentsextra",
        "componentsRoot": "componentsextra/components",
        "uilibs": ["app", "jabko", "web"],
        "selected": false
      }
    ]
  },
  "items": [
    {
      "action": "create",
      "target": "repos.componentsextra",
      "status": "applied",
      "details": {
        "url": "file:///…/componentsextra",
        "componentsRoot": "components",
        "uilibs": ["app", "web"]
      }
    }
  ]
}
```

When discovery finds multiple repos and none selected in non-interactive mode: `ok: false`, exit `2`, `discovery.repos` populated, `items: []`.

---

## Exit codes

Unchanged from global CLI:

| Code | When |
|------|------|
| `0` | Success |
| `2` | Usage / parser / ambiguous discovery in non-interactive mode |
| `3` | Config schema error after write validation |
| `4` | Git clone / network failure during discovery |
| `5` | Policy fail (duplicate repo, `onError=fail`) |
| `6` | User rejected prompt / non-interactive ask |

---

## Implementation notes

### New modules (suggested)

| Module | Responsibility |
|--------|----------------|
| `src/services/connect-discovery.js` | URL normalize, materialize source, scan repos/uilibs |
| `src/services/connect-url.js` | `file://`, git, GitHub/GitLab permalink parsing |
| `src/services/interactive.js` | Add `promptSelectOne`, `promptSelectMany` |

### Reuse

- `createGitWorkspace` / shallow clone from `source-workspace.js` (or shared helper with cleanup).
- `validateUrl`, `writeConfigAtomic`, policy / overwrite flow from current `connect.js`.
- Uilib detection aligned with `listSubdirs` + component dir checks in `component-catalog.js`.

### Tests (`test/connect-discovery.test.js`, update `test/parser.test.js`)

- Discovery at monorepo root finds `components`, `componenttest`, `componentsextra`.
- Scoped path finds single repo.
- `--search-levels 0` vs `2`.
- Positional repo + uilibs → config shape.
- `--all` vs explicit uilibs conflict.
- Non-interactive multi-repo → exit `2` + JSON candidates.
- Permalink normalization (if implemented).
- Legacy `--repo` / `--url` pairs still parse with deprecation warning.
- `--remove <repo>` deletes repo entry; `--remove <repo> <uilib>` removes uilib(s).
- Remove without `--yes` in non-interactive mode → exit `6`.
- Cannot remove last repo in config.

---

## Migration

1. Implement positional syntax alongside legacy flag pairs.
2. Update `README.md`, `CLI_MIGRATION.md`, help text in `cli.js`.
3. Deprecation warning on legacy invocations for one minor version.
4. Remove `parseConnectPairs` strict-only path in a following major bump.

---

## Open questions (v1 defaults)

| Topic | Default |
|-------|---------|
| Root repo id when scan root is clone root with `./components/` | Basename of git repo (e.g. `q-ui-lib`) |
| Multi-repo per invocation | One repo per command (v1); batch connect deferred |
| Empty uilib (dir exists but no components) | Exclude from list; warn in discovery output |
