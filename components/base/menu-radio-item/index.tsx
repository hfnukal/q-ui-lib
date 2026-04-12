/**
 * @component menu-radio-item
 * @title MenuRadioItem
 * @version 1.0.0
 * @example V DropdownMenu.RadioGroup
 * Skupina radio položek — první ukázka v demu.
 * ```tsx
 * import { DropdownMenu } from "~/components/ui/dropdown-menu";
 * import { MenuRadioItem } from "~/components/ui/menu-radio-item";
 * 
 * <DropdownMenu.Root>
 *   <DropdownMenu.Trigger>Motiv</DropdownMenu.Trigger>
 *   <DropdownMenu.Popover>
 *     <DropdownMenu.RadioGroup value="light">
 *       <DropdownMenu.RadioItem value="light">
 *         <MenuRadioItem.Root>
 *           <MenuRadioItem.Label>Světlý</MenuRadioItem.Label>
 *           <MenuRadioItem.End><KbdShortcut>⌘1</KbdShortcut></MenuRadioItem.End>
 *         </MenuRadioItem.Root>
 *       </DropdownMenu.RadioItem>
 *       <DropdownMenu.RadioItem value="dark">
 *         <MenuRadioItem.Root>
 *           <MenuRadioItem.Label>Tmavý</MenuRadioItem.Label>
 *           <MenuRadioItem.End><KbdShortcut>⌘2</KbdShortcut></MenuRadioItem.End>
 *         </MenuRadioItem.Root>
 *       </DropdownMenu.RadioItem>
 *       <DropdownMenu.RadioItem value="system">
 *         <MenuRadioItem.Root>
 *           <MenuRadioItem.Label>Systémový</MenuRadioItem.Label>
 *         </MenuRadioItem.Root>
 *       </DropdownMenu.RadioItem>
 *     </DropdownMenu.RadioGroup>
 *   </DropdownMenu.Popover>
 * </DropdownMenu.Root>
 * ```
 *
 * @example Layout samotný
 * Samostatný řádek bez `RadioGroup` — jen vzhled.
 * ```tsx
 * import { MenuRadioItem } from "~/components/ui/menu-radio-item";
 * import { KbdShortcut } from "~/components/ui/kbd-shortcut";
 * 
 * <MenuRadioItem.Root>
 *   <MenuRadioItem.Label>Světlý motiv</MenuRadioItem.Label>
 *   <MenuRadioItem.End><KbdShortcut>⌘1</KbdShortcut></MenuRadioItem.End>
 * </MenuRadioItem.Root>
 * ```
 
 
 
 
 
 
 
 */

import { component$, type PropsOf, Slot } from "@builder.io/qwik";

export type MenuRadioItemRootProps = PropsOf<"div">;

/**
 * Vizuální layout radio položky menu.
 * Kombinuj s `DropdownMenu.RadioItem` jako interaktivním wrapperem.
 */
export const MenuRadioItemRoot = component$<MenuRadioItemRootProps>((props) => {
  const { class: className, ...rest } = props;
  const base = "flex w-full items-center gap-2";
  const merged = [base, className].filter(Boolean).join(" ");
  return (
    <div {...rest} class={merged}>
      <Slot />
    </div>
  );
});

export type MenuRadioItemLabelProps = PropsOf<"span">;

/** Text radio položky. */
export const MenuRadioItemLabel = component$<MenuRadioItemLabelProps>((props) => {
  const { class: className, ...rest } = props;
  const base = "flex-1 truncate";
  const merged = [base, className].filter(Boolean).join(" ");
  return (
    <span {...rest} class={merged}>
      <Slot />
    </span>
  );
});

export type MenuRadioItemEndProps = PropsOf<"span">;

/** Pravá plocha — typicky `KbdShortcut`. */
export const MenuRadioItemEnd = component$<MenuRadioItemEndProps>((props) => {
  const { class: className, ...rest } = props;
  const base = "ml-auto flex shrink-0 items-center gap-1 text-secondary-label";
  const merged = [base, className].filter(Boolean).join(" ");
  return (
    <span {...rest} class={merged}>
      <Slot />
    </span>
  );
});

/** Složené API: `MenuRadioItem.Root`, `MenuRadioItem.Label`, `MenuRadioItem.End`. */
export const MenuRadioItem = {
  Root: MenuRadioItemRoot,
  Label: MenuRadioItemLabel,
  End: MenuRadioItemEnd,
};
