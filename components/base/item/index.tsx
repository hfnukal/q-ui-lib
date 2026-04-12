/**
 * @component item
 * @title Item
 * @version 1.0.0
 * @example Základ s akcí
 * Základ s akcí — viz ukázka níže.
 * ```tsx
 * import { Button } from "~/components/ui/button";
 * import { Item } from "~/components/ui/item";
 * 
 * <Item.Root variant="outline">
 *   <Item.Content>
 *     <Item.Title>Základní položka</Item.Title>
 *     <Item.Description>Krátký popis pod titulkem.</Item.Description>
 *   </Item.Content>
 *   <Item.Actions>
 *     <Button variant="secondary" size="sm">Akce</Button>
 *   </Item.Actions>
 * </Item.Root>
 * ```
 *
 * @example Varianty
 * Varianty — viz ukázka níže.
 * ```tsx
 * import { Item } from "~/components/ui/item";
 * 
 * <div class="flex max-w-md flex-col gap-4">
 *   <Item.Root>
 *     <Item.Content>
 *       <Item.Title>Výchozí</Item.Title>
 *       <Item.Description>Bez ohraničení, průhledné pozadí.</Item.Description>
 *     </Item.Content>
 *   </Item.Root>
 *   <Item.Root variant="outline">
 *     <Item.Content>
 *       <Item.Title>Outline</Item.Title>
 *       <Item.Description>Okraj a zvednutá plocha.</Item.Description>
 *     </Item.Content>
 *   </Item.Root>
 *   <Item.Root variant="muted">
 *     <Item.Content>
 *       <Item.Title>Muted</Item.Title>
 *       <Item.Description>Sekundární pozadí z tokenů.</Item.Description>
 *     </Item.Content>
 *   </Item.Root>
 * </div>
 * ```
 *
 * @example Ikona a odkaz
 * Ikona a odkaz — viz ukázka níže.
 * ```tsx
 * import { LuBadgeCheck } from "@qwikest/icons/lucide";
 * import { Item } from "~/components/ui/item";
 * 
 * <Item.Root variant="outline" size="sm" as="a" href="#" class="no-underline text-inherit">
 *   <Item.Media variant="icon">
 *     <LuBadgeCheck aria-hidden="true" />
 *   </Item.Media>
 *   <Item.Content>
 *     <Item.Title>Profil ověřen</Item.Title>
 *   </Item.Content>
 *   <Item.Actions>
 *     <span class="text-tertiary-label" aria-hidden="true">›</span>
 *   </Item.Actions>
 * </Item.Root>
 * ```
 *
 * @example Avatar a skupina
 * Avatar a skupina — viz ukázka níže.
 * ```tsx
 * import { Item } from "~/components/ui/item";
 * 
 * <Item.Group class="max-w-md">
 *   <Item.Root variant="outline">
 *     <Item.Content><Item.Title>První</Item.Title></Item.Content>
 *   </Item.Root>
 *   <Item.Separator />
 *   <Item.Root variant="outline">
 *     <Item.Content><Item.Title>Druhá</Item.Title></Item.Content>
 *   </Item.Root>
 * </Item.Group>
 * ```
 
 
 
 
 
 
 
 */

import { component$, type PropsOf, Slot } from "@builder.io/qwik";
import { Polymorphic } from "@qwik-ui/headless";

type ItemVariant = "default" | "outline" | "muted";
type ItemSize = "default" | "sm" | "xs";
type ItemMediaVariant = "default" | "icon" | "image" | "avatar";

function itemRootClass(variant: ItemVariant, size: ItemSize) {
  const base =
    "flex w-full flex-row items-center gap-3 text-left outline-none transition-colors rounded-lg focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background";

  const byVariant: Record<ItemVariant, string> = {
    default: "bg-transparent hover:bg-fill-tertiary/60",
    outline:
      "border border-separator-opaque bg-surface-raised shadow-sm hover:bg-surface-overlay",
    muted: "bg-fill-secondary hover:bg-fill-tertiary/80",
  };

  const bySize: Record<ItemSize, string> = {
    default: "gap-3 p-4",
    sm: "gap-2.5 p-3",
    xs: "gap-2 p-2",
  };

  return [base, byVariant[variant], bySize[size]].join(" ");
}

export type ItemRootProps = Omit<PropsOf<"div">, "as"> &
  Partial<Pick<PropsOf<"a">, "href" | "target" | "rel">> &
  Partial<Pick<PropsOf<"button">, "type" | "disabled">> & {
    /** Vykreslí jiný kořenový prvek než `div` (např. `a` pro celý řádek jako odkaz). */
    as?: keyof HTMLElementTagNameMap;
    variant?: ItemVariant;
    size?: ItemSize;
  };

/**
 * Hlavní kontejner řádku (media, titulek, popis, akce) ve stylu shadcn/ui Item.
 * Pro odkaz použijte `as="a"` a běžné atributy kotvy (`href`, …).
 */
