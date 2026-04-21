# THEME.md — Custom theming in q-ui-lib

> **TL;DR** — Theming = přepsání CSS proměnných (HSL) v `global.css`. Tailwind třídy (`bg-accent`, `text-label` …) reagují automaticky. Žádná změna komponent není nutná.

---

## 1. Jak systém funguje

Komponenty nepoužívají hardkódované barvy — odkazují pouze na **sémantické Tailwind třídy** (`bg-background`, `text-label`, `border-separator-opaque` …).

Tailwind tyto třídy mapuje na CSS proměnné v `tailwind.config.js`:

```js
// tailwind.config.js
const hsl = (v) => `hsl(var(${v}) / <alpha-value>)`;

colors: {
  label:              hsl("--label"),
  "secondary-label":  hsl("--secondary-label"),
  accent:             hsl("--accent"),
  background:         hsl("--background"),
  // … ~50 tokenů celkem
}
```

CSS proměnné jsou definovány v `src/global.css`:

```css
:root       { --accent: 211 100% 50%; … }   /* light mode */
.dark       { --accent: 210 100% 56%; … }   /* dark mode  */
```

Dark mode se přepíná přidáním třídy `.dark` na `<html>` (viz sekci 4).  
Tailwind je konfigurován s `darkMode: "class"`.

---

## 2. Tokeny — přehled

Plný popis sémantiky každého tokenu viz **[COLORS.md](COLORS.md)**.

| Skupina | Tokeny |
|---|---|
| **Text** | `--label`, `--secondary-label`, `--tertiary-label`, `--quaternary-label`, `--placeholder`, `--link` |
| **Akcent** | `--accent`, `--ring` |
| **Plochy — flat** | `--background`, `--surface-raised`, `--surface-overlay` |
| **Plochy — grouped** | `--grouped-background`, `--grouped-surface`, `--grouped-surface-inset` |
| **Fills** | `--fill`, `--fill-secondary`, `--fill-tertiary`, `--fill-quaternary` |
| **Separátory** | `--separator`, `--separator-opaque` |
| **Systémové barvy** | `--system-blue/brown/cyan/green/indigo/mint/orange/pink/purple/red/teal/yellow` |
| **Šedá stupnice** | `--system-gray` … `--system-gray-6` |

Výchozí hodnoty (HSL, bez `hsl()` obalu):

```css
/* Výchozí světlé téma — :root */
--label:                  0 0% 0%;
--secondary-label:        240 2% 25%;
--tertiary-label:         240 2% 42%;
--quaternary-label:       240 2% 52%;
--placeholder:            240 2% 52%;
--link:                   211 100% 50%;
--accent:                 211 100% 50%;
--ring:                   211 100% 50%;

--background:             0 0% 100%;
--surface-raised:         240 5% 96%;
--surface-overlay:        0 0% 100%;

--grouped-background:     240 6% 96%;
--grouped-surface:        0 0% 100%;
--grouped-surface-inset:  240 5% 93%;

--fill:                   240 6% 50%;
--fill-secondary:         240 5% 92%;
--fill-tertiary:          240 4% 65%;
--fill-quaternary:        240 4% 35%;

--separator:              240 6% 50%;
--separator-opaque:       240 5% 82%;

--system-blue:            211 100% 50%;
--system-brown:           28 35% 48%;
--system-cyan:            199 94% 43%;
--system-green:           135 59% 42%;
--system-indigo:          241 61% 52%;
--system-mint:            168 72% 38%;
--system-orange:          28 100% 50%;
--system-pink:            349 100% 59%;
--system-purple:          292 55% 48%;
--system-red:             3 100% 50%;
--system-teal:            184 100% 35%;
--system-yellow:          48 100% 50%;

--system-gray:            240 2% 50%;
--system-gray-2:          240 2% 55%;
--system-gray-3:          240 2% 60%;
--system-gray-4:          240 2% 65%;
--system-gray-5:          240 2% 70%;
--system-gray-6:          240 3% 75%;
```

---

## 3. Jak vytvořit vlastní téma

### Metoda A — přepsání proměnných v `global.css` (nejjednodušší)

