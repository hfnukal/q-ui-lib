import { component$ } from "@builder.io/qwik";
import { LuSave, LuTrash, LuSettings } from "@qwikest/icons/lucide";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";
import { MenuItem } from "~/components/ui/menu-item";
import { KbdShortcut } from "~/components/ui/kbd-shortcut";
import { DropdownMenu } from "~/components/ui/dropdown-menu";

const codeLayout = `import { MenuItem } from "~/components/ui/menu-item";
import { KbdShortcut } from "~/components/ui/kbd-shortcut";
import { LuSave } from "@qwikest/icons/lucide";

// Vizuální layout — uvnitř DropdownMenu.Item
<MenuItem.Root>
  <MenuItem.Start><LuSave /></MenuItem.Start>
  <MenuItem.Label>Uložit</MenuItem.Label>
  <MenuItem.End><KbdShortcut>⌘S</KbdShortcut></MenuItem.End>
</MenuItem.Root>`;

const codeWithDropdown = `import { DropdownMenu } from "~/components/ui/dropdown-menu";
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
</DropdownMenu.Root>`;

export default component$(() => (
  <div class="space-y-10">
    <div>
      <h1 class="text-title-2 text-label">MenuItem</h1>
      <p class="mt-2 max-w-prose text-body text-secondary-label">
        Vizuální layout řádku menu — kombinuj s{" "}
        <code class="rounded bg-fill-secondary px-1 py-0.5 text-caption-1 text-label">
          DropdownMenu.Item
        </code>{" "}
        jako interaktivním wrapperem. Skládá{" "}
        <code class="text-caption-1">Start</code> (ikona),{" "}
        <code class="text-caption-1">Label</code> (text) a{" "}
        <code class="text-caption-1">End</code> (zkratka).
      </p>
    </div>

    <section class="space-y-3">
      <h2 class="text-headline text-label">Layout samotný</h2>

      <CodeExample>
        <Desc>Layout samotný — viz ukázka níže.</Desc>
        <TabExample>
          <div class="rounded-lg border border-separator-opaque bg-surface-raised p-3">
            <MenuItem.Root>
              <MenuItem.Start>
                <LuSave />
              </MenuItem.Start>
              <MenuItem.Label>Uložit</MenuItem.Label>
              <MenuItem.End>
                <KbdShortcut>⌘S</KbdShortcut>
              </MenuItem.End>
            </MenuItem.Root>
          </div>
        </TabExample>
        <TabCode>{codeLayout}</TabCode>
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
                  <MenuItem.Start>
                    <LuSave />
                  </MenuItem.Start>
                  <MenuItem.Label>Uložit</MenuItem.Label>
                  <MenuItem.End>
                    <KbdShortcut>⌘S</KbdShortcut>
                  </MenuItem.End>
                </MenuItem.Root>
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                <MenuItem.Root>
                  <MenuItem.Start>
                    <LuSettings />
                  </MenuItem.Start>
                  <MenuItem.Label>Nastavení</MenuItem.Label>
                  <MenuItem.End>
                    <KbdShortcut>⌘,</KbdShortcut>
                  </MenuItem.End>
                </MenuItem.Root>
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item>
                <MenuItem.Root>
                  <MenuItem.Start>
                    <LuTrash />
                  </MenuItem.Start>
                  <MenuItem.Label>Smazat</MenuItem.Label>
                </MenuItem.Root>
              </DropdownMenu.Item>
            </DropdownMenu.Popover>
          </DropdownMenu.Root>
        </TabExample>
        <TabCode>{codeWithDropdown}</TabCode>
      </CodeExample>
    </section>
  </div>
));
