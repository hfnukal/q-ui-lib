import {
  $,
  component$,
  type FunctionComponent,
  type PropsOf,
  type QRL,
  Slot,
} from "@builder.io/qwik";
import { Combobox as HeadlessCombobox } from "@qwik-ui/headless";

const rootClass = "inline-block w-full max-w-xs";

const labelClass = "mb-1.5 block text-caption-1 font-medium text-label";

/**
 * Obal vstupu + tlačítka šipky — jeden rámeček jako u shadcn Combobox.
 */
const controlClass = [
  "flex h-10 w-full min-w-0 items-center gap-0.5 rounded-md border border-separator-opaque bg-surface-raised shadow-sm ring-offset-background",
  "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
  "data-[invalid]:border-destructive",
].join(" ");

const inputClass = [
  "h-10 min-w-0 flex-1 border-0 bg-transparent px-3 py-2 text-callout text-label shadow-none outline-none",
  "placeholder:text-placeholder",
  "focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
  "disabled:cursor-not-allowed disabled:opacity-50",
].join(" ");

const triggerClass = [
  "inline-flex h-9 w-9 shrink-0 items-center justify-center rounded-md text-secondary-label transition-colors",
  "hover:bg-surface-overlay focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  "disabled:pointer-events-none disabled:opacity-50",
].join(" ");

const popoverPanelClass = [
  "z-50 min-w-[8rem] max-w-[min(20rem,calc(100vw-2rem))] overflow-hidden rounded-lg border border-separator-opaque bg-surface-raised p-1 text-body text-label shadow-md outline-none ring-offset-background",
  "max-h-[min(15rem,50vh)] overflow-y-auto focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
].join(" ");

const itemClass = [
  "relative flex cursor-default select-none items-center gap-2 rounded-sm px-2 py-1.5 text-callout text-label outline-none transition-colors",
  "data-[disabled]:pointer-events-none data-[disabled]:opacity-50 data-[highlighted]:bg-surface-overlay data-[highlighted]:text-label",
].join(" ");

const itemLabelClass = "flex-1 truncate";

const itemIndicatorClass =
  "ml-auto inline-flex h-4 w-4 shrink-0 items-center justify-center text-label [&_svg]:h-3.5 [&_svg]:w-3.5";

const groupClass = "py-0.5";

const groupLabelClass = "px-2 py-1.5 text-caption-1 font-medium text-secondary-label";

const descriptionClass = "mt-1 text-caption-1 text-secondary-label";

const errorMessageClass = "mt-1 text-caption-1 text-destructive";

const emptyClass = "px-2 py-6 text-center text-caption-1 text-secondary-label";

/**
 * Obal {@link ComboboxControl} při více výběrech s chipy (zalamování řádků, vnitřní mezery).
 * Nahrazuje výchozí jednořádkovou třídu controlu.
 */
export const comboboxMultiselectControlClass = [
  "flex min-h-10 h-auto w-full min-w-0 flex-wrap items-center gap-1 rounded-md border border-separator-opaque bg-surface-raised px-1.5 py-1 shadow-sm ring-offset-background",
  "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2",
  "data-[invalid]:border-destructive",
].join(" ");

const chipClass =
  "inline-flex max-w-full items-center gap-0.5 rounded-md border border-separator-opaque bg-surface-overlay pl-2 pr-0.5 py-0.5 text-caption-1 text-label";

const chipRemoveClass =
  "inline-flex shrink-0 rounded p-0.5 text-secondary-label transition-colors hover:bg-surface-raised hover:text-label focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-1";

/** Vstup uvnitř multiselect controlu — nižší řádková výška vedle chipů. */
export const comboboxMultiselectInputClass = [
  "h-8 min-h-8 min-w-[6rem] flex-1 border-0 bg-transparent px-2 py-1 text-callout text-label shadow-none outline-none",
  "placeholder:text-placeholder",
  "focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
  "disabled:cursor-not-allowed disabled:opacity-50",
].join(" ");

export type ComboboxChipProps = {
  class?: string;
  /** Hodnota odpovídající `Combobox.Item` `value` — předá se do {@link ComboboxChipProps.onRemove$}. */
  value: string;
  /** Po kliknutí na ikonu odebrání (např. odfiltrovat z pole v `bind:value`). */
  onRemove$?: QRL<(value: string) => void>;
};

/**
 * Kompaktní štítek pro zobrazení vybrané hodnoty u multiselect comboboxu; ikona odebrání volitelná přes {@link ComboboxChipProps.onRemove$}.
 */
