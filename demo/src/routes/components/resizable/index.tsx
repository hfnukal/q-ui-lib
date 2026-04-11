import { component$ } from "@builder.io/qwik";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";
import { Resizable } from "~/components/ui/resizable";

const codeHorizontal = `import { Resizable } from "~/components/ui/resizable";

<Resizable.PanelGroup
  direction="horizontal"
  defaultSplit={40}
  class="h-52 rounded-lg border border-separator-opaque/40"
>
  <Resizable.Panel side="start" minSize={15} class="bg-surface-raised p-4">
    <p class="text-callout text-label">Levý panel</p>
  </Resizable.Panel>
  <Resizable.Handle withHandle />
  <Resizable.Panel side="end" minSize={15} class="bg-surface-overlay p-4">
    <p class="text-callout text-label">Pravý panel</p>
  </Resizable.Panel>
</Resizable.PanelGroup>`;

const codeVertical = `import { Resizable } from "~/components/ui/resizable";

<Resizable.PanelGroup
  direction="vertical"
  defaultSplit={35}
  class="h-72 max-w-md rounded-lg border border-separator-opaque/40"
>
  <Resizable.Panel side="start" minSize={10} class="bg-surface-raised p-3">
    <p class="text-caption-1 text-secondary-label">Horní část</p>
  </Resizable.Panel>
  <Resizable.Handle />
  <Resizable.Panel side="end" minSize={15} class="bg-surface-overlay p-3">
    <p class="text-caption-1 text-secondary-label">Spodní část</p>
  </Resizable.Panel>
</Resizable.PanelGroup>`;

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Resizable</h1>
        <p class="mt-2 max-w-prose text-body text-secondary-label">
          Dva panely oddělené táhlem — není v{" "}
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1 text-label">
            @qwik-ui/headless
          </code>{" "}
          (viz CREATE.md). Vlastní implementace flex + pointer events, tokeny z
          COLORS.md (<code class="text-caption-1">separator</code>,{" "}
          <code class="text-caption-1">surface-*</code>).
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Vodorovně</h2>

        <CodeExample>
          <Desc>
            Přetahujte oddělovač nebo použijte šipky vlevo/vpravo, když má
            fokus. Volitelně <code class="text-caption-1">withHandle</code> pro
            vizuální úchop.
          </Desc>
          <TabExample>
            <Resizable.PanelGroup
              direction="horizontal"
              defaultSplit={40}
              class="h-52 rounded-lg border border-separator-opaque/40"
            >
              <Resizable.Panel
                side="start"
                minSize={15}
                class="bg-surface-raised p-4"
              >
                <p class="text-callout text-label">Levý panel</p>
                <p class="mt-2 text-caption-1 text-secondary-label">
                  minSize 15&nbsp;%, defaultSplit 40&nbsp;%
                </p>
              </Resizable.Panel>
              <Resizable.Handle withHandle />
              <Resizable.Panel
                side="end"
                minSize={15}
                class="bg-surface-overlay p-4"
              >
                <p class="text-callout text-label">Pravý panel</p>
              </Resizable.Panel>
            </Resizable.PanelGroup>
          </TabExample>
          <TabCode>{codeHorizontal}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Svisle</h2>

        <CodeExample>
          <Desc>
            <code class="text-caption-1">direction=&quot;vertical&quot;</code> —
            kurzor <code class="text-caption-1">row-resize</code>, klávesy
            nahoru/dolů.
          </Desc>
          <TabExample>
            <Resizable.PanelGroup
              direction="vertical"
              defaultSplit={35}
              class="h-72 max-w-md rounded-lg border border-separator-opaque/40"
            >
              <Resizable.Panel
                side="start"
                minSize={10}
                class="bg-surface-raised p-3"
              >
                <p class="text-caption-1 text-secondary-label">Horní část</p>
              </Resizable.Panel>
              <Resizable.Handle />
              <Resizable.Panel
                side="end"
                minSize={15}
                class="bg-surface-overlay p-3"
              >
                <p class="text-caption-1 text-secondary-label">Spodní část</p>
              </Resizable.Panel>
            </Resizable.PanelGroup>
          </TabExample>
          <TabCode>{codeVertical}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Vnořené skupiny</h2>
        <p class="text-callout text-secondary-label">
          Pro více než dva panely vnořte další{" "}
          <code class="text-caption-1">PanelGroup</code> do jednoho z panelů.
        </p>
        <div class="rounded-lg border border-separator-opaque/40 p-2">
          <Resizable.PanelGroup direction="horizontal" class="h-56 rounded-md">
            <Resizable.Panel
              side="start"
              minSize={20}
              class="rounded-l-md bg-surface-raised p-3"
            >
              <span class="text-caption-1 text-label">Sloupec A</span>
            </Resizable.Panel>
            <Resizable.Handle withHandle />
            <Resizable.Panel side="end" minSize={25} class="min-w-0 p-0">
              <Resizable.PanelGroup
                direction="vertical"
                class="h-full rounded-r-md border-l border-separator"
              >
                <Resizable.Panel
                  side="start"
                  minSize={15}
                  class="bg-surface-overlay p-3"
                >
                  <span class="text-caption-1 text-label">B — horní</span>
                </Resizable.Panel>
                <Resizable.Handle />
                <Resizable.Panel
                  side="end"
                  minSize={15}
                  class="bg-grouped-surface p-3"
                >
                  <span class="text-caption-1 text-label">B — dolní</span>
                </Resizable.Panel>
              </Resizable.PanelGroup>
            </Resizable.Panel>
          </Resizable.PanelGroup>
        </div>
      </section>
    </div>
  );
});
