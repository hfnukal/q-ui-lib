import { component$ } from "@builder.io/qwik";
import { JabkoSubheadRail } from "~/components/ui/subhead-rail";
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
        <h1 class="text-title-2 text-label">Jabko — řádek odkazů pod hero</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Rychlé odkazy na řadu produktů</h2>
        <CodeExample>
          <Desc>Horizontální řada odkazů oddělených interpunkcí — podobně jako sekce pod hlavním bannerem.</Desc>
          <TabExample>
            <JabkoSubheadRail
              items={[
                { label: "iPhone", href: "#iphone" },
                { label: "iPad", href: "#ipad" },
                { label: "Mac", href: "#mac" },
                { label: "Watch", href: "#watch" },
              ]}
            />
          </TabExample>
          <TabCode>{`import { JabkoSubheadRail } from "~/components/ui/subhead-rail";

<JabkoSubheadRail
  items={[
    { label: "iPhone", href: "#iphone" },
    { label: "iPad", href: "#ipad" },
    { label: "Mac", href: "#mac" },
    { label: "Watch", href: "#watch" },
  ]}
/>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
