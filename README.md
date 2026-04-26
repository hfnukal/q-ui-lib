# qui-client

**Kořen tohoto repozitáře je npm balíček `qui-client`:** CLI **`qui`** a kanonické zdroje Qwik UI komponent v **`components/`**. Do aplikace se komponenty berou jako **zdrojový kód** (kopie do `targetPath`), synchronizace probíhá z Git repozitářů podle `qui.config.json`.

## Quick start

```bash
# In your app
npm i -D qui-client

# Initialize config + template files
npx qui init

# Add source components
npx qui add button input
```

Při vývoji **v tomto repozitáři** (clone monorepa):

```bash
npm install
npm run qui -- <command> [options]
```

## CLI (`qui`)

Aktualni prikazy:

- `init` - vytvori/aktualizuje `qui.config.json` a synchronizuje app template soubory.
- `connect` - prida nebo upravi repozitare v `qui.config.json`.
- `verify` - overi konfiguraci a stav pripojeni vybraneho repozitare.
- `diff` - zatim minimalni diff report (stav migrace).
- `add` - prida komponenty do `targetPath` a doplni zavislosti (vcetne npm deps).
- `update` - prepise nainstalovane komponenty novejsim zdrojem.
- `remove` - odstrani komponenty a pripadne odebere nepouzivane npm zavislosti.
- `generate` - regeneruje `meta.generated.json` pro komponenty v `targetPath` (podle `index.tsx`/`index.ts`).
- `generate-demo` - synchronizuje demo template soubory a vygeneruje/aktualizuje demo routes v `src/routes/<route-base>/components/...` pro nainstalovane komponenty.
- `clone` - naklonuje lokalne nainstalovanou komponentu pod novym jmenem.
- `push` - pushne upravene komponenty z aplikace zpet do remote Git repozitare.

## `qui.config.json` (schema `qui-config/v1`)

CLI pracuje nad konfiguraci v koreni aplikace:

```json
{
  "configSchemaVersion": "qui-config/v1",
  "targetPath": "src/components/ui",
  "repos": {
    "local-dev": {
      "url": "file://../",
      "componentsRoot": "components",
      "uilibs": ["base"],
      "connected": true
    }
  }
}
```

Poznamky:

- `targetPath` musi byt relativni cesta.
- `repos.<name>.url` podporuje `file://`, `http(s)://`, `ssh://` a `git@...`.
- Vyber zdroje probiha pres `--repo <repo>` nebo `--repo <repo>/<uilib>` (u `push` povinne `<repo>/<uilib>`).
- Kazdy `repo` muze obsahovat vice `uilib` (pole `repos.<name>.uilibs`).

## Repo vs ui-lib + vyhledavani komponent

- `repo` je zdrojovy Git repozitar (odkud se komponenty ctou).
- `uilib` je namespace/sada komponent uvnitr jednoho repo (napr. `base`, `web`).
- Kdyz zavolas `qui add button` bez `--repo`, CLI pouzije prvni repo z konfigurace a v nem prvni `uilib`, kde komponentu najde.
- Kdyz zavolas `qui add web/button`, komponenta se hleda primo v `uilib` `web` (v ramci vybraneho repo).
- Kdyz zavolas `qui add --repo mycommon web/button`, urcis zaroven repo (`mycommon`) i `uilib` (`web`).
- Pri `add` se zavislosti z `meta.generated.json` (`dependencies` a `npmDependencies`) doplni automaticky.
- Stejny princip specifikace komponent (`button` vs `web/button`) i vyberu zdroje (`--repo`) plati i pro `update` a `remove`.

## `base`, `qui-demo` a generovana demo aplikace

- **`base`** je zakladni `uilib` (komponenty ve stylu shadcn) — ocekava se, ze na nem mohou stavet dalsi sady (`qui-demo`, vlastni `uilib`). Pro **plnou referencni demo** proto dava smysl mit v cilove aplikaci **cely `base`** (ne jen vyber).
- **`qui-demo`** obsahuje podpurne komponenty pro generovanou demo (layout, index prikladu atd.) a **vazi se na `base`**. Do `qui.config.json` v danem repu proto patří oba namespace v `repos.<name>.uilibs`, napr. `["base", "qui-demo"]`.
- **`templates/demo`** (v tomto repu u kořene balíčku) nejsou „hotova demo aplikace“, ale **podklady pro CLI** — z nich `generate-demo` sklada soubory v cilove Qwik aplikaci.
- **`generate-demo`** z komponent uz pridanych v `targetPath` vytvori demo routy a priklady; **texty prikladu** bere z **JSDoc** u komponent (kde to generator podporuje).

### Typicka sekvence: init → vsechny komponenty pro demo → generate-demo

1. **`qui init`** — `qui.config.json` + synchronizace sablon do aplikace (viz `init` vyse).
2. **`qui add --repo <repo> --all`** — prida **vsechny** komponenty ze **vsech** `uilib` uvedenych u toho repa v konfiguraci. Pro demo s celym `base` a shellem z `qui-demo` nejprve nastavte `uilibs` na `base` i `qui-demo`, pak spuste `add --all`. **Povinny je flag `--repo`** (bez nej `--all` neprojde). Alternativa: pridavat jen vybrane komponenty, napr. `qui add button input`.
3. **`qui generate-demo`** — napr. s `--route-base /qui-demo` vygeneruje/aktualizuje demo routy pro jiz nainstalovane komponenty.

Pro udrzeni prehlednosti zde zustavaji **kanonicke CLI prikazy**; volitelne npm skripty (napr. jednim prikazem regenerovat ukazkovou aplikaci) mohou tyto kroky obalit **jen pro vyvoj v tomto repozitari** — viz [CONTRIBUTING.md](CONTRIBUTING.md).

## Nejbeznejsi priklady

```bash
# 1) Initialize config
npx qui init --repo local-dev --url file://../ --target-path src/components/ui

# 2) Connect remote repo
npx qui connect --repo acme --url https://github.com/acme/ui-kit.git

# 3) Add/update/remove components
npx qui add button accordion
npx qui update --all
npx qui remove accordion

# 4) Metadata + demo routes
npx qui generate
npx qui generate-demo --route-base /qui-demo

# 5) Verify / diff
npx qui verify --repo acme
npx qui diff --repo acme --ci
```

## Global flags

Podporovane globalni flagy v aktualnim parseru:

- Bool: `--auto`, `--force`, `--dry-run`, `--yes`, `--json`, `--all`, `--ci`
- Value: `--on-error`, `--repo`, `--url`, `--target-path`, `--components-root`, `--uilibs`, `--connected`, `--base-branch`, `--title`, `--route-base`, `--branch`, `--routes-dir`, `--components-dir`

## Skripty v tomto repozitáři

V kořenovém `package.json`:

- `npm run qui -- ...` — spustí `qui` CLI (`node ./bin/qui.js`).
- `npm test` — testy CLI (`test/*.test.js`).
- `npm run generate-meta` — regenerace `meta.generated.json` pro zdroje v `./components`.
- `npm publish` — publikace balíčku `qui-client` (obsah tarballu řídí pole `files` v `package.json`).

## Related docs

- [CONTRIBUTING.md](CONTRIBUTING.md)
- [CLAUDE.md](CLAUDE.md)
- [docs/CLI_MIGRATION.md](docs/CLI_MIGRATION.md)
- [docs/MIGRATION_FROM_LEGACY_CLI.md](docs/MIGRATION_FROM_LEGACY_CLI.md)
- [docs/QUI_CLIENT.md](docs/QUI_CLIENT.md)
