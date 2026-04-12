/**
 * @component carousel
 * @title Carousel
 * @version 1.0.0
 * @example Tečky uprostřed (pagination)
 * Pod karuselem jsou vystředěné tečky: aktivní snímek je vyplněný, ostatní jen obrysové. Kliknutím na tečku přejdeš na daný snímek. Šipky jsou textové (‹ ›), bez ikon. Uvnitř každého snímku je kompletní `Card` s titulkem, popisem a obsahem; na `Carousel.Slide` je `border-0 bg-transparent p-0` , aby se nepletly dva rámečky.
 * ```tsx
 * import { Card } from "~/components/ui/card";
 * import { Carousel } from "~/components/ui/carousel";
 * 
 * <Carousel.Root class="max-w-xl" rewind>
 *   <Carousel.Title>Karusel</Carousel.Title>
 *   <div class="relative px-11">
 *     <Carousel.Scroller>
 *       <Carousel.Slide class="border-0 bg-transparent p-0 shadow-none">
 *         <Card.Root class="w-full">
 *           <Card.Header>
 *             <Card.Title>První karta</Card.Title>
 *             <Card.Description>Stručný podtitulek</Card.Description>
 *           </Card.Header>
 *           <Card.Content>
 *             <p class="text-callout text-secondary-label">Obsah snímku.</p>
 *           </Card.Content>
 *         </Card.Root>
 *       </Carousel.Slide>
 *       <Carousel.Slide class="border-0 bg-transparent p-0 shadow-none">
 *         <Card.Root class="w-full">
 *           <Card.Header>
 *             <Card.Title>Druhá karta</Card.Title>
 *             <Card.Description>Další snímek</Card.Description>
 *           </Card.Header>
 *           <Card.Content>
 *             <p class="text-callout text-secondary-label">Stejný layout jako první snímek.</p>
 *           </Card.Content>
 *         </Card.Root>
 *       </Carousel.Slide>
 *     </Carousel.Scroller>
 *     <Carousel.Previous class="absolute left-0 top-1/2 -translate-y-1/2">‹</Carousel.Previous>
 *     <Carousel.Next class="absolute right-0 top-1/2 -translate-y-1/2">›</Carousel.Next>
 *   </div>
 *   <Carousel.Pagination>
 *     <Carousel.Bullet />
 *     <Carousel.Bullet />
 *     <Carousel.Bullet />
 *   </Carousel.Pagination>
 * </Carousel.Root>
 * ```
 *
 * @example Autoplay a přehrávač
 * `bind:autoplay` a `Carousel.Player` — u uživatelů s `prefers-reduced-motion` se tlačítko přehrávače skryje (headless CSS). Snímky jsou opět karty s obsahem.
 * ```tsx
 * import { component$, useSignal } from "@builder.io/qwik";
 * import { Card } from "~/components/ui/card";
 * import { Carousel } from "~/components/ui/carousel";
 * 
 * export default component$(() => {
 *   const autoplay = useSignal(false);
 *   return (
 *     <Carousel.Root
 *       class="max-w-xl"
 *       rewind
 *       bind:autoplay={autoplay}
 *       autoPlayIntervalMs={3500}
 *     >
 *       <Carousel.Title>Autoplay</Carousel.Title>
 *       <Carousel.Scroller>
 *         <Carousel.Slide class="border-0 bg-transparent p-0 shadow-none">
 *           <Card.Root class="w-full">
 *             <Card.Header>
 *               <Card.Title>Slideshow</Card.Title>
 *               <Card.Description>Autoplay</Card.Description>
 *             </Card.Header>
 *             <Card.Content>
 *               <p class="text-callout text-secondary-label">Obsah první karty.</p>
 *             </Card.Content>
 *           </Card.Root>
 *         </Carousel.Slide>
 *         <Carousel.Slide class="border-0 bg-transparent p-0 shadow-none">
 *           <Card.Root class="w-full">
 *             <Card.Header>
 *               <Card.Title>Druhá karta</Card.Title>
 *               <Card.Description>Další snímek ve smyčce</Card.Description>
 *             </Card.Header>
 *             <Card.Content>
 *               <p class="text-callout text-secondary-label">Stejný layout jako první snímek; autoplay pokračuje podle intervalu.</p>
 *             </Card.Content>
 *           </Card.Root>
 *         </Carousel.Slide>
 *       </Carousel.Scroller>
 *       <div class="mt-3 flex flex-wrap items-center justify-center gap-3">
 *         <Carousel.Player />
 *       </div>
 *     </Carousel.Root>
 *   );
 * });
 * ```
 *
 * @example Stepper (číslované kroky)
 * `Carousel.Stepper` a `Carousel.Step` — karty v snímcích, skok přímo podle čísla.
 * ```tsx
 * import { Card } from "~/components/ui/card";
 * import { Carousel } from "~/components/ui/carousel";
 * 
 * <Carousel.Root class="max-w-md" rewind>
 *   <Carousel.Title>Kroky</Carousel.Title>
 *   <Carousel.Scroller>
 *     <Carousel.Slide class="border-0 bg-transparent p-0 shadow-none">
 *       <Card.Root class="w-full">
 *         <Card.Header>
 *           <Card.Title>Krok 1</Card.Title>
 *           <Card.Description>Výběr šablony</Card.Description>
 *         </Card.Header>
 *         <Card.Content>
 *           <p class="text-callout text-secondary-label">Vyber základní rozložení; další kroky ho doplní.</p>
 *         </Card.Content>
 *       </Card.Root>
 *     </Carousel.Slide>
 *     <Carousel.Slide class="border-0 bg-transparent p-0 shadow-none">
 *       <Card.Root class="w-full">
 *         <Card.Header>
 *           <Card.Title>Krok 2</Card.Title>
 *           <Card.Description>Nastavení obsahu</Card.Description>
 *         </Card.Header>
 *         <Card.Content>
 *           <p class="text-callout text-secondary-label">Uprav texty a obrázky; náhled se aktualizuje okamžitě.</p>
 *         </Card.Content>
 *       </Card.Root>
 *     </Carousel.Slide>
 *     <Carousel.Slide class="border-0 bg-transparent p-0 shadow-none">
 *       <Card.Root class="w-full">
 *         <Card.Header>
 *           <Card.Title>Krok 3</Card.Title>
 *           <Card.Description>Publikace</Card.Description>
 *         </Card.Header>
 *         <Card.Content>
 *           <p class="text-callout text-secondary-label">Zkontroluj náhled a potvrď zveřejnění.</p>
 *         </Card.Content>
 *       </Card.Root>
 *     </Carousel.Slide>
 *   </Carousel.Scroller>
 *   <Carousel.Stepper>
 *     <Carousel.Step>1</Carousel.Step>
 *     <Carousel.Step>2</Carousel.Step>
 *     <Carousel.Step>3</Carousel.Step>
 *   </Carousel.Stepper>
 * </Carousel.Root>
 * ```
 
 */