export const ItemRoot = component$<ItemRootProps>((props) => {
  const {
    as = "div",
    variant = "default",
    size = "default",
    class: className,
    ...rest
  } = props;
  const merged = [itemRootClass(variant, size), className].filter(Boolean).join(" ");

  return (
    <Polymorphic as={as} {...rest} class={merged}>
      <Slot />
    </Polymorphic>
  );
});

export type ItemGroupProps = PropsOf<"div">;

/** Skupina položek se sjednoceným rozestupem (shadcn `ItemGroup`). */
export const ItemGroup = component$<ItemGroupProps>((props) => {
  const { class: className, ...rest } = props;
  const base = "flex w-full flex-col gap-2";
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <div {...rest} class={merged}>
      <Slot />
    </div>
  );
});

export type ItemSeparatorProps = PropsOf<"div">;

/** Oddělovač mezi položkami ve skupině. */
export const ItemSeparator = component$<ItemSeparatorProps>((props) => {
  const { class: className, role = "separator", ...rest } = props;
  const base = "my-1 h-px w-full shrink-0 bg-separator";
  const merged = [base, className].filter(Boolean).join(" ");

  return <div {...rest} class={merged} role={role} />;
});

export type ItemMediaProps = PropsOf<"div"> & {
  variant?: ItemMediaVariant;
};

function itemMediaClass(mediaVariant: ItemMediaVariant) {
  const base = "flex shrink-0 items-center justify-center";
  const byVariant: Record<ItemMediaVariant, string> = {
    default: "",
    icon: "size-10 rounded-md bg-fill-secondary text-secondary-label [&_svg]:size-5",
    image: "size-10 overflow-hidden rounded-md [&_img]:size-full [&_img]:object-cover",
    avatar: "shrink-0 self-center",
  };
  return [base, byVariant[mediaVariant]].filter(Boolean).join(" ");
}

/** Levá část řádku: ikona, obrázek nebo avatar. */
export const ItemMedia = component$<ItemMediaProps>((props) => {
  const { variant = "default", class: className, ...rest } = props;
  const merged = [itemMediaClass(variant), className].filter(Boolean).join(" ");

  return (
    <div {...rest} class={merged}>
      <Slot />
    </div>
  );
});

export type ItemContentProps = PropsOf<"div">;

/** Sloupec s titulkem a popisem; `min-w-0` kvůli zalamování v flex řádku. */
export const ItemContent = component$<ItemContentProps>((props) => {
  const { class: className, ...rest } = props;
  const base = "flex min-w-0 flex-1 flex-col gap-1";
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <div {...rest} class={merged}>
      <Slot />
    </div>
  );
});

export type ItemTitleProps = PropsOf<"div">;

export const ItemTitle = component$<ItemTitleProps>((props) => {
  const { class: className, ...rest } = props;
  const base = "font-medium text-label";
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <div {...rest} class={merged}>
      <Slot />
    </div>
  );
});

export type ItemDescriptionProps = PropsOf<"div">;

export const ItemDescription = component$<ItemDescriptionProps>((props) => {
  const { class: className, ...rest } = props;
  const base = "text-caption-1 text-secondary-label";
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <div {...rest} class={merged}>
      <Slot />
    </div>
  );
});

export type ItemActionsProps = PropsOf<"div">;

/** Pravá strana řádku (tlačítka, šipka). */
export const ItemActions = component$<ItemActionsProps>((props) => {
  const { class: className, ...rest } = props;
  const base = "flex shrink-0 flex-row items-center gap-2";
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <div {...rest} class={merged}>
      <Slot />
    </div>
  );
});

export type ItemHeaderProps = PropsOf<"div">;

/** Horní blok v kartě (např. obrázek přes celou šířku). */
export const ItemHeader = component$<ItemHeaderProps>((props) => {
  const { class: className, ...rest } = props;
  const base = "w-full overflow-hidden rounded-t-[inherit]";
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <div {...rest} class={merged}>
      <Slot />
    </div>
  );
});

export type ItemFooterProps = PropsOf<"div">;

/** Spodní blok pod obsahem. */
export const ItemFooter = component$<ItemFooterProps>((props) => {
  const { class: className, ...rest } = props;
  const base = "w-full border-t border-separator pt-3 mt-3";
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <div {...rest} class={merged}>
      <Slot />
    </div>
  );
});

/** Namespace: `Item.Root`, `Item.Group`, `Item.Media`, … */
export const Item = {
  Root: ItemRoot,
  Group: ItemGroup,
  Separator: ItemSeparator,
  Media: ItemMedia,
  Content: ItemContent,
  Title: ItemTitle,
  Description: ItemDescription,
  Actions: ItemActions,
  Header: ItemHeader,
  Footer: ItemFooter,
};
