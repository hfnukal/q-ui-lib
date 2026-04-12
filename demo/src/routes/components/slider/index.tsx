import { component$, useSignal } from "@builder.io/qwik";
import { Slider } from "~/components/ui/slider";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";

export const _Example1 = component$(() => {
  const level = useSignal(40);
  return (
    <Slider
      label="Volume"
      value={level.value}
      onChange$={(v) => {
        level.value = v;
      }}
    />
  );
});

export const _Example2 = component$(() => {
  const price = useSignal(100);
  return (
    <Slider
      label="Price (USD)"
      min={0}
      max={500}
      step={25}
      value={price.value}
      onChange$={(v) => {
        price.value = v;
      }}
    />
  );
});

export const _Example3 = component$(() => {
  const warmth = useSignal(50);
  return (
    <Slider
      label="Teplota"
      color="accent-system-orange"
      backgroundColor="bg-fill-quaternary"
      value={warmth.value}
      onChange$={(v) => {
        warmth.value = v;
      }}
    />
  );
});

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Slider</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Labeled value</h2>
        <CodeExample>
          <Desc>Hodnotu drž v <code class="text-caption-1">useSignal</code> a předej ji jako <code class="text-caption-1">value</code> spolu s `onChange.</Desc>
          <TabExample>
            <_Example1 />
          </TabExample>
          <TabCode>{`import { component$, useSignal } from "@builder.io/qwik";
import { Slider } from "~/components/ui/slider";

export default component$(() => {
  const level = useSignal(40);
  return (
    <Slider
      label="Volume"
      value={level.value}
      onChange$={(v) => {
        level.value = v;
      }}
    />
  );
});`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Min, max a krok</h2>
        <CodeExample>
          <Desc>Props <code class="text-caption-1">min</code>, <code class="text-caption-1">max</code> a <code class="text-caption-1">step</code> pro rozsah a krok posuvníku.</Desc>
          <TabExample>
            <_Example2 />
          </TabExample>
          <TabCode>{`import { component$, useSignal } from "@builder.io/qwik";
import { Slider } from "~/components/ui/slider";

export default component$(() => {
  const price = useSignal(100);
  return (
    <Slider
      label="Price (USD)"
      min={0}
      max={500}
      step={25}
      value={price.value}
      onChange$={(v) => {
        price.value = v;
      }}
    />
  );
});`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Velikost ukazatele (thumbSize)</h2>
        <CodeExample>
          <Desc>Prop <code class="text-caption-1">thumbSize</code> mění velikost ukazatele i výšku dráhy: <code class="text-caption-1">sm</code>, <code class="text-caption-1">md</code> (výchozí), <code class="text-caption-1">lg</code>.</Desc>
          <TabExample>
            <div class="flex max-w-md flex-col gap-6">
              <Slider label="Malý (sm)" thumbSize="sm" value={30} />
              <Slider label="Střední (md)" thumbSize="md" value={50} />
              <Slider label="Velký (lg)" thumbSize="lg" value={70} />
            </div>
          </TabExample>
          <TabCode>{`import { Slider } from "~/components/ui/slider";

<div class="flex max-w-md flex-col gap-6">
  <Slider label="Malý (sm)" thumbSize="sm" value={30} />
  <Slider label="Střední (md)" thumbSize="md" value={50} />
  <Slider label="Velký (lg)" thumbSize="lg" value={70} />
</div>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Barva akcentu a pozadí</h2>
        <CodeExample>
          <Desc>Props <code class="text-caption-1">color</code> a <code class="text-caption-1">backgroundColor</code> berou Tailwind třídy ( <code class="text-caption-1">accent-*</code>, <code class="text-caption-1">bg-*</code> z palety v <code class="text-caption-1">COLORS.md</code>).</Desc>
          <TabExample>
            <_Example3 />
          </TabExample>
          <TabCode>{`import { component$, useSignal } from "@builder.io/qwik";
import { Slider } from "~/components/ui/slider";

export default component$(() => {
  const warmth = useSignal(50);
  return (
    <Slider
      label="Teplota"
      color="accent-system-orange"
      backgroundColor="bg-fill-quaternary"
      value={warmth.value}
      onChange$={(v) => {
        warmth.value = v;
      }}
    />
  );
});`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
