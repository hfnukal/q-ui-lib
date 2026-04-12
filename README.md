# Q UI Library

A Qwik component library distributed as **source** — components are copied directly into your app rather than installed as a package. Styling via Tailwind CSS + design tokens; behavior via [`@qwik-ui/headless`](https://qwikui.com/docs/headless/install) where available.

## Quick start

```bash
# From the library root
npm install

# Bootstrap a new Qwik app
npm run qui -- init ./my-app

# Add components to an existing app
npm run qui -- add ./my-app button accordion input
```

## CLI — `qui`

The CLI is exposed as the `qui` npm script. Pass arguments after `--`:

```bash
npm run qui -- <command> [options]
# or directly:
node cli/index.js <command> [options]
```

### Commands

| Command | Description |
|---------|-------------|
| `init <target>` | Bootstrap a new Qwik + Tailwind app from the built-in template. Copies shared `utilities/` into the app. |
| `add <target> <components...>` | Copy components into `<target>/src/components/ui/`. Resolves transitive dependencies automatically. Warns about missing npm packages. |
| `update <target> [components...]` | Interactively sync components to newer library versions. Regenerates demo routes if target has `src/routes/components/`. |
| `generate` | Regenerate all `meta.generated.json` files from component JSDoc. |
| `generate-demo <target> [slugs...]` | Generate demo routes from component JSDoc `@example` tags into `<target>/src/routes/components/`. |
| `sync-template <target>` | Merge template files into an existing app (non-destructive). |
| `registry add <git-url> <owner> <set>` | Clone a remote component set into `components/<owner>/<set>/` and register it in `components/registry.json`. |
| `registry sync [owner/set]` | Re-fetch and update registered external sets. |
| `clone <src-id> <dest-id>` | Copy a component within the library workspace for local customization (e.g. `clone base/input shanny/myapp/input`). |

#### Conflict flags for `add`

| Flag | Behavior |
|------|----------|
| *(default)* | `--abort` — stop immediately if any destination file exists |
| `--skip` | Leave existing files untouched, copy only new ones |
| `--force` | Overwrite existing files |

### Component IDs

Components are addressed as **`owner/set/slug`** (three-level) or flat **`slug`** for base components:

```bash
npm run qui -- add ./my-app base/button          # three-level
npm run qui -- add ./my-app button               # flat (resolves to base/button)
npm run qui -- add ./my-app shanny/eshop/cart    # external set
```

## Components

55+ components live under `components/base/`. Each folder contains:
- `index.tsx` — component source with JSDoc (`@title`, `@description`, `@example`)
- `meta.generated.json` — generated metadata (props, dependencies, version)

Components include: accordion, avatar, badge, button, calendar, card, carousel, chart, checkbox, combobox, dialog, dropdown-menu, field, file-input, input, input-group, label, navigation-menu, pagination, popover, progress, select, separator, sheet, sidebar, slider, spinner, table, tabs, textarea, toggle-group, tooltip, and more.

## npm scripts

### Metadata & demo pipeline

| Script | Description |
|--------|-------------|
| `npm run qui:sync` | Sync `@component` / `@title` / `@version` directives in all component files |
| `npm run qui:meta` | Regenerate all `meta.generated.json` from component JSDoc |
| `npm run qui:demo` | Generate all demo routes (`./demo`) from component JSDoc |
| `npm run qui:build` | Full pipeline: `qui:sync` → `qui:meta` → `qui:demo` |
| `npm run qui:migrate` | One-time: extract demo route content → component JSDoc `@example` blocks |

### Working with the demo app

| Script | Equivalent CLI | Description |
|--------|---------------|-------------|
| `npm run qui:add -- button input` | `qui add ./demo button input` | Add components to the demo app |
| `npm run qui:update -- button` | `qui update ./demo button` | Sync specific components into the demo |
| `npm run qui:update:all` | `qui update ./demo --all` | Update all demo components from library |

### CLI passthrough

```bash
# Any qui command targeting ./demo (shorter to type):
npm run qui:add -- accordion slider
npm run qui:update -- input label

# Any qui command with full control:
npm run qui -- add ./my-app button --skip
npm run qui -- registry add https://github.com/... owner myset
```

## Workflow: creating or updating a component

See **[CREATE.md](CREATE.md)** for full details. Short version:

1. Edit `components/base/<slug>/index.tsx` — bump `@version`, update `@description` / `@example`.
2. Run `npm run qui:build` (sync directives → regenerate meta → regenerate all demo routes).
   Or for a single component: `npm run qui:update -- <slug>`.

## Registry (external sets)

Share components via Git — no package registry required:

```bash
# Add a remote set
npm run qui -- registry add https://github.com/you/components.git you/myset

# Sync later
npm run qui -- registry sync you/myset
```

External sets land in `components/<owner>/<set>/` and are tracked in `components/registry.json`. The `base/` tree is never touched by registry operations.

## Related documents

- **[CREATE.md](CREATE.md)** — creating and updating components
- **[REGISTRY.md](REGISTRY.md)** — registry system, sets, metadata
- **[META_GEN.md](META_GEN.md)** — metadata generator internals
- **[COLORS.md](COLORS.md)** — design tokens

---

© 2026 Q UI Library — Qwik · Tailwind CSS · [@qwik-ui/headless](https://www.npmjs.com/package/@qwik-ui/headless)