import {
  component$,
  type FunctionComponent,
  type PropsOf,
  Slot,
} from "@builder.io/qwik";
import { Carousel as HeadlessCarousel } from "@qwik-ui/headless";

/** Vzhled vychází z konceptu shadcn Carousel; barvy a tokeny z COLORS.md. */

const rootClass = "relative w-full";

const scrollerClass =
  "min-h-[8rem] rounded-lg border border-separator-opaque bg-surface-base";

const slideClass =
  "flex min-h-[120px] flex-col justify-center rounded-md border border-separator-opaque bg-surface-raised p-6 text-body text-label shadow-sm";

const navButtonClass =
  "relative z-10 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-separator-opaque bg-surface-raised text-secondary-label shadow-sm transition-colors hover:bg-surface-overlay focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40";

const paginationClass =
  "flex flex-wrap items-center justify-center gap-2.5 pt-4";

/** Neaktivní: jen obrys; aktivní (`aria-selected`): vyplněná tečka. Kliknutí řeší headless. */
const bulletClass =
  "box-border h-2.5 w-2.5 shrink-0 cursor-pointer rounded-full border-2 border-secondary-label/45 bg-transparent transition-colors hover:border-accent/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 aria-selected:border-accent aria-selected:bg-accent";

const titleWrapperClass = "sr-only";

const playerClass =
  "inline-flex h-9 items-center gap-2 rounded-md border border-separator-opaque bg-surface-raised px-3 text-callout font-medium text-label shadow-sm hover:bg-surface-overlay focus:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const stepperClass = "mt-3 flex flex-wrap gap-2";

const stepClass =
  "inline-flex min-h-9 min-w-9 items-center justify-center rounded-md border border-separator-opaque bg-surface-raised text-callout font-medium text-secondary-label aria-[current=step]:border-accent aria-[current=step]:text-label";

export type CarouselRootProps = PropsOf<typeof HeadlessCarousel.Root>;

/** `component$` + {@link Slot} — stejný vzor jako Checkbox/Label: jinak se děti do headless primitiva nepromítnou. */
export const CarouselSlide = component$<PropsOf<typeof HeadlessCarousel.Slide>>((props) => {
  const merged = [slideClass, props.class].filter(Boolean).join(" ");
  return (
    <HeadlessCarousel.Slide {...props} class={merged}>
      <Slot />
    </HeadlessCarousel.Slide>
  );
});

