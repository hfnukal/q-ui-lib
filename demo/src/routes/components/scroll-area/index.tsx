import { component$ } from "@builder.io/qwik";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";
import { ScrollArea } from "~/components/ui/scroll-area";

const longLines = Array.from(
  { length: 24 },
  (_, i) => `Řádek ${i + 1} — ukázkový text v rolovací oblasti.`,
);

const codeCompound = `import { ScrollArea } from "~/components/ui/scroll-area";

<ScrollArea.Root class="h-48 max-w-md rounded-lg border border-separator-opaque/40 bg-surface-raised">
  <ScrollArea.Viewport class="p-4">
    <p class="text-body text-label">… dlouhý obsah …</p>
  </ScrollArea.Viewport>
</ScrollArea.Root>`;

const codePane = `import { ScrollArea } from "~/components/ui/scroll-area";

<ScrollArea.Pane
  class="h-48 max-w-md rounded-lg border border-separator-opaque/40 bg-surface-raised"
  viewportClass="p-4"
>
  <p class="text-body text-label">… obsah …</p>
</ScrollArea.Pane>`;

const codeHorizontal = `import { ScrollArea } from "~/components/ui/scroll-area";

<ScrollArea.Pane
  direction="horizontal"
  class="w-full max-w-md rounded-lg border border-separator-opaque/40 bg-surface-raised"
  viewportClass="whitespace-nowrap p-4"
>
  <span class="inline-block min-w-max text-body text-label">
    Velmi dlouhý řádek bez zalamování …
  </span>
</ScrollArea.Pane>`;

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Scroll area</h1>
        <p class="mt-2 max-w-prose text-body text-secondary-label">
          Oblast s nativním scrollem ve stylu shadcn (Root + Viewport). Mapování
          na @qwik-ui/headless zde není — jde o čisté CSS a tokeny z COLORS.md
          (scrollbar <code class="text-caption-1">fill-tertiary</code>).
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Složené API</h2>

        <CodeExample>
          <Desc>
            <code class="text-caption-1">ScrollArea.Root</code> drží výšku a
            ořízne rohy; <code class="text-caption-1">ScrollArea.Viewport</code>{" "}
            scroluje obsah.
          </Desc>
          <TabExample>
            <ScrollArea.Root class="h-48 max-w-md rounded-lg border border-separator-opaque/40 bg-surface-raised">
              <ScrollArea.Viewport class="p-4">
                <ul class="space-y-2 text-body text-label">
                  {longLines.map((line) => (
                    <li key={line}>{line}</li>
                  ))}
                </ul>
              </ScrollArea.Viewport>
            </ScrollArea.Root>
          </TabExample>
          <TabCode>{codeCompound}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Zkratka Pane</h2>

        <CodeExample>
          <Desc>
            <code class="text-caption-1">ScrollArea.Pane</code> = Root +
            Viewport + slot; padding dejte přes{" "}
            <code class="text-caption-1">viewportClass</code>.
          </Desc>
          <TabExample>
            <ScrollArea.Pane
              class="h-48 max-w-md rounded-lg border border-separator-opaque/40 bg-surface-raised"
              viewportClass="p-4"
            >
              <ul class="space-y-2 text-body text-label">
                {longLines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </ScrollArea.Pane>
          </TabExample>
          <TabCode>{codePane}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Vodorovný scroll</h2>

        <CodeExample>
          <Desc>
            Prop{" "}
            <code class="text-caption-1">direction=&quot;horizontal&quot;</code>{" "}
            na Viewport / Pane (
            <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1">
              LAYOUT.md
            </code>
            ).
          </Desc>
          <TabExample>
            <ScrollArea.Pane
              direction="horizontal"
              class="w-full max-w-md rounded-lg border border-separator-opaque/40 bg-surface-raised"
              viewportClass="whitespace-nowrap p-4"
            >
              <span class="inline-block min-w-max text-body text-label">
                {Array.from({ length: 8 }, () => "Široký obsah — ").join("")}
                konec řádku.
              </span>
            </ScrollArea.Pane>
          </TabExample>
          <TabCode>{codeHorizontal}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
