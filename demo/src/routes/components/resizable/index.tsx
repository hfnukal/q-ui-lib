import { component$ } from "@builder.io/qwik";
import { Resizable } from "~/components/ui/resizable";
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
        <h1 class="text-title-2 text-label">Resizable</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Vodorovně</h2>
        <CodeExample>
          <Desc>Přetahujte oddělovač nebo použijte šipky vlevo/vpravo, když má fokus. Volitelně <code class="text-caption-1">withHandle</code> pro vizuální úchop.</Desc>
          <TabExample>
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
            </Resizable.PanelGroup>
          </TabExample>
          <TabCode>{`import { Resizable } from "~/components/ui/resizable";

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
</Resizable.PanelGroup>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Svisle</h2>
        <CodeExample>
          <Desc><code class="text-caption-1">direction="vertical"</code> — kurzor <code class="text-caption-1">row-resize</code>, klávesy nahoru/dolů. <code class="text-caption-1">withHandle</code> přidá vizuální úchop.</Desc>
          <TabExample>
            <Resizable.PanelGroup
              direction="vertical"
              defaultSplit={35}
              class="h-72 max-w-md rounded-lg border border-separator-opaque/40"
            >
              <Resizable.Panel side="start" minSize={10} class="bg-surface-raised p-3">
                <p class="text-caption-1 text-secondary-label">Horní část</p>
              </Resizable.Panel>
              <Resizable.Handle withHandle />
              <Resizable.Panel side="end" minSize={15} class="bg-surface-overlay p-3">
                <p class="text-caption-1 text-secondary-label">Spodní část</p>
              </Resizable.Panel>
            </Resizable.PanelGroup>
          </TabExample>
          <TabCode>{`import { Resizable } from "~/components/ui/resizable";

<Resizable.PanelGroup
  direction="vertical"
  defaultSplit={35}
  class="h-72 max-w-md rounded-lg border border-separator-opaque/40"
>
  <Resizable.Panel side="start" minSize={10} class="bg-surface-raised p-3">
    <p class="text-caption-1 text-secondary-label">Horní část</p>
  </Resizable.Panel>
  <Resizable.Handle withHandle />
  <Resizable.Panel side="end" minSize={15} class="bg-surface-overlay p-3">
    <p class="text-caption-1 text-secondary-label">Spodní část</p>
  </Resizable.Panel>
</Resizable.PanelGroup>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
