import { component$ } from "@builder.io/qwik";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";

export const _Example1 = component$(() => (
  <div class="flex flex-col gap-2">
    <Label for="demo-email">E-mail</Label>
    <Input id="demo-email" type="email" placeholder="you@example.com" />
  </div>
));

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Label</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">S polem</h2>
        <CodeExample>
          <Desc>Prop <code class="text-caption-1">for</code> (nebo <code class="text-caption-1">htmlFor</code>) spáruje štítek s <code class="text-caption-1">id</code> vstupu.</Desc>
          <TabExample>
            <_Example1 />
          </TabExample>
          <TabCode>{`import { component$ } from "@builder.io/qwik";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default component$(() => (
  <div class="flex flex-col gap-2">
    <Label for="demo-email">E-mail</Label>
    <Input id="demo-email" type="email" placeholder="you@example.com" />
  </div>
));`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Peer + disabled</h2>
        <CodeExample>
          <Desc>Třída <code class="text-caption-1">peer</code> patří na vstup; <code class="text-caption-1">peer-disabled:*</code> na štítku reaguje jen když je v DOM vstup před štítkem — layout můžeš srovnat gridem (řádky 2 / 1).</Desc>
          <TabExample>
            {(() => {
              // V DOM musí být .peer dřív než Label (kvůli Tailwind peer-*).
              return (
                <div class="grid grid-cols-1 gap-2">
                  <Input
                    id="demo-locked"
                    disabled
                    value="Nelze upravit"
                    class="peer col-start-1 row-start-2"
                  />
                  <Label for="demo-locked" class="col-start-1 row-start-1">
                    Uzamčené pole
                  </Label>
                </div>
              );
            })()}
          </TabExample>
          <TabCode>{`import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

// V DOM musí být .peer dřív než Label (kvůli Tailwind peer-*).
<div class="grid grid-cols-1 gap-2">
  <Input
    id="demo-locked"
    disabled
    value="Nelze upravit"
    class="peer col-start-1 row-start-2"
  />
  <Label for="demo-locked" class="col-start-1 row-start-1">
    Uzamčené pole
  </Label>
</div>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
