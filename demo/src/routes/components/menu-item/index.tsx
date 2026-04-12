import { component$ } from "@builder.io/qwik";
import { MenuItem } from "~/components/ui/menu-item";
import { KbdShortcut } from "~/components/ui/kbd-shortcut";
import { LuSave, LuSettings, LuTrash } from "@qwikest/icons/lucide";
import { DropdownMenu } from "~/components/ui/dropdown-menu";
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
        <h1 class="text-title-2 text-label">MenuItem</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Layout samotný</h2>
        <CodeExample>
          <Desc>Layout samotný — viz ukázka níže.</Desc>
          <TabExample>
            {(() => {
              // Vizuální layout — uvnitř DropdownMenu.Item
              return (
                <MenuItem.Root>
                  <MenuItem.Start><LuSave /></MenuItem.Start>
                  <MenuItem.Label>Uložit</MenuItem.Label>
                  <MenuItem.End><KbdShortcut>⌘S</KbdShortcut></MenuItem.End>
                </MenuItem.Root>
              );
            })()}
          </TabExample>
          <TabCode>{`import { MenuItem } from "~/components/ui/menu-item";
import { KbdShortcut } from "~/components/ui/kbd-shortcut";
import { LuSave, LuSettings, LuTrash } from "@qwikest/icons/lucide";

// Vizuální layout — uvnitř DropdownMenu.Item
<MenuItem.Root>
  <MenuItem.Start><LuSave /></MenuItem.Start>
  <MenuItem.Label>Uložit</MenuItem.Label>
  <MenuItem.End><KbdShortcut>⌘S</KbdShortcut></MenuItem.End>
</MenuItem.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">V DropdownMenu</h2>
        <CodeExample>
          <Desc>V DropdownMenu — viz ukázka níže.</Desc>
          <TabExample>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>Soubor</DropdownMenu.Trigger>
              <DropdownMenu.Popover>
                <DropdownMenu.Item>
                  <MenuItem.Root>
                    <MenuItem.Start><LuSave /></MenuItem.Start>
                    <MenuItem.Label>Uložit</MenuItem.Label>
                    <MenuItem.End><KbdShortcut>⌘S</KbdShortcut></MenuItem.End>
                  </MenuItem.Root>
                </DropdownMenu.Item>
                <DropdownMenu.Item>
                  <MenuItem.Root>
                    <MenuItem.Start><LuSettings /></MenuItem.Start>
                    <MenuItem.Label>Nastavení</MenuItem.Label>
                    <MenuItem.End><KbdShortcut>⌘,</KbdShortcut></MenuItem.End>
                  </MenuItem.Root>
                </DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item>
                  <MenuItem.Root>
                    <MenuItem.Start><LuTrash /></MenuItem.Start>
                    <MenuItem.Label>Smazat</MenuItem.Label>
                  </MenuItem.Root>
                </DropdownMenu.Item>
              </DropdownMenu.Popover>
            </DropdownMenu.Root>
          </TabExample>
          <TabCode>{`import { LuSave, LuSettings, LuTrash } from "@qwikest/icons/lucide";
import { DropdownMenu } from "~/components/ui/dropdown-menu";
import { MenuItem } from "~/components/ui/menu-item";
import { KbdShortcut } from "~/components/ui/kbd-shortcut";

<DropdownMenu.Root>
  <DropdownMenu.Trigger>Soubor</DropdownMenu.Trigger>
  <DropdownMenu.Popover>
    <DropdownMenu.Item>
      <MenuItem.Root>
        <MenuItem.Start><LuSave /></MenuItem.Start>
        <MenuItem.Label>Uložit</MenuItem.Label>
        <MenuItem.End><KbdShortcut>⌘S</KbdShortcut></MenuItem.End>
      </MenuItem.Root>
    </DropdownMenu.Item>
    <DropdownMenu.Item>
      <MenuItem.Root>
        <MenuItem.Start><LuSettings /></MenuItem.Start>
        <MenuItem.Label>Nastavení</MenuItem.Label>
        <MenuItem.End><KbdShortcut>⌘,</KbdShortcut></MenuItem.End>
      </MenuItem.Root>
    </DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item>
      <MenuItem.Root>
        <MenuItem.Start><LuTrash /></MenuItem.Start>
        <MenuItem.Label>Smazat</MenuItem.Label>
      </MenuItem.Root>
    </DropdownMenu.Item>
  </DropdownMenu.Popover>
</DropdownMenu.Root>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
