# TODO (demo / projekt)

## Příprava na produkci (audit)

- **Build / lint (demo):** `npm run build` v `demo/` je zelený (eslint bez errors; zbývají jen warnings např. `qwik/no-use-visible-task`, `qwik/jsx-key`). 
- **CI:** V repu není `.github/workflows` — zvážit pipeline: `demo`: `npm ci`, `npm run build.types`, `npm run lint`, `npm run build` (a případně `fmt.check`).
- **Kořen knihovny:** `package.json` má `build` jako no-op, žádné automatické testy — pro „produkci“ knihovny jako zdrojů stačí dokumentovat očekávaný postup (`qui:build`, kontrola dema); unit/e2e testy chybí.
- **Bezpečnost / závislosti:** Pravidelně `npm audit` v `demo/` a `template/`; v `package.json` je `typescript-plugin-css-modules: "latest"` — pro reprodukovatelné buildy raději připnout verzi.
- **Nasazení demo:** Dokončit `qwik build`, zvolit adapter (viz `deploy` skript v demu), nastavit env a hlavičky (CSP) podle hostingu.
- **Známé nedostatky komponent:** viz `KNOWN_ISSUES.md` (Select, ScrollArea, Sidebar, Tabs, Tooltip, FileInput, …) — není to nutně blokér nasazení dema, ale ovlivňuje kvalitu UX.

---

## Šablona / CLI

- Při vytvoření template v root přidat `quiconfig.(js|ts)` — odkaz na zdrojové umístění q-ui-lib a možnost spouštět `qui` z knihovny; do `package.json` šablony skripty pro `add`, `update`.

---


