# Sjednocení komponent (q-ui-lib)

Tento dokument shrnuje aktuální vzory v `components/`, navrhuje cílovou strukturu a tabulku závislostí. Slouží jako podklad pro refaktoring (sdílené stavební kameny, utility, skládání místo duplicit).

**Kontext použití:** komponenty jsou určené k **kopírování do cílového projektu** tak, aby šlo **omezit velikost výsledného balíčku** — do aplikace se bere jen to, co opravdu potřebuješ. Proto dává smysl **přehledná plochá struktura** a **veřejně exportované** dílčí stavební kameny, z nichž lze skládat vlastní složené komponenty přímo v produktu, ne jen „uvnitř knihovny“.

## Aktuální stav vzorů

1. **Tenká vrstva nad `@qwik-ui/headless`** — `FunctionComponent`, sloučení `class` s výchozími Tailwind řetězci (`Popover`, `Dialog`, `DropdownMenu`, `Tooltip`, …). Konzistentní a dobré jako výchozí vzor.
2. **Čistý Qwik (`component$`)** — layout (`Box`, `Stack`, `Screen`), část formulářů (`Field`, `Input`), `Button` bez headless.
3. **Vlastní kontext + signály** — `Calendar`, `Sidebar`, `NavigationMenu`, `FileInput`, `Resizable`, `Sonner`, část `Select` (zarovnání panelu). Nezávislé na importech z ostatních složek knihovny.
4. **Skládání z jiných komponent knihovny** — zatím vzácné: pouze `menubar` → `dropdown-menu` + `toolbar`, `toolbar` → `separator`, `checkbox` (`CheckboxField`) → `label`.

**Duplicity (příležitosti k sjednocení, bez nutnosti měnit veřejné API):**

- **Popover vs HoverCard** — obě staví na `Popover` z headlessu; liší se výchozí `hover`, šířkou panelu a stylem triggeru. Nejsou duplicitní implementace „popupu“, ale **opakují se třídy panelu/šipky** podobně jako u `DropdownMenu.Popover` a `Combobox` panelu. Doporučení: **veřejný** sdílený modul (např. utility s konstantami tříd, nebo samostatná plochá položka ve stylu `floating-panel-surface` / exportované tokeny), aby stejné styly mohly použít jak komponenty v repu, tak zkopírovaný kód v aplikaci.
- **Dialog vs Sheet** — obě na `Modal` z headlessu; **shodný trigger**, velmi podobné `Content` / `Header` / `Footer` / `Title`. Doporučení: vyčlenit **veřejné** společné části (např. jednotný styled trigger, sdílené layout bloky pro modal obsah), `Sheet` nechat jako tenkou vrstvu nad `Modal` s `side` a globálními třídami.
- **Dropdown menu vs Combobox** — podobné vizuální třídy rozbalovacího panelu; Combobox **nepoužívá** export `Popover` z knihovny (má vlastní headless strom). Sjednocení přes **stejné veřejné tokeny / utility** (třídy, případně malý společný vizuální obal), ne přes vnucené API `Popover`, pokud by to hlásilo nesmyslný vztah mezi komponentami.
- **Příklad „PopupCalendar“** — v repozitáři **neexistuje** komponenta `Popup` ani `PopupCalendar`. Kalendář je **`Calendar`** (vlastní mřížka + kontext). Pro výběr data v plovoucím panelu doporučení: **skládat** `Popover.Root` / `Trigger` / `Panel` + obsah `Calendar.*` místo nové duplicitní implementace.

## Doporučená struktura (cíl)

### Ploché `components/`

- **Jen jedna úroveň složek:** `components/<kebab-case-nazev>/` — **ne** vnořené `components/<skupina>/<komponenta>/`. Přehlednost při výběru „co zkopíruju“ a při názvech importů je důležitější než umělá hierarchie adresářů.
- **`components/<name>/index.tsx`** (+ generované `meta.generated.json` podle `CREATE.md` / `META_GEN.md`) — hlavní veřejné API dané položky.
- **Velké moduly** (`sidebar`, `calendar`, …): pořád **jedna** složka `components/<name>/`; případné dílčí soubory jen uvnitř této složky (např. `calendar/utils.ts`), ne jako nová větev pod `components/`.

