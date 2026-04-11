import { component$ } from "@builder.io/qwik";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";
import { Button } from "~/components/ui/button";
import { Sheet } from "~/components/ui/sheet";

const codeBasic = `import { Sheet } from "~/components/ui/sheet";
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
</Sheet.Root>`;

const codeSide = `import { Sheet } from "~/components/ui/sheet";

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
</Sheet.Root>`;

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Sheet</h1>
        <p class="mt-2 max-w-prose text-sm text-slate-600">
          Složené API nad @qwik-ui/headless{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">Modal</code>{" "}
          (shadcn: Sheet ≈ Modal + slide). Ukázky používají{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
            CodeExample
          </code>{" "}
          (záložky Ukázka / Kód); u vnořených tabů může být{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
            {"<dialog>"}
          </code>{" "}
          v neaktivním panelu omezený. Vstupní animace a ukotvení doplňuje{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
            global.css
          </code>{" "}
          (třída{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
            q-sheet-panel
          </code>
          ).
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">Zprava (výchozí)</h2>

        <CodeExample>
          <Desc>Zprava (výchozí) — viz ukázka níže.</Desc>
          <TabExample>
            <Sheet.Root>
              <Sheet.Trigger>Otevřít panel</Sheet.Trigger>
              <Sheet.Panel>
                <Sheet.Close class="absolute right-4 top-4 z-10" />
                <Sheet.Header>
                  <Sheet.Title>Nastavení</Sheet.Title>
                  <Sheet.Description>
                    Krátký popis obsahu panelu.
                  </Sheet.Description>
                </Sheet.Header>
                <Sheet.Content>
                  <p class="text-callout text-secondary-label">
                    Hlavní obsah sheetu. Kliknutí mimo panel nebo Escape zavře
                    okno (pokud není{" "}
                    <code class="rounded bg-slate-100 px-1">
                      closeOnBackdropClick=false
                    </code>{" "}
                    na kořeni).
                  </p>
                </Sheet.Content>
                <Sheet.Footer>
                  <Sheet.Close class="rounded-md border border-separator-opaque bg-surface-raised px-4 py-2 text-callout font-medium text-label shadow-sm hover:bg-surface-overlay focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    Zrušit
                  </Sheet.Close>
                  <Button>Uložit</Button>
                </Sheet.Footer>
              </Sheet.Panel>
            </Sheet.Root>
          </TabExample>
          <TabCode>{codeBasic}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">Strana panelu</h2>

        <div class="flex flex-wrap gap-3">
          <CodeExample>
            <Desc>
              Na{" "}
              <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
                Sheet.Panel
              </code>{" "}
              nastav{" "}
              <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
                side
              </code>
              :{" "}
              <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
                left
              </code>
              ,{" "}
              <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
                right
              </code>
              ,{" "}
              <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
                top
              </code>
              ,{" "}
              <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
                bottom
              </code>
              .
            </Desc>
            <TabExample>
              <Sheet.Root>
                <Sheet.Trigger>Zleva</Sheet.Trigger>
                <Sheet.Panel side="left">
                  <Sheet.Close class="absolute right-4 top-4 z-10" />
                  <Sheet.Header>
                    <Sheet.Title>Levý panel</Sheet.Title>
                    <Sheet.Description>
                      Prop side=&quot;left&quot; na Panel.
                    </Sheet.Description>
                  </Sheet.Header>
                  <Sheet.Content>
                    <p class="text-callout text-secondary-label">
                      Obsah zarovnaný podle tokenu typografie.
                    </p>
                  </Sheet.Content>
                </Sheet.Panel>
              </Sheet.Root>
              <Sheet.Root>
                <Sheet.Trigger>Zespodu</Sheet.Trigger>
                <Sheet.Panel side="bottom">
                  <Sheet.Close class="absolute right-4 top-4 z-10" />
                  <Sheet.Header>
                    <Sheet.Title>Spodní list</Sheet.Title>
                    <Sheet.Description>
                      Užitečné pro akce na mobilu.
                    </Sheet.Description>
                  </Sheet.Header>
                  <Sheet.Content>
                    <p class="text-callout text-secondary-label">
                      Panel s omezenou výškou a skladem.
                    </p>
                  </Sheet.Content>
                </Sheet.Panel>
              </Sheet.Root>
            </TabExample>
            <TabCode>{codeSide}</TabCode>
          </CodeExample>
        </div>
      </section>
    </div>
  );
});
