import { component$ } from "@builder.io/qwik";
import { CodeExample } from "~/components/demo/codeexample";
import { FileInput } from "~/components/ui/file-input";

const codeDropHidden = `import { FileInput } from "~/components/ui/file-input";

<FileInput.DropArea dropLabel="Pusťte soubor sem" class="max-w-lg">
  <FileInput.Input name="doc" hidden accept=".pdf,.png" />
</FileInput.DropArea>`;

const codeDropHiddenMultiple = `import { FileInput } from "~/components/ui/file-input";

<FileInput.DropArea dropLabel="Pusťte jeden nebo více souborů" class="max-w-lg">
  <FileInput.Input name="demo-multi" hidden multiple />
</FileInput.DropArea>`;

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">File input</h1>
        <p class="mt-2 max-w-prose text-body text-secondary-label">
          Složené API <code class="text-caption-1">FileInput.DropArea</code> +{" "}
          <code class="text-caption-1">FileInput.Input</code>. DropArea poskytuje kontext; při přetažení
          souboru se nastaví na skrytý input a zobrazí se název souboru.
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Drop zóna + skrytý input</h2>
        <p class="text-callout text-secondary-label">
          Při drag over se změní okraj a pozadí; přes zónu je text z <code class="text-caption-1">dropLabel</code>.
        </p>
        <CodeExample code={codeDropHidden}>
          <FileInput.DropArea dropLabel="Pusťte soubor sem" class="max-w-lg" noFrame>
            <FileInput.Input name="demo-file" hidden accept="image/*,.pdf" />
            Obsah nezobrazi zadny ramecek, dokud nebudeme pretahovat obsah.
          </FileInput.DropArea>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Více souborů</h2>
        <div class="max-w-lg">
        <CodeExample code={codeDropHiddenMultiple}>
          <FileInput.DropArea dropLabel="Pusťte jeden nebo více souborů" class="max-w-lg">
            <FileInput.Input name="demo-multi" multiple hidden />
            <div>
              Ahoj hidden
            </div>
          </FileInput.DropArea>
          </CodeExample>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Více souborů</h2>
        <div class="max-w-lg">
        <CodeExample code={codeDropHiddenMultiple}>
          <FileInput.DropArea dropLabel="Pusťte jeden nebo více souborů" class="max-w-lg">
            <FileInput.Input name="demo-multi" multiple />
            <div>
              Ahoj
            </div>
          </FileInput.DropArea>
          </CodeExample>
        </div>
      </section>
    </div>
  );
});
