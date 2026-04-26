# KNOWN_ISSUES.md

Přehled známých problémů v repozitáři (stav po analýze: `demo` — `npm run build.types`, `npm run lint`, `npm run build`).

## Kritické — blokují build / typy

### TypeScript: `ChartCanvas` — nebezpečný přetyp na `Record<string, unknown>`

- **Kde:** `components/base/chart/index.tsx` (ř. ~161; v demo kopie `demo/src/components/ui/chart/index.tsx`).
- **Chyba:** `TS2352` — přetyp `ChartDataset<…>` na `Record<string, unknown>`; TypeScript vyžaduje přes `unknown` nebo jiný bezpečný přístup k úpravě barev v datasetech.
- **Dopad:** `npm run build.types` a `qwik build` v `demo/` končí chybou.

### ESLint (chyby): nesprávné použití Qwik hooků v demo route

- **Kde:** `demo/src/routes/components/calendar/index.tsx` (ř. ~122–123).
- **Pravidlo:** `qwik/use-method-usage` — `useSignal` uvnitř IIFE (`{(() => { … })()}`) není v kontextu komponenty.
- **Dopad:** `npm run lint` v `demo/` hlásí 2 errory; mělo by se přepsat na malou vnořenou komponentu nebo přesunout stav do rodiče.

## Varování — build neblokují, ale stojí za pozornost

| Oblast | Soubor (přibližně) | Pravidlo |
|--------|-------------------|----------|
| Async handler + `preventDefault` | `demo/src/components/ui/calendar-input/index.tsx` | `qwik/no-async-prevent-default` (ř. ~225, ~264) |
| `useVisibleTask$` | `chart`, `scroll-area`, `select`, `demo/src/routes/theme/index.tsx` | `qwik/no-use-visible-task` — zvážit `useTask$` / event handlery, případně cíleně vypnout eslint u oprávněných případů |
| Chybějící `key` v iteraci | `demo/src/routes/components/item-list/index.tsx` (ř. ~50) | `qwik/jsx-key` |

## Poznámky

- Kořenový `npm run build` v knihovně jen vypíše zprávu; skutečná kontrola typů a produkční build probíhá v **`demo/`**.
- Po opravách v `components/base/*` synchronizovat do demo přes `qui update` podle `CLAUDE.md`, aby zůstaly zdroj a demo v souladu.
