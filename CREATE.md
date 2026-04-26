# Component — agent instructions (low token usage)

**Styles:** only tokens from [COLORS.md](./COLORS.md) (no custom colors outside the scheme).

---

## Workflow

1. **Name** — For a new component without a name → ask for **`uilib`** (set under `components/`, e.g. `base`, `jabko`) and **kebab-case `slug`**; target folder **`components/<uilib>/<slug>/`**. Do not implement without that.
2. **Behavior** — Prefer `@qwik-ui/headless`; thin wrapper + Tailwind. Without headless: HTML + ARIA. Compound = one exported object with parts (`Root`, `List`, …); types from headless (`PropsOf<typeof …>`). Examples in this repo: `components/base/tabs/index.tsx`, `components/base/accordion/index.tsx`.
3. **File** — `components/<uilib>/<slug>/index.tsx`, leading JSDoc `@component` (slug = **leaf** folder name), `@title`, `@version`, **`@example`** — one short usage example (typically JSX in a fenced `` ```tsx `` block), matching the exported API (compound or primitive); no unnecessary app context.
4. **Meta** — Regenerate `meta.generated.json` (never hand-write; treat structure as opaque):
   - **In this monorepo** (sources under `components/`): `npm run generate-meta -w qui-client`
   - **In an app** with `qui.config.json` (cwd = app root): `qui generate`
5. **Headless** — Do not pass children props that headless overwrites at runtime (Qwik getter error). In `node_modules/@qwik-ui/headless`, verify assignments to `props`; often `key` is enough instead of a manual ID.
6. **Demo / app sync** — From the **app root** that contains `qui.config.json` (e.g. `demo/`): `qui update <slug>` or `qui update <uilib>/<slug>` (see [README.md](./README.md) for `--repo` and resolution rules). **`qui`** uses `process.cwd()` — do not assume repo root unless you `cd` into the app first. Installed layout is **`targetPath/<uilib>/<slug>/`** (e.g. `src/components/ui/base/button/`); imports follow that path (with your app’s `paths` alias, often `~/…`). Regenerate demo routes: `qui generate-demo` (optional `--route-base /qui-demo`). Example route files live under `src/routes/<route-base>/components/…` (and may include a `<uilib>` segment when present); use **`CodeExample`** (and helpers) from `~/components/demo/codeexample`. Sidebars that list component routes often use `import.meta.glob("./components/*/index.tsx")` **relative to that route folder** — e.g. `demo/src/routes/layout.tsx` vs `demo/src/routes/qui-demo/`; follow the existing pattern for the route tree you touch.

---

## Parameters for the metadata generator

The generator reads the **first type argument** of **`component$<…>`** and from it **prop properties** into metadata.

- **Explicit type** — Interface or type alias in the **same file** with **directly listed** properties (`interface FooProps { … }`). Plain `component$<PropsOf<Headless.X>>` **without** your own extended type often **does not populate** parameters (inheritance from `PropsOf` / `extends Omit<PropsOf<…>>` does not surface in the output) → where you need documented parameters, **add your own interface** (e.g. `extends PropsOf<…>` + explicit lines, or `Pick`/`Omit` + own fields).
- **Type intersection** — `&` / intersection: properties from both sides are merged when parseable in the file.
- **Types in metadata** — `string` / `number` / `boolean` (including `| undefined`); union of **string/number literals** → array of values; `PropFunction<…>` / `QRL<…>` → `"function"`; more complex unions → text representation (truncated).

Details: [docs/META_GEN.md](./docs/META_GEN.md).

---

## Exported parts and `apiTree`

Tree from **keys** of `export const X = { … }` (declaration order). **Not** from JSX.

- **`Root`** — Structural root; other keys nest under `Root.children` (except `Root` itself).
- **PascalCase** key names. **Parent** of part `K` = another key `P` such that `K` starts with `P`, `P` is shorter than `K`, and the **remainder** of `K` after `P` starts with an **uppercase letter** (new segment → `Menu` + `Item` → `MenuItem` under `Menu`). Multiple candidates → **longest** valid `P` (`PopoverItemLabel` under `PopoverItem`, not under `Popover`).
- Siblings at the same level when the prefix does not match (e.g. `Trigger`, `Panel`).
- Bad names → flat / wrong nesting in the generated tree.

Full rules: [docs/REGISTRY.md](./docs/REGISTRY.md).

---

## Prompt (copy)

```
Task: in q-ui-lib {{ACTION}} component{{OPTIONAL_NAME}}. Workflow and rules: CREATE.md. At the end, briefly summarize changes and paths.
```

`{{ACTION}}` = create new / update existing; `{{OPTIONAL_NAME}}` or empty; folder **`components/<uilib>/<kebab-slug>/`**.

---

## Cursor

[`.cursor/rules/q-ui-lib-ui-components.mdc`](.cursor/rules/q-ui-lib-ui-components.mdc)
