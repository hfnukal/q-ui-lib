import { component$, useSignal } from "@builder.io/qwik";
import { Switch } from "~/components/ui/switch";
import { Label } from "~/components/ui/label";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";

export const _Example1 = component$(() => {
  const on = useSignal(false);
  return (
    <Switch
      bind:pressed={on}
      aria-label="Upozornění"
    />
  );
});

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Switch</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Řízený stav</h2>
        <CodeExample>
          <Desc>Stav přes <code class="text-caption-1">bind:pressed</code> a textová nápověda vedle přepínače.</Desc>
          <TabExample>
            <_Example1 />
          </TabExample>
          <TabCode>{`import { useSignal } from "@builder.io/qwik";
import { Switch } from "~/components/ui/switch";

export default component$(() => {
  const on = useSignal(false);
  return (
    <Switch
      bind:pressed={on}
      aria-label="Upozornění"
    />
  );
});`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Výchozí hodnota a disabled</h2>
        <CodeExample>
          <Desc>Viditelné popisky přes <code class="text-caption-1">Label</code> v řádku s přepínačem (<code class="text-caption-1">flex</code>).</Desc>
          <TabExample>
            <div class="flex max-w-md flex-col gap-4">
              <div class="flex items-center justify-between gap-4">
                <Label for="demo-sw-on">Výchozí zapnuto</Label>
                <Switch id="demo-sw-on" pressed />
              </div>
              <div class="flex items-center justify-between gap-4">
                <Label class="text-secondary-label" for="demo-sw-off">Neaktivní</Label>
                <Switch id="demo-sw-off" disabled />
              </div>
            </div>
          </TabExample>
          <TabCode>{`import { Label } from "~/components/ui/label";
import { Switch } from "~/components/ui/switch";

<div class="flex max-w-md flex-col gap-4">
  <div class="flex items-center justify-between gap-4">
    <Label for="demo-sw-on">Výchozí zapnuto</Label>
    <Switch id="demo-sw-on" pressed />
  </div>
  <div class="flex items-center justify-between gap-4">
    <Label class="text-secondary-label" for="demo-sw-off">Neaktivní</Label>
    <Switch id="demo-sw-off" disabled />
  </div>
</div>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
