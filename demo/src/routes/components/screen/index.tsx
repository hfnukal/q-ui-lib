import { component$ } from "@builder.io/qwik";
import { Screen } from "~/components/ui/screen";
import { Box } from "~/components/ui/box";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Split } from "~/components/ui/split";
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
        <h1 class="text-title-2 text-label">Screen</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Základ</h2>
        <CodeExample>
          <Desc>Náhled je omezený výškou — komponenta sama je na celý viewport.</Desc>
          <TabExample>
            <Screen class="bg-background max-h-[22rem]">
              <header class="shrink-0 border-b border-separator-opaque px-4 py-3">Header</header>
              <main class="min-h-0 flex-1">
                <p class="p-4">Main content</p>
              </main>
            </Screen>
          </TabExample>
          <TabCode>{`import { Screen } from "~/components/ui/screen";

<Screen class="bg-background max-h-[22rem]">
  <header class="shrink-0 border-b border-separator-opaque px-4 py-3">Header</header>
  <main class="min-h-0 flex-1">
    <p class="p-4">Main content</p>
  </main>
</Screen>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Skladba Layout</h2>
        <CodeExample>
          <Desc><code class="text-caption-1">Screen</code> + <code class="text-caption-1">Split</code> + <code class="text-caption-1">Stack</code> + <code class="text-caption-1">ScrollArea</code> + <code class="text-caption-1">Box</code> — v náhledu omez výšku (např. <code class="text-caption-1">class="h-[32rem]"</code>); dlouhý obsah + <code class="text-caption-1">keepScroll</code> na <code class="text-caption-1">ScrollArea.Pane</code>.</Desc>
          <TabExample>
            <Screen class="h-[22rem]">
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
                    <ScrollArea.Pane
                      class="min-h-0 flex-1"
                      viewportClass="p-4"
                      direction="vertical"
                      keepScroll
                      keepScrollId="screen-layout-demo"
                    >
                      <Box padding="md" background="grouped" rounded="lg" class="space-y-3">
                        <p>Hlavní obsah — odstavec 1.</p>
                        <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
                        <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
                        <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
                        <p>Duis aute irure dolor in reprehenderit in voluptate velit esse.</p>
                        <p>Cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat.</p>
                        <p>Sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
                        <p>Pellentesque habitant morbi tristique senectus et netus et malesuada.</p>
                        <p>Fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae.</p>
                        <p>Ultricies eget, tempor sit amet, ante. Donec eu libero sit amet.</p>
                        <p>Quam blandit euismod. Risus condimentum orci, eget eleifend nibh.</p>
                        <p>Poslední blok — měl by být po scrollu vidět až sem.</p>
                      </Box>
                    </ScrollArea.Pane>
                  </Stack>
                </Split.Panel>
              </Split.Root>
            </Screen>
          </TabExample>
          <TabCode>{`import { Box } from "~/components/ui/box";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Screen } from "~/components/ui/screen";
import { Split } from "~/components/ui/split";
import { Stack } from "~/components/ui/stack";

<Screen class="h-[22rem]">
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
        <ScrollArea.Pane
          class="min-h-0 flex-1"
          viewportClass="p-4"
          direction="vertical"
          keepScroll
          keepScrollId="screen-layout-demo"
        >
          <Box padding="md" background="grouped" rounded="lg" class="space-y-3">
            <p>Hlavní obsah — odstavec 1.</p>
            <p>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</p>
            <p>Sed do eiusmod tempor incididunt ut labore et dolore magna aliqua.</p>
            <p>Ut enim ad minim veniam, quis nostrud exercitation ullamco.</p>
            <p>Duis aute irure dolor in reprehenderit in voluptate velit esse.</p>
            <p>Cillum dolore eu fugiat nulla pariatur. Excepteur sint occaecat.</p>
            <p>Sunt in culpa qui officia deserunt mollit anim id est laborum.</p>
            <p>Pellentesque habitant morbi tristique senectus et netus et malesuada.</p>
            <p>Fames ac turpis egestas. Vestibulum tortor quam, feugiat vitae.</p>
            <p>Ultricies eget, tempor sit amet, ante. Donec eu libero sit amet.</p>
            <p>Quam blandit euismod. Risus condimentum orci, eget eleifend nibh.</p>
            <p>Poslední blok — měl by být po scrollu vidět až sem.</p>
          </Box>
        </ScrollArea.Pane>
      </Stack>
    </Split.Panel>
  </Split.Root>
</Screen>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
