import { component$ } from "@builder.io/qwik";
import { Toolbar } from "~/components/ui/toolbar";
import { ToggleGroup } from "~/components/ui/toggle-group";
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
        <h1 class="text-title-2 text-label">Toolbar</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Složené API — skupiny, oddělovač, spacer</h2>
        <CodeExample>
          <Desc><code class="text-caption-1">Toolbar.Group</code> dává <code class="text-caption-1">role="group"</code> a volitelný <code class="text-caption-1">aria-label</code>.</Desc>
          <TabExample>
            <Toolbar.Root aria-label="Formátování">
              <Toolbar.Group aria-label="Historie">
                <Toolbar.Button>Zpět</Toolbar.Button>
                <Toolbar.Button>Vpřed</Toolbar.Button>
              </Toolbar.Group>
              <Toolbar.Separator />
              <Toolbar.Group>
                <Toolbar.Link href="#">Nápověda</Toolbar.Link>
              </Toolbar.Group>
              <Toolbar.Spacer />
              <Toolbar.Button>Uložit</Toolbar.Button>
            </Toolbar.Root>
          </TabExample>
          <TabCode>{`import { Toolbar } from "~/components/ui/toolbar";

<Toolbar.Root aria-label="Formátování">
  <Toolbar.Group aria-label="Historie">
    <Toolbar.Button>Zpět</Toolbar.Button>
    <Toolbar.Button>Vpřed</Toolbar.Button>
  </Toolbar.Group>
  <Toolbar.Separator />
  <Toolbar.Group>
    <Toolbar.Link href="#">Nápověda</Toolbar.Link>
  </Toolbar.Group>
  <Toolbar.Spacer />
  <Toolbar.Button>Uložit</Toolbar.Button>
</Toolbar.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">S ToggleGroup</h2>
        <CodeExample>
          <Desc>Headless toggle skupinu vlož jako dítě kořene; styl kořene ToggleGroup se zjemní, aby seděl uvnitř lišty.</Desc>
          <TabExample>
            <Toolbar.Root aria-label="Text" class="w-full max-w-xl">
              <ToggleGroup.Root value="b" aria-label="Styl" class="border-0 bg-transparent p-0 shadow-none">
                <ToggleGroup.Item value="b">B</ToggleGroup.Item>
                <ToggleGroup.Item value="i">I</ToggleGroup.Item>
                <ToggleGroup.Item value="u">U</ToggleGroup.Item>
              </ToggleGroup.Root>
              <Toolbar.Separator />
              <Toolbar.Button type="button">Vložit odkaz</Toolbar.Button>
            </Toolbar.Root>
          </TabExample>
          <TabCode>{`import { Toolbar } from "~/components/ui/toolbar";
import { ToggleGroup } from "~/components/ui/toggle-group";

<Toolbar.Root aria-label="Text" class="w-full max-w-xl">
  <ToggleGroup.Root value="b" aria-label="Styl" class="border-0 bg-transparent p-0 shadow-none">
    <ToggleGroup.Item value="b">B</ToggleGroup.Item>
    <ToggleGroup.Item value="i">I</ToggleGroup.Item>
    <ToggleGroup.Item value="u">U</ToggleGroup.Item>
  </ToggleGroup.Root>
  <Toolbar.Separator />
  <Toolbar.Button type="button">Vložit odkaz</Toolbar.Button>
</Toolbar.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Svislá orientace</h2>
        <CodeExample>
          <Desc>U <code class="text-caption-1">orientation="vertical"</code> použij u oddělovače <code class="text-caption-1">orientation="horizontal"</code> .</Desc>
          <TabExample>
            <Toolbar.Root orientation="vertical" aria-label="Postranní nástroje">
              <Toolbar.Button>Výběr</Toolbar.Button>
              <Toolbar.Button>Orát</Toolbar.Button>
              <Toolbar.Separator orientation="horizontal" />
              <Toolbar.Button>Barva</Toolbar.Button>
            </Toolbar.Root>
          </TabExample>
          <TabCode>{`import { Toolbar } from "~/components/ui/toolbar";

<Toolbar.Root orientation="vertical" aria-label="Postranní nástroje">
  <Toolbar.Button>Výběr</Toolbar.Button>
  <Toolbar.Button>Orát</Toolbar.Button>
  <Toolbar.Separator orientation="horizontal" />
  <Toolbar.Button>Barva</Toolbar.Button>
</Toolbar.Root>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
