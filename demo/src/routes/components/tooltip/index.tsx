import { component$ } from "@builder.io/qwik";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";
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
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
            Tooltip.Root
          </code>
          ,{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
            Trigger
          </code>
          ,{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">Panel</code>
          ,{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">Arrow</code>{" "}
          nad @qwik-ui/headless; panel používá inverzní tokeny{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
            bg-label
          </code>{" "}
          /{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
            text-background
          </code>{" "}
          z COLORS.md.
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">Základní použití</h2>

        <CodeExample>
          <Desc>
            Otevření na hover a na fokus klávesnicí; zavření Escape (chování
            headlessu).
          </Desc>
          <TabExample>
            <Tooltip.Root>
              <Tooltip.Trigger>Najet myší nebo fokus</Tooltip.Trigger>
              <Tooltip.Panel>Krátká nápověda k prvku.</Tooltip.Panel>
            </Tooltip.Root>
          </TabExample>
          <TabCode>{codeBasic}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">Umístění</h2>

        <CodeExample>
          <Desc>
            Prop{" "}
            <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
              placement
            </code>{" "}
            na kořeni odpovídá Floating UI (výchozí{" "}
            <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">top</code>
            ).
          </Desc>
          <TabExample>
            <Tooltip.Root placement="bottom">
              <Tooltip.Trigger>Panel dole</Tooltip.Trigger>
              <Tooltip.Panel>
                Umístění přes prop placement (jako u headlessu).
              </Tooltip.Panel>
            </Tooltip.Root>
          </TabExample>
          <TabCode>{codePlacement}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">Zpoždění</h2>

        <CodeExample>
          <Desc>
            Prop{" "}
            <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
              delayDuration
            </code>{" "}
            (ms) — prodleva před otevřením, vhodná pro husté rozhraní.
          </Desc>
          <TabExample>
            <Tooltip.Root delayDuration={400}>
              <Tooltip.Trigger>Zpoždění 400 ms</Tooltip.Trigger>
              <Tooltip.Panel>
                Otevře se až po prodlevě — vhodné pro husté rozhraní.
              </Tooltip.Panel>
            </Tooltip.Root>
          </TabExample>
          <TabCode>{codeDelay}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">Šipka (volitelná)</h2>

        <CodeExample>
          <Desc>
            Výchozí styly šipky cílí na{" "}
            <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
              placement=&quot;top&quot;
            </code>{" "}
            (čtverec 8×8 px místo headless 10×5, aby rotace dávala kosočtverec).
            U většího obsahu přidej na panel{" "}
            <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
              pb-2
            </code>
            , ať text nepřekrývá špičku.
          </Desc>
          <TabExample>
            <Tooltip.Root placement="top">
              <Tooltip.Trigger>S šipkou</Tooltip.Trigger>
              <Tooltip.Panel class="pb-2">
                <Tooltip.Arrow />
                Obsah tooltipu.
              </Tooltip.Panel>
            </Tooltip.Root>
          </TabExample>
          <TabCode>
            {`<Tooltip.Root placement="top">
  <Tooltip.Trigger>S šipkou</Tooltip.Trigger>
  <Tooltip.Panel class="pb-2">
    <Tooltip.Arrow />
    Obsah tooltipu.
  </Tooltip.Panel>
</Tooltip.Root>`}
          </TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
