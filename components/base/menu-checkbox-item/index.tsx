/**
 * @component menu-checkbox-item
 * @title MenuCheckboxItem
 * @version 1.0.0
 * @example Layout samotný
 * Layout samotný — viz ukázka níže.
 * ```tsx
 * import { MenuCheckboxItem } from "~/components/ui/menu-checkbox-item";
 * import { KbdShortcut } from "~/components/ui/kbd-shortcut";
 * 
 * <MenuCheckboxItem.Root>
 *   <MenuCheckboxItem.Label>Zobrazit panel</MenuCheckboxItem.Label>
 *   <MenuCheckboxItem.End><KbdShortcut>⌘B</KbdShortcut></MenuCheckboxItem.End>
 * </MenuCheckboxItem.Root>
 * ```
 *
 * @example V DropdownMenu.CheckboxItem
 * Fajfka se zobrazí automaticky. Stav řídí reaktivní signál přes `bind:checked`.
 * ```tsx
 * import { useSignal } from "@builder.io/qwik";
 * import { DropdownMenu } from "~/components/ui/dropdown-menu";
 * import { MenuCheckboxItem } from "~/components/ui/menu-checkbox-item";
 * 
 * export default component$(() => {
 *   const sidebar = useSignal(true);
 *   const statusBar = useSignal(false);
 *   return (
 *     <DropdownMenu.Root>
 *       <DropdownMenu.Trigger>Zobrazení</DropdownMenu.Trigger>
 *       <DropdownMenu.Popover>
 *         <DropdownMenu.CheckboxItem bind:checked={sidebar}>
 *           <MenuCheckboxItem.Root>
 *             <MenuCheckboxItem.Label>Postranní panel</MenuCheckboxItem.Label>
 *             <MenuCheckboxItem.End><KbdShortcut>⌘B</KbdShortcut></MenuCheckboxItem.End>
 *           </MenuCheckboxItem.Root>
 *         </DropdownMenu.CheckboxItem>
 *         <DropdownMenu.CheckboxItem bind:checked={statusBar}>
 *           <MenuCheckboxItem.Root>
 *             <MenuCheckboxItem.Label>Stavový řádek</MenuCheckboxItem.Label>
 *           </MenuCheckboxItem.Root>
 *         </DropdownMenu.CheckboxItem>
 *       </DropdownMenu.Popover>
 *     </DropdownMenu.Root>
 *   );
 * });
 * ```
 
 
 
 
 
 
 
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
