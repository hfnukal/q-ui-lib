# CLI migration plan: zmeny oproti `QUI_CLIENT.md`

Tento dokument popisuje cilovy stav `qui-client` a explicitne uvadi zmeny oproti puvodnimu navrhu v `QUI_CLIENT.md`.

## Cilovy stav

- `qui-client` se instaluje jako `devDependency`, aby neovlivnoval velikost vysledne produkcni aplikace.
- Primarni instalace `qui-client` je v `demo` aplikaci, ne v root baliku.
- V root repozitari zustava pouze moznost orchestrace/prikazu pro update workflow.
- V demo projektu existuje `qui.config.json`.
- Vsechny prikazy `qui` cteni/zapis konfigurace delaji pres `qui.config.json` v kontextu demo app.
- Neni potreba drzet zpetnou kompatibilitu se starym `cli/index.js`.

## Zmeny oproti `QUI_CLIENT.md`

1. `root` sekce se odstranuje z `qui.config.json`.
2. Zdroj pravdy je pouze `repos`.
3. `targetPath` se presouva na top-level konfigurace (spolecny pro vsechna `repos`).
4. Neni `defaultRepo` fallback pres `root`; vyber zdroje je explicitni (`--repo`) nebo policy nad `repos`.
5. `url` a `path` se sjednocuji do jednoho pole `url`:
   - lokalni zdroj: `file://./`, `file://../`, `file:///abs/path`
   - vzdaleny git zdroj: `https://git.com/gitrepopath.git#main`
6. `ref` se nese vyhradne ve fragmentu `#<ref>` uvnitr `url`; samostatne `ref` ani CLI `--ref` nejsou podporovany.
7. `owner` koncept se nepouziva; zdroj je definovan jako `repo` + `uilib`.

## Konfigurace: `qui.config.json` jako source of truth

`qui-client` pouziva pouze config model s `repos` a `uilibs` (repo-url princip). Nezavadi se zadny `owner/set` namespace.

Pro demo app je preferovan relativni source do root knihovny, napr.:

- `repos.local-dev.url = "file://../"` (vuci `demo/`).

Minimalni kontrakt:

```json
{
  "configSchemaVersion": "qui-config/v1",
  "targetPath": "src/components/ui",
  "repos": {
    "local-dev": {
      "url": "file://../",
      "componentsRoot": "components",
      "uilibs": ["base", "web"],
      "connected": true
    },
    "origin-main": {
      "url": "https://git.com/gitrepopath.git#main",
      "componentsRoot": "components",
      "uilibs": ["base", "web"],
      "connected": true
    }
  }
}
```

Poznamka: `repo` reprezentuje zdroj; `url` muze byt `file://` i `https://`.

## Standard URL/ref pro Git

Doporuceny standard:

- Git URL s ref ve fragmentu: `<git-url>#<ref>`
  - branch: `https://git.com/org/repo.git#main`
  - tag: `https://git.com/org/repo.git#v1.2.0`
  - commit SHA: `https://git.com/org/repo.git#4f3c2b1`
- Bez fragmentu se pouzije implicitni default branch remote.

Poznamky ke standardu:

- Neni jeden univerzalni formalni RFC standard pro "git URL + branch/tag/sha" napric vsemi nastroji.
- De-facto standard v CLI nastrojich je pouzit normalni Git URL a `ref` predat separatne.
- Pro `qui-client` je zvolen interni kontrakt s `#ref`, protoze je jednoznacny a funguje stejne pro config i CLI vstup.
- Pri internim zpracovani se `url` parsuje na `remoteUrl` + `ref`.

## Rozhodnuti o scope

### Co se prenasi do `qui-client`

- `init` (vcetne behavioru, ktery dnes dela `sync-template`)
- `connect` - existuje v `qui-client`
- `add` - existuje v `qui-client`
- `update` - existuje v `qui-client`
- `remove` - existuje v `qui-client`
- `verify` - existuje v `qui-client`
- `diff`
- `push` - existuje v `qui-client`
- `generate` (meta generator musi byt soucasti `qui-client`)
- `generate-demo` (generovani demo routes a dokumentace z komentaru)
- `clone` (rozsireny o upravu metadat vcetne source pro budouci `push`)

## npmDependencies v `qui-client`

`qui-client` musi pro `add`/`update`:

