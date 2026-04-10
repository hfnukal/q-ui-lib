# Registry – postup implementace v q-ui-lib

Tento dokument převádí koncept z [REGISTRY.md](./REGISTRY.md) na konkrétní kroky ve **stávajícím** repozitáři. Cíl je generovat metadata z TypeScriptu (ts-morph) a postupně dorovnat architekturu z dokumentu.

## Současný stav v projektu

| Oblast | Stav |
|--------|------|
| Zdroj komponent | Kořenová složka `components/<kebab-name>/index.tsx` (ne `repos/base`). |
| Ruční metadata | `components/<name>/meta.json` – typicky `name`, `version`, `type` (viz např. `components/button/meta.json`). |
| ts-morph | Je v `package.json`; existuje rozpracovaný skript `cli/ts-morph.js` (jen výpis exportů). |
| CLI (`cli/index.js`) | Příkazy `init`, `add`, `update`, `sync-template` – **žádné** `generate` / registry repo příkazy. |
| Introspekce v demu | `demo/src/server/ui-component-introspect.ts` – ts-morph analýza props a exportů pro `demo/src/components/ui/**`; lze znovupoužít vzory (`component$`, typy props). |

## Cílový stav (podle REGISTRY.md)

- Výstup: **`meta.generated.json`** (nebo sloučený výstup) s poli jako `kind`, `apiTree`, `dependencies`, `registry`, případně doplnění o existující ruční pole.
- Zdroj pravdy: TS zdroj; generátor je deterministický a opakovatelný z CLI.
- Volitelně později: více repozitářů (`repos/<id>`), `registry/repositories.json`, příkazy `repo add` / `repo sync`.

---

## Fáze 0 – Rozhodnutí a kontrakty

1. **Pojmenování a umístění výstupu**  
   - Buď `components/<name>/meta.generated.json` vedle ručního `meta.json`, nebo jeden agregovaný soubor v kořeni (např. `registry/components.generated.json`).  
   - Domluvit, zda konzumenti (demo, budoucí editor) čtou jen generované, nebo merge ručního + generovaného.

2. **Schéma**  
   - Zafixovat minimální JSON podle REGISTRY.md §11 (`name`, `kind`, `registry`, `dependencies`, `apiTree`).  
   - Mapovat na stávající `meta.json` (`version`, `type`), aby `update` CLI a dokumentace zůstaly konzistentní.

3. **Registry ID u jednoho zdroje**  
   - Pro aktuální monorep použít konstantu např. `"registry": "base"` nebo `"q-ui-lib"`, dokud neexistuje `repos/`.

---

## Fáze 1 – Jádro generátoru (bez multi-repo)

1. **Nový modul generátoru** (např. `cli/registry-generate.mjs` nebo `scripts/generate-registry.mjs` – podle konvence repa).  
   - `Project` z ts-morph s `tsConfigFilePath` odkazujícím na **kořenový** [`tsconfig.json`](./tsconfig.json) (už zahrnuje `components/**`).  
   - Skenovat `components/**/index.tsx` (sjednotit s [`cli/ts-morph.js`](./cli/ts-morph.js)).

2. **Detekce `kind`** (REGISTRY §4, §6.3, §7)  
   - Default export: pokud inicializátor je object literal s `component$` hodnotami → `compound`, jinak → `primitive`.  
   - Ověřit na reálných souborech v `components/` (většina bude `primitive`).

3. **Slot** (REGISTRY §8)  
   - Heuristika z dokumentu (`<Slot` v textu uzlu) nebo přesnější kontrola JSX tagu; zapsat do `apiTree` u příslušného uzlu.

4. **`apiTree` pro compound** (REGISTRY §5, §9)  
   - Vyfiltrovat klíče objektu default exportu.  
   - Kořen: konvence „Root“ jako kořen, pokud existuje; jinak definovat pravidlo (první klíč / výchozí meta).  
   - Hierarchie `children`: první iterace může být plochá (vše pod Root) nebo podle jednoduché heuristiky z JSX; rozšíření později.

5. **Závislosti** (REGISTRY §12)  
   - Projít importy v souboru; normalizovat relativní cesty na ID komponenty (`../button` → `button` / `base/button` podle zvoleného formátu).  
   - Ignorovat importy mimo `components/` nebo je označit zvlášť.

6. **Zápis výstupu**  
   - Pro každou komponentu zapsat `meta.generated.json` (nebo jeden manifest – viz Fáze 0).  
   - Volitelně: formátovat JSON stabilně (řazení klíčů) kvůli diffům v gitu.

---

## Fáze 2 – Napojení na CLI a npm

1. **Příkaz** v souladu s REGISTRY §10.3, např. `q-ui-lib generate` nebo `qui generate`.  
   - Implementovat v [`cli/index.js`](./cli/index.js) (CommonJS) voláním generátoru, nebo přepsat generátor na `.cjs` kvůli `require`.  
   - Přidat skript do [`package.json`](./package.json), např. `"generate:registry": "node cli/..."`.

2. **Čištění**  
   - Buď integrovat nebo odstranit experimentální [`cli/ts-morph.js`](./cli/ts-morph.js), aby nebyly dva rozporuplné vstupní body.

---

## Fáze 3 – Demo a konzistence

1. **Admin / dokumentace**  
   - Pokud demo zobrazuje seznam komponent z ts-morph, zvážit čtení z generovaného manifestu nebo stejného modulu jako CLI, aby nevznikly dva rozcházející se parsery.  
   - [`demo/src/server/ui-component-introspect.ts`](./demo/src/server/ui-component-introspect.ts) – sdílet typy/logiku s generátorem nebo generovat data před buildem a číst JSON.

2. **CI**  
   - V pipeline spustit `generate` a ověřit čistý `git diff` (nebo porovnat hash), aby se zabránilo driftu zdrojů a metadat.

---

## Fáze 4 – Multi-repo (volitelné, až bude potřeba)

1. **Struktura** – zřídit `repos/base` jako symlink nebo kopii, nebo ponechat `components/` jako canonical a `repos/base` jen alias v konfiguraci.  
2. **`registry/repositories.json`** – podle REGISTRY §3.2.  
3. **CLI** – `repo add`, `repo sync` (klonování, pull, validace struktury `components/`).  
4. **Generátor** – iterovat všechny registrované cesty a do výstupu doplňovat pole `registry` podle klíče v `repositories.json`.

---

## Kontrolní seznam k dokončení „minimálního“ registry

- [ ] Schéma výstupu a vztah k `meta.json` je popsán v kódu nebo v krátké poznámce u generátoru.  
- [ ] Generátor produkuje `kind`, `dependencies`, u compound `apiTree` (+ `slot` kde jde).  
- [ ] Jedno volání z příkazové řádky regeneruje metadata pro všechny komponenty v `components/`.  
- [ ] Dokumentace v REGISTRY.md zůstává referencí; tento soubor slouží jako praktický backlog pro q-ui-lib.

---

## Rizika a otevřené body

- **Compound + hierarchie**: plná „Step 3–4“ z REGISTRY §9 může vyžadovat iteraci heuristik; začít s plochým stromem pod `Root`.  
- **Qwik vzory**: ne všechny komponenty používají čistý `component$(` na default exportu – přidat výjimky nebo ruční override v `meta.json`.  
- **CJS vs ESM**: CLI je CommonJS; ts-morph modul – ověřit spouštění z Node bez konfliktů.
