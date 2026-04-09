import { component$ } from "@builder.io/qwik";
import { CodeExample } from "~/components/demo/codeexample";
import { HoverCard } from "~/components/ui/hover-card";

const codeBasic = `import { HoverCard } from "~/components/ui/hover-card";

<HoverCard.Root>
  <HoverCard.Trigger>@uživatel</HoverCard.Trigger>
  <HoverCard.Content>
    <div class="space-y-2 p-4">
      <p class="text-callout font-medium text-label">Náhled profilu</p>
      <p class="text-caption-1 text-secondary-label">
        Hover Card je postavený na headless Popoveru s výchozím hover režimem — vhodný pro bohatší obsah než Tooltip.
      </p>
    </div>
  </HoverCard.Content>
</HoverCard.Root>`;

const codePlacement = `import { HoverCard } from "~/components/ui/hover-card";

<HoverCard.Root floating="top">
  <HoverCard.Trigger>Panel nahoře</HoverCard.Trigger>
  <HoverCard.Content>
    <div class="p-4 text-callout text-secondary-label">Umístění přes prop floating na kořeni.</div>
  </HoverCard.Content>
</HoverCard.Root>`;

const codeArrow = `import { HoverCard } from "~/components/ui/hover-card";

<HoverCard.Root gutter={8} arrow>
  <HoverCard.Trigger>Se šipkou</HoverCard.Trigger>
  <HoverCard.Content>
    <HoverCard.Arrow />
    <div class="p-4 text-callout text-secondary-label">
      Stejné Floating UI volby jako u Popoveru (<code>arrow</code>, <code>gutter</code>).
    </div>
  </HoverCard.Content>
</HoverCard.Root>`;

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Hover card</h1>
        <p class="mt-2 max-w-prose text-sm text-slate-600">
          Složené API{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">HoverCard.Root</code>,{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">Trigger</code>,{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">Content</code>,{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">Arrow</code> nad @qwik-ui/headless Popover;
          kořen má výchozí <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">hover</code>. Odpovídá mapování
          v SHADCN.md (Hover Card → Popover / Tooltip). Obsah karty používá povrchové tokeny jako Popover, šířka{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">w-80</code>.
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">Základní použití</h2>
        <p class="max-w-prose text-sm text-slate-600">
          Najetí na trigger otevře panel; chování vychází z headlessu (včetně omezení oproti plnému „bezpečnému mostu“
          mezi triggerem a panelem u některých knihoven).
        </p>
        <CodeExample code={codeBasic} previewTabLabel="Ukázka" codeTabLabel="Kód">
          <HoverCard.Root>
            <HoverCard.Trigger>@uživatel</HoverCard.Trigger>
            <HoverCard.Content>
              <div class="space-y-2 p-4">
                <p class="text-callout font-medium text-label">Náhled profilu</p>
                <p class="text-caption-1 text-secondary-label">
                  Hover Card je postavený na headless Popoveru s výchozím hover režimem — vhodný pro bohatší obsah než
                  Tooltip.
                </p>
              </div>
            </HoverCard.Content>
          </HoverCard.Root>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">Umístění (floating)</h2>
        <CodeExample code={codePlacement} previewTabLabel="Ukázka" codeTabLabel="Kód">
          <HoverCard.Root floating="top">
            <HoverCard.Trigger>Panel nahoře</HoverCard.Trigger>
            <HoverCard.Content>
              <div class="p-4 text-callout text-secondary-label">Umístění přes prop floating na kořeni.</div>
            </HoverCard.Content>
          </HoverCard.Root>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">Šipka</h2>
        <CodeExample code={codeArrow} previewTabLabel="Ukázka" codeTabLabel="Kód">
          <HoverCard.Root gutter={8} arrow>
            <HoverCard.Trigger>Se šipkou</HoverCard.Trigger>
            <HoverCard.Content>
              <HoverCard.Arrow />
              <div class="p-4 text-callout text-secondary-label">
                Stejné Floating UI volby jako u Popoveru (<code class="rounded bg-slate-100 px-1">arrow</code>,{" "}
                <code class="rounded bg-slate-100 px-1">gutter</code>).
              </div>
            </HoverCard.Content>
          </HoverCard.Root>
        </CodeExample>
      </section>
    </div>
  );
});
