import { component$, useSignal } from "@builder.io/qwik";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";
import { Switch } from "~/components/ui/switch";

const codeBasic = `import { useSignal } from "@builder.io/qwik";
import { Switch } from "~/components/ui/switch";

export default component$(() => {
  const on = useSignal(false);
  return (
    <Switch
      bind:pressed={on}
      aria-label="Upozornění"
    />
  );
});`;

const codeInitialDisabled = `import { Switch } from "~/components/ui/switch";

<div class="flex flex-col gap-4">
  <Switch pressed aria-label="Výchozí zapnuto" />
  <Switch disabled aria-label="Neaktivní" />
</div>`;

export default component$(() => {
  const notifications = useSignal(true);

  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Switch</h1>
        <p class="mt-2 max-w-prose text-body text-secondary-label">
          Přepínač (vzhled switch) nad{" "}
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1 text-label">
            @qwik-ui/headless
          </code>{" "}
          <code class="text-caption-1">Toggle</code>:{" "}
          <code class="text-caption-1">aria-pressed</code>,{" "}
          <code class="text-caption-1">bind:pressed</code>,{" "}
          <code class="text-caption-1">disabled</code>.
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Řízený stav</h2>

        <CodeExample>
          <Desc>
            Stav přes <code class="text-caption-1">bind:pressed</code> a textová
            nápověda vedle přepínače.
          </Desc>
          <TabExample>
            <div class="flex flex-wrap items-center gap-4">
              <Switch
                bind:pressed={notifications}
                aria-label="Push notifikace"
              />
              <span class="text-callout text-secondary-label">
                {notifications.value ? "Zapnuto" : "Vypnuto"}
              </span>
            </div>
          </TabExample>
          <TabCode>{codeBasic}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Výchozí hodnota a disabled</h2>

        <CodeExample>
          <Desc>
            Výchozí zapnutý přepínač a varianta{" "}
            <code class="text-caption-1">disabled</code>.
          </Desc>
          <TabExample>
            <div class="flex flex-col items-start gap-4">
              <Switch pressed aria-label="Výchozí zapnuto" />
              <Switch disabled aria-label="Neaktivní přepínač" />
            </div>
          </TabExample>
          <TabCode>{codeInitialDisabled}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
