import { component$ } from "@builder.io/qwik";
import { CodeExample } from "~/components/demo/codeexample";
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
          Oblast s nativním scrollem ve stylu shadcn (Root + Viewport). V{" "}
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1 text-label">
            SHADCN.md
          </code>{" "}
          není mapování na headless — jde o čisté CSS a tokeny z COLORS.md
          (scrollbar <code class="text-caption-1">fill-tertiary</code>).
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Složené API</h2>
        <p class="text-callout text-secondary-label">
          <code class="text-caption-1">ScrollArea.Root</code> drží výšku a ořízne rohy;{" "}
          <code class="text-caption-1">ScrollArea.Viewport</code> scroluje obsah.
        </p>
        <CodeExample code={codeCompound}>
          <ScrollArea.Root class="h-48 max-w-md rounded-lg border border-separator-opaque/40 bg-surface-raised">
            <ScrollArea.Viewport class="p-4">
              <ul class="space-y-2 text-body text-label">
                {longLines.map((line) => (
                  <li key={line}>{line}</li>
                ))}
              </ul>
            </ScrollArea.Viewport>
          </ScrollArea.Root>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Zkratka Pane</h2>
        <p class="text-callout text-secondary-label">
          <code class="text-caption-1">ScrollArea.Pane</code> = Root + Viewport + slot;
          padding dejte přes <code class="text-caption-1">viewportClass</code>.
        </p>
        <CodeExample code={codePane}>
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
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Vodorovný scroll</h2>
        <p class="text-callout text-secondary-label">
          Prop <code class="text-caption-1">direction=&quot;horizontal&quot;</code> na Viewport / Pane (
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1">LAYOUT.md</code>
          ).
        </p>
        <CodeExample code={codeHorizontal}>
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
        </CodeExample>
      </section>
    </div>
  );
});
