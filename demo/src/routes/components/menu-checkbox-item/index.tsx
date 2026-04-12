import { component$, useSignal } from "@builder.io/qwik";
import { MenuCheckboxItem } from "~/components/ui/menu-checkbox-item";
import { KbdShortcut } from "~/components/ui/kbd-shortcut";
import { DropdownMenu } from "~/components/ui/dropdown-menu";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";

export const _Example1 = component$(() => {
  const sidebar = useSignal(true);
  const statusBar = useSignal(false);
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>Zobrazení</DropdownMenu.Trigger>
      <DropdownMenu.Popover>
        <DropdownMenu.CheckboxItem bind:checked={sidebar}>
          <MenuCheckboxItem.Root>
            <MenuCheckboxItem.Label>Postranní panel</MenuCheckboxItem.Label>
            <MenuCheckboxItem.End><KbdShortcut>⌘B</KbdShortcut></MenuCheckboxItem.End>
          </MenuCheckboxItem.Root>
        </DropdownMenu.CheckboxItem>
        <DropdownMenu.CheckboxItem bind:checked={statusBar}>
          <MenuCheckboxItem.Root>
            <MenuCheckboxItem.Label>Stavový řádek</MenuCheckboxItem.Label>
          </MenuCheckboxItem.Root>
        </DropdownMenu.CheckboxItem>
      </DropdownMenu.Popover>
    </DropdownMenu.Root>
  );
});

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">MenuCheckboxItem</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Layout samotný</h2>
        <CodeExample>
          <Desc>Layout samotný — viz ukázka níže.</Desc>
          <TabExample>
            <MenuCheckboxItem.Root>
              <MenuCheckboxItem.Label>Zobrazit panel</MenuCheckboxItem.Label>
              <MenuCheckboxItem.End><KbdShortcut>⌘B</KbdShortcut></MenuCheckboxItem.End>
            </MenuCheckboxItem.Root>
          </TabExample>
          <TabCode>{`import { MenuCheckboxItem } from "~/components/ui/menu-checkbox-item";
import { KbdShortcut } from "~/components/ui/kbd-shortcut";

<MenuCheckboxItem.Root>
  <MenuCheckboxItem.Label>Zobrazit panel</MenuCheckboxItem.Label>
  <MenuCheckboxItem.End><KbdShortcut>⌘B</KbdShortcut></MenuCheckboxItem.End>
</MenuCheckboxItem.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">V DropdownMenu.CheckboxItem</h2>
        <CodeExample>
          <Desc>Fajfka se zobrazí automaticky. Stav řídí reaktivní signál přes <code class="text-caption-1">bind:checked</code>.</Desc>
          <TabExample>
            <_Example1 />
          </TabExample>
          <TabCode>{`import { useSignal } from "@builder.io/qwik";
import { DropdownMenu } from "~/components/ui/dropdown-menu";
import { MenuCheckboxItem } from "~/components/ui/menu-checkbox-item";

export default component$(() => {
  const sidebar = useSignal(true);
  const statusBar = useSignal(false);
  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>Zobrazení</DropdownMenu.Trigger>
      <DropdownMenu.Popover>
        <DropdownMenu.CheckboxItem bind:checked={sidebar}>
          <MenuCheckboxItem.Root>
            <MenuCheckboxItem.Label>Postranní panel</MenuCheckboxItem.Label>
            <MenuCheckboxItem.End><KbdShortcut>⌘B</KbdShortcut></MenuCheckboxItem.End>
          </MenuCheckboxItem.Root>
        </DropdownMenu.CheckboxItem>
        <DropdownMenu.CheckboxItem bind:checked={statusBar}>
          <MenuCheckboxItem.Root>
            <MenuCheckboxItem.Label>Stavový řádek</MenuCheckboxItem.Label>
          </MenuCheckboxItem.Root>
        </DropdownMenu.CheckboxItem>
      </DropdownMenu.Popover>
    </DropdownMenu.Root>
  );
});`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