### Veřejné stavební kameny (ne „internal“)

Sdílené části, ze kterých mají stavět **jak knihovna, tak aplikace po zkopírování**, nepatří do skrytého `internal/`. Patří mezi **běžné exportované** prvky:

- buď jako **samostatná plochá položka** v `components/` s jasným účelem v názvu (např. vizuální primitivum pro plovoucí panel, společný modal trigger),
- nebo jako čisté **funkce / konstanty** ve vrstvě utility (níže).

Cíl: žádná „tajná“ vrstva — uživatel vidí stejné stavební kameny jako implementace `Dialog` nebo `Popover` a může z nich poskládat vlastní složené komponenty bez forkování stylů.

### Utility (obecné, znovupouzitelné, semver)

Kromě komponent smysl dává **sada utility**: čisté funkce a konstanty, které **nemusí** být Qwik komponenty, ale znovu se používají na více místech (v knihovně i po zkopírování do aplikace).

**Co typicky patří do utility (a co ne):**

| Patří | Nepatří (spíš komponenta nebo styl v aplikaci) |
| --- | --- |
| Slučování a normalizace tříd: `cn` / `twMerge`, `stringifyClass`, skládání `base + userClass` | Celé vizuální bloky, které uživatel skládá v JSX — to zůstane jako komponenta ve `components/` |
| **Konstanty a šablony Tailwind řetězců** sdílené mezi Popover, Dropdown, Combobox, modal panely (např. „plovoucí panel“, „šipka“, „modal trigger“) | Jednorázové třídy u jediné komponenty bez opakování |
| Mapování design tokenů na hodnoty (např. čtení CSS custom properties, barvy pro Chart.js) | Samotné definice tokenů v `global.css` / Tailwind theme — žijí v šabloně / aplikaci |
| Čistá doménová logika bez UI: formátování data (`YYYY-MM-DD`), výpočet rozsahu měsíce, validace vstupu | Stavové widgety s `useSignal` / kontextem pro konkrétní UI pattern |
| Sdílené typy a type guardy pro props / serializaci | Komponentně specifické typy vedle `index.tsx` je možné nechat lokálně |
| Malé čisté helpery (id prefixy, klávesové mapy, normalizace props) | Side-effect heavy kód vázaný na jednu složku — raději vedle komponenty |

- **Přísná zpětná kompatibilita:** veřejné exporty z utility jsou součástí kontraktu balíčku; změny podléhají **semver** (breaking jen záměrně, ve changelogu / verzi knihovny).
- **Oddělení od komponent:** vlastní strom (např. `utilities/` nebo `lib/` — sjednotit s `package.json` → `exports`), aby bylo jasné: **utility = logika a tokeny bez vlastního UI stromu**, zatímco **`components/<name>/`** = kopírovatelný UI modul (+ jeho `meta.generated.json` z `generate:meta`).

Konvence pojmenování u komponent: složené API jako objekt (`Dialog`, `Popover`, `Field`) nebo prefixy (`CheckboxRoot`, …) ponechat podle toho, co už knihovna používá; u nových komponent jeden styl podle `CREATE.md`. U nových **plošných** stavebních kamenů preferovat **výstižný kebab-case název složky**, ne zanoření.

---

## Šablona (`template/`), demo (`demo/`) a CLI

### Šablona a demo

- **`template/`** — výchozí **Qwik + Tailwind** aplikace (minimální „kanonický“ projekt). Slouží jako zdroj pro **`q-ui-lib init`** a pro **`sync-template`**: do cílové aplikace se přenáší konfigurace, `global.css`, základ routes apod. podle potřeby.
- **`demo/`** — nad šablonou vystavěná **ukázková aplikace**: obsahuje **všechny komponenty** knihovny pod `src/components/ui/`, route dokumentaci / příklady použití pod `src/routes/components/…` a slouží jako **živý katalog** a referenční integrace. Vývoj a kontrola regresí probíhají primárně v demu; chování šablony zůstává úsporné.

