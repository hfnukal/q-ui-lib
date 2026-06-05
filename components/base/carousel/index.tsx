/**
 * @component carousel
 * @title Carousel
 * @version 1.0.0
 * @example Centered dots (pagination)
 * Below the carousel are centered dots: the active slide is filled, the others are just outlined. Click a dot to go to that slide. The arrows are textual (‹ ›), without icons. Inside each slide is a complete `Card` with a title, description and content; `Carousel.Slide` has `border-0 bg-transparent p-0` so the two frames don't clash.
 * ```tsx
 * import { Card } from "~/components/ui/base/card";
 * import { Carousel } from "~/components/ui/base/carousel";
 * 
 * <Carousel.Root class="max-w-xl" rewind>
 *   <Carousel.Title>Carousel</Carousel.Title>
 *   <div class="relative px-11">
 *     <Carousel.Scroller>
 *       <Carousel.Slide class="border-0 bg-transparent p-0 shadow-none">
 *         <Card.Root class="w-full">
 *           <Card.Header>
 *             <Card.Title>First card</Card.Title>
 *             <Card.Description>Brief subtitle</Card.Description>
 *           </Card.Header>
 *           <Card.Content>
 *             <p class="text-callout text-secondary-label">Slide content.</p>
 *           </Card.Content>
 *         </Card.Root>
 *       </Carousel.Slide>
 *       <Carousel.Slide class="border-0 bg-transparent p-0 shadow-none">
 *         <Card.Root class="w-full">
 *           <Card.Header>
 *             <Card.Title>Second card</Card.Title>
 *             <Card.Description>Another slide</Card.Description>
 *           </Card.Header>
 *           <Card.Content>
 *             <p class="text-callout text-secondary-label">Same layout as the first slide.</p>
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
 * @example Autoplay and player
 * `bind:autoplay` and `Carousel.Player` — for users with `prefers-reduced-motion` the player button is hidden (headless CSS). The slides are again cards with content.
 * ```tsx
 * import { component$, useSignal } from "@builder.io/qwik";
 * import { Card } from "~/components/ui/base/card";
 * import { Carousel } from "~/components/ui/base/carousel";
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
 *               <p class="text-callout text-secondary-label">First card content.</p>
 *             </Card.Content>
 *           </Card.Root>
 *         </Carousel.Slide>
 *         <Carousel.Slide class="border-0 bg-transparent p-0 shadow-none">
 *           <Card.Root class="w-full">
 *             <Card.Header>
 *               <Card.Title>Second card</Card.Title>
 *               <Card.Description>Another slide in the loop</Card.Description>
 *             </Card.Header>
 *             <Card.Content>
 *               <p class="text-callout text-secondary-label">Same layout as the first slide; autoplay continues at the interval.</p>
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
 * @example Stepper (numbered steps)
 * `Carousel.Stepper` and `Carousel.Step` — cards in slides, jump directly by number.
 * ```tsx
 * import { Card } from "~/components/ui/base/card";
 * import { Carousel } from "~/components/ui/base/carousel";
 * 
 * <Carousel.Root class="max-w-md" rewind>
 *   <Carousel.Title>Steps</Carousel.Title>
 *   <Carousel.Scroller>
 *     <Carousel.Slide class="border-0 bg-transparent p-0 shadow-none">
 *       <Card.Root class="w-full">
 *         <Card.Header>
 *           <Card.Title>Step 1</Card.Title>
 *           <Card.Description>Template selection</Card.Description>
 *         </Card.Header>
 *         <Card.Content>
 *           <p class="text-callout text-secondary-label">Choose the base layout; the next steps will complete it.</p>
 *         </Card.Content>
 *       </Card.Root>
 *     </Carousel.Slide>
 *     <Carousel.Slide class="border-0 bg-transparent p-0 shadow-none">
 *       <Card.Root class="w-full">
 *         <Card.Header>
 *           <Card.Title>Step 2</Card.Title>
 *           <Card.Description>Content setup</Card.Description>
 *         </Card.Header>
 *         <Card.Content>
 *           <p class="text-callout text-secondary-label">Edit the texts and images; the preview updates instantly.</p>
 *         </Card.Content>
 *       </Card.Root>
 *     </Carousel.Slide>
 *     <Carousel.Slide class="border-0 bg-transparent p-0 shadow-none">
 *       <Card.Root class="w-full">
 *         <Card.Header>
 *           <Card.Title>Step 3</Card.Title>
 *           <Card.Description>Publishing</Card.Description>
 *         </Card.Header>
 *         <Card.Content>
 *           <p class="text-callout text-secondary-label">Review the preview and confirm publishing.</p>
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

/** Appearance is based on the shadcn Carousel concept; colors and tokens from COLORS.md. */

const rootClass = "relative w-full";

const scrollerClass =
  "min-h-[8rem] rounded-lg border border-separator-opaque bg-surface-base";

const scrollerFramelessClass = "min-h-[8rem] rounded-lg";

const slideClass =
  "flex min-h-[120px] flex-col justify-center rounded-md border border-separator-opaque bg-surface-raised p-6 text-body text-label shadow-sm";

const slideFramelessClass =
  "flex min-h-[120px] flex-col justify-center rounded-md bg-transparent p-0 text-body text-label shadow-none";

const navButtonClass =
  "relative z-10 inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-separator-opaque bg-surface-raised text-secondary-label shadow-sm transition-colors hover:bg-surface-overlay focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40";

