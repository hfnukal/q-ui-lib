import { component$ } from "@builder.io/qwik";
import { CodeExample } from "~/components/demo/codeexample";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

const codeBasic = `import { component$ } from "@builder.io/qwik";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

export default component$(() => (
  <div class="flex flex-col gap-2">
    <Label for="demo-email">E-mail</Label>
    <Input id="demo-email" type="email" placeholder="you@example.com" />
  </div>
));`;

const codePeerDisabled = `import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

// V DOM musí být .peer dřív než Label (kvůli Tailwind peer-*).
<div class="grid grid-cols-1 gap-2">
  <Input
    id="demo-locked"
    disabled
    value="Nelze upravit"
    class="peer col-start-1 row-start-2"
  />
  <Label for="demo-locked" class="col-start-1 row-start-1">
    Uzamčené pole
  </Label>
</div>`;

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Label</h1>
        <p class="mt-2 max-w-prose text-body text-secondary-label">
          Popisek formuláře z{" "}
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1 text-label">
            components/label
          </code>
          — obal nad <code class="text-caption-1">@qwik-ui/headless</code>{" "}
          <code class="text-caption-1">Label</code> s typografickými tokeny (COLORS.md).
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">S polem</h2>
        <p class="text-callout text-secondary-label">
          Prop <code class="text-caption-1">for</code> (nebo <code class="text-caption-1">htmlFor</code>) spáruje štítek s{" "}
          <code class="text-caption-1">id</code> vstupu.
        </p>
        <CodeExample code={codeBasic}>
          <div class="flex max-w-md flex-col gap-2">
            <Label for="demo-email">E-mail</Label>
            <Input id="demo-email" type="email" placeholder="you@example.com" />
          </div>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Peer + disabled</h2>
        <p class="text-callout text-secondary-label">
          Třída <code class="text-caption-1">peer</code> patří na vstup; <code class="text-caption-1">peer-disabled:*</code> na štítku reaguje jen když je v DOM vstup{" "}
          <em>před</em> štítkem — layout můžeš srovnat gridem (řádky 2 / 1).
        </p>
        <CodeExample code={codePeerDisabled}>
          <div class="grid max-w-md grid-cols-1 gap-2">
            <Input
              id="demo-locked"
              disabled
              value="Nelze upravit"
              class="peer col-start-1 row-start-2"
            />
            <Label for="demo-locked" class="col-start-1 row-start-1">
              Uzamčené pole
            </Label>
          </div>
        </CodeExample>
      </section>
    </div>
  );
});
