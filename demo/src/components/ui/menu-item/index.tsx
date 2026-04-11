/**
 * @component menu-item
 * @title MenuItem
 * @version 1.0.0
 */

import { component$, type PropsOf, Slot } from "@builder.io/qwik";

export type MenuItemRootProps = PropsOf<"div">;

/**
 * Vizuální layout řádku menu — kombinuj s interaktivním wrapperem
 * (např. `DropdownMenu.Item`). Skládá `Start`, `Label`, `End`.
 */
export const MenuItemRoot = component$<MenuItemRootProps>((props) => {
  const { class: className, ...rest } = props;
  const base = "flex w-full items-center gap-2";
  const merged = [base, className].filter(Boolean).join(" ");
  return (
    <div {...rest} class={merged}>
      <Slot />
    </div>
  );
});

export type MenuItemStartProps = PropsOf<"span">;

/** Levá plocha pro ikonu nebo jinou vizuální indikaci. */
export const MenuItemStart = component$<MenuItemStartProps>((props) => {
  const { class: className, ...rest } = props;
  const base =
    "flex shrink-0 items-center justify-center text-secondary-label [&_svg]:h-4 [&_svg]:w-4";
  const merged = [base, className].filter(Boolean).join(" ");
  return (
    <span {...rest} class={merged}>
      <Slot />
    </span>
  );
});

export type MenuItemLabelProps = PropsOf<"span">;

/** Hlavní text položky — roztahuje se do dostupného prostoru. */
export const MenuItemLabel = component$<MenuItemLabelProps>((props) => {
  const { class: className, ...rest } = props;
  const base = "flex-1 truncate";
  const merged = [base, className].filter(Boolean).join(" ");
  return (
    <span {...rest} class={merged}>
      <Slot />
    </span>
  );
});

export type MenuItemEndProps = PropsOf<"span">;

/** Pravá plocha — typicky `KbdShortcut` nebo badge. */
export const MenuItemEnd = component$<MenuItemEndProps>((props) => {
  const { class: className, ...rest } = props;
  const base = "ml-auto flex shrink-0 items-center gap-1 text-secondary-label";
  const merged = [base, className].filter(Boolean).join(" ");
  return (
    <span {...rest} class={merged}>
      <Slot />
    </span>
  );
});

/** Složené API: `MenuItem.Root`, `MenuItem.Start`, `MenuItem.Label`, `MenuItem.End`. */
export const MenuItem = {
  Root: MenuItemRoot,
  Start: MenuItemStart,
  Label: MenuItemLabel,
  End: MenuItemEnd,
};
