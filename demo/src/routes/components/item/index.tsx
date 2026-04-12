import { component$ } from "@builder.io/qwik";
import { Button } from "~/components/ui/button";
import { Item } from "~/components/ui/item";
import { LuBadgeCheck } from "@qwikest/icons/lucide";
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
        <h1 class="text-title-2 text-label">Item</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Základ s akcí</h2>
        <CodeExample>
          <Desc>Základ s akcí — viz ukázka níže.</Desc>
          <TabExample>
            <Item.Root variant="outline">
              <Item.Content>
                <Item.Title>Základní položka</Item.Title>
                <Item.Description>Krátký popis pod titulkem.</Item.Description>
              </Item.Content>
              <Item.Actions>
                <Button variant="secondary" size="sm">Akce</Button>
              </Item.Actions>
            </Item.Root>
          </TabExample>
          <TabCode>{`import { Button } from "~/components/ui/button";
import { Item } from "~/components/ui/item";

<Item.Root variant="outline">
  <Item.Content>
    <Item.Title>Základní položka</Item.Title>
    <Item.Description>Krátký popis pod titulkem.</Item.Description>
  </Item.Content>
  <Item.Actions>
    <Button variant="secondary" size="sm">Akce</Button>
  </Item.Actions>
</Item.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Varianty</h2>
        <CodeExample>
          <Desc>Varianty — viz ukázka níže.</Desc>
          <TabExample>
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
          </TabExample>
          <TabCode>{`import { Item } from "~/components/ui/item";

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
</div>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Ikona a odkaz</h2>
        <CodeExample>
          <Desc>Ikona a odkaz — viz ukázka níže.</Desc>
          <TabExample>
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
            </Item.Root>
          </TabExample>
          <TabCode>{`import { LuBadgeCheck } from "@qwikest/icons/lucide";
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
</Item.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Avatar a skupina</h2>
        <CodeExample>
          <Desc>Avatar a skupina — viz ukázka níže.</Desc>
          <TabExample>
            <Item.Group class="max-w-md">
              <Item.Root variant="outline">
                <Item.Content><Item.Title>První</Item.Title></Item.Content>
              </Item.Root>
              <Item.Separator />
              <Item.Root variant="outline">
                <Item.Content><Item.Title>Druhá</Item.Title></Item.Content>
              </Item.Root>
            </Item.Group>
          </TabExample>
          <TabCode>{`import { Item } from "~/components/ui/item";

<Item.Group class="max-w-md">
  <Item.Root variant="outline">
    <Item.Content><Item.Title>První</Item.Title></Item.Content>
  </Item.Root>
  <Item.Separator />
  <Item.Root variant="outline">
    <Item.Content><Item.Title>Druhá</Item.Title></Item.Content>
  </Item.Root>
</Item.Group>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
