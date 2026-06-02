# Registry — component sets, sharing, and metadata

This document describes how **q-ui-lib** organizes UI components in the repo, how **sets** can be shared via Git, how **metadata** is produced for tooling, and how the **CLI** is intended to copy components into apps. Deep detail on the meta generator lives in **[META_GEN.md](META_GEN.md)**.

---

## 1. Goals

- Keep a **canonical layout** under `components/` so every component has a predictable path and ID.
- Allow **multiple sets** in one workspace: an official **base** set plus **external** sets (e.g. from another Git remote) without colliding by name.
- **Share and combine** components between users primarily via **Git** (clone, fork, pull).
- Treat **TypeScript source** as the source of truth; **`meta.generated.json`** is generated (see §5 and META_GEN.md).

---

## 2. Directory layout

Components live under **`components/`**. Each component is a folder with at least **`index.tsx`** and a generated **`meta.generated.json`**.

### 2.1 Path segments (fixed scheme)

Use a **fixed segment scheme** so every component has an unambiguous ID:

| Segment   | Role |
|-----------|------|
| 1st       | Owner or org (e.g. `shanny`) |
| 2nd       | Set or project (e.g. `eshop`) |
| 3rd       | Component slug (e.g. `cart`) |

**Component ID** (used in CLI and `source.json`): `owner/set/component` — e.g. `shanny/eshop/cart`.

The **official library primitives** shipped with q-ui-lib live under a dedicated first segment so they are never overwritten by pulling external sets:

```text
components/
  base/
    button/
      index.tsx
      meta.generated.json
    input/
      ...
  shanny/
    eshop/
      cart/
        index.tsx
        meta.generated.json
```

- **`base/`** — maintained with the main repo; not replaced when syncing an external set.
- **`owner/set/...`** — external or local extensions; **sync / pull** operations update **only** these trees, not `base/`.

Flat paths like `components/button/` (single segment) are legacy or demo-only; new work should follow the three-level ID above.

### 2.2 Import conventions (library components)

- **Relative imports, always one level up** — Components reference all in-library dependencies as **`../slug`**, regardless of whether the dependency lives in the same set or in `base/`:

  ```ts
  import { Button } from ‘../button’;
  import { Label }  from ‘../label’;
  ```

  This mirrors the flat `src/components/ui/<slug>/` layout used in target apps, so verbatim copy works without path rewriting.

- **Cross-set dependencies require a local copy** — A component in `owner/set/` that depends on a `base/` primitive must include a **copy** of that primitive inside its own `owner/set/` tree. The copy sits next to the importing component (so `../button` resolves correctly), and carries a **`source.json`** recording its origin:

  ```json
  { "id": "base/button", "url": "https://github.com/...", "sha": "abc123" }
  ```

  This keeps imports always flat (`../slug`) and makes the set self-contained for distribution.

- Do not reach **across two unrelated external sets** via relative imports; it breaks transitive copy assumptions.

---

## 3. Sharing via Git

- **Base** ships with the upstream repository.
- **External sets** are brought in via `qui registry add` (see §6.2): the remote repo is cloned to a temp location, the component folder tree is copied into `components/<owner>/<set>/`, and the origin is recorded in **`components/registry.json`**.
- Publishing a set = push a repo (or branch) that others can add with `qui registry add <git-url> <owner> <set>`. No package registry is required.

**`components/registry.json`** tracks registered external sets:

```json
{
  "shanny/eshop": {
    "url": "https://github.com/shanny/eshop-components.git",
    "syncedAt": "abc123def"
  }
}
```

**Conflict avoidance:** two publishers must not both own the same `owner/set` prefix unless they coordinate. Prefer **distinct owner** (or org) names.

---

## 4. Provenance: `source.json`

When a component is **copied into an app** (see §6), the copy may include a small **`source.json`** next to `meta.generated.json` describing origin, for example:

- Registry component ID: `owner/set/component`
- Optional: Git remote URL, commit SHA, label

Apps can use this for updates, auditing, or “where did this file come from?”. The exact JSON shape can evolve; keep it additive.

---

## 5. Metadata generation

Metadata files **`meta.generated.json`** are **generated**, not hand-edited. Generation walks **`components/**/index.tsx`** (respecting nested sets) and uses **ts-morph** (see META_GEN.md).

