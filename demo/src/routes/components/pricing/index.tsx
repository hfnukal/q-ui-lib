import { component$ } from "@builder.io/qwik";
import { WebPricing } from "~/components/ui/pricing";
import { CodeExample, Desc, TabExample, TabCode } from "~/components/demo/codeexample";

export default component$(() => {
  return (
    <div class="space-y-10">
      <h1 class="text-title-2 text-label">Web — ceník</h1>
      <CodeExample>
        <Desc>Porovnání balíčků; jeden lze zvýraznit jako doporučený.</Desc>
        <TabExample>
          <WebPricing
            title="Ceník"
            plans={[
              {
                name: "Start",
                price: "9 900 Kč",
                period: "jednorázově",
                features: ["Landing", "Formulář", "Základní SEO"],
                ctaLabel: "Poptat",
                ctaHref: "#",
              },
              {
                name: "Pro",
                price: "29 900 Kč",
                period: "jednorázově",
                features: ["Vše ze Start", "Blog", "Analytika"],
                ctaLabel: "Domluvit hovor",
                ctaHref: "#",
                highlighted: true,
              },
            ]}
          />
        </TabExample>
        <TabCode>{`<WebPricing title="Ceník" plans={[…]} />`}</TabCode>
      </CodeExample>
    </div>
  );
});
