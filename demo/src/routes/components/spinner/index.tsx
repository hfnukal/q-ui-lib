import { component$ } from "@builder.io/qwik";
import { Spinner } from "~/components/ui/spinner";
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
        <h1 class="text-title-2 text-label">Spinner</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Velikosti</h2>
        <CodeExample>
          <Desc>Velikosti — viz ukázka níže.</Desc>
          <TabExample>
            <div class="flex items-center gap-6">
              <Spinner size="sm" />
              <Spinner size="md" />
              <Spinner size="lg" />
            </div>
          </TabExample>
          <TabCode>{`import { Spinner } from "~/components/ui/spinner";

<div class="flex items-center gap-6">
  <Spinner size="sm" />
  <Spinner size="md" />
  <Spinner size="lg" />
</div>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Varianty</h2>
        <CodeExample>
          <Desc><code class="text-caption-1">variant</code>: mimo jiné <code class="text-caption-1">ring</code>, <code class="text-caption-1">dash</code>, <code class="text-caption-1">dots</code>, <code class="text-caption-1">wave</code>, <code class="text-caption-1">stack</code>, <code class="text-caption-1">square</code>, <code class="text-caption-1">ripple</code>, <code class="text-caption-1">needle</code>, … (výchozí je <code class="text-caption-1">arc</code>).</Desc>
          <TabExample>
            <div class="flex flex-wrap items-center gap-x-6 gap-y-8">
              <Spinner variant="ring" />
              <Spinner variant="dash" />
              <Spinner variant="dots" />
              <Spinner variant="typing" />
              <Spinner variant="pulse" />
              <Spinner variant="bars" />
              <Spinner variant="ping" />
              <Spinner variant="orbit" />
              <Spinner variant="grid" />
              <Spinner variant="activity" />
              <Spinner variant="duo" />
              <Spinner variant="chase" />
              <Spinner variant="square" />
              <Spinner variant="ripple" />
              <Spinner variant="wave" />
              <Spinner variant="stack" />
              <Spinner variant="needle" />
              <Spinner variant="cube" />
              <Spinner variant="arc" />
            </div>
          </TabExample>
          <TabCode>{`import { Spinner } from "~/components/ui/spinner";

<div class="flex flex-wrap items-center gap-x-6 gap-y-8">
  <Spinner variant="ring" />
  <Spinner variant="dash" />
  <Spinner variant="dots" />
  <Spinner variant="typing" />
  <Spinner variant="pulse" />
  <Spinner variant="bars" />
  <Spinner variant="ping" />
  <Spinner variant="orbit" />
  <Spinner variant="grid" />
  <Spinner variant="activity" />
  <Spinner variant="duo" />
  <Spinner variant="chase" />
  <Spinner variant="square" />
  <Spinner variant="ripple" />
  <Spinner variant="wave" />
  <Spinner variant="stack" />
  <Spinner variant="needle" />
  <Spinner variant="cube" />
  <Spinner variant="arc" />
</div>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Styl macOS (Activity)</h2>
        <CodeExample>
          <Desc><code class="text-caption-1">activity</code> — paprsky jako indikátor činnosti; <code class="text-caption-1">duo</code> — dva soustředné oblouky proti sobě; <code class="text-caption-1">chase</code> — segmenty po obvodu s vlnou pulzu.</Desc>
          <TabExample>
            <div class="flex flex-wrap items-center gap-8">
              <Spinner variant="activity" size="lg" />
              <Spinner variant="duo" size="lg" />
              <Spinner variant="chase" size="lg" />
            </div>
          </TabExample>
          <TabCode>{`import { Spinner } from "~/components/ui/spinner";

<div class="flex flex-wrap items-center gap-8">
  <Spinner variant="activity" size="lg" />
  <Spinner variant="duo" size="lg" />
  <Spinner variant="chase" size="lg" />
</div>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">S popiskem pro čtečky</h2>
        <CodeExample>
          <Desc>Prop <code class="text-caption-1">label</code> přidá <code class="text-caption-1">role="status"</code> a skrytý text ( <code class="text-caption-1">sr-only</code> ).</Desc>
          <TabExample>
            <Spinner size="md" label="Načítám data" />
          </TabExample>
          <TabCode>{`import { Spinner } from "~/components/ui/spinner";

<Spinner size="md" label="Načítám data" />`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Vlastní barva</h2>
        <CodeExample>
          <Desc>U <code class="text-caption-1">ring</code> / <code class="text-caption-1">dash</code> / <code class="text-caption-1">duo</code> / <code class="text-caption-1">square</code> přepiš okraje přes <code class="text-caption-1">class</code>. U <code class="text-caption-1">arc</code> použij <code class="text-caption-1">text-*</code>. U výplňových a „čárových“ variant (<code class="text-caption-1">dots</code>, <code class="text-caption-1">wave</code>, <code class="text-caption-1">stack</code>, <code class="text-caption-1">needle</code>, <code class="text-caption-1">ripple</code>, …) použij <code class="text-caption-1">text-*</code> (<code class="text-caption-1">currentColor</code>).</Desc>
          <TabExample>
            <div class="flex gap-6">
              <Spinner class="border-t-system-green" variant="ring" size="lg" />
              <Spinner class="text-system-green" variant="arc" size="lg" />
            </div>
          </TabExample>
          <TabCode>{`import { Spinner } from "~/components/ui/spinner";

<div class="flex gap-6">
  <Spinner class="border-t-system-green" variant="ring" size="lg" />
  <Spinner class="text-system-green" variant="arc" size="lg" />
</div>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
