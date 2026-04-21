import { component$ } from "@builder.io/qwik";
import { JabkoHeroSpotlight } from "~/components/ui/hero-spotlight";
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
        <h1 class="text-title-2 text-label">Jabko — hero spotlight</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Produktový úvodní blok</h2>
        <CodeExample>
          <Desc>Velká typografie, podnadpis a dvojice CTA jako „Zjistit více“ / „Koupit“.</Desc>
          <TabExample>
            <JabkoHeroSpotlight
              variant="dark"
              eyebrow="iPhone 16 Pro"
              title="Titanium."
              subtitle="Naprosto nový design a špičkové foto."
              primaryCta={{ label: "Zjistit více", href: "#learn" }}
              secondaryCta={{ label: "Koupit", href: "#buy" }}
            />
          </TabExample>
          <TabCode>{`import { JabkoHeroSpotlight } from "~/components/ui/hero-spotlight";

<JabkoHeroSpotlight
  variant="dark"
  eyebrow="iPhone 16 Pro"
  title="Titanium."
  subtitle="Naprosto nový design a špičkové foto."
  primaryCta={{ label: "Zjistit více", href: "#learn" }}
  secondaryCta={{ label: "Koupit", href: "#buy" }}
/>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
