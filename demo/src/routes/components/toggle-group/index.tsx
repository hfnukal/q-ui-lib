import { component$ } from "@builder.io/qwik";
import { ToggleGroupGroup } from "~/components/ui/toggle-group";
import { ToggleGroup } from "~/components/ui/toggle-group";
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
        <h1 class="text-title-2 text-label">ToggleGroup</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Single — ToggleGroupGroup</h2>
        <CodeExample>
          <Desc>V jednu chvíli je aktivní nejvýše jedna položka; šipky mění fokus podle orientace.</Desc>
          <TabExample>
            {(() => {
              const items = [
                { value: "left", label: "Left" },
                { value: "center", label: "Center" },
                { value: "right", label: "Right" },
              ];
              return (
                <ToggleGroupGroup items={items} defaultValue="center" />
              );
            })()}
          </TabExample>
          <TabCode>{`import { ToggleGroupGroup } from "~/components/ui/toggle-group";

const items = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" },
];

<ToggleGroupGroup items={items} defaultValue="center" />`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Multiple</h2>
        <CodeExample>
          <Desc>Více současných aktivních hodnot (např. tučné i kurzíva najednou).</Desc>
          <TabExample>
            {(() => {
              const items = [
                { value: "bold", label: "Bold" },
                { value: "italic", label: "Italic" },
                { value: "underline", label: "Underline" },
              ];
              return (
                <ToggleGroupGroup multiple items={items} defaultValue={["bold", "italic"]} />
              );
            })()}
          </TabExample>
          <TabCode>{`import { ToggleGroupGroup } from "~/components/ui/toggle-group";

const items = [
  { value: "bold", label: "Bold" },
  { value: "italic", label: "Italic" },
  { value: "underline", label: "Underline" },
];

<ToggleGroupGroup multiple items={items} defaultValue={["bold", "italic"]} />`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Vertical</h2>
        <CodeExample>
          <Desc>Svislé uspořádání přes <code class="text-caption-1">orientation="vertical"</code>.</Desc>
          <TabExample>
            {(() => {
              const items = [
                { value: "left", label: "Left" },
                { value: "center", label: "Center" },
                { value: "right", label: "Right" },
              ];
              return (
                <ToggleGroupGroup
                  orientation="vertical"
                  items={items}
                  defaultValue="left"
                />
              );
            })()}
          </TabExample>
          <TabCode>{`import { ToggleGroupGroup } from "~/components/ui/toggle-group";

const items = [
  { value: "left", label: "Left" },
  { value: "center", label: "Center" },
  { value: "right", label: "Right" },
];

<ToggleGroupGroup
  orientation="vertical"
  items={items}
  defaultValue="left"
/>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Compound API</h2>
        <CodeExample>
          <Desc>Pro řízený stav použij <code class="text-caption-1">bind:value</code> na <code class="text-caption-1">ToggleGroup.Root</code> (viz dokumentace Qwik UI Toggle Group).</Desc>
          <TabExample>
            <ToggleGroup.Root multiple value={["a"]} aria-label="Tools">
              <ToggleGroup.Item value="a">A</ToggleGroup.Item>
              <ToggleGroup.Item value="b">B</ToggleGroup.Item>
            </ToggleGroup.Root>
          </TabExample>
          <TabCode>{`import { ToggleGroup } from "~/components/ui/toggle-group";

<ToggleGroup.Root multiple value={["a"]} aria-label="Tools">
  <ToggleGroup.Item value="a">A</ToggleGroup.Item>
  <ToggleGroup.Item value="b">B</ToggleGroup.Item>
</ToggleGroup.Root>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
