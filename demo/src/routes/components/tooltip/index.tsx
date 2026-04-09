import { component$ } from "@builder.io/qwik";
import { CodeExample } from "~/components/demo/codeexample";
import { Tooltip } from "~/components/ui/tooltip";

const codeBasic = `import { Tooltip } from "~/components/ui/tooltip";

<Tooltip.Root>
  <Tooltip.Trigger>Najet myší nebo fokus</Tooltip.Trigger>
  <Tooltip.Panel>Krátká nápověda k prvku.</Tooltip.Panel>
</Tooltip.Root>`;

const codePlacement = `import { Tooltip } from "~/components/ui/tooltip";

<Tooltip.Root placement="bottom">
  <Tooltip.Trigger>Panel dole</Tooltip.Trigger>
  <Tooltip.Panel>Umístění přes prop placement (jako u headlessu).</Tooltip.Panel>
</Tooltip.Root>`;

const codeDelay = `import { Tooltip } from "~/components/ui/tooltip";

<Tooltip.Root delayDuration={400}>
  <Tooltip.Trigger>Zpoždění 400 ms</Tooltip.Trigger>
  <Tooltip.Panel>Otevře se až po prodlevě — vhodné pro husté rozhraní.</Tooltip.Panel>
</Tooltip.Root>`;

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Tooltip</h1>
        <p class="mt-2 max-w-prose text-sm text-slate-600">
          Složené API{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">Tooltip.Root</code>,{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">Trigger</code>,{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">Panel</code>,{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">Arrow</code> nad @qwik-ui/headless;
          panel používá inverzní tokeny <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">bg-label</code> /{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">text-background</code> z COLORS.md.
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">Základní použití</h2>
        <p class="max-w-prose text-sm text-slate-600">
          Otevření na hover a na fokus klávesnicí; zavření Escape (chování headlessu).
        </p>
        <CodeExample code={codeBasic} previewTabLabel="Ukázka" codeTabLabel="Kód">
          <Tooltip.Root>
            <Tooltip.Trigger>Najet myší nebo fokus</Tooltip.Trigger>
            <Tooltip.Panel>Krátká nápověda k prvku.</Tooltip.Panel>
          </Tooltip.Root>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">Umístění</h2>
        <p class="max-w-prose text-sm text-slate-600">
          Prop <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">placement</code> na kořeni odpovídá
          Floating UI (výchozí <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">top</code>).
        </p>
        <CodeExample code={codePlacement} previewTabLabel="Ukázka" codeTabLabel="Kód">
          <Tooltip.Root placement="bottom">
            <Tooltip.Trigger>Panel dole</Tooltip.Trigger>
            <Tooltip.Panel>Umístění přes prop placement (jako u headlessu).</Tooltip.Panel>
          </Tooltip.Root>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">Zpoždění</h2>
        <CodeExample code={codeDelay} previewTabLabel="Ukázka" codeTabLabel="Kód">
          <Tooltip.Root delayDuration={400}>
            <Tooltip.Trigger>Zpoždění 400 ms</Tooltip.Trigger>
            <Tooltip.Panel>Otevře se až po prodlevě — vhodné pro husté rozhraní.</Tooltip.Panel>
          </Tooltip.Root>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">Šipka (volitelná)</h2>
        <p class="max-w-prose text-sm text-slate-600">
          Výchozí styly šipky cílí na <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">placement="top"</code>{" "}
          (čtverec 8×8 px místo headless 10×5, aby rotace dávala kosočtverec). U většího obsahu přidej na panel{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">pb-2</code>, ať text nepřekrývá špičku.
        </p>
        <CodeExample
          code={`<Tooltip.Root placement="top">
  <Tooltip.Trigger>S šipkou</Tooltip.Trigger>
  <Tooltip.Panel class="pb-2">
    <Tooltip.Arrow />
    Obsah tooltipu.
  </Tooltip.Panel>
</Tooltip.Root>`}
          previewTabLabel="Ukázka"
          codeTabLabel="Kód"
        >
          <Tooltip.Root placement="top">
            <Tooltip.Trigger>S šipkou</Tooltip.Trigger>
            <Tooltip.Panel class="pb-2">
              <Tooltip.Arrow />
              Obsah tooltipu.
            </Tooltip.Panel>
          </Tooltip.Root>
        </CodeExample>
      </section>
    </div>
  );
});
