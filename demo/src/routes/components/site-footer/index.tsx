import { component$ } from "@builder.io/qwik";
import { JabkoSiteFooter } from "~/components/ui/site-footer";
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
        <h1 class="text-title-2 text-label">Jabko — patička webu</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Sloupce odkazů a právní řádek</h2>
        <CodeExample>
          <Desc>Struktura podobná apple.com — několik sloupců, drobný text a právní odkazy.</Desc>
          <TabExample>
            <JabkoSiteFooter
              columns={[
                { title: "Nakupovat a naučit se", links: [{ label: "Obchod", href: "#" }] },
                { title: "Účet", links: [{ label: "Spravovat účet", href: "#" }] },
              ]}
              legal={[
                { label: "Zásady ochrany osobních údajů", href: "#" },
                { label: "Podmínky použití", href: "#" },
              ]}
              copyright="© 2026 Jabko Demo"
            />
          </TabExample>
          <TabCode>{`import { JabkoSiteFooter } from "~/components/ui/site-footer";

<JabkoSiteFooter
  columns={[
    { title: "Nakupovat a naučit se", links: [{ label: "Obchod", href: "#" }] },
    { title: "Účet", links: [{ label: "Spravovat účet", href: "#" }] },
  ]}
  legal={[
    { label: "Zásady ochrany osobních údajů", href: "#" },
    { label: "Podmínky použití", href: "#" },
  ]}
  copyright="© 2026 Jabko Demo"
/>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
