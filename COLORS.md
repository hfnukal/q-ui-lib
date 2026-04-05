# Paleta a typografie — mapování na Apple HIG / UIKit (web)

Tento dokument shrnuje **sémantické** barvy a **textové styly** z ekosystému Apple (odkazované z [Human Interface Guidelines — Color](https://developer.apple.com/design/human-interface-guidelines/color) na [UI element colors](https://developer.apple.com/documentation/uikit/uicolor/ui_element_colors) a související API). Pro webové aplikace vybíráme jen **významové tokeny** (ne fixní RGB z UIKitu), aby šly napojit na **light/dark** a na Tailwind.

---

## Co záměrně nebereme (nebo jen výjimečně)

| API / skupina | Důvod |
|---------------|--------|
| `darkText`, `lightText` | Neadaptivní — pro themed web lepší hierarchie `label` + `secondaryLabel` … |
| Deprecated (`groupTableViewBackground`, …) | Nahrazeno novějšími tokeny |
| Fixní barvy (`black`, `red`, `blue`, … v sekci *Fixed colors*) | Neadaptivní; pro značku/status spíš **adaptivní** `systemRed` atd. |
| `tintColor` | Runtime kontext v UIKitu; na webu typicky **`accent`** / `ring` / `primary` |

---

## 1. Barvy — placeholdery pro Tailwind (`theme.colors`)

Názvy ve sloupci **Token (Tailwind)** navrhují jako klíče v `theme.extend.colors` (kebab-case v konfiguraci: `secondary-label` → třída `text-secondary-label`).

### 1.1 Text a odkazy

| UIKit (UI element colors) | Účel | Token (Tailwind) |
|---------------------------|------|------------------|
| `label` | Primární text | `label` |
| `secondaryLabel` | Sekundární text (méně důležité) | `secondary-label` |
| `tertiaryLabel` | Terciární / potlačený text | `tertiary-label` |
| `quaternaryLabel` | Nejslabší čitelný text v hierarchii | `quaternary-label` |
| `placeholderText` | Placeholder ve vstupech | `placeholder` |
| `link` | Odkazy | `link` |

### 1.2 Pozadí — „ploché“ rozhraní (standardní layout)

| UIKit | Účel | Token (Tailwind) |
|-------|------|------------------|
| `systemBackground` | Hlavní plocha | `background` nebo `surface-base` |
| `secondarySystemBackground` | Vrstva nad hlavním pozadím | `surface-raised` |
| `tertiarySystemBackground` | Další vrstva (např. vnořené bloky) | `surface-overlay` |

### 1.3 Pozadí — „seskupené“ (seznamy, karty ve skupinách)

| UIKit | Účel | Token (Tailwind) |
|-------|------|------------------|
| `systemGroupedBackground` | Pozadí skupinové obrazovky | `grouped-background` |
| `secondarySystemGroupedBackground` | Karta / řádek ve skupině | `grouped-surface` |
| `tertiarySystemGroupedBackground` | Vnořený obsah ve skupině | `grouped-surface-inset` |

*Poznámka:* Na webu často stačí jedna varianta „grouped“ + `surface-raised`; tři úrovně použijte, pokud máte husté nested layouty (např. nastavení).

### 1.4 Výplně (jemné plochy, stavy, chipy)

| UIKit | Účel | Token (Tailwind) |
|-------|------|------------------|
| `systemFill` | Tenké / malé tvary | `fill` |
| `secondarySystemFill` | Střední tvary | `fill-secondary` |
| `tertiarySystemFill` | Velké tvary | `fill-tertiary` |
| `quaternarySystemFill` | Velké plochy s komplexním obsahem | `fill-quaternary` |

### 1.5 Oddělovače

| UIKit | Účel | Token (Tailwind) |
|-------|------|------------------|
| `separator` | Tenké linky, „prosvítá“ obsah | `separator` |
| `opaqueSeparator` | Plná hranice | `separator-opaque` |

### 1.6 Akcenty a stavy — adaptivní „system“ barvy

Z [Standard colors](https://developer.apple.com/documentation/uikit/standard-colors) (vhodné pro badge, ikony stavu, ilustrativní akcenty; **ne** jako náhrada za plnou paletu značky).

| UIKit | Token (Tailwind) |
|-------|------------------|
| `systemBlue` | `system-blue` |
| `systemBrown` | `system-brown` |
| `systemCyan` | `system-cyan` |
| `systemGreen` | `system-green` |
| `systemIndigo` | `system-indigo` |
| `systemMint` | `system-mint` |
| `systemOrange` | `system-orange` |
| `systemPink` | `system-pink` |
| `systemPurple` | `system-purple` |
| `systemRed` | `system-red` |
| `systemTeal` | `system-teal` |
| `systemYellow` | `system-yellow` |

### 1.7 Šedé stupně (adaptivní)

| UIKit | Token (Tailwind) |
|-------|------------------|
| `systemGray` | `system-gray` |
| `systemGray2` | `system-gray-2` |
| `systemGray3` | `system-gray-3` |
| `systemGray4` | `system-gray-4` |
| `systemGray5` | `system-gray-5` |
| `systemGray6` | `system-gray-6` |

### 1.8 Pomocné (volitelné)

| UIKit | Token (Tailwind) | Poznámka |
|-------|------------------|----------|
| `clear` | `transparent` | Obvykle už v Tailwindu |

---

## 2. Typografie — placeholdery podle `UIFont.TextStyle`

Apple rozlišuje styly podle [UIFont.TextStyle](https://developer.apple.com/documentation/uikit/uifont/textstyle). Na web je mapujte jako **kombinaci** `font-size`, `line-height`, `font-weight` (a případně `letter-spacing`). Konkrétní px/rem nejsou součástí HIG jako jedna tabulka pro web — zde jsou jen **názvy tokenů** pro vaši Tailwind vrstvu.

| TextStyle (UIKit) | Typické použití | Návrh utility / kompozice |
|-------------------|-----------------|---------------------------|
| `extraLargeTitle2` | Velmi velký hero nadpis | `text-extra-large-title-2` (custom) |
| `extraLargeTitle` | Hero nadpis | `text-extra-large-title` |
| `largeTitle` | Velký nadpis obrazovky | `text-large-title` |
| `title1` | Hierarchie 1 | `text-title-1` |
| `title2` | Hierarchie 2 | `text-title-2` |
| `title3` | Hierarchie 3 | `text-title-3` |
| `headline` | Zvýrazněný nadpis / sekce | `text-headline` |
| `body` | Hlavní text | `text-body` |
| `callout` | Mírně větší než body (důraz) | `text-callout` |
| `subheadline` | Podnadpis pod headline | `text-subheadline` |
| `footnote` | Menší doplňkový text | `text-footnote` |
| `caption1` | Popisky, metadata | `text-caption-1` |
| `caption2` | Nejmenší legální popisky | `text-caption-2` |

**Barva textu** u typů obvykle držte zvlášť: např. `text-body text-label`, metadata `text-caption-1 text-secondary-label`, aby šla měnit hierarchie barev bez měnění měřítka.

---

## 3. Doporučení pro praktické použití s Tailwind

### Varianta A — CSS proměnné + `theme.extend.colors` (doporučeno)

- V globálním CSS definujte `:root` a `.dark` s hodnotami typu `hsl(...)` pro každý token z tabulek výše.
- V `tailwind.config` mapujte barvy na `hsl(var(--token) / <alpha-value>)` (Tailwind 3.4+ podporuje alpha u custom barev podle nastavení).
- **Výhoda:** Jedna definice pro light/dark, stejné názvy v komponentách (`bg-background`, `text-secondary-label`).

### Varianta B — Pouze `theme.extend` bez CSS vars

- Rychlý start; duplicitní hodnoty pro `darkMode: 'class'` přes `dark:` v komponentách nebo přes plugin — u větší knihovny hůř udržovatelné.

### Varianta C — `@layer components` pro „Apple text style“ v jedné třídě

- Např. `.text-body` = velikost + řádkování + výchozí barva `label`.
- **Výhoda:** méně tříd v šablonách. **Nevýhoda:** hůř skládat s výjimkami (barva jen pro jeden blok).

### Koncepční otázky (lze zvolit podle produktu)

1. **Primární akce značky:** použijete `system-blue` jako `primary`, nebo vlastní brand barvu mimo Apple sadu?
2. **Group vs flat:** webová appka bude víc „karty na šedém grouped pozadí“, nebo jednotné `background`?
3. **Semantic HTML:** nadpisy držet jako `h1`–`h3` se stejnými vizuálními třídami jako `title1`–`title3`, nezávisle na velikosti.

Až budete chtít, lze z tohoto dokumentu vygenerovat konkrétní `tailwind.config` + `app.css` s výchozími HSL hodnotami inspirovanými iOS light/dark.

---

## Reference

- [Color — Apple HIG](https://developer.apple.com/design/human-interface-guidelines/color)
- [UI element colors](https://developer.apple.com/documentation/uikit/uicolor/ui_element_colors)
- [Standard colors](https://developer.apple.com/documentation/uikit/standard-colors)
- [UIFont.TextStyle](https://developer.apple.com/documentation/uikit/uifont/textstyle)
