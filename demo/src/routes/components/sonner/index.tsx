import { component$, useSignal } from "@builder.io/qwik";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";
import { Button } from "~/components/ui/button";
import { useSonner } from "~/components/ui/sonner";

const codeUsage = `// V kořenovém layoutu obal aplikaci (kvůli kontextu):
import { Sonner } from "~/components/ui/sonner";

<Sonner.Toaster>
  <div>… <Slot /> …</div>
</Sonner.Toaster>

// Na stránce:
import { useSonner } from "~/components/ui/sonner";

const { toast, dismiss } = useSonner();

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

const id = toast({ title: "…", type: "loading" });
// … dismiss(id);`;

export default component$(() => {
  const { toast, dismiss } = useSonner();
  const lastId = useSignal<string | undefined>(undefined);

  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Sonner</h1>
        <p class="mt-2 max-w-prose text-sm text-slate-600">
          Qwikovská notifikační vrstva inspirovaná{" "}
          <a
            class="text-slate-900 underline decoration-slate-400 underline-offset-2 hover:decoration-slate-600"
            href="https://ui.shadcn.com/docs/components/sonner"
            target="_blank"
            rel="noreferrer"
          >
            shadcn Sonner
          </a>{" "}
          — bez React balíčku{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
            sonner
          </code>
          . Stav drží{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
            Sonner.Toaster
          </code>
          , volání přes{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
            useSonner()
          </code>{" "}
          (tokeny z COLORS.md). Více zpráv je ve výchozím stavu naskládaných:
          nejnovější je nahoře v plné velikosti; u většího počtu karet se
          měřítko snižuje jen do 4. úrovně od přední, pak už ne. Ve sbaleném
          stavu jsou vidět jen 3 nejnovější zprávy (starší po najetí myší).
          Každá vrstva vzadu je o 30 % průhlednější než ta před ní. Po hoveru
          jsou všechny plně neprůhledné a rozložené pod sebe.
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">Typy a zprávy</h2>

        <CodeExample>
          <Desc>Typy a zprávy — viz ukázka níže.</Desc>
          <TabExample>
            <div class="flex flex-wrap gap-2">
              <Button onClick$={() => toast("Krátká zpráva")}>Text</Button>
              <Button
                variant="secondary"
                onClick$={() =>
                  toast({
                    title: "Uloženo",
                    description: "Změny jsou v pořádku.",
                    type: "success",
                  })
                }
              >
                Úspěch
              </Button>
              <Button
                variant="secondary"
                onClick$={() =>
                  toast({
                    title: "Nelze pokračovat",
                    description: "Zkontrolujte údaje a zkuste to znovu.",
                    type: "error",
                  })
                }
              >
                Chyba
              </Button>
              <Button
                variant="secondary"
                onClick$={() =>
                  toast({
                    title: "Pozor",
                    description: "Akce ovlivní ostatní uživatele.",
                    type: "warning",
                  })
                }
              >
                Varování
              </Button>
              <Button
                variant="secondary"
                onClick$={() =>
                  toast({
                    title: "Informace",
                    description: "Nová verze je k dispozici.",
                    type: "info",
                  })
                }
              >
                Info
              </Button>
              <Button
                variant="secondary"
                onClick$={async () => {
                  const id = await toast({
                    title: "Načítání…",
                    description: "Simulace requestu.",
                    type: "loading",
                    duration: 8000,
                  });
                  lastId.value = id;
                }}
              >
                Loading
              </Button>
              <Button
                variant="secondary"
                onClick$={() =>
                  toast({
                    title: "Zůstane do zavření",
                    description: "duration: 0",
                    type: "default",
                    duration: 0,
                  })
                }
              >
                Trvalý
              </Button>
              <Button
                variant="secondary"
                disabled={!lastId.value}
                onClick$={() => {
                  const id = lastId.value;
                  if (id) dismiss(id);
                }}
              >
                Zavřít poslední loading
              </Button>
            </div>
          </TabExample>
          <TabCode>{codeUsage}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
