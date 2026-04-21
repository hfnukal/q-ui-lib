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

Doporuceny lokalni config soubor po `qui connect` / `qui init`:

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

### 5.1) Striktni schema a validace `qui.config.json`

`root` je povinny objekt a musi byt vzdy pritomny.

Povinna pole:
- `root.url`, `root.ref`, `root.componentsRoot`, `root.uilibs`, `root.targetPath`, `root.sourceType`
- `defaultRepo`
- `repos`

Volitelna pole:
- `repos.<repo>.connected` (default `true`)

Pravidla naplneni `root`:
- Pri instalaci klienta se `root` vzdy vytvori v `qui.config.json`.
- Pokud je klient instalovan z Git zdroje, `root.url` a `root.ref` se aktualizuji podle instalacniho zdroje.
- Pokud je klient instalovan z npm, klient pouzije:
  - bud predvyplneny Git source (pokud je znamy),
  - nebo statickou template hodnotu (`root.sourceType = "npm-template"`), kterou lze pozdeji zmenit pres `qui connect`.
- Pokud Git source nelze spolehlive zjistit, CLI vzdy pouzije template fallback (`root.sourceType = "npm-template"` + default `url/ref` ze sablony balicku).

Umisteni configu:
- `qui.config.json` se vzdy cte i zapisuje pouze v project root (stejny adresar jako `package.json` dane Qwik aplikace).
- Fallback mimo project root neni v MVP podporovan.

Pro jiny zdroj (napr. vlastni firma):
- staci stejna struktura komponent v repu,
- uzivatel pri `connect`/`init` zada `url` a `ref` pro kazde repo,
- kazda knihovna v root configu uklada seznam UI knihoven (`uilibs`) a detailni mapovani v `repos{}`,
- vychozi konfigurace vznikne z "origin" zdroje klienta a uzivatel ji muze prepsat.

### 5.2) Terminologie (repo vs uilib)

Aby se nemichaly pojmy `repo` a `uilib`, CLI pouziva tyto definice:

- **repo**:
  - klic v `repos{}` v `qui.config.json` (napr. `extended`, `app`),
  - reprezentuje jeden konkretni Git source (`url`, `ref`, `componentsRoot`, `targetPath` ...),
  - odpovida tomu, co uzivatel predava do `--repo` u `connect`.
- **uilib**:
  - logicky segment/adresar uvnitr `componentsRoot` (napr. `base`, `web`, `charts`),
  - je uveden v `repos.<repo>.uilibs[]` nebo v `root.uilibs[]`,
  - pouziva se pri lookupu komponent (`first match wins`).
- **repo/uilib selector**:
  - syntakticky tvar `<repo>/<uilib>` (napr. `extended/base`),
  - pouziva se tam, kde je potreba jednoznacne urcit jak Git source, tak uilib (typicky `add`, `diff`, `push`).

Priklad:
- `https://github.com/honzicekdev/q-ui-lib.git` = Git repo (`url` + `ref`),
- `base` = uilib (adresar pod `componentsRoot`),
- `components/base/` = fyzicka cesta v repu,
- `extended/base` = selector (repo + uilib) v lokalni konfiguraci.

## 6) Prikazy CLI

Minimalni sada:

- `qui init`
  - detekuje, zda je slozka Qwik projekt,
  - pokud ne, nabidne vytvoreni projektu,
  - pokud ano, pripravi konfiguraci a adresare pro komponenty,
  - umi rezim noveho projektu i aktualizaci existujiciho,
  - prochazi defaultni repo z konfigurace nebo repo urcene parametrem `--repo`.

- `qui connect`
  - pripoji projekt na Git registry (`--repo <repo>` opakovatelny flag, nebo `--repos <repo...>`),
  - vsechny hodnoty z `--repo` i `--repos` se slouci do jednoho vysledneho pole (array),
  - source se urci pres `--url <git-url> --ref <branch|tag|sha>`,
  - overi dostupnost (`git ls-remote`),
  - nacte/ulozi popis knihovny (`componentsRoot`, `uilibs`, `repos`),
  - vytvori nebo aktualizuje lokalni root config.

