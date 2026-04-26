# qui-feature

Balíček ve stylu [Qwik starter feature „tailwind“](https://github.com/QwikDev/qwik/tree/main/starters/features/tailwind): nepřidává Qwik komponenty k importu, ale **sloučí integraci** (závislosti + Vite plugin přes `__qwik__`) a dodá **sdílené styly** (`src/global.css` + `tailwind.config.js`).

## Proč tu dřív byly komponenty?

V první verzi byl balíček postavený jako **Qwik library** (`create qwik library`), která kvůli lokálnímu náhledu typicky obsahuje ukázku (`Logo`, `Counter`). To je oddělený koncept od **feature** složky u Qwiku — ta řeší jen integraci (např. Tailwind), ne export komponent.

## Instalace do Qwik aplikace

### Přes Qwik CLI (`qwik add`)

Stejný princip jako u oficiálních features: CLI načte `package.json` feature balíčku a sloučí `devDependencies` a úpravy `vite.config.ts` podle pole **`__qwik__`** (viz [Qwik feature tailwind](https://github.com/QwikDev/qwik/tree/main/starters/features/tailwind)).

```bash
# příklad: lokální cesta k tomuto repu (upravte)
qwik add ../../packages/qui-feature
```

Poté v aplikaci importujte globální styly (např. v `root.tsx` nebo layoutu):

```ts
import "./global.css";
```

Soubory `src/global.css` a `tailwind.config.js` zkopírujte z tohoto balíčku do svého projektu (nebo je symlinkujte), aby seděla cesta v `@config` uvnitř `global.css` (`@config "../tailwind.config.js"` očekává `tailwind.config.js` v kořeni aplikace vedle `src/`).

### Ručně (npm)

```bash
npm install -D tailwindcss@^4 @tailwindcss/vite@^4 prettier-plugin-tailwindcss@^0.6
```

Do `vite.config.ts` přidejte plugin:

```ts
import tailwindcss from "@tailwindcss/vite";
// ...
plugins: [/* … */, tailwindcss()],
```

Zkopírujte `tailwind.config.js` a `src/global.css` z tohoto balíčku.

## Monorepo (`q-ui-lib`)

```bash
npm install
```

Balíček je workspace položka v `packages/qui-feature`; nevyžaduje vlastní build skript.

## qui-client

V `devDependencies` je [`qui-client`](../qui-client) jako `"qui-client": "file:../qui-client"` (workspace balíček v `packages/qui-client`). Po `npm install` z kořene monorepa máte CLI **`qui`** k dispozici v tomto workspace.

Poznámka: pokud tento feature kopírujete nebo slučujete přes `qwik add` do projektu **mimo** tento monorepo, cesta `file:../qui-client` nebude platná — tam `qui-client` nainstalujte z npm nebo upravte závislost ručně.

## Licence

MIT (stejně jako nadřazený repozitář `q-ui-lib`, pokud není uvedeno jinak).
