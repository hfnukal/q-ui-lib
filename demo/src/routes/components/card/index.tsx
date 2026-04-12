import { component$ } from "@builder.io/qwik";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Badge } from "~/components/ui/badge";
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
        <h1 class="text-title-2 text-label">Card</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Úplná skladba</h2>
        <CodeExample>
          <Desc>Složené API: <code class="text-caption-1">Card.Root</code>, <code class="text-caption-1">Media</code>, <code class="text-caption-1">Header</code>, <code class="text-caption-1">Title</code>, <code class="text-caption-1">Description</code>, <code class="text-caption-1">Action</code>, <code class="text-caption-1">Content</code>, <code class="text-caption-1">Footer</code>.</Desc>
          <TabExample>
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
          </TabExample>
          <TabCode>{`import { Button } from "~/components/ui/button";
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
</Card.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Hlavička s akcí</h2>
        <CodeExample>
          <Desc><code class="text-caption-1">Card.Action</code> zapne v hlavičce dvousloupcové rozložení (titulek a popis vlevo, akce vpravo).</Desc>
          <TabExample>
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
            </Card.Root>
          </TabExample>
          <TabCode>{`import { Button } from "~/components/ui/button";
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
</Card.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Média nahoře</h2>
        <CodeExample>
          <Desc><code class="text-caption-1">Card.Media</code> s <code class="text-caption-1">variant="image"</code> pro poměr stran a vyplnění obrázku; kořen karty má <code class="text-caption-1">overflow-hidden</code>.</Desc>
          <TabExample>
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
          </TabExample>
          <TabCode>{`import { Badge } from "~/components/ui/badge";
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
</Card.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Jen obsah</h2>
        <CodeExample>
          <Desc>Minimální karta jen s <code class="text-caption-1">Card.Content</code> a vlastním odsazením přes <code class="text-caption-1">class</code>.</Desc>
          <TabExample>
            <Card.Root class="max-w-sm">
              <Card.Content class="pt-6">
                <p class="text-body text-label">
                  Karta jen s obsahem — vlastní odsazení přes{" "}
                  <code class="text-caption-1">class</code> na{" "}
                  <code class="text-caption-1">Card.Content</code>.
                </p>
              </Card.Content>
            </Card.Root>
          </TabExample>
          <TabCode>{`import { Card } from "~/components/ui/card";

<Card.Root class="max-w-sm">
  <Card.Content class="pt-6">
    <p class="text-body text-label">
      Karta jen s obsahem — vlastní odsazení přes{" "}
      <code class="text-caption-1">class</code> na{" "}
      <code class="text-caption-1">Card.Content</code>.
    </p>
  </Card.Content>
</Card.Root>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
