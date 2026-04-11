import { component$, useSignal } from "@builder.io/qwik";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";
import { DropdownMenu } from "~/components/ui/dropdown-menu";

const codeBasic = `import { DropdownMenu } from "~/components/ui/dropdown-menu";

<DropdownMenu.Root>
  <DropdownMenu.Trigger>Otevřít menu</DropdownMenu.Trigger>
  <DropdownMenu.Popover gutter={4}>
    <DropdownMenu.Item>Profil</DropdownMenu.Item>
    <DropdownMenu.Item>Nastavení</DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item>Odebrat</DropdownMenu.Item>
  </DropdownMenu.Popover>
</DropdownMenu.Root>`;

const codeGroups = `import { DropdownMenu } from "~/components/ui/dropdown-menu";

<DropdownMenu.Root>
  <DropdownMenu.Trigger>Účet</DropdownMenu.Trigger>
  <DropdownMenu.Popover gutter={4}>
    <DropdownMenu.Group>
      <DropdownMenu.GroupLabel>Můj účet</DropdownMenu.GroupLabel>
      <DropdownMenu.Item>Profil</DropdownMenu.Item>
      <DropdownMenu.Item>Fakturace</DropdownMenu.Item>
    </DropdownMenu.Group>
    <DropdownMenu.Separator />
    <DropdownMenu.Group>
      <DropdownMenu.GroupLabel>Nebezpečná zóna</DropdownMenu.GroupLabel>
      <DropdownMenu.Item>Odhlásit se</DropdownMenu.Item>
    </DropdownMenu.Group>
  </DropdownMenu.Popover>
</DropdownMenu.Root>`;

const codeCheckboxRadio = `import { component$, useSignal } from "@builder.io/qwik";
import { DropdownMenu } from "~/components/ui/dropdown-menu";

export const MenuWithSelection = component$(() => {
  const notifications = useSignal(true);
  const theme = useSignal("system");

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>Volby</DropdownMenu.Trigger>
      <DropdownMenu.Popover gutter={4}>
        <DropdownMenu.CheckboxItem
          bind:checked={notifications}
          closeOnSelect={false}
          class="relative pl-8"
        >
          <DropdownMenu.ItemIndicator class="absolute left-2 top-1/2 -translate-y-1/2">
            <span aria-hidden="true">✓</span>
          </DropdownMenu.ItemIndicator>
          Oznámení
        </DropdownMenu.CheckboxItem>
        <DropdownMenu.Separator />
        <DropdownMenu.RadioGroup bind:value={theme}>
          <DropdownMenu.RadioItem value="light" class="relative pl-8">
            <DropdownMenu.ItemIndicator class="absolute left-2 top-1/2 -translate-y-1/2">
              <span aria-hidden="true">✓</span>
            </DropdownMenu.ItemIndicator>
            Světlý
          </DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="dark" class="relative pl-8">
            <DropdownMenu.ItemIndicator class="absolute left-2 top-1/2 -translate-y-1/2">
              <span aria-hidden="true">✓</span>
            </DropdownMenu.ItemIndicator>
            Tmavý
          </DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="system" class="relative pl-8">
            <DropdownMenu.ItemIndicator class="absolute left-2 top-1/2 -translate-y-1/2">
              <span aria-hidden="true">✓</span>
            </DropdownMenu.ItemIndicator>
            Systém
          </DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Popover>
    </DropdownMenu.Root>
  );
});`;

const codeSubmenu = `import { DropdownMenu } from "~/components/ui/dropdown-menu";

<DropdownMenu.Root>
  <DropdownMenu.Trigger>Soubor</DropdownMenu.Trigger>
  <DropdownMenu.Popover gutter={4}>
    <DropdownMenu.Item>Nový</DropdownMenu.Item>
    <DropdownMenu.Sub>
      <DropdownMenu.SubTrigger>
        <span>Nedávné</span>
        <span class="text-secondary-label" aria-hidden="true">
          ›
        </span>
      </DropdownMenu.SubTrigger>
      <DropdownMenu.SubContent>
        <DropdownMenu.SubItem>Projekt A</DropdownMenu.SubItem>
        <DropdownMenu.SubItem>Projekt B</DropdownMenu.SubItem>
      </DropdownMenu.SubContent>
    </DropdownMenu.Sub>
    <DropdownMenu.Separator />
    <DropdownMenu.Item>Konec</DropdownMenu.Item>
  </DropdownMenu.Popover>
</DropdownMenu.Root>`;

