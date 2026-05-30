# UI testy komponent (Playwright) — návrh postupu

Tento dokument popisuje end-to-end testování komponent knihovny proti **Qwik City demo** aplikaci. V kořeni je **Playwright** (`playwright.config.ts`, složka `e2e/`). Níže je workflow a konvence; další komponenty přidávej jako `e2e/ui/base/<slug>.spec.ts`.

**Playwright běží z kořene repozitáře** (`playwright.config.*` vedle `demo/`, `components/`). `webServer` v konfiguraci spouští dev server z `demo/` (např. `npm run dev` s `--host` a pevným portem), `baseURL` míří na tento server.

## Cíl

- Ověřit **funkčnost** (klikání, klávesnice, stav formulářů, otevření dialogů atd.) na reálné stránce.
- Ověřit **vzhled** (regrese layoutu) pomocí screenshotů nebo vestavěných snapshotů Playwrightu (`expect(page).toHaveScreenshot()`), případně vizuálního porovnání jen kritických stavů.

## Kontext: demo a QUI

- Demo aplikace žije typicky ve složce `demo/` s `qui.config.json` (`targetPath`, připojený zdroj komponent).
- Stránky jednotlivých komponent generuje příkaz **`qui generate-demo`** (výchozí báze routy je `/qui-demo`, lze změnit přes `--route-base`).
- URL jedné komponenty má tvar:

  `/<route-base>/components/<uilib>/<slug>/`

  Příklad pro výchozí knihovnu **`base`** a komponentu **dialog**:

  `/qui-demo/components/base/dialog/`

- V konfiguraci demo často figuruje jedna knihovna UI (např. `base` v `qui.config.json` → `uilibs`). Testy můžou brát **výchozí `uilib` = `base`** a parametrizovat ho (proměnná prostředí, konstanta v `playwright.config`), aby šlo později přidat další knihovny bez přepisování cest.

## Postup před testy

### 1. Mít aktuální demo a zkopírované komponenty

**Nový demo projekt** (z kořene `q-ui-lib` je k dispozici zkratka):

```bash
npm run qui:createdemo
```

nebo ručně: `qui init demo`, v `demo/` `qui add …`, pak `qui generate-demo` podle dokumentace CLI.

**Již existující `demo/`** — sjednotit obsah nainstalovaných komponent se zdrojem a znovu vygenerovat routy demo podle potřeby:

```bash
cd demo
node ../bin/qui.js update --all
node ../bin/qui.js generate-demo
```

- **`update --all`** — přepíše všechny už nainstalované komponenty ve `targetPath` (např. `src/components/ui`) z připojeného repozitáře.
- **`generate-demo`** — znovu vytvoří/aktualizuje routy pod `src/routes/<route-base>/components/…` podle toho, co je ve `targetPath` nainstalované. Po přidání nových komponent nebo změně struktury demo rout je vhodné ho spustit znovu.

> Poznámka: `update --all` bere „semínka“ ze **všech** nainstalovaných komponent ve `targetPath`, ne z jednoho parametru `uilib`. Výběr knihovny (`base` vs jiná) řídí obsah složek pod `targetPath` a `qui.config.json`.

### 2. Spustit demo server pro Playwright

V kořenovém `playwright.config` použít `webServer`: příkaz z `demo/` (working directory `demo`), pevný port a `reuseExistingServer` pro lokální vývoj. Testy pak používají `baseURL` (např. `http://127.0.0.1:5173`).

## Adresářová struktura testů (návrh)

Kořen repozitáře:

```text
q-ui-lib/
├── playwright.config.ts          # nebo .mts; baseURL, webServer → demo
├── package.json                  # skripty: playwright test, install browsers
├── demo/                         # Qwik app (cíl testů)
├── e2e/
│   ├── support/
│   │   ├── demo-routes.ts        # stavění cest: /qui-demo/components/{uilib}/{slug}/
│   │   └── constants.ts          # ROUTE_BASE, DEFAULT_UI_LIB ('base'), baseURL helper
│   └── ui/
│       ├── base/                 # segment = uilib ve URL; výchozí knihovna
│       │   ├── dialog.spec.ts
│       │   ├── tooltip.spec.ts
│       │   └── …                 # jeden *.spec.ts na leaf komponentu (slug = název souboru)
│       └── <jiná-uilib>/           # volitelně další knihovny stejným vzorem
├── test-results/                 # výstupy běhů (gitignore)
└── playwright-report/            # HTML report (gitignore)
```

