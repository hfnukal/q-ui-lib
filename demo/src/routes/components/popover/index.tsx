import { component$ } from "@builder.io/qwik";
import { Popover } from "~/components/ui/popover";
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
        <h1 class="text-title-2 text-label">Popover</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Základní použití</h2>
        <CodeExample>
          <Desc>Základní použití — viz ukázka níže.</Desc>
          <TabExample>
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
            </Popover.Root>
          </TabExample>
          <TabCode>{`import { Popover } from "~/components/ui/popover";

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
</Popover.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Umístění (floating)</h2>
        <CodeExample>
          <Desc>Prop <code class="text-caption-1">floating</code> na kořeni předává umístění Floating UI (např. <code class="text-caption-1">"top"</code> , <code class="text-caption-1">"bottom-end"</code> ).</Desc>
          <TabExample>
            <Popover.Root floating="top">
              <Popover.Trigger>Nahoru</Popover.Trigger>
              <Popover.Panel>
                <div class="p-4 text-callout text-secondary-label">Panel nad triggerem.</div>
              </Popover.Panel>
            </Popover.Root>
          </TabExample>
          <TabCode>{`import { Popover } from "~/components/ui/popover";

<Popover.Root floating="top">
  <Popover.Trigger>Nahoru</Popover.Trigger>
  <Popover.Panel>
    <div class="p-4 text-callout text-secondary-label">Panel nad triggerem.</div>
  </Popover.Panel>
</Popover.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Šipka (arrow)</h2>
        <CodeExample>
          <Desc>Na <code class="text-caption-1">Popover.Root</code> nastav <code class="text-caption-1">arrow</code> a do panelu vlož <code class="text-caption-1">Popover.PanelArrow</code> .</Desc>
          <TabExample>
            <Popover.Root gutter={8} arrow floating="left">
              <Popover.Trigger>Se šipkou</Popover.Trigger>
              <Popover.Panel>
                <Popover.PanelArrow />
                <div class="p-4 text-callout text-secondary-label">
                  Kořen má prop <code>arrow</code> pro middleware Floating UI.
                </div>
              </Popover.Panel>
            </Popover.Root>

            <Popover.Root gutter={8} arrow  floating="top">
              <Popover.Trigger>Se šipkou</Popover.Trigger>
              <Popover.Panel>
                <Popover.PanelArrow />
                <div class="p-4 text-callout text-secondary-label">
                  Kořen má prop <code>arrow</code> pro middleware Floating UI.
                </div>
              </Popover.Panel>
            </Popover.Root>

            <Popover.Root gutter={8} arrow  floating="bottom">
              <Popover.Trigger>Se šipkou</Popover.Trigger>
              <Popover.Panel>
                <Popover.PanelArrow />
                <div class="p-4 text-callout text-secondary-label">
                  Kořen má prop <code>arrow</code> pro middleware Floating UI.
                </div>
              </Popover.Panel>
            </Popover.Root>

            <Popover.Root gutter={8} arrow  floating="right">
              <Popover.Trigger>Se šipkou</Popover.Trigger>
              <Popover.Panel>
                <Popover.PanelArrow />
                <div class="p-4 text-callout text-secondary-label">
                  Kořen má prop <code>arrow</code> pro middleware Floating UI.
                </div>
              </Popover.Panel>
            </Popover.Root>
          </TabExample>
          <TabCode>{`import { Popover } from "~/components/ui/popover";

<Popover.Root gutter={8} arrow floating="left">
  <Popover.Trigger>Se šipkou</Popover.Trigger>
  <Popover.Panel>
    <Popover.PanelArrow />
    <div class="p-4 text-callout text-secondary-label">
      Kořen má prop <code>arrow</code> pro middleware Floating UI.
    </div>
  </Popover.Panel>
</Popover.Root>

<Popover.Root gutter={8} arrow  floating="top">
  <Popover.Trigger>Se šipkou</Popover.Trigger>
  <Popover.Panel>
    <Popover.PanelArrow />
    <div class="p-4 text-callout text-secondary-label">
      Kořen má prop <code>arrow</code> pro middleware Floating UI.
    </div>
  </Popover.Panel>
</Popover.Root>

<Popover.Root gutter={8} arrow  floating="bottom">
  <Popover.Trigger>Se šipkou</Popover.Trigger>
  <Popover.Panel>
    <Popover.PanelArrow />
    <div class="p-4 text-callout text-secondary-label">
      Kořen má prop <code>arrow</code> pro middleware Floating UI.
    </div>
  </Popover.Panel>
</Popover.Root>

<Popover.Root gutter={8} arrow  floating="right">
  <Popover.Trigger>Se šipkou</Popover.Trigger>
  <Popover.Panel>
    <Popover.PanelArrow />
    <div class="p-4 text-callout text-secondary-label">
      Kořen má prop <code>arrow</code> pro middleware Floating UI.
    </div>
  </Popover.Panel>
</Popover.Root>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
