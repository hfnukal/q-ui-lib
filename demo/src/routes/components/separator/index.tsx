import { component$ } from "@builder.io/qwik";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";
import { Separator } from "~/components/ui/separator";

const codeHorizontal = `import { Separator } from "~/components/ui/separator";

<div class="space-y-3">
  <p class="text-body text-label">Oddíl jedna</p>
  <Separator />
  <p class="text-body text-label">Oddíl dvě</p>
</div>`;

const codeVertical = `import { Separator } from "~/components/ui/separator";

<div class="flex h-12 items-stretch gap-3">
  <span class="flex items-center text-callout text-label">Vlevo</span>
  <Separator orientation="vertical" />
  <span class="flex items-center text-callout text-label">Vpravo</span>
</div>`;

const codeDecorative = `import { Separator } from "~/components/ui/separator";

<Separator decorative />
// role="none" — vypnuto z accessibility stromu (čistě vizuální)`;

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Separator</h1>
        <p class="mt-2 max-w-prose text-body text-secondary-label">
          Oddělovač z{" "}
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1 text-label">
            components/separator
          </code>{" "}
          — obal nad <code class="text-caption-1">@qwik-ui/headless</code>{" "}
          <code class="text-caption-1">Separator</code> s barvou{" "}
          <code class="text-caption-1">separator</code> (COLORS.md).
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Vodorovně</h2>

        <CodeExample>
          <Desc>
            Výchozí{" "}
            <code class="text-caption-1">
              orientation=&quot;horizontal&quot;
            </code>{" "}
            — plná šířka kontejneru, výška 1&nbsp;px.
          </Desc>
          <TabExample>
            <div class="max-w-md space-y-3 rounded-lg border border-separator-opaque/40 bg-surface-raised p-4">
              <p class="text-body text-label">Oddíl jedna</p>
              <Separator />
              <p class="text-body text-label">Oddíl dvě</p>
            </div>
          </TabExample>
          <TabCode>{codeHorizontal}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Svisle</h2>

        <CodeExample>
          <Desc>
            V řádku použij <code class="text-caption-1">items-stretch</code> na
            flex kontejneru, aby čára měla výšku řádku.
          </Desc>
          <TabExample>
            <div class="flex h-12 max-w-md items-stretch gap-3 rounded-lg border border-separator-opaque/40 bg-surface-raised px-4">
              <span class="flex items-center text-callout text-label">
                Vlevo
              </span>
              <Separator orientation="vertical" />
              <span class="flex items-center text-callout text-label">
                Vpravo
              </span>
            </div>
          </TabExample>
          <TabCode>{codeVertical}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Dekorativní</h2>

        <CodeExample>
          <Desc>
            <code class="text-caption-1">decorative</code> nastaví{" "}
            <code class="text-caption-1">role=&quot;none&quot;</code> — vhodné,
            když oddělovač není strukturální landmark.
          </Desc>
          <TabExample>
            <div class="max-w-md space-y-3 rounded-lg border border-separator-opaque/40 bg-surface-raised p-4">
              <p class="text-body text-label">Obsah</p>
              <Separator decorative />
              <p class="text-body text-label">Další obsah</p>
            </div>
          </TabExample>
          <TabCode>{codeDecorative}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