1. analyzovat `npmDependencies` z `meta.generated.json` (vcetne transitivnich zavislosti),
2. porovnat s `dependencies` + `devDependencies` target projektu,
3. nabidnout instalaci (default `ask`),
4. podporit neinteraktivni instalaci (`--auto`, `--force`),
5. v `--dry-run` pouze reportovat bez mutace.

Rozsireni pro demo route:

- po uspesne instalaci zavislosti muze `qui-client` volitelne spustit `generate-demo`, pokud je aktivni prislusny flag/policy.

## `init` pokryva `sync-template`

Samostatny prikaz `sync-template` neni potreba zachovavat.

`qui init` musi:

- resit novy i existujici projekt,
- provadet template synchronizaci s diff+confirm politikou,
- osetrit kolize souboru (overwrite / qui-template varianta / skip dle policy),
- pripravit `qui.config.json`.

**Detekce rezimu:** prazdny `[dir]` → Qwik scaffold; Qwik bez `qui.config.json` → bootstrap (i s `qui-client` v `package.json`); Qwik s `qui.config.json` → jen sync sablon. Inicializaci znaci `qui.config.json`, ne devDependency `qui-client`.

## `generate-demo` v `qui-client`

`generate-demo` je soucast `qui-client` a ma generovat dokumentacni demo vrstvu podle nainstalovanych komponent.

Kontrakt:

1. Vychazi ze skutecne nainstalovanych komponent v `targetPath` (typicky `src/components/ui`).
2. Generuje strukturu routes pod `src/routes/qui-demo/...`.
3. Obsah stranky sklada z komentaru/JSDoc v komponentach (nazev, popis, ukazky API).
4. Doda i podpurne komponenty pod `src/components/demo/...`, ktere slouzi pro jednotne vykresleni dokumentace.
5. Je deterministicky (stejne vstupy -> stejny vystup).

## `clone` v `qui-client` (novy kontrakt)

`clone` musi kopirovat existujici komponentu v ramci zvoleneho repo/uilib a zaroven:

- upravit identifikator komponenty (napr. JSDoc `@component`),
- aktualizovat `meta.generated.json`,
- doplnit/aktualizovat source metadata (`quiSource.repo/url/ref/sourcePath/installedAt`),
- zachovat konzistenci tak, aby slo komponentu nasledne `qui push`nout bez rucnich oprav.

## Architektura balíčku `qui-client` (kořen repozitáře)

```text
  package.json
  bin/
    qui.js
  src/
    cli.js
    commands/
      init.js
      connect.js
      add.js
      update.js
      remove.js
      verify.js
      diff.js
      push.js
      generate.js
      generate-demo.js
      clone.js
    services/
      config.js
      source-resolver.js
      dependency-graph.js
      npm-dependencies.js
      apply-plan.js
```

## Implementacni faze

1. **Core bootstrap**
   - `src/cli.js` jako jediny entrypoint.
   - zrusit zavislost na root `cli/index.js`.
2. **Config-first flow**
   - plna validace a cteni `qui.config.json`.
   - `connect/init` zapisuje pouze `repos` (bez `root`).
   - parser `url` -> `remoteUrl/ref` (`file://` i `https://`).
3. **Command migration**
   - prenest `connect/add/update/remove/verify/diff/push`.
   - prenest `generate`.
   - prenest `generate-demo` (routes + demo komponenty).
4. **Init unification**
   - absorbovat behavior `sync-template` do `init`.
5. **Clone upgrade**
   - implementovat clone + metadata/source update dle noveho kontraktu.
6. **Deps automation**
   - npmDependencies: warn + optional install (`ask/auto/force`).
7. **Stabilization**
   - smoke testy + determinismus planu.

## Definition of Done

Migrace je hotova, pokud plati:

1. `qui` funguje pouze z `qui-client` a nepouziva root `cli/index.js`.
2. `qui.config.json` je jediny konfig source.
3. `root` sekce neni potrebna ani pouzivana.
4. `generate` je dostupny v `qui-client`.
5. `generate-demo` je dostupny v `qui-client` a generuje `src/routes/qui-demo/...` + `src/components/demo/...`.
6. `init` funkcne pokryva use-case puvodniho `sync-template`.
7. `clone` aktualizuje komponentu i metadata tak, aby slo nasledne `push`.
8. `add/update` umi npmDependencies nejen detekovat, ale i instalovat dle policy.
9. `repo` selector (`repo` nebo `repo/uilib`) funguje pro oba source (`file://` i git URL).
10. `url` s `#ref` je plne podporovany v configu i CLI.

