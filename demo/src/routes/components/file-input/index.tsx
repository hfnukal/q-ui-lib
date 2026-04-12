import { $, component$, useSignal } from "@builder.io/qwik";
import { FileInput } from "~/components/ui/file-input";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";

export const _Example1 = component$(() => {
  const enabled = useSignal(false);
  return (
    <>
      <label class="flex cursor-pointer items-center gap-2 text-callout text-label">
        <input
          type="checkbox"
          class="h-4 w-4 rounded border-separator-opaque accent-accent"
          checked={enabled.value}
          onChange$={$((_, el) => {
            enabled.value = el.checked;
          })}
        />
        Zapnout celoplošný drop (překryje náhledy níže)
      </label>
      {enabled.value ? (
        <FileInput.DropArea fullScreen dropLabel="Pusťte soubory">
          <FileInput.Input name="fullscreen-demo" hidden multiple />
        </FileInput.DropArea>
      ) : null}
    </>
  );
});

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">FileInput</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Celá obrazovka (fullScreen)</h2>
        <CodeExample>
          <Desc>Překryje viewport (<code class="text-caption-1">fixed</code>), implicitně <code class="text-caption-1">noDropBorder</code>. Overlay jen při přetahování souborů z OS (ne textu odkudkoliv).
Na stránce s více zónami ho zapínejte podmíněně (např. checkbox), jinak přepíše celou stránku.</Desc>
          <TabExample>
            <_Example1 />
          </TabExample>
          <TabCode>{`import { $, component$, useSignal } from "@builder.io/qwik";
import { FileInput } from "~/components/ui/file-input";

export default component$(() => {
  const enabled = useSignal(false);
  return (
    <>
      <label class="flex cursor-pointer items-center gap-2 text-callout text-label">
        <input
          type="checkbox"
          class="h-4 w-4 rounded border-separator-opaque accent-accent"
          checked={enabled.value}
          onChange$={$((_, el) => {
            enabled.value = el.checked;
          })}
        />
        Zapnout celoplošný drop (překryje náhledy níže)
      </label>
      {enabled.value ? (
        <FileInput.DropArea fullScreen dropLabel="Pusťte soubory">
          <FileInput.Input name="fullscreen-demo" hidden multiple />
        </FileInput.DropArea>
      ) : null}
    </>
  );
});`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Drop zóna + skrytý input</h2>
        <CodeExample>
          <Desc>Při drag over se změní okraj a pozadí; přes zónu je text z <code class="text-caption-1">dropLabel</code>.</Desc>
          <TabExample>
            <FileInput.DropArea dropLabel="Pusťte soubor sem" class="max-w-lg">
              <FileInput.Input name="doc" hidden accept=".pdf,.png" />
            </FileInput.DropArea>
          </TabExample>
          <TabCode>{`import { FileInput } from "~/components/ui/file-input";

<FileInput.DropArea dropLabel="Pusťte soubor sem" class="max-w-lg">
  <FileInput.Input name="doc" hidden accept=".pdf,.png" />
</FileInput.DropArea>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Více souborů (skrytý input)</h2>
        <CodeExample>
          <Desc>Více souborů přes <code class="text-caption-1">multiple</code> na skrytém inputu.</Desc>
          <TabExample>
            <FileInput.DropArea dropLabel="Pusťte jeden nebo více souborů" class="max-w-lg">
              <FileInput.Input name="demo-multi" hidden multiple />
            </FileInput.DropArea>
          </TabExample>
          <TabCode>{`import { FileInput } from "~/components/ui/file-input";

<FileInput.DropArea dropLabel="Pusťte jeden nebo více souborů" class="max-w-lg">
  <FileInput.Input name="demo-multi" hidden multiple />
</FileInput.DropArea>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Více souborů (viditelný input)</h2>
        <CodeExample>
          <Desc>Stejné rozhraní s viditelným file inputem v obsahu zóny.</Desc>
          <TabExample>
            <FileInput.DropArea dropLabel="Pusťte jeden nebo více souborů" class="max-w-lg">
              <FileInput.Input name="demo-multi" multiple />
            </FileInput.DropArea>
          </TabExample>
          <TabCode>{`import { FileInput } from "~/components/ui/file-input";

<FileInput.DropArea dropLabel="Pusťte jeden nebo více souborů" class="max-w-lg">
  <FileInput.Input name="demo-multi" multiple />
</FileInput.DropArea>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Bez překrytí (noDropOverlay)</h2>
        <CodeExample>
          <Desc><code class="text-caption-1">noDropOverlay</code> zvýrazní jen okraj při dragu — bez poloprůhledné plochy s textem.</Desc>
          <TabExample>
            <FileInput.DropArea noDropOverlay class="max-w-lg">
              <p class="mb-3 text-callout text-secondary-label">Přetáhněte soubor nebo klikněte níže.</p>
              <FileInput.Input name="nodrop-overlay" hidden />
            </FileInput.DropArea>
          </TabExample>
          <TabCode>{`import { FileInput } from "~/components/ui/file-input";

<FileInput.DropArea noDropOverlay class="max-w-lg">
  <p class="mb-3 text-callout text-secondary-label">Přetáhněte soubor nebo klikněte níže.</p>
  <FileInput.Input name="nodrop-overlay" hidden />
</FileInput.DropArea>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Bez rámečku (noDropBorder)</h2>
        <CodeExample>
          <Desc><code class="text-caption-1">noDropBorder</code> odstraní rámeček i padding — jen obsah v čisté ploše; overlay je automaticky vypnutý.</Desc>
          <TabExample>
            <FileInput.DropArea noDropBorder class="max-w-lg">
              <p class="text-callout text-secondary-label">Sem přetáhněte soubor, nebo klikněte níže.</p>
              <FileInput.Input name="nodrop-border" hidden />
            </FileInput.DropArea>
          </TabExample>
          <TabCode>{`import { FileInput } from "~/components/ui/file-input";

<FileInput.DropArea noDropBorder class="max-w-lg">
  <p class="text-callout text-secondary-label">Sem přetáhněte soubor, nebo klikněte níže.</p>
  <FileInput.Input name="nodrop-border" hidden />
</FileInput.DropArea>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
