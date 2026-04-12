import { component$ } from "@builder.io/qwik";
import { Split } from "~/components/ui/split";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Split</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Vodorovně</h2>
        <CodeExample>
          <Desc>Dva panely vedle sebe — fixní šířka v pixelech a zbytek <code class="text-caption-1">1fr</code>.</Desc>
          <TabExample>
            <Split.Root direction="horizontal" class="h-32 rounded-lg border border-separator-opaque">
              <Split.Panel size="120px" class="bg-surface-raised p-3 text-callout">
                Fixní
              </Split.Panel>
              <Split.Panel size="1fr" class="bg-surface-overlay p-3 text-callout">
                Zbytek
              </Split.Panel>
            </Split.Root>
          </TabExample>
          <TabCode>{`import { Split } from "~/components/ui/split";

<Split.Root direction="horizontal" class="h-32 rounded-lg border border-separator-opaque">
  <Split.Panel size="120px" class="bg-surface-raised p-3 text-callout">
    Fixní
  </Split.Panel>
  <Split.Panel size="1fr" class="bg-surface-overlay p-3 text-callout">
    Zbytek
  </Split.Panel>
</Split.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Svisle</h2>
        <CodeExample>
          <Desc>Svislé panely: horní s fixní výškou, spodní vyplní zbytek.</Desc>
          <TabExample>
            <Split.Root direction="vertical" class="h-48 rounded-lg border border-separator-opaque">
              <Split.Panel size="4rem" class="bg-surface-raised p-2 text-caption-1">Top</Split.Panel>
              <Split.Panel size="1fr" class="bg-surface-overlay p-2 text-caption-1">Bottom</Split.Panel>
            </Split.Root>
          </TabExample>
          <TabCode>{`import { Split } from "~/components/ui/split";

<Split.Root direction="vertical" class="h-48 rounded-lg border border-separator-opaque">
  <Split.Panel size="4rem" class="bg-surface-raised p-2 text-caption-1">Top</Split.Panel>
  <Split.Panel size="1fr" class="bg-surface-overlay p-2 text-caption-1">Bottom</Split.Panel>
</Split.Root>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