## Stav vuci `QUI_CLIENT.md` a aktualnímu `qui-client`

Aktualni stav implementace:

- `bin/qui.js` načítá `src/cli.js` (canonical entrypoint).
- Legacy root `cli/index.js` byl z repozitáře odstraněn.
- Tento dokument popisuje kontrakt CLI (`qui-config/v1`, exit kody, flagy); zdroj je v `src/` v kořeni repa.

Rozdily vuci puvodnimu `QUI_CLIENT.md`:

- `root` a `defaultRepo` se zcela rusi (repos-only schema).
- `ref` je canonical v `url` fragmentu (`#ref`), samostatny `ref` klic ani `--ref` se nepouzivaji.
- `generate-demo` cilenne nevytvari `src/routes/components/*`, ale `src/routes/qui-demo/*` (demo app jako samostatna aplikace).
- politika interaktivity je sjednocena globalne napric commandy.

## Finalni CLI API kontrakty

Globalni prepinace (pro vsechny mutacni commandy):

- `--on-error <ask|warn|fail>` (default `ask`)
- `--auto` (defaultni odpoved "ano" na bezpecne navrzene kroky)
- `--force` (non-interactive mutacni rezim, viz policy model)
- `--dry-run` (nikdy nemutuje fs/git/npm)
- `--yes` (potvrdi plan, ale nenahrazuje validacni chyby)

Prikazy:

- `qui init [--repo <repo>] [--url <url>] [--target-path <path>] [--on-error ...] [--auto|--force|--dry-run|--yes]`
- `qui connect --repo <repo> --url <url> [--components-root <path>] [--uilibs <a,b,c>] [--connected <true|false>]`
  - Jediny podporovany format je opakovani cele dvojice `--repo ... --url ...` ve stejnem poradi.
  - Parsuje se po poradi argumentu; kazdy `--repo` musi byt nasledovan `--url` pred dalsim `--repo`.
  - `--components-root`, `--uilibs`, `--connected` se aplikuji globalne pro vsechny repo zaznamy vytvorene v danem volani.
- `qui add <component...> [--repo <repo|repo/uilib>] [--all] [--on-error ...] [--auto|--force|--dry-run|--yes]`
- `qui update [component...] [--repo <repo|repo/uilib>] [--all] [--on-error ...] [--auto|--force|--dry-run|--yes]`
- `qui remove [component...] [--repo <repo|repo/uilib>] [--all] [--on-error ...] [--auto|--force|--dry-run|--yes]`
- `qui verify [component...] [--repo <repo|repo/uilib>] [--json]`
- `qui diff [component...] [--repo <repo|repo/uilib>] [--json]`
- `qui generate`
- `qui generate-demo [component...] [--target-path <path>] [--route-base /qui-demo]`
- `qui clone <source-component> <new-component> [--repo <repo/uilib>] [--on-error ...] [--auto|--force|--dry-run|--yes]`
- `qui push <component...> --repo <repo/uilib> [--base-branch <branch>] [--title <title>] [--dry-run]`

Parser pravidla:

1. `--repo` podporuje tvary `<repo>` i `<repo>/<uilib>`.
2. `connect` vyzaduje stridani argumentu po dvojicich: `--repo <repo> --url <url>`.
3. `connect` odmita `--url` bez predchoziho `--repo`.
4. `connect` odmita `--repo` bez nasledujiciho `--url`.
5. `--all` se nesmi kombinovat s explicitnim seznamem komponent.
6. `add --all` bez `--repo` je chyba.
7. `remove --all` bez `--repo` je chyba.
8. `verify` a `diff` jsou read-only commandy (mutacni flagy ignoruji s warningem).
9. Pokud neni zadano `--repo`, nastroj vybira zdroj podle poradi v `qui.config.json > repos` (deterministicky prvni zaznam v poradi klicu).
10. Pokud neni zadano `--repo` a `repos` je prazdne nebo neobsahuje pouzitelny zaznam, command failne jako config/schema error (exit `3`).
11. Pokud `connect` dostane duplicitni `--repo <name>` v ramci jednoho volani, nastroj musi nabidnout `overwrite` existujiciho repo zaznamu (v `ask` rezimu prompt, v `--auto` default `overwrite`, v `--force` automaticky `overwrite`, v `onError=fail` bez potvrzeni fail exit `5`).

