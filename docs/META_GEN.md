# Generátor `meta.generated.json` (TS-Morph Extraction Pipeline)

Tento dokument popisuje skript, který prochází `components/`, čte u každé komponenty `index.tsx` a zapisuje **`meta.generated.json`**.

## Spuštění

Z kořene repozitáře:

```bash
node scripts/generate-meta.mjs
```

nebo:

```bash
npm run generate:meta
```

Úvodní direktivy v `index.tsx` (normalizace bloku `@component` / `@title` / `@version` z existujícího JSDoc; výchozí titulek PascalCase ze složky, výchozí verze `1.0.0` pokud chybí):

```bash
npm run sync:directives
```

Blok na začátku souboru:

```tsx
/**
 * @component button
 * @title Button
 * @version 2.0.0
 */
```

`@component` musí odpovídat **názvu složky** (slug). `@title` a `@version` generátor čte pro pole `title` a `version` v `meta.generated.json` (viz výše). Verzi knihovny měň v tomto JSDoc (`@version`); po změně je vhodné spustit `npm run generate:meta`. Volitelně před generátorem `sync:directives` pro sjednocení formátu bloku.

Závislosti: `ts-morph` (již v projektu), Node.js s podporou ES modulů (`"type": "module"` není nutné — skript je `.mjs`).

## Vstup a výstup

| Vstup | Výstup |
|--------|--------|
| `components/**/index.tsx` | vedle vstupního souboru: `meta.generated.json` |

- Generátor prochází `components/` **rekurzivně** — zpracuje jak flat layout (`components/button/`), tak 3-level (`components/base/button/`, `components/owner/set/slug/`).
- Složky s `index.tsx` se zpracují; rekurze se do nich nezanořuje (předpokládá se, že komponenta neobsahuje podsložky s dalšími komponentami).
- Složky **bez** `index.tsx` jsou jen průchozí (např. `components/base/`, `components/utilities/`).

## Schéma výstupu

Pro každou analyzovanou komponentu se generuje JSON:

- **`name`** — identifikátor podle **složky** v `components/` (kebab-case, např. `button`, `input-group`).
- **`title`** — z úvodního JSDoc **`@title`** (celý řetězec za tagem), jinak název z hlavního exportu (PascalCase) nebo ze složky při `unknown`.
- **`version`** — z **`@version`** v tomže JSDoc, jinak `"0.0.0"`.
- **`kind`** — `"primitive"` \| `"compound"` \| `"unknown"` (pokud se nepodaří rozpoznat hlavní export).
- **`registry`** — vždy `"base"` (lokální knihovna).
- **`dependencies`** — seřazené unikátní kořeny z **relativních** importů (`../…`), viz níže.
- **`apiTree`** — strom API; tvar je stejný pro **primitive** i **compound**. U **primitive** tvoří `params` a `slot` přímo kořen `apiTree`. U **compound** má každý pojmenovaný díl svůj uzel s `params` / `slot`.
- **`npmDependencies`** — seznam npm balíčků (pole řetězců), které komponenta vyžaduje a nejsou součástí knihovny. Generátor pole odvodí z importů externích balíčků v `index.tsx`. CLI při `qui add` zkontroluje jejich přítomnost v cílové aplikaci a případně varuje.

## Detekce hlavního exportu

Nejjednodušší případ je **`export default`**. V kódu knihovny často **není** default export; skript proto používá toto pořadí:

1. **`export default`**
   - objektový literál → `kind: "compound"`, `apiTree` z klíčů objektu;
   - volání `component$(…)` → `kind: "primitive"`, `apiTree: { params, slot }`.
2. **`export const <Name> = …`** kde `<Name>` odpovídá složce: `button` → `Button`, `input-group` → `InputGroup`.
   - inicializátor je **objektový literál** s alespoň jednou vlastností → **compound**;
   - inicializátor je **`component$(…)`** → **primitive**.
3. **Fallback** — první exportovaný `const` vhodný jako compound, pak jako primitive.
4. Pokud nic z toho neplatí → **`kind: "unknown"`**, prázdný `apiTree`.

