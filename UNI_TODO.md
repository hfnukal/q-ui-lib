# UNI_TODO — postup sjednocení (podle UNIFICATION.md a BASE_COMPONENTS.md)

Tento soubor popisuje **pořadí a pravidla práce** při implementaci změn z [UNIFICATION.md](./UNIFICATION.md) a souvisejících konvencí z [BASE_COMPONENTS.md](./BASE_COMPONENTS.md). Není náhradou těchto dokumentů — slouží jako **kontrolní seznam** a **workflow** pro refaktoring.

**Poslední implementovaný blok (iterace):** sdílené Tailwind tokeny v `components/utilities/` (`floating-ui`, `modal-ui`), refaktoring clusterů Popover / HoverCard / Dropdown / Combobox / Dialog / Sheet, CLI kopíruje `utilities` do `src/components/ui/utilities/` při `init` / `add` / `update`, interaktivní `update` přeskakuje složky bez `meta.json`. Export z npm: `q-ui-lib/utilities`.

**Související reference:** [CREATE.md](./CREATE.md) (nové/úpravy komponent), [Q_UI_LIB.md](./Q_UI_LIB.md) (schéma `meta.json`), [COLORS.md](./COLORS.md) (tokeny), [REGISTRY_TODO.md](./REGISTRY_TODO.md) pokud řešíš registry vedle metadat.

---

## 0. Před začátkem

1. Přečti shrnutí cíle v **UNIFICATION.md** (sekce „Shrnutí“ a „Doporučená struktura“).
2. Ověř, že rozumíš rozdílu **jednoduchá vs. compound** komponenta a pojmenování podkomponent (**BASE_COMPONENTS.md**).
3. U každé konkrétní úlohy zvaž **semver**: veřejné exporty z `utilities/` / `lib/` i změny ve `meta.json` ovlivňují konzumenty balíčku a CLI.

---

## 1. Struktura repozitáře (invarianty)

- [x] **`components/` zůstává ploché:** jen `components/<kebab-case>/`, žádné vnořené skupiny pod `components/`. *(Sdílené tokeny: jedna plochá složka `components/utilities/` — bez vnořování skupin.)*
- [x] Velké moduly (**sidebar**, **calendar**, …) zůstávají v **jedné** složce; dílčí soubory (`utils.ts`, …) jen **uvnitř** téže složky.
- [x] Hlavní veřejné API: `components/<name>/index.tsx` + `meta.json` podle **CREATE.md** / **Q_UI_LIB.md**. *(Výjimka: `utilities/` nemá `meta.json` — není samostatná „komponenta“ pro verzovaný update podle názvu složky.)*

Pokud přidáváš **sdílené stavební kameny** určené ke kopírování do aplikace, neukládej je do skrytého `internal/` — buď **nová plochá položka** v `components/` s výstižným názvem, nebo **utility** (viz fáze 2).

---

## 2. Vrstva utility (`utilities/` nebo `lib/`)

**Cíl:** čisté funkce, konstanty Tailwind řetězců, typy — bez vlastního UI stromu; **semver** u veřejných exportů.

- [x] Zvolit jeden kanonický název stromu (`utilities/` vs `lib/`) a **sjednotit `package.json` → `exports`**, aby importy z aplikace i z knihovny byly předvídatelné. *(Kanón: `components/utilities/` + `exports` → `./utilities` v kořenovém `package.json`; žádné `lib/`.)*
- [ ] Postupně vyčleňovat opakující se věci z **UNIFICATION.md**:
  - [x] třídy / tokeny pro **plovoucí panely**, šipky, konzistentní vzhled **Popover / DropdownMenu / Combobox** (bez vnucování nesmyslných závislostí mezi komponentami);
  - [x] kde dává smysl, společné části pro **Dialog a Sheet** (např. styled trigger, layout bloky obsahu nad `Modal` z headlessu); *(trigger, title, description, ikonové close — obsahové sekce panelů zatím lokálně, liší se Dialog vs Sheet.)*
  - [ ] obecné helpery: `cn` / skládání tříd, formátování data, mapy kláves, … podle tabulky „Co patří do utility“ v **UNIFICATION.md**.
- [x] Po každém vyčlenění **aktualizovat konzumenty** v `components/` (a kopie v `demo/` přes `qui update`), aby nevznikaly paralelní kopie stylů.

---

## 3. Konzistence stylů a šablony

**Cíl:** jednotný vzhled a snadné přetemplatování cílového projektu (**UNIFICATION.md**, COLORS).

