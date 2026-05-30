# Contributing to qui-client

Thanks for your interest in improving the project. **The root of this repository is the npm package `qui-client`** (the **`qui`** command): the CLI copies and synchronizes Qwik UI components from Git sources into an app; the canonical component sources for development live in **`components/`**.

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
  npm run qui -- --help
  ```

## Tests

Changes to the CLI should pass the tests:

```bash
npm test
```

## Components and metadata

- Components typically live under `components/<uilib>/<name>/` (e.g. `components/base/button/`).
- The **`meta.generated.json`** file describes a component's dependencies; after changing props/dependencies keep it in sync with the source (or use `qui generate` in the target app per the [README.md](README.md)).
- Document new or significantly changed components in the PR (what changes for consumers of the library).

## Pull requests

1. **One topical change** per PR (easier to review and revert).
2. **PR description**: what it solves, why, how to verify (commands, manual steps for UI).
3. **Regression risks**: changes to the CLI or to the component structure can break an existing `qui.config.json` — for breaking changes, state this explicitly.

## Extending beyond the "core"

The library is designed so you can connect **multiple sources** (`repos`) and **`uilib`s** in `qui.config.json`. You can keep your own component sets in a separate repository and connect them via `qui connect`; this repo is mainly for shared components and the development of `qui-client`.

## Documentation

- Overview of the CLI and configuration: [README.md](README.md)
- Overview and installation from npm: [README.md](README.md) (the CLI and monorepo sections)
- CLI contract: [docs/CLI_MIGRATION.md](docs/CLI_MIGRATION.md)

You can open questions and suggestions as an issue; for larger changes a short description in an issue first saves time for both sides.