export const CarouselBullet = component$<PropsOf<typeof HeadlessCarousel.Bullet>>((props) => {
  const merged = [bulletClass, props.class].filter(Boolean).join(" ");
  return (
    <HeadlessCarousel.Bullet {...props} class={merged}>
      <Slot />
    </HeadlessCarousel.Bullet>
  );
});

/**
 * {@link https://qwikui.com/docs/headless/carousel | Carousel.Root}: výchozí styly a předání vlastních {@link CarouselSlide} / {@link CarouselBullet} / {@link CarouselTitle}.
 */
export const CarouselRoot: FunctionComponent<CarouselRootProps> = (props) => {
  const {
    class: className,
    slideComponent,
    bulletComponent,
    titleComponent,
    stepComponent,
    maxSlideHeight,
    ...rest
  } = props;
  const merged = [rootClass, className].filter(Boolean).join(" ");
  return (
    <HeadlessCarousel.Root
      {...rest}
      maxSlideHeight={maxSlideHeight ?? 999999}
      class={merged}
      slideComponent={slideComponent ?? CarouselSlide}
      bulletComponent={bulletComponent ?? CarouselBullet}
      titleComponent={titleComponent ?? CarouselTitle}
      stepComponent={stepComponent ?? CarouselStep}
    />
  );
};

export const CarouselScroller: FunctionComponent<
  PropsOf<typeof HeadlessCarousel.Scroller>
> = (props) => {
  const { class: className, ...rest } = props;
  const merged = [scrollerClass, className].filter(Boolean).join(" ");
  return <HeadlessCarousel.Scroller {...rest} class={merged} />;
};

export const CarouselPrevious = component$<PropsOf<typeof HeadlessCarousel.Previous>>((props) => {
  const merged = [navButtonClass, props.class].filter(Boolean).join(" ");
  return (
    <HeadlessCarousel.Previous {...props} class={merged}>
      <Slot />
    </HeadlessCarousel.Previous>
  );
});

export const CarouselNext = component$<PropsOf<typeof HeadlessCarousel.Next>>((props) => {
  const merged = [navButtonClass, props.class].filter(Boolean).join(" ");
  return (
    <HeadlessCarousel.Next {...props} class={merged}>
      <Slot />
    </HeadlessCarousel.Next>
  );
});

export const CarouselPagination: FunctionComponent<
  PropsOf<typeof HeadlessCarousel.Pagination>
> = (props) => {
  const { class: className, ...rest } = props;
  const merged = [paginationClass, className].filter(Boolean).join(" ");
  return <HeadlessCarousel.Pagination {...rest} class={merged} />;
};

/**
 * Obal kolem headless titulku (id pro aria zůstává uvnitř); výchozí je jen pro čtečky — přepiš `class` pro viditelný nadpis.
 */
export const CarouselTitle = component$<{ class?: string }>((props) => {
  const merged = [titleWrapperClass, props.class].filter(Boolean).join(" ");
  return (
    <div class={merged}>
      <HeadlessCarousel.Title>
        <Slot />
      </HeadlessCarousel.Title>
    </div>
  );
});

export const CarouselPlayer = component$<PropsOf<typeof HeadlessCarousel.Player>>((props) => {
  const merged = [playerClass, props.class].filter(Boolean).join(" ");
  return (
    <HeadlessCarousel.Player {...props} class={merged}>
      <Slot />
    </HeadlessCarousel.Player>
  );
});

export const CarouselStepper: FunctionComponent<
  PropsOf<typeof HeadlessCarousel.Stepper>
> = (props) => {
  const { class: className, ...rest } = props;
  const merged = [stepperClass, className].filter(Boolean).join(" ");
  return <HeadlessCarousel.Stepper {...rest} class={merged} />;
};

export const CarouselStep = component$((props: PropsOf<typeof HeadlessCarousel.Step>) => {
  const merged = [stepClass, props.class].filter(Boolean).join(" ");
  return (
    <HeadlessCarousel.Step {...props} class={merged}>
      <Slot />
    </HeadlessCarousel.Step>
  );
});

/**
 * Složené API jako v {@link https://qwikui.com/docs/headless/carousel | Qwik UI Carousel}.
 */
export const Carousel = {
  Root: CarouselRoot,
  Scroller: CarouselScroller,
  Slide: CarouselSlide,
  Previous: CarouselPrevious,
  Next: CarouselNext,
  Pagination: CarouselPagination,
  Bullet: CarouselBullet,
  Title: CarouselTitle,
  Player: CarouselPlayer,
  Stepper: CarouselStepper,
  Step: CarouselStep,
};
