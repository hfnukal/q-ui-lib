/**
 * @component menubar
 * @title Menubar
 * @version 1.3.0
 * @example Lišta s podmenu
 * `Menubar.Root` → pro každé menu `Menubar.Menu` → `Menubar.Trigger` + `Menubar.Content` s položkami.
 * ```tsx
 * import { component$ } from "@builder.io/qwik";
 * import { Menubar } from "~/components/ui/base/menubar";
 * 
 * export default component$(() => {
 *   return (
 *     <Menubar.Root class="rounded-md border border-separator-opaque p-1">
 *       <Menubar.Menu>
 *         <Menubar.Trigger>Soubor</Menubar.Trigger>
 *         <Menubar.Content>
 *           <Menubar.Item>Nový</Menubar.Item>
 *           <Menubar.Item>Uložit</Menubar.Item>
 *         </Menubar.Content>
 *       </Menubar.Menu>
 *       <Menubar.Menu>
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
  component$,
  type FunctionComponent,
  type PropsOf,
  Slot,
  useSignal,
} from "@builder.io/qwik";
import { Menu } from "../menu";

export type MenubarRootProps = PropsOf<typeof Menu.MenuGroup>;

/**
 * Kořen lišty menu — vizuálně a sémanticky MenuGroup s role="menubar".
 */
export const MenubarRoot: FunctionComponent<MenubarRootProps> = (props) => {
  return (
    <Menu.MenuGroup {...props}>
      <Slot />
    </Menu.MenuGroup>
  );
};

export type MenubarMenuProps = PropsOf<typeof Menu.Root>;

/**
 * Jedno rozbalovací menu v liště — obal Menu.Root.
 */
export const MenubarMenu: FunctionComponent<MenubarMenuProps> = (props) => {
  return (
    <Menu.Root {...props}>
      <Slot />
    </Menu.Root>
  );
};

export type MenubarTriggerProps = PropsOf<typeof Menu.Trigger>;

export const MenubarTrigger: FunctionComponent<MenubarTriggerProps> = (props) => (
  <Menu.Trigger {...props}>
    <Slot />
  </Menu.Trigger>
);

export type MenubarContentProps = PropsOf<typeof Menu.Panel>;

/** Panel menu — Menu.Panel. */
export const MenubarContent: FunctionComponent<MenubarContentProps> = (props) => {
  return (
    <Menu.Panel {...props}>
      <Slot />
    </Menu.Panel>
  );
};

export type MenubarShortcutProps = PropsOf<"span">;

/** Zkratka vpravo u položky (např. ⌘K); typicky uvnitř MenubarItem. */
export const MenubarShortcut: FunctionComponent<MenubarShortcutProps> = (props) => {
  const merged = ["ml-auto text-caption-1 tracking-wide text-secondary-label", props.class]
    .filter(Boolean)
    .join(" ");
  return <span {...props} class={merged} />;
};

export const MenubarItem = Menu.Item;
export const MenubarCheckboxItem = Menu.CheckBoxItem;
export const MenubarRadioGroup = Menu.RadioGroup;
export const MenubarRadioItem = Menu.RadioButton;
export const MenubarSeparator = Menu.Separator;
export const MenubarGroup = Menu.Group;
export const MenubarGroupLabel = Menu.Label;
export const MenubarSub = Menu.SubMenu;
export const MenubarSubMenu = Menu.SubMenu;
export const MenubarSubTrigger = Menu.SubTrigger;
export const MenubarSubContent = Menu.Panel;

/**
 * Vrací signál pro ovládání otevření menu.
 */
export const useMenubarMenu = () => {
  return useSignal(false);
};

/**
 * Lišta menu = Menu.MenuGroup + Menu.Root + Menu.Trigger + Menu.Panel.
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
  Shortcut: MenubarShortcut,
  Sub: MenubarSub,
  SubMenu: MenubarSubMenu,
  SubTrigger: MenubarSubTrigger,
  SubContent: MenubarSubContent,
};
