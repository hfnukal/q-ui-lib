import { component$, useSignal } from "@builder.io/qwik";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";
import { Card } from "~/components/ui/card";
import { Carousel } from "~/components/ui/carousel";

/** Slid bez vlastního rámu — vizuál drží {@link Card}. */
const slideChrome = "border-0 bg-transparent p-0 shadow-none";

const codeBasic = `import { Card } from "~/components/ui/card";
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
      {/* …další snímky se stejným vzorem */}
    </Carousel.Scroller>
    <Carousel.Previous class="absolute left-0 top-1/2 -translate-y-1/2">‹</Carousel.Previous>
    <Carousel.Next class="absolute right-0 top-1/2 -translate-y-1/2">›</Carousel.Next>
  </div>
  <Carousel.Pagination>
    <Carousel.Bullet />
    <Carousel.Bullet />
    <Carousel.Bullet />
  </Carousel.Pagination>
</Carousel.Root>`;

const codeAutoplay = `import { component$, useSignal } from "@builder.io/qwik";
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
          <Card.Root class="w-full">…</Card.Root>
        </Carousel.Slide>
      </Carousel.Scroller>
      <div class="mt-3 flex flex-wrap items-center justify-center gap-3">
        <Carousel.Player />
      </div>
    </Carousel.Root>
  );
});`;

const codeStepper = `import { Card } from "~/components/ui/card";
import { Carousel } from "~/components/ui/carousel";

<Carousel.Root class="max-w-md" rewind>
  <Carousel.Title>Kroky</Carousel.Title>
  <Carousel.Scroller>
    <Carousel.Slide class="border-0 bg-transparent p-0 shadow-none">
      <Card.Root class="w-full">…</Card.Root>
    </Carousel.Slide>
    {/* … */}
  </Carousel.Scroller>
  <Carousel.Stepper>
    <Carousel.Step>1</Carousel.Step>
    <Carousel.Step>2</Carousel.Step>
    <Carousel.Step>3</Carousel.Step>
  </Carousel.Stepper>
</Carousel.Root>`;

