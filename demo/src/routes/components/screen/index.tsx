import { component$ } from "@builder.io/qwik";
import { CodeExample } from "~/components/demo/codeexample";
import { Box } from "~/components/ui/box";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Screen } from "~/components/ui/screen";
import { Split } from "~/components/ui/split";
import { Stack } from "~/components/ui/stack";

const codeBasic = `import { Screen } from "~/components/ui/screen";

<Screen class="bg-background">
  <header class="shrink-0 border-b border-separator-opaque px-4 py-3">Header</header>
  <main class="min-h-0 flex-1">…</main>
</Screen>`;

const codeLayout = `import { Box } from "~/components/ui/box";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Screen } from "~/components/ui/screen";
import { Split } from "~/components/ui/split";
import { Stack } from "~/components/ui/stack";

<Screen>
  <Split.Root direction="horizontal" class="min-h-0 flex-1">
    <Split.Panel size="200px">
      <Box padding="md" border rounded="lg" background="raised" class="h-full">
        Sidebar
      </Box>
    </Split.Panel>
    <Split.Panel>
      <Stack direction="column" gap={0} class="h-full min-h-0">
        <Box padding="md" border rounded="lg" background="overlay" class="shrink-0">
          Header
        </Box>
        <ScrollArea.Pane class="min-h-0 flex-1" viewportClass="p-4" direction="vertical">
          <Box padding="md" background="grouped" rounded="lg">
            Hlavní obsah (scroll)
          </Box>
        </ScrollArea.Pane>
      </Stack>
    </Split.Panel>
  </Split.Root>
</Screen>`;

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Screen</h1>
        <p class="mt-2 max-w-prose text-body text-secondary-label">
          Kořen rozvržení: celá obrazovka, bez scrollu na <code class="text-caption-1">body</code> (
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1">LAYOUT.md</code>
          ). Uvnitř použijte{" "}
          <code class="text-caption-1">ScrollArea</code> nebo <code class="text-caption-1">min-h-0 flex-1</code>.
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Základ</h2>
        <p class="text-callout text-secondary-label">
          Náhled je omezený výškou — komponenta sama je na celý viewport.
        </p>
        <CodeExample code={codeBasic}>
          <div class="h-64 overflow-hidden rounded-lg border border-separator-opaque shadow-sm">
            <Screen class="bg-grouped-background text-label">
              <header class="shrink-0 border-b border-separator-opaque bg-surface-raised px-4 py-3 text-callout font-medium">
                Horní lišta
              </header>
              <main class="min-h-0 flex-1 overflow-auto p-4 text-body text-secondary-label">
                Tělo s lokálním scrollem (v ukázce).
              </main>
            </Screen>
          </div>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Skladba podle LAYOUT.md</h2>
        <p class="text-callout text-secondary-label">
          <code class="text-caption-1">Screen</code> + <code class="text-caption-1">Split</code> +{" "}
          <code class="text-caption-1">Stack</code> + <code class="text-caption-1">ScrollArea</code> +{" "}
          <code class="text-caption-1">Box</code>.
        </p>
        <CodeExample code={codeLayout}>
          <div class="h-72 overflow-hidden rounded-lg border border-separator-opaque shadow-sm">
            <Screen class="bg-background text-label">
              <Split.Root direction="horizontal" class="min-h-0 flex-1">
                <Split.Panel size="200px">
                  <Box padding="md" border rounded="lg" background="raised" class="h-full text-callout">
                    Sidebar
                  </Box>
                </Split.Panel>
                <Split.Panel>
                  <Stack direction="column" gap={0} class="h-full min-h-0">
                    <Box
                      padding="md"
                      border
                      rounded="lg"
                      background="overlay"
                      class="shrink-0 text-callout font-medium"
                    >
                      Header
                    </Box>
                    <ScrollArea.Pane class="min-h-0 flex-1" viewportClass="p-4" direction="vertical">
                      <Box padding="md" background="grouped" rounded="lg" class="text-body text-secondary-label">
                        <ul class="space-y-2">
                          {Array.from({ length: 20 }, (_, i) => (
                            <li key={i}>Řádek obsahu {i + 1}</li>
                          ))}
                        </ul>
                      </Box>
                    </ScrollArea.Pane>
                  </Stack>
                </Split.Panel>
              </Split.Root>
            </Screen>
          </div>
        </CodeExample>
      </section>
    </div>
  );
});