Priklady `connect`:

Valid:

- `qui connect --repo local-dev --url file://../ --components-root components --uilibs base,web --connected true`
- `qui connect --repo local-dev --url file://../#main --repo origin-main --url https://github.com/honzicekdev/q-ui-lib.git#main --components-root components --uilibs base,web --connected true`

Invalid:

- `qui connect --repo local-dev --repo origin-main --url file://../ --url https://github.com/honzicekdev/q-ui-lib.git#main` (repo bloky nejsou parovane v poradi)
- `qui connect --url file://../ --repo local-dev` (`--url` bez predchoziho `--repo`)
- `qui connect --repo local-dev` (chybi povinne `--url`)

## Jednoznacne schema `qui.config.json`

### JSON schema (verze v1)

```json
{
  "$schema": "https://json-schema.org/draft/2020-12/schema",
  "$id": "https://q-ui-lib.dev/schemas/qui-config-v1.json",
  "title": "qui config v1",
  "type": "object",
  "additionalProperties": false,
  "required": ["configSchemaVersion", "targetPath", "repos"],
  "properties": {
    "configSchemaVersion": {
      "type": "string",
      "const": "qui-config/v1"
    },
    "targetPath": {
      "type": "string",
      "minLength": 1,
      "description": "Relativni cesta vuci rootu aplikace, typicky src/components/ui"
    },
    "policy": {
      "type": "object",
      "additionalProperties": false,
      "properties": {
        "onError": { "type": "string", "enum": ["ask", "warn", "fail"] },
        "interactive": { "type": "boolean" },
        "npmInstallMode": { "type": "string", "enum": ["ask", "auto", "force"] },
        "packageManager": { "type": "string", "enum": ["auto", "npm", "pnpm", "yarn", "bun"] }
      }
    },
    "repos": {
      "type": "object",
      "minProperties": 1,
      "additionalProperties": {
        "type": "object",
        "additionalProperties": false,
        "required": ["url", "componentsRoot", "uilibs", "connected"],
        "properties": {
          "url": {
            "type": "string",
            "minLength": 1,
            "pattern": "^(file://.+|https?://.+|ssh://.+|git@.+:.+)(#.+)?$",
            "description": "Canonical source URL, optional #ref"
          },
          "componentsRoot": { "type": "string", "minLength": 1 },
          "uilibs": {
            "type": "array",
            "minItems": 1,
            "items": { "type": "string", "minLength": 1 },
            "uniqueItems": true
          },
          "connected": { "type": "boolean" }
        }
      }
    }
  }
}
```

### Priklad: demo aplikace

```json
{
  "configSchemaVersion": "qui-config/v1",
  "targetPath": "src/components/ui",
  "policy": {
    "onError": "ask",
    "interactive": true,
    "npmInstallMode": "ask",
    "packageManager": "auto"
  },
  "repos": {
    "local-dev": {
      "url": "file://../#main",
      "componentsRoot": "components",
      "uilibs": ["base", "web"],
      "connected": true
    }
  }
}
```

### Priklad: samostatna aplikace (plna konfigurace)

```json
{
  "configSchemaVersion": "qui-config/v1",
  "targetPath": "src/components/ui",
  "policy": {
    "onError": "warn",
    "interactive": true,
    "npmInstallMode": "auto",
    "packageManager": "pnpm"
  },
  "repos": {
    "origin-main": {
      "url": "https://github.com/honzicekdev/q-ui-lib.git#main",
      "componentsRoot": "components",
      "uilibs": ["base", "web", "marketing"],
      "connected": true
    },
    "origin-v1": {
      "url": "https://github.com/honzicekdev/q-ui-lib.git#v1.9.0",
      "componentsRoot": "components",
      "uilibs": ["base"],
      "connected": false
    },
    "team-design": {
      "url": "ssh://git@github.com/acme/design-system.git#develop",
      "componentsRoot": "packages/ui/components",
      "uilibs": ["core", "admin"],
      "connected": true
    }
  }
}
```

