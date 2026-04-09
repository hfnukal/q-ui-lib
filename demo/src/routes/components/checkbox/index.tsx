import { $, component$, useSignal } from "@builder.io/qwik";
import { CodeExample } from "~/components/demo/codeexample";
import { Checkbox, CheckboxCheckIcon, CheckboxControl, CheckboxField } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";

const codeCompound = `import { useSignal } from "@builder.io/qwik";
import { Checkbox, CheckboxCheckIcon } from "~/components/ui/checkbox";

export default component$(() => {
  const checked = useSignal(false);
  return (
    <Checkbox.Root bind:checked={checked} aria-labelledby="demo-cb-compound-label">
      <Checkbox.Indicator>
        <CheckboxCheckIcon />
      </Checkbox.Indicator>
    </Checkbox.Root>
  );
});`;

const codeControl = `import { useSignal } from "@builder.io/qwik";
import { CheckboxControl } from "~/components/ui/checkbox";

const ok = useSignal(false);

<CheckboxControl bind:checked={ok} aria-label="Souhlasím" />`;

const codeField = `import { useSignal } from "@builder.io/qwik";
import { CheckboxField } from "~/components/ui/checkbox";

const accepted = useSignal(false);

<CheckboxField bind:checked={accepted} label="Souhlasím s podmínkami" />`;

const codeManualLabel = `import { $, useSignal } from "@builder.io/qwik";
import { CheckboxControl } from "~/components/ui/checkbox";
import { Label } from "~/components/ui/label";

const v = useSignal(false);
const id = "my-cb";
const lid = "my-cb-lbl";

<div class="flex items-center gap-2">
  <CheckboxControl bind:checked={v} id={id} aria-labelledby={lid} />
  <Label id={lid} class="cursor-pointer" onClick$={$(() => { v.value = !v.value; })}>
    Vlastní text
  </Label>
</div>`;

export default component$(() => {
  const bound = useSignal(false);
  const controlOnly = useSignal(false);
  const fieldAccepted = useSignal(false);
  const manual = useSignal(false);

  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Checkbox</h1>
        <p class="mt-2 max-w-prose text-body text-secondary-label">
          Zaškrtávací pole nad{" "}
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1 text-label">
            @qwik-ui/headless
          </code>{" "}
          <code class="text-caption-1">Checkbox</code>. Pro štítek s kliknutím použij{" "}
          <code class="text-caption-1">CheckboxField</code> nebo vlastní{" "}
          <code class="text-caption-1">Label</code> s <code class="text-caption-1">onClick$</code> (atribut{" "}
          <code class="text-caption-1">for</code> u <code class="text-caption-1">div role="checkbox"</code> nestačí).
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Složené API — bind:checked</h2>
        <p class="text-callout text-secondary-label">
          <code class="text-caption-1">Checkbox.Root</code> + <code class="text-caption-1">Checkbox.Indicator</code>.
        </p>
        <CodeExample code={codeCompound}>
          <div class="flex flex-wrap items-center gap-4">
            <Checkbox.Root bind:checked={bound} aria-labelledby="demo-cb-compound-label">
              <Checkbox.Indicator>
                <CheckboxCheckIcon />
              </Checkbox.Indicator>
            </Checkbox.Root>
            <span id="demo-cb-compound-label" class="text-callout text-label">
              Stav: {bound.value ? "zaškrtnuto" : "nezaškrtnuto"}
            </span>
          </div>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">CheckboxControl</h2>
        <p class="text-callout text-secondary-label">
          Jedna komponenta s ikonou; vždy s přímým headless stromem uvnitř (vhodné s <code class="text-caption-1">bind:checked</code>).
        </p>
        <CodeExample code={codeControl}>
          <div class="flex flex-wrap items-center gap-4">
            <CheckboxControl bind:checked={controlOnly} aria-label="Ukázkový souhlas" />
            <span class="text-callout text-secondary-label">
              {controlOnly.value ? "ano" : "ne"}
            </span>
          </div>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">CheckboxField — klik na štítek</h2>
        <p class="text-callout text-secondary-label">
          Kombinuje <code class="text-caption-1">CheckboxControl</code> a <code class="text-caption-1">Label</code>; klik na text přepne stejný signál jako checkbox.
        </p>
        <CodeExample code={codeField} layout="tabs">
          <CheckboxField bind:checked={fieldAccepted} label="Souhlasím s podmínkami" />
          <p class="mt-2 text-footnote text-tertiary-label">
            Stav: {fieldAccepted.value ? "souhlas" : "nesouhlas"}
          </p>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Vlastní řádek (Label + onClick$)</h2>
        <p class="text-callout text-secondary-label">
          Stejné chování ručně: <code class="text-caption-1">aria-labelledby</code> + přepnutí signálu v{" "}
          <code class="text-caption-1">onClick$</code> na štítku (bez <code class="text-caption-1">for</code>).
        </p>
        <CodeExample code={codeManualLabel} layout="tabs">

          <div class="flex items-center gap-2">
            <CheckboxControl bind:checked={manual} id="demo-manual-cb" aria-labelledby="demo-manual-lbl" />
            <Label
              id="demo-manual-lbl"
              class="cursor-pointer select-none"
              onClick$={$(() => {
                manual.value = !manual.value;
              })}
            >
              Ručně spárovaný popisek
            </Label>
          </div>
        </CodeExample>
      </section>
    </div>
  );
});
