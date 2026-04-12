import { $, component$, useSignal } from "@builder.io/qwik";
import { Checkbox, CheckboxCheckIcon } from "~/components/ui/checkbox";
import { CheckboxControl } from "~/components/ui/checkbox";
import { CheckboxField } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";

export const _Example1 = component$(() => {
  const checked = useSignal(false);
  return (
    <div class="flex items-center gap-2">
      <Checkbox.Root bind:checked={checked} aria-labelledby="demo-cb-compound-label">
        <Checkbox.Indicator>
          <CheckboxCheckIcon />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <span id="demo-cb-compound-label" class="text-sm text-muted-foreground">
        Stav: {checked.value ? "vybráno" : "nevybráno"}
      </span>
    </div>
  );
});

export const _Example2 = component$(() => {
  const ok = useSignal(false);
  return (
    <div class="flex items-center gap-2">
      <CheckboxControl bind:checked={ok} aria-label="Souhlasím" />
      <span class="text-sm text-muted-foreground">
        Stav: {ok.value ? "vybráno" : "nevybráno"}
      </span>
    </div>
  );
});

export const _Example3 = component$(() => {
  const accepted = useSignal(false);
  return (
    <CheckboxField bind:checked={accepted} label="Souhlasím s podmínkami" />
  );
});

export const _Example4 = component$(() => {
  const v = useSignal(false);
  const id = "my-cb";
  const lid = "my-cb-lbl";
  return (
    <div class="flex items-center gap-2">
      <CheckboxControl bind:checked={v} id={id} aria-labelledby={lid} />
      <Label id={lid} class="cursor-pointer" onClick$={$(() => { v.value = !v.value; })}>
        Vlastní text
      </Label>
    </div>
  );
});

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Checkbox</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Složené API — bind:checked</h2>
        <CodeExample>
          <Desc><code class="text-caption-1">Checkbox.Root</code> + <code class="text-caption-1">Checkbox.Indicator</code>.</Desc>
          <TabExample>
            <_Example1 />
          </TabExample>
          <TabCode>{`import { component$, useSignal } from "@builder.io/qwik";
import { Checkbox, CheckboxCheckIcon } from "~/components/ui/checkbox";

export default component$(() => {
  const checked = useSignal(false);
  return (
    <div class="flex items-center gap-2">
      <Checkbox.Root bind:checked={checked} aria-labelledby="demo-cb-compound-label">
        <Checkbox.Indicator>
          <CheckboxCheckIcon />
        </Checkbox.Indicator>
      </Checkbox.Root>
      <span id="demo-cb-compound-label" class="text-sm text-muted-foreground">
        Stav: {checked.value ? "vybráno" : "nevybráno"}
      </span>
    </div>
  );
});`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">CheckboxControl</h2>
        <CodeExample>
          <Desc>Jedna komponenta s ikonou; vždy s přímým headless stromem uvnitř (vhodné s <code class="text-caption-1">bind:checked</code>).</Desc>
          <TabExample>
            <_Example2 />
          </TabExample>
          <TabCode>{`import { component$, useSignal } from "@builder.io/qwik";
import { CheckboxControl } from "~/components/ui/checkbox";

export default component$(() => {
  const ok = useSignal(false);
  return (
    <div class="flex items-center gap-2">
      <CheckboxControl bind:checked={ok} aria-label="Souhlasím" />
      <span class="text-sm text-muted-foreground">
        Stav: {ok.value ? "vybráno" : "nevybráno"}
      </span>
    </div>
  );
});`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">CheckboxField — klik na štítek</h2>
        <CodeExample>
          <Desc>Kombinuje <code class="text-caption-1">CheckboxControl</code> a <code class="text-caption-1">Label</code>; klik na text přepne stejný signál jako checkbox.</Desc>
          <TabExample>
            <_Example3 />
          </TabExample>
          <TabCode>{`import { component$, useSignal } from "@builder.io/qwik";
import { CheckboxField } from "~/components/ui/checkbox";

export default component$(() => {
  const accepted = useSignal(false);
  return (
    <CheckboxField bind:checked={accepted} label="Souhlasím s podmínkami" />
  );
});`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Vlastní řádek (Label + onClick$)</h2>
        <CodeExample>
          <Desc>Stejné chování ručně: <code class="text-caption-1">aria-labelledby</code> + přepnutí signálu v <code class="text-caption-1">onClick$</code> na štítku (bez <code class="text-caption-1">htmlFor</code> / <code class="text-caption-1">for</code>).</Desc>
          <TabExample>
            <_Example4 />
          </TabExample>
          <TabCode>{`import { $, component$, useSignal } from "@builder.io/qwik";
import { CheckboxControl } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";

export default component$(() => {
  const v = useSignal(false);
  const id = "my-cb";
  const lid = "my-cb-lbl";
  return (
    <div class="flex items-center gap-2">
      <CheckboxControl bind:checked={v} id={id} aria-labelledby={lid} />
      <Label id={lid} class="cursor-pointer" onClick$={$(() => { v.value = !v.value; })}>
        Vlastní text
      </Label>
    </div>
  );
});`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
