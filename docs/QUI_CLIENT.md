# QUI Client - navrh balicku a distribuce

Tento dokument popisuje, jak vytvorit minimalni npm balicek `qui-client` (CLI klient), ktery:

- umi stahovat komponenty primo z Git repozitare (registry repo),
- umi inicializovat novy projekt i aktualizovat existujici Qwik projekt,
- pred zapisem zmen zobrazi diff a pocka na potvrzeni,
- umi z lokalnich oprav vytvorit branch, commit, push a idealne i Pull Request.

## 1) Cile a principy

- **Minimalni balicek**: obsahuje jen CLI klienta (`qui`), bez komponent samotnych.
- **Zdroj pravdy je Git**: komponenty se berou z `index.tsx` + metadata (`meta.generated.json`) v registry repo.
- **Podpora vlastnich repozitaru**: stejny format registry muze mit `q-ui-lib` i jine firemni repo.
- **Vychozi source**: klient po instalaci predvyplni defaultni repo podle puvodniho Git zdroje, ze ktereho byl klient publikovan/instalovan.
- **Bezpecne zmeny**: pred kazdym prepisem se ukaze diff a uzivatel potvrdi aplikaci zmen.
- **Contribution flow**: opravy komponent jde snadno pushnout zpet do zdrojoveho repo jako PR.

### 1.1) Implementace v kořeni repozitáře (canonical)

V tomto repozitáři je zdroj pravdy pro CLI balíček **`qui-client` přímo v kořeni** (npm `name`: `qui-client`): binárka **`qui`** (`bin/qui.js` → `src/cli.js`). Legacy `cli/index.js` v kořeni byl odstraněn.

**Konfigurace** — soubor **`qui.config.json`** ve schema **`qui-config/v1`**: povinne `configSchemaVersion`, `targetPath` (relativni), `repos` (min. jeden zaznam). Volitelne `policy` (`onError`, `interactive`, `npmInstallMode`, …). Kazdy zaznam v `repos` ma `url`, `componentsRoot`, `uilibs`, `connected`. Vetve nebo tag u Git URL se uvadeji jako **`#ref` primo v retezci `url`** (napr. `https://github.com/org/repo.git#main`); samostatny prepinac **`--ref` neni podporovan** a CLI ho odmitne.

**Vystup** — s **`--json`** plati obalka **`qui-report/v1`** (schema, `command`, `ok`, `exitCode`, `summary`, `items`, `warnings`, `errors`). Kompletni exit kody a chovani policy (`ask` / readline, CI rezim u `verify`/`diff`, …) jsou popsany v **`CLI_MIGRATION.md`**.

**Prikazy** (minimalne): `init`, `connect`, `verify`, `diff`, `add`, `update`, `remove`, `generate`, `generate-demo`, `clone`, `push`. Globalni flagy zahrnuji napr. `--repo`, `--on-error`, `--dry-run`, `--yes`, `--auto`, `--force`, `--json`.

**`--dry-run`** (orientacne): u **`connect`** se konfigurace neprepise (pouze plan v reportu; pri kolizi existujiciho `--repo` a `onError=ask` se v dry-run neinteraktivne nepromptuje). U **`init`**, **`generate`** (ts-morph v `scripts/generate-meta.mjs`) a **`generate-demo`** plati chovani popsane v implementaci; u operaci s npm zavislostmi se instalace / odinstalace v dry-run typicky neprovede.

**Testy** — z kořene repozitáře: **`npm test`**. Přehled úkolů migrace: **`QUI_MIGRATION_TASKLIST.md`**. Historie / legacy: **`docs/MIGRATION_FROM_LEGACY_CLI.md`**.

## 2) Doporucena struktura balicku

```text
qui-client/
  package.json
  README.md
  bin/
    qui.js
  src/
    cli.ts
    commands/
      init.ts
      add.ts
      update.ts
      diff.ts
      push.ts
    git/
      clone.ts
      sparse.ts
      branch.ts
      pr.ts
    registry/
      resolve.ts
      manifest.ts
    project/
      detect.ts
      qwik.ts
      apply.ts
    ui/
      prompts.ts
      output.ts
```

## 3) Nazvoslovi balicku, bin a instalace

Sjednoceni:
- npm balicek: `qui-client`
- CLI prikaz (bin): `qui`
- v prikladech se vzdy spousti `qui` nebo `npx qui`.

Priklady:
- bez instalace:
  - `npx qui-client@latest init`
- globalni instalace:
  - `npm i -g qui-client`
  - `qui init`
- lokalni instalace:
  - `npm i -D qui-client`
  - `npx qui init`

## 4) `package.json` pro CLI

Minimalni podoba:

```json
{
  "name": "qui-client",
  "version": "0.1.0",
  "type": "module",
  "bin": {
    "qui": "./bin/qui.js"
  },
  "files": [
    "bin",
    "dist",
    "README.md",
    "LICENSE"
  ],
  "scripts": {
    "build": "tsup src/cli.ts --format esm --out-dir dist",
    "prepare": "npm run build"
  },
  "dependencies": {
    "execa": "^9.0.0",
    "prompts": "^2.4.2",
    "simple-git": "^3.27.0"
  }
}
```

Poznamky:
- `bin/qui.js` jen zavola buildnuty `dist/cli.js`.
- Do balicku jdou pouze runtime soubory (`files`), ne komponenty.

### 4.1) Doporuceny runtime stack (MVP)

Pro rychlou a stabilni implementaci MVP je doporuceny tento stack:

- CLI parser: `cac` (jednoduchy ESM-first parser s dobrou podporou opakovatelnych flagu a validace)
- Diff renderer: `git diff --no-index` (volane pres `execa`; bez vlastni diff implementace)
- Prompt vrstva: `prompts` (sjednocene interaktivni dotazy pro `ask` policy)
- Logger/output: vlastni tenka vrstva nad `console` (`info/warn/error/debug`) s jednotnym formatem chyb (`QUI_*`)

Poznamka:
- Pokud bude potreba robustnejsi subcommand middleware nebo vestavena help ergonomie, je mozne parser zamenit za `commander`, ale MVP baseline je `cac`.

## 5) Konfigurace registry (Git jako zdroj)

> **Poznamka:** Priklad JSON nize je **starsi navrhovy model** (`root`, `defaultRepo`, per-repo `ref`). **Aktualni produkcni schema** v tomto repu je **`qui-config/v1`** (repos-only, `targetPath` na top level, ref v `url#…`) — viz **sekce 1.1** a **`CLI_MIGRATION.md`**.

### Priklad `qui-config/v1` (canonical, `qui-client`)

```json
{
  "configSchemaVersion": "qui-config/v1",
  "targetPath": "src/components/ui",
  "policy": {
    "onError": "ask",
    "interactive": true,
    "npmInstallMode": "ask"
  },
  "repos": {
    "local": {
      "url": "file:///absolutni/cesta/k/registry-repo",
      "componentsRoot": "components",
      "uilibs": ["base"],
      "connected": true
    },
    "upstream": {
      "url": "https://github.com/org/registry.git#main",
      "componentsRoot": "components",
      "uilibs": ["base", "web"],
      "connected": true
    }
  }
}
```