- `qui add <component...>`
  - stahne vybrane komponenty z registry gitu,
  - pokud je zadane `--repo <repo>` nebo `--repo <repo/uilib>`, pouzije jen tento zdroj,
  - bez `--repo` pouzije algoritmus "first match wins" podle `repos.*.uilibs` a nakonec root `uilibs`,
  - podporuje `--all`, ktere nainstaluje vsechny komponenty z vybrane knihovny (`<repo>/<uilib>`); pokud je predan jen `<repo>`, plati vyber `uilib` podle policy (`ask|warn|fail`),
  - pri instalaci doplni do `meta.generated.json` informaci o puvodu komponenty (`repo`, `url`, `ref`, `sourcePath`, `installedAt`),
  - vypocita zmeny proti lokalnim souborum,
  - z `meta.generated.json` kazde komponenty nacte `dependencies` (QUI komponenty) a `npmDependencies` (npm balicky),
  - overi, ze jsou splnene vsechny komponentove i npm zavislosti; chybejici zavislosti nabidne k instalaci nebo je nainstaluje automaticky podle flagu/policy,
  - ukaze diff + potvrzeni,
  - po potvrzeni zapise.

- `qui remove [component...]`
  - odstrani komponenty z lokalni instalace (`targetPath`) bez mutace vzdaleneho repa,
  - umi odebrat celou knihovnu pres `--all --repo <repo/uilib>`,
  - pri odebirani komponent nejdriv sestavi reverzni graf zavislosti z lokalnich `meta.generated.json`,
  - pokud je komponenta vyzadovana jinou stale instalovanou komponentou, CLI ji neodstrani bez potvrzeni/policy,
  - po odebrani komponent prepocita pouziti `npmDependencies`; nepouzite balicky navrhne odstranit (interaktivne nebo podle `--auto/--force`),
  - pred zapisem vzdy ukaze plan + diff mazanych/menenych souboru,
  - `--dry-run` nic nemaze, jen vypise navrhovane odebrani.

- `qui verify [component...]`
  - provede read-only kontrolu instalovanych komponent a jejich metadat,
  - overi, ze vsechny `dependencies` (QUI komponenty) existuji lokalne,
  - overi, ze vsechny `npmDependencies` existuji v `dependencies` nebo `devDependencies` projektu,
  - bez argumentu kontroluje vsechny lokalne nainstalovane komponenty,
  - s argumenty kontroluje jen vybrane komponenty (vcetne transitivnich zavislosti),
  - vypise report `ok/warn/error` a navrh oprav (`qui add ...`, `npm|pnpm|yarn add ...`),
  - nikdy nemutuje soubory (pro opravu uzivatel pouzije `add`/`update`/instalaci balicku).

- `qui update [component...]`
  - aktualizuje uz nainstalovane komponenty podobne jako `add`,
  - pokud nejsou zadane komponenty, aktualizuje vsechny instalovane komponenty,
  - zdroj komponenty primarne cte z `meta.generated.json` (metadata zapsana pri `add`),
  - pokud metadata chybi, pouzije fallback pres `--repo` nebo "first match wins",
  - stejne jako `add` zkontroluje `dependencies` a `npmDependencies` z metadat a resi chybejici zavislosti pred finalnim zapisem,
  - vypocita diff + potvrzeni a az potom zapise.
  - doporucene prepinace:
    - `--all` vynuti update vsech instalovanych komponent i kdyz jsou predane jen nektere,
    - `--repo <repo>` nebo `--repo <repo/uilib>` prepise zdroj z metadat (uzitecne pro migraci),
    - `--ref <branch|tag|sha>` prepise verzi zdroje pro tento update,
    - `--auto` povoli neinteraktivni auto-instalaci chybejicich zavislosti (`dependencies` i `npmDependencies`),
    - `--dry-run` nic nezapise, jen vypise plan a diff.

- `qui diff [component]`
  - jen zobrazi planovane zmeny bez zapisu,
  - umi prepinat zdroj pomoci `--repo <repo>` nebo `--repo <repo/uilib>`,
  - bez `--repo` pouzije stejny search order jako `add`.

- `qui push`
  - vezme lokalni opravy komponent,
  - vybere repo z configu nebo `--repo <repo|repo/uilib>`,
  - vygeneruje branch,
  - commitne zmeny a pushne branch,
  - pokud je remote GitHub/Gitea a je dostupny CLI token, zalozi PR.

### 6.1) Priorita urceni zdroje pro vsechny prikazy

Aby bylo chovani konzistentni, CLI pouziva jednotne priority:

- `connect`
  1. CLI parametry (`--repo`, `--url`, `--ref`, `--components-root`, `--target-path`)
  2. existujici lokalni config (`qui.config.json`)
  3. vychozi source z klient balicku (origin, ze ktereho byl klient instalovan/publikovan)

