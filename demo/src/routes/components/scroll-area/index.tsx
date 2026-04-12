import { component$ } from "@builder.io/qwik";
import { ScrollArea } from "~/components/ui/scroll-area";
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
        <h1 class="text-title-2 text-label">ScrollArea</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Složené API</h2>
        <CodeExample>
          <Desc><code class="text-caption-1">ScrollArea.Root</code> drží výšku a ořízne rohy; <code class="text-caption-1">ScrollArea.Viewport</code> scroluje obsah.</Desc>
          <TabExample>
            <ScrollArea.Root class="h-48 max-w-md rounded-lg border border-separator-opaque/40 bg-surface-raised">
              <ScrollArea.Viewport class="p-4">
                {Array.from({ length: 40 }, (_, i) => (
                  <p key={i} class="text-body text-label">
                    Řádek {i + 1} — ukázkový text, aby byl scroll vidět.
                  </p>
                ))}
              </ScrollArea.Viewport>
            </ScrollArea.Root>
          </TabExample>
          <TabCode>{`import { ScrollArea } from "~/components/ui/scroll-area";

<ScrollArea.Root class="h-48 max-w-md rounded-lg border border-separator-opaque/40 bg-surface-raised">
  <ScrollArea.Viewport class="p-4">
    {Array.from({ length: 40 }, (_, i) => (
      <p key={i} class="text-body text-label">
        Řádek {i + 1} — ukázkový text, aby byl scroll vidět.
      </p>
    ))}
  </ScrollArea.Viewport>
</ScrollArea.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Zkratka Pane</h2>
        <CodeExample>
          <Desc><code class="text-caption-1">ScrollArea.Pane</code> = Root + Viewport + slot; padding dejte přes <code class="text-caption-1">viewportClass</code>.</Desc>
          <TabExample>
            <ScrollArea.Pane
              class="h-48 max-w-md rounded-lg border border-separator-opaque/40 bg-surface-raised"
              viewportClass="p-4"
            >
              {Array.from({ length: 40 }, (_, i) => (
                <p key={i} class="text-body text-label">
                  Řádek {i + 1} — ukázkový text, aby byl scroll vidět.
                </p>
              ))}
            </ScrollArea.Pane>
          </TabExample>
          <TabCode>{`import { ScrollArea } from "~/components/ui/scroll-area";

<ScrollArea.Pane
  class="h-48 max-w-md rounded-lg border border-separator-opaque/40 bg-surface-raised"
  viewportClass="p-4"
>
  {Array.from({ length: 40 }, (_, i) => (
    <p key={i} class="text-body text-label">
      Řádek {i + 1} — ukázkový text, aby byl scroll vidět.
    </p>
  ))}
</ScrollArea.Pane>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Vodorovný scroll</h2>
        <CodeExample>
          <Desc>Prop <code class="text-caption-1">direction="horizontal"</code> na Viewport / Pane ( <code class="text-caption-1">LAYOUT.md</code> ).</Desc>
          <TabExample>
            <ScrollArea.Pane
              direction="horizontal"
              class="w-full max-w-md rounded-lg border border-separator-opaque/40 bg-surface-raised"
              viewportClass="whitespace-nowrap p-4"
            >
              <span class="inline-block min-w-max text-body text-label">
                {Array.from({ length: 80 }, (_, i) => `Segment ${i + 1}`).join(" — ")}
              </span>
            </ScrollArea.Pane>
          </TabExample>
          <TabCode>{`import { ScrollArea } from "~/components/ui/scroll-area";

<ScrollArea.Pane
  direction="horizontal"
  class="w-full max-w-md rounded-lg border border-separator-opaque/40 bg-surface-raised"
  viewportClass="whitespace-nowrap p-4"
>
  <span class="inline-block min-w-max text-body text-label">
    {Array.from({ length: 80 }, (_, i) => \`Segment \${i + 1}\`).join(" — ")}
  </span>
</ScrollArea.Pane>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
