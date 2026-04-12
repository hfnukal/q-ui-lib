import { component$ } from "@builder.io/qwik";
import { InputGroup } from "~/components/ui/input-group";
import { Button } from "~/components/ui/button";
import { LuSearch } from "@qwikest/icons/lucide";
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
        <h1 class="text-title-2 text-label">InputGroup</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Prefix</h2>
        <CodeExample>
          <Desc>Prefix — viz ukázka níže.</Desc>
          <TabExample>
            <InputGroup.Root aria-label="URL">
              <InputGroup.Addon>https://</InputGroup.Addon>
              <InputGroup.Input placeholder="example.com" />
            </InputGroup.Root>
          </TabExample>
          <TabCode>{`import { InputGroup } from "~/components/ui/input-group";

<InputGroup.Root aria-label="URL">
  <InputGroup.Addon>https://</InputGroup.Addon>
  <InputGroup.Input placeholder="example.com" />
</InputGroup.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Suffix</h2>
        <CodeExample>
          <Desc>Suffix — viz ukázka níže.</Desc>
          <TabExample>
            <InputGroup.Root aria-label="E-mail">
              <InputGroup.Input type="email" placeholder="jméno" />
              <InputGroup.Addon align="end">@firma.cz</InputGroup.Addon>
            </InputGroup.Root>
          </TabExample>
          <TabCode>{`import { InputGroup } from "~/components/ui/input-group";

<InputGroup.Root aria-label="E-mail">
  <InputGroup.Input type="email" placeholder="jméno" />
  <InputGroup.Addon align="end">@firma.cz</InputGroup.Addon>
</InputGroup.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Pole a tlačítko</h2>
        <CodeExample>
          <Desc>Přímé dítě <code class="text-caption-1">Button</code> dostane zarovnání a oddělovací okraj od skupiny.</Desc>
          <TabExample>
            <InputGroup.Root aria-label="Hledat">
              <InputGroup.Input placeholder="Hledat…" />
              <Button variant="secondary">Hledat</Button>
            </InputGroup.Root>
          </TabExample>
          <TabCode>{`import { Button } from "~/components/ui/button";
import { InputGroup } from "~/components/ui/input-group";

<InputGroup.Root aria-label="Hledat">
  <InputGroup.Input placeholder="Hledat…" />
  <Button variant="secondary">Hledat</Button>
</InputGroup.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Lucide ikona v addonu</h2>
        <CodeExample>
          <Desc>Ikony z <code class="text-caption-1">@qwikest/icons/lucide</code> (např. <code class="text-caption-1">LuSearch</code>) — velikost přes <code class="text-caption-1">&#123;"[&amp;_svg]:size-4"&#125;</code> na addonu.</Desc>
          <TabExample>
            <InputGroup.Root aria-label="Hledat">
              <InputGroup.Addon class="[&_svg]:size-4">
                <LuSearch aria-hidden="true" />
              </InputGroup.Addon>
              <InputGroup.Input placeholder="Dotaz…" />
            </InputGroup.Root>
          </TabExample>
          <TabCode>{`import { LuSearch } from "@qwikest/icons/lucide";
import { InputGroup } from "~/components/ui/input-group";

<InputGroup.Root aria-label="Hledat">
  <InputGroup.Addon class="[&_svg]:size-4">
    <LuSearch aria-hidden="true" />
  </InputGroup.Addon>
  <InputGroup.Input placeholder="Dotaz…" />
</InputGroup.Root>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
