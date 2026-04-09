import { component$ } from "@builder.io/qwik";
import { CodeExample } from "~/components/demo/codeexample";
import { ToggleGroup, ToggleGroupGroup } from "~/components/ui/toggle-group";

const itemsSingle = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" },
];

const itemsMulti = [
  { value: "bold", label: "Bold" },
  { value: "italic", label: "Italic" },
  { value: "underline", label: "Underline" },
];

const codeGroup = `import { ToggleGroupGroup } from "~/components/ui/toggle-group";

const items = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" },
];

<ToggleGroupGroup items={items} defaultValue="center" />`;

const codeMulti = `import { ToggleGroupGroup } from "~/components/ui/toggle-group";

const items = [
  { value: "bold", label: "Bold" },
  { value: "italic", label: "Italic" },
  { value: "underline", label: "Underline" },
];

<ToggleGroupGroup multiple items={items} defaultValue={["bold", "italic"]} />`;

const codeVertical = `import { ToggleGroupGroup } from "~/components/ui/toggle-group";

<ToggleGroupGroup
  orientation="vertical"
  items={items}
  defaultValue="left"
/>`;

const codeCompound = `import { ToggleGroup } from "~/components/ui/toggle-group";

<ToggleGroup.Root multiple value={["a"]} aria-label="Tools">
  <ToggleGroup.Item value="a">A</ToggleGroup.Item>
  <ToggleGroup.Item value="b">B</ToggleGroup.Item>
</ToggleGroup.Root>`;

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Toggle group</h1>
        <p class="mt-2 max-w-prose text-body text-secondary-label">
          Jedna nebo více současných voleb v rámci skupiny (WAI-ARIA toggle button pattern). Chování z{" "}
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1 text-label">
            @qwik-ui/headless
          </code>
          , vzhled jako u tab triggerů (tokeny z COLORS.md).
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Single — ToggleGroupGroup</h2>
        <p class="text-callout text-secondary-label">
          V jednu chvíli je aktivní nejvýše jedna položka; šipky mění fokus podle orientace.
        </p>
        <CodeExample code={codeGroup}>
          <ToggleGroupGroup items={itemsSingle} defaultValue="center" aria-label="Zarovnání textu" />
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Multiple</h2>
        <CodeExample code={codeMulti}>
          <ToggleGroupGroup
            multiple
            items={itemsMulti}
            defaultValue={["bold", "italic"]}
            aria-label="Styl textu"
          />
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Vertical</h2>
        <CodeExample code={codeVertical}>
          <ToggleGroupGroup
            orientation="vertical"
            items={itemsSingle}
            defaultValue="left"
            aria-label="Možnosti (svisle)"
          />
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Compound API</h2>
        <p class="text-callout text-secondary-label">
          Pro řízený stav použij <code class="text-caption-1">bind:value</code> na{" "}
          <code class="text-caption-1">ToggleGroup.Root</code> (viz dokumentace Qwik UI Toggle Group).
        </p>
        <CodeExample code={codeCompound}>
          <ToggleGroup.Root multiple value={["bold"]} aria-label="Nástroje (compound)">
            <ToggleGroup.Item value="bold">Bold</ToggleGroup.Item>
            <ToggleGroup.Item value="italic">Italic</ToggleGroup.Item>
            <ToggleGroup.Item value="underline">Underline</ToggleGroup.Item>
          </ToggleGroup.Root>
        </CodeExample>
      </section>
    </div>
  );
});
