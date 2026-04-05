# Přenos inspirace z shadcn/ui do Qwiku

Tento dokument popisuje rozumný postup, když chceš knihovnu ve stylu [shadcn/ui](https://github.com/shadcn-ui/ui) (otevřený kód, Tailwind, varianta komponent), ale cílově **Qwik** a jen **vybrané** komponenty — v souladu s konceptem tohoto repa (`Q_UI_LIB.md`, CLI `add` / `update`).

Oficiální přehled komponent shadcn: [Components – shadcn/ui](https://ui.shadcn.com/docs/components). Repozitář: [shadcn-ui/ui](https://github.com/shadcn-ui/ui).

---

## 1. V čem je shadcn jiný než klasická npm knihovna

- Komponenty nejsou „černá skříňka“ z jednoho balíčku — **kopíruješ zdroják** do projektu a vlastníš ho.
- Styling je **Tailwind** + často **CSS proměnné** (design tokens) jako u shadcn [theming](https://ui.shadcn.com/docs/theming).
- Interaktivita u React verze stojí na **Radix UI**; v Qwiku **Radix nepoužiješ** — ekvivalentní vrstvu řeší např. [@qwik-ui/headless](https://qwikui.com/docs/headless/install) (přístupnost, klávesnice, stav).

**Doporučený postup v tomto repu:** nejdřív vybrat komponenty z shadcn podle potřeby, pak je **implementovat jako Qwik komponenty** (s Tailwind třídami inspirovanými shadcn), a kde to dává smysl, **stav a ARIA svěřit Qwik UI headless** místo přepisování Radix logiky z Reactu.

---

## 2. Jak postupovat krok za krokem (jen vybrané komponenty)

1. **Seřaď priority**  
   Začni od komponent, které použiješ na víc místech (Button, Input, Dialog, Dropdown, atd.). „Obalové“ věci (Card, Badge) jsou často čistý Tailwind + HTML.

2. **U každé shadcn komponenty rozhodni vrstvu**  
   - *Headless / chování:* existuje v `@qwik-ui/headless`? → použij ho a **jen obal** shadcn-like třídami (`class`, `cva`).  
   - *Jen vzhled:* zkopíruj strukturu a třídy z dokumentace shadcn, přepiš JSX na Qwik (`component$`, event handlery s `$`, signály místo `useState`).  
   - *Těžce reactová závislost* (např. Calendar + `react-day-picker`, Chart + Recharts, Command + cmdk): buď **vynechat**, nebo hledat Qwik-friendly alternativu / vlastní zjednodušenou verzi.

3. **Theming**  
   Zkopíruj koncept shadcn: `global.css` s proměnnými (`--background`, `--primary`, `radius`, …) a `tailwind.config` tak, aby na ně odkazoval — viz [Theming](https://ui.shadcn.com/docs/theming). To je jazykově nezávislé a hodí se 1:1 pro Qwik + Tailwind.

4. **Varianty komponent**  
   Stejně jako shadcn použij **`class-variance-authority` (cva)** + **`cn()`** (viz sekce Utility) pro `variant`, `size`, `disabled`, atd.

5. **Umístění v knihovně**  
   Každá komponenta ve složce `components/<název>/` s `index.tsx` a `meta.json` (verze pro CLI), jak je popsáno v `Q_UI_LIB.md`.

6. **Demo a dokumentace**  
   V demo aplikaci jedna route na komponentu nebo sekci; ověř SSR i hydrataci (Qwik resumability — vyhnout se zbytečnému client-only kódu).

---

## 3. Mapování: shadcn komponenta → Qwik UI (headless)

Sloupec **Qwik UI** odkazuje na balíček `@qwik-ui/headless` ([dokumentace](https://qwikui.com/docs/headless/install)). Exporty odpovídají verzi v tomto repu (viz root `package.json`).

Legenda:

| Značka | Význam |
|--------|--------|
| **Ano** | V headless knihovně je přímý (nebo téměř přímý) ekvivalent — typicky obalíš ho shadcn Tailwind vrstvou. |
| **~** | Částečná podobnost — stejný UX pattern, ale API / název se liší; často styluješ jinak nebo skládáš z primitiv. |
| **Ne** | V `@qwik-ui/headless` není; řešení = vlastní Qwik komponenta, nativní HTML, nebo jiná závislost. |

| shadcn komponenta | Qwik UI (`@qwik-ui/headless`) | Poznámka |
|-------------------|-------------------------------|----------|
| Accordion | **Ano** (`Accordion`) | Stejný vzor jako v tomto repu (`accordion`). |
| Alert | Ne | Semantika + Tailwind; případně `role="alert"`. |
| Alert Dialog | **~** (`Modal`) | Modal + `role="alertdialog"`, focus trap už řeší headless. |
| Aspect Ratio | Ne | CSS `aspect-ratio` / wrapper. |
| Avatar | Ne | `img` + fallback, případně stacked spans. |
| Badge | Ne | Čistý Tailwind (jako shadcn). |
| Breadcrumb | Ne | `<nav>` + odkazy + ARIA. |
| Button | Ne | Tlačítko je v headless jako primitivum spíš v kombinaci s jinými částmi; v repu máš vlastní `button`. |
| Button Group | Ne | Flex + `gap`, sdílené rohy přes třídy. |
| Calendar | Ne | React `react-day-picker` z shadcn nelze převzít 1:1; vlastní / jiná knihovna. |
| Card | Ne | Div struktura + Tailwind. |
| Carousel | **Ano** (`Carousel`) | Obal shadcn styly. |
| Chart | Ne | Shadcn používá Recharts (React); pro Qwik jiná strategie. |
| Checkbox | **Ano** (`Checkbox`) | |
| Collapsible | **Ano** (`Collapsible`) | Accordion je složitější varianta; pro jednu sekci stačí Collapsible. |
| Combobox | **Ano** (`Combobox`) | |
| Command | Ne | Pallete příkazů je často `cmdk` (React). |
| Context Menu | Ne | V headless není; Dropdown je nejbližší, ale ne ekvivalent. |
| Data Table | Ne | Shadcn staví na TanStack Table (React). |
| Date Picker | Ne | Typicky závisí na kalendáři. |
| Dialog | **Ano** (`Modal`) | Stejný UX vzor; pojmenování „Dialog“ vs „Modal“. |
| Direction | Ne | RTL / `dir` v layoutu (shadcn utilita pro React tree). |
| Drawer | **~** (`Modal`) | Boční panel = Modal + animace / pozice (nebo vlastní). |
| Dropdown Menu | **Ano** (`Dropdown`) | |
| Empty | Ne | Layout + ilustrace + text. |
| Field | Ne | Složení Label + Input + chybová hláška (shadcn v4 pattern). |
| Hover Card | **~** (`Popover` / `Tooltip`) | Hover Card často blíž Popover s hover trigger; Tooltip pro jednoduchý obsah. |
| Input | Ne | Nativní `<input>` + třídy. |
| Input Group | Ne | Flex wrapper kolem inputů a addonů. |
| Input OTP | Ne | Vlastní nebo specializovaný balíček. |
| Item | Ne | Skládací pattern ze shadcn v4 — vlastní. |
| Kbd | Ne | `<kbd>` + Tailwind. |
| Label | **Ano** (export `Label`) | |
| Menubar | Ne | Složité menu; v headless není hotové. |
| Native Select | Ne | `<select>`; headless `Select` je custom widget, ne native select. |
| Navigation Menu | Ne | V headless není. |
| Pagination | **Ano** (`Pagination`) | |
| Popover | **Ano** (`Popover`) | |
| Progress | **Ano** (`Progress`) | |
| Radio Group | **~** (`Checklist` / vlastní) | Headless nemá `RadioGroup`; radio skupinu často uděláš nativními `<input type="radio">` + `Label`, nebo zvážíš `Checklist` jen pokud UX sedí. |
| Resizable | Ne | V headless není. |
| Scroll Area | Ne | CSS `overflow`; případně vlastní. |
| Select | **Ano** (`Select`) | Custom select, ne nativní `<select>`. |
| Separator | **Ano** (export `Separator`) | |
| Sheet | **~** (`Modal`) | Side sheet = modal panel + slide animace. |
| Sidebar | Ne | Layout kompozice (můžeš vzít strukturu z shadcn jako inspiraci). |
| Skeleton | Ne | Tailwind animate-pulse bloky. |
| Slider | Ne | V headless není; v repu je vlastní `Slider` nad `<input type="range">` (viz `README.md`). |
| Sonner | Ne | Toast knihovna pro React; v Qwiku vlastní nebo jiný přístup. |
| Spinner | Ne | CSS / SVG + Tailwind. |
| Switch | **~** (`Toggle`) | Binární stav; API se liší od Radix Switch, vzhled sjednotíš třídami. |
| Table | Ne | Sémantické `<table>` + Tailwind. |
| Tabs | **Ano** (`Tabs`) | |
| Textarea | Ne | Nativní `<textarea>`. |
| Toast | Ne | V headless není hotový toast stack jako Sonner. |
| Toggle | **Ano** (`Toggle`) | |
| Toggle Group | **Ano** (`ToggleGroup`) | |
| Tooltip | **Ano** (`Tooltip`) | |
| Typography | Ne | Tailwind prose / vlastní textové třídy. |

Doplňující exporty v `@qwik-ui/headless` bez přímého „jednoho“ shadcn jména: **`Checklist`**, **`usePopover`**, **`VisuallyHidden`**, **`Polymorphic`**. Hodí se při složitější kompozici (např. více checkboxů, polymorfní kořen prvku).

> **Qwik UI Styled:** existuje i stylistická vrstva [@qwik-ui/styled](https://www.npmjs.com/package/@qwik-ui/styled) s jiným vizuálem než shadcn. Toto repo cílí na headless + vlastní shadcn-like skin; styled kit můžeš použít jako referenci, ne jako nutnost.

---

## 4. Utility a závislosti (stejný ekosystém jako u shadcn)

| Utility / balíček | Účel |
|-------------------|------|
| **Tailwind CSS** | Jádro stylů; `content` musí zahrnovat cesty ke komponentám knihovny i aplikace (`Q_UI_LIB.md`). |
| **clsx** | Podmíněné třídy. |
| **tailwind-merge** | Sloučení tříd bez konfliktů (`p-4` + `p-2` → výhra správné). |
| **`cn()`** | Konvence `cn(...inputs)` = `twMerge(clsx(inputs))` — stejný pattern jako shadcn. |
| **class-variance-authority (cva)** | `buttonVariants({ variant, size })` apod. — kopíruje se z shadcn přímo. |
| **CSS proměnné** | `hsl(var(--primary))` v `global.css` + `tailwind.config` — [theming shadcn](https://ui.shadcn.com/docs/theming). |
| **tailwindcss-animate** (volitelné) | Animace používané ve výchozích shadcn třídách. |
| **@qwik-ui/headless** | Přístupnost a chování pro komponenty označené **Ano** / **~** v tabulce výše. |

**Co z React ekosystému shadcn typicky nepřenášíš 1:1**

- **@radix-ui/react-*** — náhrada Qwik UI headless + vlastní markup.
- **lucide-react** — v Qwiku buď SVG inline, vlastní ikonkový komponent, nebo balíček kompatibilní s Qwikem (kontroluj SSR).
- **react-day-picker**, **recharts**, **cmdk**, **TanStack Table** — vázané na React; hledej Qwik alternativy nebo zjednodušenou implementaci.

---

## 5. Seznam komponent na shadcn dokumentaci (aktuální registry)

Následující položky jsou přehledem z oficiální stránky [Components](https://ui.shadcn.com/docs/components) (může se v čase rozšiřovat — vždy ověř u zdroje).

- Accordion  
- Alert  
- Alert Dialog  
- Aspect Ratio  
- Avatar  
- Badge  
- Breadcrumb  
- Button  
- Button Group  
- Calendar  
- Card  
- Carousel  
- Chart  
- Checkbox  
- Collapsible  
- Combobox  
- Command  
- Context Menu  
- Data Table  
- Date Picker  
- Dialog  
- Direction  
- Drawer  
- Dropdown Menu  
- Empty  
- Field  
- Hover Card  
- Input  
- Input Group  
- Input OTP  
- Item  
- Kbd  
- Label  
- Menubar  
- Native Select  
- Navigation Menu  
- Pagination  
- Popover  
- Progress  
- Radio Group  
- Resizable  
- Scroll Area  
- Select  
- Separator  
- Sheet  
- Sidebar  
- Skeleton  
- Slider  
- Sonner  
- Spinner  
- Switch  
- Table  
- Tabs  
- Textarea  
- Toast  
- Toggle  
- Toggle Group  
- Tooltip  
- Typography  

Další registry a CLI: [Registry directory](https://ui.shadcn.com/docs/directory), [CLI](https://ui.shadcn.com/docs/cli).

---

## 6. Shrnutí

- **Nepřenášej celou knihovnu** — vyber komponenty, které reálně potřebuješ; zbytek je technický dluh.  
- **Odděl chování a vzhled:** chování kde jde použij `@qwik-ui/headless`, vzhled převezměte z shadcn (Tailwind + tokens).  
- **Drž se stejných utilit** (`cn`, `cva`, CSS variables) jako shadcn — zjednoduší to portování tříd z dokumentace.  
- Tabulka v sekci 3 říká, kde už máš v Qwik UI „hotové“ jádro a kde musíš stavět od nuly.

---

## 7. Seznam komponent s variantou v Qwik UI (`@qwik-ui/headless`)

Níže jsou shadcn názvy seřazené podle toho, jak blízko mají modul v [@qwik-ui/headless](https://qwikui.com/docs/headless/install) (stejné rozlišení **Ano** / **~** jako v sekci 3).

### Přímý ekvivalent v headless

| shadcn (dokumentace) | Qwik UI export |
|----------------------|----------------|
| Accordion | `Accordion` |
| Carousel | `Carousel` |
| Checkbox | `Checkbox` |
| Collapsible | `Collapsible` |
| Combobox | `Combobox` |
| Dialog | `Modal` |
| Dropdown Menu | `Dropdown` |
| Label | `Label` |
| Pagination | `Pagination` |
| Popover | `Popover` |
| Progress | `Progress` |
| Select | `Select` |
| Separator | `Separator` |
| Tabs | `Tabs` |
| Toggle | `Toggle` |
| Toggle Group | `ToggleGroup` |
| Tooltip | `Tooltip` |

### Částečná náhrada (~)

| shadcn (dokumentace) | Qwik UI / postup |
|----------------------|------------------|
| Alert Dialog | `Modal` + `role="alertdialog"` |
| Drawer | `Modal` (boční panel, vlastní layout / animace) |
| Hover Card | `Popover` nebo `Tooltip` (podle obsahu a triggeru) |
| Radio Group | nativní `<input type="radio">` + `Label`; případně `Checklist` jen pokud UX sedí |
| Sheet | `Modal` (slide z kraje, vlastní styly) |
| Switch | `Toggle` (jiné API než Radix Switch; sjednotit vzhled třídami) |

### Další exporty headless bez jednoho shadcn jména

Tyto části knihovny nemají přímý 1:1 řádek v tabulce shadcn, ale při skládání UI se hodí:

- **`Checklist`** — seznam zaškrtávacích položek  
- **`Polymorphic`** — polymorfní kořenový prvek  
- **`VisuallyHidden`** — obsah jen pro čtečky obrazovky  
- **`usePopover`** — hook pro pokročilejší práci s popoverem  

Dokumentace: [Qwik UI – Headless](https://qwikui.com/docs/headless/install).
