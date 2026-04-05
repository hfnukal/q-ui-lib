import { component$ } from "@builder.io/qwik";
import { AccordionList } from "@components/accordion";

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
        <h2 class="text-lg font-medium text-slate-800">Single open panel</h2>
        <AccordionList items={sampleItems} />
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">
          Multiple open panels
        </h2>
        <AccordionList items={sampleItems} multiple />
      </section>
    </div>
  );
});
