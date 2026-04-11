/**
 * @component card
 * @title Card
 * @version 1.0.1
 */

import { component$, type PropsOf, Slot } from "@builder.io/qwik";

export type CardRootProps = PropsOf<"div">;

/**
 * Kontejner karty — `grouped-surface`, okraj a stín (COLORS.md). Bez @qwik-ui/headless.
 */
export const CardRoot = component$<CardRootProps>((props) => {
  const { class: className, ...rest } = props;
  const base =
    "overflow-hidden rounded-xl border border-separator-opaque bg-grouped-surface text-label shadow-sm";
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <div {...rest} class={merged}>
      <Slot />
    </div>
  );
});

export type CardHeaderProps = PropsOf<"div">;

/**
 * Horní blok (titulek, popis, volitelně {@link CardAction}).
 * S `Card.Action` použije mřížku — akce vpravo nahoře (shadcn CardHeader).
 */
export const CardHeader = component$<CardHeaderProps>((props) => {
  const { class: className, ...rest } = props;
  const base =
    "@container/card-header grid auto-rows-min grid-cols-1 gap-1.5 p-6 has-[[data-slot=card-action]]:grid-cols-[1fr_auto]";
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <div {...rest} class={merged}>
      <Slot />
    </div>
  );
});

export type CardTitleProps = PropsOf<"h3">;

/** Nadpis sekce karty. */
export const CardTitle = component$<CardTitleProps>((props) => {
  const { class: className, ...rest } = props;
  const base =
    "col-start-1 row-start-1 text-title-3 font-semibold leading-none tracking-tight text-label";
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <h3 {...rest} class={merged}>
      <Slot />
    </h3>
  );
});

export type CardDescriptionProps = PropsOf<"p">;

/** Sekundární text pod titulkem. */
export const CardDescription = component$<CardDescriptionProps>((props) => {
  const { class: className, ...rest } = props;
  const base = "col-start-1 row-start-2 text-caption-1 text-secondary-label";
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <p {...rest} class={merged}>
      <Slot />
    </p>
  );
});

export type CardActionProps = PropsOf<"div">;

/** Akce v hlavičce vpravo (menu, odkaz, badge). Vyžaduje `data-slot` pro rozložení mřížky. */
export const CardAction = component$<CardActionProps>((props) => {
  const { class: className, ...rest } = props;
  const base =
    "col-start-2 row-start-1 row-span-2 shrink-0 justify-self-end self-start";
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <div {...rest} data-slot="card-action" class={merged}>
      <Slot />
    </div>
  );
});

export type CardMediaProps = PropsOf<"div"> & {
  /** `image` — poměr stran a vyplnění pro `<img>` jako u přebalu karty. */
  variant?: "default" | "image";
};

/** Horní (nebo vlastní) média — obrázek, ilustrace. Kořen karty má `overflow-hidden` kvůli oříznutí rohů. */
export const CardMedia = component$<CardMediaProps>((props) => {
  const { variant = "default", class: className, ...rest } = props;
  const byVariant = {
    default: "bg-fill-tertiary/40",
    image:
      "aspect-video bg-fill-tertiary/40 [&_img]:h-full [&_img]:w-full [&_img]:object-cover",
  }[variant];
  const base = `relative w-full overflow-hidden ${byVariant}`;
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <div {...rest} class={merged}>
      <Slot />
    </div>
  );
});

export type CardContentProps = PropsOf<"div">;

/** Hlavní obsah (typicky pod hlavičkou). */
export const CardContent = component$<CardContentProps>((props) => {
  const { class: className, ...rest } = props;
  const base = "p-6 pt-0";
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <div {...rest} class={merged}>
      <Slot />
    </div>
  );
});

export type CardFooterProps = PropsOf<"div">;

/** Akce nebo metadata pod obsahem. */
export const CardFooter = component$<CardFooterProps>((props) => {
  const { class: className, ...rest } = props;
  const base = "flex flex-row items-center p-6 pt-0";
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <div {...rest} class={merged}>
      <Slot />
    </div>
  );
});

/** Namespace: `Card.Root`, `Card.Header`, `Card.Title`, … */
export const Card = {
  Root: CardRoot,
  Media: CardMedia,
  Header: CardHeader,
  Title: CardTitle,
  Description: CardDescription,
  Action: CardAction,
  Content: CardContent,
  Footer: CardFooter,
};