- **`targetPath`**: relativni cesta vuci project root (kam se kopiruji komponenty); absolutni cesta je chyba validace.
- **`repos.<name>.url`**: `file://`, `https://`, `ssh://`, nebo `git@host:path`; volitelna vetev/tag jako **`#ref`** na konci URL (samostatny CLI flag `--ref` neexistuje).
- **`policy`**: volitelne; klice jako v `CLI_MIGRATION.md` / validace v `src/`.

Doporuceny lokalni config soubor — **starsi navrhovy tvar** (nekoresponduje s aktualnim `qui-client`):

```json
{
  "root": {
    "url": "https://github.com/honzicekdev/q-ui-lib.git",
    "ref": "main",
    "componentsRoot": "components",
    "uilibs": ["base", "web"],
    "targetPath": "src/components/ui",
    "sourceType": "git"
  },
  "defaultRepo": "extended",
  "repos": {
    "extended": {
      "url": "https://git.mycompany.com/honzicekdev/q-ui-lib.git",
      "ref": "main",
      "componentsRoot": "components",
      "uilibs": ["base", "web", "apps"],
      "targetPath": "src/components/ui",
      "connected": true
    },
    "app": {
      "url": "https://github.com/somebody/myapp.git",
      "ref": "main",
      "componentsRoot": "src/components/ui",
      "uilibs": ["tables", "charts"],
      "targetPath": "src/components/ui",
      "connected": true
    }
  }
}
```

### 5.1) Validace schema `qui-config/v1` (aktualni `qui-client`)

Povinne top-level klice: `configSchemaVersion`, `targetPath`, `repos`. Volitelne: `policy` (jen znamy klice: `onError`, `interactive`, `npmInstallMode`, `packageManager`).

Kazdy zaznam v `repos` musi mit: `url`, `componentsRoot`, `uilibs` (ne-prazdne pole retezcu), `connected` (boolean).

Umisteni souboru:
- `qui.config.json` se cte a zapisuje v **project root** (spolu s `package.json` cilove Qwik aplikace).

### 5.2) Legacy navrh (historicky popis; neni implementace `qui-client`)

Nize uvedeny model s **`root`**, **`defaultRepo`** a samostatnym **`ref`** u repo **není** pouzivan v aktualnim CLI. Zachovano pro srovnani se starsi texty dokumentace.

- Puvodne se predpokladalo, ze `root` je povinny objekt a obsahuje mimo jine `url`, `ref`, `targetPath`, `sourceType`.
- `defaultRepo` vybiral vychozi zaznam v `repos`.
- **Migrace:** prevest na `qui-config/v1`: `targetPath` na top level, jeden nebo vice `repos` bez `root`; Git ref vlozit do `url` jako `#ref`.

### 5.3) Terminologie (repo vs uilib)

Aby se nemichaly pojmy `repo` a `uilib`, CLI pouziva tyto definice:

- **repo**:
  - klic v `repos{}` v `qui.config.json` (napr. `extended`, `app`),
  - reprezentuje jeden konkretni Git source (`url` vcetne `#ref`, `componentsRoot`, `uilibs`, …); **`targetPath` je sdileny** na urovni celeho configu (`qui-config/v1`),
  - odpovida tomu, co uzivatel predava do `--repo` u `connect`.
- **uilib**:
  - logicky segment/adresar uvnitr `componentsRoot` (napr. `base`, `web`, `charts`),
  - je uveden v `repos.<repo>.uilibs[]`,
  - pouziva se pri lookupu komponent (`first match wins`).
- **repo/uilib selector**:
  - syntakticky tvar `<repo>/<uilib>` (napr. `extended/base`),
  - pouziva se tam, kde je potreba jednoznacne urcit jak Git source, tak uilib (typicky `add`, `diff`, `push`).

Priklad:
- `https://github.com/honzicekdev/q-ui-lib.git#main` = Git repo (`url` vcetne ref v `#`),
- `base` = uilib (adresar pod `componentsRoot`),
- `components/base/` = fyzicka cesta v repu,
- `extended/base` = selector (repo + uilib) v lokalni konfiguraci.

## 6) Prikazy CLI

> **Canonical chovani** odpovida **kořenovému balíčku `qui-client`** a dokumentu **`CLI_MIGRATION.md`**. Rozdily vuci legacy **`cli/index.js`** a zastaralym prikladum s `--ref` / `root`: viz **`docs/MIGRATION_FROM_LEGACY_CLI.md`**.

### 6.1) Prehled prikazu (`qui-client`)

- **`qui init`** — vytvori / doplni **`qui.config.json`**, synchronizuje sablony z balicku (`templates/app/`), kolize souboru resi policy (`--on-error`, `--yes`, `--auto`, `--force`) a **`--dry-run`**.
- **`qui connect`** — pouze **striktni dvojice** `--repo <id> --url <url>` (lze opakovat). Git ref je soucast **`url` jako `#ref`**, nikoli samostatny **`--ref`**. Neexistuje **`--repos`** jako jeden flag. **`--dry-run`** ulozi jen plan do reportu, **soubor `qui.config.json` se neprepise**.
- **`qui add` / `update` / `remove`** — prace pod **`targetPath`**; zdroj z **`--repo`** nebo **`--repo <repo>/<uilib>`**, jinak vybere repo z configu (deterministicke poradi / prvni vhodny zaznam). Transitivni komponenty a **npm** dle metadat a policy; **`--dry-run`** kde je implementovano.
- **`qui verify` / `diff`** — read-only; u **`verify`/`diff`** lze pouzit **`--ci`** (kontrakt v `CLI_MIGRATION.md`).
- **`qui generate`** — spousti **`generate-meta.mjs`** (ts-morph) nad cilem z configu / **`--target-path`**.
- **`qui generate-demo`** — demo routy a helpery; **`--dry-run`** jen planuje zmeny bez zapisu.
- **`qui clone` / `push`** — prace s metadaty (**`quiSource`**) a gitem dle implementace.

### 6.2) Priorita zdroje (zjednoduseny model)

- **`connect`**: dvojice z CLI **>** existujici hodnoty v configu (pri prepisu stejneho klice `repos.*`) **>** zapis. Kazda dvojice ma vlastni `url` (s `#ref` pokud potrebujete vetev).
- **`add` / `update`**: **`--repo` / `--repo r/u`** **>** metadata v **`meta.generated.json`** **>** prvni vhodne repo v **`repos`**.
- **`init`**: CLI flagy **>** vychozi hodnoty prikazu (viz implementace).

### 6.3) Vice repozitari v jednom `connect`

Kazda dalsi dvojice **`--repo X --url <URL>`** prida nebo aktualizuje zaznam **`repos.X`**. Konflikt (stejne `repo`, jine URL) resi **`policy.onError`** (`ask` / `warn` / `fail`); u **`ask`** v bezne session readline, v **`--dry-run`** se interaktivne nepta.

## 7) `init` scenar (novy i existujici Qwik projekt)

### A) Novy projekt
1. Uzivatel spusti `qui init`.
2. CLI overi pritomnost `package.json`, Qwik configu a `src/`.
   - podporovane varianty: `qwik.config.ts`, `qwik.config.mjs`, `qwik.config.cjs`.
