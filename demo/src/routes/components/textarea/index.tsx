import { component$ } from "@builder.io/qwik";
import { CodeExample } from "~/components/demo/codeexample";
import { Label } from "~/components/ui/label";
import { Textarea } from "~/components/ui/textarea";

const codeBasic = `import { component$ } from "@builder.io/qwik";
import { Textarea } from "~/components/ui/textarea";

export default component$(() => (
  <Textarea placeholder="Napište zprávu…" rows={4} />
));`;

const codeWithLabel = `import { Textarea } from "~/components/ui/textarea";
import { Label } from "~/components/ui/label";

<div class="flex max-w-md flex-col gap-2">
  <Label for="msg">Zpráva</Label>
  <Textarea id="msg" name="message" placeholder="Obsah…" rows={5} />
</div>`;

const codeStates = `import { Textarea } from "~/components/ui/textarea";

<div class="flex max-w-md flex-col gap-3">
  <Textarea placeholder="Běžný stav" rows={3} />
  <Textarea disabled placeholder="Disabled" rows={3} />
  <Textarea readOnly value="Jen ke čtení" rows={3} />
</div>`;

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Textarea</h1>
        <p class="mt-2 max-w-prose text-body text-secondary-label">
          Nativní pole z{" "}
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1 text-label">
            components/textarea
          </code>
          — atributy HTML textarea (včetně <code class="text-caption-1">rows</code>,{" "}
          <code class="text-caption-1">name</code>, <code class="text-caption-1">value</code>) se předávají dál;
          výchozí vzhled odpovídá Inputu (COLORS.md). Vertikální změna velikosti:{" "}
          <code class="text-caption-1">resize-y</code>.
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Základ</h2>
        <CodeExample code={codeBasic}>
          <div class="max-w-md">
            <Textarea placeholder="Napište zprávu…" rows={4} />
          </div>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Se štítkem</h2>
        <CodeExample code={codeWithLabel}>
          <div class="flex max-w-md flex-col gap-2">
            <Label for="demo-textarea-msg">Zpráva</Label>
            <Textarea id="demo-textarea-msg" name="message" placeholder="Obsah…" rows={5} />
          </div>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Stavy</h2>
        <p class="text-callout text-secondary-label">
          <code class="text-caption-1">disabled</code> a <code class="text-caption-1">readOnly</code> — chybové stavy
          řeš přes <code class="text-caption-1">class</code> nebo obal.
        </p>
        <CodeExample code={codeStates}>
          <div class="flex max-w-md flex-col gap-3">
            <Textarea placeholder="Běžný stav" rows={3} />
            <Textarea disabled placeholder="Disabled" rows={3} />
            <Textarea readOnly value="Jen ke čtení" rows={3} />
          </div>
        </CodeExample>
      </section>
    </div>
  );
});
