import { component$, useSignal } from "@builder.io/qwik";
import { DropdownMenu } from "~/components/ui/dropdown-menu";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";

export const MenuWithSelection = component$(() => {
  const notifications = useSignal(true);
  const theme = useSignal("system");

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>Volby</DropdownMenu.Trigger>
      <DropdownMenu.Popover gutter={4}>
        <DropdownMenu.CheckboxItem bind:checked={notifications} closeOnSelect={false}>
          Oznámení
        </DropdownMenu.CheckboxItem>
        <DropdownMenu.Separator />
        <DropdownMenu.RadioGroup bind:value={theme}>
          <DropdownMenu.RadioItem value="light">Světlý</DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="dark">Tmavý</DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="system">Systém</DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Popover>
    </DropdownMenu.Root>
  );
});

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">DropdownMenu</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Základní menu</h2>
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
          <TabCode>{`import { DropdownMenu } from "~/components/ui/dropdown-menu";

<DropdownMenu.Root>
  <DropdownMenu.Trigger>Otevřít menu</DropdownMenu.Trigger>
  <DropdownMenu.Popover gutter={4}>
    <DropdownMenu.Item>Profil</DropdownMenu.Item>
    <DropdownMenu.Item>Nastavení</DropdownMenu.Item>
    <DropdownMenu.Separator />
    <DropdownMenu.Item>Odebrat</DropdownMenu.Item>
  </DropdownMenu.Popover>
</DropdownMenu.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Skupiny a popisky</h2>
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
                  <DropdownMenu.GroupLabel>Nebezpečná zóna</DropdownMenu.GroupLabel>
                  <DropdownMenu.Item>Odhlásit se</DropdownMenu.Item>
                </DropdownMenu.Group>
              </DropdownMenu.Popover>
            </DropdownMenu.Root>
          </TabExample>
          <TabCode>{`import { DropdownMenu } from "~/components/ui/dropdown-menu";

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
</DropdownMenu.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Checkbox a radio</h2>
        <CodeExample>
          <Desc>Pro vícenásobný výběr použij <code class="text-caption-1">CheckboxItem</code> s <code class="text-caption-1">bind:checked</code> ; pro jednu hodnotu <code class="text-caption-1">RadioGroup</code> s <code class="text-caption-1">bind:value</code> a <code class="text-caption-1">RadioItem</code> .</Desc>
          <TabExample>
            <MenuWithSelection />
          </TabExample>
          <TabCode>{`import { component$, useSignal } from "@builder.io/qwik";
import { DropdownMenu } from "~/components/ui/dropdown-menu";

export const MenuWithSelection = component$(() => {
  const notifications = useSignal(true);
  const theme = useSignal("system");

  return (
    <DropdownMenu.Root>
      <DropdownMenu.Trigger>Volby</DropdownMenu.Trigger>
      <DropdownMenu.Popover gutter={4}>
        <DropdownMenu.CheckboxItem bind:checked={notifications} closeOnSelect={false}>
          Oznámení
        </DropdownMenu.CheckboxItem>
        <DropdownMenu.Separator />
        <DropdownMenu.RadioGroup bind:value={theme}>
          <DropdownMenu.RadioItem value="light">Světlý</DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="dark">Tmavý</DropdownMenu.RadioItem>
          <DropdownMenu.RadioItem value="system">Systém</DropdownMenu.RadioItem>
        </DropdownMenu.RadioGroup>
      </DropdownMenu.Popover>
    </DropdownMenu.Root>
  );
});`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Podmenu</h2>
        <CodeExample>
          <Desc>Vnořené menu je druhý <code class="text-caption-1">Dropdown</code> kontext: <code class="text-caption-1">Sub</code> , <code class="text-caption-1">SubTrigger</code> , <code class="text-caption-1">SubContent</code> . Uvnitř panelu používej jen <code class="text-caption-1">SubItem</code> (případně <code class="text-caption-1">SubCheckboxItem</code> / <code class="text-caption-1">SubRadioItem</code> ), ne hlavní <code class="text-caption-1">Item</code> — jinak by headless walker sloučil indexy s hlavním menu.</Desc>
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
          <TabCode>{`import { DropdownMenu } from "~/components/ui/dropdown-menu";

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
</DropdownMenu.Root>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