Stačí přepsat libovolné tokeny za direktivami `@tailwind`:

```css
/* src/global.css */
@tailwind base;
@tailwind components;
@tailwind utilities;

:root {
  /* Přepis: fialový akcent místo výchozí modré */
  --accent: 270 80% 55%;
  --ring:   270 80% 55%;
  --link:   270 80% 55%;
}

.dark {
  --accent: 270 70% 65%;
  --ring:   270 70% 65%;
  --link:   270 70% 65%;
}
```

Tailwind třídy jako `bg-accent`, `ring-ring`, `text-link` automaticky zobrazí novou barvu — bez jakékoli změny kódu komponent.

---

### Metoda B — vícenásobná témata přes CSS třídu

Vhodné, pokud chcete nabídnout výběr z přednastavených témat:

```css
/* Výchozí tokeny zůstávají v :root */

.theme-purple {
  --accent: 270 80% 55%;
  --ring:   270 80% 55%;
}

.theme-green {
  --accent: 135 60% 45%;
  --ring:   135 60% 45%;
}

.theme-orange {
  --accent: 28 100% 50%;
  --ring:   28 100% 50%;
}
```

Přepínání v Qwiku:

```tsx
import { component$, useSignal, $ } from "@builder.io/qwik";

const THEMES = ["default", "purple", "green", "orange"] as const;
type Theme = (typeof THEMES)[number];

export const ThemeSwitcher = component$(() => {
  const active = useSignal<Theme>("default");

  const setTheme = $((theme: Theme) => {
    const html = document.documentElement;
    THEMES.forEach((t) => html.classList.remove(`theme-${t}`));
    if (theme !== "default") html.classList.add(`theme-${theme}`);
    active.value = theme;
    localStorage.setItem("color-theme", theme);
  });

  return (
    <div class="flex gap-2">
      {THEMES.map((t) => (
        <button key={t} onClick$={() => setTheme(t)}>{t}</button>
      ))}
    </div>
  );
});
```

---

### Metoda C — samostatný soubor `my-theme.css`

Vhodné pro projekty, které nechtějí upravovat `global.css` přímo:

```css
/* src/my-theme.css */
:root {
  --accent: 270 80% 55%;
  --ring:   270 80% 55%;
}
.dark {
  --accent: 270 70% 65%;
  --ring:   270 70% 65%;
}
```

```ts
// src/root.tsx nebo main entry
import "./global.css";
import "./my-theme.css";   // importovat za global.css — přepíše tokeny
```

---

## 4. Dark mode přepínač

Dark mode se aktivuje třídou `.dark` na `<html>`. Doporučená implementace v Qwiku:

**Inicializace před hydrací** (zabránění bliknutí — vložit do `<head>` v `root.tsx`):

```tsx
// src/root.tsx
export default component$(() => (
  <QwikCityProvider>
    <head>
      <script
        dangerouslySetInnerHTML={`
          (function() {
            var t = localStorage.getItem('theme');
            var prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
            if (t === 'dark' || (!t && prefersDark)) {
              document.documentElement.classList.add('dark');
            }
          })();
        `}
      />
      <RouterHead />
    </head>
    <body>
      <RouterOutlet />
    </body>
  </QwikCityProvider>
));
```

**Toggle komponenta:**

```tsx
import { component$, useSignal, useVisibleTask$, $ } from "@builder.io/qwik";

export const DarkModeToggle = component$(() => {
  const isDark = useSignal(false);

  useVisibleTask$(() => {
    isDark.value = document.documentElement.classList.contains("dark");
  });

  const toggle = $(() => {
    document.documentElement.classList.toggle("dark");
    isDark.value = !isDark.value;
    localStorage.setItem("theme", isDark.value ? "dark" : "light");
  });

  return (
    <button onClick$={toggle} aria-label="Toggle dark mode">
      {isDark.value ? "Light" : "Dark"}
    </button>
  );
});
```

Kombinace dark mode + barevné téma (metoda B) funguje bez konfliktu — dark přidává `.dark`, téma přidává `.theme-purple` atd.

---

## 5. Demo stránka: Theme Editor