3. Z `package.json` overi pozadovane runtime i dev dependencies Qwik stacku; chybejici balicky nabidne doinstalovat nebo je doinstaluje podle policy.
4. Pokud projekt neexistuje:
   - nabidne `npm create qwik@latest` (interaktivne), nebo
   - vrati presny command, ktery ma uzivatel spustit.
5. Pokud jeste neni pripojena knihovna, zavola interni flow `connect`.
6. CLI ulozi `qui.config.json` ve schema **`qui-config/v1`** (`targetPath`, `repos{…}`, bez `root` / `defaultRepo`).
7. Otestuje dostupnost vsech aktivnich rep (`git ls-remote` + validace `ref`).
8. Nabidne instalaci prvnich komponent z default repo nebo `--repo`.

### B) Existujici projekt (upgrade mode)
1. `qui init` detekuje uz existujici Qwik app.
2. CLI nacte stavajici config.
3. Porovna, co by se zmenilo (target slozky, nove helpery, komponenty, repo mapovani a `url/ref`) v `src`, `public` i root souborech.
4. Pro root soubory (`vite.config.ts` a dalsi sablony v root) plati stejna pravidla jako pro `src/public`: diff -> overwrite/qui-template/skip.
5. Vypise diff:
   - nove soubory,
   - upravene soubory,
   - soubory k prepisu.
6. Zepta se na potvrzeni (`Apply changes?`).
7. Teprve po potvrzeni zapise.

### C) Kolize existujicich souboru pri `init` (`src` i `public`)

Pokud v existujicim projektu uz soubor existuje (napr. `src/routes/layout.tsx`), CLI musi zabranit slepemu prepisu.

Pro kazdy kolizni soubor nabidne:

- `prepsat` - nahradi soubor obsahem sablony,
- `vytvorit qui-template variantu` - ulozi soubor vedle puvodniho, napr.:
  - `src/routes/layout-qui-template.tsx`
  - obdobne v `public` napr. `manifest-qui-template.json`,
- `nevytvaret` - soubor se preskoci a uzivatel zmeny zapracuje rucne.

Pravidla:

1. Nejdriv porovnat obsah (`existing` vs `template`).
2. Pokud jsou soubory identicke, `*-qui-template` se nevytvari a soubor se povazuje za hotovy.
3. Pokud jsou ruzne, ukazat diff a nabidnout volbu akce.
4. Volbu je vhodne umet nastavit globalne pro vsechny kolize (s moznosti per-file override).

### 7.1) Monorepo poznamka

Monorepo neni specialni rezim CLI. `qui init` i `qui connect` se vzdy tykaji konkretni Qwik aplikace (konkretniho package root), kde je `qui-client` nainstalovan.

## 7.2) Hledani komponenty bez `--repo` (first match wins)

V **`qui-config/v1`** neni objekt **`root`** — vyber zdroje probiha v ramci **`repos`** (viz `resolveRepo` / `resolveSourceContext` v `src/services/source-resolver.js`).

Priklad logiky pro `qui add button` bez `--repo`:

1. Vybere se **vychozi repo** (typicky prvni z `Object.keys(config.repos)` — poradi v JSON souboru, pokud nepredate `--repo`).
2. U tohoto repa se pouzije **`componentsRoot`** + **`uilibs[]`** v poradi prvku pole pri hledani cesty ke komponente.
3. **`root.uilibs`** se v aktualnim schematu **nepouziva**.

Jakmile CLI najde prvni existujici komponentu ve zdroji, dalsi kandidaty uz nezkouma (first match).

- Jednoznacne vynuceni zdroje: **`--repo`** nebo **`--repo <repo>/<uilib>`**.

## 7.3) Pravidla pro `uilibs` a identifikatory rep

- `uilibs` je seznam nazvu UI knihoven/adresaru, ne seznam cest a ne seznam repozitaru.
- Nazvy v `uilibs` jsou libovolne (`base`, `web`, `my-team-core`, `legacy-ui` ...), ale musi odpovidat podporovanym adresarum ve zdrojovem repu.
- Search order (`first match wins`) se ridi vyhradne poradi v `uilibs`.
- Fyzicka cesta komponenty se sklada z:
  - `componentsRoot` z vybraneho repa (`repos.<repo>`),
  - `uilib` z `uilibs`,
  - nazvu komponenty normalizovaneho podle pravidel v sekci 7.4.

## 7.4) Mapovani nazvu komponenty na cestu

CLI pouziva case-insensitive resolution, aby se chovalo konzistentne i na case-insensitive filesystemech (macOS/Windows):

1. Vstupni nazev (`Button`, `button`, `BUTTON`) se normalizuje na kebab-case (`button`, `input-group`, `hero-spotlight`).
2. Pri vyhledani ve zdrojovem repu se porovnava case-insensitive.
3. Pokud existuje vice kandidatu lisicich se pouze velikosti pismen, CLI:
   - v `ask` rezimu zobrazi kolizi a necha uzivatele vybrat,
   - ve `fail-fast` rezimu skonci chybou.
4. Pri zapisu lokalne se preferuje canonical kebab-case podoba cesty.

## 8) Jak delat diff pred zapisem

Doporuceny postup:

1. Stahnout zdrojove soubory komponent do temp adresare podle zvoleneho repo (`--repo` nebo vychoziho z `repos`) a jeho `url` (ref v `#…` v URL).
2. Porovnat temp vs cil (`src/components/ui/...`).
3. Diff zobrazit v unified formatu (napr. `git diff --no-index old new`).
4. Pokud neni potvrzeni, nic se nezapisuje.

Vyhody:
- uzivatel vidi presne co se meni,
- funguje stejne pro update i novou instalaci.

## 8.1) Metadata puvodu v `meta.generated.json`

Pri `qui add` se do instalovane komponenty doplni metadata, odkud byla prevzata, napriklad:

```json
{
  "name": "button",
  "version": "1.2.3",
  "metaSchemaVersion": "qui-meta/v1",
  "dependencies": ["tooltip"],
  "npmDependencies": ["class-variance-authority", "tailwind-merge"],
  "quiSource": {
    "repo": "extended/base",
    "url": "https://git.mycompany.com/honzicekdev/q-ui-lib.git",
    "ref": "main",
    "sourcePath": "components/base/button",
    "installedAt": "2026-04-21T10:32:00.000Z"
  }
}
```

`dependencies` a `npmDependencies`:
- `dependencies` = zavislosti na dalsich QUI komponentach (resene pres `qui add` internim krokem).
- `npmDependencies` = npm balicky, ktere musi byt pritomne v projektu.
- pri `add` i `update` CLI:
  1. sesbira zavislosti z cilovych komponent (vcetne transitivnich),
  2. porovna je s aktualnim `package.json` (`dependencies` + `devDependencies`),
  3. chybejici polozky bud potvrdi s uzivatelem, nebo je auto-instaluje podle flagu.

Instalacni policy zavislosti:
- default (`ask`): CLI vypise chybejici zavislosti a zepta se na instalaci.
- `--auto`: provede instalaci automaticky bez dalsich dotazu.
- `--force`: chova se stejne jako `--auto` (auto-install), navic drzi obecnou non-interactive strategii.
- `--dry-run`: nikdy nic neinstaluje; pouze vypise plan chybejicich zavislosti.

