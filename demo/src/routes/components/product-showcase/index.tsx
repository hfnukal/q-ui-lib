import { component$ } from "@builder.io/qwik";
import { JabkoProductShowcase } from "~/components/ui/product-showcase";
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
        <h1 class="text-title-2 text-label">Jabko — produktový blok</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Sekce „tile“ vedle sebe</h2>
        <CodeExample>
          <Desc>Dvousloupcový blok s obrázkem a textem — typické dlaždice na apple.com.</Desc>
          <TabExample>
            <JabkoProductShowcase
              align="image-right"
              eyebrow="MacBook Air"
              title="Létá. A přitom stojí pevně na zemi."
              description="Čip M3, tenký profil, celodenní výdrž baterie."
              image={{ src: "https://picsum.photos/seed/mac/960/720", alt: "Notebook" }}
              links={[
                { label: "Zjistit více", href: "#" },
                { label: "Koupit", href: "#" },
              ]}
            />
          </TabExample>
          <TabCode>{`import { JabkoProductShowcase } from "~/components/ui/product-showcase";

<JabkoProductShowcase
  align="image-right"
  eyebrow="MacBook Air"
  title="Létá. A přitom stojí pevně na zemi."
  description="Čip M3, tenký profil, celodenní výdrž baterie."
  image={{ src: "https://picsum.photos/seed/mac/960/720", alt: "Notebook" }}
  links={[
    { label: "Zjistit více", href: "#" },
    { label: "Koupit", href: "#" },
  ]}
/>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
