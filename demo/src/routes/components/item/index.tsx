import { component$ } from "@builder.io/qwik";
import { LuBadgeCheck } from "@qwikest/icons/lucide";
import { CodeExample } from "~/components/demo/codeexample";
import { Avatar } from "~/components/ui/avatar";
import { Button } from "~/components/ui/button";
import { Item } from "~/components/ui/item";

const codeBasic = `import { Button } from "~/components/ui/button";
import { Item } from "~/components/ui/item";

<Item.Root variant="outline">
  <Item.Content>
    <Item.Title>Základní položka</Item.Title>
    <Item.Description>Krátký popis pod titulkem.</Item.Description>
  </Item.Content>
  <Item.Actions>
    <Button variant="secondary" size="sm">Akce</Button>
  </Item.Actions>
</Item.Root>`;

const codeVariants = `import { Item } from "~/components/ui/item";

<div class="flex max-w-md flex-col gap-4">
  <Item.Root>
    <Item.Content>
      <Item.Title>Výchozí</Item.Title>
      <Item.Description>Bez ohraničení, průhledné pozadí.</Item.Description>
    </Item.Content>
  </Item.Root>
  <Item.Root variant="outline">
    <Item.Content>
      <Item.Title>Outline</Item.Title>
      <Item.Description>Okraj a zvednutá plocha.</Item.Description>
    </Item.Content>
  </Item.Root>
  <Item.Root variant="muted">
    <Item.Content>
      <Item.Title>Muted</Item.Title>
      <Item.Description>Sekundární pozadí z tokenů.</Item.Description>
    </Item.Content>
  </Item.Root>
</div>`;

const codeLink = `import { LuBadgeCheck } from "@qwikest/icons/lucide";
import { Item } from "~/components/ui/item";

<Item.Root variant="outline" size="sm" as="a" href="#" class="no-underline text-inherit">
  <Item.Media variant="icon">
    <LuBadgeCheck aria-hidden="true" />
  </Item.Media>
  <Item.Content>
    <Item.Title>Profil ověřen</Item.Title>
  </Item.Content>
  <Item.Actions>
    <span class="text-tertiary-label" aria-hidden="true">›</span>
  </Item.Actions>
</Item.Root>`;

const codeGroup = `import { Item } from "~/components/ui/item";

<Item.Group class="max-w-md">
  <Item.Root variant="outline">
    <Item.Content><Item.Title>První</Item.Title></Item.Content>
  </Item.Root>
  <Item.Separator />
  <Item.Root variant="outline">
    <Item.Content><Item.Title>Druhá</Item.Title></Item.Content>
  </Item.Root>
</Item.Group>`;

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Item</h1>
        <p class="mt-2 max-w-prose text-body text-secondary-label">
          Složený řádek ve stylu shadcn/ui v4: média, titulek, popis a akce. Oproti React verzi bez{" "}
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1 text-label">asChild</code>{" "}
          použijte na kořeni{" "}
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1 text-label">as="a"</code>{" "}
          (nebo jiný prvek) přes{" "}
          <code class="text-caption-1">@qwik-ui/headless</code>{" "}
          <code class="text-caption-1">Polymorphic</code>.
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Základ s akcí</h2>
        <CodeExample code={codeBasic}>
          <div class="max-w-md">
            <Item.Root variant="outline">
              <Item.Content>
                <Item.Title>Základní položka</Item.Title>
                <Item.Description>Krátký popis pod titulkem.</Item.Description>
              </Item.Content>
              <Item.Actions>
                <Button variant="secondary" size="sm">
                  Akce
                </Button>
              </Item.Actions>
            </Item.Root>
          </div>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Varianty</h2>
        <CodeExample code={codeVariants}>
          <div class="flex max-w-md flex-col gap-4">
            <Item.Root>
              <Item.Content>
                <Item.Title>Výchozí</Item.Title>
                <Item.Description>Bez ohraničení, průhledné pozadí.</Item.Description>
              </Item.Content>
            </Item.Root>
            <Item.Root variant="outline">
              <Item.Content>
                <Item.Title>Outline</Item.Title>
                <Item.Description>Okraj a zvednutá plocha.</Item.Description>
              </Item.Content>
            </Item.Root>
            <Item.Root variant="muted">
              <Item.Content>
                <Item.Title>Muted</Item.Title>
                <Item.Description>Sekundární pozadí z tokenů.</Item.Description>
              </Item.Content>
            </Item.Root>
          </div>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Ikona a odkaz</h2>
        <CodeExample code={codeLink}>
          <div class="max-w-md">
            <Item.Root variant="outline" size="sm" as="a" href="#" class="no-underline text-inherit">
              <Item.Media variant="icon">
                <LuBadgeCheck aria-hidden="true" />
              </Item.Media>
              <Item.Content>
                <Item.Title>Profil ověřen</Item.Title>
              </Item.Content>
              <Item.Actions>
                <span class="text-tertiary-label" aria-hidden="true">
                  ›
                </span>
              </Item.Actions>
            </Item.Root>
          </div>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Avatar a skupina</h2>
        <CodeExample code={codeGroup}>
          <div class="max-w-md">
            <Item.Group>
              <Item.Root variant="outline">
                <Item.Media variant="avatar">
                  <Avatar.Root size="md">
                    <Avatar.Image src="https://github.com/shadcn.png" alt="" />
                    <Avatar.Fallback>CN</Avatar.Fallback>
                  </Avatar.Root>
                </Item.Media>
                <Item.Content>
                  <Item.Title>shadcn</Item.Title>
                  <Item.Description>ukázka řádku s avatarem</Item.Description>
                </Item.Content>
                <Item.Actions>
                  <Button variant="secondary" size="sm">
                    Pozvat
                  </Button>
                </Item.Actions>
              </Item.Root>
              <Item.Separator />
              <Item.Root variant="outline" size="sm">
                <Item.Content>
                  <Item.Title>Další řádek</Item.Title>
                  <Item.Description>Po oddělovači ve skupině.</Item.Description>
                </Item.Content>
              </Item.Root>
            </Item.Group>
          </div>
        </CodeExample>
      </section>
    </div>
  );
});
