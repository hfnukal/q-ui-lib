# CLAUDE.md — q-ui-lib

**What:** Qwik UI components + CLI (`qui`). Users copy sources into their app via `qui add` — not an npm package. Styling: Tailwind + tokens (`COLORS.md`). Behavior: prefer `@qwik-ui/headless` where it fits (`CREATE.md`, `BASE_COMPONENTS.md`).

**Layout:** `components/<kebab-name>/` (`index.tsx`, `meta.generated.json`), `components/utilities/`, `cli/`, `scripts/`, `template/`, `demo/` (synced `src/components/ui/`, routes under `demo/src/routes/…`).

**Commands** (repo root):

```bash
npm run qui -- init|add|update|sync-template ./path [components…]
npm run sync:directives && npm run generate:meta
```

**Creating or updating components** — patterns, compound vs primitive, demo steps, pitfalls: **[CREATE.md](CREATE.md)**. Supporting refs: `COLORS.md` (tokens), `META_GEN.md` (metadata).

**Demo:** After changes, `npm run qui -- update ./demo <slug>`; import from `~/components/ui/…` only, not from `components/` at repo root.

**More:** `Q_UI_LIB.md`, `REGISTRY.md`.

---

### Token / context efficiency (for agents)

**Before reading**

- Open **only** files the task needs. Do not preload long docs (`BASE_COMPONENTS.md`, big demo routes, whole `node_modules` trees).
- Prefer **search** (`grep`, codebase search) to find a symbol or string, then read **a slice** of the file (`offset`/`limit`), not the entire file.
- Component work: **`CREATE.md`** + `components/<slug>/index.tsx` first; add `BASE_COMPONENTS.md` / `COLORS.md` **when** structure, headless usage, or tokens are unclear.

**While editing**

- **Smallest viable change** — no drive-by refactors or doc edits the user did not ask for.
- **Reply output:** show **diffs or snippets** only; do not dump whole files. Link paths (`path/to/file`) instead of pasting hundreds of lines.

**Avoid unless necessary**

- Reading `meta.generated.json` in full (large) — use when changing metadata pipeline or API surface.
- Re-reading the same file in one turn without edits.
- Images, logs, build artifacts, lockfiles.

**Default reply style:** short and task-shaped; long explanations only if the user asks.
