import { component$ } from "@builder.io/qwik";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";
import { Grid } from "~/components/ui/grid";

const code12 = `import { Grid } from "~/components/ui/grid";

<Grid columnsClass="grid-cols-12" gap={4} class="w-full max-w-3xl">
  <div class="col-span-6 rounded-lg bg-surface-raised p-4 text-callout">6</div>
  <div class="col-span-6 rounded-lg bg-surface-overlay p-4 text-callout">6</div>
</Grid>`;

const codeResponsive = `import { Grid } from "~/components/ui/grid";

<Grid
  columnsClass="grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
  gap={4}
  class="w-full"
>
  <div class="rounded-lg border border-separator-opaque/40 p-4">Buňka</div>
  …
</Grid>`;

export default component$(() => {
  const items = ["A", "B", "C", "D"];

  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Grid</h1>
        <p class="mt-2 max-w-prose text-body text-secondary-label">
          CSS grid: sloupce přes{" "}
          <code class="text-caption-1">columnsClass</code> (včetně responzivních
          tříd), <code class="text-caption-1">gap</code> jako číslo na měřítku
          Tailwindu (
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1">
            LAYOUT.md
          </code>
          ).
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">12 sloupců</h2>

        <CodeExample>
          <Desc>
            Dva bloky po šesti sloupcích v mřížce{" "}
            <code class="text-caption-1">grid-cols-12</code>.
          </Desc>
          <TabExample>
            <Grid columnsClass="grid-cols-12" gap={4} class="w-full max-w-3xl">
              <div class="col-span-6 rounded-lg bg-surface-raised p-4 text-callout text-label">
                col-span-6
              </div>
              <div class="col-span-6 rounded-lg bg-surface-overlay p-4 text-callout text-label">
                col-span-6
              </div>
            </Grid>
          </TabExample>
          <TabCode>{code12}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Responzivní</h2>

        <CodeExample>
          <Desc>
            Responzivní počet sloupců přes{" "}
            <code class="text-caption-1">columnsClass</code> (breakpointy
            Tailwindu).
          </Desc>
          <TabExample>
            <Grid
              columnsClass="grid-cols-1 md:grid-cols-2 lg:grid-cols-4"
              gap={4}
              class="w-full"
            >
              {items.map((item) => (
                <div
                  key={item}
                  class="rounded-lg border border-separator-opaque/40 bg-grouped-surface p-4 text-center text-headline text-label"
                >
                  {item}
                </div>
              ))}
            </Grid>
          </TabExample>
          <TabCode>{codeResponsive}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
