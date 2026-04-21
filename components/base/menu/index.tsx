/**
 * @component menu
 * @title Menu
 * @version 1.0.0
 * @example Základní použití
 * Základní použití — viz ukázka níže.
 * ```tsx
 * import { Menu } from "~/components/ui/menu";
 * 
 * <Menu.Root>
 *   <Menu.Trigger>Akce</Menu.Trigger>
 *   <Menu.Popover>
 *     <Menu.Item>Uložit</Menu.Item>
 *     <Menu.Item>Kopírovat</Menu.Item>
 *     <Menu.Separator />
 *     <Menu.Item>Smazat</Menu.Item>
 *   </Menu.Popover>
 * </Menu.Root>
 * ```
 *
 * @example S MenuItem layoutem
 * S MenuItem layoutem — viz ukázka níže.
 * ```tsx
 * import { LuCopy, LuSave, LuTrash } from "@qwikest/icons/lucide";
 * import { Menu } from "~/components/ui/menu";
 * import { MenuItem } from "~/components/ui/menu-item";
 * import { KbdShortcut } from "~/components/ui/kbd-shortcut";
 * 
 * <Menu.Root>
 *   <Menu.Trigger>Soubor</Menu.Trigger>
 *   <Menu.Popover>
 *     <Menu.Item>
 *       <MenuItem.Root>
 *         <MenuItem.Start><LuSave /></MenuItem.Start>
 *         <MenuItem.Label>Uložit</MenuItem.Label>
 *         <MenuItem.End><KbdShortcut>⌘S</KbdShortcut></MenuItem.End>
 *       </MenuItem.Root>
 *     </Menu.Item>
 *     <Menu.Item>
 *       <MenuItem.Root>
 *         <MenuItem.Start><LuCopy /></MenuItem.Start>
 *         <MenuItem.Label>Kopírovat</MenuItem.Label>
 *         <MenuItem.End><KbdShortcut>⌘C</KbdShortcut></MenuItem.End>
 *       </MenuItem.Root>
 *     </Menu.Item>
 *     <Menu.Separator />
 *     <Menu.Item>
 *       <MenuItem.Root>
 *         <MenuItem.Start><LuTrash /></MenuItem.Start>
 *         <MenuItem.Label>Smazat</MenuItem.Label>
 *       </MenuItem.Root>
 *     </Menu.Item>
 *   </Menu.Popover>
 * </Menu.Root>
 * ```
 *
 * @example CheckboxItem
 * Zaškrtnutí se zobrazí jako fajfka vlevo. Stav řídí `bind:checked`.
 * ```tsx
 * import { useSignal } from "@builder.io/qwik";
 * import { Menu } from "~/components/ui/menu";
 * import { MenuCheckboxItem } from "~/components/ui/menu-checkbox-item";
 * 
 * export default component$(() => {
 *   const sidebar = useSignal(true);
 *   const statusBar = useSignal(false);
 *   return (
 *     <Menu.Root>
 *       <Menu.Trigger>Zobrazení</Menu.Trigger>
 *       <Menu.Popover>
 *         <Menu.CheckboxItem bind:checked={sidebar}>
 *           <MenuCheckboxItem.Root>
 *             <MenuCheckboxItem.Label>Postranní panel</MenuCheckboxItem.Label>
 *             <MenuCheckboxItem.End><KbdShortcut>⌘B</KbdShortcut></MenuCheckboxItem.End>
 *           </MenuCheckboxItem.Root>
 *         </Menu.CheckboxItem>
 *         <Menu.CheckboxItem bind:checked={statusBar}>
 *           <MenuCheckboxItem.Root>
 *             <MenuCheckboxItem.Label>Stavový řádek</MenuCheckboxItem.Label>
 *           </MenuCheckboxItem.Root>
 *         </Menu.CheckboxItem>
 *       </Menu.Popover>
 *     </Menu.Root>
 *   );
 * });
 * ```
 *
 * @example RadioItem
 * Vybraná položka se označí tečkou. Stav řídí `bind:value` na `RadioGroup`.
 * ```tsx
 * import { useSignal } from "@builder.io/qwik";
 * import { Menu } from "~/components/ui/menu";
 * import { MenuRadioItem } from "~/components/ui/menu-radio-item";
 * 
 * export default component$(() => {
 *   const theme = useSignal("light");
 *   return (
 *     <Menu.Root>
 *       <Menu.Trigger>Motiv</Menu.Trigger>
 *       <Menu.Popover>
 *         <Menu.RadioGroup bind:value={theme}>
 *           <Menu.RadioItem value="light">
 *             <MenuRadioItem.Root>
 *               <MenuRadioItem.Label>Světlý</MenuRadioItem.Label>
 *               <MenuRadioItem.End><KbdShortcut>⌘1</KbdShortcut></MenuRadioItem.End>
 *             </MenuRadioItem.Root>
 *           </Menu.RadioItem>
 *           <Menu.RadioItem value="dark">
 *             <MenuRadioItem.Root>
 *               <MenuRadioItem.Label>Tmavý</MenuRadioItem.Label>
 *               <MenuRadioItem.End><KbdShortcut>⌘2</KbdShortcut></MenuRadioItem.End>
 *             </MenuRadioItem.Root>
 *           </Menu.RadioItem>
 *           <Menu.RadioItem value="system">
 *             <MenuRadioItem.Root>
 *               <MenuRadioItem.Label>Systémový</MenuRadioItem.Label>
 *             </MenuRadioItem.Root>
 *           </Menu.RadioItem>
 *         </Menu.RadioGroup>
 *       </Menu.Popover>
 *     </Menu.Root>
 *   );
 * });
 * ```
 *
 * @example Podmenu
 * Vnořené menu: `Menu.Sub`, `SubTrigger` a položky se šipkou doprava.
 * ```tsx
 * import { LuChevronRight, LuSettings } from "@qwikest/icons/lucide";
 * import { Menu } from "~/components/ui/menu";
 * import { MenuItem } from "~/components/ui/menu-item";
 * 
 * <Menu.Root>
 *   <Menu.Trigger>Možnosti</Menu.Trigger>
 *   <Menu.Popover>
 *     <Menu.Item>Přejmenovat</Menu.Item>
 *     <Menu.Sub>
 *       <Menu.SubTrigger>
 *         <MenuItem.Root>
 *           <MenuItem.Start><LuSettings /></MenuItem.Start>
 *           <MenuItem.Label>Nastavení</MenuItem.Label>
 *           <MenuItem.End><LuChevronRight /></MenuItem.End>
 *         </MenuItem.Root>
 *       </Menu.SubTrigger>
 *       <Menu.SubContent>
 *         <Menu.SubItem>Účet</Menu.SubItem>
 *         <Menu.SubItem>Vzhled</Menu.SubItem>
 *       </Menu.SubContent>
 *     </Menu.Sub>
 *     <Menu.Separator />
 *     <Menu.Item>Smazat</Menu.Item>
 *   </Menu.Popover>
 * </Menu.Root>
 * ```
 
 
 
 
 
 
 
 
 
 */