### 5.1 Component kind

- **Primitive** — default export is a single `component$(...)`.
- **Compound** — default export is an object whose values are `component$` parts (often with `<Slot />`).

### 5.2 `apiTree`

- **Primitive** — `apiTree` has the shape **`{ params, slot }`**: **`params`** is the serialized **props** surface (prop name → type summary from `component$<Props>`); **`slot`** is `true` when a default slot is detected, otherwise omitted or `false` depending on generator rules. See META_GEN.md.

- **Compound** — `apiTree` is a structured tree keyed by part names (optionally rooted at **`Root`**), with **`params`** / **`slot`** on nodes where types are resolved. See META_GEN.md for extraction rules.

The **`registry`** field in `meta.generated.json` reflects where the component lives:
- `"base"` — component is under `components/base/`
- `"owner/set"` — component is under `components/<owner>/<set>/` (e.g. `"shanny/eshop"`)

The generator derives this value from the component's path relative to `components/`.

### 5.3 Dependencies in meta

**`dependencies`** lists sibling component slugs **within the library**, derived from **relative** imports (see §2.2). The generator takes the first segment of each relative path (e.g. `../button` → `button`). The CLI uses this for **transitive copy** when adding a component to an app; keeping dependencies **in the same set** or in **`base/`** keeps that graph valid.

**`npmDependencies`** lists runtime npm packages from `index.tsx` imports (minus app baseline). **`npmDevDependencies`** lists packages from auxiliary files in the component folder. The CLI installs them into `dependencies` / `devDependencies` respectively when missing.

### 5.4 Commands

```bash
npm run qui -- generate
# or (repo root)
node bin/qui.js generate
```

Runs the meta generator (see `scripts/generate-meta.mjs` and META_GEN.md).

---

## 6. CLI: current behavior and planned extensions

### 6.1 Implemented today

| Command | Purpose |
|---------|---------|
| `qui init <target>` | Copy template; sync `utilities` into the app. |
| `qui add <target> <components...>` | Copy listed **top-level** component folders from `components/<slug>/` into `<target>/src/components/ui/<slug>/`. Expands **transitive** `dependencies` from each component’s `meta.generated.json`. Warns if **npm** packages from `npmDependencies` are missing in the app. |
| `qui update <target> [components...]` | Sync by name or interactive version compare (see CLI help). |
| `qui generate` | Regenerate all `meta.generated.json`. |
| `qui generate-demo <target> [components...]` | Generate demo routes from JSDoc into `<target>/src/routes/components/`. See §8. |
| `qui sync-template <target>` | Merge template files into an existing app. |

**Note:** Current `add` assumes **flat** slugs under `components/<slug>`. Migrating the repo to **`base/...` and `owner/set/...`** will not rewrite imports. It assumes flat structure so dependency must exist in same relative path (§6.3).

### 6.2 Planned: registry install and sync

```bash
qui registry add <git-url> <owner> <set>
qui registry sync [owner/set]
```

- **`registry add`** — clones the remote to a temp directory, copies `components/<owner>/<set>/` from the remote into the same path locally, records origin URL + current commit SHA in `components/registry.json`. The remote repo is expected to follow the same `components/<owner>/<set>/<slug>/` layout.
- **`registry sync`** — reads `registry.json`, re-clones or fetches each registered remote, copies updated files into `components/<owner>/<set>/`. Files present locally but removed from the remote are **deleted and reported**. Without arguments syncs all registered sets; `owner/set` limits to one.
- **`base/` is never touched** by registry operations.

### 6.3 Planned: `qui add` into an app by component ID

Target UX:

```bash
qui add /path/to/myapp owner/set/component
qui add /path/to/myapp owner/set/component:aliasName
```

- Resolves `owner/set/component` to **`components/<owner>/<set>/<component>/`**.
- Copies to **`src/components/ui/<component>`** or **`src/components/ui/<aliasName>`**.
- **Transitive dependencies** from the same `owner/set/` tree (including any base copies the set carries) are copied as needed. If a declared dependency is not found under `components/<owner>/<set>/`, the operation fails with an error — the set is considered malformed.
- **Imports are not rewritten.** Components must use **relative imports** (see §2.2); the copy is verbatim.
- **Conflict behavior** when a destination file already exists — controlled by a CLI flag (default `--abort`):
  - `--abort` *(default)* — stop immediately, write nothing
  - `--skip` — leave existing files untouched, copy only new ones
  - `--force` — overwrite without prompting