export const ComboboxChip = component$<ComboboxChipProps>((props) => {
  const merged = [chipClass, props.class].filter(Boolean).join(" ");

  return (
    <span class={merged}>
      <span class="min-w-0 truncate">
        <Slot />
      </span>
      {props.onRemove$ ? (
        <button
          type="button"
          class={chipRemoveClass}
          aria-label="Odebrat"
          preventdefault:mousedown
          onClick$={$(async () => {
            await props.onRemove$!(props.value);
          })}
        >
          <svg
            class="h-3 w-3 shrink-0"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            stroke-width="2"
            aria-hidden="true"
          >
            <path stroke-linecap="round" d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>
      ) : null}
    </span>
  );
});

export type ComboboxRootProps = PropsOf<typeof HeadlessCombobox.Root>;

export type ComboboxLabelProps = PropsOf<typeof HeadlessCombobox.Label>;

export type ComboboxControlProps = PropsOf<typeof HeadlessCombobox.Control>;

export type ComboboxInputProps = PropsOf<typeof HeadlessCombobox.Input>;

export type ComboboxTriggerProps = PropsOf<typeof HeadlessCombobox.Trigger>;

/** Horizontální ukotvení plovoucího panelu (Floating UI). */
export type ComboboxAlign = "start" | "center" | "end";

type HeadlessComboboxPopoverProps = PropsOf<typeof HeadlessCombobox.Popover>;

export type ComboboxPopoverProps = HeadlessComboboxPopoverProps & {
  /**
   * Horizontální zarovnání panelu vůči controlu (`bottom-start` / `bottom` / `bottom-end`).
   * Ignoruje se, pokud předáš `floating` s příponou `-start` nebo `-end`.
   */
  align?: ComboboxAlign;
};

function resolveComboboxPopoverFloating(
  floating: HeadlessComboboxPopoverProps["floating"] | undefined,
  align: ComboboxAlign
): HeadlessComboboxPopoverProps["floating"] {
  if (floating === false) return false;
  if (floating === undefined || floating === true) {
    if (align === "center") return true;
    if (align === "end") return "bottom-end";
    return "bottom-start";
  }
  if (typeof floating === "string") {
    if (/-(start|end)$/.test(floating)) return floating;
    if (align === "center") return floating;
    if (align === "end") return `${floating}-end` as HeadlessComboboxPopoverProps["floating"];
    return `${floating}-start` as HeadlessComboboxPopoverProps["floating"];
  }
  return floating;
}

export type ComboboxListboxProps = PropsOf<typeof HeadlessCombobox.Listbox>;

export type ComboboxGroupProps = PropsOf<typeof HeadlessCombobox.Group>;

export type ComboboxGroupLabelProps = PropsOf<typeof HeadlessCombobox.GroupLabel>;

export type ComboboxItemProps = PropsOf<typeof HeadlessCombobox.Item>;

export type ComboboxItemLabelProps = PropsOf<typeof HeadlessCombobox.ItemLabel>;

export type ComboboxItemIndicatorProps = PropsOf<typeof HeadlessCombobox.ItemIndicator>;

export type ComboboxDescriptionProps = PropsOf<typeof HeadlessCombobox.Description>;

export type ComboboxErrorMessageProps = PropsOf<typeof HeadlessCombobox.ErrorMessage>;

export type ComboboxEmptyProps = PropsOf<typeof HeadlessCombobox.Empty>;

export type ComboboxHiddenNativeSelectProps = PropsOf<typeof HeadlessCombobox.HiddenNativeSelect>;

export type ComboboxInlineProps = PropsOf<typeof HeadlessCombobox.Inline>;

export const ComboboxItem: FunctionComponent<ComboboxItemProps> = (props) => {
  const merged = [itemClass, props.class].filter(Boolean).join(" ");
  return <HeadlessCombobox.Item {...props} class={merged} />;
};

/**
 * Text položky musí být v mapě headlessu jeden řetězec (typeahead). Použij např. {\`Položka ${id}\`}.
 */
export const ComboboxItemLabel: FunctionComponent<ComboboxItemLabelProps> = (props) => {
  const merged = [itemLabelClass, props.class].filter(Boolean).join(" ");
  return <HeadlessCombobox.ItemLabel {...props} class={merged} />;
};

export const ComboboxErrorMessage: FunctionComponent<ComboboxErrorMessageProps> = (props) => {
  const merged = [errorMessageClass, props.class].filter(Boolean).join(" ");
  return <HeadlessCombobox.ErrorMessage {...props} class={merged} />;
};

export const ComboboxEmpty: FunctionComponent<ComboboxEmptyProps> = (props) => {
  const merged = [emptyClass, props.class].filter(Boolean).join(" ");
  return <HeadlessCombobox.Empty {...props} class={merged} />;
};