Prikaz `remove` pouziva stejna metadata obracene:
- `dependencies` slouzi pro kontrolu, zda odebirana komponenta neni stale potreba jinou instalovanou komponentou,
- `npmDependencies` slouzi pro vypocet kandidatu na odinstalaci (jen balicky, ktere po odebrani uz nikdo nepouziva).

Detekce package manageru:
- CLI pouzije lockfile (`pnpm-lock.yaml`, `yarn.lock`, `package-lock.json`) a podle toho zvoli `pnpm`/`yarn`/`npm`.
- pokud lockfile chybi, fallback je `npm`.

### 8.2) Algoritmus transitivnich komponentovych zavislosti

Cil: pro `qui add` a `qui update` deterministicky vyresit strom `dependencies` mezi QUI komponentami a bezpecne aplikovat zmeny.

Vstup:
- seznam pozadovanych komponent z CLI (`targets`),
- resolver komponent podle aktualniho source pravidla (`--repo` / metadata / fallback search order),
- metadata komponent (`meta.generated.json`), zejmena `dependencies` a `npmDependencies`.

Kroky:
1. Normalizace vstupu:
   - vsechny nazvy komponent normalizovat na canonical kebab-case.
   - odstranit duplicitni vstupni polozky pri zachovani poradi prvniho vyskytu.
2. Build grafu:
   - pro kazdou komponentu nacist metadata a vytvorit orientovany graf `A -> B`, kde `A` zavisi na `B`.
   - pri chybejici komponentove zavislosti pouzit error policy (`ask|warn|fail`).
3. Detekce cyklu:
   - pouzit DFS se stavy `unvisited/visiting/visited`.
   - pokud se najde back-edge, vytvorit report cyklu (napr. `a -> b -> c -> a`).
   - `ask`: uzivatel vybere, jestli cyklus preskocit (dotcene komponenty) nebo ukoncit.
   - `warn`: cyklicke komponenty preskocit a pokracovat zbytkem.
   - `fail`: okamzite skoncit chybou.
4. Topologicke poradi:
   - pro acyklickou cast grafu spocitat topologicke poradi.
   - instalace komponent probiha od listu zavislosti k zavislym komponentam (dependencies first).
5. Deduplikace:
   - komponentu instalovat/updateovat maximalne jednou na beh prikazu.
   - pokud na stejnou komponentu vede vice cest, sjednotit ji do jedne operace.
6. Source konzistence:
   - pokud je komponenta vyzadana z ruznych source (napr. konflikt mezi `--repo` a metadata fallback), rozhodnuti ridi priorita zdroje a error policy.
   - doporucene pravidlo: explicitni `--repo` ma prednost; konflikt se reportuje jako warning (`warn`) nebo dotaz (`ask`).
7. Agregace npm zavislosti:
   - z celeho uzavreneho mnoziny komponent sesbirat union `npmDependencies`.
   - deduplikovat, seradit stabilne (abecedne) pro reprodukovatelny plan.
8. Plan a aplikace:
   - nejdriv vypsat plan (komponenty + npm zavislosti + diff summary),
   - pak podle rezimu provest instalaci npm zavislosti a zapis komponent.

Determinismus a opakovatelnost:
- stejne vstupy + stejny config => stejne poradi operaci i stejny vystupni plan.
- poradi pro stejnou uroven grafu: lexikograficky podle canonical nazvu.

Pseudo-flow:
1. resolve targets
2. expand transitive dependencies
3. detect/report cycles
4. topo-sort acyclic subgraph
5. collect npm deps union
6. prompt/auto-install npm deps
7. apply component file changes in topo order (with diff confirmation policy)
8. write updated metadata (`installedAt`, source info)

### 8.4) Algoritmus pro `qui remove` (komponenty + npm dependencies)

Cil: bezpecne odebrat komponenty tak, aby nezustal rozbity lokalni dependency graf.

Vstup:
- seznam komponent z CLI nebo `--all --repo <repo/uilib>`,
- lokalne nainstalovane komponenty a jejich metadata.

Kroky:
1. Normalizace vstupu:
   - canonical kebab-case + deduplikace.
2. Resolve scope:
   - pri `--all --repo <repo/uilib>` zahrnout vsechny lokalni komponenty s `quiSource.repo == <repo/uilib>`.
3. Build reverzniho grafu:
   - z lokalnich `dependencies` vytvorit mapu "kdo pouziva koho".
4. Ochrana proti rozbiti:
   - pokud komponentu pouziva jina komponenta, zaradit ji do "blocked" seznamu.
   - `ask`: nabidnout rozsireni remove setu o zavisle komponenty.
   - `warn`: blocked komponenty preskocit a pokracovat.
   - `fail`: okamzity konec.
5. Plan mazani:
   - smazat slozky komponent (`index.tsx`, `meta.generated.json`, dalsi soubory v komponentove slozce).
6. Analyza npm dependencies:
   - spocitat union `npmDependencies` pred a po planovanem odebrani.
   - kandidati na uninstall = `before - after`.
7. Potvrzeni:
   - vypisat komponenty k odebrani + npm balicky kandidaty na odinstalaci.
8. Aplikace:
   - odebrat soubory komponent,
   - volitelne spustit uninstall kandidatu podle policy (`ask|auto|force`),
   - nic nemazat mimo `targetPath`.

### 8.3) UX priklady vystupu (zavislosti a cykly)

> **Poznamka:** Nasledujici bloky jsou **ilustrativni** (navrhovy UX). Skutecny vystup **`qui-client`** je typicky jednoradkovy stav + pri **`--json`** obalka **`qui-report/v1`**; presne texty se ridí implementaci v `src/`.

#### A) Chybejici npm zavislosti (`ask`)

Prikaz:
```bash
qui add button card --repo extended/base
```

Priklad vystupu:
```text
Analyzing component graph...
Resolved components (topo): tooltip -> button -> card
Missing npm dependencies:
  - class-variance-authority
  - tailwind-merge

Install missing npm dependencies now? (Y/n)
```

Pri potvrzeni:
```text
Using package manager: pnpm
Installing: class-variance-authority, tailwind-merge
Done.
Applying component changes...
```

#### B) Chybejici npm zavislosti (`--auto` / `--force`)

Prikaz:
```bash
qui update button --auto
```

Priklad vystupu:
```text
Analyzing component graph...
Missing npm dependencies detected (2).
Auto-install enabled (--auto).
Using package manager: npm
Installing: class-variance-authority, tailwind-merge
Applying component changes...
```

#### C) Cyklus v `dependencies` (`ask`)

Prikaz:
```bash
qui add a --repo extended/base
```

Priklad vystupu:
```text
Dependency cycle detected:
  a -> b -> c -> a

How do you want to proceed?
  1) Skip cyclic subset (a, b, c) and continue with remaining components
  2) Abort command
Select option [1/2]:
```

#### D) Cyklus v `dependencies` (`warn`)

Prikaz:
```bash
qui add a d --repo extended/base --on-error=warn
```

Priklad vystupu:
```text
Warning: dependency cycle detected: a -> b -> c -> a
Skipping cyclic subset: a, b, c
Continuing with remaining components: d
```

#### E) Cyklus v `dependencies` (`fail`)

Prikaz:
```bash
qui update a --on-error=fail
```

Priklad vystupu:
```text
Error: dependency cycle detected: a -> b -> c -> a
Command aborted due to --on-error=fail.
```