### Vzhled: Tailwind, `global.css` a konfigurace

**Sjednocený design** stojí na společné vrstvě ve **šabloně** (a stejně v **demu**), ne v jednotlivých komponentách:

- **`tailwind.config.js`** — šířka skenování (`content`), rozšíření, mapování na design tokeny (`theme`), případně pluginy. Jedna konfigurace pro celou aplikaci zajišťuje, že Tailwind „vidí“ třídy v komponentách i v routes.
- **`global.css`** — globální styly: základní reset nebo normalizace, **CSS custom properties** / `@theme`, sdílené utility pro headless (např. modal animace), barvy a typografie jako **proměnné**, které komponenty spotřebovávají přes Tailwind třídy (viz **`COLORS.md`** a konvence v **`CREATE.md`**).

Komponenty v `components/` by měly **odkazovat na tyto tokeny a pojmenované třídy** (např. `bg-surface-raised`, `text-label`, `ring-ring`), ne na náhodné hex hodnoty přímo v JSX. Díky tomu:

1. je **vzhled konzistentní** napříč celou sadou komponent;
2. jde **snadno přetemplatovat** cílový projekt — úpravy palety, radiusů, fontů nebo globálních pravidel se dělají hlavně v `global.css` / `tailwind.config.js` (a přenesou se přes **`sync-template`** nebo ruční sloučení se šablonou), aniž by bylo nutné přepisovat každou komponentu zvlášť.

### `meta.generated.json` u každé komponenty

Každá položka ve `components/<name>/` má **`meta.generated.json`** vytvořený **`npm run generate:meta`** (pole `name`, `title`, `version`, `apiTree`, …). Verze se používá při **`update`** v CLI k detekci odlišné verze v cílovém projektu (zdroj pravdy pro semver v úvodním JSDoc `@version` v `index.tsx`).

**Doporučené rozšíření metadat** (pro skripty, dokumentaci i konzistenci):

- **`componentDependencies`** (volitelné) — pole kebab-case názvů **jiných složek** z `components/`, které daná komponenta importuje (`../label`, `../separator`, …). Slouží k přenosu **transitivních** UI závislostí při `add` / `update`.
- **`npmDependencies`** nebo **`peerDependencies`** (volitelné) — npm balíčky nad rámec základu šablony (`@qwik-ui/headless`, `dayjs`, `chart.js`, …), které musí být v `package.json` cílové aplikace, aby komponenta běžela.
- **`cssVariables`** (volitelné, u složených i jednoduchých komponent kde to dává smysl) — pole odkazů na **CSS custom properties** nebo pojmenované tokeny z **`COLORS.md`**, které komponenta využívá (čtení z `getComputedStyle`, nebo třídy mapované na proměnné v `global.css`). Umožňuje audit tématu a kontrolu proti šabloně.
- **`composition`** (volitelné, zejména u **compound** API) — popis **struktury zanoření** podkomponent (`Root` → `List` → `ListItem`, …): textový outline, JSON strom, nebo seznam pravidel rodič–dítě. Mělo by odpovídat veřejnému API popsanému v **`BASE_COMPONENTS.md`**.

Konvence **pojmenování** `Root` / `Trigger` / `Panel` / jednoduchý `component$` export jsou rozvedeny v **`BASE_COMPONENTS.md`** („Konvence pojmenování a struktury podkomponent“).

Závislosti mezi komponentami lze odvodit z pole `dependencies` v `meta.generated.json` nebo statickou analýzou importů v `index.tsx`.

### CLI v kořeni repozitáře (`qui-client`)

V **`package.json`** je binárka **`qui`** → `bin/qui.js` → `src/cli.js`. Typické příkazy (aktuální kontrakt viz [CLI_MIGRATION.md](./CLI_MIGRATION.md)):

| Příkaz | Účel |
| --- | --- |
| `qui init` | `qui.config.json` + synchronizace šablon z balíčku do cílové aplikace. |
| `qui add …` | Zkopíruje komponenty ze zdroje v `qui.config.json` do `targetPath`. |
| `qui update …` | Přepíše / synchronizuje komponenty podle zdroje. |
| `qui generate` | Regeneruje `meta.generated.json` v `targetPath`. |
| `qui generate-demo` | Demo routy a podpůrné soubory pro dokumentační UI. |

