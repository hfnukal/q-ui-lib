import { component$, useSignal } from "@builder.io/qwik";
import { Card } from "~/components/ui/card";
import { Carousel } from "~/components/ui/carousel";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";

export const _Example1 = component$(() => {
  const autoplay = useSignal(false);
  return (
    <Carousel.Root
      class="max-w-xl"
      rewind
      bind:autoplay={autoplay}
      autoPlayIntervalMs={3500}
    >
      <Carousel.Title>Autoplay</Carousel.Title>
      <Carousel.Scroller>
        <Carousel.Slide class="border-0 bg-transparent p-0 shadow-none">
          <Card.Root class="w-full">
            <Card.Header>
              <Card.Title>Slideshow</Card.Title>
              <Card.Description>Autoplay</Card.Description>
            </Card.Header>
            <Card.Content>
              <p class="text-callout text-secondary-label">Obsah první karty.</p>
            </Card.Content>
          </Card.Root>
        </Carousel.Slide>
        <Carousel.Slide class="border-0 bg-transparent p-0 shadow-none">
          <Card.Root class="w-full">
            <Card.Header>
              <Card.Title>Druhá karta</Card.Title>
              <Card.Description>Další snímek ve smyčce</Card.Description>
            </Card.Header>
            <Card.Content>
              <p class="text-callout text-secondary-label">Stejný layout jako první snímek; autoplay pokračuje podle intervalu.</p>
            </Card.Content>
          </Card.Root>
        </Carousel.Slide>
      </Carousel.Scroller>
      <div class="mt-3 flex flex-wrap items-center justify-center gap-3">
        <Carousel.Player />
      </div>
    </Carousel.Root>
  );
});

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Carousel</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Tečky uprostřed (pagination)</h2>
        <CodeExample>
          <Desc>Pod karuselem jsou vystředěné tečky: aktivní snímek je vyplněný, ostatní jen obrysové. Kliknutím na tečku přejdeš na daný snímek. Šipky jsou textové (‹ ›), bez ikon. Uvnitř každého snímku je kompletní <code class="text-caption-1">Card</code> s titulkem, popisem a obsahem; na <code class="text-caption-1">Carousel.Slide</code> je <code class="text-caption-1">border-0 bg-transparent p-0</code> , aby se nepletly dva rámečky.</Desc>
          <TabExample>
            <Carousel.Root class="max-w-xl" rewind>
              <Carousel.Title>Karusel</Carousel.Title>
              <div class="relative px-11">
                <Carousel.Scroller>
                  <Carousel.Slide class="border-0 bg-transparent p-0 shadow-none">
                    <Card.Root class="w-full">
                      <Card.Header>
                        <Card.Title>První karta</Card.Title>
                        <Card.Description>Stručný podtitulek</Card.Description>
                      </Card.Header>
                      <Card.Content>
                        <p class="text-callout text-secondary-label">Obsah snímku.</p>
                      </Card.Content>
                    </Card.Root>
                  </Carousel.Slide>
                  <Carousel.Slide class="border-0 bg-transparent p-0 shadow-none">
                    <Card.Root class="w-full">
                      <Card.Header>
                        <Card.Title>Druhá karta</Card.Title>
                        <Card.Description>Další snímek</Card.Description>
                      </Card.Header>
                      <Card.Content>
                        <p class="text-callout text-secondary-label">Stejný layout jako první snímek.</p>
                      </Card.Content>
                    </Card.Root>
                  </Carousel.Slide>
                </Carousel.Scroller>
                <Carousel.Previous class="absolute left-0 top-1/2 -translate-y-1/2">‹</Carousel.Previous>
                <Carousel.Next class="absolute right-0 top-1/2 -translate-y-1/2">›</Carousel.Next>
              </div>
              <Carousel.Pagination>
                <Carousel.Bullet />
                <Carousel.Bullet />
                <Carousel.Bullet />
              </Carousel.Pagination>
            </Carousel.Root>
          </TabExample>
          <TabCode>{`import { Card } from "~/components/ui/card";
import { Carousel } from "~/components/ui/carousel";

<Carousel.Root class="max-w-xl" rewind>
  <Carousel.Title>Karusel</Carousel.Title>
  <div class="relative px-11">
    <Carousel.Scroller>
      <Carousel.Slide class="border-0 bg-transparent p-0 shadow-none">
        <Card.Root class="w-full">
          <Card.Header>
            <Card.Title>První karta</Card.Title>
            <Card.Description>Stručný podtitulek</Card.Description>
          </Card.Header>
          <Card.Content>
            <p class="text-callout text-secondary-label">Obsah snímku.</p>
          </Card.Content>
        </Card.Root>
      </Carousel.Slide>
      <Carousel.Slide class="border-0 bg-transparent p-0 shadow-none">
        <Card.Root class="w-full">
          <Card.Header>
            <Card.Title>Druhá karta</Card.Title>
            <Card.Description>Další snímek</Card.Description>
          </Card.Header>
          <Card.Content>
            <p class="text-callout text-secondary-label">Stejný layout jako první snímek.</p>
          </Card.Content>
        </Card.Root>
      </Carousel.Slide>
    </Carousel.Scroller>
    <Carousel.Previous class="absolute left-0 top-1/2 -translate-y-1/2">‹</Carousel.Previous>
    <Carousel.Next class="absolute right-0 top-1/2 -translate-y-1/2">›</Carousel.Next>
  </div>
  <Carousel.Pagination>
    <Carousel.Bullet />
    <Carousel.Bullet />
    <Carousel.Bullet />
  </Carousel.Pagination>
</Carousel.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Autoplay a přehrávač</h2>
        <CodeExample>
          <Desc><code class="text-caption-1">bind:autoplay</code> a <code class="text-caption-1">Carousel.Player</code> — u uživatelů s <code class="text-caption-1">prefers-reduced-motion</code> se tlačítko přehrávače skryje (headless CSS). Snímky jsou opět karty s obsahem.</Desc>
          <TabExample>
            <_Example1 />
          </TabExample>
          <TabCode>{`import { component$, useSignal } from "@builder.io/qwik";
import { Card } from "~/components/ui/card";
import { Carousel } from "~/components/ui/carousel";

export default component$(() => {
  const autoplay = useSignal(false);
  return (
    <Carousel.Root
      class="max-w-xl"
      rewind
      bind:autoplay={autoplay}
      autoPlayIntervalMs={3500}
    >
      <Carousel.Title>Autoplay</Carousel.Title>
      <Carousel.Scroller>
        <Carousel.Slide class="border-0 bg-transparent p-0 shadow-none">
          <Card.Root class="w-full">
            <Card.Header>
              <Card.Title>Slideshow</Card.Title>
              <Card.Description>Autoplay</Card.Description>
            </Card.Header>
            <Card.Content>
              <p class="text-callout text-secondary-label">Obsah první karty.</p>
            </Card.Content>
          </Card.Root>
        </Carousel.Slide>
        <Carousel.Slide class="border-0 bg-transparent p-0 shadow-none">
          <Card.Root class="w-full">
            <Card.Header>
              <Card.Title>Druhá karta</Card.Title>
              <Card.Description>Další snímek ve smyčce</Card.Description>
            </Card.Header>
            <Card.Content>
              <p class="text-callout text-secondary-label">Stejný layout jako první snímek; autoplay pokračuje podle intervalu.</p>
            </Card.Content>
          </Card.Root>
        </Carousel.Slide>
      </Carousel.Scroller>
      <div class="mt-3 flex flex-wrap items-center justify-center gap-3">
        <Carousel.Player />
      </div>
    </Carousel.Root>
  );
});`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Stepper (číslované kroky)</h2>
        <CodeExample>
          <Desc><code class="text-caption-1">Carousel.Stepper</code> a <code class="text-caption-1">Carousel.Step</code> — karty v snímcích, skok přímo podle čísla.</Desc>
          <TabExample>
            <Carousel.Root class="max-w-md" rewind>
              <Carousel.Title>Kroky</Carousel.Title>
              <Carousel.Scroller>
                <Carousel.Slide class="border-0 bg-transparent p-0 shadow-none">
                  <Card.Root class="w-full">
                    <Card.Header>
                      <Card.Title>Krok 1</Card.Title>
                      <Card.Description>Výběr šablony</Card.Description>
                    </Card.Header>
                    <Card.Content>
                      <p class="text-callout text-secondary-label">Vyber základní rozložení; další kroky ho doplní.</p>
                    </Card.Content>
                  </Card.Root>
                </Carousel.Slide>
                <Carousel.Slide class="border-0 bg-transparent p-0 shadow-none">
                  <Card.Root class="w-full">
                    <Card.Header>
                      <Card.Title>Krok 2</Card.Title>
                      <Card.Description>Nastavení obsahu</Card.Description>
                    </Card.Header>
                    <Card.Content>
                      <p class="text-callout text-secondary-label">Uprav texty a obrázky; náhled se aktualizuje okamžitě.</p>
                    </Card.Content>
                  </Card.Root>
                </Carousel.Slide>
                <Carousel.Slide class="border-0 bg-transparent p-0 shadow-none">
                  <Card.Root class="w-full">
                    <Card.Header>
                      <Card.Title>Krok 3</Card.Title>
                      <Card.Description>Publikace</Card.Description>
                    </Card.Header>
                    <Card.Content>
                      <p class="text-callout text-secondary-label">Zkontroluj náhled a potvrď zveřejnění.</p>
                    </Card.Content>
                  </Card.Root>
                </Carousel.Slide>
              </Carousel.Scroller>
              <Carousel.Stepper>
                <Carousel.Step>1</Carousel.Step>
                <Carousel.Step>2</Carousel.Step>
                <Carousel.Step>3</Carousel.Step>
              </Carousel.Stepper>
            </Carousel.Root>
          </TabExample>
          <TabCode>{`import { Card } from "~/components/ui/card";
import { Carousel } from "~/components/ui/carousel";

<Carousel.Root class="max-w-md" rewind>
  <Carousel.Title>Kroky</Carousel.Title>
  <Carousel.Scroller>
    <Carousel.Slide class="border-0 bg-transparent p-0 shadow-none">
      <Card.Root class="w-full">
        <Card.Header>
          <Card.Title>Krok 1</Card.Title>
          <Card.Description>Výběr šablony</Card.Description>
        </Card.Header>
        <Card.Content>
          <p class="text-callout text-secondary-label">Vyber základní rozložení; další kroky ho doplní.</p>
        </Card.Content>
      </Card.Root>
    </Carousel.Slide>
    <Carousel.Slide class="border-0 bg-transparent p-0 shadow-none">
      <Card.Root class="w-full">
        <Card.Header>
          <Card.Title>Krok 2</Card.Title>
          <Card.Description>Nastavení obsahu</Card.Description>
        </Card.Header>
        <Card.Content>
          <p class="text-callout text-secondary-label">Uprav texty a obrázky; náhled se aktualizuje okamžitě.</p>
        </Card.Content>
      </Card.Root>
    </Carousel.Slide>
    <Carousel.Slide class="border-0 bg-transparent p-0 shadow-none">
      <Card.Root class="w-full">
        <Card.Header>
          <Card.Title>Krok 3</Card.Title>
          <Card.Description>Publikace</Card.Description>
        </Card.Header>
        <Card.Content>
          <p class="text-callout text-secondary-label">Zkontroluj náhled a potvrď zveřejnění.</p>
        </Card.Content>
      </Card.Root>
    </Carousel.Slide>
  </Carousel.Scroller>
  <Carousel.Stepper>
    <Carousel.Step>1</Carousel.Step>
    <Carousel.Step>2</Carousel.Step>
    <Carousel.Step>3</Carousel.Step>
  </Carousel.Stepper>
</Carousel.Root>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
