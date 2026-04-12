/**
 * @component dropdown-menu
 * @title DropdownMenu
 * @version 1.3.0
 * @example Základní menu
 * Základní menu — viz ukázka níže.
 * ```tsx
 * import { DropdownMenu } from "~/components/ui/dropdown-menu";
 * 
 * <DropdownMenu.Root>
 *   <DropdownMenu.Trigger>Otevřít menu</DropdownMenu.Trigger>
 *   <DropdownMenu.Popover gutter={4}>
 *     <DropdownMenu.Item>Profil</DropdownMenu.Item>
 *     <DropdownMenu.Item>Nastavení</DropdownMenu.Item>
 *     <DropdownMenu.Separator />
 *     <DropdownMenu.Item>Odebrat</DropdownMenu.Item>
 *   </DropdownMenu.Popover>
 * </DropdownMenu.Root>
 * ```
 *
 * @example Skupiny a popisky
 * Skupiny a popisky — viz ukázka níže.
 * ```tsx
 * import { DropdownMenu } from "~/components/ui/dropdown-menu";
 * 
 * <DropdownMenu.Root>
 *   <DropdownMenu.Trigger>Účet</DropdownMenu.Trigger>
 *   <DropdownMenu.Popover gutter={4}>
 *     <DropdownMenu.Group>
 *       <DropdownMenu.GroupLabel>Můj účet</DropdownMenu.GroupLabel>
 *       <DropdownMenu.Item>Profil</DropdownMenu.Item>
 *       <DropdownMenu.Item>Fakturace</DropdownMenu.Item>
 *     </DropdownMenu.Group>
 *     <DropdownMenu.Separator />
 *     <DropdownMenu.Group>
 *       <DropdownMenu.GroupLabel>Nebezpečná zóna</DropdownMenu.GroupLabel>
 *       <DropdownMenu.Item>Odhlásit se</DropdownMenu.Item>
 *     </DropdownMenu.Group>
 *   </DropdownMenu.Popover>
 * </DropdownMenu.Root>
 * ```
 *
 * @example Checkbox a radio
 * Pro vícenásobný výběr použij `CheckboxItem` s `bind:checked` ; pro jednu hodnotu `RadioGroup` s `bind:value` a `RadioItem` .
 * ```tsx
 * import { component$, useSignal } from "@builder.io/qwik";
 * import { DropdownMenu } from "~/components/ui/dropdown-menu";
 * 
 * export const MenuWithSelection = component$(() => {
 *   const notifications = useSignal(true);
 *   const theme = useSignal("system");
 * 
 *   return (
 *     <DropdownMenu.Root>
 *       <DropdownMenu.Trigger>Volby</DropdownMenu.Trigger>
 *       <DropdownMenu.Popover gutter={4}>
 *         <DropdownMenu.CheckboxItem bind:checked={notifications} closeOnSelect={false}>
 *           Oznámení
 *         </DropdownMenu.CheckboxItem>
 *         <DropdownMenu.Separator />
 *         <DropdownMenu.RadioGroup bind:value={theme}>
 *           <DropdownMenu.RadioItem value="light">Světlý</DropdownMenu.RadioItem>
 *           <DropdownMenu.RadioItem value="dark">Tmavý</DropdownMenu.RadioItem>
 *           <DropdownMenu.RadioItem value="system">Systém</DropdownMenu.RadioItem>
 *         </DropdownMenu.RadioGroup>
 *       </DropdownMenu.Popover>
 *     </DropdownMenu.Root>
 *   );
 * });
 * ```
 *
 * @example Podmenu
 * Vnořené menu je druhý `Dropdown` kontext: `Sub` , `SubTrigger` , `SubContent` . Uvnitř panelu používej jen `SubItem` (případně `SubCheckboxItem` / `SubRadioItem` ), ne hlavní `Item` — jinak by headless walker sloučil indexy s hlavním menu.
 * ```tsx
 * import { DropdownMenu } from "~/components/ui/dropdown-menu";
 * 
 * <DropdownMenu.Root>
 *   <DropdownMenu.Trigger>Soubor</DropdownMenu.Trigger>
 *   <DropdownMenu.Popover gutter={4}>
 *     <DropdownMenu.Item>Nový</DropdownMenu.Item>
 *     <DropdownMenu.Sub>
 *       <DropdownMenu.SubTrigger>
 *         <span>Nedávné</span>
 *         <span class="text-secondary-label" aria-hidden="true">
 *           ›
 *         </span>
 *       </DropdownMenu.SubTrigger>
 *       <DropdownMenu.SubContent>
 *         <DropdownMenu.SubItem>Projekt A</DropdownMenu.SubItem>
 *         <DropdownMenu.SubItem>Projekt B</DropdownMenu.SubItem>
 *       </DropdownMenu.SubContent>
 *     </DropdownMenu.Sub>
 *     <DropdownMenu.Separator />
 *     <DropdownMenu.Item>Konec</DropdownMenu.Item>
 *   </DropdownMenu.Popover>
 * </DropdownMenu.Root>
 * ```
 
 
 
 
 
 
 
 */