/**
 * `Menu` je thin alias nad `DropdownMenu` — plné API viz {@link ../dropdown-menu}.
 * Kompoziční typ: závisí na `dropdown-menu`.
 *
 * Použití:
 * ```tsx
 * import { Menu } from "~/components/ui/menu";
 *
 * <Menu.Root>
 *   <Menu.Trigger>Otevřít</Menu.Trigger>
 *   <Menu.Popover>
 *     <Menu.Item>Položka 1</Menu.Item>
 *     <Menu.Separator />
 *     <Menu.Item>Položka 2</Menu.Item>
 *   </Menu.Popover>
 * </Menu.Root>
 * ```
 */
export { DropdownMenu as Menu } from "../dropdown-menu";
export type {
  DropdownMenuRootProps as MenuRootProps,
  DropdownMenuTriggerProps as MenuTriggerProps,
  DropdownMenuPopoverProps as MenuPopoverProps,
  DropdownMenuItemProps as MenuItemProps,
  DropdownMenuSeparatorProps as MenuSeparatorProps,
  DropdownMenuGroupProps as MenuGroupProps,
  DropdownMenuGroupLabelProps as MenuGroupLabelProps,
  DropdownMenuCheckboxItemProps as MenuCheckboxItemProps,
  DropdownMenuRadioGroupProps as MenuRadioGroupProps,
  DropdownMenuRadioItemProps as MenuRadioItemProps,
  DropdownMenuItemIndicatorProps as MenuItemIndicatorProps,
  DropdownMenuSubRootProps as MenuSubRootProps,
  DropdownMenuSubTriggerProps as MenuSubTriggerProps,
  DropdownMenuSubContentProps as MenuSubContentProps,
} from "../dropdown-menu";
