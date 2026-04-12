import { Slot, component$ } from "@builder.io/qwik";
import { Sonner } from "~/components/ui/sonner";
import { Button } from "~/components/ui/button";
import { useSonner } from "~/components/ui/sonner";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";

export const _Example1 = component$(() => (
  <Sonner.Toaster>
    <div class="p-4">
      Obsah aplikace… <Slot />
    </div>
  </Sonner.Toaster>
));

export const ToastDemo = component$(() => {
  const { toast } = useSonner();
  return (
    <>
      <Button onClick$={() => toast("Uloženo")}>Toast</Button>
      <Button
        onClick$={() =>
          toast({
            title: "Chyba",
            description: "Zkuste to znovu.",
            type: "error",
            duration: 0,
          })
        }
      >
        Trvalý toast
      </Button>
    </>
  );
});

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Sonner</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Toaster v layoutu</h2>
        <CodeExample>
          <Desc>V kořenovém layoutu obal aplikaci kvůli kontextu; <code class="text-caption-1">Slot</code> vykreslí child routes.</Desc>
          <TabExample>
            <_Example1 />
          </TabExample>
          <TabCode>{`import { Slot, component$ } from "@builder.io/qwik";
import { Sonner } from "~/components/ui/sonner";

export default component$(() => (
  <Sonner.Toaster>
    <div class="p-4">
      Obsah aplikace… <Slot />
    </div>
  </Sonner.Toaster>
));`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Toast na stránce</h2>
        <CodeExample>
          <Desc><code class="text-caption-1">useSonner()</code> vrací <code class="text-caption-1">toast</code> pro volání z obsahu stránky.</Desc>
          <TabExample>
            <ToastDemo />
          </TabExample>
          <TabCode>{`import { component$ } from "@builder.io/qwik";
import { Button } from "~/components/ui/button";
import { useSonner } from "~/components/ui/sonner";

export const ToastDemo = component$(() => {
  const { toast } = useSonner();
  return (
    <>
      <Button onClick$={() => toast("Uloženo")}>Toast</Button>
      <Button
        onClick$={() =>
          toast({
            title: "Chyba",
            description: "Zkuste to znovu.",
            type: "error",
            duration: 0,
          })
        }
      >
        Trvalý toast
      </Button>
    </>
  );
});`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
