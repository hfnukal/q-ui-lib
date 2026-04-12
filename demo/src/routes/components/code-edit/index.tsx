import { $, component$, useSignal } from "@builder.io/qwik";
import { CodeEdit } from "~/components/ui/code-edit";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";

export const _Example1 = component$(() => {
  const code = useSignal("const hello = 'world';");

  return (
    <CodeEdit
      value={code.value}
      onValue$={(v) => { code.value = v; }}
    />
  );
});

export const _Example2 = component$(() => {
  const tsxCode = useSignal("// ukázka");
  const set = $((v: string) => {
    tsxCode.value = v;
  });
  return (
    <CodeEdit language="tsx" value={tsxCode.value} onValue$={set} />
  );
});

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">CodeEdit</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Základní použití</h2>
        <CodeExample>
          <Desc>Řízená komponenta — hodnota přichází přes <code class="text-caption-1">value</code>, změny jsou hlášeny přes `onValue.</Desc>
          <TabExample>
            <_Example1 />
          </TabExample>
          <TabCode>{`import { component$, useSignal } from "@builder.io/qwik";
import { CodeEdit } from "~/components/ui/code-edit";

export default component$(() => {
  const code = useSignal("const hello = 'world';");

  return (
    <CodeEdit
      value={code.value}
      onValue$={(v) => { code.value = v; }}
    />
  );
});`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">TSX / TypeScript</h2>
        <CodeExample>
          <Desc>Jazyk <code class="text-caption-1">tsx</code> — vhodné pro ukázky Qwik komponent a TypeScriptu. Další jazyky (<code class="text-caption-1">json</code>, <code class="text-caption-1">html</code>, <code class="text-caption-1">css</code>) nastav stejným způsobem přes prop <code class="text-caption-1">language</code>.</Desc>
          <TabExample>
            <_Example2 />
          </TabExample>
          <TabCode>{`import { component$, useSignal, $ } from "@builder.io/qwik";
import { CodeEdit } from "~/components/ui/code-edit";

export default component$(() => {
  const tsxCode = useSignal("// ukázka");
  const set = $((v: string) => {
    tsxCode.value = v;
  });
  return (
    <CodeEdit language="tsx" value={tsxCode.value} onValue$={set} />
  );
});`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">readOnly</h2>
        <CodeExample>
          <Desc>Prop <code class="text-caption-1">readOnly</code> — žádný <code class="text-caption-1">textarea</code>, pouze zvýrazněný výpis.</Desc>
          <TabExample>
            <CodeEdit
              readOnly
              language="json"
              value={JSON.stringify({ name: "q-ui-lib", version: "1.0.0" }, null, 2)}
            />
          </TabExample>
          <TabCode>{`<CodeEdit
  readOnly
  language="json"
  value={JSON.stringify({ name: "q-ui-lib", version: "1.0.0" }, null, 2)}
/>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
