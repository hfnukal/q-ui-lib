import { component$ } from "@builder.io/qwik";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Dashboard } from "~/components/ui/dashboard";
import { Screen } from "~/components/ui/screen";
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
        <h1 class="text-title-2 text-label">Dashboard</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Základ — layout + dlaždice</h2>
        <CodeExample>
          <Desc><code class="text-caption-1">Screen</code> omezí výšku v náhledu; <code class="text-caption-1">Dashboard.Root</code> rozloží postranní panel a hlavní sloupec. <code class="text-caption-1">Sidebar</code> má vestavěný <code class="text-caption-1">q:slot="sidebar"</code>. <code class="text-caption-1">Content</code> používá <code class="text-caption-1">ScrollArea.Pane</code>; <code class="text-caption-1">Tiles</code> obaluje <code class="text-caption-1">Grid</code> s rozumnou mřížkou pro metriky.</Desc>
          <TabExample>
            <Screen class="max-h-[28rem] bg-background">
              <Dashboard.Root>
                <Dashboard.Sidebar>
                  <Stack direction="column" gap={3} class="text-callout text-label">
                    <span class="font-semibold">Navigace</span>
                    <Button variant="secondary" size="sm" class="justify-start">
                      Přehled
                    </Button>
                    <Button variant="secondary" size="sm" class="justify-start border-0 bg-transparent shadow-none hover:bg-fill-secondary/50">
                      Reporty
                    </Button>
                  </Stack>
                </Dashboard.Sidebar>
                <Dashboard.Main>
                  <Dashboard.Header>
                    <Stack direction="row" gap={2} align="center" justify="between" class="w-full">
                      <span class="text-callout font-medium text-label">Přehled</span>
                      <Badge variant="secondary">Beta</Badge>
                    </Stack>
                  </Dashboard.Header>
                  <Dashboard.Content viewportClass="p-4" keepScroll keepScrollId="dashboard-demo">
                    <Stack direction="column" gap={4} class="pb-4">
                      <Dashboard.Tiles columnsClass="grid-cols-1 sm:grid-cols-3" gap={3}>
                        <Card.Root class="min-h-[5.5rem]">
                          <Card.Content class="pt-4">
                            <p class="text-caption-1 text-secondary-label">Návštěvy</p>
                            <p class="text-title-2 font-semibold text-label">12,4k</p>
                          </Card.Content>
                        </Card.Root>
                        <Card.Root class="min-h-[5.5rem]">
                          <Card.Content class="pt-4">
                            <p class="text-caption-1 text-secondary-label">Konverze</p>
                            <p class="text-title-2 font-semibold text-label">3,2 %</p>
                          </Card.Content>
                        </Card.Root>
                        <Card.Root class="min-h-[5.5rem]">
                          <Card.Content class="pt-4">
                            <p class="text-caption-1 text-secondary-label">Čeká</p>
                            <p class="text-title-2 font-semibold text-label">18</p>
                          </Card.Content>
                        </Card.Root>
                      </Dashboard.Tiles>
                      <Card.Root>
                        <Card.Header>
                          <Card.Title>Aktivita</Card.Title>
                          <Card.Description>Poslední záznamy v systému.</Card.Description>
                        </Card.Header>
                        <Card.Content>
                          <p class="text-body text-secondary-label">
                            Scrollovatelný obsah — přidejte další odstavce, aby byl posuv vidět.
                          </p>
                        </Card.Content>
                      </Card.Root>
                    </Stack>
                  </Dashboard.Content>
                </Dashboard.Main>
              </Dashboard.Root>
            </Screen>
          </TabExample>
          <TabCode>{`import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Dashboard } from "~/components/ui/dashboard";
import { Screen } from "~/components/ui/screen";
import { Stack } from "~/components/ui/stack";

<Screen class="max-h-[28rem] bg-background">
  <Dashboard.Root>
    <Dashboard.Sidebar>
      <Stack direction="column" gap={3} class="text-callout text-label">
        <span class="font-semibold">Navigace</span>
        <Button variant="secondary" size="sm" class="justify-start">
          Přehled
        </Button>
        <Button variant="secondary" size="sm" class="justify-start border-0 bg-transparent shadow-none hover:bg-fill-secondary/50">
          Reporty
        </Button>
      </Stack>
    </Dashboard.Sidebar>
    <Dashboard.Main>
      <Dashboard.Header>
        <Stack direction="row" gap={2} align="center" justify="between" class="w-full">
          <span class="text-callout font-medium text-label">Přehled</span>
          <Badge variant="secondary">Beta</Badge>
        </Stack>
      </Dashboard.Header>
      <Dashboard.Content viewportClass="p-4" keepScroll keepScrollId="dashboard-demo">
        <Stack direction="column" gap={4} class="pb-4">
          <Dashboard.Tiles columnsClass="grid-cols-1 sm:grid-cols-3" gap={3}>
            <Card.Root class="min-h-[5.5rem]">
              <Card.Content class="pt-4">
                <p class="text-caption-1 text-secondary-label">Návštěvy</p>
                <p class="text-title-2 font-semibold text-label">12,4k</p>
              </Card.Content>
            </Card.Root>
            <Card.Root class="min-h-[5.5rem]">
              <Card.Content class="pt-4">
                <p class="text-caption-1 text-secondary-label">Konverze</p>
                <p class="text-title-2 font-semibold text-label">3,2 %</p>
              </Card.Content>
            </Card.Root>
            <Card.Root class="min-h-[5.5rem]">
              <Card.Content class="pt-4">
                <p class="text-caption-1 text-secondary-label">Čeká</p>
                <p class="text-title-2 font-semibold text-label">18</p>
              </Card.Content>
            </Card.Root>
          </Dashboard.Tiles>
          <Card.Root>
            <Card.Header>
              <Card.Title>Aktivita</Card.Title>
              <Card.Description>Poslední záznamy v systému.</Card.Description>
            </Card.Header>
            <Card.Content>
              <p class="text-body text-secondary-label">
                Scrollovatelný obsah — přidejte další odstavce, aby byl posuv vidět.
              </p>
            </Card.Content>
          </Card.Root>
        </Stack>
      </Dashboard.Content>
    </Dashboard.Main>
  </Dashboard.Root>
</Screen>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
