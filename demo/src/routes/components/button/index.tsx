import { $, component$ } from "@builder.io/qwik";
import { LuMail } from "@qwikest/icons/lucide";
import { CodeExample } from "~/components/demo/codeexample";
import { Button } from "~/components/ui/button";

const noop = $(() => {});

const codeBasic = `import { $, component$ } from "@builder.io/qwik";
import { Button } from "~/components/ui/button";

export default component$(() => (
  <Button
    onClick$={$(() => {
      alert("Button clicked");
    })}
  >
    Click me
  </Button>
));`;

const codeVariants = `import { Button } from "~/components/ui/button";

<>
  <Button variant="primary">Primary</Button>
  <Button variant="secondary">Secondary</Button>
  <Button variant="danger">Danger</Button>
</>`;

const codeSizes = `import { Button } from "~/components/ui/button";

<>
  <Button size="sm">Small</Button>
  <Button size="md">Medium</Button>
  <Button size="lg">Large</Button>
</>`;

const codeDisabled = `import { Button } from "~/components/ui/button";

<>
  <Button>Enabled</Button>
  <Button disabled>Disabled</Button>
</>`;

const codeWithIcon = `import { LuMail } from "@qwikest/icons/lucide";
import { Button } from "~/components/ui/button";

<Button variant="secondary" class="gap-2">
  <LuMail aria-hidden="true" class="size-4" />
  Napsat
</Button>`;

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Button</h1>
        <p class="mt-2 max-w-prose text-body text-secondary-label">
          Tlačítko z{" "}
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1 text-label">
            components/button
          </code>
          — obsah předávej jako děti (default <code class="text-caption-1">Slot</code>), varianty, velikosti a{" "}
          <code class="text-caption-1">disabled</code>.
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Základní použití</h2>
        <CodeExample code={codeBasic}>
          <Button
            onClick$={$(() => {
              alert("Button clicked");
            })}
          >
            Click me
          </Button>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Varianty</h2>
        <p class="text-callout text-secondary-label">
          <code class="text-caption-1">primary</code> (výchozí),{" "}
          <code class="text-caption-1">secondary</code>, <code class="text-caption-1">danger</code>.
        </p>
        <CodeExample code={codeVariants}>
          <div class="flex flex-wrap items-center gap-3">
            <Button variant="primary" onClick$={noop}>
              Primary
            </Button>
            <Button variant="secondary" onClick$={noop}>
              Secondary
            </Button>
            <Button variant="danger" onClick$={noop}>
              Danger
            </Button>
          </div>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Velikosti</h2>
        <p class="text-callout text-secondary-label">
          Prop <code class="text-caption-1">size</code>: <code class="text-caption-1">sm</code>,{" "}
          <code class="text-caption-1">md</code> (výchozí), <code class="text-caption-1">lg</code> — typografické
          tokeny z COLORS.md.
        </p>
        <CodeExample code={codeSizes}>
          <div class="flex flex-wrap items-center gap-3">
            <Button size="sm" onClick$={noop}>
              Small
            </Button>
            <Button size="md" onClick$={noop}>
              Medium
            </Button>
            <Button size="lg" onClick$={noop}>
              Large
            </Button>
          </div>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Velikost × varianta</h2>
        <p class="text-callout text-secondary-label">Stejná mřížka pro všechny kombinace (náhled bez kódu).</p>
        <div class="rounded-lg border border-separator-opaque bg-surface-raised p-4">
          <div class="flex flex-col gap-4">
            <div class="flex flex-wrap items-center gap-2">
              <span class="w-24 shrink-0 text-caption-1 text-tertiary-label">Primary</span>
              <Button size="sm" variant="primary" onClick$={noop}>
                SM
              </Button>
              <Button size="md" variant="primary" onClick$={noop}>
                MD
              </Button>
              <Button size="lg" variant="primary" onClick$={noop}>
                LG
              </Button>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <span class="w-24 shrink-0 text-caption-1 text-tertiary-label">Secondary</span>
              <Button size="sm" variant="secondary" onClick$={noop}>
                SM
              </Button>
              <Button size="md" variant="secondary" onClick$={noop}>
                MD
              </Button>
              <Button size="lg" variant="secondary" onClick$={noop}>
                LG
              </Button>
            </div>
            <div class="flex flex-wrap items-center gap-2">
              <span class="w-24 shrink-0 text-caption-1 text-tertiary-label">Danger</span>
              <Button size="sm" variant="danger" onClick$={noop}>
                SM
              </Button>
              <Button size="md" variant="danger" onClick$={noop}>
                MD
              </Button>
              <Button size="lg" variant="danger" onClick$={noop}>
                LG
              </Button>
            </div>
          </div>
        </div>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">S ikonou (Lucide)</h2>
        <p class="text-callout text-secondary-label">
          Import z{" "}
          <code class="text-caption-1">@qwikest/icons/lucide</code> — komponenty s prefixem{" "}
          <code class="text-caption-1">Lu</code>.
        </p>
        <CodeExample code={codeWithIcon}>
          <div class="flex flex-wrap items-center gap-3">
            <Button variant="secondary" class="gap-2" onClick$={noop}>
              <LuMail aria-hidden="true" class="size-4" />
              Napsat
            </Button>
          </div>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Disabled</h2>
        <CodeExample code={codeDisabled}>
          <div class="flex flex-wrap items-center gap-3">
            <Button onClick$={noop}>Enabled</Button>
            <Button disabled onClick$={noop}>
              Disabled
            </Button>
            <Button variant="secondary" disabled>
              Disabled secondary
            </Button>
          </div>
        </CodeExample>
      </section>
    </div>
  );
});