> Stránka **zatím neexistuje** — tato sekce je návod k implementaci.

**Route:** `demo/src/routes/theme/index.tsx`  
**Sidebar:** přidat odkaz do `demo/src/routes/layout.tsx`

### Co stránka dělá

- Zobrazí všechny tokeny rozdělené do skupin (Text, Akcent, Surfaces, Fills, Separators, System Colors, Grays)
- Každý token = `<input type="color">` + textový vstup pro HSL hodnotu
- Změna se okamžitě aplikuje přes `document.documentElement.style.setProperty()`
- Tlačítko **"Kopírovat CSS"** vygeneruje hotový blok `:root { … }` ke zkopírování do vlastního projektu
- Tlačítko **"Reset"** obnoví výchozí hodnoty (importované jako konstanta)
- **Preview panel** vedle editoru — živá ukázka klíčových komponent (Button, Badge, Card, Input, Switch)

### Schéma implementace

```
demo/
├── src/
│   ├── lib/
│   │   └── theme-tokens.ts        ← seznam tokenů + výchozí hodnoty
│   └── routes/
│       └── theme/
│           └── index.tsx          ← editor stránka
```

**`demo/src/lib/theme-tokens.ts`:**

```ts
export type TokenGroup = {
  label: string;
  tokens: { name: string; default: string }[];
};

export const TOKEN_GROUPS: TokenGroup[] = [
  {
    label: "Text & Accent",
    tokens: [
      { name: "--label",             default: "0 0% 0%" },
      { name: "--secondary-label",   default: "240 2% 25%" },
      { name: "--tertiary-label",    default: "240 2% 42%" },
      { name: "--quaternary-label",  default: "240 2% 52%" },
      { name: "--placeholder",       default: "240 2% 52%" },
      { name: "--link",              default: "211 100% 50%" },
      { name: "--accent",            default: "211 100% 50%" },
      { name: "--ring",              default: "211 100% 50%" },
    ],
  },
  {
    label: "Surfaces — flat",
    tokens: [
      { name: "--background",       default: "0 0% 100%" },
      { name: "--surface-raised",   default: "240 5% 96%" },
      { name: "--surface-overlay",  default: "0 0% 100%" },
    ],
  },
  {
    label: "Surfaces — grouped",
    tokens: [
      { name: "--grouped-background",    default: "240 6% 96%" },
      { name: "--grouped-surface",       default: "0 0% 100%" },
      { name: "--grouped-surface-inset", default: "240 5% 93%" },
    ],
  },
  {
    label: "Fills",
    tokens: [
      { name: "--fill",            default: "240 6% 50%" },
      { name: "--fill-secondary",  default: "240 5% 92%" },
      { name: "--fill-tertiary",   default: "240 4% 65%" },
      { name: "--fill-quaternary", default: "240 4% 35%" },
    ],
  },
  {
    label: "Separators",
    tokens: [
      { name: "--separator",         default: "240 6% 50%" },
      { name: "--separator-opaque",  default: "240 5% 82%" },
    ],
  },
  {
    label: "System Colors",
    tokens: [
      { name: "--system-blue",   default: "211 100% 50%" },
      { name: "--system-brown",  default: "28 35% 48%" },
      { name: "--system-cyan",   default: "199 94% 43%" },
      { name: "--system-green",  default: "135 59% 42%" },
      { name: "--system-indigo", default: "241 61% 52%" },
      { name: "--system-mint",   default: "168 72% 38%" },
      { name: "--system-orange", default: "28 100% 50%" },
      { name: "--system-pink",   default: "349 100% 59%" },
      { name: "--system-purple", default: "292 55% 48%" },
      { name: "--system-red",    default: "3 100% 50%" },
      { name: "--system-teal",   default: "184 100% 35%" },
      { name: "--system-yellow", default: "48 100% 50%" },
    ],
  },
  {
    label: "Grays",
    tokens: [
      { name: "--system-gray",   default: "240 2% 50%" },
      { name: "--system-gray-2", default: "240 2% 55%" },
      { name: "--system-gray-3", default: "240 2% 60%" },
      { name: "--system-gray-4", default: "240 2% 65%" },
      { name: "--system-gray-5", default: "240 2% 70%" },
      { name: "--system-gray-6", default: "240 3% 75%" },
    ],
  },
];
```

