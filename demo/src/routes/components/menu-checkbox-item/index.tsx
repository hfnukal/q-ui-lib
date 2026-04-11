import { component$, useSignal } from "@builder.io/qwik";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";
import { MenuCheckboxItem } from "~/components/ui/menu-checkbox-item";
import { KbdShortcut } from "~/components/ui/kbd-shortcut";
import { DropdownMenu } from "~/components/ui/dropdown-menu";

const codeLayout = `import { MenuCheckboxItem } from "~/components/ui/menu-checkbox-item";
import { KbdShortcut } from "~/components/ui/kbd-shortcut";

<MenuCheckboxItem.Root>
  <MenuCheckboxItem.Label>Zobrazit panel</MenuCheckboxItem.Label>
  <MenuCheckboxItem.End><KbdShortcut>⌘B</KbdShortcut></MenuCheckboxItem.End>
</MenuCheckboxItem.Root>`;

const codeWithDropdown = `import { useSignal } from "@builder.io/qwik";
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
});`;

export default component$(() => {
  const sidebar = useSignal(true);
  const statusBar = useSignal(false);
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">MenuCheckboxItem</h1>
        <p class="mt-2 max-w-prose text-body text-secondary-label">
          Vizuální layout zaškrtávací položky menu. Indikátor (fajfka) se
          zobrazí automaticky — stačí obalit do{" "}
          <code class="rounded bg-fill-secondary px-1 py-0.5 text-caption-1 text-label">
            DropdownMenu.CheckboxItem
          </code>{" "}
          a předat <code class="text-caption-1">bind:checked</code>.
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Layout samotný</h2>

        <CodeExample>
          <Desc>Layout samotný — viz ukázka níže.</Desc>
          <TabExample>
            <div class="rounded-lg border border-separator-opaque bg-surface-raised p-3">
              <MenuCheckboxItem.Root>
                <MenuCheckboxItem.Label>Zobrazit panel</MenuCheckboxItem.Label>
                <MenuCheckboxItem.End>
                  <KbdShortcut>⌘B</KbdShortcut>
                </MenuCheckboxItem.End>
              </MenuCheckboxItem.Root>
            </div>
          </TabExample>
          <TabCode>{codeLayout}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">V DropdownMenu.CheckboxItem</h2>

        <CodeExample>
          <Desc>
            Fajfka se zobrazí automaticky. Stav řídí reaktivní signál přes{" "}
            <code class="text-caption-1">bind:checked</code>.
          </Desc>
          <TabExample>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>Zobrazení</DropdownMenu.Trigger>
              <DropdownMenu.Popover>
                <DropdownMenu.CheckboxItem bind:checked={sidebar}>
                  <MenuCheckboxItem.Root>
                    <MenuCheckboxItem.Label>
                      Postranní panel
                    </MenuCheckboxItem.Label>
                    <MenuCheckboxItem.End>
                      <KbdShortcut>⌘B</KbdShortcut>
                    </MenuCheckboxItem.End>
                  </MenuCheckboxItem.Root>
                </DropdownMenu.CheckboxItem>
                <DropdownMenu.CheckboxItem bind:checked={statusBar}>
                  <MenuCheckboxItem.Root>
                    <MenuCheckboxItem.Label>
                      Stavový řádek
                    </MenuCheckboxItem.Label>
                  </MenuCheckboxItem.Root>
                </DropdownMenu.CheckboxItem>
              </DropdownMenu.Popover>
            </DropdownMenu.Root>
          </TabExample>
          <TabCode>{codeWithDropdown}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