### 6.4 Planned: `qui clone` (local fork)

```bash
qui clone base/input owner/myapp/input
```

- Copies a component **inside the library workspace** (e.g. from `base/input` to `owner/myapp/input`) for local edits and later **publish** via Git. Others consume it by adding your remote / set. No cross-machine magic beyond normal Git workflows.

---

## 7. Dependency and overwrite policy (design)

Assumes library sources follow **relative in-library imports** and set boundaries from §2.2.

1. Resolve **entry** component by ID (`owner/set/name`).
2. From its sources, collect imports that point to **other components in the same `owner/set/` tree** → add those **transitively**.
3. **Imports are not rewritten** — the copy is verbatim. All in-library dependencies are imported as `../slug` (see §2.2), so paths resolve correctly in the flat `src/components/ui/` target without any AST transforms.
4. If a destination file **already exists**: apply the conflict flag — `--abort` (default, stop everything), `--skip` (keep existing), `--force` (overwrite). See §6.3.
5. Optional future: **prefix/suffix** for all copied files from a set to avoid clashes.

---

## 8. Demo and examples

Demo routes under **`demo/src/routes/components/<slug>/index.tsx`** are **generated from JSDoc** in the component’s `index.tsx` via `scripts/generate-demo.mjs`. Nothing is copied from remotes.

### 8.1 JSDoc format

```tsx
/**
 * @component button
 * @title Button
 * @version 2.0.0
 * @description Popis komponenty — `backticks` se převedou na <code> elementy.
 *
 * @example Název sekce
 * Popis sekce — plain text, `backticks` → <code>.
 * ```tsx
 * <Button onClick$={$(() => { alert("clicked"); })}>Click me</Button>
 * ```
 *
 * @example Další sekce
 * Každý @example = jedna sekce v demo route.
 * ```tsx
 * <Button variant="secondary">Secondary</Button>
 * ```
 */
```

- **`@description`** — zobrazí se jako odstavec pod nadpisem stránky.
- **`@example <title>`** — první řádek = nadpis sekce (`<h2>`); text před ` ``` ` blokem = popis (`<Desc>`); kód uvnitř ` ```tsx ` = živý JSX v `<TabExample>` i string v `<TabCode>`.
- Backtick-quoted slova (`` `prop` ``) se automaticky převedou na `<code class="text-caption-1">`.

### 8.2 Generátor

```bash
node scripts/generate-demo.mjs --target ./demo [slug1 slug2 ...]
# nebo přes CLI:
npm run qui -- generate-demo ./demo [slug1 slug2 ...]
```

- Čte `components/**/index.tsx` rekurzivně.
- Pro každou komponentu s `@title` nebo alespoň jedním `@example` emituje `<target>/src/routes/components/<slug>/index.tsx`.
- Komponenty bez JSDoc se přeskočí.
- Pokud `<target>/src/routes/components/` neexistuje, generátor skončí s chybou.

### 8.3 Integrace do `qui update`

`qui update <target> [slugs...]` po zkopírování souborů komponent automaticky spustí generátor demo routes — pokud `<target>/src/routes/components/` existuje (tj. cíl je demo aplikace). Ostatní cíle generátor přeskočí bez chyby.

- Route files stay in sync with source JSDoc; hand-editing is acceptable only for generator gaps or one-off exceptions.
- When an external set is added, `qui update` will also generate routes for those components if they carry JSDoc.

---

## 9. Design principles

- **TS source** is authoritative; **metadata is generated**.
- **Sets** are separated by path; **base** is not overwritten by external sync.
- **Sharing** is Git-first; CLI automates copy, provenance, and safe overwrites.
- **Compound vs primitive** and **apiTree** stay machine-detectable for tooling.
- **Cross-component imports** in the library stay **relative**; dependencies stay within the **same set** (base copies included) (§2.2).

---

## 10. Related documents

- **[META_GEN.md](META_GEN.md)** — ts-morph pipeline, scanning, `apiTree`, slots.
- **[CREATE.md](CREATE.md)** — creating and updating components in this repo.
- **[CLAUDE.md](CLAUDE.md)** — repo orientation and commands.