import { $, component$, type FunctionComponent, type JSXChildren, type PropsOf, type QRL, type Signal, Slot } from "@builder.io/qwik";
import { Dropdown as HeadlessDropdown } from "@qwik-ui/headless";
import {
  floatingMenuListPanelClass,
  floatingOutlineButtonTriggerClass,
} from "../utilities/floating-ui";

const rootClassDefault = "inline-block";

const rootClassMenubar = "inline-flex";

const triggerClass = floatingOutlineButtonTriggerClass;

/**
 * Kompaktní spouštěč jen s ikonou (bez outline rámečku) — např. vedle řádku v sidebaru;
 * výchozí `DropdownMenu.Trigger` přidává `floatingOutlineButtonTriggerClass`, který by ikonu přebil / ořízl.
 */
const iconTriggerClass =
  "inline-flex aspect-square w-7 shrink-0 cursor-default items-center justify-center rounded-md border-0 bg-transparent p-0 text-secondary-label shadow-none outline-none ring-0 ring-offset-background transition-colors hover:bg-fill-secondary/10 hover:text-label focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 data-[open]:bg-fill-secondary/10 data-[open]:text-label";

/** Spouštěč vodorovné lišty menu (bez rámečku jako u samostatného tlačítka). */
const menubarTriggerClass =
  "inline-flex h-6 shrink-0 cursor-default select-none items-center justify-center self-center rounded-md px-2.5 text-callout font-medium text-label outline-none ring-offset-background transition-colors hover:bg-surface-overlay focus:bg-surface-overlay data-[open]:bg-surface-overlay focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const popoverPanelClass = floatingMenuListPanelClass;

const itemClass =
  "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-callout text-label outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-surface-overlay data-[highlighted]:text-label";

const separatorClass = "my-1 h-px border-0 bg-separator-opaque";

const groupClass = "py-0.5";

const groupLabelClass = "px-2 py-1.5 text-caption-1 font-medium text-secondary-label";

const itemIndicatorClass =
  "ml-auto inline-flex h-4 w-4 shrink-0 items-center justify-center text-label [&_svg]:h-3.5 [&_svg]:w-3.5";

/** Položka s indikátorem vlevo — sdílí `itemClass` + přidává `pl-8` pro prostor indikátoru. */
const checkableItemClass = [itemClass, "pl-8"].join(" ");

/** Absolutně pozicovaný slot pro indikátor zaškrtnutí / výběru (z-index nad obsahem řádku). */
const indicatorSlotClass =
  "absolute left-2 z-10 flex h-3.5 w-3.5 items-center justify-center";

const checkIcon = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2.5"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <polyline points="20 6 9 17 4 12" />
  </svg>
);

const radioIcon = (
  <svg width="8" height="8" viewBox="0 0 8 8" fill="currentColor" aria-hidden="true">
    <circle cx="4" cy="4" r="4" />
  </svg>
);

/** Vnitřní řádek podmenu — vypadá jako položka, ne jako hlavní tlačítkové menu. */
const subTriggerClass = [
  itemClass,
  "w-full justify-between gap-2 border-0 bg-transparent font-normal shadow-none ring-offset-background",
  "hover:bg-surface-overlay data-[open]:bg-surface-overlay",
  "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
].join(" ");