- [ ] Komponenty **neobsahují náhodné hex barvy** — používat tokeny / třídy z **COLORS.md** a `global.css` / `tailwind.config.js` v **template/** a **demo/**.
- [ ] Při změnách globálních pravidel zkontrolovat **template/** (minimum pro `qui init`) a **demo/** (plná ukázka); kde je to v dokumentaci popsáno, sladit přes **`qui sync-template`** nebo cílené ruční sloučení.
- [ ] Dokumentovat nebo doplnit chování **sync-template** v README/CLI, pokud se mění očekávané soubory šablony.

---

## 4. Sjednocení konkrétních clusterů komponent

Postupuj **po clusterech**, vždy: refaktoring → bump `meta.json` → `npm run qui -- update ./demo <složky>` → ověření route v demu.

| Oblast | Postup (shrnuto z UNIFICATION.md) |
| --- | --- |
| **Floating UI** | Sjednotit přes **veřejné tokeny / utility**; zarovnat opakující se třídy panelů mezi Popover, HoverCard, DropdownMenu, Combobox. *(Část hotova — viz `components/utilities/floating-ui.ts`.)* |
| **Dialog / Sheet** | Vyčlenit společné **Trigger** a obsahové sekce; Sheet nechat jako tenkou vrstvu (`side`, globální třídy) nad stejným headless `Modal`. *(Společný trigger + title/description/close — `modal-ui.ts`.)* |
| **Datum v overlay** | Nové scénáře skládat jako **`Popover` + `Calendar`**, ne duplikovat „popup“ logiku. |
| **Formuláře** | Držet **Field + Label + Input/…**; **CheckboxField** → Label bez druhého wrapperu. |
| **Compose** (menubar, …) | **Menubar** jako vzor: závislosti v kódu i v metadatech; při `add` musí dojít na transitivní UI závislosti. |

- [ ] U modulů se **zkráceným exportem** (viz **BASE_COMPONENTS.md**, inventář) plánovat postupný přechod na **compound namespace** (`Xxx.Root`, …) v souladu s **CREATE.md** — ideálně po blocích, ne jednorázový megacommit bez dema.

---

## 5. `meta.json` — rozšíření a údržba

Základ: **Q_UI_LIB.md**. Rozšíření dle **UNIFICATION.md** a **BASE_COMPONENTS.md**:

- [ ] **`componentDependencies`** (volitelné) — explicitní seznam kebab-case složek z `components/`, které daná komponenta importuje (`../…`).
- [ ] **`npmDependencies` / `peerDependencies`** (volitelné) — balíčky nad základ šablony (headless, dayjs, chart.js, …).
- [ ] **`cssVariables`** (volitelné) — tokeny / CSS custom properties relevantní pro komponentu (audit vůči šabloně).
- [ ] **`composition`** (volitelné u compound API) — textový nebo strukturovaný popis stromu podkomponent; má odpovídat **BASE_COMPONENTS.md** a reálnému exportu v `index.tsx`.

**Dokud neexistuje `qui verify-meta`:** při každé změně API nebo stylů **ručně** zkontrolovat soulad `composition` / `cssVariables` s kódem.

---

## 6. CLI (`npm run qui`)

Cílové chování je popsáno v **UNIFICATION.md** (tabulka příkazů a sekce „Očekávané chování při add / update“).

- [ ] **`add` / `update`:** po zkopírování komponenty zkontrolovat závislosti (z `meta.json` a/nebo importů); **chybějící složky z knihovny doplnit** rekurzivně. *(Část: synchronizace `components/utilities/` při `init`, `add` a `update`; složky bez `meta.json` se v interaktivním update nepokouší číst jako komponenty.)*
- [ ] **NPM závislosti:** neinstalovat slepě — **vypsat varování** a doporučený `npm install …` (případně interaktivní doplnění).
- [ ] **Plánováno — `qui verify-meta`:** ověření `cssVariables` a `composition` vůči implementaci; při nesouladu varovat nebo navrhnout doplnění `meta.json`.

Po implementaci úprav CLI aktualizovat krátkou zmínku v **README** (nebo v dokumentu, kde je CLI popsáno), pokud se mění příkazy nebo přepínače. *(Zmínka o `utilities/` v README doplněna.)*

---

## 7. Dokumentace typů komponent (`compType` / `compState`)

Tabulky v **UNIFICATION.md** slouží jako referenční inventář.

- [ ] Při větší změně komponenty zkontrolovat, zda se nemění charakter (**basic / compose / complex**) nebo stav (**static / dynamic**) a případně **aktualizovat tabulku** v UNIFICATION.md (nebo odkazovaný registry dokument, pokud přejímáte data odtud).

---

## 8. Kontrolní seznam pro jednu PR / iteraci

1. Změny v kódu odpovídají cíli z **UNIFICATION.md** (žádné zbytečné vnořování, žádné „tajné“ interní API pro sdílené kameny).
2. Compound komponenty dodržují **BASE_COMPONENTS.md** (namespace, `Root`, názvy podkomponent, mapování na headless).
3. **`meta.json`:** bump verze podle rozsahu; doplněná volitelná pole jsou pravdivá.
4. **`demo/`:** `npm run qui -- update ./demo …`, route a navigace v pořádku; viz **CREATE.md** bod 4.
5. Typecheck / build projdou; manuálně ověřit kritické route v demu.
6. Pokud se mění veřejné exporty utility nebo breaking API: poznámka do changelogu / verze balíčku podle semver.

---

## 9. Co tento soubor záměrně neřeší

- Detailní mapování shadcn → Qwik (**SHADCN.md**).
- Automatický generátor registru (**REGISTRY_TODO.md**) — může ale sdílet stejná metadata jako `meta.json`.

---

*Poslední sada kroků odpovídá struktuře dokumentů UNIFICATION.md a BASE_COMPONENTS.md; při rozporu platí tyto zdrojové dokumenty.*
