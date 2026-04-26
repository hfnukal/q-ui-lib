# Changelog (repo přehled)

Tento soubor shrnuje **repozitář jako celek**. Vydání npm balíčku **`qui-client`** (CLI) jsou v kořenovém changelogu:

- **[../CHANGELOG.md](../CHANGELOG.md)** — vydání `qui-client`, breaking změny vůči dřívějšímu legacy `cli/index.js`.

Kontrakt CLI (schema configu, JSON report, exit kódy): **[CLI_MIGRATION.md](./CLI_MIGRATION.md)**.

Historie migrace z `cli/index.js` na `qui`: **[MIGRATION_FROM_LEGACY_CLI.md](./MIGRATION_FROM_LEGACY_CLI.md)**.

## Repozitář (qui-client + komponenty)

Kořenový `package.json` má **`name`: `qui-client`** — zde žije CLI (`bin/`, `src/`, `scripts/`, `templates/`). Kanonické zdroje UI komponent zůstávají v **`components/`**. Volitelný workspace **`packages/qui-feature`** doplňuje Qwik starter (Tailwind v4).
