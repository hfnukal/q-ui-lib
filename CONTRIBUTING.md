# Přispívání do Q UI Library

Děkujeme za zájem o vylepšení projektu. Tento repozitář obsahuje Qwik UI komponenty (zdrojový kód) a CLI balíček **`qui-client`** (`qui`), který komponenty do aplikací přidává a synchronizuje.

## Licence

Kořenový `package.json` uvádí licenci **MIT**. Přispíváním souhlasíte s tím, že váš kód bude šířen pod stejnými podmínkami (pokud není v PR dohodnuto jinak).

## Lokální vývoj

- **Node.js**: používejte verzi, kterou máte v týmu pro Qwik 1.x (LTS je bezpečná volba).
- **Instalace závislostí** (monorepo, workspaces):

  ```bash
  npm install
  ```

- **CLI z monorepa** (stejné jako `npx qui …` po nainstalování `qui-client`):

  ```bash
  npm run qui -- --help
  ```

## Testy

Změny v **`qui-client`** by měly projít testy:

```bash
npm run test:qui-client
```

Nebo přímo v balíčku:

```bash
npm test -w qui-client
```

## Komponenty a metadata

- Komponenty žijí typicky pod `components/<uilib>/<název>/` (např. `components/base/button/`).
- Soubor **`meta.generated.json`** popisuje závislosti komponenty; po úpravách props/závislostí ho udržujte v souladu se zdrojem (nebo použijte `qui generate` v cílové aplikaci podle [README.md](README.md)).
- Nové nebo výrazně změněné komponenty dokumentujte v PR (co se mění pro konzumenty knihovny).

## Pull requesty

1. **Jedna tématická změna** na PR (snáze se reviewuje a revertuje).
2. **Popis PR**: co řeší, proč, jak ověřit (příkazy, ruční kroky u UI).
3. **Regresní rizika**: změny v CLI nebo ve struktuře komponent mohou rozbít existující `qui.config.json` — u breaking změn to explicitně napište.

## Rozšíření mimo „core“

Knihovna je navržena tak, aby šlo připojit **více zdrojů** (`repos`) a **`uilib`** v `qui.config.json`. Vlastní sady komponent můžete vést v odděleném repozitáři a připojit je přes `qui connect`; do tohoto repa patří zejména sdílené komponenty a vývoj `qui-client`.

## Dokumentace

- Přehled CLI a konfigurace: [README.md](README.md)
- Detail `qui-client`: [packages/qui-client/README.md](packages/qui-client/README.md)
- Kontrakt CLI: [docs/CLI_MIGRATION.md](docs/CLI_MIGRATION.md)

Otázky a návrhy můžete otevřít jako issue; u větších změn nejdřív krátký popis v issue šetří čas oběma stranám.