Z kořene repa lze volat např. `npm run qui -- add button` (oddělovač `--` před argumenty příkazu). Po instalaci z npm: `npx qui …`.

**Očekávané chování při `add` / `update` (cíl pro implementaci):**

1. Po přidání nebo aktualizaci komponenty **zkontrolovat závislosti** (z `meta.generated.json` a/nebo z importů `~/components/ui/…` v zkopírovaném kódu).
2. **Chybějící komponenty knihovny** automaticky **zkopírovat** stejně jako primární výběr (rekurzivně podle `componentDependencies` / grafu importů).
3. **NPM závislosti**, které aplikace ještě nemá, **neinstalovat slepě bez vědomí uživatele** — CLI by mělo **vypsat varování** (seznam balíčků a doporučený `npm install …`) a případně nabídnout doplnění do `package.json` / jednorázovou instalaci.
4. **`verify-meta`** (až bude implementováno): porovnat deklarované **`cssVariables`** s výskyty v kódu a šabloně; ověřit **`composition`** vůči exportovaným podkomponentám / použitým headless dílům — při nesouladu **varovat** nebo **navrhnout** úpravu metadat.

Tím se sníží riziko rozbité aplikace po přidání např. `menubar` bez `dropdown-menu` / `toolbar`, nebo `calendar` bez `dayjs`, a zároveň se udrží dokumentace struktury a tématu v metadatech.

---

## Typy komponent (`compType`)

| Typ | Význam |
| --- | --- |
| **basic** | Žádná závislost na jiných modulech z `components/*` přes `../`; implementace = styly + DOM a/nebo přímé napojení na `@qwik-ui/headless` / externí knihovnu (např. Chart.js, dayjs). |
| **compose** | Importuje a skládá jiné komponenty z této knihovny; tenké propojení bez vlastní doménové logiky nad rámec skládání. |
| **complex** | Buď skládá komponenty knihovny **a** přidává vlastní orchestraci (kontext, synchronizace otevření, …), **nebo** nemá importy z `../`, ale obsahuje výraznou vlastní logiku (kalendář, postranní panel, drag-drop souborů, toast systém, klientský graf, workaroundy kolem headlessu). |

## Stav v UI (`compState`)

| Hodnota | Význam |
| --- | --- |
| **static** | Komponenta sama o sobě **nespravuje** viditelnost stránky / overlay / výběr data; typicky layout nebo statické styly. U headless „prvků“ použij **dynamic**, pokud jejich účelem je otevírat/zavírat nebo měnit stav (Dialog, Popover, atd.). |
| **dynamic** | Komponenta (nebo headless pod ní) **řídí měnící se UI**: overlay, otevřené menu, vybraný den, rozbalený accordion atd. `Screen` je **static** — jen layout viewportu; `Dialog` / `Popover` jsou **dynamic**. |

---

## Přehledová tabulka

Interní závislost = import z jiné složky pod `components/` (`../…`).  
**referred** = které komponenty z knihovny tuto komponentu importují (přímý `../`).