export default component$(() => {
  const autoplay = useSignal(false);

  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 font-semibold text-label">Carousel</h1>
        <p class="mt-2 max-w-prose text-callout text-secondary-label">
          Složené API nad{" "}
          <code class="rounded-md bg-fill-secondary px-1.5 py-0.5 text-caption-1 text-label">
            @qwik-ui/headless
          </code>{" "}
          (viz{" "}
          <a
            class="text-accent underline-offset-2 hover:underline"
            href="https://qwikui.com/docs/headless/carousel"
          >
            Qwik UI Carousel
          </a>
          ); styly odpovídají ostatním komponentám v demu (tokeny z COLORS.md).
          Snímky používají{" "}
          <code class="rounded-md bg-fill-secondary px-1.5 py-0.5 text-caption-1 text-label">
            Card
          </code>{" "}
          z{" "}
          <code class="rounded-md bg-fill-secondary px-1.5 py-0.5 text-caption-1 text-label">
            ~/components/ui/card
          </code>
          .
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Tečky uprostřed (pagination)</h2>

        <CodeExample>
          <Desc>
            Pod karuselem jsou vystředěné tečky: aktivní snímek je vyplněný,
            ostatní jen obrysové. Kliknutím na tečku přejdeš na daný snímek.
            Šipky jsou textové (‹ ›), bez ikon. Uvnitř každého snímku je
            kompletní <code class="text-caption-1 text-label">Card</code> s
            titulkem, popisem a obsahem; na{" "}
            <code class="text-caption-1 text-label">Carousel.Slide</code> je{" "}
            <code class="text-caption-1 text-label">
              border-0 bg-transparent p-0
            </code>
            , aby se nepletly dva rámečky.
          </Desc>
          <TabExample>
            <Carousel.Root class="max-w-xl" rewind>
              <Carousel.Title>Demo karusel</Carousel.Title>
              <div class="relative px-11">
                <Carousel.Scroller>
                  <Carousel.Slide class={slideChrome}>
                    <Card.Root class="w-full">
                      <Card.Header>
                        <Card.Title>První karta</Card.Title>
                        <Card.Description>
                          Ukázka Card v karuselu
                        </Card.Description>
                      </Card.Header>
                      <Card.Content>
                        <p class="text-callout text-secondary-label">
                          Obsah prvního snímku — stejné stavební bloky jako na
                          stránce Card.
                        </p>
                      </Card.Content>
                    </Card.Root>
                  </Carousel.Slide>
                  <Carousel.Slide class={slideChrome}>
                    <Card.Root class="w-full">
                      <Card.Header>
                        <Card.Title>Druhá karta</Card.Title>
                        <Card.Description>
                          Další položka ve stejném formátu
                        </Card.Description>
                      </Card.Header>
                      <Card.Content>
                        <p class="text-callout text-secondary-label">
                          Přepínání šipkami, klávesnicí nebo tečkami níže.
                        </p>
                      </Card.Content>
                    </Card.Root>
                  </Carousel.Slide>
                  <Carousel.Slide class={slideChrome}>
                    <Card.Root class="w-full">
                      <Card.Header>
                        <Card.Title>Třetí karta</Card.Title>
                        <Card.Description>
                          Poslední snímek v této ukázce
                        </Card.Description>
                      </Card.Header>
                      <Card.Content>
                        <p class="text-callout text-secondary-label">
                          S{" "}
                          <code class="text-caption-1 text-label">rewind</code>{" "}
                          se z posledního snímku vrátíš na první.
                        </p>
                      </Card.Content>
                    </Card.Root>
                  </Carousel.Slide>
                </Carousel.Scroller>
                <Carousel.Previous class="absolute left-0 top-1/2 -translate-y-1/2">
                  ‹
                </Carousel.Previous>
                <Carousel.Next class="absolute right-0 top-1/2 -translate-y-1/2">
                  ›
                </Carousel.Next>
              </div>
              <Carousel.Pagination>
                <Carousel.Bullet />
                <Carousel.Bullet />
                <Carousel.Bullet />
              </Carousel.Pagination>
            </Carousel.Root>
          </TabExample>
          <TabCode>{codeBasic}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Autoplay a přehrávač</h2>

        <CodeExample>
          <Desc>
            <code class="text-caption-1 text-label">bind:autoplay</code> a{" "}
            <code class="text-caption-1 text-label">Carousel.Player</code> — u
            uživatelů s{" "}
            <code class="text-caption-1 text-label">
              prefers-reduced-motion
            </code>{" "}
            se tlačítko přehrávače skryje (headless CSS). Snímky jsou opět karty
            s obsahem.
          </Desc>
          <TabExample>
            <Carousel.Root
              class="max-w-xl"
              rewind
              bind:autoplay={autoplay}
              autoPlayIntervalMs={3500}
            >
              <Carousel.Title>Autoplay demo</Carousel.Title>
              <Carousel.Scroller>
                <Carousel.Slide class={slideChrome}>
                  <Card.Root class="w-full">
                    <Card.Header>
                      <Card.Title>Automatické přehrávání</Card.Title>
                      <Card.Description>
                        Zapni přehrávačem pod karuselem
                      </Card.Description>
                    </Card.Header>
                    <Card.Content>
                      <p class="text-callout text-secondary-label">
                        Interval je 3,5 s; s{" "}
                        <code class="text-caption-1 text-label">rewind</code>{" "}
                        cyklus pokračuje od začátku.
                      </p>
                    </Card.Content>
                  </Card.Root>
                </Carousel.Slide>
                <Carousel.Slide class={slideChrome}>
                  <Card.Root class="w-full">
                    <Card.Header>
                      <Card.Title>Druhá karta</Card.Title>
                      <Card.Description>
                        Další snímek ve slideshow
                      </Card.Description>
                    </Card.Header>
                    <Card.Content>
                      <p class="text-callout text-secondary-label">
                        Stejná struktura{" "}
                        <code class="text-caption-1 text-label">Card</code> jako
                        u prvního snímku.
                      </p>
                    </Card.Content>
                  </Card.Root>
                </Carousel.Slide>
              </Carousel.Scroller>
              <div class="mt-3 flex flex-wrap items-center justify-center gap-3">
                <Carousel.Player />
              </div>
            </Carousel.Root>
          </TabExample>
          <TabCode>{codeAutoplay}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Stepper (číslované kroky)</h2>

        <CodeExample>
          <Desc>
            <code class="text-caption-1 text-label">Carousel.Stepper</code> a{" "}
            <code class="text-caption-1 text-label">Carousel.Step</code> — karty
            v snímcích, skok přímo podle čísla.
          </Desc>
          <TabExample>
            <Carousel.Root class="max-w-md" rewind>
              <Carousel.Title>Kroková navigace</Carousel.Title>
              <Carousel.Scroller>
                <Carousel.Slide class={slideChrome}>
                  <Card.Root class="w-full">
                    <Card.Header>
                      <Card.Title>Krok 1</Card.Title>
                      <Card.Description>Začátek</Card.Description>
                    </Card.Header>
                    <Card.Content>
                      <p class="text-callout text-secondary-label">
                        Obsah prvního kroku v kartě.
                      </p>
                    </Card.Content>
                  </Card.Root>
                </Carousel.Slide>
                <Carousel.Slide class={slideChrome}>
                  <Card.Root class="w-full">
                    <Card.Header>
                      <Card.Title>Krok 2</Card.Title>
                      <Card.Description>Pokračování</Card.Description>
                    </Card.Header>
                    <Card.Content>
                      <p class="text-callout text-secondary-label">
                        Obsah druhého kroku.
                      </p>
                    </Card.Content>
                  </Card.Root>
                </Carousel.Slide>
                <Carousel.Slide class={slideChrome}>
                  <Card.Root class="w-full">
                    <Card.Header>
                      <Card.Title>Krok 3</Card.Title>
                      <Card.Description>Dokončení</Card.Description>
                    </Card.Header>
                    <Card.Content>
                      <p class="text-callout text-secondary-label">
                        Obsah třetího kroku.
                      </p>
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
          <TabCode>{codeStepper}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
