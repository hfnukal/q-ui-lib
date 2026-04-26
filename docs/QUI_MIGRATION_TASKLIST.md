# QUI migration tasklist

Pracovni tasklist pro implementaci migrace CLI podle `CLI_MIGRATION.md`.
Format je zamerne issue-ready: kazdy blok lze vzit jako samostatny PR nebo issue.

## 0) Guardrails a startovni rozhodnuti

- [x] Potvrdit, ze canonical implementace je v kořeni repa jako balíček `qui-client` (bez legacy `cli/index.js`).
- [x] Potvrdit, ze canonical config je `qui.config.json` ve schema `qui-config/v1` (repos-only).
- [x] Potvrdit, ze canonical JSON vystup je envelope `qui-report/v1` (Varianta A).
- [ ] Potvrdit breaking changes do release notes (`--ref` removal, `--path` removal, nove route base, atd.).

Akceptace:
- [ ] Team potvrdil scope a nebude se vracet legacy behavior.

## 1) Bootstrap `qui-client` jako samostatne CLI

Soubory:
- `bin/qui.js`
- `src/cli.js` (novy)
- `package.json`

Ukoly:
- [x] Pridat realny entrypoint `src/cli.js`.
- [x] Upravit `bin/qui.js`, aby volal pouze lokalni `src/cli.js` (zadna delegace do root CLI).
- [x] Dodat parser zakladnich globalnich prepinacu (`--on-error`, `--auto`, `--force`, `--dry-run`, `--yes`, `--json` kde relevantni).
- [x] Zavest jednotnou error boundary vracejici definovane exit kody.

Akceptace:
- [x] `npx qui --help` funguje z kořene repozitáře po `npm install`.
- [x] Neni zadny runtime import na `cli/index.js`.

## 2) Config vrstva (`qui.config.json` v1)

Soubory:
- `src/services/config.js` (novy)
- `src/services/source-resolver.js` (novy)

Ukoly:
- [x] Implementovat nacitani, validaci a zapis `qui.config.json` podle schema v `CLI_MIGRATION.md`.
- [x] Vynutit `additionalProperties: false` a required pole (`configSchemaVersion`, `targetPath`, `repos`).
- [x] Implementovat parser URL: `file://`, `https://`, `ssh://`, `git@...` + optional `#ref`.
- [x] Implementovat precedence: CLI flagy > `config.policy` > defaulty.
- [x] Osetrit `targetPath` pravidla (relativni only, absolutni fail).
- [x] Zavest atomicke zapisy (`temp -> rename`) pro config a metadata.

Akceptace:
- [x] Nevalidni config vraci exit `3`.
- [x] Usage/parser chyby vraci exit `2`.

## 3) Source resolution a selection pravidla

Soubory:
- `src/services/source-resolver.js`

Ukoly:
- [x] Implementovat selector `--repo <repo|repo/uilib>`.
- [x] Implementovat fallback bez `--repo`: deterministicky prvni zaznam v `repos`.
- [x] Implementovat parser `url#ref` -> `{ remoteUrl, ref? }`.
- [x] Vynutit, ze `--ref` neni podporovan (parser error).
- [x] Vynutit, ze prazdne/nepouzitelne `repos` bez `--repo` failuje jako config/schema chyba.

Akceptace:
- [x] Vyber source funguje stejne pro `file://` i git URL.

## 4) Migrace commandu do `src/commands`

Soubory (nove):
- `init.js`
- `connect.js`
- `add.js`
- `update.js`
- `remove.js`
- `verify.js`
- `diff.js`
- `push.js`
- `generate.js`
- `generate-demo.js`
- `clone.js`

Ukoly:
- [x] Prenest behavior commandu z root CLI do `qui-client`.
- [x] Sjednotit interface commandu nad spolecnou policy a reporting vrstvou.
- [x] Dodrzet parser pravidla pro `connect` (parovane `--repo --url` v poradi).
- [x] Vynutit pravidla `--all` (zakazane s explicitnimi komponentami, povinny `--repo` u `add/remove --all`).
- [x] Osetrit read-only commandy (`verify`, `diff`) tak, aby negenerovaly mutace.

Akceptace:
- [x] Vsechny commandy jsou volatelne z `qui-client`.
- [ ] CLI vraci konzistentni exit kody.

## 5) `init` sjednoceni se `sync-template`

Soubory:
- `src/commands/init.js`
- sdilena plan/apply vrstva