#### F) `--dry-run` s chybejicimi zavislostmi

Prikaz:
```bash
qui add button --dry-run
```

Priklad vystupu:
```text
Dry run mode: no files or dependencies will be installed.
Planned components (topo): tooltip -> button
Planned npm dependencies:
  - class-variance-authority
  - tailwind-merge
Planned file changes:
  + src/components/ui/tooltip/index.tsx
  + src/components/ui/button/index.tsx
```

#### G) `qui remove` - komponenta je blokovana jinou komponentou (`ask`)

Prikaz:
```bash
qui remove tooltip --repo extended/base
```

Priklad vystupu:
```text
Analyzing local dependency graph...
Cannot remove component: tooltip
Used by installed components:
  - button
  - card

How do you want to proceed?
  1) Extend removal set: tooltip, button, card
  2) Skip tooltip
  3) Abort command
Select option [1/2/3]:
```

#### H) `qui remove --all` pro celou knihovnu + npm kandidati

Prikaz:
```bash
qui remove --all --repo extended/base
```

Priklad vystupu:
```text
Collecting installed components for source: extended/base
Planned component removals (12):
  - accordion
  - button
  - card
  ... (more)
Potentially unused npm dependencies after removal:
  - class-variance-authority
  - tailwind-merge

Remove listed npm dependencies as well? (Y/n)
```

#### I) `qui remove --dry-run`

Prikaz:
```bash
qui remove button card --repo extended/base --dry-run
```

Priklad vystupu:
```text
Dry run mode: no files or dependencies will be removed.
Planned component removals:
  - button
  - card
Blocked by reverse dependencies:
  - tooltip (used by: popover)
Planned npm uninstall candidates:
  - class-variance-authority
```

#### J) `qui verify` - uspesny stav

Prikaz:
```bash
qui verify
```

Priklad vystupu:
```text
Verifying installed components...
Checked components: 27
Dependency issues: 0
npm dependency issues: 0
Status: OK
```

#### K) `qui verify` - nalezene chyby

Prikaz:
```bash
qui verify button card
```

Priklad vystupu:
```text
Verifying selected components...
Error: missing QUI dependency "tooltip" required by "button"
Error: missing npm dependency "class-variance-authority" required by "button"
Warning: component "card" has missing/invalid meta.generated.json

Suggested fixes:
  - qui add tooltip --repo extended/base
  - npm add class-variance-authority
Status: FAILED
```

#### L) `qui verify --json` (CI vystup)

Prikaz:
```bash
qui verify --json
```

Priklad vystupu:
```json
{
  "command": "verify",
  "status": "failed",
  "checkedAt": "2026-04-21T12:45:10.000Z",
  "summary": {
    "checkedComponents": 27,
    "errors": 2,
    "warnings": 1
  },
  "issues": [
    {
      "severity": "error",
      "type": "missing-component-dependency",
      "component": "button",
      "dependency": "tooltip",
      "message": "Missing QUI dependency 'tooltip' required by 'button'.",
      "suggestedFix": "qui add tooltip --repo extended/base"
    },
    {
      "severity": "error",
      "type": "missing-npm-dependency",
      "component": "button",
      "dependency": "class-variance-authority",
      "message": "Missing npm dependency 'class-variance-authority' required by 'button'.",
      "suggestedFix": "npm add class-variance-authority"
    },
    {
      "severity": "warning",
      "type": "invalid-metadata",
      "component": "card",
      "message": "meta.generated.json is missing or invalid.",
      "suggestedFix": "qui update card --repo extended/base"
    }
  ]
}
```

`qui update` tato metadata pouzije jako primarni source of truth:

1. Nacte `quiSource` z lokalniho `meta.generated.json`.
2. Stahne stejny komponent ze stejneho `url/ref/sourcePath`.
3. Ukaze diff a po potvrzeni prepise.
4. Pri uspesnem update aktualizuje `installedAt` (pripadne i `ref`, pokud je update pinovany na novy ref).

Pokud `quiSource` chybi nebo je nevalidni, CLI vypise varovani a pouzije fallback (`--repo` nebo search order).

Priorita urceni zdroje pro `update` je popsana v **sekci 6** (canonical `qui-client`).

`metaSchemaVersion` je verze struktury metadat (ne verze komponenty). Doporuceni:

- format: `qui-meta/v<major>` (napr. `qui-meta/v1`),
- minor zmeny schema drzet backward-compatible bez zmeny major identifikatoru,
- breaking zmeny schema delat pres novou major hodnotu (`qui-meta/v2`),
- pri cteni nezname major verze:
  - `ask` rezim: upozornit a zeptat se na pokracovani,
  - `warn` rezim: pokusit se o best-effort fallback,
  - `fail-fast` rezim: ukoncit prikaz chybou.

## 10) `push` flow pro opravy komponent

> **Canonical (`qui-client`):** `qui push` vyzaduje **`--repo <repo>/<uilib>`** (prave jedno `/`) a aspon jeden argument komponenty. Cilova cesta komponent v aplikaci je **`targetPath`** z `qui.config.json` (sdilene pro cely config), ne per-repo `targetPath`. Detail: **`CLI_MIGRATION.md`**, implementace: `src/commands/push.js`.

`qui push` by mel delat:

1. Overit, ze projekt je Git repo a nema konflikty.
2. Vybrat jen soubory pod **`targetPath`** (a vybrane komponenty) mapovane do zdrojoveho repa.
3. Vytvorit branch, napr. `qui/fix-<slug>-<datum>`.
4. `git add` + `git commit` s predvyplnenou zpravou.
5. `git push -u origin <branch>`.
6. Pokusit se zalozit PR:
   - GitHub: `gh pr create ...`
   - Gitea: `tea pr create ...` nebo HTTP API
7. Pokud PR tool neni dostupny, vytisknout URL instrukci pro manualni PR.

Dulezite:
- `push` by mel mit `--dry-run` rezim.
- Pri neuspechu autentizace nema menit historii, jen jasne nahlasit dalsi krok.

### 10.1) Push scope (jedno cilove repo)

`qui push` vzdy pracuje s jednim cilovym Git repem a jednim QUI repo identifikatorem:

- V **`qui-client`** je pro `push` povinny tvar **`--repo <repo>/<uilib>`** (prave jedno `/`).
- Predaji se komponenty jako argumenty (`qui push button card --repo extended/base`).
- Soubory se berou pod **`targetPath`** z `qui.config.json` (ne z `repos.*.targetPath`).
- Jeden command nikdy nepushuje vice repozitaru.
- Pri nesouladu metadat (`quiSource`) a `--repo` plati validace dle implementace.

### 10.1.1) Mapovani souboru pri `push` (vice `uilib`)

Cil: i kdyz jedno repo obsahuje vice `uilib` (`base`, `web`, ...), `push` musi presne urcit, ktere soubory patri do cilove zmeny.

Pravidla:
1. **`qui-client`** pro `push` akceptuje u `--repo` pouze tvar **`<repo>/<uilib>`** (starsi navrh s `<repo>` bez `uilib` zde neplati).
2. Lokalne: **`targetPath`** + `/<component>/...` (komponenta = kebab-case slug).
3. Remote cesta se pocita jako:
   - `<componentsRoot>/<uilib>/<component>/...`