const MenuWithSelection = component$(() => {
  const notifications = useSignal(true);
  const theme = useSignal("system");

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>Volby</DropdownMenu.Trigger>
      <DropdownMenu.Popover gutter={4}>
        <DropdownMenu.CheckboxItem
          bind:checked={notifications}
          closeOnSelect={false}
          class="relative pl-8"
        >
          <DropdownMenu.ItemIndicator class="absolute left-2 top-1/2 -translate-y-1/2">
            <span aria-hidden="true">✓</span>
          </DropdownMenu.ItemIndicator>
          Oznámení
        </DropdownMenu.CheckboxItem>
        <DropdownMenu.Separator />
        <DropdownMenu.RadioGroup bind:value={theme}>
          <DropdownMenu.RadioItem value="light" class="relative pl-8">
            <DropdownMenu.ItemIndicator class="absolute left-2 top-1/2 -translate-y-1/2">
              <span aria-hidden="true">✓</span>
            </DropdownMenu.ItemIndicator>
            Světlý
          </DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="dark" class="relative pl-8">
            <DropdownMenu.ItemIndicator class="absolute left-2 top-1/2 -translate-y-1/2">
              <span aria-hidden="true">✓</span>
            </DropdownMenu.ItemIndicator>
            Tmavý
          </DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="system" class="relative pl-8">
            <DropdownMenu.ItemIndicator class="absolute left-2 top-1/2 -translate-y-1/2">
              <span aria-hidden="true">✓</span>
            </DropdownMenu.ItemIndicator>
            Systém
          </DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Popover>
    </DropdownMenu.Root>
  );
});

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Dropdown menu</h1>
        <p class="mt-2 max-w-prose text-sm text-slate-600">
          Složené API{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
            DropdownMenu.Root
          </code>
          ,{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
            Trigger
          </code>
          ,{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
            Popover
          </code>{" "}
          a položky nad{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
            @qwik-ui/headless
          </code>{" "}
          <span class="font-medium">Dropdown</span> — stejný vzor jako shadcn
          Dropdown Menu; styly odpovídají tokenům z COLORS.md (jako Popover).
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">Základní menu</h2>

        <CodeExample>
          <Desc>Základní menu — viz ukázka níže.</Desc>
          <TabExample>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>Otevřít menu</DropdownMenu.Trigger>
              <DropdownMenu.Popover gutter={4}>
                <DropdownMenu.Item>Profil</DropdownMenu.Item>
                <DropdownMenu.Item>Nastavení</DropdownMenu.Item>
                <DropdownMenu.Separator />
                <DropdownMenu.Item>Odebrat</DropdownMenu.Item>
              </DropdownMenu.Popover>
            </DropdownMenu.Root>
          </TabExample>
          <TabCode>{codeBasic}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">Skupiny a popisky</h2>

        <CodeExample>
          <Desc>Skupiny a popisky — viz ukázka níže.</Desc>
          <TabExample>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>Účet</DropdownMenu.Trigger>
              <DropdownMenu.Popover gutter={4}>
                <DropdownMenu.Group>
                  <DropdownMenu.GroupLabel>Můj účet</DropdownMenu.GroupLabel>
                  <DropdownMenu.Item>Profil</DropdownMenu.Item>
                  <DropdownMenu.Item>Fakturace</DropdownMenu.Item>
                </DropdownMenu.Group>
                <DropdownMenu.Separator />
                <DropdownMenu.Group>
                  <DropdownMenu.GroupLabel>
                    Nebezpečná zóna
                  </DropdownMenu.GroupLabel>
                  <DropdownMenu.Item>Odhlásit se</DropdownMenu.Item>
                </DropdownMenu.Group>
              </DropdownMenu.Popover>
            </DropdownMenu.Root>
          </TabExample>
          <TabCode>{codeGroups}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">Checkbox a radio</h2>

        <CodeExample>
          <Desc>
            Pro vícenásobný výběr použij{" "}
            <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
              CheckboxItem
            </code>{" "}
            s{" "}
            <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
              bind:checked
            </code>
            ; pro jednu hodnotu{" "}
            <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
              RadioGroup
            </code>{" "}
            s{" "}
            <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
              bind:value
            </code>{" "}
            a{" "}
            <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
              RadioItem
            </code>
            .
          </Desc>
          <TabExample>
            <MenuWithSelection />
          </TabExample>
          <TabCode>{codeCheckboxRadio}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">Podmenu</h2>

        <CodeExample>
          <Desc>
            Vnořené menu je druhý{" "}
            <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
              Dropdown
            </code>{" "}
            kontext:{" "}
            <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">Sub</code>
            ,{" "}
            <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
              SubTrigger
            </code>
            ,{" "}
            <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
              SubContent
            </code>
            . Uvnitř panelu používej jen{" "}
            <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
              SubItem
            </code>{" "}
            (případně{" "}
            <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
              SubCheckboxItem
            </code>{" "}
            /{" "}
            <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
              SubRadioItem
            </code>
            ), ne hlavní{" "}
            <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
              Item
            </code>{" "}
            — jinak by headless walker sloučil indexy s hlavním menu.
          </Desc>
          <TabExample>
            <DropdownMenu.Root>
              <DropdownMenu.Trigger>Soubor</DropdownMenu.Trigger>
              <DropdownMenu.Popover gutter={4}>
                <DropdownMenu.Item>Nový</DropdownMenu.Item>
                <DropdownMenu.Sub>
                  <DropdownMenu.SubTrigger>
                    <span>Nedávné</span>
                    <span class="text-secondary-label" aria-hidden="true">
                      ›
                    </span>
                  </DropdownMenu.SubTrigger>
                  <DropdownMenu.SubContent>
                    <DropdownMenu.SubItem>Projekt A</DropdownMenu.SubItem>
                    <DropdownMenu.SubItem>Projekt B</DropdownMenu.SubItem>
                  </DropdownMenu.SubContent>
                </DropdownMenu.Sub>
                <DropdownMenu.Separator />
                <DropdownMenu.Item>Konec</DropdownMenu.Item>
              </DropdownMenu.Popover>
            </DropdownMenu.Root>
          </TabExample>
          <TabCode>{codeSubmenu}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
