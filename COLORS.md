# Palette and typography — mapping to Apple HIG / UIKit (web)

This document summarizes **semantic** colors and **text styles** from the Apple ecosystem (referenced from [Human Interface Guidelines — Color](https://developer.apple.com/design/human-interface-guidelines/color) to [UI element colors](https://developer.apple.com/documentation/uikit/uicolor/ui_element_colors) and related APIs). For web apps we only pick **semantic tokens** (not fixed RGB from UIKit) so they can be wired to **light/dark** and Tailwind.

---

## What we deliberately omit (or use only rarely)

| API / group | Reason |
|-------------|--------|
| `darkText`, `lightText` | Non-adaptive — for themed web, `label` + `secondaryLabel` … hierarchy is better |
| Deprecated (`groupTableViewBackground`, …) | Replaced by newer tokens |
| Fixed colors (`black`, `red`, `blue`, … in *Fixed colors*) | Non-adaptive; for brand/status prefer **adaptive** `systemRed`, etc. |
| `tintColor` | Runtime context in UIKit; on the web typically **`accent`** / `ring` / `primary` |

---

## 1. Colors — Tailwind placeholders (`theme.colors`)

Names in the **Token (Tailwind)** column are suggested keys in `theme.extend.colors` (kebab-case in config: `secondary-label` → class `text-secondary-label`).

### 1.1 Text and links

| UIKit (UI element colors) | Purpose | Token (Tailwind) |
|---------------------------|---------|------------------|
| `label` | Primary text | `label` |
| `secondaryLabel` | Secondary text (less prominent) | `secondary-label` |
| `tertiaryLabel` | Tertiary / muted text | `tertiary-label` |
| `quaternaryLabel` | Weakest readable text in the hierarchy | `quaternary-label` |
| `placeholderText` | Placeholder in inputs | `placeholder` |
| `link` | Links | `link` |

### 1.2 Backgrounds — “flat” interface (standard layout)

| UIKit | Purpose | Token (Tailwind) |
|-------|---------|------------------|
| `systemBackground` | Main surface | `background` or `surface-base` |
| `secondarySystemBackground` | Layer above main background | `surface-raised` |
| `tertiarySystemBackground` | Another layer (e.g. nested blocks) | `surface-overlay` |

### 1.3 Backgrounds — “grouped” (lists, cards in groups)

| UIKit | Purpose | Token (Tailwind) |
|-------|---------|------------------|
| `systemGroupedBackground` | Grouped screen background | `grouped-background` |
| `secondarySystemGroupedBackground` | Card / row in a group | `grouped-surface` |
| `tertiarySystemGroupedBackground` | Nested content in a group | `grouped-surface-inset` |

*Note:* On the web, one “grouped” variant + `surface-raised` is often enough; use three levels if you have dense nested layouts (e.g. settings).

### 1.4 Fills (subtle surfaces, states, chips)

| UIKit | Purpose | Token (Tailwind) |
|-------|---------|------------------|
| `systemFill` | Thin / small shapes | `fill` |
| `secondarySystemFill` | Medium shapes | `fill-secondary` |
| `tertiarySystemFill` | Large shapes | `fill-tertiary` |
| `quaternarySystemFill` | Large areas with complex content | `fill-quaternary` |

### 1.5 Separators

| UIKit | Purpose | Token (Tailwind) |
|-------|---------|------------------|
| `separator` | Thin lines, “shows through” content | `separator` |
| `opaqueSeparator` | Solid border | `separator-opaque` |

### 1.6 Accents and states — adaptive “system” colors

From [Standard colors](https://developer.apple.com/documentation/uikit/standard-colors) (suitable for badges, status icons, illustrative accents; **not** as a full brand palette substitute).

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

### 1.7 Gray steps (adaptive)

| UIKit | Token (Tailwind) |
|-------|------------------|
| `systemGray` | `system-gray` |
| `systemGray2` | `system-gray-2` |
| `systemGray3` | `system-gray-3` |
| `systemGray4` | `system-gray-4` |
| `systemGray5` | `system-gray-5` |
| `systemGray6` | `system-gray-6` |

### 1.8 Helpers (optional)

| UIKit | Token (Tailwind) | Note |
|-------|------------------|------|
| `clear` | `transparent` | Usually already in Tailwind |

---

## 2. Typography — placeholders by `UIFont.TextStyle`

Apple distinguishes styles via [UIFont.TextStyle](https://developer.apple.com/documentation/uikit/uifont/textstyle). Map them on the web as a **combination** of `font-size`, `line-height`, `font-weight` (and optionally `letter-spacing`). Specific px/rem are not part of HIG as a single web table — here are only **token names** for your Tailwind layer.

| TextStyle (UIKit) | Typical use | Suggested utility / composition |
|-------------------|---------------|--------------------------------|
| `extraLargeTitle2` | Very large hero heading | `text-extra-large-title-2` (custom) |
| `extraLargeTitle` | Hero heading | `text-extra-large-title` |
| `largeTitle` | Large screen title | `text-large-title` |
| `title1` | Hierarchy level 1 | `text-title-1` |
| `title2` | Hierarchy level 2 | `text-title-2` |
| `title3` | Hierarchy level 3 | `text-title-3` |
| `headline` | Emphasized heading / section | `text-headline` |
| `body` | Body copy | `text-body` |
| `callout` | Slightly larger than body (emphasis) | `text-callout` |
| `subheadline` | Subhead under headline | `text-subheadline` |
| `footnote` | Smaller supplementary text | `text-footnote` |
| `caption1` | Labels, metadata | `text-caption-1` |
| `caption2` | Smallest legible labels | `text-caption-2` |

**Text color** for type scales is usually kept separate: e.g. `text-body text-label`, metadata `text-caption-1 text-secondary-label`, so you can change color hierarchy without changing scale.

---

## 3. Practical recommendations with Tailwind

### Option A — CSS variables + `theme.extend.colors` (recommended)

- In global CSS define `:root` and `.dark` with values like `hsl(...)` for each token from the tables above.
- In `tailwind.config` map colors to `hsl(var(--token) / <alpha-value>)` (Tailwind 3.4+ supports alpha on custom colors per config).
- **Benefit:** One definition for light/dark, same names in components (`bg-background`, `text-secondary-label`).

### Option B — `theme.extend` only, no CSS vars

- Quick start; duplicate values for `darkMode: 'class'` via `dark:` in components or a plugin — harder to maintain for a larger library.

### Option C — `@layer components` for “Apple text style” in one class

- e.g. `.text-body` = size + line height + default `label` color.
- **Benefit:** fewer classes in templates. **Drawback:** harder to compose exceptions (color for one block only).

### Design questions (choose per product)

1. **Primary brand action:** use `system-blue` as `primary`, or a custom brand color outside the Apple set?
2. **Group vs flat:** will the web app be more “cards on gray grouped background”, or a single `background`?
3. **Semantic HTML:** keep headings as `h1`–`h3` with the same visual classes as `title1`–`title3`, independent of size.

When you want, this document can be used to generate a concrete `tailwind.config` + `app.css` with default HSL values inspired by iOS light/dark.

---

## References

- [Color — Apple HIG](https://developer.apple.com/design/human-interface-guidelines/color)
- [UI element colors](https://developer.apple.com/documentation/uikit/uicolor/ui_element_colors)
- [Standard colors](https://developer.apple.com/documentation/uikit/standard-colors)
- [UIFont.TextStyle](https://developer.apple.com/documentation/uikit/uifont/textstyle)