- `init`
  1. CLI parametry (`--repo`, pripadne dalsi override)
  2. lokalni config
  3. implicitni connect flow s vychozim source klienta

- `add`
  1. CLI parametry (`--repo`, `--ref`)
  2. lokalni config (`defaultRepo`/mapovani)
  3. search order (`repos.*.uilibs` -> root `uilibs`, first match wins)

- `update`
  1. CLI parametry (`--repo`, `--ref`)
  2. `quiSource` v `meta.generated.json`
  3. lokalni config fallback (`defaultRepo`/first match wins)

- `diff`
  1. CLI parametry (`--repo`, `--ref`)
  2. pokud jde o nainstalovanou komponentu, `quiSource` z `meta.generated.json`
  3. jinak stejny fallback jako `add`

- `remove`
  1. CLI parametry (`--repo`, `--all`)
  2. lokalni metadata (`quiSource` + lokalni dependency graf)
  3. fallback na lokalni targetPath scan (jen pro komponenty bez metadat)

- `verify`
  1. CLI parametry (`--repo`, seznam komponent)
  2. lokalni metadata (`dependencies`, `npmDependencies`, `quiSource`)
  3. fallback targetPath scan (komponenty bez metadat reportovat jako warning)

- `push`
  1. CLI parametry (`--repo`, `--remote`, `--base-branch`)
  2. `quiSource` z `meta.generated.json` (pro urceni puvodniho zdroje komponent)
  3. lokalni config (`defaultRepo`) a az pak aktualni git remote projektu

### 6.2) `connect` s vice `--repo` a per-repo konfiguraci

`connect` muze prijmout:
- opakovane `--repo <repo>`,
- nebo `--repos <repo...>`,
- nebo jejich kombinaci.

Vsechny hodnoty se slouci do jednoho seznamu `repo`:
1. normalizace (trim, case-sensitive ponechat),
2. deduplikace pri zachovani poradi prvniho vyskytu,
3. validace, ze kazde `repo` ma nebo dostane konfiguraci.

Pravidlo konfigurace:
- kazde `repo` ma vlastni konfiguraci v `repos.<repo>`,
- pokud je predano jen jedno `--url/--ref`, pouzije se jako vychozi hodnota pro vsechny nove/aktualizovane `repo`,
- pokud ma nektere `repo` odlisny `url/ref`, musi byt predan explicitne per-repo (interaktivne nebo opakovatelnym parametrem ve stylu `--source <repo>=<url>#<ref>`),
- pokud CLI narazi na konflikt (`repo` uz existuje s jinym `url/ref`), chovani ridi `--on-error`:
  - `ask`: dotaz, zda zachovat existujici nebo prepsat,
  - `warn`: zachovat existujici, konflikt zalogovat,
  - `fail`: okamzity konec s chybou.

Poznamka:
- nejasnost nevznika v tom, ze by repo nemelo svou konfiguraci; nejasnost je v tom, jak presne se ma chovat hromadny `connect`, kdyz jedna sada CLI parametru (`--url/--ref`) nemusi odpovidat vsem `repo`.

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
6. CLI ulozi `qui.config.json` s `root`, `defaultRepo` a `repos{url,ref,...}`.
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

Priklad pro `qui add Button`:

1. `repos.extended.uilibs[0]`
2. `repos.extended.uilibs[1]`
3. `repos.app.uilibs[0]`
4. `repos.app.uilibs[1]`
5. `root.uilibs[0]`
6. `root.uilibs[1]`

Jakmile CLI najde prvni existujici komponentu `Button` ve zdroji, okamzite ji bere z tohoto Git repa (`url` + `ref`) a dalsi kandidaty uz nezkouma.

Prakticky to znamena:
- search order urcuje poradi v konfiguraci,
- pri kolizi stejnych nazvu komponent rozhoduje prvni match,
- jednoznacne vynuceni zdroje se dela pres `--repo`.

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

1. Stahnout zdrojove soubory komponent do temp adresare podle zvoleneho repo (`--repo` nebo `defaultRepo`) a jeho `url/ref`.
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

Priorita urceni zdroje pro `update` je definovana v sekci 6.1 (jediny source of truth).

`metaSchemaVersion` je verze struktury metadat (ne verze komponenty). Doporuceni:

- format: `qui-meta/v<major>` (napr. `qui-meta/v1`),
- minor zmeny schema drzet backward-compatible bez zmeny major identifikatoru,
- breaking zmeny schema delat pres novou major hodnotu (`qui-meta/v2`),
- pri cteni nezname major verze:
  - `ask` rezim: upozornit a zeptat se na pokracovani,
  - `warn` rezim: pokusit se o best-effort fallback,
  - `fail-fast` rezim: ukoncit prikaz chybou.

