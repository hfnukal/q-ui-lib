import { component$ } from "@builder.io/qwik";
import { Dialog } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";
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
        <h1 class="text-title-2 text-label">Dialog</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Základní dialog</h2>
        <CodeExample>
          <Desc>Základní dialog — viz ukázka níže.</Desc>
          <TabExample>
            <Dialog.Root>
              <Dialog.Trigger>Otevřít dialog</Dialog.Trigger>
              <Dialog.Panel>
                <Dialog.Close class="absolute right-4 top-4 z-10" />
                <Dialog.Header>
                  <Dialog.Title>Upravit profil</Dialog.Title>
                  <Dialog.Description>
                    Zde můžeš změnit údaje zobrazené ostatním uživatelům.
                  </Dialog.Description>
                </Dialog.Header>
                <Dialog.Content>
                  <p class="text-callout text-secondary-label">Hlavní obsah dialogu.</p>
                </Dialog.Content>
                <Dialog.Footer>
                  <Dialog.Close class="rounded-md border border-separator-opaque bg-surface-raised px-4 py-2 text-callout font-medium text-label shadow-sm hover:bg-surface-overlay">
                    Zrušit
                  </Dialog.Close>
                  <Button>Uložit</Button>
                </Dialog.Footer>
              </Dialog.Panel>
            </Dialog.Root>
          </TabExample>
          <TabCode>{`import { Dialog } from "~/components/ui/dialog";
import { Button } from "~/components/ui/button";

<Dialog.Root>
  <Dialog.Trigger>Otevřít dialog</Dialog.Trigger>
  <Dialog.Panel>
    <Dialog.Close class="absolute right-4 top-4 z-10" />
    <Dialog.Header>
      <Dialog.Title>Upravit profil</Dialog.Title>
      <Dialog.Description>
        Zde můžeš změnit údaje zobrazené ostatním uživatelům.
      </Dialog.Description>
    </Dialog.Header>
    <Dialog.Content>
      <p class="text-callout text-secondary-label">Hlavní obsah dialogu.</p>
    </Dialog.Content>
    <Dialog.Footer>
      <Dialog.Close class="rounded-md border border-separator-opaque bg-surface-raised px-4 py-2 text-callout font-medium text-label shadow-sm hover:bg-surface-overlay">
        Zrušit
      </Dialog.Close>
      <Button>Uložit</Button>
    </Dialog.Footer>
  </Dialog.Panel>
</Dialog.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Alert dialog</h2>
        <CodeExample>
          <Desc>Na <code class="text-caption-1">Dialog.Root</code> nastav <code class="text-caption-1">alert</code> — headless nastaví <code class="text-caption-1">role="alertdialog"</code> a vypne zavření klikem na pozadí.</Desc>
          <TabExample>
            <Dialog.Root alert>
              <Dialog.Trigger>Smazat účet</Dialog.Trigger>
              <Dialog.Panel>
                <Dialog.Close class="absolute right-4 top-4 z-10" />
                <Dialog.Header>
                  <Dialog.Title>Opravdu smazat?</Dialog.Title>
                  <Dialog.Description>Tuto akci nelze vrátit zpět.</Dialog.Description>
                </Dialog.Header>
                <Dialog.Footer>
                  <Dialog.Close class="rounded-md border border-separator-opaque px-4 py-2 text-callout">
                    Zrušit
                  </Dialog.Close>
                  <Dialog.Close class="rounded-md bg-system-red px-4 py-2 text-callout font-medium text-white">
                    Smazat
                  </Dialog.Close>
                </Dialog.Footer>
              </Dialog.Panel>
            </Dialog.Root>
          </TabExample>
          <TabCode>{`import { Dialog } from "~/components/ui/dialog";

<Dialog.Root alert>
  <Dialog.Trigger>Smazat účet</Dialog.Trigger>
  <Dialog.Panel>
    <Dialog.Close class="absolute right-4 top-4 z-10" />
    <Dialog.Header>
      <Dialog.Title>Opravdu smazat?</Dialog.Title>
      <Dialog.Description>Tuto akci nelze vrátit zpět.</Dialog.Description>
    </Dialog.Header>
    <Dialog.Footer>
      <Dialog.Close class="rounded-md border border-separator-opaque px-4 py-2 text-callout">
        Zrušit
      </Dialog.Close>
      <Dialog.Close class="rounded-md bg-system-red px-4 py-2 text-callout font-medium text-white">
        Smazat
      </Dialog.Close>
    </Dialog.Footer>
  </Dialog.Panel>
</Dialog.Root>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
