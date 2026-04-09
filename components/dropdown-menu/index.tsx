import { type FunctionComponent, type PropsOf } from "@builder.io/qwik";
import { Dropdown as HeadlessDropdown } from "@qwik-ui/headless";

const rootClassDefault = "inline-block";

const rootClassMenubar = "inline-flex";

const triggerClass =
  "inline-flex items-center justify-center rounded-md border border-separator-opaque bg-surface-raised px-3 py-2 font-medium text-callout text-label shadow-sm ring-offset-background transition-colors hover:bg-surface-overlay focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

/** Spouštěč vodorovné lišty menu (bez rámečku jako u samostatného tlačítka). */
const menubarTriggerClass =
  "inline-flex h-8 cursor-default select-none items-center justify-center rounded-sm px-3 py-1 text-callout font-medium text-label outline-none ring-offset-background transition-colors hover:bg-surface-overlay focus:bg-surface-overlay data-[open]:bg-surface-overlay focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

const popoverPanelClass =
  "z-50 min-w-[8rem] max-w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-separator-opaque bg-surface-raised p-1 text-body text-label shadow-md outline-none ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const itemClass =
  "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-callout text-label outline-none transition-colors data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-surface-overlay data-[highlighted]:text-label";

const separatorClass = "my-1 h-px border-0 bg-separator-opaque";

const groupClass = "py-0.5";

const groupLabelClass = "px-2 py-1.5 text-caption-1 font-medium text-secondary-label";

const itemIndicatorClass =
  "ml-auto inline-flex h-4 w-4 shrink-0 items-center justify-center text-label [&_svg]:h-3.5 [&_svg]:w-3.5";

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
  /** `menubar` — plochý spouštěč v liště menu. */
  variant?: "default" | "menubar";
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

export const DropdownMenuSubCheckboxItem: FunctionComponent<DropdownMenuSubCheckboxItemProps> = (props) => {
  const merged = [itemClass, props.class].filter(Boolean).join(" ");
  return <HeadlessDropdown.CheckboxItem {...props} class={merged} />;
};

export const DropdownMenuSubRadioItem: FunctionComponent<DropdownMenuSubRadioItemProps> = (props) => {
  const merged = [itemClass, props.class].filter(Boolean).join(" ");
  return <HeadlessDropdown.RadioItem {...props} class={merged} />;
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

export const DropdownMenuCheckboxItem: FunctionComponent<DropdownMenuCheckboxItemProps> = (props) => {
  const merged = [itemClass, props.class].filter(Boolean).join(" ");
  return <HeadlessDropdown.CheckboxItem {...props} class={merged} />;
};

export const DropdownMenuRadioItem: FunctionComponent<DropdownMenuRadioItemProps> = (props) => {
  const merged = [itemClass, props.class].filter(Boolean).join(" ");
  return <HeadlessDropdown.RadioItem {...props} class={merged} />;
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
  const base = variant === "menubar" ? menubarTriggerClass : triggerClass;
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
