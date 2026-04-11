import { component$ } from "@builder.io/qwik";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";
import { Spinner } from "~/components/ui/spinner";

const codeSizes = `import { Spinner } from "~/components/ui/spinner";

<div class="flex items-center gap-6">
  <Spinner size="sm" />
  <Spinner size="md" />
  <Spinner size="lg" />
</div>`;

const codeLabeled = `import { Spinner } from "~/components/ui/spinner";

<Spinner size="md" label="Načítám data" />`;

const codeCustom = `import { Spinner } from "~/components/ui/spinner";

<Spinner class="border-t-system-green" size="lg" />`;

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 font-semibold text-label">Spinner</h1>
        <p class="mt-2 max-w-prose text-callout text-secondary-label">
          Kruhový indikátor (Tailwind{" "}
          <code class="text-caption-1 text-label">animate-spin</code>) z{" "}
          <code class="rounded-md bg-fill-secondary px-1.5 py-0.5 text-caption-1 text-label">
            components/spinner
          </code>
          — výchozí barva segmentu{" "}
          <code class="text-caption-1 text-label">accent</code>.
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Velikosti</h2>

        <CodeExample>
          <Desc>Velikosti — viz ukázka níže.</Desc>
          <TabExample>
            <div class="flex flex-wrap items-center gap-8 rounded-lg border border-separator-opaque/40 bg-surface-raised p-6">
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
            </div>
          </TabExample>
          <TabCode>{codeSizes}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">S popiskem pro čtečky</h2>

        <CodeExample>
          <Desc>
            Prop <code class="text-caption-1 text-label">label</code> přidá{" "}
            <code class="text-caption-1 text-label">
              role=&quot;status&quot;
            </code>{" "}
            a skrytý text (
            <code class="text-caption-1 text-label">sr-only</code>
            ).
          </Desc>
          <TabExample>
            <div class="rounded-lg border border-separator-opaque/40 bg-surface-raised p-6">
              <Spinner size="md" label="Načítám data" />
            </div>
          </TabExample>
          <TabCode>{codeLabeled}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Vlastní barva</h2>

        <CodeExample>
          <Desc>
            Přepiš např.{" "}
            <code class="text-caption-1 text-label">border-t-system-green</code>{" "}
            přes <code class="text-caption-1 text-label">class</code>.
          </Desc>
          <TabExample>
            <div class="rounded-lg border border-separator-opaque/40 bg-surface-raised p-6">
              <Spinner class="border-t-system-green" size="lg" />
            </div>
          </TabExample>
          <TabCode>{codeCustom}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
