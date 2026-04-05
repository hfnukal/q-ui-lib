# Vytvoření nebo aktualizace komponenty (prompt pro agenta)

Tento soubor slouží jako **šablona úkolu** pro AI agenta (Cursor a podobné). Vlož ho do konverzace nebo ho připoj přes `@CREATE.md`. Název komponenty buď uvedeš v úkolu, nebo ho agent doplní po dotazu (viz bod 0 v promptu).

---

## Prompt (zkopíruj a případně doplň název)

```
Úkol: V repozitáři q-ui-lib {{AKCE}} komponentu{{VOLITELNÝ_NÁZEV}}.

{{AKCE}} je buď „vytvoř novou“, nebo „aktualizuj existující“ (pokud složka components/{{NÁZEV_SLOŽKY}} už existuje).

Postupuj striktně v tomto pořadí:

0) Název komponenty
   - Pokud {{AKCE}} znamená vytvoření nové komponenty a uživatel v úkolu neuvedl konkrétní název (žádný „lidský“ název ani cílovou složku v components/), **nejdřív se zeptej**: jak se má komponenta jmenovat. Navrhni kebab-case název složky (např. „Tabs“ → components/tabs/) a nech ho potvrdit nebo upřesnit. **Bez tohoto upřesnění nezačínej implementaci.**
   - Pokud název už je součástí zprávy (např. „vytvoř Tabs“) nebo jde o aktualizaci existující složky v components/, pokračuj bez dalšího dotazu.

1) Zdroj chování a stylu (priorita)
   - Nejdřív otevři SHADCN.md v kořeni repa. V sekci s mapováním shadcn → Qwik UI zjisti, zda pro tuto komponentu existuje modul v @qwik-ui/headless (Ano / ~).
   - Pokud ano: implementuj komponentu jako tenký obal nad příslušným exportem z @qwik-ui/headless (jako components/accordion/index.tsx u Accordion). Přidej Tailwind třídy ve stylu shadcn / tohoto repa; používej konvence z SHADCN.md (cva, cn, CSS proměnné tam kde už projekt používá).
   - Pokud headless nestačí nebo chybí vzhled: jako druhou volbu prohlédni balíček @qwik-ui/styled (zdroj v node_modules nebo dokumentace). Neimportuj ho slepě do knihovny, pokud to není v souladu s root package.json — můžeš **zkopírovat nebo adaptovat** vzory markupu a tříd do vlastní komponenty v components/.
   - Pokud ani styled není vhodný: vezmi strukturu a třídy z dokumentace shadcn/ui pro příbuznou komponentu a přepiš je do Qwiku (component$, handlery s $, signály). Radix / React závislosti nepřenášej — chování řeš headlessem nebo nativním HTML + ARIA.

2) Umístění v knihovně
   - Složka: components/{{NÁZEV_SLOŽKY}}/ (název složky v kebab-case, odpovídá názvu komponenty v CLI).
   - Soubory: index.tsx (export hlavní komponenty), meta.json podle Q_UI_LIB.md (name, version, type). U nové komponenty version „1.0.0“; u aktualizace zvyš patch/minor podle rozsahu změny.

3) Konvence kódu
   - Drž se stylu existujících souborů v components/ (importy, typy props, JSDoc jen tam, kde to už rep používá).
   - Nepřidávej zbytečné závislosti; @qwik-ui/headless je už v root package.json.
   - U obalů nad @qwik-ui/headless: **nepředávej dětem props, které headless za běhu přepisuje** (typicky skončí chybou „Cannot set property … which has only a getter“). Postup viz sekce **„Headless a read-only props v Qwiku“** níže; u Tabs používej `key` místo explicitního `tabId` na triggeru, pokud to headless dovoluje.

4) Demo aplikace (demo/)
   - Přidej route demo/src/routes/{{NÁZEV_SLOŽKY}}/index.tsx s přehlednou ukázkou: nadpis, krátký popis, 1–3 sekce s různými stavy nebo props.
   - Import komponenty z knihovny: použij alias @components/* (viz demo/tsconfig.json), např. import z „@components/{{NÁZEV_SLOŽKY}}“ — stejně jako accordion route.
   - Uprav demo/src/routes/layout.tsx: přidej Link v navigaci na novou stránku (stejný vzor jako Button / Accordion).

5) Ověření
   - Projekt by měl projít bez chyb TypeScriptu; pokud běží dev server, **ověř novou route v prohlížeči** (SSR/dev někdy odhalí runtime chyby, které `tsc` nechytí — zejména u headlessu mutujícího props).

Na konci stručně shrň: co bylo přidáno/změněno a kde (cesty k souborům).
```

