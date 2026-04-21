import { component$ } from "@builder.io/qwik";
import { WebPortfolio } from "~/components/ui/portfolio";
import { CodeExample, Desc, TabExample, TabCode } from "~/components/demo/codeexample";

export default component$(() => {
  return (
    <div class="space-y-10">
      <h1 class="text-title-2 text-label">Web — portfolio</h1>
      <CodeExample>
        <Desc>Mřížka obrázků s titulkem a popisem.</Desc>
        <TabExample>
          <WebPortfolio
            title="Vybrané práce"
            columns={2}
            items={[
              {
                src: "https://picsum.photos/seed/p1/800/600",
                alt: "Projekt 1",
                title: "E-shop",
                caption: "Qwik, Stripe",
              },
              {
                src: "https://picsum.photos/seed/p2/800/600",
                alt: "Projekt 2",
                title: "Firemní web",
              },
            ]}
          />
        </TabExample>
        <TabCode>{`<WebPortfolio title="…" items={[…]} columns={2} />`}</TabCode>
      </CodeExample>
    </div>
  );
});
