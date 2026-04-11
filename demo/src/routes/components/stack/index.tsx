import { component$ } from "@builder.io/qwik";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";
import { Stack } from "~/components/ui/stack";

const codeColumn = `import { Stack } from "~/components/ui/stack";

<Stack direction="column" gap={4} align="stretch">
  <div class="h-8 rounded bg-fill-secondary" />
  <div class="h-8 rounded bg-fill-tertiary" />
</Stack>`;

const codeRow = `import { Stack } from "~/components/ui/stack";

<Stack direction="row" gap={2} align="center" justify="between" class="w-full max-w-md">
  <span class="text-callout">Vlevo</span>
  <span class="text-callout">Vpravo</span>
</Stack>`;

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Stack</h1>
        <p class="mt-2 max-w-prose text-body text-secondary-label">
          Jednoduchý flex: směr, mezery, zarovnání a wrap (
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1">
            LAYOUT.md
          </code>
          ).
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Sloupec</h2>

        <CodeExample>
          <Desc>
            Sloupec (
            <code class="text-caption-1">direction=&quot;column&quot;</code>
            ), mezery přes <code class="text-caption-1">gap</code>.
          </Desc>
          <TabExample>
            <Stack direction="column" gap={4} align="stretch" class="max-w-xs">
              <div class="h-8 rounded-md bg-fill-secondary" />
              <div class="h-8 rounded-md bg-fill-tertiary" />
              <div class="h-8 rounded-md bg-fill-quaternary/60" />
            </Stack>
          </TabExample>
          <TabCode>{codeColumn}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Řádek</h2>

        <CodeExample>
          <Desc>
            Řádek se zarovnáním na střed a rozložením{" "}
            <code class="text-caption-1">justify=&quot;between&quot;</code>.
          </Desc>
          <TabExample>
            <Stack
              direction="row"
              gap={2}
              align="center"
              justify="between"
              class="w-full max-w-md rounded-lg border border-separator-opaque/40 p-4"
            >
              <span class="text-callout text-label">Vlevo</span>
              <span class="text-callout text-secondary-label">Vpravo</span>
            </Stack>
          </TabExample>
          <TabCode>{codeRow}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