4. Vyber `uilib` je vzdy soucasti `--repo` (viz bod 1).
5. Pokud je v commitu soubor mimo vybrany `uilib`, do push scope se nezahrne.
6. Pri push vice komponent:
   - vsechny musi byt mapovatelne do stejneho `<repo>/<uilib>`,
   - pri konfliktu `uilib` plati `--on-error`.

## 10.2) Error policy (globalne + per command)

Vychozi chovani je `ask` (interaktivni potvrzovani rozhodnuti). Krome toho CLI podpori:

- `--on-error=ask|warn|fail` (globalni politika pro prikaz),
- `--auto` jako neinteraktivni rezim pro automatickou instalaci chybejicich zavislosti,
- zkratku `--force` jako alias pro neinteraktivni prepisovaci rezim (ekvivalent `--on-error=warn` + automaticke potvrzeni bezpecnych kolizi + auto-install chybejicich zavislosti).

Doporucene semantiky:

- `ask` (default):
  - pri nejistote nebo kolizi se zepta,
  - pri fatal technicke chybe (napr. neplatny git ref) skonci chybou.
- `warn`:
  - vypise warning a pokusi se pokracovat na dalsi polozky,
  - selhane polozky shrne na konci.
- `fail`:
  - fail-fast pri prvni neobslouzitelne chybe.

Specificky pro `update`:
- chyba jedne komponenty v `warn` rezimu nezastavi update ostatnich.

Specificky pro `push`:
- pred mutacemi remote (push/PR) musi probehnout vsechny lokani validace; pokud neprojdou, prikaz konci bez zmen v remote historii.
- autentizacni nebo permission chyby pri push/PR jsou defaultne fail-fast (bez dalsich mutaci), ale s jasnym navodem dalsiho kroku.

### 10.2.1) Tabulka chovani

| Command | Typ situace/chyby | ask (default) | warn | fail |
|---|---|---|---|---|
| `connect` | nedostupny remote / nevalidni `ref` | dotaz + oprava vstupu, jinak stop | warning + skip repo | okamzity fail |
| `init` | konflikt sablony (`src`/`public`/root) | diff + volba (`prepsat`/`qui-template`/`preskocit`) | warning + default strategie | okamzity fail |
| `init` | chybejici Qwik deps | dotaz na doinstalaci | pokus o auto-install, jinak warning | okamzity fail |
| `add` | komponenta nenalezena | dotaz na fallback | warning + pokracovat dalsi polozkou | okamzity fail |
| `add` | kolize lokalniho souboru | diff + potvrzeni | warning + bezpecny overwrite | okamzity fail |
| `add` | chybejici `dependencies`/`npmDependencies` | dotaz na instalaci | warning + auto-install pri `--auto`/`--force`, jinak skip | okamzity fail |
| `add` | cyklus v transitivnich `dependencies` | dotaz: skip cyklu nebo stop | warning + preskocit cyklickou podmnozinu | okamzity fail |
| `update` | chyba jedne komponenty | dotaz, ostatni komponenty mohou pokracovat | warning, pokracovat | okamzity fail |
| `update` | chybejici/nevalidni `quiSource` | dotaz na fallback | warning + fallback | okamzity fail |
| `update` | chybejici `dependencies`/`npmDependencies` | dotaz na instalaci | warning + auto-install pri `--auto`/`--force`, jinak pokracovat dle policy | okamzity fail |
| `update` | cyklus v transitivnich `dependencies` | dotaz: skip cyklu nebo stop | warning + preskocit cyklickou podmnozinu | okamzity fail |
| `diff` | nevalidni source / nenalezena komponenta | dotaz na fallback | warning + prazdny diff polozky | okamzity fail |
| `remove` | komponenta pouzita jinou instalovanou komponentou | dotaz: rozsirit remove set nebo skip | warning + skip blokovane komponenty | okamzity fail |
| `remove` | kandidati na npm uninstall | dotaz na odinstalaci | warning + auto-uninstall jen pri `--auto`/`--force` | okamzity fail |
| `verify` | chybejici QUI dependency | report + navrh opravy | warning + navrh opravy | fail s reportem |
| `verify` | chybejici npm dependency | report + navrh opravy | warning + navrh opravy | fail s reportem |
| `push` | neprosla lokalni validace | stop bez remote mutace | stejne jako ask | okamzity fail |
| `push` | auth/permission chyba | stop + navod dalsiho kroku | stejne jako ask | okamzity fail |

### 10.2.2) Explicitni semantika `--force`

`--force` je deterministicka zkratka:
- `--on-error=warn`
- implicitni "yes" na bezpecne interaktivni potvrzeni (diff apply, kolize sablon pri `init`, non-destructive overwrite)
- `--auto` pro instalaci chybejicich `dependencies` + `npmDependencies`

`--force` nikdy:
- neignoruje fatal technicke chyby (neplatny git ref, nedostupny remote, parse error metadat),
- neobchazi validace pred `push`,
- neprovadi destruktivni git operace mimo normalni flow (`add/commit/push`).

#### Matice `--force` podle prikazu

| Command | Co `--force` zapina | Co `--force` nezapina |
|---|---|---|
| `connect` | `--on-error=warn` (konflikty hlasi warningem) | neobchazi `git ls-remote`/ref validaci |
| `init` | auto volba kolizni strategie (default `prepsat`, pokud neni urcena jina) | neobchazi chybejici/nevalidni zakladni projektove soubory |
| `add` | auto potvrzeni diff + auto install zavislosti + warn policy | neinstaluje neexistujici komponentu bez resolvu |
| `update` | stejne jako `add` + pokracovani pres selhane polozky | neobchazi nevalidni metadata bez fallbacku |
| `diff` | pouze warn policy (zadna mutace) | nic nezapisuje ani s `--force` |
| `remove` | auto potvrzeni remove plánu + auto uninstall nepouzitych npm dependencies | nemaze komponentu blokovanou hard policy (`--on-error=fail`) |
| `verify` | pouze non-interactive report (bez promptu) | neprovadi zadne mutace ani auto-fix |
| `push` | warn policy pro nekriticke nesoulady scope | neobchazi lokalni validace ani auth chyby |

`--auto`:
- automatizuje pouze instalaci chybejicich zavislosti (meta `dependencies` + `npmDependencies`), ne obecne prepisy souboru.

## 10.3) UX sekvence kolizi pri `init`

Pri kolizich sablon (`src` i `public`) CLI postupuje soubor po souboru:

1. Porovna `existing` vs `template`.
2. Pokud jsou identicke, soubor preskoci bez dotazu.
3. Pokud se lisi, zobrazi diff a nabidne volby:
   - `prepsat`,
   - `vytvorit qui-template variantu`,
   - `preskocit`.
4. Uzivatel muze u prvni kolize nastavit globalni default pro zbytek behu (`apply to all`), ale pro kazdy dalsi soubor je mozne ho per-file prepsat.
5. V `--force` rezimu se interaktivni dotazy preskoci a pouzije se predem nastavena strategie (`prepsat`, pokud neni receno jinak parametrem).

## 11) Instalace klienta primo z gitu

Pro publikovany balicek **`qui-client`** viz take **`README.md`** (npm stranka po vydani).

Moznosti:

- Globalne:
  - `npm i -g git+https://github.com/<org>/<repo>.git`
- V projektu (dev dependency):
  - `npm i -D git+https://github.com/<org>/<repo>.git`
  - spousteni: `npx qui init`

Poznamka:
- repozitar musi mit funkcni `prepare`/`build`, aby po instalaci existoval spustitelny `bin`.

## 12) Publikace na npm a spousteni pres npm

### A) Publikace
1. Zvysit verzi (`npm version patch|minor|major`).
2. Prihlasit se (`npm login`).
3. Publikovat (`npm publish --access public`).

### B) Pouziti uzivatelem
- Bez instalace:
  - `npx qui-client@latest init`
- Globalni instalace:
  - `npm i -g qui-client`
  - `qui init`
- Lokalni instalace v projektu:
  - `npm i -D qui-client`
  - `npx qui init`
  - nebo script v `package.json`: `"qui": "qui"`

## 13) Doporuceny roadmap (MVP -> v2)

MVP:
- `connect`, `init`, `add`, `update`, `diff`, `push`,
- podpora GitHub + fallback bez automatickeho PR,
- format registry s `componentsRoot` + `uilibs[]` + `repos` (`qui-config/v1`, ref v `url#…`).

v2:
- vice registry provideru (GitHub, Gitea, self-hosted Git),
- zamykani verzi komponent (`ref` per component),
- chytrejsi merge lokalnich uprav (3-way merge),
- integrovane test hooks pred `push`.

## 14) Strucne priklady pouziti

> Ref na vetev/tag je **v URL jako `#…`**, ne jako `--ref`. Vice rep: opakovat dvojice `--repo` / `--url`. Viz **`CLI_MIGRATION.md`** a **`docs/MIGRATION_FROM_LEGACY_CLI.md`**.

```bash
# 1) pripojeni registry (ulozi qui.config.json)
qui connect --repo extended --url https://github.com/honzicekdev/q-ui-lib.git#main
qui connect --repo app --url https://github.com/other/app.git#v1.0.0

# 2) inicializace projektu
qui init --repo local-dev

# 3) instalace komponent z konkretniho repa
qui add button card accordion --repo extended/base

# 4) instalace cele knihovny (vsechny komponenty z uilib)
qui add --all --repo extended/base

# 5) aktualizace instalovanych komponent podle puvodu v meta.generated.json
qui update button card

# 6) odebrani lokalnich komponent + navrh odinstalace nepouzitych npm dependencies
qui remove button card --repo extended/base

# 7) odebrani cele knihovny z lokalni instalace
qui remove --all --repo extended/base

# 8) kontrola instalace komponent a jejich dependencies
qui verify
qui verify button card
qui verify --json

# 9) jen nahled zmen z web repa
qui diff hero --repo extended/web

# 10) odeslani opravy komponenty button do uilib base v repu extended
qui push button --repo extended/base --title "Fix button focus ring"
```

Tento navrh drzi balicek maly (jen CLI) a vsechen obsah komponent bere az za behu z Git repozitare podle konfigurace projektu.

## 15) Implementation contract (MVP)

> Pro **skutecnou** implementaci v tomto repu plati **`CLI_MIGRATION.md`** a kód v **`src/`**. Tato sekce je historicky navrh; kde se lisi (napr. parser `connect`), vyhrava migracni dokument.

Tato sekce popisovala zavazny kontrakt pro puvodni MVP. Pri konfliktu s **`CLI_MIGRATION.md`** / **`qui-client`** pouzijte migracni dokumenty.

### 15.1) CLI parser kontrakt

Podporovane globalni prepinace:
- `--on-error <ask|warn|fail>`
- `--force`
- `--auto`
- `--dry-run`
- `--yes` (implicitni potvrzeni pouze tam, kde by jinak probehl interaktivni dotaz)

Prikaz `connect` (**aktualni `qui-client`**):
- pouze opakovane **striktni dvojice** `--repo <id> --url <url>` (kazda `url` muze obsahovat `#ref`).
- flag **`--repos`**, globalni **`--ref`** a **`--source`** z teto tabulky **nejsou** v `qui-client` implementovany — detail a exit kody: **`CLI_MIGRATION.md`**, zdrojovy parser: `src/parser.js` (`parseConnectPairs`).

Prikazy `add`, `update`, `diff`, `remove`, `verify`, `push`:
- `--repo` prijima:
  - `<repo>`
  - `<repo>/<uilib>`
- validace:
  - pokud je predan `<repo>/<uilib>`, `uilib` musi byt v `repos.<repo>.uilibs`
  - pokud je predan neexistujici `repo`, command konci chybou

Prikaz `add`:
- `--all`:
  - vyzaduje `--repo`
  - s `<repo>/<uilib>` nainstaluje vsechny komponenty z dane knihovny
  - s `<repo>` se `uilib` urci podle policy (`ask`: vyber, `warn`: prvni v poradi, `fail`: chyba)

Prikaz `remove`:
- povolene tvary:
  - `qui remove <component...> [--repo <repo|repo/uilib>]`
  - `qui remove --all --repo <repo/uilib>`
- parser pravidla:
  1. `--all` a explicitni seznam komponent se navzajem vylucuji
  2. `--all` bez `--repo` je chyba
  3. pri `--repo <repo>` bez `uilib` plati stejna volba `uilib` podle policy jako u `add --all`

Prikaz `verify`:
- povolene tvary:
  - `qui verify`
  - `qui verify <component...>`
  - `qui verify <component...> --repo <repo|repo/uilib>`
  - `qui verify [component...] [--repo <repo|repo/uilib>] --json`
- parser pravidla:
  1. bez argumentu kontroluje vsechny lokalni komponenty v `targetPath`
  2. s `--repo` filtruje kontrolu pouze na komponenty odpovidajici danemu source selectoru
  3. command je read-only; nepodporuje mutacni prepinace (`--auto`, `--force` nemaji efekt)
  4. `--json` prepne vystup do strojove citelneho JSON formatu (bez interaktivnich promptu)

### 15.2) Exit kody a chybove tridy

Jednotne exit kody:
- `0` uspesne dokonceno
- `1` obecna runtime chyba
- `2` invalidni CLI vstup / validacni chyba argumentu
- `3` konfigurace neni validni (`qui.config.json`, metadata schema, parse chyba)
- `4` zdroj neni dostupny (`git ls-remote`, neplatny ref, auth source)
- `5` konflikt/policy stop (kolize souboru, cyklus, nenalezena komponenta pri `fail`)
- `6` uzivatel zrusil akci (odmitnuti potvrzeni v `ask`)
- `7` external tool failure (`git`, package manager, `gh`/`tea`)

Specificky pro `qui verify`:
- nalezene dependency chyby (`dependencies`/`npmDependencies`) vraci `5`,
- nevalidni/necitelna metadata vraci `3` (pokud nelze provest aspon best-effort kontrolu dle policy).

`qui verify --json` kontrakt:
- root pole:
  - `command` (`"verify"`)
  - `status` (`"ok" | "warn" | "failed"`)
  - `checkedAt` (ISO timestamp)
  - `summary.checkedComponents`, `summary.errors`, `summary.warnings`
  - `issues[]`