**`demo/src/routes/theme/index.tsx` (kostra):**

```tsx
import { component$, useSignal, useTask$, $ } from "@builder.io/qwik";
import { TOKEN_GROUPS } from "~/lib/theme-tokens";

export default component$(() => {
  // Inicializace výchozích hodnot ze skupin
  const defaults = Object.fromEntries(
    TOKEN_GROUPS.flatMap((g) => g.tokens.map((t) => [t.name, t.default]))
  );
  const values = useSignal<Record<string, string>>({ ...defaults });

  // Aplikace tokenů na <html> při každé změně
  useTask$(({ track }) => {
    track(() => values.value);
    if (typeof document === "undefined") return;
    for (const [name, val] of Object.entries(values.value)) {
      document.documentElement.style.setProperty(name, val);
    }
  });

  const reset = $(() => {
    values.value = { ...defaults };
    // Odstranit inline styly — vrátit se na :root hodnoty
    if (typeof document !== "undefined") {
      for (const name of Object.keys(defaults)) {
        document.documentElement.style.removeProperty(name);
      }
    }
  });

  const copyCss = $(() => {
    const lines = Object.entries(values.value)
      .map(([k, v]) => `  ${k}: ${v};`)
      .join("\n");
    navigator.clipboard.writeText(`:root {\n${lines}\n}`);
  });

  return (
    <div class="flex gap-8 p-8">
      {/* Editor panel */}
      <div class="flex-1 space-y-6">
        <div class="flex gap-2">
          <button onClick$={copyCss} class="...">Kopírovat CSS</button>
          <button onClick$={reset}   class="...">Reset</button>
        </div>

        {TOKEN_GROUPS.map((group) => (
          <section key={group.label}>
            <h3 class="text-headline font-semibold mb-3">{group.label}</h3>
            <div class="space-y-2">
              {group.tokens.map((token) => (
                <div key={token.name} class="flex items-center gap-3">
                  <input
                    type="color"
                    // Převod HSL → hex pro color picker (pomocná funkce)
                  />
                  <code class="text-caption-1 w-52">{token.name}</code>
                  <input
                    type="text"
                    value={values.value[token.name]}
                    onInput$={(e) => {
                      values.value = {
                        ...values.value,
                        [token.name]: (e.target as HTMLInputElement).value,
                      };
                    }}
                    class="..."
                  />
                </div>
              ))}
            </div>
          </section>
        ))}
      </div>

      {/* Preview panel */}
      <div class="w-80 space-y-4 sticky top-8 self-start">
        <h3 class="text-headline font-semibold">Preview</h3>
        {/* Button, Badge, Card, Input, Switch — import z ~/components/ui/... */}
      </div>
    </div>
  );
});
```

### Poznámky k implementaci

- `<input type="color">` pracuje s HEX — je potřeba pomocná funkce pro konverzi HSL ↔ HEX (`hslToHex` / `hexToHsl`).
- Po opuštění stránky inline styly zůstávají na `<html>` — přidat `useVisibleTask$` cleanup, nebo to záměrně ponechat (umožní prohlížet jiné komponenty s vlastním tématem).
- Sidebar odkaz přidat v `demo/src/routes/layout.tsx` — vyhledat sekci s navigačními položkami a přidat položku `{ label: "Theme Editor", href: "/theme" }`.

---

## 6. Integrace do end-user projektu

Když uživatel inicializuje nový projekt přes CLI (`qui init ./my-app`), dostane:

- `src/global.css` s výchozími tokeny (světlé + tmavé téma)
- `tailwind.config.js` s mapováním přes HSL proměnné

Pro vlastní téma stačí:

1. **Rychlá úprava** — přepsat hodnoty přímo v `src/global.css` (Metoda A)
2. **Více témat** — přidat CSS třídy s přepsanými tokeny (Metoda B)
3. **Izolovaný soubor** — `src/my-theme.css` importovaný za `global.css` (Metoda C)

Komponenty neukládají barvy — přizpůsobí se automaticky.