## 10) `push` flow pro opravy komponent

`qui push` by mel delat:

1. Overit, ze projekt je Git repo a nema konflikty.
2. Vybrat jen soubory mapovane v `repos.<repo>.targetPath` pro jedno cilove repo.
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

- `--repo <repo|repo/uilib>` je povinny pro jednoznacny cil.
- Volitelne lze predat seznam komponent (`qui push button card --repo extended/base`).
- CLI vyfiltruje jen soubory pod `repos.<repo>.targetPath` a jen pro vybrane komponenty.
- Jeden command nikdy nepushuje vice repozitaru.
- Pri nesouladu puvodu (`quiSource.repo`) a ciloveho `--repo` CLI vypise warning; chovani dale ridi `--on-error`.

### 10.1.1) Mapovani souboru pri `push` (vice `uilib`)

Cil: i kdyz jedno repo obsahuje vice `uilib` (`base`, `web`, ...), `push` musi presne urcit, ktere soubory patri do cilove zmeny.

Pravidla:
1. `--repo` prijima selector ve tvaru `<repo>/<uilib>` (napr. `extended/base`) nebo samostatny `<repo>`.
2. Lokalne se bere pouze prefix `repos.<repo>.targetPath` + `/<component>/...`.
3. Remote cesta se pocita jako:
   - `<componentsRoot>/<uilib>/<component>/...`
4. Pokud uzivatel preda jen `<repo>` bez `uilib`:
   - `ask`: vyzadat vyber `uilib` z `repos.<repo>.uilibs`,
   - `warn`: pouzit prvni `uilib` v `uilibs` a zalogovat warning,
   - `fail`: skoncit chybou "`uilib` required".
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
- format registry s `componentsRoot` + `uilibs[]` + root mapovanim `repos{url,ref,...}`.

v2:
- vice registry provideru (GitHub, Gitea, self-hosted Git),
- zamykani verzi komponent (`ref` per component),
- chytrejsi merge lokalnich uprav (3-way merge),
- integrovane test hooks pred `push`.

## 14) Strucne priklady pouziti

```bash
# 1) pripojeni knihovny (ulozi root config)
qui connect --repo extended --url https://github.com/honzicekdev/q-ui-lib.git --ref main
qui connect --repo extended --repo app --url https://github.com/honzicekdev/q-ui-lib.git --ref main
# alternativne:
qui connect --repos extended app --url https://github.com/honzicekdev/q-ui-lib.git --ref main

# 2) inicializace projektu
qui init --repo extended

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

Tato sekce je zavazny implementacni kontrakt pro MVP. Pokud je nekde konflikt mezi textem vyse a touto sekci, plati tato sekce.

### 15.1) CLI parser kontrakt

Podporovane globalni prepinace:
- `--on-error <ask|warn|fail>`
- `--force`
- `--auto`
- `--dry-run`
- `--yes` (implicitni potvrzeni pouze tam, kde by jinak probehl interaktivni dotaz)

Prikaz `connect`:
- povolene tvary:
  - `qui connect --repo <repo>`
  - `qui connect --repo <repo> --repo <repo2>`
  - `qui connect --repos <repo...>`
  - kombinace `--repo` + `--repos` je validni
- source override:
  - globalni: `--url <url> --ref <ref>`
  - per-repo: `--source <repo>=<url>#<ref>` (opakovatelny)
- parser pravidla:
  1. `--repo` + `--repos` se slouci do jednoho pole
  2. trim + deduplikace pri zachovani prvniho vyskytu
  3. `--source` ma vyssi prioritu nez globalni `--url/--ref`
  4. pokud chybi `ref` v `--source`, command konci chybou
  5. pokud neni predano zadne repo, command konci chybou

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

Minimalni test matrix, ktery musi projit pred vydanim MVP:

1. `connect` parser a merge vstupu:
   - `--repo` + `--repos` merge, deduplikace, poradi.
   - `--source <repo>=<url>#<ref>` ma prioritu nad global `--url/--ref`.
   - chyba pri chybejicim `ref` v `--source`.
2. Config location:
   - `qui.config.json` se vytvori v project root.
   - command mimo project root skonci validacni chybou.
3. Source bootstrap:
   - instalace z Git korektne naplni `root.url/ref`.
   - instalace z npm bez zjistitelneho Git source pouzije template fallback (`npm-template`).
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
