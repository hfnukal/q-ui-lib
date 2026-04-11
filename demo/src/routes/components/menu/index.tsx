import { component$, useSignal } from "@builder.io/qwik";
import {
  LuSave,
  LuCopy,
  LuTrash,
  LuSettings,
  LuChevronRight,
} from "@qwikest/icons/lucide";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";
import { Menu } from "~/components/ui/menu";
import { MenuItem } from "~/components/ui/menu-item";
import { MenuCheckboxItem } from "~/components/ui/menu-checkbox-item";
import { MenuRadioItem } from "~/components/ui/menu-radio-item";
import { KbdShortcut } from "~/components/ui/kbd-shortcut";

const codeBasic = `import { Menu } from "~/components/ui/menu";

<Menu.Root>
  <Menu.Trigger>Akce</Menu.Trigger>
  <Menu.Popover>
    <Menu.Item>Uložit</Menu.Item>
    <Menu.Item>Kopírovat</Menu.Item>
    <Menu.Separator />
    <Menu.Item>Smazat</Menu.Item>
  </Menu.Popover>
</Menu.Root>`;

const codeWithMenuItem = `import { Menu } from "~/components/ui/menu";
import { MenuItem } from "~/components/ui/menu-item";
import { KbdShortcut } from "~/components/ui/kbd-shortcut";

<Menu.Root>
  <Menu.Trigger>Soubor</Menu.Trigger>
  <Menu.Popover>
    <Menu.Item>
      <MenuItem.Root>
        <MenuItem.Start><LuSave /></MenuItem.Start>
        <MenuItem.Label>Uložit</MenuItem.Label>
        <MenuItem.End><KbdShortcut>⌘S</KbdShortcut></MenuItem.End>
      </MenuItem.Root>
    </Menu.Item>
    <Menu.Item>
      <MenuItem.Root>
        <MenuItem.Start><LuCopy /></MenuItem.Start>
        <MenuItem.Label>Kopírovat</MenuItem.Label>
        <MenuItem.End><KbdShortcut>⌘C</KbdShortcut></MenuItem.End>
      </MenuItem.Root>
    </Menu.Item>
    <Menu.Separator />
    <Menu.Item>
      <MenuItem.Root>
        <MenuItem.Start><LuTrash /></MenuItem.Start>
        <MenuItem.Label>Smazat</MenuItem.Label>
      </MenuItem.Root>
    </Menu.Item>
  </Menu.Popover>
</Menu.Root>`;

const codeCheckbox = `import { useSignal } from "@builder.io/qwik";
import { Menu } from "~/components/ui/menu";
import { MenuCheckboxItem } from "~/components/ui/menu-checkbox-item";

export default component$(() => {
  const sidebar = useSignal(true);
  const statusBar = useSignal(false);
  return (
    <Menu.Root>
      <Menu.Trigger>Zobrazení</Menu.Trigger>
      <Menu.Popover>
        <Menu.CheckboxItem bind:checked={sidebar}>
          <MenuCheckboxItem.Root>
            <MenuCheckboxItem.Label>Postranní panel</MenuCheckboxItem.Label>
            <MenuCheckboxItem.End><KbdShortcut>⌘B</KbdShortcut></MenuCheckboxItem.End>
          </MenuCheckboxItem.Root>
        </Menu.CheckboxItem>
        <Menu.CheckboxItem bind:checked={statusBar}>
          <MenuCheckboxItem.Root>
            <MenuCheckboxItem.Label>Stavový řádek</MenuCheckboxItem.Label>
          </MenuCheckboxItem.Root>
        </Menu.CheckboxItem>
      </Menu.Popover>
    </Menu.Root>
  );
});`;

