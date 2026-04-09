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
  "rounded-lg border border-separator-opaque bg-surface-base";

const slideClass =
  "flex min-h-[120px] flex-col justify-center rounded-md border border-separator-opaque bg-surface-raised p-6 text-body text-label shadow-sm";

const navButtonClass =
  "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-separator-opaque bg-surface-raised text-secondary-label shadow-sm transition-colors hover:bg-surface-overlay focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-40";

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

export const CarouselSlide = component$<PropsOf<typeof HeadlessCarousel.Slide>>(
  (props) => {
    const { class: className, ...rest } = props;
    const merged = [slideClass, className].filter(Boolean).join(" ");
    return <HeadlessCarousel.Slide {...rest} class={merged} />;
  },
);

export const CarouselBullet = component$<PropsOf<typeof HeadlessCarousel.Bullet>>(
  (props) => {
    const { class: className, ...rest } = props;
    const merged = [bulletClass, className].filter(Boolean).join(" ");
    return <HeadlessCarousel.Bullet {...rest} class={merged} />;
  },
);

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
    ...rest
  } = props;
  const merged = [rootClass, className].filter(Boolean).join(" ");
  return (
    <HeadlessCarousel.Root
      {...rest}
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

export const CarouselPrevious = component$<PropsOf<typeof HeadlessCarousel.Previous>>(
  (props) => {
    const { class: className, ...rest } = props;
    const merged = [navButtonClass, className].filter(Boolean).join(" ");
    return <HeadlessCarousel.Previous {...rest} class={merged} />;
  },
);

export const CarouselNext = component$<PropsOf<typeof HeadlessCarousel.Next>>((props) => {
  const { class: className, ...rest } = props;
  const merged = [navButtonClass, className].filter(Boolean).join(" ");
  return <HeadlessCarousel.Next {...rest} class={merged} />;
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

export const CarouselPlayer = component$<PropsOf<typeof HeadlessCarousel.Player>>(
  (props) => {
    const { class: className, ...rest } = props;
    const merged = [playerClass, className].filter(Boolean).join(" ");
    return <HeadlessCarousel.Player {...rest} class={merged} />;
  },
);

export const CarouselStepper: FunctionComponent<
  PropsOf<typeof HeadlessCarousel.Stepper>
> = (props) => {
  const { class: className, ...rest } = props;
  const merged = [stepperClass, className].filter(Boolean).join(" ");
  return <HeadlessCarousel.Stepper {...rest} class={merged} />;
};

export const CarouselStep = component$((props: PropsOf<typeof HeadlessCarousel.Step>) => {
  const { class: className, ...rest } = props;
  const merged = [stepClass, className].filter(Boolean).join(" ");
  return <HeadlessCarousel.Step {...rest} class={merged} />;
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
