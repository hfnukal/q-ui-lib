/**
 * @component menu-checkbox-item
 * @title MenuCheckboxItem
 * @version 1.0.0
 */

import { component$, type PropsOf, Slot } from "@builder.io/qwik";

export type MenuCheckboxItemRootProps = PropsOf<"div">;

/**
 * Vizuální layout zaškrtávací položky menu.
 * Kombinuj s `DropdownMenu.CheckboxItem` jako interaktivním wrapperem.
 */
export const MenuCheckboxItemRoot = component$<MenuCheckboxItemRootProps>((props) => {
  const { class: className, ...rest } = props;
  const base = "flex w-full items-center gap-2";
  const merged = [base, className].filter(Boolean).join(" ");
  return (
    <div {...rest} class={merged}>
      <Slot />
    </div>
  );
});

export type MenuCheckboxItemLabelProps = PropsOf<"span">;

/** Text zaškrtávací položky. */
export const MenuCheckboxItemLabel = component$<MenuCheckboxItemLabelProps>((props) => {
  const { class: className, ...rest } = props;
  const base = "flex-1 truncate";
  const merged = [base, className].filter(Boolean).join(" ");
  return (
    <span {...rest} class={merged}>
      <Slot />
    </span>
  );
});

export type MenuCheckboxItemEndProps = PropsOf<"span">;

/** Pravá plocha — typicky `KbdShortcut`. */
export const MenuCheckboxItemEnd = component$<MenuCheckboxItemEndProps>((props) => {
  const { class: className, ...rest } = props;
  const base = "ml-auto flex shrink-0 items-center gap-1 text-secondary-label";
  const merged = [base, className].filter(Boolean).join(" ");
  return (
    <span {...rest} class={merged}>
      <Slot />
    </span>
  );
});

/** Složené API: `MenuCheckboxItem.Root`, `MenuCheckboxItem.Label`, `MenuCheckboxItem.End`. */
export const MenuCheckboxItem = {
  Root: MenuCheckboxItemRoot,
  Label: MenuCheckboxItemLabel,
  End: MenuCheckboxItemEnd,
};