Ukoly:
- [x] Absorbovat puvodni `sync-template` behavior do `init`.
- [x] Pokryt novy i existujici projekt.
- [x] Zavest kolizni flow dle policy (`ask|warn|fail`) + `--auto`/`--force`.
- [x] Pri `--dry-run` jen report planu, bez mutaci.

Akceptace:
- [x] Samostatny command `sync-template` neni potreba.

## 6) Dependency automation (`npmDependencies`)

Soubory:
- `src/services/dependency-graph.js`
- `src/services/npm-dependencies.js`

Ukoly:
- [x] Cist `npmDependencies` z `meta.generated.json` vcetne transitivnich vazeb.
- [x] Porovnat se stavem `dependencies` + `devDependencies` cilove app.
- [x] Nabidnout install/uninstall dle policy (`ask|auto|force`).
- [x] Autodetekovat package manager pres lockfile, fallback na `npm` + warning.
- [x] Zajistit, ze `--dry-run` jen reportuje.

Akceptace:
- [x] `add/update/remove` umi navrhnout a provest dependency plan.
- [x] Chyba installu vraci exit `8`.

## 7) `generate` a `generate-demo`

Soubory:
- `src/commands/generate.js`
- `src/commands/generate-demo.js`

Ukoly:
- [x] Prenest `generate` do `qui-client` a zajistit deterministicky vystup.
- [x] Implementovat `generate-demo` pod `src/routes/qui-demo/**` + `src/components/demo/**`.
- [x] Zajistit, ze se negeneruje nic pod `src/routes/components/**`.
- [x] Zajistit idempotenci opakovaneho behu.

Akceptace:
- [x] `generate` vola `scripts/generate-meta.mjs` (ts-morph, stejna logika jako drive); `--dry-run` propaguje se do skriptu.
- [ ] Vystup `generate-demo` a dalsi kontrakty dle `CLI_MIGRATION.md` (audit).

## 8) `clone` metadata kontrakt

Soubory:
- `src/commands/clone.js`
- metadata update utility

Ukoly:
- [x] Clone komponenty v ramci `repo/uilib`.
- [x] Upravit identifikaci komponenty (napr. `@component`) a navazane metadaty.
- [x] Zapsat/aktualizovat `quiSource` (`repo`, `url`, `sourcePath`, `installedAt`, `originComponent`, `clonedAt`, `cloneDepth`).
- [x] Zachovat push-ready stav bez rucnich oprav.

Akceptace:
- [ ] Naklonovana komponenta jde nasledne `qui push`.

## 9) JSON report kontrakt (`--json`)

Soubory:
- shared report formatter

Ukoly:
- [x] Implementovat envelope `qui-report/v1` pro vsechny commandy.
- [x] Implementovat typed `items[]` pro read-only (`verify`, `diff`) i mutacni commandy.
- [x] Zajistit konzistentni pole: `schemaVersion`, `command`, `ok`, `exitCode`, `summary`, `items`, `warnings`, `errors`, `timestamp`.
- [x] Mapovat fail stavy na spravne exit kody (vcetne `9` pro verify/diff mismatch v CI rezimu).

Akceptace:
- [x] `--json` je stabilni a strojove citelny kontrakt napric commandy.

## 10) Safety, scope guard, cross-platform

Soubory:
- scope/safety utility vrstva

Ukoly:
- [x] Zakazat zapis mimo root aktualni aplikace.
- [x] Osetrit symlink escape (`realpath` scope kontrola).
- [x] Osetrit case-insensitive slug kolize.
- [x] Osetrit `file://` tvary pro macOS/Linux/Windows.
- [x] Pridat retry strategii pro transient git/network chyby (1 retry).

Akceptace:
- [x] Scope poruseni vraci exit `7`.
- [x] Source/git/network fail vraci exit `4`.

## 11) Testy

Minimalni test matrix (zkracena implementacni verze):
- [x] Parser a config validace (`connect` parovani, schema, `targetPath`) — `test/parser.test.js`, `config.test.js`.
- [x] Source precedence (zaklad: `--repo`, fallback prvni repo, `url#ref`) — `source-resolver.test.js`.
- [x] Policy flow (`resolvePolicy`: `--auto`, `--force`, merge s config) — `policy.test.js`.
- [ ] Command smoke plne pokryti (`add`, `update`, `remove`, `clone`, `push`).
- [x] CLI smoke: `init --dry-run` v prazdnem temp adresari — `init-smoke.test.js`.
- [x] CLI smoke: `connect --dry-run` nemeni `qui.config.json` — `connect-smoke.test.js`.
- [x] CLI smoke vuci `demo/`: `verify`, `diff`, `generate` / `generate-demo --dry-run`, global `help` — `cli-demo-smoke.test.js`.
- [ ] `--json` snapshoty.
- [ ] Cross-platform path/URL testy.

