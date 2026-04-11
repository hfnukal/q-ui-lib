import { component$, useSignal } from "@builder.io/qwik";
import { CodeEdit } from "~/components/ui/code-edit";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";

// ─── Example snippets ─────────────────────────────────────────────────────────

const codeBasic = `import { component$, useSignal } from "@builder.io/qwik";
import { CodeEdit } from "~/components/ui/code-edit";

export default component$(() => {
  const code = useSignal("const hello = 'world';");

  return (
    <CodeEdit
      value={code.value}
      onValue$={(v) => { code.value = v; }}
    />
  );
});`;

const codeLanguages = `// TSX (výchozí)
<CodeEdit language="tsx" value={tsxCode} onValue$={set} />

// JSON
<CodeEdit language="json" value={jsonCode} onValue$={set} />

// HTML
<CodeEdit language="html" value={htmlCode} onValue$={set} />

// CSS
<CodeEdit language="css" value={cssCode} onValue$={set} />`;

const codeReadOnly = `<CodeEdit
  readOnly
  language="json"
  value={JSON.stringify({ name: "q-ui-lib", version: "1.0.0" }, null, 2)}
/>`;

const DEMO_TSX = `import { component$, useSignal } from "@builder.io/qwik";
import { Button } from "~/components/ui/button";

export default component$(() => {
  const count = useSignal(0);

  return (
    <div class="flex flex-col gap-4">
      <p class="text-body text-label">Count: {count.value}</p>
      <Button onClick$={() => { count.value++; }}>
        Increment
      </Button>
    </div>
  );
});`;

const DEMO_JSON = `{
  "name": "q-ui-lib",
  "version": "1.0.0",
  "dependencies": {
    "@builder.io/qwik": "^1.19.2",
    "tailwindcss": "^3.4.15"
  },
  "devDependencies": {
    "typescript": "5.4.5",
    "vite": "7.3.1"
  }
}`;

const DEMO_CSS = `.button {
  display: inline-flex;
  align-items: center;
  padding: 0.5rem 1rem;
  border-radius: 0.5rem;
  background-color: #2563eb;
  color: #ffffff;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background-color 150ms;
}

.button:hover {
  background-color: #1d4ed8;
}`;

const DEMO_HTML = `<!doctype html>
<html lang="cs">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <title>Ukázka</title>
    <link rel="stylesheet" href="styles.css" />
  </head>
  <body>
    <main class="container mx-auto p-4">
      <h1 class="text-2xl font-bold">Ahoj světe</h1>
      <p class="text-gray-600">Toto je ukázkový HTML dokument.</p>
    </main>
  </body>
</html>`;

// ─── Page ─────────────────────────────────────────────────────────────────────

export default component$(() => {
  const tsxCode = useSignal(DEMO_TSX);
  const jsonCode = useSignal(DEMO_JSON);
  const cssCode = useSignal(DEMO_CSS);
  const htmlCode = useSignal(DEMO_HTML);
  const controlled = useSignal("const hello = 'world';");

  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">CodeEdit</h1>
        <p class="mt-2 max-w-prose text-body text-secondary-label">
          Textové pole se zvýrazněním syntaxe. Interní tokenizér pokrývá{" "}
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1 text-label">
            tsx / ts / js / jsx
          </code>
          ,{" "}
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1 text-label">
            json
          </code>
          ,{" "}
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1 text-label">
            html
          </code>{" "}
          a{" "}
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1 text-label">
            css
          </code>
          . Tab vloží 2 mezery.
        </p>
      </div>

      {/* Basic */}
      <section class="space-y-3">
        <h2 class="text-headline text-label">Základní použití</h2>

        <CodeExample>
          <Desc>
            Řízená komponenta — hodnota přichází přes{" "}
            <code class="text-caption-1">value</code>, změny jsou hlášeny přes{" "}
            <code class="text-caption-1">onValue$</code>.
          </Desc>
          <TabExample>
            <CodeEdit
              language="tsx"
              value={controlled.value}
              onValue$={(v) => {
                controlled.value = v;
              }}
              rows={4}
            />
          </TabExample>
          <TabCode>{codeBasic}</TabCode>
        </CodeExample>
      </section>

      {/* TSX */}
      <section class="space-y-3">
        <h2 class="text-headline text-label">TSX / TypeScript</h2>

        <CodeExample>
          <Desc>
            Jazyk <code class="text-caption-1">tsx</code> — vhodné pro ukázky
            Qwik komponent a TypeScriptu.
          </Desc>
          <TabExample>
            <CodeEdit
              language="tsx"
              value={tsxCode.value}
              onValue$={(v) => {
                tsxCode.value = v;
              }}
              rows={18}
            />
          </TabExample>
          <TabCode>{codeLanguages}</TabCode>
        </CodeExample>
      </section>

      {/* JSON */}
      <section class="space-y-3">
        <h2 class="text-headline text-label">JSON</h2>
        <CodeEdit
          language="json"
          value={jsonCode.value}
          onValue$={(v) => {
            jsonCode.value = v;
          }}
          rows={14}
        />
      </section>

      {/* CSS */}
      <section class="space-y-3">
        <h2 class="text-headline text-label">CSS</h2>
        <CodeEdit
          language="css"
          value={cssCode.value}
          onValue$={(v) => {
            cssCode.value = v;
          }}
          rows={16}
        />
      </section>

      {/* HTML */}
      <section class="space-y-3">
        <h2 class="text-headline text-label">HTML</h2>
        <CodeEdit
          language="html"
          value={htmlCode.value}
          onValue$={(v) => {
            htmlCode.value = v;
          }}
          rows={16}
        />
      </section>

      {/* Read-only */}
      <section class="space-y-3">
        <h2 class="text-headline text-label">readOnly</h2>

        <CodeExample>
          <Desc>
            Prop <code class="text-caption-1">readOnly</code> — žádný{" "}
            <code class="text-caption-1">textarea</code>, pouze zvýrazněný
            výpis.
          </Desc>
          <TabExample>
            <CodeEdit readOnly language="json" value={DEMO_JSON} rows={10} />
          </TabExample>
          <TabCode>{codeReadOnly}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