const subRootClass = "block w-full min-w-0";

export type DropdownMenuRootProps = PropsOf<typeof HeadlessDropdown.Root> & {
  /** `menubar` — `inline-flex` kořen pro položky v komponentě Menubar. */
  variant?: "default" | "menubar";
};

export type DropdownMenuTriggerProps = PropsOf<typeof HeadlessDropdown.Trigger> & {
  /** `menubar` — plochý spouštěč v liště menu. `icon` — bez outline, čtverec jako vedlejší akce u řádku. */
  variant?: "default" | "menubar" | "icon";
};

export type DropdownMenuPopoverProps = PropsOf<typeof HeadlessDropdown.Popover>;

export type DropdownMenuItemProps = PropsOf<typeof HeadlessDropdown.Item>;

export type DropdownMenuSeparatorProps = PropsOf<typeof HeadlessDropdown.Separator>;

export type DropdownMenuGroupProps = PropsOf<typeof HeadlessDropdown.Group>;

export type DropdownMenuGroupLabelProps = PropsOf<typeof HeadlessDropdown.GroupLabel>;

export type DropdownMenuCheckboxItemProps = PropsOf<typeof HeadlessDropdown.CheckboxItem>;

export type DropdownMenuRadioGroupProps = PropsOf<typeof HeadlessDropdown.RadioGroup>;

export type DropdownMenuRadioItemProps = PropsOf<typeof HeadlessDropdown.RadioItem>;

export type DropdownMenuItemIndicatorProps = PropsOf<typeof HeadlessDropdown.ItemIndicator>;

export type DropdownMenuSubRootProps = PropsOf<typeof HeadlessDropdown.Root>;

export type DropdownMenuSubTriggerProps = PropsOf<typeof HeadlessDropdown.Trigger>;

export type DropdownMenuSubContentProps = PropsOf<typeof HeadlessDropdown.Popover>;

export type DropdownMenuSubItemProps = PropsOf<typeof HeadlessDropdown.Item>;

export type DropdownMenuSubCheckboxItemProps = PropsOf<typeof HeadlessDropdown.CheckboxItem>;

export type DropdownMenuSubRadioItemProps = PropsOf<typeof HeadlessDropdown.RadioItem>;

/**
 * Položky uvnitř {@link DropdownMenuSubContent} musí používat `SubItem` / `SubCheckboxItem` / `SubRadioItem`,
 * ne hlavní `Item` — jinak je sjednotí walker hlavního menu do jednoho `itemsMap`.
 */
export const DropdownMenuSubItem: FunctionComponent<DropdownMenuSubItemProps> = (props) => {
  const merged = [itemClass, props.class].filter(Boolean).join(" ");
  return <HeadlessDropdown.Item {...props} class={merged} />;
};

export const DropdownMenuSubCheckboxItem = component$<DropdownMenuSubCheckboxItemProps>((props) => {
  const typed = props as typeof props & { children?: JSXChildren; "onChange$"?: QRL<(checked: boolean) => void> };
  const p = { ...(typed as unknown as Record<string, unknown>) };
  const className = p.class as string | undefined;
  const userOnChange$ = p["onChange$"] as QRL<((checked: boolean) => void) | undefined>;
  delete p.class;
  delete p.children;
  delete p["onChange$"];
  const rest = p;
  const bindChecked = (props as unknown as { "bind:checked"?: Signal<boolean> })["bind:checked"];
  const merged = [checkableItemClass, className].filter(Boolean).join(" ");
  return (
    <HeadlessDropdown.CheckboxItem
      {...rest}
      class={merged}
      onChange$={$((checked: boolean) => {
        if (bindChecked) bindChecked.value = checked;
        if (userOnChange$) void userOnChange$(checked);
      })}
    >
      <span class={indicatorSlotClass}>
        <HeadlessDropdown.ItemIndicator>{checkIcon}</HeadlessDropdown.ItemIndicator>
      </span>
      <Slot />
    </HeadlessDropdown.CheckboxItem>
  );
});