- povinne pole issue:
  - `severity` (`error|warning`)
  - `type` (`missing-component-dependency|missing-npm-dependency|invalid-metadata|missing-component`)
  - `component`
  - `message`
- volitelna pole issue:
  - `dependency`
  - `repo`
  - `suggestedFix`

Log format:
- vsechny chyby musi mit strojove citelny prefix:
  - `QUI_ECLI_*`, `QUI_ECFG_*`, `QUI_ESRC_*`, `QUI_EPOLICY_*`, `QUI_EEXT_*`
- posledni radek chyby ma vzdy tvar:
  - `Error(<CODE>): <human-readable message>`

### 15.3) Definice "safe overwrite" a kolizi souboru

Safe overwrite je povolen pouze pokud:
1. cil je regularni soubor pod scope daneho prikazu,
2. nevznika smazani jineho souboru,
3. nevznika presun/rename souboru,
4. vysledny zapis je deterministicky z vypocteneho planu.

`--force` povoluje:
- automaticke potvrzeni overwrite v ramci safe overwrite.

`--force` nepovoluje:
- prepis mimo `targetPath`,
- prepis souboru, ktery neni soucasti vypocteneho planu,
- mazani souboru.

### 15.4) Push scope a mapovani lokalni -> remote

`qui push` pracuje s jednim `<repo>/<uilib>`.

Deterministicke mapovani:
1. lokalni root komponent: `repos.<repo>.targetPath/<component>`
2. remote root komponent: `repos.<repo>.componentsRoot/<uilib>/<component>`
3. do push scope patri pouze:
   - `index.tsx`
   - `meta.generated.json`
   - volitelne dalsi soubory uvnitr stejne slozky komponenty
4. soubory mimo slozku komponenty (napr. global helpers) jsou defaultne mimo scope

Rozsireny scope:
- volitelny flag `--include-shared` zaradi i soubory mimo komponentu, pokud:
  - lezi pod `repos.<repo>.targetPath`,
  - jsou explicitne vypsane v planu pred potvrzenim.

Rename/delete synchronizace (MVP):
- Cilem `qui push` je, aby stav komponenty v cilovem repo po merge odpovidal lokalnimu stavu.
- Pri generovani push planu se porovnava lokalni komponentova slozka a odpovidajici remote slozka:
  - soubor existuje lokalne i remote a lisi se -> `modify`
  - soubor je jen lokalne -> `add`
  - soubor je jen remote -> `delete`
- Rename se reprezentuje jako `delete(old)` + `add(new)` (detekce rename neni v MVP povinna).
- `delete` je povolene jen uvnitr mapovane komponentove slozky (`<componentsRoot>/<uilib>/<component>/...`).
- Pred commit/push se vzdy vypise kompletni plan (`add/modify/delete`) a diff summary.
- V `--dry-run` se plan vypise, ale bez lokalnich ani remote mutaci.

### 15.5) PR integrace a auth fallback

Poradi pokusu o PR:
1. pokud remote host je GitHub a je dostupne `gh`, pouzit `gh pr create`
2. pokud remote host je Gitea a je dostupne `tea`, pouzit `tea pr create`
3. jinak vypsat manualni URL/navod

Auth fallback:
- pokud push probehne, ale PR create selze na auth:
  - command konci `0` s varovanim a navodem na manualni PR
- pokud selze samotny `git push` na auth/permission:
  - command konci `7`, bez dalsich mutaci

### 15.6) Verzovani `qui.config.json`

`qui.config.json` musi obsahovat:
```json
{
  "configSchemaVersion": "qui-config/v1"
}
```

Pravidla:
- neznama major verze:
  - `ask`: upozornit + potvrzeni pokracovani
  - `warn`: best-effort fallback + warning
  - `fail`: okamzity konec s chybou
- migrace `v1 -> v2` musi byt explicitni krok (`qui config migrate`)

### 15.7) Determinismus a reprodukovatelnost

MVP implementace musi garantovat:
1. stejne vstupy + stejny config + stejny source ref => stejny plan i poradi operaci,
2. stabilni serazeni:
   - komponenty lexikograficky (canonical kebab-case),
   - npm dependencies lexikograficky,
3. plan se vzdy vypisuje pred mutaci (vyjimka: explicitni non-interactive s `--force --yes`).

## 16) Povinne MVP integracni testy

> **Aktualne:** automatizovane testy **`qui-client`** spustite **`npm test`** (parser, config, policy, smoke `init`/`connect`/`demo`, atd.). Tabulka nize je puvodni MVP wishlist; nektere body jeste nemusi mit 1:1 integracni test v CI.

Minimalni test matrix (historicky navrh):

1. `connect` parser: striktni dvojice `--repo` / `--url` (viz `parseConnectPairs`, `connect-smoke.test.js`).
2. Config location:
   - `qui.config.json` se vytvori v project root.
   - command mimo project root skonci validacni chybou.
3. Source bootstrap:
   - `repos.*.url` obsahuje Git URL; ref jako `#…` v retezci (ne `root.url/ref`).
   - `file://` pro lokalni zdroj dle `CLI_MIGRATION.md`.
4. `init` existujici projekt:
   - kolize sablon -> diff + volba (`prepsat`/`qui-template`/`preskocit`).
   - `--force` aplikuje predvolenou neinteraktivni strategii.
5. `add` (single + transitive):
   - install komponenty + transitivnich `dependencies` v topo poradi.
   - agregace `npmDependencies` + instalace v `ask` a `--auto`.
   - `--dry-run` nevytvori zadne soubory ani neinstaluje balicky.
6. `add --all`:
   - s `<repo>/<uilib>` nainstaluje vsechny komponenty knihovny.
   - s `<repo>` respektuje policy vyberu `uilib` (`ask|warn|fail`).
7. `update`:
   - primarni source z `meta.generated.json` (`quiSource`).
   - fallback na `--repo`/search order pri chybejicim metadatu.
   - aktualizace `installedAt` po uspesnem zapisu.
8. `remove`:
   - blokace remove pri reverznich zavislostech.
   - `--all --repo <repo/uilib>` scope na zdroj.
   - npm uninstall kandidati = `before - after`.
9. `verify`:
   - OK pripad (exit `0`).
   - missing QUI dependency => issue + exit `5`.
   - missing npm dependency => issue + exit `5`.
   - invalid metadata => exit `3` dle kontraktu.
   - `--json` validuje schema vystupu.
10. Error policy:
   - `ask|warn|fail` chovani pro `add/update/remove` na jedne sade fixtures.
   - `--force` semantika (`warn` + implicit yes + auto deps) bez poruseni hard stop pravidel.
11. `push` scope a mapovani:
   - akceptuje jeden `<repo>/<uilib>`.
   - mapuje lokalni `targetPath/<component>` -> remote `componentsRoot/<uilib>/<component>`.
   - mimo-scope soubory se nepushuji bez `--include-shared`.
12. `push` sync plan (`add/modify/delete`):
   - delete remote souboru, ktery uz lokalne neni (jen v komponentove slozce).
   - rename jako `delete+add`.
   - `--dry-run` jen vypise plan.
13. PR fallback:
   - push uspesny + PR auth fail => exit `0` s warning/navodem.
   - push auth fail => exit `7`.
14. Determinismus:
   - opakovane spusteni se stejnymi vstupy vraci stejny plan a poradi operaci.
