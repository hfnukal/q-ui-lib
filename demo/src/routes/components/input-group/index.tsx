import { component$ } from "@builder.io/qwik";
import { LuSearch } from "@qwikest/icons/lucide";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";
import { Button } from "~/components/ui/button";
import { InputGroup } from "~/components/ui/input-group";
import { Label } from "~/components/ui/label";

const codePrefix = `import { InputGroup } from "~/components/ui/input-group";

<InputGroup.Root aria-label="URL">
  <InputGroup.Addon>https://</InputGroup.Addon>
  <InputGroup.Input placeholder="example.com" />
</InputGroup.Root>`;

const codeSuffix = `import { InputGroup } from "~/components/ui/input-group";

<InputGroup.Root aria-label="E-mail">
  <InputGroup.Input type="email" placeholder="jméno" />
  <InputGroup.Addon align="end">@firma.cz</InputGroup.Addon>
</InputGroup.Root>`;

const codeButton = `import { Button } from "~/components/ui/button";
import { InputGroup } from "~/components/ui/input-group";

<InputGroup.Root aria-label="Hledat">
  <InputGroup.Input placeholder="Hledat…" />
  <Button variant="secondary">Hledat</Button>
</InputGroup.Root>`;

const codeIconAddon = `import { LuSearch } from "@qwikest/icons/lucide";
import { InputGroup } from "~/components/ui/input-group";

<InputGroup.Root aria-label="Hledat">
  <InputGroup.Addon class="[&_svg]:size-4">
    <LuSearch aria-hidden="true" />
  </InputGroup.Addon>
  <InputGroup.Input placeholder="Dotaz…" />
</InputGroup.Root>`;

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Input Group</h1>
        <p class="mt-2 max-w-prose text-body text-secondary-label">
          Spojený rámeček pro pole a prefixy/sufixy (nebo tlačítko) podle vzoru
          shadcn Input Group — jeden společný okraj, stín a{" "}
          <code class="text-caption-1">focus-within</code> kroužek. Komponenta
          je v{" "}
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1 text-label">
            components/input-group
          </code>
          .
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Prefix</h2>

        <CodeExample>
          <Desc>Prefix — viz ukázka níže.</Desc>
          <TabExample>
            <div class="max-w-md">
              <Label for="demo-ig-url" class="mb-2 block">
                Web
              </Label>
              <InputGroup.Root aria-label="URL">
                <InputGroup.Addon>https://</InputGroup.Addon>
                <InputGroup.Input id="demo-ig-url" placeholder="example.com" />
              </InputGroup.Root>
            </div>
          </TabExample>
          <TabCode>{codePrefix}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Suffix</h2>

        <CodeExample>
          <Desc>Suffix — viz ukázka níže.</Desc>
          <TabExample>
            <div class="max-w-md">
              <Label for="demo-ig-mail" class="mb-2 block">
                Firemní e-mail
              </Label>
              <InputGroup.Root aria-label="E-mail">
                <InputGroup.Input
                  id="demo-ig-mail"
                  type="email"
                  autoComplete="email"
                  placeholder="jméno"
                />
                <InputGroup.Addon align="end">@firma.cz</InputGroup.Addon>
              </InputGroup.Root>
            </div>
          </TabExample>
          <TabCode>{codeSuffix}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Pole a tlačítko</h2>

        <CodeExample>
          <Desc>
            Přímé dítě <code class="text-caption-1">Button</code> dostane
            zarovnání a oddělovací okraj od skupiny.
          </Desc>
          <TabExample>
            <div class="max-w-md">
              <InputGroup.Root aria-label="Hledat">
                <InputGroup.Input name="q" placeholder="Hledat…" />
                <Button variant="secondary">Hledat</Button>
              </InputGroup.Root>
            </div>
          </TabExample>
          <TabCode>{codeButton}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Lucide ikona v addonu</h2>

        <CodeExample>
          <Desc>
            Ikony z{" "}
            <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1 text-label">
              @qwikest/icons/lucide
            </code>{" "}
            (např. <code class="text-caption-1">LuSearch</code>) — velikost přes{" "}
            <code class="text-caption-1">{"[&_svg]:size-4"}</code> na addonu.
          </Desc>
          <TabExample>
            <div class="max-w-md">
              <InputGroup.Root aria-label="Hledat">
                <InputGroup.Addon class="[&_svg]:size-4 text-secondary-label">
                  <LuSearch aria-hidden="true" />
                </InputGroup.Addon>
                <InputGroup.Input name="q-icon" placeholder="Dotaz…" />
              </InputGroup.Root>
            </div>
          </TabExample>
          <TabCode>{codeIconAddon}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
