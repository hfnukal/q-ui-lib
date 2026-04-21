import { component$ } from "@builder.io/qwik";
import { WebTestimonials } from "~/components/ui/testimonials";
import { CodeExample, Desc, TabExample, TabCode } from "~/components/demo/codeexample";

export default component$(() => {
  return (
    <div class="space-y-10">
      <h1 class="text-title-2 text-label">Web — reference</h1>
      <CodeExample>
        <Desc>Citace, autor a volitelný avatar.</Desc>
        <TabExample>
          <WebTestimonials
            title="Říkají o nás"
            items={[
              {
                quote: "Dodání včas a bez překvapení.",
                author: "Jana Nováková",
                role: "CEO",
              },
              {
                quote: "Skvělá komunikace.",
                author: "Petr Dvořák",
                role: "Marketing",
                avatarSrc: "https://i.pravatar.cc/120?img=12",
              },
            ]}
          />
        </TabExample>
        <TabCode>{`<WebTestimonials title="…" items={[…]} />`}</TabCode>
      </CodeExample>
    </div>
  );
});
