import { component$ } from "@builder.io/qwik";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";
import { MenuRadioItem } from "~/components/ui/menu-radio-item";
import { KbdShortcut } from "~/components/ui/kbd-shortcut";
import { DropdownMenu } from "~/components/ui/dropdown-menu";

const codeLayout = `import { MenuRadioItem } from "~/components/ui/menu-radio-item";
import { KbdShortcut } from "~/components/ui/kbd-shortcut";

<MenuRadioItem.Root>
  <MenuRadioItem.Label>Světlý motiv</MenuRadioItem.Label>
  <MenuRadioItem.End><KbdShortcut>⌘1</KbdShortcut></MenuRadioItem.End>
</MenuRadioItem.Root>`;

const codeWithDropdown = `import { DropdownMenu } from "~/components/ui/dropdown-menu";
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
</DropdownMenu.Root>`;

export default component$(() => (
  <div class="space-y-10">
    <div>
      <h1 class="text-title-2 text-label">MenuRadioItem</h1>
      <p class="mt-2 max-w-prose text-body text-secondary-label">
        Vizuální layout radio položky menu. Kombinuj s{" "}
        <code class="rounded bg-fill-secondary px-1 py-0.5 text-caption-1 text-label">
          DropdownMenu.RadioItem
        </code>{" "}
        a <code class="text-caption-1">DropdownMenu.RadioGroup</code> pro výběr
        jedné možnosti.
      </p>
    </div>

    <section class="space-y-3">
      <h2 class="text-headline text-label">Layout samotný</h2>

      <CodeExample>
        <Desc>Layout samotný — viz ukázka níže.</Desc>
        <TabExample>
          <div class="rounded-lg border border-separator-opaque bg-surface-raised p-3">
            <MenuRadioItem.Root>
              <MenuRadioItem.Label>Světlý motiv</MenuRadioItem.Label>
              <MenuRadioItem.End>
                <KbdShortcut>⌘1</KbdShortcut>
              </MenuRadioItem.End>
            </MenuRadioItem.Root>
          </div>
        </TabExample>
        <TabCode>{codeLayout}</TabCode>
      </CodeExample>
    </section>

    <section class="space-y-3">
      <h2 class="text-headline text-label">V DropdownMenu.RadioGroup</h2>

      <CodeExample>
        <Desc>V DropdownMenu.RadioGroup — viz ukázka níže.</Desc>
        <TabExample>
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>Motiv</DropdownMenu.Trigger>
            <DropdownMenu.Popover>
              <DropdownMenu.RadioGroup value="light">
                <DropdownMenu.RadioItem value="light">
                  <MenuRadioItem.Root>
                    <MenuRadioItem.Label>Světlý</MenuRadioItem.Label>
                    <MenuRadioItem.End>
                      <KbdShortcut>⌘1</KbdShortcut>
                    </MenuRadioItem.End>
                  </MenuRadioItem.Root>
                </DropdownMenu.RadioItem>
                <DropdownMenu.RadioItem value="dark">
                  <MenuRadioItem.Root>
                    <MenuRadioItem.Label>Tmavý</MenuRadioItem.Label>
                    <MenuRadioItem.End>
                      <KbdShortcut>⌘2</KbdShortcut>
                    </MenuRadioItem.End>
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
        <TabCode>{codeWithDropdown}</TabCode>
      </CodeExample>
    </section>
  </div>
));