*(Leaf komponenty ve vnořených slugách, např. `menu-item`, pojmenovat `menu-item.spec.ts`; případně podadresář `e2e/ui/base/menu/` jen pokud by demo mělo víc rout pod jedním „názvem“ — výchozí je plochá `e2e/ui/<uilib>/<slug>.spec.ts`.)*

**Konvence**

| Cesta na disku | Odpovídá |
|----------------|-----------|
| `e2e/ui/<uilib>/<slug>.spec.ts` | Demo URL `/<route-base>/components/<uilib>/<slug>/` |
| `e2e/support/` | Sdílené importy (URL, testID mapy, čekání na hydration) — **ne** `*.spec.ts` |

**Vizuální regrese:** Playwright ukládá snímky vedle specu do složky `<název>.spec.ts-snapshots/` (lze nechat default; případně centralizovat přes `snapshotPathTemplate` v configu, pokud bude potřeba jedna složka pro všechny snímky).

**Alternativa:** místo top-level `e2e/` použít `tests/e2e/…` se stejnou vnitřní hierarchií `ui/<uilib>/` — funkčně stejné, jen delší cesta. Doporučení zde je **`e2e/`** kvůli přehlednosti vedle `demo/`.

## Spouštění Playwright testů „po komponentách“

### Funkčnost

- Pro každou komponentu (nebo pro skupinu souvisejících scénářů) jeden soubor nebo `test.describe` s názvem odpovídajícím **slug** komponenty (např. `dialog.spec.ts`).
- Test naviguje na:

  `{baseURL}/qui-demo/components/{uilib}/{slug}/`

  kde **`uilib` výchozí = `base`**, pokud není přepsáno.
- Asserty: viditelnost, role ARIA, texty po interakci, počet prvků, URL query (pokud demo používá), atd.

### Vzhled

- Po stabilizaci layoutu (např. `await expect(locator).toBeVisible()` a případně `page.waitForTimeout` jen tam, kde nejde čekat na konkrétní stav) pořídit screenshot celé stránky nebo klíčového kontejneru.
- U komponent s animacemi vypnout animace v testovacím buildu nebo přes `reduced-motion` / test-only CSS, aby byly snímky deterministické.

### Spuštění jen pro jednu komponentu / jednu knihovnu

- Z kořene: `npx playwright test e2e/ui/base/dialog.spec.ts` nebo `npx playwright test -g "dialog"`.
- Parametrizace `uilib`: složka `e2e/ui/<uilib>/` už vybírá knihovnu; pro sdílené helpery volitelně `UI_LIB=base` v CI, pokud by některé specy byly generické.

## Shrnutí kroků

1. **Připravit demo:** buď vygenerovat nové demo, nebo v existujícím `demo/` spustit `qui update --all` a podle potřeby `qui generate-demo`.
2. **Nastavit Playwright v kořeni** (`playwright.config.*`, závislosti v kořenovém `package.json`), `webServer` → `demo/`, testy v `e2e/`.
3. **Pro každou komponentu** soubor `e2e/ui/base/<slug>.spec.ts`, navigace na demo URL, asserty a volitelně screenshoty.
4. **Výchozí `uilib`** v návrhu konvencí: **`base`** (složka `e2e/ui/base/`).

---

**Skripty v kořeni:** `npm run test:e2e` (spustí dev server v `demo/` na portu **5173** a testy), `npm run test:e2e:ui`, poprvé na čistém stroji `npm run playwright:install` (prohlížeče). Konfigurace: `playwright.config.ts` (`webServer`, `baseURL`). CI kroky doplnit podle potřeby (např. `cd demo && npm ci` před `test:e2e`).
