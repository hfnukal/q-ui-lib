/**
 * @component card
 * @title Card
 * @version 1.0.1
 * @example Úplná skladba
 * Složené API: `Card.Root`, `Media`, `Header`, `Title`, `Description`, `Action`, `Content`, `Footer`.
 * ```tsx
 * import { Button } from "~/components/ui/button";
 * import { Card } from "~/components/ui/card";
 * 
 * <Card.Root class="max-w-md">
 *   <Card.Header>
 *     <Card.Title>Oznámení</Card.Title>
 *     <Card.Description>
 *       Shrnutí změn za poslední týden.
 *     </Card.Description>
 *   </Card.Header>
 *   <Card.Content>
 *     <p class="text-body text-secondary-label">
 *       Máte 3 nepřečtené zprávy a 1 naplánovanou událost.
 *     </p>
 *   </Card.Content>
 *   <Card.Footer class="gap-2">
 *     <Button variant="secondary" size="sm">
 *       Později
 *     </Button>
 *     <Button size="sm">Otevřít</Button>
 *   </Card.Footer>
 * </Card.Root>
 * ```
 *
 * @example Hlavička s akcí
 * `Card.Action` zapne v hlavičce dvousloupcové rozložení (titulek a popis vlevo, akce vpravo).
 * ```tsx
 * import { Button } from "~/components/ui/button";
 * import { Card } from "~/components/ui/card";
 * 
 * <Card.Root class="max-w-md">
 *   <Card.Header>
 *     <Card.Title>Účet</Card.Title>
 *     <Card.Description>Přihlášení e-mailem a heslem.</Card.Description>
 *     <Card.Action>
 *       <Button
 *         variant="secondary"
 *         size="sm"
 *         class="border-0 bg-transparent px-2 text-link shadow-none hover:bg-transparent hover:underline"
 *       >
 *         Registrace
 *       </Button>
 *     </Card.Action>
 *   </Card.Header>
 *   <Card.Content>
 *     <p class="text-body text-secondary-label">… formulář …</p>
 *   </Card.Content>
 * </Card.Root>
 * ```
 *
 * @example Média nahoře
 * `Card.Media` s `variant=&quot;image&quot;` pro poměr stran a vyplnění obrázku; kořen karty má `overflow-hidden`.
 * ```tsx
 * import { Badge } from "~/components/ui/badge";
 * import { Button } from "~/components/ui/button";
 * import { Card } from "~/components/ui/card";
 * 
 * <Card.Root class="max-w-sm">
 *   <Card.Media variant="image">
 *     <img
 *       src="https://picsum.photos/seed/qcard/640/360"
 *       width={640}
 *       height={360}
 *       alt="Ilustrace události"
 *     />
 *   </Card.Media>
 *   <Card.Header>
 *     <Card.Title>Meetup design systémů</Card.Title>
 *     <Card.Description>
 *       Komponenty, přístupnost a rychlejší dodávky.
 *     </Card.Description>
 *     <Card.Action>
 *       <Badge variant="secondary">Vybrané</Badge>
 *     </Card.Action>
 *   </Card.Header>
 *   <Card.Footer>
 *     <Button class="w-full">Detail akce</Button>
 *   </Card.Footer>
 * </Card.Root>
 * ```
 *
 * @example Jen obsah
 * Minimální karta jen s `Card.Content` a vlastním odsazením přes `class`.
 * ```tsx
 * import { Card } from "~/components/ui/card";
 * 
 * <Card.Root class="max-w-sm">
 *   <Card.Content class="pt-6">
 *     <p class="text-body text-label">
 *       Karta jen s obsahem — vlastní odsazení přes{" "}
 *       <code class="text-caption-1">class</code> na{" "}
 *       <code class="text-caption-1">Card.Content</code>.
 *     </p>
 *   </Card.Content>
 * </Card.Root>
 * ```
 
 
 
 
 
 
 
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
