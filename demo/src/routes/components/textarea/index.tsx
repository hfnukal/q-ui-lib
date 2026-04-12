import { component$ } from "@builder.io/qwik";
import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";

export const _Example1 = component$(() => (
  <Textarea placeholder="Napište zprávu…" rows={4} />
));

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Textarea</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Základ</h2>
        <CodeExample>
          <Desc>Základ — viz ukázka níže.</Desc>
          <TabExample>
            <_Example1 />
          </TabExample>
          <TabCode>{`import { component$ } from "@builder.io/qwik";
import { Textarea } from "~/components/ui/textarea";

export default component$(() => (
  <Textarea placeholder="Napište zprávu…" rows={4} />
));`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Se štítkem</h2>
        <CodeExample>
          <Desc>Se štítkem — viz ukázka níže.</Desc>
          <TabExample>
            <div class="flex max-w-md flex-col gap-2">
              <Label for="msg">Zpráva</Label>
              <Textarea id="msg" name="message" placeholder="Obsah…" rows={5} />
            </div>
          </TabExample>
          <TabCode>{`import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";

<div class="flex max-w-md flex-col gap-2">
  <Label for="msg">Zpráva</Label>
  <Textarea id="msg" name="message" placeholder="Obsah…" rows={5} />
</div>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Zakázané přetahování (disableResize)</h2>
        <CodeExample>
          <Desc>Prop <code class="text-caption-1">disableResize</code> zakáže nativní přetahování rohu — vhodné pro fixní výšku nebo layout s flexem.</Desc>
          <TabExample>
            <div class="flex max-w-md flex-col gap-2">
              <Label for="fixed">Zpráva (fixní výška)</Label>
              <Textarea id="fixed" placeholder="Nelze zvětšit…" rows={4} disableResize />
            </div>
          </TabExample>
          <TabCode>{`import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";

<div class="flex max-w-md flex-col gap-2">
  <Label for="fixed">Zpráva (fixní výška)</Label>
  <Textarea id="fixed" placeholder="Nelze zvětšit…" rows={4} disableResize />
</div>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Stavy</h2>
        <CodeExample>
          <Desc><code class="text-caption-1">disabled</code> a <code class="text-caption-1">readOnly</code> — chybové stavy řeš přes <code class="text-caption-1">class</code> nebo obal.</Desc>
          <TabExample>
            <div class="flex max-w-md flex-col gap-3">
              <Textarea placeholder="Běžný stav" rows={3} />
              <Textarea disabled placeholder="Disabled" rows={3} />
              <Textarea readOnly value="Jen ke čtení" rows={3} />
            </div>
          </TabExample>
          <TabCode>{`import { Textarea } from "~/components/ui/textarea";

<div class="flex max-w-md flex-col gap-3">
  <Textarea placeholder="Běžný stav" rows={3} />
  <Textarea disabled placeholder="Disabled" rows={3} />
  <Textarea readOnly value="Jen ke čtení" rows={3} />
</div>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
