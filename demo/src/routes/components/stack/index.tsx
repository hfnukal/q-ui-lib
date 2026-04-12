import { component$ } from "@builder.io/qwik";
import { Stack } from "~/components/ui/stack";
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
        <h1 class="text-title-2 text-label">Stack</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Sloupec</h2>
        <CodeExample>
          <Desc>Sloupec ( <code class="text-caption-1">direction="column"</code> ), mezery přes <code class="text-caption-1">gap</code>.</Desc>
          <TabExample>
            <Stack direction="column" gap={4} align="stretch">
              <div class="h-8 rounded bg-fill-secondary" />
              <div class="h-8 rounded bg-fill-tertiary" />
            </Stack>
          </TabExample>
          <TabCode>{`import { Stack } from "~/components/ui/stack";

<Stack direction="column" gap={4} align="stretch">
  <div class="h-8 rounded bg-fill-secondary" />
  <div class="h-8 rounded bg-fill-tertiary" />
</Stack>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Řádek</h2>
        <CodeExample>
          <Desc>Řádek se zarovnáním na střed a rozložením <code class="text-caption-1">justify="between"</code>.</Desc>
          <TabExample>
            <Stack direction="row" gap={2} align="center" justify="between" class="w-full max-w-md">
              <span class="text-callout">Vlevo</span>
              <span class="text-callout">Vpravo</span>
            </Stack>
          </TabExample>
          <TabCode>{`import { Stack } from "~/components/ui/stack";

<Stack direction="row" gap={2} align="center" justify="between" class="w-full max-w-md">
  <span class="text-callout">Vlevo</span>
  <span class="text-callout">Vpravo</span>
</Stack>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
