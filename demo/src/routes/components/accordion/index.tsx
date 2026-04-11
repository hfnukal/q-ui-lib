import { component$ } from "@builder.io/qwik";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";
import { Accordion, AccordionList } from "~/components/ui/accordion";

const sampleItems = [
  {
    value: "basics",
    title: "What is Qwik?",
    content:
      "Qwik is a web framework that resumes where the server left off, loading JavaScript only when needed for interactivity.",
  },
  {
    value: "resumability",
    title: "Resumability",
    content:
      "Instead of hydrating the whole tree, Qwik serializes application state so the client can continue without replaying all setup work.",
  },
  {
    value: "signals",
    title: "Signals",
    content:
      "Fine-grained reactivity keeps updates small and predictable, which pairs well with lazy-loaded code and streaming.",
  },
];

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Accordion</h1>
        <p class="mt-2 max-w-prose text-sm text-slate-600">
          Accessible accordion from{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
            components/accordion
          </code>
          , built on @qwik-ui/headless.
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">
          Compound API (střídavě <code class="text-sm">Trigger</code> /{" "}
          <code class="text-sm">Content</code>)
        </h2>

        <CodeExample>
          <Desc>
            Compound API (střídavě Trigger / Content) — viz ukázka níže.
          </Desc>
          <TabExample>
            <Accordion.Root>
              <Accordion.Trigger>{sampleItems[0]!.title}</Accordion.Trigger>
              <Accordion.Content>
                <p>{sampleItems[0]!.content}</p>
              </Accordion.Content>
              <Accordion.Trigger>{sampleItems[1]!.title}</Accordion.Trigger>
              <Accordion.Content>
                <p>{sampleItems[1]!.content}</p>
              </Accordion.Content>
              <Accordion.Trigger>{sampleItems[2]!.title}</Accordion.Trigger>
              <Accordion.Content>
                <p>{sampleItems[2]!.content}</p>
              </Accordion.Content>
            </Accordion.Root>
          </TabExample>
          <TabCode>
            {`import { Accordion } from "~/components/ui/accordion";

<Accordion.Root>
  <Accordion.Trigger>a</Accordion.Trigger>
  <Accordion.Content>aaa</Accordion.Content>
  <Accordion.Trigger>b</Accordion.Trigger>
  <Accordion.Content>bbb</Accordion.Content>
</Accordion.Root>`}
          </TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">Single open panel</h2>

        <CodeExample>
          <Desc>Single open panel — viz ukázka níže.</Desc>
          <TabExample>
            <AccordionList items={sampleItems} />
          </TabExample>
          <TabCode>
            {`import { AccordionList } from "~/components/ui/accordion";

const items = [
  { value: "basics", title: "What is Qwik?", content: "…" },
  // …
];

<AccordionList items={items} />`}
          </TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">Multiple open panels</h2>

        <CodeExample>
          <Desc>Multiple open panels — viz ukázka níže.</Desc>
          <TabExample>
            <AccordionList items={sampleItems} multiple />
          </TabExample>
          <TabCode>
            {`import { AccordionList } from "~/components/ui/accordion";

const items = [
  { value: "basics", title: "What is Qwik?", content: "…" },
  // …
];

<AccordionList items={items} multiple />`}
          </TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
