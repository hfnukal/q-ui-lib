import { component$ } from "@builder.io/qwik";
import { WebHeader } from "~/components/ui/header";
import { CodeExample, Desc, TabExample, TabCode } from "~/components/demo/codeexample";

export default component$(() => {
  return (
    <div class="space-y-10">
      <h1 class="text-title-2 text-label">Web — hlavička</h1>
      <CodeExample>
        <Desc>Logo / název značky, hlavní navigace a volitelné CTA.</Desc>
        <TabExample>
          <WebHeader
            brand="Demo"
            navItems={[
              { label: "Služby", href: "#features" },
              { label: "Kontakt", href: "#contact" },
            ]}
            cta={{ label: "Začít", href: "#cta" }}
          />
        </TabExample>
        <TabCode>{`<WebHeader
  brand="Demo"
  navItems={[
    { label: "Služby", href: "#features" },
    { label: "Kontakt", href: "#contact" },
  ]}
  cta={{ label: "Začít", href: "#cta" }}
/>`}</TabCode>
      </CodeExample>
    </div>
  );
});
