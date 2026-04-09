import { component$ } from "@builder.io/qwik";
import { CodeExample } from "~/components/demo/codeexample";
import { Box } from "~/components/ui/box";

const codePresets = `import { Box } from "~/components/ui/box";

<Box padding="md" margin="none" background="raised" border rounded="lg">
  Obsah
</Box>`;

const codeClass = `import { Box } from "~/components/ui/box";

<Box class="w-64 p-6 bg-surface-overlay rounded-xl border border-separator-opaque">
  Šířka a další styly přes class
</Box>`;

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Box</h1>
        <p class="mt-2 max-w-prose text-body text-secondary-label">
          Obecný kontejner: předvolby paddingu, pozadí a okraje podle tokenů (
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1">COLORS.md</code>
          , <code class="text-caption-1">LAYOUT.md</code>
          ). Rozměry přidejte přes <code class="text-caption-1">class</code>.
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Předvolby</h2>
        <CodeExample code={codePresets}>
          <Box padding="md" background="raised" border rounded="lg" class="text-body text-label">
            <code class="text-caption-1">padding=&quot;md&quot;</code>, raised surface, border.
          </Box>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Rozšíření přes class</h2>
        <CodeExample code={codeClass}>
          <Box class="w-64 border border-separator-opaque bg-surface-overlay p-6 text-callout text-label shadow-sm rounded-xl">
            Fixní šířka a vlastní padding v jedné třídě.
          </Box>
        </CodeExample>
      </section>
    </div>
  );
});
