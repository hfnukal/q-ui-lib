/**
 * @component card
 * @title Card
 * @version 1.0.1
 * @example Full composition
 * Compound API: `Card.Root`, `Media`, `Header`, `Title`, `Description`, `Action`, `Content`, `Footer`.
 * ```tsx
 * import { Button } from "~/components/ui/base/button";
 * import { Card } from "~/components/ui/base/card";
 * 
 * <Card.Root class="max-w-md">
 *   <Card.Header>
 *     <Card.Title>Notifications</Card.Title>
 *     <Card.Description>
 *       A summary of changes over the past week.
 *     </Card.Description>
 *   </Card.Header>
 *   <Card.Content>
 *     <p class="text-body text-secondary-label">
 *       You have 3 unread messages and 1 scheduled event.
 *     </p>
 *   </Card.Content>
 *   <Card.Footer class="gap-2">
 *     <Button variant="secondary" size="sm">
 *       Later
 *     </Button>
 *     <Button size="sm">Open</Button>
 *   </Card.Footer>
 * </Card.Root>
 * ```
 *
 * @example Header with action
 * `Card.Action` enables a two-column layout in the header (title and description on the left, action on the right).
 * ```tsx
 * import { Button } from "~/components/ui/base/button";
 * import { Card } from "~/components/ui/base/card";
 * 
 * <Card.Root class="max-w-md">
 *   <Card.Header>
 *     <Card.Title>Account</Card.Title>
 *     <Card.Description>Sign in with email and password.</Card.Description>
 *     <Card.Action>
 *       <Button
 *         variant="secondary"
 *         size="sm"
 *         class="border-0 bg-transparent px-2 text-link shadow-none hover:bg-transparent hover:underline"
 *       >
 *         Sign up
 *       </Button>
 *     </Card.Action>
 *   </Card.Header>
 *   <Card.Content>
 *     <p class="text-body text-secondary-label">… form …</p>
 *   </Card.Content>
 * </Card.Root>
 * ```
 *
 * @example Media on top
 * `Card.Media` with `variant=&quot;image&quot;` for aspect ratio and image fill; the card root has `overflow-hidden`.
 * ```tsx
 * import { Badge } from "~/components/ui/base/badge";
 * import { Button } from "~/components/ui/base/button";
 * import { Card } from "~/components/ui/base/card";
 * 
 * <Card.Root class="max-w-sm">
 *   <Card.Media variant="image">
 *     <img
 *       src="https://picsum.photos/seed/qcard/640/360"
 *       width={640}
 *       height={360}
 *       alt="Event illustration"
 *     />
 *   </Card.Media>
 *   <Card.Header>
 *     <Card.Title>Design systems meetup</Card.Title>
 *     <Card.Description>
 *       Components, accessibility and faster delivery.
 *     </Card.Description>
 *     <Card.Action>
 *       <Badge variant="secondary">Featured</Badge>
 *     </Card.Action>
 *   </Card.Header>
 *   <Card.Footer>
 *     <Button class="w-full">Event details</Button>
 *   </Card.Footer>
 * </Card.Root>
 * ```
 *
 * @example Content only
 * A minimal card with only `Card.Content` and custom padding via `class`.
 * ```tsx
 * import { Card } from "~/components/ui/base/card";
 * 
 * <Card.Root class="max-w-sm">
 *   <Card.Content class="pt-6">
 *     <p class="text-body text-label">
 *       A content-only card — custom padding via{" "}
 *       <code class="text-caption-1">class</code> na{" "}
 *       <code class="text-caption-1">Card.Content</code>.
 *     </p>
 *   </Card.Content>
 * </Card.Root>
 * ```
 
 
 
 
 
 
 
 
 
 */

import { component$, type PropsOf, Slot } from "@builder.io/qwik";
import { Polymorphic } from "@qwik-ui/headless";

export type CardRootProps = Omit<PropsOf<"div">, "as"> & {
  /**
   * Root element. Default is `span` for safe insertion into text parents (`p`/`pre`).
   * For block usage set `as="div"`.
   */
  as?: "div" | "span";
};

/**
 * Card container — `grouped-surface`, border and shadow (COLORS.md). Without @qwik-ui/headless.
 * Via `as` you can switch the root between `span` (default) and `div`.
 * Into `<p>`/`<pre>` insert only the `as="span"` variant and only with phrasing content;
 * for regular block content use a parent `<div>/<section>` or `as="div"`.
 */
export const CardRoot = component$<CardRootProps>((props) => {
  const { class: className, as = "span", ...rest } = props;
  const base =
    "block overflow-hidden rounded-xl border border-separator-opaque bg-grouped-surface text-label shadow-sm";
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <Polymorphic as={as} {...rest} class={merged}>
      <Slot />
    </Polymorphic>
  );
});

export type CardHeaderProps = PropsOf<"div">;

/**
 * Top block (title, description, optionally {@link CardAction}).
 * With `Card.Action` it uses a grid — action at the top right (shadcn CardHeader).
 */
export const CardHeader = component$<CardHeaderProps>((props) => {
  const { class: className, ...rest } = props;
  const base =
    "@container/card-header grid auto-rows-min grid-cols-1 gap-1.5 p-3 has-[[data-slot=card-action]]:grid-cols-[1fr_auto]";
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <div {...rest} class={merged}>
      <Slot />
    </div>
  );
});

export type CardTitleProps = PropsOf<"h3">;

/** Card section heading. */
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

/** Secondary text below the title. */
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

/** Action in the header on the right (menu, link, badge). Requires `data-slot` for the grid layout. */
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
  /** `image` — aspect ratio and fill for `<img>` like a card cover. */
  variant?: "default" | "image";
};

/** Top (or custom) media — image, illustration. The card root has `overflow-hidden` to clip the corners. */
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

/** Main content (typically below the header). */
export const CardContent = component$<CardContentProps>((props) => {
  const { class: className, ...rest } = props;
  const base = "p-3 pt-0";
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <div {...rest} class={merged}>
      <Slot />
    </div>
  );
});

export type CardFooterProps = PropsOf<"div">;

/** Actions or metadata below the content. */
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
