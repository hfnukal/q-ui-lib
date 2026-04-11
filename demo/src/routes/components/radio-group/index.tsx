import { component$, useSignal } from "@builder.io/qwik";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";
import { RadioGroup } from "~/components/ui/radio-group";

const codeBasic = `import { RadioGroup } from "~/components/ui/radio-group";

<RadioGroup.Root name="plan">
  <RadioGroup.Item value="free" label="Free" />
  <RadioGroup.Item value="pro" label="Pro" />
  <RadioGroup.Item value="enterprise" label="Enterprise" />
</RadioGroup.Root>`;

const codeHorizontal = `<RadioGroup.Root name="size" class="flex-row flex-wrap gap-4">
  <RadioGroup.Item value="sm" label="Small" />
  <RadioGroup.Item value="md" label="Medium" />
  <RadioGroup.Item value="lg" label="Large" />
</RadioGroup.Root>`;

const codeDisabled = `<RadioGroup.Root name="tier">
  <RadioGroup.Item value="basic" label="Basic" />
  <RadioGroup.Item value="plus" label="Plus" disabled />
  <RadioGroup.Item value="premium" label="Premium" />
</RadioGroup.Root>`;

export default component$(() => {
  const plan = useSignal("pro");

  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">RadioGroup</h1>
        <p class="mt-2 max-w-prose text-body text-secondary-label">
          Skupina nativních{" "}
          <code class="rounded bg-fill-secondary px-1 py-0.5 text-caption-1 text-label">
            &lt;input type="radio"&gt;
          </code>{" "}
          s label. Sdílí <code class="text-caption-1">name</code> přes prop na
          každém <code class="text-caption-1">Item</code>.
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Základní použití</h2>

        <CodeExample>
          <Desc>Základní použití — viz ukázka níže.</Desc>
          <TabExample>
            <RadioGroup.Root name="plan">
              <RadioGroup.Item value="free" label="Free" />
              <RadioGroup.Item value="pro" label="Pro" defaultChecked />
              <RadioGroup.Item value="enterprise" label="Enterprise" />
            </RadioGroup.Root>
          </TabExample>
          <TabCode>{codeBasic}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Vodorovné rozložení</h2>

        <CodeExample>
          <Desc>
            Přidej{" "}
            <code class="text-caption-1">class="flex-row flex-wrap gap-4"</code>{" "}
            na Root.
          </Desc>
          <TabExample>
            <RadioGroup.Root name="size" class="flex-row flex-wrap gap-4">
              <RadioGroup.Item value="sm" label="Small" />
              <RadioGroup.Item value="md" label="Medium" defaultChecked />
              <RadioGroup.Item value="lg" label="Large" />
            </RadioGroup.Root>
          </TabExample>
          <TabCode>{codeHorizontal}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Disabled položka</h2>

        <CodeExample>
          <Desc>
            Jedna z položek může být nedostupná přes{" "}
            <code class="text-caption-1">disabled</code>.
          </Desc>
          <TabExample>
            <RadioGroup.Root name="tier">
              <RadioGroup.Item value="basic" label="Basic" defaultChecked />
              <RadioGroup.Item value="plus" label="Plus" disabled />
              <RadioGroup.Item value="premium" label="Premium" />
            </RadioGroup.Root>
          </TabExample>
          <TabCode>{codeDisabled}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
