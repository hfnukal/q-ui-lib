import { component$ } from "@builder.io/qwik";
import { WebAbout } from "~/components/ui/about";
import { CodeExample, Desc, TabExample, TabCode } from "~/components/demo/codeexample";

export default component$(() => {
  return (
    <div class="space-y-10">
      <h1 class="text-title-2 text-label">Web — o nás</h1>
      <CodeExample>
        <Desc>Nadpis, perex a obsah ve slotu; volitelný obrázek.</Desc>
        <TabExample>
          <WebAbout
            title="Kdo jsme"
            lead="Krátký úvodní odstavec."
            image={{
              src: "https://picsum.photos/seed/qabout/800/600",
              alt: "Tým",
            }}
          >
            <p class="text-body text-secondary-label">
              Delší text o firmě nebo vizi — předává se jako children komponenty <code class="text-caption-1">WebAbout</code>.
            </p>
          </WebAbout>
        </TabExample>
        <TabCode>{`<WebAbout title="…" lead="…" image={{ src, alt }}>
  <p>…</p>
</WebAbout>`}</TabCode>
      </CodeExample>
    </div>
  );
});
