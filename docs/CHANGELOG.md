# Changelog

Tento soubor shrnuje **monorepo** `q-ui-lib`. Samostatny CLI balicek ma vlastni changelog:

- **[packages/qui-client/CHANGELOG.md](packages/qui-client/CHANGELOG.md)** — vydani `qui-client`, breaking zmeny vuci legacy `cli/index.js`.

Kontrakt CLI (schema configu, JSON report, exit kody): **[CLI_MIGRATION.md](./CLI_MIGRATION.md)**.

Migrace z korenoveho `cli/index.js` na `qui`: **[MIGRATION_FROM_LEGACY_CLI.md](./MIGRATION_FROM_LEGACY_CLI.md)**.

## q-ui-lib (monorepo)

Historicky obsahoval jediny vstup `qui` pres `cli/index.js`; canonical smer je balicek **`qui-client`**. Knihovna komponent a demo zustavaji v tomto repu beze zmeny nazvu balicku v koreni (`name`: `q-ui-lib`).
