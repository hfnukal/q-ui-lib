import { component$ } from "@builder.io/qwik";
import { HoverCard } from "~/components/ui/hover-card";
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
        <h1 class="text-title-2 text-label">HoverCard</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Základní použití</h2>
        <CodeExample>
          <Desc>Najetí na trigger otevře panel; chování vychází z headlessu (včetně omezení oproti plnému „bezpečnému mostu“ mezi triggerem a panelem u některých knihoven).</Desc>
          <TabExample>
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
            </HoverCard.Root>
          </TabExample>
          <TabCode>{`import { HoverCard } from "~/components/ui/hover-card";

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
</HoverCard.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Umístění (floating)</h2>
        <CodeExample>
          <Desc>Prop <code class="text-caption-1">floating</code> pro směr panelu (např. zobrazení nad triggerem).</Desc>
          <TabExample>
            <HoverCard.Root floating="top">
              <HoverCard.Trigger>Panel nahoře</HoverCard.Trigger>
              <HoverCard.Content>
                <div class="p-4 text-callout text-secondary-label">Umístění přes prop floating na kořeni.</div>
              </HoverCard.Content>
            </HoverCard.Root>
          </TabExample>
          <TabCode>{`import { HoverCard } from "~/components/ui/hover-card";

<HoverCard.Root floating="top">
  <HoverCard.Trigger>Panel nahoře</HoverCard.Trigger>
  <HoverCard.Content>
    <div class="p-4 text-callout text-secondary-label">Umístění přes prop floating na kořeni.</div>
  </HoverCard.Content>
</HoverCard.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Šipka</h2>
        <CodeExample>
          <Desc>Šipka — viz ukázka níže.</Desc>
          <TabExample>
            <HoverCard.Root gutter={8} arrow>
              <HoverCard.Trigger>Se šipkou</HoverCard.Trigger>
              <HoverCard.Content>
                <HoverCard.Arrow />
                <div class="p-4 text-callout text-secondary-label">
                  Stejné Floating UI volby jako u Popoveru (<code>arrow</code>, <code>gutter</code>).
                </div>
              </HoverCard.Content>
            </HoverCard.Root>
          </TabExample>
          <TabCode>{`import { HoverCard } from "~/components/ui/hover-card";

<HoverCard.Root gutter={8} arrow>
  <HoverCard.Trigger>Se šipkou</HoverCard.Trigger>
  <HoverCard.Content>
    <HoverCard.Arrow />
    <div class="p-4 text-callout text-secondary-label">
      Stejné Floating UI volby jako u Popoveru (<code>arrow</code>, <code>gutter</code>).
    </div>
  </HoverCard.Content>
</HoverCard.Root>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
