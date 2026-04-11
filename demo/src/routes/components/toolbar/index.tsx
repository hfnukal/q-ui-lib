import { component$ } from "@builder.io/qwik";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";
import { ToggleGroup } from "~/components/ui/toggle-group";
import { Toolbar } from "~/components/ui/toolbar";

const codeCompound = `import { Toolbar } from "~/components/ui/toolbar";

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
</Toolbar.Root>`;

const codeToggle = `import { Toolbar } from "~/components/ui/toolbar";
import { ToggleGroup } from "~/components/ui/toggle-group";

<Toolbar.Root aria-label="Text" class="w-full max-w-xl">
  <ToggleGroup.Root value="b" aria-label="Styl" class="border-0 bg-transparent p-0 shadow-none">
    <ToggleGroup.Item value="b">B</ToggleGroup.Item>
    <ToggleGroup.Item value="i">I</ToggleGroup.Item>
    <ToggleGroup.Item value="u">U</ToggleGroup.Item>
  </ToggleGroup.Root>
  <Toolbar.Separator />
  <Toolbar.Button type="button">Vložit odkaz</Toolbar.Button>
</Toolbar.Root>`;

const codeVertical = `import { Toolbar } from "~/components/ui/toolbar";

<Toolbar.Root orientation="vertical" aria-label="Postranní nástroje">
  <Toolbar.Button>Výběr</Toolbar.Button>
  <Toolbar.Button>Orát</Toolbar.Button>
  <Toolbar.Separator orientation="horizontal" />
  <Toolbar.Button>Barva</Toolbar.Button>
</Toolbar.Root>`;

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Toolbar</h1>
        <p class="mt-2 max-w-prose text-body text-secondary-label">
          Kontejner pro ovládací prvky s{" "}
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1 text-label">
            role=&quot;toolbar&quot;
          </code>
          . V @qwik-ui/headless zatím odpovídající primitiva není — layout a
          tokeny odpovídají menubar / button-group (COLORS.md). Plné klávesové
          roving focus chování jako u Radix Toolbar si aplikace může doplnit
          podle potřeby.
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">
          Složené API — skupiny, oddělovač, spacer
        </h2>

        <CodeExample>
          <Desc>
            <code class="text-caption-1">Toolbar.Group</code> dává{" "}
            <code class="text-caption-1">role=&quot;group&quot;</code> a
            volitelný <code class="text-caption-1">aria-label</code>.
          </Desc>
          <TabExample>
            <Toolbar.Root aria-label="Formátování náhled" class="max-w-2xl">
              <Toolbar.Group aria-label="Historie změn">
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
          <TabCode>{codeCompound}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">S ToggleGroup</h2>

        <CodeExample>
          <Desc>
            Headless toggle skupinu vlož jako dítě kořene; styl kořene
            ToggleGroup se zjemní, aby seděl uvnitř lišty.
          </Desc>
          <TabExample>
            <Toolbar.Root
              aria-label="Formátování textu"
              class="w-full max-w-xl"
            >
              <ToggleGroup.Root
                value="b"
                aria-label="Styl písma"
                class="border-0 bg-transparent p-0 shadow-none ring-0"
              >
                <ToggleGroup.Item value="b">B</ToggleGroup.Item>
                <ToggleGroup.Item value="i">I</ToggleGroup.Item>
                <ToggleGroup.Item value="u">U</ToggleGroup.Item>
              </ToggleGroup.Root>
              <Toolbar.Separator />
              <Toolbar.Button type="button">Vložit odkaz</Toolbar.Button>
            </Toolbar.Root>
          </TabExample>
          <TabCode>{codeToggle}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Svislá orientace</h2>

        <CodeExample>
          <Desc>
            U{" "}
            <code class="text-caption-1">orientation=&quot;vertical&quot;</code>{" "}
            použij u oddělovače{" "}
            <code class="text-caption-1">
              orientation=&quot;horizontal&quot;
            </code>
            .
          </Desc>
          <TabExample>
            <Toolbar.Root orientation="vertical" aria-label="Nástroje (svisle)">
              <Toolbar.Button>Výběr</Toolbar.Button>
              <Toolbar.Button>Orát</Toolbar.Button>
              <Toolbar.Separator orientation="horizontal" />
              <Toolbar.Button>Barva</Toolbar.Button>
            </Toolbar.Root>
          </TabExample>
          <TabCode>{codeVertical}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