## Ref precedence pravidla

`ref` je optional a nese se pouze v `url` jako `#ref`.

Pravidla:

1. Pokud `url` obsahuje `#ref`, pouzije se tento ref.
2. Pokud `url` `#ref` neobsahuje, pouzije se default branch remote.
3. CLI nepodporuje samostatny `--ref` ani `repos.<repo>.ref`.
4. Pri internim zpracovani se `url` parsuje na `{ remoteUrl, ref? }`; pri serializaci zpet do configu zustava canonical tvar s `#ref` jen pokud je ref znamy.

## `targetPath` precedence pravidla

`targetPath` je povinne pole v `qui.config.json` a je vychozi source of truth.

Pravidla:

1. Pokud command podporuje `--target-path` a flag je zadan, ma `--target-path` prednost pred hodnotou z konfigurace.
2. Pokud `--target-path` neni zadan, pouzije se `targetPath` z `qui.config.json`.
3. Pri mutacnim commandu musi byt vysledna hodnota `targetPath` relativni vuci rootu aplikace; absolutni path je config/parser error (exit `3` nebo `2` podle zdroje chyby).
4. Finalni vyhodnocena hodnota `targetPath` se ma propsat do plan/report vrstvy (kvuli auditovatelnosti `--dry-run`).

## JSON vystupni kontrakt (`--json`) - navrh variant

Cil: stabilni strojove citeny vystup pro CI a skripty. Doporucena je varianta A; varianta B je minimalisticka fallback moznost.
`--json` je povinny kontrakt pro vsechny commandy (`init`, `connect`, `add`, `update`, `remove`, `verify`, `diff`, `generate`, `generate-demo`, `clone`, `push`).

### Varianta A (doporucena): envelope + typed events

Spolecny envelope:

```json
{
  "schemaVersion": "qui-report/v1",
  "command": "verify",
  "ok": true,
  "exitCode": 0,
  "repoSelector": "local-dev/base",
  "targetPath": "src/components/ui",
  "summary": {
    "checked": 12,
    "changed": 0,
    "warnings": 0,
    "errors": 0
  },
  "items": [],
  "warnings": [],
  "errors": [],
  "timestamp": "2026-04-21T12:00:00.000Z"
}
```

`verify --json`:

- `items[]` obsahuje vysledky validace komponent:
  - `component`, `status` (`ok|warning|error`), `code`, `message`, optional `details`.
- Pokud je alespon jedna `error`, `ok=false` a command vraci exit `9` v CI rezimu.

`diff --json`:

- `items[]` obsahuje navrzene zmeny:
  - `component`, `action` (`add|update|remove|noop`), `files[]`, `dependencies`.
- `files[]` ma `path`, `changeType` (`create|modify|delete`), optional `hunks` summary.
- Pri nesouladu v CI rezimu `ok=false`, exit `9`.

Mutacni commandy (`init`, `connect`, `add`, `update`, `remove`, `generate`, `generate-demo`, `clone`, `push`) v `--json` vraci:

- `items[]` jako seznam aplikovanych/navrzenych kroku planu:
  - `action` (`create|modify|delete|install|uninstall|noop`), `target`, `status` (`planned|applied|skipped|failed`), optional `details`.
- `summary` alespon `planned`, `applied`, `skipped`, `failed`.
- `ok=false` pokud existuje `failed` krok; exit kod dle typu chyby (`5`, `7`, `8`, ...).

Read-only commandy (`verify`, `diff`) zachovavaji specializovany tvar `items[]` dle vyse, ale stale uvnitr stejneho envelope.

### Varianta B (minimal): command-specific shape bez envelope

- `verify --json` vraci pouze pole nalezu.
- `diff --json` vraci pouze pole navrzenych zmen.
- Mene vhodne pro dlouhodobou kompatibilitu; chybi jednotne pole `schemaVersion`, `ok`, `summary`, `timestamp`.

Rozhodnuti:

- Pro implementaci je canonical kontrakt Varianta A (`qui-report/v1`).
- Varianta B neni soucasti implementacniho scope a slouzi pouze jako historicka/teoreticka alternativa.

## Exit kody a typy chyb