const codeRadio = `import { useSignal } from "@builder.io/qwik";
import { Menu } from "~/components/ui/menu";
import { MenuRadioItem } from "~/components/ui/menu-radio-item";

export default component$(() => {
  const theme = useSignal("light");
  return (
    <Menu.Root>
      <Menu.Trigger>Motiv</Menu.Trigger>
      <Menu.Popover>
        <Menu.RadioGroup bind:value={theme}>
          <Menu.RadioItem value="light">
            <MenuRadioItem.Root>
              <MenuRadioItem.Label>Světlý</MenuRadioItem.Label>
              <MenuRadioItem.End><KbdShortcut>⌘1</KbdShortcut></MenuRadioItem.End>
            </MenuRadioItem.Root>
          </Menu.RadioItem>
          <Menu.RadioItem value="dark">
            <MenuRadioItem.Root>
              <MenuRadioItem.Label>Tmavý</MenuRadioItem.Label>
              <MenuRadioItem.End><KbdShortcut>⌘2</KbdShortcut></MenuRadioItem.End>
            </MenuRadioItem.Root>
          </Menu.RadioItem>
          <Menu.RadioItem value="system">
            <MenuRadioItem.Root>
              <MenuRadioItem.Label>Systémový</MenuRadioItem.Label>
            </MenuRadioItem.Root>
          </Menu.RadioItem>
        </Menu.RadioGroup>
      </Menu.Popover>
    </Menu.Root>
  );
});`;

const codeSub = `<Menu.Root>
  <Menu.Trigger>Možnosti</Menu.Trigger>
  <Menu.Popover>
    <Menu.Item>Přejmenovat</Menu.Item>
    <Menu.Sub>
      <Menu.SubTrigger>
        <MenuItem.Root>
          <MenuItem.Start><LuSettings /></MenuItem.Start>
          <MenuItem.Label>Nastavení</MenuItem.Label>
          <MenuItem.End><LuChevronRight /></MenuItem.End>
        </MenuItem.Root>
      </Menu.SubTrigger>
      <Menu.SubContent>
        <Menu.SubItem>Účet</Menu.SubItem>
        <Menu.SubItem>Vzhled</Menu.SubItem>
      </Menu.SubContent>
    </Menu.Sub>
    <Menu.Separator />
    <Menu.Item>Smazat</Menu.Item>
  </Menu.Popover>
</Menu.Root>`;

