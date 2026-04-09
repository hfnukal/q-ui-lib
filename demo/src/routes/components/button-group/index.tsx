import { $, component$ } from "@builder.io/qwik";
import { CodeExample } from "~/components/demo/codeexample";
import { Button } from "~/components/ui/button";
import { ButtonGroup } from "~/components/ui/button-group";

const noop = $(() => {});

const codeHorizontal = `import { Button } from "~/components/ui/button";
import { ButtonGroup } from "~/components/ui/button-group";

<ButtonGroup aria-label="Text actions">
  <Button variant="secondary" onClick$={...}>Left</Button>
  <Button variant="secondary" onClick$={...}>Center</Button>
  <Button variant="secondary" onClick$={...}>Right</Button>
</ButtonGroup>`;

const codeVertical = `import { Button } from "~/components/ui/button";
import { ButtonGroup } from "~/components/ui/button-group";

<ButtonGroup orientation="vertical" aria-label="Stack">
  <Button variant="secondary" onClick$={...}>One</Button>
  <Button variant="secondary" onClick$={...}>Two</Button>
</ButtonGroup>`;

const codePrimary = `import { Button } from "~/components/ui/button";
import { ButtonGroup } from "~/components/ui/button-group";

<ButtonGroup aria-label="Modes">
  <Button variant="primary" onClick$={...}>A</Button>
  <Button variant="primary" onClick$={...}>B</Button>
</ButtonGroup>`;

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Button group</h1>
        <p class="mt-2 max-w-prose text-body text-secondary-label">
          Skupina tlačítek z{" "}
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1 text-label">
            components/button-group
          </code>
          — přímí potomci sdílejí jeden stín a svislé okraje se překrývají. Pro segmentovaný vzhled se hodí{" "}
          <code class="text-caption-1">Button</code> s <code class="text-caption-1">variant=&quot;secondary&quot;</code>.
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Vodorovně</h2>
        <CodeExample code={codeHorizontal}>
          <ButtonGroup aria-label="Ukázka vodorovné skupiny">
            <Button variant="secondary" onClick$={noop}>
              Left
            </Button>
            <Button variant="secondary" onClick$={noop}>
              Center
            </Button>
            <Button variant="secondary" onClick$={noop}>
              Right
            </Button>
          </ButtonGroup>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Svisle</h2>
        <p class="text-callout text-secondary-label">
          Prop <code class="text-caption-1">orientation=&quot;vertical&quot;</code>.
        </p>
        <CodeExample code={codeVertical}>
          <ButtonGroup orientation="vertical" aria-label="Ukázka svislé skupiny">
            <Button variant="secondary" onClick$={noop}>
              One
            </Button>
            <Button variant="secondary" onClick$={noop}>
              Two
            </Button>
            <Button variant="secondary" onClick$={noop}>
              Three
            </Button>
          </ButtonGroup>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Primární varianta</h2>
        <p class="text-callout text-secondary-label">
          Stejné sloučení okrajů funguje i u <code class="text-caption-1">primary</code> /{" "}
          <code class="text-caption-1">danger</code>.
        </p>
        <CodeExample code={codePrimary}>
          <ButtonGroup aria-label="Primární skupina">
            <Button variant="primary" onClick$={noop}>
              A
            </Button>
            <Button variant="primary" onClick$={noop}>
              B
            </Button>
            <Button variant="primary" onClick$={noop}>
              C
            </Button>
          </ButtonGroup>
        </CodeExample>
      </section>
    </div>
  );
});
