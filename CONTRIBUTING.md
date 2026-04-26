# Přispívání do qui-client

Děkujeme za zájem o vylepšení projektu. **Kořen tohoto repozitáře je npm balíček `qui-client`** (příkaz **`qui`**): CLI kopíruje a synchronizuje Qwik UI komponenty z Git zdrojů do aplikace; kanonické zdroje komponent pro vývoj jsou v **`components/`**.

## Licence

`package.json` v kořeni uvádí licenci **MIT**. Přispíváním souhlasíte s tím, že váš kód bude šířen pod stejnými podmínkami (pokud není v PR dohodnuto jinak).

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

Změny v CLI by měly projít testy:

```bash
npm test
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
- Přehled a instalace z npm: [README.md](README.md) (sekce CLI a monorepo)
- Kontrakt CLI: [docs/CLI_MIGRATION.md](docs/CLI_MIGRATION.md)

Otázky a návrhy můžete otevřít jako issue; u větších změn nejdřív krátký popis v issue šetří čas oběma stranám.
