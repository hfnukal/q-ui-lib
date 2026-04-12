import { $, component$, useSignal } from "@builder.io/qwik";
import { Pagination } from "~/components/ui/pagination";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";

export const _Example1 = component$(() => {
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
});

export const _Example2 = component$(() => {
  const page = useSignal(5);
  return (
    <Pagination
      selectedPage={page.value}
      totalPages={24}
      siblingCount={2}
      onPageChange$={$((p) => {
        page.value = p;
      })}
    />
  );
});

export const _Example3 = component$(() => {
  const page = useSignal(1);
  return (
    <Pagination
      selectedPage={page.value}
      totalPages={8}
      customArrowTexts={{ previous: "Zpět", next: "Vpřed" }}
      onPageChange$={$((p) => {
        page.value = p;
      })}
    />
  );
});

export const _Example4 = component$(() => (
  <Pagination
    selectedPage={3}
    totalPages={10}
    disabled
    onPageChange$={$(() => {})}
  />
));

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Pagination</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Základní použití</h2>
        <CodeExample>
          <Desc>Props <code class="text-caption-1">selectedPage</code>, <code class="text-caption-1">totalPages</code>, <code class="text-caption-1">onPageChange — aktuální stránka drž v </code>useSignal`.</Desc>
          <TabExample>
            <_Example1 />
          </TabExample>
          <TabCode>{`import { $, component$, useSignal } from "@builder.io/qwik";
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
});`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Více sousedních stránek</h2>
        <CodeExample>
          <Desc>Prop <code class="text-caption-1">siblingCount</code> (výchozí 1) rozšiřuje okno kolem aktivní stránky.</Desc>
          <TabExample>
            <_Example2 />
          </TabExample>
          <TabCode>{`import { $, component$, useSignal } from "@builder.io/qwik";
import { Pagination } from "~/components/ui/pagination";

export default component$(() => {
  const page = useSignal(5);
  return (
    <Pagination
      selectedPage={page.value}
      totalPages={24}
      siblingCount={2}
      onPageChange$={$((p) => {
        page.value = p;
      })}
    />
  );
});`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Vlastní popisky šipek</h2>
        <CodeExample>
          <Desc><code class="text-caption-1">customArrowTexts</code> — krátké texty místo výchozích PREV / NEXT.</Desc>
          <TabExample>
            <_Example3 />
          </TabExample>
          <TabCode>{`import { $, component$, useSignal } from "@builder.io/qwik";
import { Pagination } from "~/components/ui/pagination";

export default component$(() => {
  const page = useSignal(1);
  return (
    <Pagination
      selectedPage={page.value}
      totalPages={8}
      customArrowTexts={{ previous: "Zpět", next: "Vpřed" }}
      onPageChange$={$((p) => {
        page.value = p;
      })}
    />
  );
});`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Zakázáno</h2>
        <CodeExample>
          <Desc>Neinteraktivní stránkování přes prop <code class="text-caption-1">disabled</code>.</Desc>
          <TabExample>
            <_Example4 />
          </TabExample>
          <TabCode>{`import { $, component$ } from "@builder.io/qwik";
import { Pagination } from "~/components/ui/pagination";

export default component$(() => (
  <Pagination
    selectedPage={3}
    totalPages={10}
    disabled
    onPageChange$={$(() => {})}
  />
));`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
