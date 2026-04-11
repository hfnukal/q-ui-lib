/**
 * @component menu
 * @title Menu
 * @version 1.0.0
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
