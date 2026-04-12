import { component$ } from "@builder.io/qwik";
import { Sheet } from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";
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
        <h1 class="text-title-2 text-label">Sheet</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Zprava (výchozí)</h2>
        <CodeExample>
          <Desc>Zprava (výchozí) — viz ukázka níže.</Desc>
          <TabExample>
            <Sheet.Root>
              <Sheet.Trigger>Otevřít panel</Sheet.Trigger>
              <Sheet.Panel>
                <Sheet.Close class="absolute right-4 top-4 z-10" />
                <Sheet.Header>
                  <Sheet.Title>Nastavení</Sheet.Title>
                  <Sheet.Description>Krátký popis obsahu panelu.</Sheet.Description>
                </Sheet.Header>
                <Sheet.Content>
                  <p class="text-callout text-secondary-label">Hlavní obsah sheetu.</p>
                </Sheet.Content>
                <Sheet.Footer>
                  <Sheet.Close class="rounded-md border border-separator-opaque bg-surface-raised px-4 py-2 text-callout font-medium text-label shadow-sm hover:bg-surface-overlay">
                    Zrušit
                  </Sheet.Close>
                  <Button>Uložit</Button>
                </Sheet.Footer>
              </Sheet.Panel>
            </Sheet.Root>
          </TabExample>
          <TabCode>{`import { Sheet } from "~/components/ui/sheet";
import { Button } from "~/components/ui/button";

<Sheet.Root>
  <Sheet.Trigger>Otevřít panel</Sheet.Trigger>
  <Sheet.Panel>
    <Sheet.Close class="absolute right-4 top-4 z-10" />
    <Sheet.Header>
      <Sheet.Title>Nastavení</Sheet.Title>
      <Sheet.Description>Krátký popis obsahu panelu.</Sheet.Description>
    </Sheet.Header>
    <Sheet.Content>
      <p class="text-callout text-secondary-label">Hlavní obsah sheetu.</p>
    </Sheet.Content>
    <Sheet.Footer>
      <Sheet.Close class="rounded-md border border-separator-opaque bg-surface-raised px-4 py-2 text-callout font-medium text-label shadow-sm hover:bg-surface-overlay">
        Zrušit
      </Sheet.Close>
      <Button>Uložit</Button>
    </Sheet.Footer>
  </Sheet.Panel>
</Sheet.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Strana panelu</h2>
        <CodeExample>
          <Desc>Na <code class="text-caption-1">Sheet.Panel</code> nastav <code class="text-caption-1">side</code> : <code class="text-caption-1">left</code> , <code class="text-caption-1">right</code> , <code class="text-caption-1">top</code> , <code class="text-caption-1">bottom</code> .</Desc>
          <TabExample>
            <Sheet.Root>
              <Sheet.Trigger>Zleva</Sheet.Trigger>
              <Sheet.Panel side="left">
                <Sheet.Close class="absolute right-4 top-4 z-10" />
                <Sheet.Header>
                  <Sheet.Title>Levý panel</Sheet.Title>
                  <Sheet.Description>Prop `side="left"` na Panel.</Sheet.Description>
                </Sheet.Header>
                <Sheet.Content>
                  <p class="text-callout text-secondary-label">Obsah…</p>
                </Sheet.Content>
              </Sheet.Panel>
            </Sheet.Root>
          </TabExample>
          <TabCode>{`import { Sheet } from "~/components/ui/sheet";

<Sheet.Root>
  <Sheet.Trigger>Zleva</Sheet.Trigger>
  <Sheet.Panel side="left">
    <Sheet.Close class="absolute right-4 top-4 z-10" />
    <Sheet.Header>
      <Sheet.Title>Levý panel</Sheet.Title>
      <Sheet.Description>Prop \`side="left"\` na Panel.</Sheet.Description>
    </Sheet.Header>
    <Sheet.Content>
      <p class="text-callout text-secondary-label">Obsah…</p>
    </Sheet.Content>
  </Sheet.Panel>
</Sheet.Root>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
