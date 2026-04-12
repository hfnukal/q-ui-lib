import { component$ } from "@builder.io/qwik";
import { Separator } from "~/components/ui/separator";
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
        <h1 class="text-title-2 text-label">Separator</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Vodorovně</h2>
        <CodeExample>
          <Desc>Výchozí <code class="text-caption-1">orientation="horizontal"</code> — plná šířka kontejneru, výška 1&amp;nbsp;px.</Desc>
          <TabExample>
            <div class="space-y-3">
              <p class="text-body text-label">Oddíl jedna</p>
              <Separator />
              <p class="text-body text-label">Oddíl dvě</p>
            </div>
          </TabExample>
          <TabCode>{`import { Separator } from "~/components/ui/separator";

<div class="space-y-3">
  <p class="text-body text-label">Oddíl jedna</p>
  <Separator />
  <p class="text-body text-label">Oddíl dvě</p>
</div>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Svisle</h2>
        <CodeExample>
          <Desc>V řádku použij <code class="text-caption-1">items-stretch</code> na flex kontejneru, aby čára měla výšku řádku.</Desc>
          <TabExample>
            <div class="flex h-12 items-stretch gap-3">
              <span class="flex items-center text-callout text-label">Vlevo</span>
              <Separator orientation="vertical" />
              <span class="flex items-center text-callout text-label">Vpravo</span>
            </div>
          </TabExample>
          <TabCode>{`import { Separator } from "~/components/ui/separator";

<div class="flex h-12 items-stretch gap-3">
  <span class="flex items-center text-callout text-label">Vlevo</span>
  <Separator orientation="vertical" />
  <span class="flex items-center text-callout text-label">Vpravo</span>
</div>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Dekorativní</h2>
        <CodeExample>
          <Desc><code class="text-caption-1">decorative</code> nastaví <code class="text-caption-1">role="none"</code> — vhodné, když oddělovač není strukturální landmark.</Desc>
          <TabExample>
            <Separator decorative />
            // role="none" — vypnuto z accessibility stromu (čistě vizuální)
          </TabExample>
          <TabCode>{`import { Separator } from "~/components/ui/separator";

<Separator decorative />
// role="none" — vypnuto z accessibility stromu (čistě vizuální)`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
