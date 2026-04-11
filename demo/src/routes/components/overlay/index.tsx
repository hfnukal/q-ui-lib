import { component$, useSignal } from "@builder.io/qwik";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";
import { Overlay } from "~/components/ui/overlay";
import { Button } from "~/components/ui/button";

const codeBasic = `import { useSignal } from "@builder.io/qwik";
import { Overlay } from "~/components/ui/overlay";
import { Button } from "~/components/ui/button";

export default component$(() => {
  const open = useSignal(false);
  return (
    <>
      <Button onClick$={() => (open.value = true)}>Otevřít overlay</Button>
      {open.value && (
        <Overlay onClick$={() => (open.value = false)}>
          <div class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-surface-raised p-6 shadow-xl">
            <p class="text-body text-label">Obsah nad overlayem</p>
            <Button class="mt-4" onClick$={() => (open.value = false)}>Zavřít</Button>
          </div>
        </Overlay>
      )}
    </>
  );
});`;

export default component$(() => {
  const open = useSignal(false);

  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Overlay</h1>
        <p class="mt-2 max-w-prose text-body text-secondary-label">
          Fixní poloprůhledné pozadí přes celou obrazovku. Základ pro vlastní
          modální vrstvy, drawery nebo jiné překryvy mimo nativní{" "}
          <code class="rounded bg-fill-secondary px-1 py-0.5 text-caption-1 text-label">
            &lt;dialog&gt;
          </code>
          .
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">S vlastním obsahem</h2>

        <CodeExample>
          <Desc>Kliknutím na overlay nebo tlačítko ho zavřeš.</Desc>
          <TabExample>
            <Button onClick$={() => (open.value = true)}>
              Otevřít overlay
            </Button>
            {open.value && (
              <Overlay onClick$={() => (open.value = false)}>
                <div class="fixed left-1/2 top-1/2 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-surface-raised p-6 shadow-xl">
                  <p class="text-body text-label">Obsah nad overlayem</p>
                  <Button class="mt-4" onClick$={() => (open.value = false)}>
                    Zavřít
                  </Button>
                </div>
              </Overlay>
            )}
          </TabExample>
          <TabCode>{codeBasic}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