| Exit code | Typ chyby | Kdy nastava |
|---|---|---|
| `0` | Success | Command probehl uspesne. |
| `1` | Unexpected runtime error | Neosetrena interni chyba (bug, neocekavany stav). |
| `2` | Usage / parser error | Neplatna kombinace argumentu, chybejici povinny argument, neplatny prikaz. |
| `3` | Config/schema error | Neplatny nebo chybejici `qui.config.json`, schema validace fail. |
| `4` | Source/git/network error | Nedostupny remote, auth chyba, neexistujici ref, selhani fetch/clone po retry. |
| `5` | Policy fail-stop | `onError=fail` ukonci command na prvnim relevantnim konfliktu/chybe. |
| `6` | User rejected plan | V `ask` flow uzivatel odmitne navrzeny plan/mutaci. |
| `7` | Scope/safety violation | Pokus o zapis mimo app root, symlink escape, poruseni scope guard. |
| `8` | Dependency install error | Selhani instalace/uninstall npm dependencies. |
| `9` | Verification/diff mismatch | `verify`/`diff --json` hlasi nesoulad a command ma failnout dle kontraktu CI rezimu. |

## Policy model pro interaktivitu

Default policy:

- `onError=ask`
- `interactive=true`
- `npmInstallMode=ask`

Precedence:

1. CLI flagy
2. `qui.config.json > policy`
3. default hodnoty nastroje

Semantika:

- `ask`: interaktivni dotaz, pri odmitnuti exit code `6`.
- `warn`: pokracovat best-effort, zapsat warning do reportu.
- `fail`: okamzity konec na prvni relevantni chybe/policy konfliktu (exit `5`).
- `--auto`: nastavi `interactive=true`, ale automaticky potvrzuje "safe" kroky (install npm deps, overwrite podle planu).
- `--force`: nastavi `interactive=false`, `onError=warn`, `npmInstallMode=force`; stale plati hard stop pravidla (zadny zapis mimo plan/scope).
- `--dry-run`: vypise plan a policy rozhodnuti, bez mutaci.

## `generate-demo` vystupni kontrakt

`generate-demo` tvori demo vrstvu v aktualni aplikaci (typicky po `qui init`) a nevynucuje vazbu na puvodni `demo/` workspace v repozitari.

Vystup:

1. Route strom pod `src/routes/qui-demo/`.
2. Podpurne komponenty pod `src/components/demo/`.
3. Home route `src/routes/qui-demo/index.tsx`.
4. Layout route `src/routes/qui-demo/layout.tsx`.
5. Komponentove route `src/routes/qui-demo/components/<slug>/index.tsx`.

Obsahovy kontrakt:

- struktura a UX vychazi z aktualniho stavu `demo/src/components/demo`, `demo/src/routes/components`, `demo/src/routes/index.tsx`, `demo/src/routes/layout.tsx`,
- importy se prepocitaji na cilovy route base `"/qui-demo"`,
- layout pouziva `import.meta.glob("./components/*/index.tsx")` relativne k `src/routes/qui-demo/layout.tsx`,
- fallback na metadata zustava `src/components/ui/*/meta.generated.json`,
- vystup je deterministicky (stabilni razeni komponent podle slug).

Kolize:

- existujici soubory v `src/routes/qui-demo/**` a `src/components/demo/**` resi stejna policy vrstva (`ask|warn|fail`, `--auto`, `--force`).
- generator nikdy nemaze soubory mimo `src/routes/qui-demo/**`.

## Upgrade/migracni behavior existujicich projektu

Pri `init`/sync kroku nad existujicim projektem se kazda kolize souboru resi jednotne:

1. Nastroj zobrazi diff mezi existujicim a sablonovym souborem.
2. Uzivatel (nebo policy) zvoli jednu z moznosti:
   - `overwrite`: prepsat existujici soubor sablonou.
   - `template-postfix`: ulozit sablonu jako novy soubor se suffixem `-template` pred priponou (napr. `layout-template.tsx`).
   - `skip`: ponechat existujici soubor beze zmeny.
3. V `--auto` rezimu je default pro safe soubory `overwrite`, pri rizikovych kolizich `template-postfix`.
4. V `--force` rezimu se pouzije `overwrite`, ale stale plati scope guard a schema validace.
5. V `--dry-run` se pouze vypise diff + navrzena akce bez zapisu.

## `clone` metadata specifikace

