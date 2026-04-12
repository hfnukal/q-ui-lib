import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Progress } from "~/components/ui/progress";
import { ProgressBar } from "~/components/ui/progress";
import { Slider } from "~/components/ui/slider";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";

export const _Example1 = component$(() => {
  const v = useSignal(0);
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    const id = window.setInterval(() => {
      v.value = v.value >= 100 ? 0 : v.value + 4;
    }, 350);
    cleanup(() => clearInterval(id));
  });
  return (
    <Progress.Root value={v.value} class="max-w-md">
      <Progress.Indicator />
    </Progress.Root>
  );
});

export const _Example2 = component$(() => {
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
});

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Progress</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Složené API</h2>
        <CodeExample>
          <Desc><code class="text-caption-1">Progress.Root</code> + <code class="text-caption-1">Progress.Indicator</code> — ukázka s periodickou změnou hodnoty (simulace načítání).</Desc>
          <TabExample>
            <_Example1 />
          </TabExample>
          <TabCode>{`import { component$, useSignal, useVisibleTask$ } from "@builder.io/qwik";
import { Progress } from "~/components/ui/progress";

export default component$(() => {
  const v = useSignal(0);
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ cleanup }) => {
    const id = window.setInterval(() => {
      v.value = v.value >= 100 ? 0 : v.value + 4;
    }, 350);
    cleanup(() => clearInterval(id));
  });
  return (
    <Progress.Root value={v.value} class="max-w-md">
      <Progress.Indicator />
    </Progress.Root>
  );
});`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">ProgressBar</h2>
        <CodeExample>
          <Desc>Zkratka se stejným vzhledem — vnitřně kořen + indikátor.</Desc>
          <TabExample>
            <ProgressBar value={66} class="max-w-md" />
          </TabExample>
          <TabCode>{`import { ProgressBar } from "~/components/ui/progress";

<ProgressBar value={66} class="max-w-md" />`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Neurčitý stav</h2>
        <CodeExample>
          <Desc><code class="text-caption-1">value=&amp;#123;null&amp;#125;</code> → <code class="text-caption-1">data-progress="indeterminate"</code> a zkrácený segment s pulzováním.</Desc>
          <TabExample>
            <ProgressBar value={null} class="max-w-md" />
          </TabExample>
          <TabCode>{`import { ProgressBar } from "~/components/ui/progress";

<ProgressBar value={null} class="max-w-md" />`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Vázaná hodnota</h2>
        <CodeExample>
          <Desc><code class="text-caption-1">bind:value</code> na signál spolu se <code class="text-caption-1">Slider</code>.</Desc>
          <TabExample>
            <_Example2 />
          </TabExample>
          <TabCode>{`import { component$, useSignal } from "@builder.io/qwik";
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
});`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