| Komponenta | Závislost (interní) | referred | compType | compState |
| --- | --- | --- | --- | --- |
| accordion | — | — | basic | dynamic |
| aspect-ratio | — | — | basic | static |
| avatar | — | — | basic | static |
| badge | — | — | basic | static |
| box | — | — | basic | static |
| button | — | — | basic | static |
| button-group | — | — | basic | static |
| calendar | — | — | complex | dynamic |
| card | — | — | basic | static |
| carousel | — | — | basic | dynamic |
| chart | — | — | complex | dynamic |
| checkbox | label | — | compose | dynamic |
| combobox | — | — | basic | dynamic |
| dialog | — | — | basic | dynamic |
| dropdown-menu | — | menubar | basic | dynamic |
| field | — | — | basic | static |
| file-input | — | — | complex | dynamic |
| grid | — | — | basic | static |
| hover-card | — | — | basic | dynamic |
| input | — | — | basic | static |
| input-group | — | — | basic | static |
| item | — | — | basic | static |
| label | — | checkbox | basic | static |
| menubar | dropdown-menu, toolbar | — | complex | dynamic |
| navigation-menu | — | — | complex | dynamic |
| pagination | — | — | basic | dynamic |
| popover | — | — | basic | dynamic |
| progress | — | — | basic | dynamic |
| resizable | — | — | complex | dynamic |
| screen | — | — | basic | static |
| scroll-area | — | — | basic | static |
| select | — | — | complex | dynamic |
| separator | — | toolbar | basic | static |
| sheet | — | — | basic | dynamic |
| sidebar | — | — | complex | dynamic |
| slider | — | — | basic | dynamic |
| sonner | — | — | complex | dynamic |
| spinner | — | — | basic | static |
| split | — | — | basic | static |
| stack | — | — | basic | static |
| switch | — | — | basic | dynamic |
| table | — | — | basic | static |
| tabs | — | — | basic | dynamic |
| textarea | — | — | basic | static |
| toggle-group | — | — | basic | dynamic |
| toolbar | separator | menubar | compose | static |
| tooltip | — | — | basic | dynamic |

\* *Button* je **static** v tomto smyslu: nespravuje vlastní otevřený overlay ani viditelnost panelu — pouze volá `onClick$` navenek. Interaktivní prvky, které přímo řídí zobrazení (modal, popover, tooltip), jsou **dynamic**.

---

## Kdo může čeho využít (doporučení)

| Spotřebič | Doporučení |
| --- | --- |
| Nový „datepicker“ / kalendář v overlay | `Popover` + `Calendar` (žádná nová `PopupCalendar` logika). |
| Další floating panel stejného vzhledu | Společné **veřejné** tokeny tříd nebo utility + konzistentní použití v `Popover` / `DropdownMenu` / `Combobox`. |
| Další modal varianta | Společné **veřejné** části s `Dialog` (`Modal` headless + stejné `Trigger` / obsahové sekce), aby je šlo importovat i mimo knihovnu. |
| Formulářové řádky | `Field` + `Label` + `Input` / `Textarea` / `Select` — už konzistentní skládání na úrovni dokumentace a dema; `InputGroup` + `Button` pro skupiny. |
| Lišta s rozbalovacími menu | `Menubar` (už využívá `DropdownMenu` + `Toolbar`) — vzor pro další „compose + complex“ komponenty. |
| Checkbox s textem | `CheckboxField` → už používá `Label`; nepřidávat druhý label wrapper. |

---

## Shrnutí

- Většina komponent je **basic**: jeden headless primitiv nebo čistý layout, bez vzájemných importů.
- Jen **tři** moduly dnes tvoří graf interních závislostí: **separator ← toolbar ← menubar**, **label ← checkbox**, plus **dropdown-menu ← menubar**.
- **HoverCard** není duplicitní „Popup“ — je variantou stejného headless **Popover** API jako `Popover`, odlišená výchozím chováním a styly.
- Pro sjednocení vizuálu a údržby: **veřejné** sdílené stavební kameny a **utility se semver disciplínou**; u nových funkcí **skládání** (`Popover` + `Calendar`) místo kopírování panelů. Struktura repa zůstává **plochá** v `components/`, aby kopírování do projektu zůstalo přehledné.
- **`template/`** drží minimální Qwik základ; **`demo/`** je plná ukázka s komponentami a routami. **`meta.generated.json`** obsahuje mimo jiné `dependencies`; CLI (`npm run qui`) má při přidávání/aktualizaci v budoucnu **doplňovat závislé komponenty** a **upozorňovat na npm balíčky**.
- **Tailwind + `global.css` + config** definují proměnné a pravidla pro jednotný vzhled a **přetemplatování** bez rozpadu komponent (tokeny dle **`COLORS.md`**).
- Pojmenování **`Root` / Trigger / …** vs. jednoduchý `component$`, plánovaný zápis **`cssVariables`** a **`composition`** a **verifikace v CLI** — viz **`BASE_COMPONENTS.md`**.