export const DropdownMenuSubRadioItem: FunctionComponent<DropdownMenuSubRadioItemProps> = (props) => {
  const { class: className, children, ...rest } = props as typeof props & { children?: JSXChildren };
  const merged = [checkableItemClass, className].filter(Boolean).join(" ");
  return (
    <HeadlessDropdown.RadioItem {...rest} class={merged}>
      <span class={indicatorSlotClass}>
        <HeadlessDropdown.ItemIndicator>{radioIcon}</HeadlessDropdown.ItemIndicator>
      </span>
      {children}
    </HeadlessDropdown.RadioItem>
  );
};

/**
 * Kořen vnořeného menu (podmenu). Uvnitř: {@link DropdownMenuSubTrigger} + {@link DropdownMenuSubContent}.
 */
export const DropdownMenuSubRoot: FunctionComponent<DropdownMenuSubRootProps> = (props) => {
  const merged = [subRootClass, props.class].filter(Boolean).join(" ");
  return (
    <HeadlessDropdown.Root
      {...props}
      class={merged}
      dropdownItemComponent={props.dropdownItemComponent ?? DropdownMenuSubItem}
      dropdownRadioItemComponent={props.dropdownRadioItemComponent ?? DropdownMenuSubRadioItem}
      dropdownCheckboxItemComponent={props.dropdownCheckboxItemComponent ?? DropdownMenuSubCheckboxItem}
    />
  );
};

export const DropdownMenuSubTrigger: FunctionComponent<DropdownMenuSubTriggerProps> = (props) => {
  const merged = [subTriggerClass, props.class].filter(Boolean).join(" ");
  return <HeadlessDropdown.Trigger {...props} class={merged} />;
};

/** Výchozí umístění vpravo od řádku (`right-start`), vhodné pro podmenu. */
export const DropdownMenuSubContent: FunctionComponent<DropdownMenuSubContentProps> = (props) => {
  const { floating, gutter, class: className, ...rest } = props;
  const merged = [popoverPanelClass, className].filter(Boolean).join(" ");
  return (
    <HeadlessDropdown.Popover
      {...rest}
      class={merged}
      floating={floating ?? "right-start"}
      gutter={gutter ?? 4}
    />
  );
};

export const DropdownMenuItem: FunctionComponent<DropdownMenuItemProps> = (props) => {
  const merged = [itemClass, props.class].filter(Boolean).join(" ");
  return <HeadlessDropdown.Item {...props} class={merged} />;
};

export const DropdownMenuCheckboxItem = component$<DropdownMenuCheckboxItemProps>((props) => {
  const typed = props as typeof props & { children?: JSXChildren; "onChange$"?: QRL<(checked: boolean) => void> };
  const p = { ...(typed as unknown as Record<string, unknown>) };
  const className = p.class as string | undefined;
  const userOnChange$ = p["onChange$"] as QRL<((checked: boolean) => void) | undefined>;
  delete p.class;
  delete p.children;
  delete p["onChange$"];
  const rest = p;
  const bindChecked = (props as unknown as { "bind:checked"?: Signal<boolean> })["bind:checked"];
  const merged = [checkableItemClass, className].filter(Boolean).join(" ");
  return (
    <HeadlessDropdown.CheckboxItem
      {...rest}
      class={merged}
      onChange$={$((checked: boolean) => {
        if (bindChecked) bindChecked.value = checked;
        if (userOnChange$) void userOnChange$(checked);
      })}
    >
      <span class={indicatorSlotClass}>
        <HeadlessDropdown.ItemIndicator>{checkIcon}</HeadlessDropdown.ItemIndicator>
      </span>
      <Slot />
    </HeadlessDropdown.CheckboxItem>
  );
});

export const DropdownMenuRadioItem: FunctionComponent<DropdownMenuRadioItemProps> = (props) => {
  const { class: className, children, ...rest } = props as typeof props & { children?: JSXChildren };
  const merged = [checkableItemClass, className].filter(Boolean).join(" ");
  return (
    <HeadlessDropdown.RadioItem {...rest} class={merged}>
      <span class={indicatorSlotClass}>
        <HeadlessDropdown.ItemIndicator>{radioIcon}</HeadlessDropdown.ItemIndicator>
      </span>
      {children}
    </HeadlessDropdown.RadioItem>
  );
};

