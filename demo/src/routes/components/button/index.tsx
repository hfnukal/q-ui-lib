import { $, component$ } from "@builder.io/qwik";
import { Button } from "~/components/ui/button";
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
        <h1 class="text-title-2 text-label">Button</h1>
        <p class="mt-2 max-w-prose text-body text-secondary-label">
          Tlačítko — obsah předávej jako děti (default Slot), volitelně <code class="text-caption-1">variant</code>, <code class="text-caption-1">size</code> a <code class="text-caption-1">disabled</code>.
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Základní použití</h2>
        <CodeExample>
          <Desc>Kliknutím spustí handler předaný přes <code class="text-caption-1">onClick$</code>.</Desc>
          <TabExample>
            <Button onClick$={$(() => { alert("Button clicked"); })}>Click me</Button>
          </TabExample>
          <TabCode>{`<Button onClick$={$(() => { alert("Button clicked"); })}>Click me</Button>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Varianty</h2>
        <CodeExample>
          <Desc>Prop <code class="text-caption-1">variant</code>: <code class="text-caption-1">primary</code> (výchozí), <code class="text-caption-1">secondary</code>, <code class="text-caption-1">danger</code>.</Desc>
          <TabExample>
            <Button variant="primary">Primary</Button>
            <Button variant="secondary">Secondary</Button>
            <Button variant="danger">Danger</Button>
          </TabExample>
          <TabCode>{`<Button variant="primary">Primary</Button>
<Button variant="secondary">Secondary</Button>
<Button variant="danger">Danger</Button>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Velikosti</h2>
        <CodeExample>
          <Desc>Prop <code class="text-caption-1">size</code>: <code class="text-caption-1">sm</code>, <code class="text-caption-1">md</code> (výchozí), <code class="text-caption-1">lg</code>.</Desc>
          <TabExample>
            <Button size="sm">Small</Button>
            <Button size="md">Medium</Button>
            <Button size="lg">Large</Button>
          </TabExample>
          <TabCode>{`<Button size="sm">Small</Button>
<Button size="md">Medium</Button>
<Button size="lg">Large</Button>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Disabled</h2>
        <CodeExample>
          <Desc>Prop <code class="text-caption-1">disabled</code> zakazuje interakci a sníží opacity.</Desc>
          <TabExample>
            <Button>Enabled</Button>
            <Button disabled>Disabled</Button>
          </TabExample>
          <TabCode>{`<Button>Enabled</Button>
<Button disabled>Disabled</Button>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
