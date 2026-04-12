import { component$ } from "@builder.io/qwik";
import { AspectRatio } from "~/components/ui/aspect-ratio";
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
        <h1 class="text-title-2 text-label">AspectRatio</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Výchozí 16∶9</h2>
        <CodeExample>
          <Desc>Prop <code class="text-caption-1">ratio</code> vynecháno — použije se <code class="text-caption-1">16 / 9</code>.</Desc>
          <TabExample>
            <AspectRatio class="max-w-md rounded-lg border border-separator-opaque/40">
              <img
                src="https://picsum.photos/seed/aspect1/800/450"
                alt="Ukázka"
                width={800}
                height={450}
                class="h-full w-full object-cover"
              />
            </AspectRatio>
          </TabExample>
          <TabCode>{`import { AspectRatio } from "~/components/ui/aspect-ratio";

<AspectRatio class="max-w-md rounded-lg border border-separator-opaque/40">
  <img
    src="https://picsum.photos/seed/aspect1/800/450"
    alt="Ukázka"
    width={800}
    height={450}
    class="h-full w-full object-cover"
  />
</AspectRatio>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Čtverec</h2>
        <CodeExample>
          <Desc><code class="text-caption-1">ratio=&#123;"&#123;1&#125;"&#125;</code> pro poměr 1∶1.</Desc>
          <TabExample>
            <AspectRatio ratio={1} class="max-w-xs rounded-lg border border-separator-opaque/40">
              <img
                src="https://picsum.photos/seed/aspect2/400/400"
                alt="Čtverec"
                width={400}
                height={400}
                class="h-full w-full object-cover"
              />
            </AspectRatio>
          </TabExample>
          <TabCode>{`import { AspectRatio } from "~/components/ui/aspect-ratio";

<AspectRatio ratio={1} class="max-w-xs rounded-lg border border-separator-opaque/40">
  <img
    src="https://picsum.photos/seed/aspect2/400/400"
    alt="Čtverec"
    width={400}
    height={400}
    class="h-full w-full object-cover"
  />
</AspectRatio>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Vlastní poměr</h2>
        <CodeExample>
          <Desc>Libovolné číslo = šířka / výška (zde široké plátno <code class="text-caption-1">2.39</code>).
```tsx
import &#123; AspectRatio &#125; from "~/components/ui/aspect-ratio";</Desc>
          <TabExample>

          </TabExample>
          <TabCode>{``}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Kinematografický poměr 2.39 : 1</h2>
        <CodeExample>
          <TabExample>
            <AspectRatio ratio={2.39} class="max-w-2xl rounded-lg border border-separator-opaque/40">
              <div class="flex h-full w-full items-center justify-center bg-fill-tertiary/50 text-callout text-secondary-label">
                Obsah místo obrázku
              </div>
            </AspectRatio>
          </TabExample>
          <TabCode>{`import { AspectRatio } from "~/components/ui/aspect-ratio";

<AspectRatio ratio={2.39} class="max-w-2xl rounded-lg border border-separator-opaque/40">
  <div class="flex h-full w-full items-center justify-center bg-fill-tertiary/50 text-callout text-secondary-label">
    Obsah místo obrázku
  </div>
</AspectRatio>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