Po `qui clone <src> <dest>` musi mit cilova komponenta validni `meta.generated.json` s timto minimalnim kontraktem:

```json
{
  "metaSchemaVersion": "qui-meta/v1",
  "name": "my-button",
  "version": "0.0.0-local",
  "dependencies": [],
  "npmDependencies": [],
  "quiSource": {
    "repo": "extended/base",
    "url": "https://github.com/honzicekdev/q-ui-lib.git#main",
    "sourcePath": "components/base/my-button",
    "installedAt": "2026-04-21T10:32:00.000Z",
    "originComponent": "button",
    "clonedAt": "2026-04-21T10:32:00.000Z",
    "cloneDepth": 1
  }
}
```

Semantika poli:

- `quiSource.repo`: selector `<repo>/<uilib>` pouzity pro clone.
- `quiSource.url`: canonical source URL vcetne optional `#ref`.
- `quiSource.sourcePath`: absolutni logicka cesta zdroje komponenty v repu.
- `quiSource.installedAt`: cas posledniho uspesneho `add|update|clone` zapisu komponenty.
- `quiSource.originComponent`: puvodni slug, ze ktereho clone vznikl.
- `quiSource.clonedAt`: cas posledni clone operace.
- `quiSource.cloneDepth`: `1` pri prvnim clone, inkrement pri clone z uz klonovane komponenty.

Kdy se aktualizuje:

1. `clone`: prepise `name`, `sourcePath`, `installedAt`, `originComponent`, `clonedAt`, `cloneDepth`.
2. `update`: prepise `installedAt`, muze zmenit `url`/`sourcePath` pri `--repo` migraci.
3. `push`: metadata v komponentach nema menit, pouze validovat.

## Cross-platform a edge cases

Path/URL normalizace:

- `file://` URL podporuje:
  - relativni `file://../` (vuci project root),
  - absolutni POSIX `file:///Users/me/lib`,
  - absolutni Windows `file:///C:/work/lib`.
- Canonical serializace:
  - absolutni local path se do configu zapisuje jako `file:///...`,
  - relativni local path muze vstoupit jako `file://../`, ale po normalizaci se serializuje canonicalne dle zvolene policy (doporuceno `file:///...` pro jednoznacnost napric OS).
- pri cteni configu se vse normalizuje na interni absolutni path + canonical URL tvar.
- symlink targety jsou povolene jen pokud po `realpath` zustavaji v povolenem scope operace.

Filesystem:

- porovnavani slugu je case-insensitive, ale zapis canonical kebab-case.
- pri kolizi slugu lisicich se jen case (`Button` vs `button`) plati policy `ask|warn|fail`.
- atomicke zapisy configu a metadata (`write temp -> rename`).

Git/network:

- nedostupny remote/auth error => exit `4`.
- neexistujici ref ve `url#ref` => exit `4`.
- pri transient network error jednou retry, pak fail (bez partial mutace).

Package manager:

- autodetekce pres lockfile (`pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`, `bun.lockb`).
- pokud lockfile chybi nebo tool neni dostupny v `PATH`, fallback `npm` + warning.

Bezpecnost/scope:

- zadny command nesmi zapisovat mimo root aktualni aplikace (vyjimka je explicitni git push flow do temp working dir).
- `--force` nikdy neobchazi schema validaci ani scope guard.

## Detailni test plan

### A) Kontrakty parseru a configu

1. `connect` s vice `--repo` + vice `--url` pary (valid + invalid mapovani).
2. validace `url` tvaru: `file://`, `https://`, `ssh://`, `git@...`, optional `#ref`.
3. schema reject na unknown key a chybejici required pole.
4. `targetPath` relativni vs absolutni (absolutni musi fail).

### B) Source resolution a precedence

5. `url#ref` pouzity jako source of truth.
6. `url` bez `#ref` -> default branch resolution.
7. potvrzeni, ze `--ref` neni podporovan (parser error).
8. `add/update/diff` source vyber dle `--repo` -> metadata -> repos policy.

### C) Interaktivita a policy

9. `ask` flow: uzivatel rejectne plan -> exit `6`, bez mutace.
10. `warn` flow: konflikt zalogovan, command pokracuje best-effort.
11. `fail` flow: prvni konflikt ukonci command exit `5`.
12. `--auto` potvrdi install npm deps a safe overwrite.
13. `--force` bezi bez promptu, ale stale respektuje scope guard.
14. `--dry-run` negeneruje zadne fs/git/npm mutace.

