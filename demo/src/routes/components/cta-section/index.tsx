import { component$ } from "@builder.io/qwik";
import { WebCtaSection } from "~/components/ui/cta-section";
import { CodeExample, Desc, TabExample, TabCode } from "~/components/demo/codeexample";

export default component$(() => {
  return (
    <div class="space-y-10">
      <h1 class="text-title-2 text-label">Web — CTA pruh</h1>
      <CodeExample>
        <Desc>Výrazná výzva k akci; varianty <code class="text-caption-1">default</code> a <code class="text-caption-1">accent</code>.</Desc>
        <TabExample>
          <WebCtaSection
            title="Připraveni začít?"
            description="Napište nám — odpovíme brzy."
            ctaLabel="Kontaktovat"
            ctaHref="#contact"
            variant="accent"
          />
        </TabExample>
        <TabCode>{`<WebCtaSection
  title="Připraveni začít?"
  description="…"
  ctaLabel="Kontaktovat"
  ctaHref="#contact"
  variant="accent"
/>`}</TabCode>
      </CodeExample>
    </div>
  );
});
