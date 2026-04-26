/**
 * @component menubar
 * @title Menubar
 * @version 1.2.0
 * @example Lišta s podmenu
 * `Menubar.Root` → pro každé menu `Menubar.Menu` + `Menubar.useMenu("id")` → `Menubar.Trigger` + `Menubar.Content` s položkami.
 * ```tsx
 * import { component$ } from "@builder.io/qwik";
 * import { Menubar } from "~/components/ui/base/menubar";
 * 
 * export default component$(() => {
 *   const fileMenu = Menubar.useMenu("file");
 *   const editMenu = Menubar.useMenu("edit");
 *   return (
 *     <Menubar.Root class="rounded-md border border-separator-opaque p-1">
 *       <Menubar.Menu {...fileMenu}>
 *         <Menubar.Trigger>Soubor</Menubar.Trigger>
 *         <Menubar.Content>
 *           <Menubar.Item>Nový</Menubar.Item>
 *           <Menubar.Item>Uložit</Menubar.Item>
 *         </Menubar.Content>
 *       </Menubar.Menu>
 *       <Menubar.Menu {...editMenu}>
 *         <Menubar.Trigger>Úpravy</Menubar.Trigger>
 *         <Menubar.Content>
 *           <Menubar.Item>Zpět</Menubar.Item>
 *         </Menubar.Content>
 *       </Menubar.Menu>
 *     </Menubar.Root>
 *   );
 * });
 * ```
 
 
 
 */

import {
  $,
  component$,
  type FunctionComponent,
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  useSignal,
} from "@builder.io/qwik";
import type { DropdownMenuPopoverProps, DropdownMenuRootProps, DropdownMenuTriggerProps } from "../dropdown-menu";
import {
  DropdownMenuCheckboxItem,
  DropdownMenuGroup,
  DropdownMenuGroupLabel,
  DropdownMenuItem,
  DropdownMenuItemIndicator,
  DropdownMenuPopover,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuRoot,
  DropdownMenuSeparator,
  DropdownMenuSubCheckboxItem,
  DropdownMenuSubContent,
  DropdownMenuSubItem,
  DropdownMenuSubRadioItem,
  DropdownMenuSubRoot,
  DropdownMenuSubTrigger,
  DropdownMenuTrigger,
} from "../dropdown-menu";
import { ToolbarRoot } from "../toolbar";

export type MenubarRootProps = Omit<PropsOf<typeof ToolbarRoot>, "role"> & {
  /** Popisek pro `role="menubar"`. */
  "aria-label"?: string;
};

/**
 * Kořen lišty menu — vizuálně a sémanticky {@link ToolbarRoot} s `role="menubar"`, uvnitř skládání
 * {@link DropdownMenuRoot} přes {@link MenubarMenu} a {@link useMenubarMenu}.
 */
export const MenubarRoot = component$<MenubarRootProps>((props) => {
  const { class: className, "aria-label": ariaLabel = "Menu", ...rest } = props;
  const merged = ["!gap-0 min-h-9 h-9", className].filter(Boolean).join(" ");
  return (
    <ToolbarRoot role="menubar" aria-label={ariaLabel} {...rest} class={merged}>
      <Slot />
    </ToolbarRoot>
  );
});

export type MenubarMenuControlProps = {
  "bind:open"?: Signal<boolean>;
  onOpenChange$?: QRL<(open: boolean) => void>;
};

export type MenubarMenuProps = Omit<DropdownMenuRootProps, "variant"> & MenubarMenuControlProps;

/**
 * Jedno rozbalovací menu v liště — obal {@link DropdownMenuRoot} s `variant="menubar"`.
 * Stav otevření přichází z {@link useMenubarMenu}.
 */
export const MenubarMenu: FunctionComponent<MenubarMenuProps> = (props) => {
  const {
    children,
    class: className,
    dropdownItemComponent,
    dropdownRadioItemComponent,
    dropdownCheckboxItemComponent,
    ...rest
  } = props;
  const merged = [className].filter(Boolean).join(" ");
  return (
    <DropdownMenuRoot
      {...rest}
      variant="menubar"
      class={merged}
      dropdownItemComponent={dropdownItemComponent}
      dropdownRadioItemComponent={dropdownRadioItemComponent}
      dropdownCheckboxItemComponent={dropdownCheckboxItemComponent}
    >
      {children}
    </DropdownMenuRoot>
  );
};

export type MenubarTriggerProps = Omit<DropdownMenuTriggerProps, "variant">;

export const MenubarTrigger: FunctionComponent<MenubarTriggerProps> = (props) => (
  <DropdownMenuTrigger variant="menubar" {...props} />
);

export type MenubarContentProps = DropdownMenuPopoverProps;