## Primitive vs compound

- **Primitive:** výchozí export nebo pojmenovaný export je přímo **`component$(…)`**.
- **Compound:** výchozí export nebo pojmenovaný export je **objektový literál** s dílčími částmi (např. `Dialog`, `Combobox`).

## `apiTree` pro compound

- Z objektového literálu se přečtou **klíče** (např. `Root`, `Trigger`, `Menu`, `MenuItem`) v **pořádku deklarace** ve zdroji.
- Pokud existuje klíč **`Root`**, výstup má tvar `apiTree.Root` s **`children`** pro ostatní části.
- Pokud **`Root` chybí**, stejné vnořování se aplikuje na **nejvyšší úrovni** `apiTree`.

### Vnořování podle pojmenování

Mezi klíči (kromě `Root`) se staví **strom podle prefixů v PascalCase**:

- Pro každý klíč `K` se hledá **rodič** = jiný klíč `P` z téže množiny takový, že `K` začíná na `P`, `length(P) < length(K)`, a **zbytek** `K.slice(P.length)` začíná **velkým písmenem** (nový segment, např. `Menu` + `Item` → `MenuItem` pod `Menu`; zabrání to falešnému párování typu `Control` + `roller` u `Controller`).
- Pokud takových `P` existuje více, bere se **nejdelší** `P` (např. `PopoverItemLabel` pod `PopoverItem`, ne pod `Popover`).

Klíče bez rodiče jsou na aktuální úrovni vedle sebe (např. `Root` → `Trigger`, `Menu`, `Control`, …).

**Omezení:** Vnoření **není** z JSX ani z runtime skládání — pouze z názvů exportovaných částí. Složitější heuristiky z JSX zde nejsou.

### `params` (volitelné u každého uzlu)

U částí implementovaných jako **`component$<…>(…)`** se z prvního type argumentu čtou **vlastnosti props** do pole **`params`**:

- Rozhraní / type alias odkazovaný z `component$<MyProps>`: berou se **vlastní** `PropertySignature` v těle rozhraní (dědictví `extends Omit<PropsOf<…>>` se do AST nepropsává jako další členy — zůstávají jen explicitně zapsané props).
- Čistý odkaz typu `PropsOf<"div">` bez vlastního literálu v aliasu → **`params` se nevyplní** (prázdný uzel `{}`).
- **String literal union** → pole řetězců (řazení pro stabilní výstup).
- **`string` / `number` / `boolean`** (včetně `| undefined` u volitelných) → řetězce `"string"`, `"number"`, `"boolean"`.
- **`PropFunction<…>` / `QRL<…>`** → `"function"`.

U **primitive** komponenty jsou `params` a případně **`slot`: `true`** přímo v kořeni **`apiTree`** (vedle sebe). U **compound** má `params` každý uzel, u kterého jde typ z `component$` rozřešit výše popsaným způsobem.

### Slot

- U každé části compoundu se zkusí najít **lokální** `const` se jménem odpovídajícím hodnotě vlastnosti (např. `Root: DialogRoot` → tělo `DialogRoot`).
- V těle se hledá výskyt **`<Slot`** v textu AST.
- Pokud je slot detekován, uzel má tvar `{ "slot": true }`; jinak `{}`.
- U **Root** se `slot` zapisuje jen když je `true`.

Části mapované na **importované** symboly (např. `HeadlessModal.Root`) bez lokálního těla v souboru často nedostanou `slot: true`, i když by headless komponenta slot podporovala.

## Závislosti

Z každého importu, jehož modul začíná na `.`, se vezme **první segment** cesty po `../` nebo `./`:

- `../button` → `button`
- `../utilities/modal-ui` → `utilities`

Externí balíčky (`@builder.io/qwik`, `@qwik-ui/headless`, …) se **nezahrnují**.

## Technická poznámka

Skript používá **ts-morph** s `tsconfig.json` v kořeni (stejné JSX / moduly jako knihovna). Výstup je deterministický JSON s odsazením 2 mezerami a ukončením novým řádkem.