Akceptace:
- [ ] Passuje smoke sada pro cele CLI (rozsirovat postupne).
- [x] Determinismus: opakovany beh `generate`/`generate-demo` bez neocekavaneho diffu.

## 12) Dokumentace a release

Soubory:
- `QUI_CLIENT.md`
- release notes/changelog

Ukoly:
- [x] Doplnit do `QUI_CLIENT.md` sekci **1.1** (canonical kořenový `qui-client`, `qui-config/v1`, `--json`, `--dry-run` u `connect`, odkaz na `CLI_MIGRATION.md`) a upozorneni u legacy prikladu v § 5.
- [x] Priklad a validace `qui-config/v1` v `QUI_CLIENT.md` § 5 + legacy v § 5.2; terminologie § 5.3.
- [x] `QUI_CLIENT.md` § 6–6.3 canonical, § 7 krok 6, § 8, § 13 roadmap, § 14 priklady, § 15 disclaimer + `connect` parser — doplneno; zbytek dlouheho dokumentu muze jeste obsahovat stare formulace (grep `--ref` / `defaultRepo`).
- [x] **`docs/MIGRATION_FROM_LEGACY_CLI.md`** (tabulka config, odkaz na testy).
- [x] `CHANGELOG.md` (0.1.0, breaking vs legacy CLI, odkaz na `CLI_MIGRATION.md`).
- [x] **`docs/CHANGELOG.md`** (odkaz na `qui-client` changelog + `CLI_MIGRATION` + `MIGRATION_FROM_LEGACY_CLI`).
- [x] **§ 7.2** v `QUI_CLIENT.md` — bez `root.uilibs`, odkaz na resolver v `qui-client`.
- [x] Migration notes pro uzivatele legacy CLI: **`docs/MIGRATION_FROM_LEGACY_CLI.md`** (doplnit dle potreby pri vydani).
- [x] `QUI_CLIENT.md` § 10 (`push`) sjednoceno s `qui-config/v1` a `push.js`.
- [x] **`README.md`** (instalace, odkazy na `docs/CLI_MIGRATION.md` / `docs/MIGRATION_FROM_LEGACY_CLI.md`).

Akceptace:
- [ ] Dokumentace jako celek odpovida realne implementaci.

## Co jeste chybi proti `CLI_MIGRATION.md`

- [x] `init` parity se `sync-template` (diff + kolizni rozhodovani `overwrite|template-postfix|skip`).
- [x] `connect` strict parser parovani po poradi + duplicate `--repo` overwrite flow dle policy.
- [x] Full policy `ask` interaktivita pro `connect` (duplicitni repo), `init` template kolize, `npm install`/`uninstall` (readline; reject / non-interactive => exit `6`). Ostatni commandy dle potreby rozsirit.
- [x] `remove` doplnit npm uninstall plan.
- [x] `clone` uprava `@component` identifikace v kodu.
- [x] `verify/diff` CI mismatch rezim s exit `9`.
- [x] Cross-platform hardening: symlink escape (`realpath`), case-insensitive slug kolize, detailni `file://` normalizace.

Dokumentace (mimo striktni kontrakt `CLI_MIGRATION.md`):

- [x] `QUI_CLIENT.md` § 8.3 — poznamka, ze UX priklady jsou ilustrativni.
- [x] `qui-client` pripraveno k npm: `repository` / `homepage` / `keywords` / `engines`, `npm pack` OK; z korene `npm run publish:qui-client` (po `npm login`).
- [ ] Po vydani: overit stranku balicku na npm a pripadne upravit URL v `package.json` pri jinem remote.

## Doporucene poradi PR

1. Bootstrap + config vrstva.
2. Source resolver + parser pravidla.
3. Command migration (bez `generate-demo`, bez `clone`).
4. Dependency automation.
5. `init` unification.
6. `generate-demo`.
7. `clone` metadata kontrakt.
8. JSON report finalizace + cross-platform hardening.
9. Docs + release notes.
