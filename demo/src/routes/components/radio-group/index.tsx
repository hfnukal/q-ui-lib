import { component$ } from "@builder.io/qwik";
import { RadioGroup } from "~/components/ui/radio-group";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">RadioGroup</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Základní použití</h2>
        <CodeExample>
          <Desc>Základní použití — viz ukázka níže.</Desc>
          <TabExample>
            <RadioGroup.Root>
              <RadioGroup.Item name="plan" value="free" label="Free" />
              <RadioGroup.Item name="plan" value="pro" label="Pro" />
              <RadioGroup.Item name="plan" value="enterprise" label="Enterprise" />
            </RadioGroup.Root>
          </TabExample>
          <TabCode>{`import { RadioGroup } from "~/components/ui/radio-group";

<RadioGroup.Root>
  <RadioGroup.Item name="plan" value="free" label="Free" />
  <RadioGroup.Item name="plan" value="pro" label="Pro" />
  <RadioGroup.Item name="plan" value="enterprise" label="Enterprise" />
</RadioGroup.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Vodorovné rozložení</h2>
        <CodeExample>
          <Desc>Přidej <code class="text-caption-1">class="flex-row flex-wrap gap-4"</code> na Root.</Desc>
          <TabExample>
            <RadioGroup.Root class="flex-row flex-wrap gap-4">
              <RadioGroup.Item name="size" value="sm" label="Small" />
              <RadioGroup.Item name="size" value="md" label="Medium" />
              <RadioGroup.Item name="size" value="lg" label="Large" />
            </RadioGroup.Root>
          </TabExample>
          <TabCode>{`<RadioGroup.Root class="flex-row flex-wrap gap-4">
  <RadioGroup.Item name="size" value="sm" label="Small" />
  <RadioGroup.Item name="size" value="md" label="Medium" />
  <RadioGroup.Item name="size" value="lg" label="Large" />
</RadioGroup.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Disabled položka</h2>
        <CodeExample>
          <Desc>Jedna z položek může být nedostupná přes <code class="text-caption-1">disabled</code>.</Desc>
          <TabExample>
            <RadioGroup.Root>
              <RadioGroup.Item name="tier" value="basic" label="Basic" />
              <RadioGroup.Item name="tier" value="plus" label="Plus" disabled />
              <RadioGroup.Item name="tier" value="premium" label="Premium" />
            </RadioGroup.Root>
          </TabExample>
          <TabCode>{`<RadioGroup.Root>
  <RadioGroup.Item name="tier" value="basic" label="Basic" />
  <RadioGroup.Item name="tier" value="plus" label="Plus" disabled />
  <RadioGroup.Item name="tier" value="premium" label="Premium" />
</RadioGroup.Root>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
