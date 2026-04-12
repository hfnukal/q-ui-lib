import { component$ } from "@builder.io/qwik";
import { Tooltip } from "~/components/ui/tooltip";
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
        <h1 class="text-title-2 text-label">Tooltip</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Základní použití</h2>
        <CodeExample>
          <Desc>Otevření na hover a na fokus klávesnicí; zavření Escape (chování headlessu).</Desc>
          <TabExample>
            <Tooltip.Root>
              <Tooltip.Trigger>Najet myší nebo fokus</Tooltip.Trigger>
              <Tooltip.Panel>Krátká nápověda k prvku.</Tooltip.Panel>
            </Tooltip.Root>
          </TabExample>
          <TabCode>{`import { Tooltip } from "~/components/ui/tooltip";

<Tooltip.Root>
  <Tooltip.Trigger>Najet myší nebo fokus</Tooltip.Trigger>
  <Tooltip.Panel>Krátká nápověda k prvku.</Tooltip.Panel>
</Tooltip.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Umístění</h2>
        <CodeExample>
          <Desc>Prop <code class="text-caption-1">placement</code> na kořeni odpovídá Floating UI (výchozí <code class="text-caption-1">top</code> ).</Desc>
          <TabExample>
            <Tooltip.Root placement="bottom">
              <Tooltip.Trigger>Panel dole</Tooltip.Trigger>
              <Tooltip.Panel>Umístění přes prop placement (jako u headlessu).</Tooltip.Panel>
            </Tooltip.Root>
          </TabExample>
          <TabCode>{`import { Tooltip } from "~/components/ui/tooltip";

<Tooltip.Root placement="bottom">
  <Tooltip.Trigger>Panel dole</Tooltip.Trigger>
  <Tooltip.Panel>Umístění přes prop placement (jako u headlessu).</Tooltip.Panel>
</Tooltip.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Zpoždění</h2>
        <CodeExample>
          <Desc>Prop <code class="text-caption-1">delayDuration</code> (ms) — prodleva před otevřením, vhodná pro husté rozhraní.</Desc>
          <TabExample>
            <Tooltip.Root delayDuration={400}>
              <Tooltip.Trigger>Zpoždění 400 ms</Tooltip.Trigger>
              <Tooltip.Panel>Otevře se až po prodlevě — vhodné pro husté rozhraní.</Tooltip.Panel>
            </Tooltip.Root>
          </TabExample>
          <TabCode>{`import { Tooltip } from "~/components/ui/tooltip";

<Tooltip.Root delayDuration={400}>
  <Tooltip.Trigger>Zpoždění 400 ms</Tooltip.Trigger>
  <Tooltip.Panel>Otevře se až po prodlevě — vhodné pro husté rozhraní.</Tooltip.Panel>
</Tooltip.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Šipka (volitelná)</h2>
        <CodeExample>
          <Desc><code class="text-caption-1">Tooltip.Arrow</code> sleduje skutečnou polohu panelu (i po flipu při skrolování) — stačí přidat do panelu a přidat padding dle strany.</Desc>
          <TabExample>
            <div class="flex flex-wrap gap-6">
              <Tooltip.Root placement="top">
                <Tooltip.Trigger>Nahoře</Tooltip.Trigger>
                <Tooltip.Panel class="pb-2">
                  <Tooltip.Arrow />
                  Šipka sleduje panel.
                </Tooltip.Panel>
              </Tooltip.Root>
              <Tooltip.Root placement="bottom">
                <Tooltip.Trigger>Dole</Tooltip.Trigger>
                <Tooltip.Panel class="pt-2">
                  <Tooltip.Arrow />
                  Panel dole.
                </Tooltip.Panel>
              </Tooltip.Root>
              <Tooltip.Root placement="right">
                <Tooltip.Trigger>Vpravo</Tooltip.Trigger>
                <Tooltip.Panel class="pl-2">
                  <Tooltip.Arrow />
                  Panel vpravo.
                </Tooltip.Panel>
              </Tooltip.Root>
            </div>
          </TabExample>
          <TabCode>{`import { Tooltip } from "~/components/ui/tooltip";

<div class="flex flex-wrap gap-6">
  <Tooltip.Root placement="top">
    <Tooltip.Trigger>Nahoře</Tooltip.Trigger>
    <Tooltip.Panel class="pb-2">
      <Tooltip.Arrow />
      Šipka sleduje panel.
    </Tooltip.Panel>
  </Tooltip.Root>
  <Tooltip.Root placement="bottom">
    <Tooltip.Trigger>Dole</Tooltip.Trigger>
    <Tooltip.Panel class="pt-2">
      <Tooltip.Arrow />
      Panel dole.
    </Tooltip.Panel>
  </Tooltip.Root>
  <Tooltip.Root placement="right">
    <Tooltip.Trigger>Vpravo</Tooltip.Trigger>
    <Tooltip.Panel class="pl-2">
      <Tooltip.Arrow />
      Panel vpravo.
    </Tooltip.Panel>
  </Tooltip.Root>
</div>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
