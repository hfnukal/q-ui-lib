import { component$ } from "@builder.io/qwik";
import { Accordion } from "~/components/ui/accordion";
import { AccordionList } from "~/components/ui/accordion";
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
        <h1 class="text-title-2 text-label">Accordion</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Compound API (střídavě `Trigger` / `Content`)</h2>
        <CodeExample>
          <Desc>Compound API (střídavě Trigger / Content) — viz ukázka níže.</Desc>
          <TabExample>
            <Accordion.Root>
              <Accordion.Trigger>Základní informace</Accordion.Trigger>
              <Accordion.Content>
                Stručný úvod do tématu a odkazy na další zdroje.
              </Accordion.Content>
              <Accordion.Trigger>Pokročilé možnosti</Accordion.Trigger>
              <Accordion.Content>
                Rozšířená nastavení a tipy pro každodenní použití.
              </Accordion.Content>
            </Accordion.Root>
          </TabExample>
          <TabCode>{`import { Accordion } from "~/components/ui/accordion";

<Accordion.Root>
  <Accordion.Trigger>Základní informace</Accordion.Trigger>
  <Accordion.Content>
    Stručný úvod do tématu a odkazy na další zdroje.
  </Accordion.Content>
  <Accordion.Trigger>Pokročilé možnosti</Accordion.Trigger>
  <Accordion.Content>
    Rozšířená nastavení a tipy pro každodenní použití.
  </Accordion.Content>
</Accordion.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Single open panel</h2>
        <CodeExample>
          <Desc>Single open panel — viz ukázka níže.</Desc>
          <TabExample>
            {(() => {
              const items = [
                {
                  value: "basics",
                  title: "Co je Qwik?",
                  content: "Framework zaměřený na okamžité načtení a minimální JavaScript na klientu.",
                },
                {
                  value: "resumability",
                  title: "Co je resumability?",
                  content: "Server může obnovit stav aplikace bez velkého hydration bundle.",
                },
                {
                  value: "signals",
                  title: "Reaktivita",
                  content: "Jemně granularní signály pro efektivní aktualizace UI.",
                },
              ];
              return (
                <AccordionList items={items} />
              );
            })()}
          </TabExample>
          <TabCode>{`import { AccordionList } from "~/components/ui/accordion";

const items = [
  {
    value: "basics",
    title: "Co je Qwik?",
    content: "Framework zaměřený na okamžité načtení a minimální JavaScript na klientu.",
  },
  {
    value: "resumability",
    title: "Co je resumability?",
    content: "Server může obnovit stav aplikace bez velkého hydration bundle.",
  },
  {
    value: "signals",
    title: "Reaktivita",
    content: "Jemně granularní signály pro efektivní aktualizace UI.",
  },
];

<AccordionList items={items} />`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Multiple open panels</h2>
        <CodeExample>
          <Desc>Multiple open panels — viz ukázka níže.</Desc>
          <TabExample>
            {(() => {
              const items = [
                {
                  value: "basics",
                  title: "Co je Qwik?",
                  content: "Framework zaměřený na okamžité načtení a minimální JavaScript na klientu.",
                },
                {
                  value: "resumability",
                  title: "Co je resumability?",
                  content: "Server může obnovit stav aplikace bez velkého hydration bundle.",
                },
                {
                  value: "signals",
                  title: "Reaktivita",
                  content: "Jemně granularní signály pro efektivní aktualizace UI.",
                },
              ];
              return (
                <AccordionList items={items} multiple />
              );
            })()}
          </TabExample>
          <TabCode>{`import { AccordionList } from "~/components/ui/accordion";

const items = [
  {
    value: "basics",
    title: "Co je Qwik?",
    content: "Framework zaměřený na okamžité načtení a minimální JavaScript na klientu.",
  },
  {
    value: "resumability",
    title: "Co je resumability?",
    content: "Server může obnovit stav aplikace bez velkého hydration bundle.",
  },
  {
    value: "signals",
    title: "Reaktivita",
    content: "Jemně granularní signály pro efektivní aktualizace UI.",
  },
];

<AccordionList items={items} multiple />`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
