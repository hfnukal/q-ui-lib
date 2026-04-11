# Q UI Library CLI

A lightweight command-line tool that helps you bootstrap a Qwik application (with Tailwind CSS and [@qwik-ui/headless](https://qwikui.com/docs/headless/install)), add reusable UI components, and keep them up to date.

## Installation

From the **library root** (this repository), install dependencies once:

```bash
npm install
```

The CLI is exposed as the npm script **`q`**. With no arguments it prints usage (same as `--help`).

```bash
npm run q
```

Pass CLI arguments after `--` so they are forwarded to the script:

```bash
npm run q -- init ./my-app
npm run q -- add ./my-app button accordion slider
npm run q -- update ./my-app
```

You can also run the entry file directly:

```bash
node cli/index.js init ./my-app
```

If the package is linked or installed globally, the `q-ui-lib` binary is available:

```bash
npx q-ui-lib init ./my-app
```

## Commands

### `init <target>`

Creates a new Qwik project from the built-in template.

```bash
npm run q -- init ./my-app
```

- Copies the `template/` folder into the target directory (includes Tailwind, PostCSS, and `@qwik-ui/headless`).
- Copies shared **`components/utilities/`** into `src/components/ui/utilities/` (Tailwind class-string tokens used by several components).
- Prompts you to run `npm install` immediately (answer **y** to install dependencies).

### `add <target> <components...>`

Copies selected components from the library into an existing Qwik app.

```bash
npm run q -- add ./my-app accordion slider button
```

- Components are placed under `src/components/ui/<name>/` in the target app.
- `meta.generated.json` is copied with the component (version for CLI `update`).
- **`components/utilities/`** is synced to `src/components/ui/utilities/` (shared styles for Popover, Dialog, Combobox, etc.).
- **accordion** depends on `@qwik-ui/headless` (already in the template’s `package.json`).

### `update <target>`

Interactively updates components that have newer versions in the library.

```bash
npm run q -- update ./my-app
```

- Scans the target app’s `src/components/ui/` folder.
- For each component with a version mismatch, you are asked whether to overwrite it.
- Also syncs **`components/utilities/`** into the target app (same as `add`).

## Components

| Folder        | Based on              | Notes                                      |
| ------------- | --------------------- | ------------------------------------------ |
| `button`      | Qwik + Tailwind       | Gradient / variant button                  |
| `accordion`   | `@qwik-ui/headless`   | Export: `AccordionList`                    |
| `slider`      | Native `<input type="range">` | Export: `Slider` (headless has no slider) |

Each component lives in `components/<name>/` with `index.tsx`; `meta.generated.json` is produced by `npm run generate:meta` in the library repo.

## Example workflow

1. **Create a new app**
   ```bash
   npm run q -- init ./my-app
   cd ./my-app
   npm run dev
   ```
2. **Add components**
   ```bash
   npm run q -- add ./my-app accordion slider button
   ```
3. **Update components later**
   ```bash
   npm run q -- update ./my-app
   ```

## Contributing

Add new components under `components/`, bump `@version` in the component’s JSDoc, run `npm run generate:meta`, and use the same `npm run q --` workflow to test locally.

---

© 2026 Q UI Library – built with Qwik, Tailwind CSS, [@qwik-ui/headless](https://www.npmjs.com/package/@qwik-ui/headless), and a dash of love.
