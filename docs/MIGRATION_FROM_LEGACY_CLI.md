# Migrace z legacy `cli/index.js` na `qui-client`

V monorepu `q-ui-lib` je **canonical** CLI balicek **`packages/qui-client`** (prikaz `qui`). Korenovy soubor **`cli/index.js`** (Commander, stary tok) slouzi jako legacy; nove projekty a skripty smerovat na `qui-client`.

## Konfigurace

| Legacy (navrh / stary CLI) | `qui-client` (`qui-config/v1`) |
|----------------------------|----------------------------------|
| `root`, `defaultRepo`, per-repo `ref` jako samostatne pole | Top-level **`targetPath`**, pouze **`repos{…}`** |
| `--ref` jako CLI flag | **Nepodporovano** — ref vlozte do URL jako **`https://…/repo.git#branch`** |
| — | **`configSchemaVersion`**: `qui-config/v1` |

Podrobny schema kontrakt: **[CLI_MIGRATION.md](./CLI_MIGRATION.md)**.

## Prikaz `connect`

- Aktualne: opakovane dvojice **`--repo <id> --url <url>`** (poradi striktni). Globalni `--url` bez dvojice k `--repo` neni podporovan stejne jako ve starych prikladech s `--ref`.
- **`--dry-run`**: zaplánuje zmeny, **nezapisuje** `qui.config.json`.

## Vystup a chyby

- Strojovy vystup: **`--json`**, envelope **`qui-report/v1`**.
- Exit kody: **[CLI_MIGRATION.md](./CLI_MIGRATION.md)** (napr. `6` uzivatelske odmitnuti planu, `9` verify/diff v CI).

## Dokumentace

- Navrh architektury (castecne zastarale): **[QUI_CLIENT.md](./QUI_CLIENT.md)** — canonical popis je v **§ 1.1** a v aktualizovanem **§ 5–6**.
- Testy balicku: z korene `npm run test:qui-client`.
