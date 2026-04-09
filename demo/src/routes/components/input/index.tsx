import { component$ } from "@builder.io/qwik";
import { CodeExample } from "~/components/demo/codeexample";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

const codeBasic = `import { component$ } from "@builder.io/qwik";
import { Input } from "~/components/ui/input";

export default component$(() => (
  <Input type="text" placeholder="Zadejte text…" />
));`;

const codeWithLabel = `import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

<div class="flex max-w-md flex-col gap-2">
  <Label for="user-email">E-mail</Label>
  <Input id="user-email" type="email" name="email" placeholder="you@example.com" />
</div>`;

const codeStates = `import { Input } from "~/components/ui/input";

<div class="flex max-w-md flex-col gap-3">
  <Input placeholder="Běžný stav" />
  <Input disabled value="Disabled" />
  <Input readOnly value="Jen ke čtení" />
</div>`;

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Input</h1>
        <p class="mt-2 max-w-prose text-body text-secondary-label">
          Nativní pole z{" "}
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1 text-label">
            components/input
          </code>
          — veškeré atributy HTML inputu (včetně <code class="text-caption-1">type</code>,{" "}
          <code class="text-caption-1">name</code>, <code class="text-caption-1">value</code>) se předávají dál;
          výchozí vzhled podle COLORS.md (shadcn-like).
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Základ</h2>
        <CodeExample code={codeBasic}>
          <div class="max-w-md">
            <Input type="text" placeholder="Zadejte text…" />
          </div>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Se štítkem</h2>
        <CodeExample code={codeWithLabel}>
          <div class="flex max-w-md flex-col gap-2">
            <Label for="demo-input-email">E-mail</Label>
            <Input
              id="demo-input-email"
              type="email"
              name="email"
              autoComplete="email"
              placeholder="you@example.com"
            />
          </div>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Stavy</h2>
        <p class="text-callout text-secondary-label">
          <code class="text-caption-1">disabled</code> a <code class="text-caption-1">readOnly</code> — vlastní chybové
          zobrazení řeš přes <code class="text-caption-1">class</code> nebo obal (např. border-destructive).
        </p>
        <CodeExample code={codeStates}>
          <div class="flex max-w-md flex-col gap-3">
            <Input placeholder="Běžný stav" />
            <Input disabled value="Disabled" />
            <Input readOnly value="Jen ke čtení" />
          </div>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Typ hesla</h2>
        <div class="max-w-md rounded-lg border border-separator-opaque bg-surface-raised p-4">
          <Label for="demo-input-pw" class="mb-2 block">
            Heslo
          </Label>
          <Input id="demo-input-pw" type="password" placeholder="••••••••" autoComplete="current-password" />
        </div>
      </section>
    </div>
  );
});