/**
 * Kořen comboboxu — předává stylované {@link ComboboxItem} / {@link ComboboxItemLabel} do headless walkeru
 * (stejný princip jako u Select). {@link ComboboxEmpty} a {@link ComboboxErrorMessage} stylovaně vlož do stromu jako děti.
 */
export const ComboboxRoot: FunctionComponent<ComboboxRootProps> = (props) => {
  const { comboboxItemComponent, comboboxItemLabelComponent, class: className, ...rest } = props;
  const merged = [rootClass, className].filter(Boolean).join(" ");
  return (
    <HeadlessCombobox.Root
      {...rest}
      class={merged}
      comboboxItemComponent={comboboxItemComponent ?? ComboboxItem}
      comboboxItemLabelComponent={comboboxItemLabelComponent ?? ComboboxItemLabel}
    />
  );
};

export const ComboboxLabel: FunctionComponent<ComboboxLabelProps> = (props) => {
  const merged = [labelClass, props.class].filter(Boolean).join(" ");
  return <HeadlessCombobox.Label {...props} class={merged} />;
};

export const ComboboxControl: FunctionComponent<ComboboxControlProps> = (props) => {
  const merged = [controlClass, props.class].filter(Boolean).join(" ");
  return <HeadlessCombobox.Control {...props} class={merged} />;
};

export const ComboboxInput: FunctionComponent<ComboboxInputProps> = (props) => {
  const merged = [inputClass, props.class].filter(Boolean).join(" ");
  return <HeadlessCombobox.Input {...props} class={merged} />;
};

export const ComboboxTrigger: FunctionComponent<ComboboxTriggerProps> = (props) => {
  const merged = [triggerClass, props.class].filter(Boolean).join(" ");
  return <HeadlessCombobox.Trigger {...props} class={merged} />;
};

export const ComboboxPopover = component$<ComboboxPopoverProps>((props) => {
  const { align = "start", floating: floatingProp, gutter, class: className, ...rest } = props;
  const floating = resolveComboboxPopoverFloating(floatingProp, align);
  const merged = [popoverPanelClass, className].filter(Boolean).join(" ");

  return (
    <HeadlessCombobox.Popover {...rest} class={merged} floating={floating} gutter={gutter ?? 4}>
      <Slot />
    </HeadlessCombobox.Popover>
  );
});

export const ComboboxListbox: FunctionComponent<ComboboxListboxProps> = (props) => (
  <HeadlessCombobox.Listbox {...props} />
);

export const ComboboxGroup: FunctionComponent<ComboboxGroupProps> = (props) => {
  const merged = [groupClass, props.class].filter(Boolean).join(" ");
  return <HeadlessCombobox.Group {...props} class={merged} />;
};

export const ComboboxGroupLabel: FunctionComponent<ComboboxGroupLabelProps> = (props) => {
  const merged = [groupLabelClass, props.class].filter(Boolean).join(" ");
  return <HeadlessCombobox.GroupLabel {...props} class={merged} />;
};

export const ComboboxItemIndicator: FunctionComponent<ComboboxItemIndicatorProps> = (props) => {
  const merged = [itemIndicatorClass, props.class].filter(Boolean).join(" ");
  return <HeadlessCombobox.ItemIndicator {...props} class={merged} />;
};

export const ComboboxDescription: FunctionComponent<ComboboxDescriptionProps> = (props) => {
  const merged = [descriptionClass, props.class].filter(Boolean).join(" ");
  return <HeadlessCombobox.Description {...props} class={merged} />;
};

export const ComboboxHiddenNativeSelect: FunctionComponent<ComboboxHiddenNativeSelectProps> = (
  props
) => <HeadlessCombobox.HiddenNativeSelect {...props} />;

export const ComboboxInline: FunctionComponent<ComboboxInlineProps> = (props) => (
  <HeadlessCombobox.Inline {...props} />
);

/**
 * Složené API nad {@link https://qwikui.com/docs/headless/combobox | @qwik-ui/headless Combobox}
 * (shadcn „Combobox“); styly z COLORS.md jako u Select / Popover.
 */
export const Combobox = {
  Root: ComboboxRoot,
  Label: ComboboxLabel,
  Control: ComboboxControl,
  Input: ComboboxInput,
  Trigger: ComboboxTrigger,
  Popover: ComboboxPopover,
  Listbox: ComboboxListbox,
  Group: ComboboxGroup,
  GroupLabel: ComboboxGroupLabel,
  Item: ComboboxItem,
  ItemLabel: ComboboxItemLabel,
  ItemIndicator: ComboboxItemIndicator,
  Description: ComboboxDescription,
  ErrorMessage: ComboboxErrorMessage,
  Empty: ComboboxEmpty,
  HiddenNativeSelect: ComboboxHiddenNativeSelect,
  Inline: ComboboxInline,
  Chip: ComboboxChip,
};
