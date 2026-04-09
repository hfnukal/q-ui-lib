import { component$, useSignal } from "@builder.io/qwik";
import { CodeExample } from "~/components/demo/codeexample";
import { Slider } from "~/components/ui/slider";

const codeLabeled = `import { component$, useSignal } from "@builder.io/qwik";
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
});`;

const codeRange = `import { component$, useSignal } from "@builder.io/qwik";
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
});`;

const codeColors = `import { component$, useSignal } from "@builder.io/qwik";
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
});`;

export default component$(() => {
  const volume = useSignal(40);
  const price = useSignal(100);
  const warmth = useSignal(50);

  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 font-semibold text-label">Slider</h1>
        <p class="mt-2 max-w-prose text-callout text-secondary-label">
          Native range control from{" "}
          <code class="rounded-md bg-fill-secondary px-1.5 py-0.5 text-caption-1 text-label">
            components/slider
          </code>
          , styled with design tokens (track, accent, focus ring).
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Labeled value</h2>
        <p class="text-callout text-secondary-label">
          Hodnotu drž v <code class="text-caption-1 text-label">useSignal</code>{" "}
          a předej ji jako <code class="text-caption-1 text-label">value</code>{" "}
          spolu s <code class="text-caption-1 text-label">onChange$</code>.
        </p>
        <CodeExample code={codeLabeled}>
          <div class="space-y-2">
            <Slider
              label="Volume"
              value={volume.value}
              onChange$={(v) => {
                volume.value = v;
              }}
            />
            <p class="text-footnote text-tertiary-label">
              Aktuální hodnota:{" "}
              <span class="font-medium tabular-nums text-label">
                {volume.value}
              </span>
            </p>
          </div>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Min, max a krok</h2>
        <CodeExample code={codeRange}>
          <div class="space-y-2">
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
            <p class="text-footnote text-tertiary-label">
              Nastaveno: 0–500, krok 25 →{" "}
              <span class="font-medium tabular-nums text-label">
                {price.value}
              </span>
            </p>
          </div>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Barva akcentu a pozadí</h2>
        <p class="text-callout text-secondary-label">
          Props <code class="text-caption-1 text-label">color</code> a{" "}
          <code class="text-caption-1 text-label">backgroundColor</code> berou
          Tailwind třídy (<code class="text-caption-1 text-label">accent-*</code>
          , <code class="text-caption-1 text-label">bg-*</code> z palety v{" "}
          <code class="text-caption-1 text-label">COLORS.md</code>).
        </p>
        <CodeExample code={codeColors}>
          <div class="space-y-2">
            <Slider
              label="Teplota"
              color="accent-system-orange"
              backgroundColor="bg-fill-quaternary"
              value={warmth.value}
              onChange$={(v) => {
                warmth.value = v;
              }}
            />
            <p class="text-footnote text-tertiary-label">
              Hodnota:{" "}
              <span class="font-medium tabular-nums text-label">
                {warmth.value}
              </span>
            </p>
          </div>
        </CodeExample>
      </section>
    </div>
  );
});