/** Panel menu — {@link DropdownMenuPopover} s výchozím `floating="bottom-start"`. */
export const MenubarContent: FunctionComponent<MenubarContentProps> = (props) => {
  const { floating, gutter, ...rest } = props;
  return (
    <DropdownMenuPopover {...rest} floating={floating ?? "bottom-start"} gutter={gutter ?? 4} />
  );
};

/**
 * Vrací `bind:open` a `onOpenChange$` pro jedno menu — rozlož na {@link MenubarMenu}:
 * `<Menubar.Menu {...useMenu("file")}>…`. Každé menu spravuje svůj stav otevření samostatně.
 */
export function useMenubarMenu(menuId?: string): MenubarMenuControlProps {
  void menuId;
  const openSig = useSignal(false);
  const onOpenChange$ = $((open: boolean) => {
    openSig.value = open;
  });
  return { "bind:open": openSig, onOpenChange$ };
}

export type MenubarShortcutProps = PropsOf<"span">;

/** Zkratka vpravo u položky (např. ⌘K); typicky uvnitř {@link MenubarItem}. */
export const MenubarShortcut: FunctionComponent<MenubarShortcutProps> = (props) => {
  const merged = ["ml-auto text-caption-1 tracking-wide text-secondary-label", props.class]
    .filter(Boolean)
    .join(" ");
  return <span {...props} class={merged} />;
};

export const MenubarItem = DropdownMenuItem;
export type MenubarItemProps = PropsOf<typeof DropdownMenuItem>;

export const MenubarCheckboxItem = DropdownMenuCheckboxItem;
export type MenubarCheckboxItemProps = PropsOf<typeof DropdownMenuCheckboxItem>;

export const MenubarRadioGroup = DropdownMenuRadioGroup;
export type MenubarRadioGroupProps = PropsOf<typeof DropdownMenuRadioGroup>;

export const MenubarRadioItem = DropdownMenuRadioItem;
export type MenubarRadioItemProps = PropsOf<typeof DropdownMenuRadioItem>;

export const MenubarSeparator = DropdownMenuSeparator;
export type MenubarSeparatorProps = PropsOf<typeof DropdownMenuSeparator>;

export const MenubarGroup = DropdownMenuGroup;
export type MenubarGroupProps = PropsOf<typeof DropdownMenuGroup>;

export const MenubarGroupLabel = DropdownMenuGroupLabel;
export type MenubarGroupLabelProps = PropsOf<typeof DropdownMenuGroupLabel>;

export const MenubarItemIndicator = DropdownMenuItemIndicator;
export type MenubarItemIndicatorProps = PropsOf<typeof DropdownMenuItemIndicator>;

export const MenubarSub = DropdownMenuSubRoot;
export type MenubarSubProps = PropsOf<typeof DropdownMenuSubRoot>;

export const MenubarSubTrigger = DropdownMenuSubTrigger;
export type MenubarSubTriggerProps = PropsOf<typeof DropdownMenuSubTrigger>;

export const MenubarSubContent = DropdownMenuSubContent;
export type MenubarSubContentProps = PropsOf<typeof DropdownMenuSubContent>;

export const MenubarSubItem = DropdownMenuSubItem;
export type MenubarSubItemProps = PropsOf<typeof DropdownMenuSubItem>;

export const MenubarSubCheckboxItem = DropdownMenuSubCheckboxItem;
export type MenubarSubCheckboxItemProps = PropsOf<typeof DropdownMenuSubCheckboxItem>;

export const MenubarSubRadioItem = DropdownMenuSubRadioItem;
export type MenubarSubRadioItemProps = PropsOf<typeof DropdownMenuSubRadioItem>;

/**
 * Lišta menu = {@link ToolbarRoot} (`role="menubar"`) + {@link DropdownMenu} díly přes
 * {@link MenubarMenu} / {@link MenubarTrigger} / {@link MenubarContent}; stav otevření menu
 * {@link useMenubarMenu}.
 */
export const Menubar = {
  Root: MenubarRoot,
  Menu: MenubarMenu,
  useMenu: useMenubarMenu,
  Trigger: MenubarTrigger,
  Content: MenubarContent,
  Item: MenubarItem,
  Separator: MenubarSeparator,
  Group: MenubarGroup,
  GroupLabel: MenubarGroupLabel,
  CheckboxItem: MenubarCheckboxItem,
  RadioGroup: MenubarRadioGroup,
  RadioItem: MenubarRadioItem,
  ItemIndicator: MenubarItemIndicator,
  Shortcut: MenubarShortcut,
  Sub: MenubarSub,
  SubTrigger: MenubarSubTrigger,
  SubContent: MenubarSubContent,
  SubItem: MenubarSubItem,
  SubCheckboxItem: MenubarSubCheckboxItem,
  SubRadioItem: MenubarSubRadioItem,
};
