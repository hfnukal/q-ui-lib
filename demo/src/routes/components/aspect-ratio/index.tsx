import { component$ } from "@builder.io/qwik";
import { CodeExample } from "~/components/demo/codeexample";
import { AspectRatio } from "~/components/ui/aspect-ratio";

const codeDefault = `import { AspectRatio } from "~/components/ui/aspect-ratio";

<AspectRatio class="max-w-md rounded-lg border border-separator-opaque/40">
  <img
    src="https://picsum.photos/seed/aspect1/800/450"
    alt="Ukázka"
    width={800}
    height={450}
    class="h-full w-full object-cover"
  />
</AspectRatio>`;

const codeSquare = `import { AspectRatio } from "~/components/ui/aspect-ratio";

<AspectRatio ratio={1} class="max-w-xs rounded-lg border border-separator-opaque/40">
  <img
    src="https://picsum.photos/seed/aspect2/400/400"
    alt="Čtverec"
    width={400}
    height={400}
    class="h-full w-full object-cover"
  />
</AspectRatio>`;

const codeWide = `import { AspectRatio } from "~/components/ui/aspect-ratio";

{/* Kinematografický poměr 2.39 : 1 */}
<AspectRatio ratio={2.39} class="max-w-2xl rounded-lg border border-separator-opaque/40">
  <div class="flex h-full w-full items-center justify-center bg-fill-tertiary/50 text-callout text-secondary-label">
    Obsah místo obrázku
  </div>
</AspectRatio>`;

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Aspect ratio</h1>
        <p class="mt-2 max-w-prose text-body text-secondary-label">
          Kontejner s poměrem stran přes CSS{" "}
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1 text-label">
            aspect-ratio
          </code>{" "}
          (shadcn-like API, bez Radix). Vhodné pro náhledy videí, karty s obrázky a
          layout, kde má blok držet proporce při změně šířky.
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Výchozí 16∶9</h2>
        <p class="text-callout text-secondary-label">
          Prop <code class="text-caption-1">ratio</code> vynecháno — použije se{" "}
          <code class="text-caption-1">16 / 9</code>.
        </p>
        <CodeExample code={codeDefault}>
          <AspectRatio class="max-w-md rounded-lg border border-separator-opaque/40">
            <img
              src="https://picsum.photos/seed/aspect1/800/450"
              alt="Ukázka"
              width={800}
              height={450}
              class="h-full w-full object-cover"
            />
          </AspectRatio>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Čtverec</h2>
        <p class="text-callout text-secondary-label">
          <code class="text-caption-1">ratio={'{1}'}</code> pro poměr 1∶1.
        </p>
        <CodeExample code={codeSquare}>
          <AspectRatio ratio={1} class="max-w-xs rounded-lg border border-separator-opaque/40">
            <img
              src="https://picsum.photos/seed/aspect2/400/400"
              alt="Čtverec"
              width={400}
              height={400}
              class="h-full w-full object-cover"
            />
          </AspectRatio>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Vlastní poměr</h2>
        <p class="text-callout text-secondary-label">
          Libovolné číslo = šířka / výška (zde široké plátno{" "}
          <code class="text-caption-1">2.39</code>).
        </p>
        <CodeExample code={codeWide}>
          <AspectRatio ratio={2.39} class="max-w-2xl rounded-lg border border-separator-opaque/40">
            <div class="flex h-full w-full items-center justify-center bg-fill-tertiary/50 text-callout text-secondary-label">
              Obsah místo obrázku
            </div>
          </AspectRatio>
        </CodeExample>
      </section>
    </div>
  );
});
