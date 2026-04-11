import { component$ } from "@builder.io/qwik";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";
import { Button } from "~/components/ui/button";
import { Dialog } from "~/components/ui/dialog";

const codeBasic = `import { Dialog } from "~/components/ui/dialog";
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
</Dialog.Root>`;

const codeAlert = `import { Dialog } from "~/components/ui/dialog";

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
</Dialog.Root>`;

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Dialog</h1>
        <p class="mt-2 max-w-prose text-sm text-slate-600">
          Složené API nad @qwik-ui/headless{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">Modal</code>{" "}
          (shadcn: Dialog ≈ Modal) — vycentrované okno s backdropem,
          stejné díly jako Sheet. Ukázky používají{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
            CodeExample
          </code>{" "}
          (záložky Ukázka / Kód); u vnořených tabů může být{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
            {"<dialog>"}
          </code>{" "}
          v neaktivním panelu omezený, dokud nepřepneš na Ukázka. Animace a
          skrytí mimo{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
            :modal
          </code>{" "}
          jsou v{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
            global.css
          </code>{" "}
          (
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
            q-dialog-panel
          </code>
          ).
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">Základní dialog</h2>

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
                  <p class="text-callout text-secondary-label">
                    Escape nebo klik mimo panel zavře okno (pokud na kořeni není{" "}
                    <code class="rounded bg-slate-100 px-1">
                      closeOnBackdropClick=false
                    </code>
                    ).
                  </p>
                </Dialog.Content>
                <Dialog.Footer>
                  <Dialog.Close class="rounded-md border border-separator-opaque bg-surface-raised px-4 py-2 text-callout font-medium text-label shadow-sm hover:bg-surface-overlay focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    Zrušit
                  </Dialog.Close>
                  <Button>Uložit</Button>
                </Dialog.Footer>
              </Dialog.Panel>
            </Dialog.Root>
          </TabExample>
          <TabCode>{codeBasic}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">Alert dialog</h2>

        <CodeExample>
          <Desc>
            Na{" "}
            <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
              Dialog.Root
            </code>{" "}
            nastav{" "}
            <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
              alert
            </code>{" "}
            — headless nastaví{" "}
            <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
              role=&quot;alertdialog&quot;
            </code>{" "}
            a vypne zavření klikem na pozadí.
          </Desc>
          <TabExample>
            <Dialog.Root alert>
              <Dialog.Trigger>Smazat účet</Dialog.Trigger>
              <Dialog.Panel>
                <Dialog.Close class="absolute right-4 top-4 z-10" />
                <Dialog.Header>
                  <Dialog.Title>Opravdu smazat?</Dialog.Title>
                  <Dialog.Description>
                    Tuto akci nelze vrátit zpět.
                  </Dialog.Description>
                </Dialog.Header>
                <Dialog.Footer>
                  <Dialog.Close class="rounded-md border border-separator-opaque bg-surface-raised px-4 py-2 text-callout font-medium text-label shadow-sm hover:bg-surface-overlay focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    Zrušit
                  </Dialog.Close>
                  <Dialog.Close class="rounded-md bg-system-red px-4 py-2 text-callout font-medium text-white hover:opacity-90 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2">
                    Smazat
                  </Dialog.Close>
                </Dialog.Footer>
              </Dialog.Panel>
            </Dialog.Root>
          </TabExample>
          <TabCode>{codeAlert}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
