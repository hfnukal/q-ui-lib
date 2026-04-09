import { component$, useSignal } from "@builder.io/qwik";
import { CodeExample } from "~/components/demo/codeexample";
import { Progress, ProgressBar } from "~/components/ui/progress";
import { Slider } from "~/components/ui/slider";

const codeCompound = `import { Progress } from "~/components/ui/progress";

<Progress.Root value={40} class="max-w-md">
  <Progress.Indicator />
</Progress.Root>`;

const codeBar = `import { ProgressBar } from "~/components/ui/progress";

<ProgressBar value={66} class="max-w-md" />`;

const codeIndeterminate = `import { ProgressBar } from "~/components/ui/progress";

<ProgressBar value={null} class="max-w-md" />`;

const codeBound = `import { component$, useSignal } from "@builder.io/qwik";
import { ProgressBar } from "~/components/ui/progress";
import { Slider } from "~/components/ui/slider";

export default component$(() => {
  const v = useSignal(35);
  return (
    <div class="max-w-md space-y-4">
      <ProgressBar bind:value={v} />
      <Slider
        label="Hodnota"
        value={v.value}
        onChange$={(n) => {
          v.value = n;
        }}
      />
    </div>
  );
});`;

export default component$(() => {
  const bound = useSignal(35);

  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 font-semibold text-label">Progress</h1>
        <p class="mt-2 max-w-prose text-callout text-secondary-label">
          Pruh průběhu nad{" "}
          <code class="rounded-md bg-fill-secondary px-1.5 py-0.5 text-caption-1 text-label">
            @qwik-ui/headless
          </code>{" "}
          <code class="text-caption-1 text-label">Progress</code> — tokeny{" "}
          <code class="text-caption-1 text-label">fill-secondary</code> /{" "}
          <code class="text-caption-1 text-label">accent</code> (COLORS.md).
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Složené API</h2>
        <p class="text-callout text-secondary-label">
          <code class="text-caption-1 text-label">Progress.Root</code> +{" "}
          <code class="text-caption-1 text-label">Progress.Indicator</code>.
        </p>
        <CodeExample layout="stack" code={codeCompound}>
          <div class="max-w-md rounded-lg border border-separator-opaque/40 bg-surface-raised p-4">
            <Progress.Root value={40}>
              <Progress.Indicator />
            </Progress.Root>
          </div>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">ProgressBar</h2>
        <p class="text-callout text-secondary-label">
          Zkratka se stejným vzhledem — vnitřně kořen + indikátor.
        </p>
        <CodeExample layout="stack" code={codeBar}>
          <div class="max-w-md rounded-lg border border-separator-opaque/40 bg-surface-raised p-4">
            <ProgressBar value={66} />
          </div>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Neurčitý stav</h2>
        <p class="text-callout text-secondary-label">
          <code class="text-caption-1 text-label">value=&#123;null&#125;</code> →{" "}
          <code class="text-caption-1 text-label">data-progress=&quot;indeterminate&quot;</code> a zkrácený segment s pulzováním.
        </p>
        <CodeExample layout="stack" code={codeIndeterminate}>
          <div class="max-w-md rounded-lg border border-separator-opaque/40 bg-surface-raised p-4">
            <ProgressBar value={null} />
          </div>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Vázaná hodnota</h2>
        <p class="text-callout text-secondary-label">
          <code class="text-caption-1 text-label">bind:value</code> na signál spolu se{" "}
          <code class="text-caption-1 text-label">Slider</code>.
        </p>
        <CodeExample layout="stack" code={codeBound}>
          <div class="max-w-md space-y-4 rounded-lg border border-separator-opaque/40 bg-surface-raised p-4">
            <ProgressBar bind:value={bound} />
            <Slider
              label="Hodnota průběhu"
              value={bound.value}
              onChange$={(n) => {
                bound.value = n;
              }}
            />
          </div>
        </CodeExample>
      </section>
    </div>
  );
});
