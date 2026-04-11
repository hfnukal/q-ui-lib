import { component$ } from "@builder.io/qwik";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";
import { Badge } from "~/components/ui/badge";

const codeVariants = `import { Badge } from "~/components/ui/badge";

<div class="flex flex-wrap gap-2">
  <Badge variant="default">Default</Badge>
  <Badge variant="secondary">Secondary</Badge>
  <Badge variant="outline">Outline</Badge>
  <Badge variant="destructive">Destructive</Badge>
</div>`;

const codeSizes = `import { Badge } from "~/components/ui/badge";

<div class="flex flex-wrap items-center gap-2">
  <Badge size="sm">Small</Badge>
  <Badge size="md">Medium</Badge>
</div>`;

const codeInline = `import { Badge } from "~/components/ui/badge";

<p class="text-body text-label">
  Verze 2.1
  <Badge variant="secondary" class="ml-2 align-middle">
    Beta
  </Badge>
</p>`;

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Badge</h1>
        <p class="mt-2 max-w-prose text-body text-secondary-label">
          Kompaktní štítek (stav, verze, počet) z{" "}
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1 text-label">
            components/badge
          </code>
          — čistý Tailwind podle COLORS.md, bez headlessu (viz CREATE.md).
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Varianty</h2>

        <CodeExample>
          <Desc>Varianty — viz ukázka níže.</Desc>
          <TabExample>
            <div class="flex flex-wrap gap-2">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
            </div>
          </TabExample>
          <TabCode>{codeVariants}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Velikosti</h2>

        <CodeExample>
          <Desc>Velikosti — viz ukázka níže.</Desc>
          <TabExample>
            <div class="flex flex-wrap items-center gap-2">
              <Badge size="sm">Small</Badge>
              <Badge size="md">Medium</Badge>
            </div>
          </TabExample>
          <TabCode>{codeSizes}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">V řádku s textem</h2>

        <CodeExample>
          <Desc>
            Doplňkové třídy (např.{" "}
            <code class="text-caption-1">align-middle</code>,{" "}
            <code class="text-caption-1">ml-2</code>) sloučíš přes{" "}
            <code class="text-caption-1">class</code>.
          </Desc>
          <TabExample>
            <p class="text-body text-label">
              Verze 2.1
              <Badge variant="secondary" class="ml-2 align-middle">
                Beta
              </Badge>
            </p>
          </TabExample>
          <TabCode>{codeInline}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
