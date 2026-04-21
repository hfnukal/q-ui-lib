import { component$ } from "@builder.io/qwik";
import { WebHero } from "~/components/ui/hero";
import { CodeExample, Desc, TabExample, TabCode } from "~/components/demo/codeexample";

export default component$(() => {
  return (
    <div class="space-y-10">
      <h1 class="text-title-2 text-label">Web — hero</h1>
      <CodeExample>
        <Desc>Úvodní blok s nadpisem, obrázkem a výzvou k akci.</Desc>
        <TabExample>
          <WebHero
            eyebrow="Ukázka"
            title="Stavíme weby, které prodávají"
            subtitle="Tokeny z design systému a rychlé načítání."
            image={{
              src: "https://picsum.photos/seed/qhero/960/640",
              alt: "Ilustrace",
            }}
            cta={{ label: "Kontakt", href: "#contact" }}
            ctaSecondary={{ label: "Portfolio", href: "#portfolio" }}
          />
        </TabExample>
        <TabCode>{`<WebHero
  eyebrow="Ukázka"
  title="Stavíme weby, které prodávají"
  subtitle="…"
  image={{ src: "…", alt: "…" }}
  cta={{ label: "Kontakt", href: "#contact" }}
  ctaSecondary={{ label: "Portfolio", href: "#portfolio" }}
/>`}</TabCode>
      </CodeExample>
    </div>
  );
});
