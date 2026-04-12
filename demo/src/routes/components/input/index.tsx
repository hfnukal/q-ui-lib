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
  <Input type="text" placeholder="Zadejte text…" />
));

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Input</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Základ</h2>
        <CodeExample>
          <Desc>Základ — viz ukázka níže.</Desc>
          <TabExample>
            <_Example1 />
          </TabExample>
          <TabCode>{`import { component$ } from "@builder.io/qwik";
import { Input } from "~/components/ui/input";

export default component$(() => (
  <Input type="text" placeholder="Zadejte text…" />
));`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Se štítkem</h2>
        <CodeExample>
          <Desc>Se štítkem — viz ukázka níže.</Desc>
          <TabExample>
            <div class="flex max-w-md flex-col gap-2">
              <Label for="user-email">E-mail</Label>
              <Input id="user-email" type="email" name="email" placeholder="you@example.com" />
            </div>
          </TabExample>
          <TabCode>{`import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

<div class="flex max-w-md flex-col gap-2">
  <Label for="user-email">E-mail</Label>
  <Input id="user-email" type="email" name="email" placeholder="you@example.com" />
</div>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Stavy</h2>
        <CodeExample>
          <Desc><code class="text-caption-1">disabled</code> a <code class="text-caption-1">readOnly</code> — vlastní chybové zobrazení řeš přes <code class="text-caption-1">class</code> nebo obal (např. border-destructive).</Desc>
          <TabExample>
            <div class="flex max-w-md flex-col gap-3">
              <Input placeholder="Běžný stav" />
              <Input disabled value="Disabled" />
              <Input readOnly value="Jen ke čtení" />
            </div>
          </TabExample>
          <TabCode>{`import { Input } from "~/components/ui/input";

<div class="flex max-w-md flex-col gap-3">
  <Input placeholder="Běžný stav" />
  <Input disabled value="Disabled" />
  <Input readOnly value="Jen ke čtení" />
</div>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
