import { $, component$, useSignal } from "@builder.io/qwik";
import { CodeExample } from "~/components/demo/codeexample";
import { Pagination } from "~/components/ui/pagination";

const codeBasic = `import { $, component$, useSignal } from "@builder.io/qwik";
import { Pagination } from "~/components/ui/pagination";

export default component$(() => {
  const page = useSignal(1);
  return (
    <Pagination
      selectedPage={page.value}
      totalPages={10}
      onPageChange$={$((p) => {
        page.value = p;
      })}
    />
  );
});`;

const codeSiblings = `import { Pagination } from "~/components/ui/pagination";

<Pagination
  selectedPage={page}
  totalPages={24}
  siblingCount={2}
  onPageChange$={onChange}
/>`;

const codeArrows = `import { Pagination } from "~/components/ui/pagination";

<Pagination
  selectedPage={page}
  totalPages={8}
  customArrowTexts={{ previous: "Zpět", next: "Vpřed" }}
  onPageChange$={onChange}
/>`;

export default component$(() => {
  const page1 = useSignal(1);
  const page2 = useSignal(5);
  const page3 = useSignal(1);

  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Pagination</h1>
        <p class="mt-2 max-w-prose text-body text-secondary-label">
          Obal nad{" "}
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1 text-label">
            @qwik-ui/headless
          </code>{" "}
          <code class="text-caption-1">Pagination</code> — výběr stránky, elipsy a šipky; stav stránky drž v signálu
          nebo URL.
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Základní použití</h2>
        <p class="text-callout text-secondary-label">
          <code class="text-caption-1">selectedPage</code>, <code class="text-caption-1">totalPages</code>,{" "}
          <code class="text-caption-1">onPageChange$</code>. Aktuální stránka:{" "}
          <span class="font-medium text-label">{page1.value}</span>.
        </p>
        <CodeExample code={codeBasic}>
          <Pagination
            selectedPage={page1.value}
            totalPages={10}
            onPageChange$={$((p) => {
              page1.value = p;
            })}
          />
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Více sousedních stránek</h2>
        <p class="text-callout text-secondary-label">
          Prop <code class="text-caption-1">siblingCount</code> (výchozí 1) rozšiřuje okno kolem aktivní stránky.
        </p>
        <CodeExample code={codeSiblings}>
          <Pagination
            selectedPage={page2.value}
            totalPages={24}
            siblingCount={2}
            onPageChange$={$((p) => {
              page2.value = p;
            })}
          />
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Vlastní popisky šipek</h2>
        <p class="text-callout text-secondary-label">
          <code class="text-caption-1">customArrowTexts</code> — krátké texty místo výchozích PREV / NEXT.
        </p>
        <CodeExample code={codeArrows}>
          <Pagination
            selectedPage={page3.value}
            totalPages={8}
            customArrowTexts={{ previous: "Zpět", next: "Vpřed" }}
            onPageChange$={$((p) => {
              page3.value = p;
            })}
          />
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Zakázáno</h2>
        <CodeExample
          code={`<Pagination
  selectedPage={3}
  totalPages={10}
  disabled
  onPageChange$={noop}
/>`}
        >
          <Pagination selectedPage={3} totalPages={10} disabled onPageChange$={$(() => {})} />
        </CodeExample>
      </section>
    </div>
  );
});
