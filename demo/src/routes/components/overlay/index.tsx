import { component$, useSignal } from "@builder.io/qwik";
import { Overlay } from "~/components/ui/overlay";
import { Button } from "~/components/ui/button";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";

export const _Example1 = component$(() => {
  const open = useSignal(false);
  return (
    <>
      <Button onClick$={() => (open.value = true)}>Otevřít overlay</Button>
      {open.value && (
        <Overlay onClick$={() => (open.value = false)}>
          <div
            class="fixed left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-surface-raised p-6 shadow-xl"
            onClick$={(e) => e.stopPropagation()}
          >
            <p class="text-body text-label">Obsah nad overlayem</p>
            <Button class="mt-4" onClick$={() => (open.value = false)}>Zavřít</Button>
          </div>
        </Overlay>
      )}
    </>
  );
});

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Overlay</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">S vlastním obsahem</h2>
        <CodeExample>
          <Desc>Kliknutím na overlay nebo tlačítko ho zavřeš.</Desc>
          <TabExample>
            <_Example1 />
          </TabExample>
          <TabCode>{`import { useSignal } from "@builder.io/qwik";
import { Overlay } from "~/components/ui/overlay";
import { Button } from "~/components/ui/button";

export default component$(() => {
  const open = useSignal(false);
  return (
    <>
      <Button onClick$={() => (open.value = true)}>Otevřít overlay</Button>
      {open.value && (
        <Overlay onClick$={() => (open.value = false)}>
          <div
            class="fixed left-1/2 top-1/2 z-10 -translate-x-1/2 -translate-y-1/2 rounded-lg bg-surface-raised p-6 shadow-xl"
            onClick$={(e) => e.stopPropagation()}
          >
            <p class="text-body text-label">Obsah nad overlayem</p>
            <Button class="mt-4" onClick$={() => (open.value = false)}>Zavřít</Button>
          </div>
        </Overlay>
      )}
    </>
  );
});`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