### D) Command behavior

15. `init` novy projekt + existujici projekt (template sync, kolize, policy).
16. `add` single + transitivni dependencies + npmDependencies agregace.
17. `update --all` nad instalovanymi komponentami.
18. `remove` reverzni dependency guard + npm uninstall plan.
19. `verify --json` schema vystupu + exit kody.
20. `diff` vypis planu bez mutace.
21. `generate` deterministicke `meta.generated.json`.
22. `clone` aktualizuje `@component` a metadata kontrakt.
23. `push` pracuje jen pro jeden `repo/uilib`, validuje scope.

### E) `generate-demo` kontrakt

24. vytvori `src/routes/qui-demo/index.tsx`.
25. vytvori `src/routes/qui-demo/layout.tsx`.
26. vytvori `src/routes/qui-demo/components/<slug>/index.tsx` pro vsechny komponenty.
27. vytvori/aktualizuje `src/components/demo/*` helpery.
28. nevytvari nic pod `src/routes/components/*`.
29. opakovane spusteni je idempotentni (bez diffu pokud vstupy beze zmeny).

### F) Cross-platform

30. path testy na macOS/Linux/Windows pro `file://` URL.
31. case-insensitive slug kolize.
32. symlink escape pokus (musi fail policy/scope guard).
33. lockfile-driven package manager detekce + fallback.

## Umisteni instalace

- `qui-client` se instaluje jako `devDependency` v `demo/package.json`.
- Kořenový balíček je **`qui-client`**; runtime závislosti CLI jsou minimální (např. `ts-morph`). Komponenty v `components/` nejsou součástí publikovaného tarballu (`files` v `package.json`), pokud je výslovně nerozšíříte.
- Root muze poskytovat pouze pomocne skripty, ktere deleguji do demo workspace (napr. update flow).

## Doplneni k `QUI_CLIENT.md` (co aktualizovat)

Aby byly dokumenty konzistentni, je potreba v `QUI_CLIENT.md` upravit:

1. schema `qui.config.json`:
   - odstranit povinne `root.*`,
   - odstranit povinne `defaultRepo`,
   - ponechat pouze `repos`.
2. validacni pravidla:
   - `repos.<repo>.url` je povinne,
   - `repos.<repo>.componentsRoot`, `repos.<repo>.uilibs` zustavaji,
   - `targetPath` je povinne top-level pole konfigurace.
3. source prioritu:
   - nahradit odkazy na `root.url/ref/sourceType` modelem `repos` only.
4. CLI kontrakty:
   - `connect` uz nevyzaduje samostatny `--path`; lokalni source je `--url file:...`.
   - `--ref` neni podporovan; canonical i jediny podporovany zapis ref je `--url ...#ref`.

## Poznamka k release

Neprovadi se kompat vrstva se starym CLI. Dokumentace i release notes maji komunikovat, ze novy standard je `qui-client` + `qui.config.json` (repos-only schema).

## Breaking changes (vypis)

1. Neni kompat vrstva se starym root CLI (`cli/index.js`); canonical je `qui-client`.
2. `qui.config.json` je jediny source of truth; `root.*` sekce je odstranena.
3. `defaultRepo` je odstraneno; fallback vyber repo je deterministicky prvni zaznam v `repos`.
4. `ref` je podporovan pouze jako fragment v `url` (`#ref`); samostatny `ref` klic ani CLI `--ref` neexistuji.
5. `connect` nepodporuje legacy `--path`; lokalni zdroj se definuje pouze pres `--url file://...`.
6. `connect` argumenty jsou striktne parovane po dvojicich `--repo <repo> --url <url>`.
7. Pri duplicitnim `repo` v `connect` se explicitne resi overwrite flow podle policy (neni tichy merge).
8. Demo routes se generuji pod `src/routes/qui-demo/**` (ne pod `src/routes/components/**` ani `src/routes/demo/**`).
9. `--json` je povinny podporovany vystupni rezim pro vsechny commandy se schema envelope `qui-report/v1`.
10. `--force` nikdy neobchazi schema validaci a scope guard (nelze vynutit nevalidni config nebo zapis mimo scope).