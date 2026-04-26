# qui-client

Standalone CLI (**`qui`**) pro praci s Qwik UI komponentami z Git registry: `init`, `connect`, `add`, `update`, `remove`, `generate`, `generate-demo`, `verify`, `diff`, `clone`, `push`.

## Instalace

```bash
npm i -D qui-client
npx qui --help
```

Nebo globalne: `npm i -g qui-client` a prikaz `qui`.

## Konfigurace

V koreni Qwik aplikace soubor **`qui.config.json`** ve schema **`qui-config/v1`**. Kompletni kontrakt (URL s `#ref`, JSON report, exit kody): **[CLI_MIGRATION.md](../../docs/CLI_MIGRATION.md)**.

Migrace ze starsiho `cli/index.js` v tom samem monorepu: **[MIGRATION_FROM_LEGACY_CLI.md](../../docs/MIGRATION_FROM_LEGACY_CLI.md)**.

## Testy (vyvoj)

```bash
npm test
```

Z korene monorepa: `npm run test:qui-client`.

## Changelog

Viz [CHANGELOG.md](./CHANGELOG.md).