/**
 * Kořen menu — předává stylované {@link DropdownMenuItem} / {@link DropdownMenuRadioItem} /
 * {@link DropdownMenuCheckboxItem} do headless walkeru (stejný princip jako `tabComponent` u Tab).
 */
export const DropdownMenuRoot: FunctionComponent<DropdownMenuRootProps> = (props) => {
  const {
    variant = "default",
    class: className,
    dropdownItemComponent,
    dropdownRadioItemComponent,
    dropdownCheckboxItemComponent,
    ...rest
  } = props;
  const rootBase = variant === "menubar" ? rootClassMenubar : rootClassDefault;
  const merged = [rootBase, className].filter(Boolean).join(" ");
  return (
    <HeadlessDropdown.Root
      {...rest}
      class={merged}
      dropdownItemComponent={dropdownItemComponent ?? DropdownMenuItem}
      dropdownRadioItemComponent={dropdownRadioItemComponent ?? DropdownMenuRadioItem}
      dropdownCheckboxItemComponent={dropdownCheckboxItemComponent ?? DropdownMenuCheckboxItem}
    />
  );
};

export const DropdownMenuTrigger: FunctionComponent<DropdownMenuTriggerProps> = (props) => {
  const { variant = "default", class: className, ...rest } = props;
  const base =
    variant === "menubar" ? menubarTriggerClass : variant === "icon" ? iconTriggerClass : triggerClass;
  const merged = [base, className].filter(Boolean).join(" ");
  return <HeadlessDropdown.Trigger {...rest} class={merged} />;
};

export const DropdownMenuPopover: FunctionComponent<DropdownMenuPopoverProps> = (props) => {
  const merged = [popoverPanelClass, props.class].filter(Boolean).join(" ");
  return <HeadlessDropdown.Popover {...props} class={merged} />;
};

export const DropdownMenuSeparator: FunctionComponent<DropdownMenuSeparatorProps> = (props) => {
  const merged = [separatorClass, props.class].filter(Boolean).join(" ");
  return <HeadlessDropdown.Separator {...props} class={merged} />;
};

export const DropdownMenuGroup: FunctionComponent<DropdownMenuGroupProps> = (props) => {
  const merged = [groupClass, props.class].filter(Boolean).join(" ");
  return <HeadlessDropdown.Group {...props} class={merged} />;
};

export const DropdownMenuGroupLabel: FunctionComponent<DropdownMenuGroupLabelProps> = (props) => {
  const merged = [groupLabelClass, props.class].filter(Boolean).join(" ");
  return <HeadlessDropdown.GroupLabel {...props} class={merged} />;
};

export const DropdownMenuItemIndicator: FunctionComponent<DropdownMenuItemIndicatorProps> = (props) => {
  const merged = [itemIndicatorClass, props.class].filter(Boolean).join(" ");
  return <HeadlessDropdown.ItemIndicator {...props} class={merged} />;
};

export const DropdownMenuRadioGroup: FunctionComponent<DropdownMenuRadioGroupProps> = (props) => (
  <HeadlessDropdown.RadioGroup {...props} />
);

/**
 * Složené API nad {@link https://qwikui.com/docs/headless/dropdown | @qwik-ui/headless Dropdown}
 * (shadcn „Dropdown Menu“); styly z COLORS.md jako u Popover / Tabs.
 */
export const DropdownMenu = {
  Root: DropdownMenuRoot,
  Trigger: DropdownMenuTrigger,
  Popover: DropdownMenuPopover,
  Item: DropdownMenuItem,
  Separator: DropdownMenuSeparator,
  Group: DropdownMenuGroup,
  GroupLabel: DropdownMenuGroupLabel,
  CheckboxItem: DropdownMenuCheckboxItem,
  RadioGroup: DropdownMenuRadioGroup,
  RadioItem: DropdownMenuRadioItem,
  ItemIndicator: DropdownMenuItemIndicator,
  Sub: DropdownMenuSubRoot,
  SubTrigger: DropdownMenuSubTrigger,
  SubContent: DropdownMenuSubContent,
  SubItem: DropdownMenuSubItem,
  SubCheckboxItem: DropdownMenuSubCheckboxItem,
  SubRadioItem: DropdownMenuSubRadioItem,
};