export default component$(() => {
  const sidebar = useSignal(true);
  const statusBar = useSignal(false);
  const theme = useSignal("light");
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Menu</h1>
        <p class="mt-2 max-w-prose text-body text-secondary-label">
          Alias nad{" "}
          <code class="rounded bg-fill-secondary px-1 py-0.5 text-caption-1 text-label">
            DropdownMenu
          </code>{" "}
          — stejné API, kratší název pro obecné použití mimo kontexty, kde by
          „dropdown" byl zavádějící. Závisí na komponentě{" "}
          <code class="text-caption-1">dropdown-menu</code>.
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Základní použití</h2>

        <CodeExample>
          <Desc>Základní použití — viz ukázka níže.</Desc>
          <TabExample>
            <Menu.Root>
              <Menu.Trigger>Akce</Menu.Trigger>
              <Menu.Popover>
                <Menu.Item>Uložit</Menu.Item>
                <Menu.Item>Kopírovat</Menu.Item>
                <Menu.Separator />
                <Menu.Item>Smazat</Menu.Item>
              </Menu.Popover>
            </Menu.Root>
          </TabExample>
          <TabCode>{codeBasic}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">S MenuItem layoutem</h2>

        <CodeExample>
          <Desc>S MenuItem layoutem — viz ukázka níže.</Desc>
          <TabExample>
            <Menu.Root>
              <Menu.Trigger>Soubor</Menu.Trigger>
              <Menu.Popover>
                <Menu.Item>
                  <MenuItem.Root>
                    <MenuItem.Start>
                      <LuSave />
                    </MenuItem.Start>
                    <MenuItem.Label>Uložit</MenuItem.Label>
                    <MenuItem.End>
                      <KbdShortcut>⌘S</KbdShortcut>
                    </MenuItem.End>
                  </MenuItem.Root>
                </Menu.Item>
                <Menu.Item>
                  <MenuItem.Root>
                    <MenuItem.Start>
                      <LuCopy />
                    </MenuItem.Start>
                    <MenuItem.Label>Kopírovat</MenuItem.Label>
                    <MenuItem.End>
                      <KbdShortcut>⌘C</KbdShortcut>
                    </MenuItem.End>
                  </MenuItem.Root>
                </Menu.Item>
                <Menu.Separator />
                <Menu.Item>
                  <MenuItem.Root>
                    <MenuItem.Start>
                      <LuTrash />
                    </MenuItem.Start>
                    <MenuItem.Label>Smazat</MenuItem.Label>
                  </MenuItem.Root>
                </Menu.Item>
              </Menu.Popover>
            </Menu.Root>
          </TabExample>
          <TabCode>{codeWithMenuItem}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">CheckboxItem</h2>

        <CodeExample>
          <Desc>
            Zaškrtnutí se zobrazí jako fajfka vlevo. Stav řídí{" "}
            <code class="text-caption-1">bind:checked</code>.
          </Desc>
          <TabExample>
            <Menu.Root>
              <Menu.Trigger>Zobrazení</Menu.Trigger>
              <Menu.Popover>
                <Menu.CheckboxItem bind:checked={sidebar}>
                  <MenuCheckboxItem.Root>
                    <MenuCheckboxItem.Label>
                      Postranní panel
                    </MenuCheckboxItem.Label>
                    <MenuCheckboxItem.End>
                      <KbdShortcut>⌘B</KbdShortcut>
                    </MenuCheckboxItem.End>
                  </MenuCheckboxItem.Root>
                </Menu.CheckboxItem>
                <Menu.CheckboxItem bind:checked={statusBar}>
                  <MenuCheckboxItem.Root>
                    <MenuCheckboxItem.Label>
                      Stavový řádek
                    </MenuCheckboxItem.Label>
                  </MenuCheckboxItem.Root>
                </Menu.CheckboxItem>
              </Menu.Popover>
            </Menu.Root>
          </TabExample>
          <TabCode>{codeCheckbox}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">RadioItem</h2>

        <CodeExample>
          <Desc>
            Vybraná položka se označí tečkou. Stav řídí{" "}
            <code class="text-caption-1">bind:value</code> na{" "}
            <code class="text-caption-1">RadioGroup</code>.
          </Desc>
          <TabExample>
            <Menu.Root>
              <Menu.Trigger>Motiv</Menu.Trigger>
              <Menu.Popover>
                <Menu.RadioGroup bind:value={theme}>
                  <Menu.RadioItem value="light">
                    <MenuRadioItem.Root>
                      <MenuRadioItem.Label>Světlý</MenuRadioItem.Label>
                      <MenuRadioItem.End>
                        <KbdShortcut>⌘1</KbdShortcut>
                      </MenuRadioItem.End>
                    </MenuRadioItem.Root>
                  </Menu.RadioItem>
                  <Menu.RadioItem value="dark">
                    <MenuRadioItem.Root>
                      <MenuRadioItem.Label>Tmavý</MenuRadioItem.Label>
                      <MenuRadioItem.End>
                        <KbdShortcut>⌘2</KbdShortcut>
                      </MenuRadioItem.End>
                    </MenuRadioItem.Root>
                  </Menu.RadioItem>
                  <Menu.RadioItem value="system">
                    <MenuRadioItem.Root>
                      <MenuRadioItem.Label>Systémový</MenuRadioItem.Label>
                    </MenuRadioItem.Root>
                  </Menu.RadioItem>
                </Menu.RadioGroup>
              </Menu.Popover>
            </Menu.Root>
          </TabExample>
          <TabCode>{codeRadio}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Podmenu</h2>

        <CodeExample>
          <Desc>
            Vnořené menu: <code class="text-caption-1">Menu.Sub</code>,{" "}
            <code class="text-caption-1">SubTrigger</code> a položky se šipkou
            doprava.
          </Desc>
          <TabExample>
            <Menu.Root>
              <Menu.Trigger>Možnosti</Menu.Trigger>
              <Menu.Popover>
                <Menu.Item>Přejmenovat</Menu.Item>
                <Menu.Sub>
                  <Menu.SubTrigger>
                    <MenuItem.Root>
                      <MenuItem.Start>
                        <LuSettings />
                      </MenuItem.Start>
                      <MenuItem.Label>Nastavení</MenuItem.Label>
                      <MenuItem.End>
                        <LuChevronRight />
                      </MenuItem.End>
                    </MenuItem.Root>
                  </Menu.SubTrigger>
                  <Menu.SubContent>
                    <Menu.SubItem>Účet</Menu.SubItem>
                    <Menu.SubItem>Vzhled</Menu.SubItem>
                  </Menu.SubContent>
                </Menu.Sub>
                <Menu.Separator />
                <Menu.Item>Smazat</Menu.Item>
              </Menu.Popover>
            </Menu.Root>
          </TabExample>
          <TabCode>{codeSub}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