const paginationClass =
  "flex flex-wrap items-center justify-center gap-2 pt-2";

/** Inactive: just an outline; active (`aria-selected`): filled dot. Clicking is handled by headless. */
const bulletClass =
  "box-border h-2.5 w-2.5 shrink-0 cursor-pointer rounded-full border-2 border-secondary-label/45 bg-transparent transition-colors hover:border-accent/80 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 aria-selected:border-accent aria-selected:bg-accent";

const titleWrapperClass = "sr-only";

const playerClass =
  "inline-flex h-9 items-center gap-2 rounded-md border border-separator-opaque bg-surface-raised px-3 text-callout font-medium text-label shadow-sm hover:bg-surface-overlay focus:outline-none focus-visible:ring-2 focus-visible:ring-ring";

const stepperClass = "mt-1.5 flex flex-wrap gap-1.5";

const stepClass =
  "inline-flex min-h-7 min-w-7 items-center justify-center rounded-md border border-separator-opaque bg-surface-raised px-1.5 text-callout font-medium text-secondary-label aria-[current=step]:border-accent aria-[current=step]:text-label";

/** Umístění šipek Previous / Next vůči oblasti slidů. */
export type CarouselArrowsPlacement =
  | "sides-center"
  | "bottom-left"
  | "bottom-right"
  | "bottom-center"
  | "bottom-sides"
  | "hide";

export type CarouselArrowsLayout = {
  /** Obal kolem Scroller + šipek. */
  stage: string;
  previous: string;
  next: string;
  /** Šipky vlevo a vpravo od posuvníku, svisle vycentrované k obsahu. */
  arrowsInline: boolean;
  /** Šipky pod karuselem. */
  arrowsBelow: boolean;
  arrowsRow: string;
  /** Bez tlačítek Previous / Next. */
  arrowsHidden: boolean;
};

/** Třídy pro rozložení šipek podle zvolené varianty. */
export function carouselArrowsLayout(
  placement: CarouselArrowsPlacement = "sides-center",
): CarouselArrowsLayout {
  switch (placement) {
    case "hide":
      return {
        stage: "relative w-full min-w-0",
        previous: "",
        next: "",
        arrowsInline: false,
        arrowsBelow: false,
        arrowsRow: "",
        arrowsHidden: true,
      };
    case "bottom-left":
      return {
        stage: "relative w-full min-w-0",
        previous: "",
        next: "",
        arrowsInline: false,
        arrowsBelow: true,
        arrowsRow: "mt-2 flex w-full items-center justify-start gap-2",
        arrowsHidden: false,
      };
    case "bottom-right":
      return {
        stage: "relative w-full min-w-0",
        previous: "",
        next: "",
        arrowsInline: false,
        arrowsBelow: true,
        arrowsRow: "mt-2 flex w-full items-center justify-end gap-2",
        arrowsHidden: false,
      };
    case "bottom-center":
      return {
        stage: "relative w-full min-w-0",
        previous: "",
        next: "",
        arrowsInline: false,
        arrowsBelow: true,
        arrowsRow: "mt-2 flex w-full items-center justify-center gap-2",
        arrowsHidden: false,
      };
    case "bottom-sides":
      return {
        stage: "relative w-full min-w-0",
        previous: "",
        next: "",
        arrowsInline: false,
        arrowsBelow: true,
        arrowsRow: "mt-2 flex w-full items-center justify-between gap-2",
        arrowsHidden: false,
      };
    case "sides-center":
    default:
      return {
        stage:
          "grid w-full min-w-0 grid-cols-[auto_1fr_auto] items-center gap-2",
        previous: "",
        next: "",
        arrowsInline: true,
        arrowsBelow: false,
        arrowsRow: "",
        arrowsHidden: false,
      };
  }
}

export type CarouselRootProps = PropsOf<typeof HeadlessCarousel.Root>;

/** `component$` + {@link Slot} — the same pattern as Checkbox/Label: otherwise the children are not projected into the headless primitive. */
export type CarouselSlideProps = PropsOf<typeof HeadlessCarousel.Slide> & {
  /** Bez rámečku, stínu a výchozího paddingu slidu. */
  frameless?: boolean;
};

export const CarouselSlide = component$<CarouselSlideProps>((props) => {
  const { frameless, class: className, ...rest } = props;
  const base = frameless ? slideFramelessClass : slideClass;
  const merged = [base, className].filter(Boolean).join(" ");
  return (
    <HeadlessCarousel.Slide {...rest} class={merged}>
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
 * {@link https://qwikui.com/docs/headless/carousel | Carousel.Root}: default styles and passing custom {@link CarouselSlide} / {@link CarouselBullet} / {@link CarouselTitle}.
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

export type CarouselScrollerProps = PropsOf<typeof HeadlessCarousel.Scroller> & {
  /** Bez rámečku a pozadí oblasti posuvníku. */
  frameless?: boolean;
};

export const CarouselScroller: FunctionComponent<CarouselScrollerProps> = (props) => {
  const { class: className, frameless, ...rest } = props;
  const base = frameless ? scrollerFramelessClass : scrollerClass;
  const merged = [base, className].filter(Boolean).join(" ");
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
 * Wrapper around the headless title (the id for aria stays inside); the default is screen-reader-only — override `class` for a visible heading.
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
 * Compound API as in {@link https://qwikui.com/docs/headless/carousel | Qwik UI Carousel}.
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
