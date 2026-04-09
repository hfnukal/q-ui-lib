import { component$ } from "@builder.io/qwik";
import { CodeExample } from "~/components/demo/codeexample";
import { Split } from "~/components/ui/split";

const codeHorizontal = `import { Split } from "~/components/ui/split";

<Split.Root direction="horizontal" class="h-32 rounded-lg border border-separator-opaque">
  <Split.Panel size="120px" class="bg-surface-raised p-3 text-callout">
    Fixní
  </Split.Panel>
  <Split.Panel size="1fr" class="bg-surface-overlay p-3 text-callout">
    Zbytek
  </Split.Panel>
</Split.Root>`;

const codeVertical = `import { Split } from "~/components/ui/split";

<Split.Root direction="vertical" class="h-48 rounded-lg border border-separator-opaque">
  <Split.Panel size="4rem" class="bg-surface-raised p-2 text-caption-1">Top</Split.Panel>
  <Split.Panel size="1fr" class="bg-surface-overlay p-2 text-caption-1">Bottom</Split.Panel>
</Split.Root>`;

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Split</h1>
        <p class="mt-2 max-w-prose text-body text-secondary-label">
          Statické rozdělení (ne jako <code class="text-caption-1">Resizable</code>). Panel s{" "}
          <code class="text-caption-1">size</code> v pixelech/rem má fixní bázi;{" "}
          <code class="text-caption-1">1fr</code> nebo <code class="text-caption-1">flex</code> vyplní zbytek (
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1">LAYOUT.md</code>
          ).
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Vodorovně</h2>
        <CodeExample code={codeHorizontal}>
          <Split.Root direction="horizontal" class="h-32 max-w-xl rounded-lg border border-separator-opaque">
            <Split.Panel size="120px" class="bg-surface-raised p-3 text-callout text-label">
              Fixní 120px
            </Split.Panel>
            <Split.Panel size="1fr" class="bg-surface-overlay p-3 text-callout text-label">
              Flex 1fr
            </Split.Panel>
          </Split.Root>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Svisle</h2>
        <CodeExample code={codeVertical}>
          <Split.Root direction="vertical" class="h-48 max-w-md rounded-lg border border-separator-opaque">
            <Split.Panel size="4rem" class="bg-surface-raised p-2 text-caption-1 text-label">
              Top 4rem
            </Split.Panel>
            <Split.Panel size="1fr" class="bg-surface-overlay p-2 text-caption-1 text-label">
              Bottom flex
            </Split.Panel>
          </Split.Root>
        </CodeExample>
      </section>
    </div>
  );
});
