import { component$ } from "@builder.io/qwik";
import { WebFeatures } from "~/components/ui/features";
import { CodeExample, Desc, TabExample, TabCode } from "~/components/demo/codeexample";

export default component$(() => {
  return (
    <div class="space-y-10">
      <h1 class="text-title-2 text-label">Web — vlastnosti</h1>
      <CodeExample>
        <Desc>Mřížka karet s ikonou (emoji), nadpisem a popisem.</Desc>
        <TabExample>
          <WebFeatures
            title="Co nabízíme"
            subtitle="Tři pilíře."
            columns={3}
            items={[
              { icon: "⚡", title: "Rychlost", description: "Optimalizovaný výkon." },
              { icon: "🔒", title: "Bezpečnost", description: "Ověřené postupy." },
              { icon: "♿", title: "A11y", description: "Srozumitelná navigace." },
            ]}
          />
        </TabExample>
        <TabCode>{`<WebFeatures title="…" items={[…]} columns={3} />`}</TabCode>
      </CodeExample>
    </div>
  );
});