**Před odesláním agentovi nahraď (nebo nech agenta doplnit po bodu 0):**

| Zástupný symbol | Příklad |
|-----------------|--------|
| `{{AKCE}}` | `vytvoř novou` nebo `aktualizuj existující` |
| `{{VOLITELNÝ_NÁZEV}}` | buď ` „Tabs“` (s názvem), nebo prázdné — pak agent použije bod 0 |
| `{{NÁZEV_KOMPONENTY}}` | lidský název po upřesnění, např. „Checkbox“ |
| `{{NÁZEV_SLOŽKY}}` | kebab-case jako složka v `components/`, např. `checkbox`, `dialog` |

Příklady první řádky úkolu:

- S názvem: `Úkol: V repozitáři q-ui-lib vytvoř novou komponentu „Tabs“. …` (`{{NÁZEV_SLOŽKY}}` = `tabs`)
- Bez názvu (agent se zeptá): `Úkol: V repozitáři q-ui-lib vytvoř novou komponentu. …` (`{{VOLITELNÝ_NÁZEV}}` vynech nebo nech prázdné)

---

## Rychlá reference (pro člověka i agenta)

| Co | Kde |
|----|-----|
| Mapování shadcn ↔ Qwik UI, utilit | `SHADCN.md` |
| Struktura knihovny, `meta.json`, CLI | `Q_UI_LIB.md`, `README.md` |
| Příklad headless obalu | `components/accordion/index.tsx` |
| Příklad vlastní komponenty + varianty | `components/button/index.tsx` |
| Demo route + navigace | `demo/src/routes/*/index.tsx`, `demo/src/routes/layout.tsx` |
| Alias `@components` → kořenové `components/` | `demo/tsconfig.json` |
| Headless vs. Qwik props | sekce **Headless a read-only props v Qwiku** v tomto souboru |

---

## Headless a read-only props v Qwiku

Některé komponenty v `@qwik-ui/headless` během sestavení stromu **mutují** objekty dětí (např. `child.props.tabId = …`, `child.key = …`, u panelů `_tabId`). V Qwiku jsou props předané z rodiče často **přístupné jen přes gettery**; zápis na takové klíče pak vyhodí:

`Cannot set property <název> of #<Object> which has only a getter`

**Postup, jak podobné chybě předcházet:**

1. **Zjistit, co headless přepisuje** — v `node_modules/@qwik-ui/headless` otevři odpovídající zdroj (např. `components/tabs/tabs.qwik.mjs`) a hledej přiřazení do `props` nebo `child.props` u potomků.
2. **Nepředávat tyto props z obalu** — pokud headless hodnotu stejně dopočítá (často z `key` na VNode), předej jen `key` a prop vynech (příklad: **Tabs** — na `Tabs.Tab` nepředávat `tabId`, pokud stačí `key={hodnota}` shodná s panelem; viz `components/tabs/index.tsx`).
3. **Ověřit v dev serveru** — po přidání obalu otevři demo route; chyba se typicky projeví až při SSR/vykreslení, ne v TypeScriptu.

Když headless vyžaduje prop, který nelze vynechat, a zároveň ho mutuje, jde o nekompatibilitu verzí nebo omezení knihovny — řešení je issue upstream, pin verze, nebo vlastní skládání bez té mutace (podle dokumentace Qwik UI).

---

## Projektová pravidla

V repozitáři je pravidlo v [`.cursor/rules/q-ui-lib-ui-components.mdc`](.cursor/rules/q-ui-lib-ui-components.mdc): při práci na UI komponentách se řiď tímto souborem. Název u nové komponenty můžeš vynechat — agent se má podle promptu nejdřív zeptat.
