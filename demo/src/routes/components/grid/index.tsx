import { component$ } from "@builder.io/qwik";
import { Grid } from "~/components/ui/grid";
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
        <h1 class="text-title-2 text-label">Grid</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">12 sloupců</h2>
        <CodeExample>
          <Desc>Dva bloky po šesti sloupcích v mřížce <code class="text-caption-1">grid-cols-12</code>.</Desc>
          <TabExample>
            <Grid columnsClass="grid-cols-12" gap={4} class="w-full max-w-3xl">
              <div class="col-span-6 rounded-lg bg-surface-raised p-4 text-callout">6</div>
              <div class="col-span-6 rounded-lg bg-surface-overlay p-4 text-callout">6</div>
            </Grid>
          </TabExample>
          <TabCode>{`import { Grid } from "~/components/ui/grid";

<Grid columnsClass="grid-cols-12" gap={4} class="w-full max-w-3xl">
  <div class="col-span-6 rounded-lg bg-surface-raised p-4 text-callout">6</div>
  <div class="col-span-6 rounded-lg bg-surface-overlay p-4 text-callout">6</div>
</Grid>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Responzivní</h2>
        <CodeExample>
          <Desc><code class="text-caption-1">Resizable</code> + v každém panelu mřížka s <code class="text-caption-1">repeat(auto-fill, minmax(8rem, 1fr))</code> — počet sloupců závisí na šířce panelu.</Desc>
          <TabExample>
            <Resizable.PanelGroup
              direction="horizontal"
              defaultSplit={50}
              class="h-64 w-full rounded-lg border border-separator-opaque/40"
            >
              <Resizable.Panel side="start" minSize={22} class="p-3">
                <Grid columnsClass="grid-cols-[repeat(auto-fill,minmax(8rem,1fr))]" gap={3} class="h-full min-h-0 w-full">
                  <div class="min-h-12 min-w-0 w-full rounded-lg border border-separator-opaque/40 p-3 text-center text-callout">Levá 1</div>
                  <div class="min-h-12 min-w-0 w-full rounded-lg border border-separator-opaque/40 p-3 text-center text-callout">Levá 2</div>
                  <div class="min-h-12 min-w-0 w-full rounded-lg border border-separator-opaque/40 p-3 text-center text-callout">Levá 3</div>
                  <div class="min-h-12 min-w-0 w-full rounded-lg border border-separator-opaque/40 p-3 text-center text-callout">Levá 4</div>
                </Grid>
              </Resizable.Panel>
              <Resizable.Handle withHandle />
              <Resizable.Panel side="end" minSize={22} class="p-3">
                <Grid columnsClass="grid-cols-[repeat(auto-fill,minmax(8rem,1fr))]" gap={3} class="h-full min-h-0 w-full">
                  <div class="min-h-12 min-w-0 w-full rounded-lg border border-separator-opaque/40 p-3 text-center text-callout">Pravá 1</div>
                  <div class="min-h-12 min-w-0 w-full rounded-lg border border-separator-opaque/40 p-3 text-center text-callout">Pravá 2</div>
                  <div class="min-h-12 min-w-0 w-full rounded-lg border border-separator-opaque/40 p-3 text-center text-callout">Pravá 3</div>
                  <div class="min-h-12 min-w-0 w-full rounded-lg border border-separator-opaque/40 p-3 text-center text-callout">Pravá 4</div>
                </Grid>
              </Resizable.Panel>
            </Resizable.PanelGroup>
          </TabExample>
          <TabCode>{`import { Grid } from "~/components/ui/grid";
import { Resizable } from "~/components/ui/resizable";

<Resizable.PanelGroup
  direction="horizontal"
  defaultSplit={50}
  class="h-64 w-full rounded-lg border border-separator-opaque/40"
>
  <Resizable.Panel side="start" minSize={22} class="p-3">
    <Grid columnsClass="grid-cols-[repeat(auto-fill,minmax(8rem,1fr))]" gap={3} class="h-full min-h-0 w-full">
      <div class="min-h-12 min-w-0 w-full rounded-lg border border-separator-opaque/40 p-3 text-center text-callout">Levá 1</div>
      <div class="min-h-12 min-w-0 w-full rounded-lg border border-separator-opaque/40 p-3 text-center text-callout">Levá 2</div>
      <div class="min-h-12 min-w-0 w-full rounded-lg border border-separator-opaque/40 p-3 text-center text-callout">Levá 3</div>
      <div class="min-h-12 min-w-0 w-full rounded-lg border border-separator-opaque/40 p-3 text-center text-callout">Levá 4</div>
    </Grid>
  </Resizable.Panel>
  <Resizable.Handle withHandle />
  <Resizable.Panel side="end" minSize={22} class="p-3">
    <Grid columnsClass="grid-cols-[repeat(auto-fill,minmax(8rem,1fr))]" gap={3} class="h-full min-h-0 w-full">
      <div class="min-h-12 min-w-0 w-full rounded-lg border border-separator-opaque/40 p-3 text-center text-callout">Pravá 1</div>
      <div class="min-h-12 min-w-0 w-full rounded-lg border border-separator-opaque/40 p-3 text-center text-callout">Pravá 2</div>
      <div class="min-h-12 min-w-0 w-full rounded-lg border border-separator-opaque/40 p-3 text-center text-callout">Pravá 3</div>
      <div class="min-h-12 min-w-0 w-full rounded-lg border border-separator-opaque/40 p-3 text-center text-callout">Pravá 4</div>
    </Grid>
  </Resizable.Panel>
</Resizable.PanelGroup>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
