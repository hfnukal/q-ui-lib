import { component$ } from "@builder.io/qwik";
import { JabkoRibbon } from "~/components/ui/ribbon";
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
        <h1 class="text-title-2 text-label">Jabko — promo lišta (ribbon)</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Horní akční pruh</h2>
        <CodeExample>
          <Desc>Tenký pruh podobný apple.com — sdělení a volitelný odkaz.</Desc>
          <TabExample>
            <JabkoRibbon
              message="Nakupujte dárky. Doručení včas na Vánoce."
              link={{ label: "Nakupovat", href: "#shop" }}
            />
          </TabExample>
          <TabCode>{`import { JabkoRibbon } from "~/components/ui/ribbon";

<JabkoRibbon
  message="Nakupujte dárky. Doručení včas na Vánoce."
  link={{ label: "Nakupovat", href: "#shop" }}
/>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
