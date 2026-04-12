import { component$ } from "@builder.io/qwik";
import { DropdownMenu } from "~/components/ui/dropdown-menu";
import { MenuRadioItem } from "~/components/ui/menu-radio-item";
import { KbdShortcut } from "~/components/ui/kbd-shortcut";
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
        <h1 class="text-title-2 text-label">MenuRadioItem</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">V DropdownMenu.RadioGroup</h2>
        <CodeExample>
          <Desc>Skupina radio položek — první ukázka v demu.</Desc>
          <TabExample>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>Motiv</DropdownMenu.Trigger>
              <DropdownMenu.Popover>
                <DropdownMenu.RadioGroup value="light">
                  <DropdownMenu.RadioItem value="light">
                    <MenuRadioItem.Root>
                      <MenuRadioItem.Label>Světlý</MenuRadioItem.Label>
                      <MenuRadioItem.End><KbdShortcut>⌘1</KbdShortcut></MenuRadioItem.End>
                    </MenuRadioItem.Root>
                  </DropdownMenu.RadioItem>
                  <DropdownMenu.RadioItem value="dark">
                    <MenuRadioItem.Root>
                      <MenuRadioItem.Label>Tmavý</MenuRadioItem.Label>
                      <MenuRadioItem.End><KbdShortcut>⌘2</KbdShortcut></MenuRadioItem.End>
                    </MenuRadioItem.Root>
                  </DropdownMenu.RadioItem>
                  <DropdownMenu.RadioItem value="system">
                    <MenuRadioItem.Root>
                      <MenuRadioItem.Label>Systémový</MenuRadioItem.Label>
                    </MenuRadioItem.Root>
                  </DropdownMenu.RadioItem>
                </DropdownMenu.RadioGroup>
              </DropdownMenu.Popover>
            </DropdownMenu.Root>
          </TabExample>
          <TabCode>{`import { DropdownMenu } from "~/components/ui/dropdown-menu";
import { MenuRadioItem } from "~/components/ui/menu-radio-item";

<DropdownMenu.Root>
  <DropdownMenu.Trigger>Motiv</DropdownMenu.Trigger>
  <DropdownMenu.Popover>
    <DropdownMenu.RadioGroup value="light">
      <DropdownMenu.RadioItem value="light">
        <MenuRadioItem.Root>
          <MenuRadioItem.Label>Světlý</MenuRadioItem.Label>
          <MenuRadioItem.End><KbdShortcut>⌘1</KbdShortcut></MenuRadioItem.End>
        </MenuRadioItem.Root>
      </DropdownMenu.RadioItem>
      <DropdownMenu.RadioItem value="dark">
        <MenuRadioItem.Root>
          <MenuRadioItem.Label>Tmavý</MenuRadioItem.Label>
          <MenuRadioItem.End><KbdShortcut>⌘2</KbdShortcut></MenuRadioItem.End>
        </MenuRadioItem.Root>
      </DropdownMenu.RadioItem>
      <DropdownMenu.RadioItem value="system">
        <MenuRadioItem.Root>
          <MenuRadioItem.Label>Systémový</MenuRadioItem.Label>
        </MenuRadioItem.Root>
      </DropdownMenu.RadioItem>
    </DropdownMenu.RadioGroup>
  </DropdownMenu.Popover>
</DropdownMenu.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Layout samotný</h2>
        <CodeExample>
          <Desc>Samostatný řádek bez <code class="text-caption-1">RadioGroup</code> — jen vzhled.</Desc>
          <TabExample>
            <MenuRadioItem.Root>
              <MenuRadioItem.Label>Světlý motiv</MenuRadioItem.Label>
              <MenuRadioItem.End><KbdShortcut>⌘1</KbdShortcut></MenuRadioItem.End>
            </MenuRadioItem.Root>
          </TabExample>
          <TabCode>{`import { MenuRadioItem } from "~/components/ui/menu-radio-item";
import { KbdShortcut } from "~/components/ui/kbd-shortcut";

<MenuRadioItem.Root>
  <MenuRadioItem.Label>Světlý motiv</MenuRadioItem.Label>
  <MenuRadioItem.End><KbdShortcut>⌘1</KbdShortcut></MenuRadioItem.End>
</MenuRadioItem.Root>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
