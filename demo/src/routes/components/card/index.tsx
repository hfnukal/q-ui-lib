import { component$ } from "@builder.io/qwik";
import { CodeExample } from "~/components/demo/codeexample";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

const codeFull = `import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

<Card.Root class="max-w-md">
  <Card.Header>
    <Card.Title>Oznámení</Card.Title>
    <Card.Description>
      Shrnutí změn za poslední týden.
    </Card.Description>
  </Card.Header>
  <Card.Content>
    <p class="text-body text-secondary-label">
      Máte 3 nepřečtené zprávy a 1 naplánovanou událost.
    </p>
  </Card.Content>
  <Card.Footer class="gap-2">
    <Button variant="secondary" size="sm">
      Později
    </Button>
    <Button size="sm">Otevřít</Button>
  </Card.Footer>
</Card.Root>`;

const codeAction = `import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

<Card.Root class="max-w-md">
  <Card.Header>
    <Card.Title>Účet</Card.Title>
    <Card.Description>Přihlášení e-mailem a heslem.</Card.Description>
    <Card.Action>
      <Button
        variant="secondary"
        size="sm"
        class="border-0 bg-transparent px-2 text-link shadow-none hover:bg-transparent hover:underline"
      >
        Registrace
      </Button>
    </Card.Action>
  </Card.Header>
  <Card.Content>
    <p class="text-body text-secondary-label">… formulář …</p>
  </Card.Content>
</Card.Root>`;

const codeMedia = `import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";

<Card.Root class="max-w-sm">
  <Card.Media variant="image">
    <img
      src="https://picsum.photos/seed/qcard/640/360"
      width={640}
      height={360}
      alt="Ilustrace události"
    />
  </Card.Media>
  <Card.Header>
    <Card.Title>Meetup design systémů</Card.Title>
    <Card.Description>
      Komponenty, přístupnost a rychlejší dodávky.
    </Card.Description>
    <Card.Action>
      <Badge variant="secondary">Vybrané</Badge>
    </Card.Action>
  </Card.Header>
  <Card.Footer>
    <Button class="w-full">Detail akce</Button>
  </Card.Footer>
</Card.Root>`;

const codeMinimal = `import { Card } from "~/components/ui/card";

<Card.Root class="max-w-sm">
  <Card.Content class="pt-6">
    <p class="text-body text-label">
      Karta jen s obsahem — vlastní odsazení přes{" "}
      <code class="text-caption-1">class</code> na{" "}
      <code class="text-caption-1">Card.Content</code>.
    </p>
  </Card.Content>
</Card.Root>`;

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Card</h1>
        <p class="mt-2 max-w-prose text-body text-secondary-label">
          Kontejner pro související obsah (nadpis, popis, tělo, akce) — čistý
          markup a Tailwind podle{" "}
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1 text-label">
            COLORS.md
          </code>
          , bez headlessu (viz{" "}
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1 text-label">
            SHADCN.md
          </code>
          ).
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Úplná skladba</h2>
        <p class="text-callout text-secondary-label">
          Složené API: <code class="text-caption-1">Card.Root</code>,{" "}
          <code class="text-caption-1">Media</code>,{" "}
          <code class="text-caption-1">Header</code>,{" "}
          <code class="text-caption-1">Title</code>,{" "}
          <code class="text-caption-1">Description</code>,{" "}
          <code class="text-caption-1">Action</code>,{" "}
          <code class="text-caption-1">Content</code>,{" "}
          <code class="text-caption-1">Footer</code>.
        </p>
        <CodeExample code={codeFull}>
          <Card.Root class="max-w-md">
            <Card.Header>
              <Card.Title>Oznámení</Card.Title>
              <Card.Description>
                Shrnutí změn za poslední týden.
              </Card.Description>
            </Card.Header>
            <Card.Content>
              <p class="text-body text-secondary-label">
                Máte 3 nepřečtené zprávy a 1 naplánovanou událost.
              </p>
            </Card.Content>
            <Card.Footer class="gap-2">
              <Button variant="secondary" size="sm">
                Později
              </Button>
              <Button size="sm">Otevřít</Button>
            </Card.Footer>
          </Card.Root>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Hlavička s akcí</h2>
        <p class="text-callout text-secondary-label">
          <code class="text-caption-1">Card.Action</code> zapne v hlavičce
          dvousloupcové rozložení (titulek a popis vlevo, akce vpravo).
        </p>
        <CodeExample code={codeAction}>
          <Card.Root class="max-w-md">
            <Card.Header>
              <Card.Title>Účet</Card.Title>
              <Card.Description>Přihlášení e-mailem a heslem.</Card.Description>
              <Card.Action>
                <Button
                  variant="secondary"
                  size="sm"
                  class="border-0 bg-transparent px-2 text-link shadow-none hover:bg-transparent hover:underline"
                >
                  Registrace
                </Button>
              </Card.Action>
            </Card.Header>
            <Card.Content>
              <p class="text-body text-secondary-label">
                Zde by byl formulář — ukázka jen rozložení hlavičky.
              </p>
            </Card.Content>
          </Card.Root>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Média nahoře</h2>
        <p class="text-callout text-secondary-label">
          <code class="text-caption-1">Card.Media</code> s{" "}
          <code class="text-caption-1">variant=&quot;image&quot;</code> pro
          poměr stran a vyplnění obrázku; kořen karty má{" "}
          <code class="text-caption-1">overflow-hidden</code>.
        </p>
        <CodeExample code={codeMedia}>
          <Card.Root class="max-w-sm">
            <Card.Media variant="image">
              <img
                src="https://picsum.photos/seed/qcard/640/360"
                width={640}
                height={360}
                alt="Ilustrace události"
              />
            </Card.Media>
            <Card.Header>
              <Card.Title>Meetup design systémů</Card.Title>
              <Card.Description>
                Komponenty, přístupnost a rychlejší dodávky.
              </Card.Description>
              <Card.Action>
                <Badge variant="secondary">Vybrané</Badge>
              </Card.Action>
            </Card.Header>
            <Card.Footer>
              <Button class="w-full">Detail akce</Button>
            </Card.Footer>
          </Card.Root>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Jen obsah</h2>
        <CodeExample code={codeMinimal}>
          <Card.Root class="max-w-sm">
            <Card.Content class="pt-6">
              <p class="text-body text-label">
                Karta jen s obsahem — vlastní odsazení přes{" "}
                <code class="text-caption-1">class</code> na{" "}
                <code class="text-caption-1">Card.Content</code>.
              </p>
            </Card.Content>
          </Card.Root>
        </CodeExample>
      </section>
    </div>
  );
});
