import { component$ } from "@builder.io/qwik";
import { Menubar } from "~/components/ui/menubar";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";

export const _Example1 = component$(() => {
  const fileMenu = Menubar.useMenu("file");
  const editMenu = Menubar.useMenu("edit");
  return (
    <Menubar.Root class="rounded-md border border-separator-opaque p-1">
      <Menubar.Menu {...fileMenu}>
        <Menubar.Trigger>Soubor</Menubar.Trigger>
        <Menubar.Content>
          <Menubar.Item>Nový</Menubar.Item>
          <Menubar.Item>Uložit</Menubar.Item>
        </Menubar.Content>
      </Menubar.Menu>
      <Menubar.Menu {...editMenu}>
        <Menubar.Trigger>Úpravy</Menubar.Trigger>
        <Menubar.Content>
          <Menubar.Item>Zpět</Menubar.Item>
        </Menubar.Content>
      </Menubar.Menu>
    </Menubar.Root>
  );
});

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Menubar</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Lišta s podmenu</h2>
        <CodeExample>
          <Desc><code class="text-caption-1">Menubar.Root</code> → pro každé menu <code class="text-caption-1">Menubar.Menu</code> + <code class="text-caption-1">Menubar.useMenu("id")</code> → <code class="text-caption-1">Menubar.Trigger</code> + <code class="text-caption-1">Menubar.Content</code> s položkami.</Desc>
          <TabExample>
            <_Example1 />
          </TabExample>
          <TabCode>{`import { component$ } from "@builder.io/qwik";
import { Menubar } from "~/components/ui/menubar";

export default component$(() => {
  const fileMenu = Menubar.useMenu("file");
  const editMenu = Menubar.useMenu("edit");
  return (
    <Menubar.Root class="rounded-md border border-separator-opaque p-1">
      <Menubar.Menu {...fileMenu}>
        <Menubar.Trigger>Soubor</Menubar.Trigger>
        <Menubar.Content>
          <Menubar.Item>Nový</Menubar.Item>
          <Menubar.Item>Uložit</Menubar.Item>
        </Menubar.Content>
      </Menubar.Menu>
      <Menubar.Menu {...editMenu}>
        <Menubar.Trigger>Úpravy</Menubar.Trigger>
        <Menubar.Content>
          <Menubar.Item>Zpět</Menubar.Item>
        </Menubar.Content>
      </Menubar.Menu>
    </Menubar.Root>
  );
});`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
