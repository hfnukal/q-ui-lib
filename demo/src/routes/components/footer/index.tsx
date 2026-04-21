import { component$ } from "@builder.io/qwik";
import { WebFooter } from "~/components/ui/footer";
import { CodeExample, Desc, TabExample, TabCode } from "~/components/demo/codeexample";

export default component$(() => {
  return (
    <div class="space-y-10">
      <h1 class="text-title-2 text-label">Web — patička</h1>
      <CodeExample>
        <Desc>Sloupce odkazů, kontakt, sociální sítě a právní řádky.</Desc>
        <TabExample>
          <WebFooter
            brand="Demo"
            tagline="Ukázková komponenta z q-ui-lib."
            columns={[
              { title: "Produkty", links: [{ label: "Ceník", href: "#" }] },
              { title: "Firma", links: [{ label: "O nás", href: "#" }] },
            ]}
            contact={{ email: "hello@example.com" }}
            social={[{ label: "Web", href: "https://example.com" }]}
            legal={[{ label: "GDPR", href: "#" }]}
            copyright="© 2026 Demo"
          />
        </TabExample>
        <TabCode>{`<WebFooter
  brand="Demo"
  columns={[…]}
  contact={{ email: "hello@example.com" }}
  legal={[…]}
  copyright="© 2026"
/>`}</TabCode>
      </CodeExample>
    </div>
  );
});
