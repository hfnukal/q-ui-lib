import { component$ } from "@builder.io/qwik";
import { Box } from "~/components/ui/box";
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
        <h1 class="text-title-2 text-label">Box</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Předvolby</h2>
        <CodeExample>
          <Desc>Tokenové předvolby: <code class="text-caption-1">padding</code>, <code class="text-caption-1">background</code>, okraj a zaoblení.</Desc>
          <TabExample>
            <Box padding="md" margin="none" background="raised" border rounded="lg">
              Obsah
            </Box>
          </TabExample>
          <TabCode>{`import { Box } from "~/components/ui/box";

<Box padding="md" margin="none" background="raised" border rounded="lg">
  Obsah
</Box>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Rozšíření přes class</h2>
        <CodeExample>
          <Desc>Vlastní layout a vzhled jednou třídou přes <code class="text-caption-1">class</code>.</Desc>
          <TabExample>
            <Box class="w-64 p-6 bg-surface-overlay rounded-xl border border-separator-opaque">
              Šířka a další styly přes class
            </Box>
          </TabExample>
          <TabCode>{`import { Box } from "~/components/ui/box";

<Box class="w-64 p-6 bg-surface-overlay rounded-xl border border-separator-opaque">
  Šířka a další styly přes class
</Box>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
