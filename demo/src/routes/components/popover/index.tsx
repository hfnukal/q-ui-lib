import { component$ } from "@builder.io/qwik";
import { CodeExample } from "~/components/demo/codeexample";
import { Popover } from "~/components/ui/popover";

const codeBasic = `import { Popover } from "~/components/ui/popover";

<Popover.Root>
  <Popover.Trigger>Otevřít</Popover.Trigger>
  <Popover.Panel>
    <div class="space-y-2 p-4">
      <p class="text-callout font-medium text-label">Obsah popoveru</p>
      <p class="text-caption-1 text-secondary-label">
        Vnitřní blok s paddingem — host panelu u plovoucího režimu může mít reset paddingu z headless CSS.
      </p>
    </div>
  </Popover.Panel>
</Popover.Root>`;

const codePlacement = `import { Popover } from "~/components/ui/popover";

<Popover.Root floating="top">
  <Popover.Trigger>Nahoru</Popover.Trigger>
  <Popover.Panel>
    <div class="p-4 text-callout text-secondary-label">Panel nad triggerem.</div>
  </Popover.Panel>
</Popover.Root>`;

const codeArrow = `import { Popover } from "~/components/ui/popover";

<Popover.Root gutter={8} arrow>
  <Popover.Trigger>Se šipkou</Popover.Trigger>
  <Popover.Panel>
    <Popover.PanelArrow />
    <div class="p-4 text-callout text-secondary-label">
      Kořen má prop <code>arrow</code> pro middleware Floating UI.
    </div>
  </Popover.Panel>
</Popover.Root>`;

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Popover</h1>
        <p class="mt-2 max-w-prose text-sm text-slate-600">
          Složené API{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">Popover.Root</code>,{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">Trigger</code>,{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">Panel</code>,{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">PanelArrow</code> nad{" "}
          @qwik-ui/headless; styly odpovídají tokenům z COLORS.md (jako Tabs/Button).
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">Základní použití</h2>
        <CodeExample code={codeBasic} previewTabLabel="Ukázka" codeTabLabel="Kód">
          <Popover.Root>
            <Popover.Trigger>Otevřít popover</Popover.Trigger>
            <Popover.Panel>
              <div class="space-y-2 p-4">
                <p class="text-callout font-medium text-label">Obsah popoveru</p>
                <p class="text-caption-1 text-secondary-label">
                  Vnitřní blok s paddingem — host panelu u plovoucího režimu může mít reset paddingu z
                  headless CSS.
                </p>
              </div>
            </Popover.Panel>
          </Popover.Root>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">Umístění (floating)</h2>
        <p class="max-w-prose text-sm text-slate-600">
          Prop <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">floating</code> na kořeni
          předává umístění Floating UI (např. <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">"top"</code>
          , <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">"bottom-end"</code>).
        </p>
        <CodeExample code={codePlacement} previewTabLabel="Ukázka" codeTabLabel="Kód">
          <Popover.Root floating="top">
            <Popover.Trigger>Panel nad triggerem</Popover.Trigger>
            <Popover.Panel>
              <div class="p-4 text-callout text-secondary-label">Panel nad triggerem.</div>
            </Popover.Panel>
          </Popover.Root>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">Šipka (arrow)</h2>
        <p class="max-w-prose text-sm text-slate-600">
          Na <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">Popover.Root</code> nastav{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">arrow</code> a do panelu vlož{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">Popover.PanelArrow</code>.
        </p>
        <CodeExample code={codeArrow} previewTabLabel="Ukázka" codeTabLabel="Kód">
          <Popover.Root gutter={8} arrow>
            <Popover.Trigger>Se šipkou</Popover.Trigger>
            <Popover.Panel>
              <Popover.PanelArrow />
              <div class="p-4 text-callout text-secondary-label">
                Kořen má prop <code class="rounded bg-slate-100 px-1">arrow</code> pro middleware
                Floating UI.
              </div>
            </Popover.Panel>
          </Popover.Root>
        </CodeExample>
      </section>
    </div>
  );
});
