import { component$ } from "@builder.io/qwik";
import { JabkoGlobalNav } from "~/components/ui/global-nav";
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
        <h1 class="text-title-2 text-label">Jabko — globální navigace</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Minimalistická horní lišta</h2>
        <CodeExample>
          <Desc>Logo vlevo, odkazy uprostřed, slot pro akce vpravo — vzor apple.com.</Desc>
          <TabExample>
            <JabkoGlobalNav
              brandLabel="Apple"
              navItems={[
                { label: "Obchod", href: "#store" },
                { label: "Mac", href: "#mac" },
                { label: "iPhone", href: "#iphone" },
              ]}
            />
          </TabExample>
          <TabCode>{`import { JabkoGlobalNav } from "~/components/ui/global-nav";

<JabkoGlobalNav
  brandLabel="Apple"
  navItems={[
    { label: "Obchod", href: "#store" },
    { label: "Mac", href: "#mac" },
    { label: "iPhone", href: "#iphone" },
  ]}
/>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
