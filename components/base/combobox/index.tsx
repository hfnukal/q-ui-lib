/**
 * @component combobox
 * @title Combobox
 * @version 1.1.1
 * @example Filtering and empty state
 * Headless enables `filter` by default — non-matching items hide as you type. With `Combobox.Empty` you show a message when nothing remains.
 * ```tsx
 * import { Combobox } from "~/components/ui/base/combobox";
 * 
 * <Combobox.Root filter placeholder="Search framework…">
 *   <Combobox.Label>Framework</Combobox.Label>
 *   <Combobox.Control>
 *     <Combobox.Input />
 *     <Combobox.Trigger>▼</Combobox.Trigger>
 *   </Combobox.Control>
 *   <Combobox.Popover>
 *     <Combobox.Item value="qwik">
 *       <Combobox.ItemLabel>Qwik</Combobox.ItemLabel>
 *     </Combobox.Item>
 *     <Combobox.Item value="react">
 *       <Combobox.ItemLabel>React</Combobox.ItemLabel>
 *     </Combobox.Item>
 *     <Combobox.Empty>No match.</Combobox.Empty>
 *   </Combobox.Popover>
 * </Combobox.Root>
 * ```
 *
 * @example Controlled value (bind:value)
 * The selected value in a signal via `bind:value` (controlled combobox).
 * ```tsx
 * import { component$, useSignal } from "@builder.io/qwik";
 * import { Combobox } from "~/components/ui/base/combobox";
 * 
 * export const Controlled = component$(() => {
 *   const value = useSignal("praha");
 * 
 *   return (
 *     <>
 *       <Combobox.Root bind:value={value} filter placeholder="City…">
 *         <Combobox.Label>City</Combobox.Label>
 *         <Combobox.Control>
 *           <Combobox.Input />
 *           <Combobox.Trigger>▼</Combobox.Trigger>
 *         </Combobox.Control>
 *         <Combobox.Popover>
 *           <Combobox.Item value="praha">
 *             <Combobox.ItemLabel>Prague</Combobox.ItemLabel>
 *           </Combobox.Item>
 *           <Combobox.Item value="brno">
 *             <Combobox.ItemLabel>Brno</Combobox.ItemLabel>
 *           </Combobox.Item>
 *           <Combobox.Empty>Nothing found.</Combobox.Empty>
 *         </Combobox.Popover>
 *       </Combobox.Root>
 *       <p class="mt-2 text-caption-1 text-secondary-label">Value: {value.value}</p>
 *     </>
 *   );
 * });
 * ```
 *
 * @example Multiple selection and chips
 * With `multiple` and `bind:value` as `string[]` (without a one-off `value` on the root — headless does not allow it in multi mode). Render the selected items as `Combobox.Chip` with `onRemove ; filtering them out of the array synchronizes the state. On `Combobox.Control` use `comboboxMultiselectControlClass` and on the input `comboboxMultiselectInputClass` . Without `Combobox.Trigger` (no arrow): open the list on input focus via `bind:open` and `onFocus . Keep the input text in a separate signal via `Combobox.Input bind:value` (default empty string) — otherwise headless would fill the input with the names of the selected items when `multiple`; the selection stays only on the chips. After a selection change, clear the filter in `onChange on the root. In the list, mark the selected rows via `Combobox.ItemIndicator` (headless shows them only for selected items).
 * ```tsx
 * import { $, component$, useSignal } from "@builder.io/qwik";
 * import {
 *   Combobox,
 *   comboboxMultiselectControlClass,
 *   comboboxMultiselectInputClass,
 * } from "~/components/ui/base/combobox";
 * 
 * const LANGS = [
 *   { value: "ts", label: "TypeScript" },
 *   { value: "rust", label: "Rust" },
 *   { value: "go", label: "Go" },
 * ];
 * 
 * export const Multi = component$(() => {
 *   const selected = useSignal<string[]>(["ts", "rust"]);
 *   const filterText = useSignal("");
 *   const open = useSignal(false);
 *   const remove$ = $((v: string) => {
 *     selected.value = selected.value.filter((x) => x !== v);
 *   });
 * 
 *   return (
 *     <Combobox.Root
 *       multiple
 *       bind:value={selected}
 *       bind:open={open}
 *       filter
 *       placeholder="Add a language…"
 *       onChange$={$(() => {
 *         filterText.value = "";
 *       })}
 *     >
 *       <Combobox.Label>Languages</Combobox.Label>
 *       <Combobox.Control class={comboboxMultiselectControlClass}>
 *         {selected.value.map((v) => (
 *           <Combobox.Chip key={v} value={v} onRemove$={remove$}>
 *             {LANGS.find((l) => l.value === v)?.label ?? v}
 *           </Combobox.Chip>
 *         ))}
 *         <Combobox.Input
 *           bind:value={filterText}
 *           class={comboboxMultiselectInputClass}
 *           onFocus$={$(() => {
 *             open.value = true;
 *           })}
 *         />
 *       </Combobox.Control>
 *       <Combobox.Popover>
 *         {LANGS.map(({ value, label }) => (
 *           <Combobox.Item key={value} value={value}>
 *             <Combobox.ItemLabel>{label}</Combobox.ItemLabel>
 *             <Combobox.ItemIndicator>
 *               <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
 *                 <path stroke-linecap="round" stroke-linejoin="round" d="M20 6L9 17l-5-5" />
 *               </svg>
 *             </Combobox.ItemIndicator>
 *           </Combobox.Item>
 *         ))}
 *         <Combobox.Empty>No languages.</Combobox.Empty>
 *       </Combobox.Popover>
 *     </Combobox.Root>
 *   );
 * });
 * ```
 *
 * @example showOnFocus — open on focus
 * The `showOnFocus` prop on `Combobox.Input` opens the list automatically on focus without having to type.
 * ```tsx
 * import { Combobox } from "~/components/ui/base/combobox";
 *
 * <Combobox.Root filter placeholder="Select or type…">
 *   <Combobox.Label>Selection</Combobox.Label>
 *   <Combobox.Control>
 *     <Combobox.Input showOnFocus />
 *     <Combobox.Trigger>▼</Combobox.Trigger>
 *   </Combobox.Control>
 *   <Combobox.Popover>
 *     <Combobox.Item value="qwik">
 *       <Combobox.ItemLabel>Qwik</Combobox.ItemLabel>
 *     </Combobox.Item>
 *     <Combobox.Item value="react">
 *       <Combobox.ItemLabel>React</Combobox.ItemLabel>
 *     </Combobox.Item>
 *     <Combobox.Item value="vue">
 *       <Combobox.ItemLabel>Vue</Combobox.ItemLabel>
 *     </Combobox.Item>
 *     <Combobox.Empty>No match.</Combobox.Empty>
 *   </Combobox.Popover>
 * </Combobox.Root>
 * ```
 *
 
 
 
 */

import {
  $,
  component$,
  createContextId,
  type FunctionComponent,
  type PropsOf,
  type QRL,
  type Signal,
  Slot,
  useContext,
  useVisibleTask$,
} from "@builder.io/qwik";
import { Combobox as HeadlessCombobox } from "@qwik-ui/headless";
import { floatingComboboxListPanelClass } from "../utilities/floating-ui";

/** Must match the `createContextId` in @qwik-ui/headless combobox (the `qui-combobox` string). */
type ComboboxCtxLite = {
  controlRef: Signal<HTMLDivElement | undefined>;
  panelRef: Signal<HTMLDivElement | undefined>;
  isListboxOpenSig: Signal<boolean>;
};
const comboboxContextId = createContextId<ComboboxCtxLite>("qui-combobox");

const rootClass = "inline-block w-full max-w-xs";

const labelClass = "mb-1.5 block text-caption-1 font-medium text-label";

/**
 * Wrapper for the input + arrow button — a single frame like shadcn Combobox.
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

const popoverPanelClass = floatingComboboxListPanelClass;

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
 * Wraps {@link ComboboxControl} for multiple selections with chips (line wrapping, inner gaps).
 * Replaces the default single-line control class.
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

/** Input inside the multiselect control — lower line height next to the chips. */
export const comboboxMultiselectInputClass = [
  "h-8 min-h-8 min-w-[6rem] flex-1 border-0 bg-transparent px-2 py-1 text-callout text-label shadow-none outline-none",
  "placeholder:text-placeholder",
  "focus:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
  "disabled:cursor-not-allowed disabled:opacity-50",
].join(" ");

export type ComboboxChipProps = {
  class?: string;
  /** The value matching the `Combobox.Item` `value` — passed to {@link ComboboxChipProps.onRemove$}. */
  value: string;
  /** On clicking the remove icon (e.g. filter out from the array in `bind:value`). */
  onRemove$?: QRL<(value: string) => void>;
};

/**
 * A compact label for displaying a selected value in a multiselect combobox; the remove icon is optional via {@link ComboboxChipProps.onRemove$}.
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
          aria-label="Remove"
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

export type ComboboxInputProps = PropsOf<typeof HeadlessCombobox.Input> & {
  /** On input focus opens the list (useful with `filter`). */
  showOnFocus?: boolean;
};

export type ComboboxTriggerProps = PropsOf<typeof HeadlessCombobox.Trigger>;

type HeadlessComboboxPopoverProps = PropsOf<typeof HeadlessCombobox.Popover>;

export type ComboboxPopoverProps = HeadlessComboboxPopoverProps;

function resolveComboboxPopoverFloating(
  floating: HeadlessComboboxPopoverProps["floating"] | undefined,
): HeadlessComboboxPopoverProps["floating"] {
  if (floating === false) return false;
  if (floating === undefined || floating === true) {
    return "bottom-start";
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
 * The item text must be a single string in the headless map (typeahead). Use e.g. {\`Item ${id}\`}.
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
 * Combobox root — passes styled {@link ComboboxItem} / {@link ComboboxItemLabel} into the headless walker
 * (the same principle as Select). Insert styled {@link ComboboxEmpty} and {@link ComboboxErrorMessage} into the tree as children.
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

export const ComboboxInput = component$<ComboboxInputProps>((props) => {
  const ctx = useContext(comboboxContextId);
  const { showOnFocus, onFocus$, class: className, ...rest } = props;
  const merged = [inputClass, className].filter(Boolean).join(" ");
  const mergedOnFocus$ = $((e: FocusEvent, el: HTMLInputElement) => {
    if (showOnFocus) {
      ctx.isListboxOpenSig.value = true;
    }
    if (onFocus$) {
      const fn = onFocus$ as QRL<(ev: FocusEvent, element: HTMLInputElement) => void>;
      void fn(e, el);
    }
  });
  return (
    <HeadlessCombobox.Input
      {...rest}
      class={merged}
      onFocus$={showOnFocus || onFocus$ ? mergedOnFocus$ : undefined}
    />
  );
});

export const ComboboxTrigger: FunctionComponent<ComboboxTriggerProps> = (props) => {
  const merged = [triggerClass, props.class].filter(Boolean).join(" ");
  return <HeadlessCombobox.Trigger {...props} class={merged} />;
};

export const ComboboxPopover = component$<ComboboxPopoverProps>((props) => {
  const ctx = useContext(comboboxContextId);
  const { floating: floatingProp, gutter, class: className, ...rest } = props;
  const floating = resolveComboboxPopoverFloating(floatingProp);
  const merged = [popoverPanelClass, "mt-0.5", className].filter(Boolean).join(" ");

  useVisibleTask$(({ track }) => {
    track(() => ctx.isListboxOpenSig.value);
    track(() => ctx.controlRef.value);
    const open = ctx.isListboxOpenSig.value;
    const panel = ctx.panelRef.value;
    const ctrl = ctx.controlRef.value;
    if (!open || !panel || !ctrl) {
      return;
    }
    const w = ctrl.getBoundingClientRect().width;
    panel.style.minWidth = w > 0 ? `${Math.round(w)}px` : "";
  });

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
 * Compound API over {@link https://qwikui.com/docs/headless/combobox | @qwik-ui/headless Combobox}
 * (shadcn "Combobox"); styles from COLORS.md like Select / Popover.
 */
export const Combobox = {
  Root: ComboboxRoot,
  Label: ComboboxLabel,
  HiddenNativeSelect: ComboboxHiddenNativeSelect,
  Control: ComboboxControl,
  ControlInput: ComboboxInput,
  ControlTrigger: ComboboxTrigger,
  Input: ComboboxInput,
  Trigger: ComboboxTrigger,
  Popover: ComboboxPopover,
  Listbox: ComboboxListbox,
  Group: ComboboxGroup,
  GroupLabel: ComboboxGroupLabel,
  PopoverItem: ComboboxItem,
  PopoverItemLabel: ComboboxItemLabel,
  PopoverItemIndicator: ComboboxItemIndicator,
  Item: ComboboxItem,
  ItemLabel: ComboboxItemLabel,
  ItemIndicator: ComboboxItemIndicator,
  PopoverInline: ComboboxInline,
  Inline: ComboboxInline,
  PopoverChip: ComboboxChip,
  /** Alias for {@link ComboboxChip} — same as `PopoverChip`. */
  Chip: ComboboxChip,
  PopoverEmpty: ComboboxEmpty,
  Empty: ComboboxEmpty,
  Description: ComboboxDescription,
  ErrorMessage: ComboboxErrorMessage,
};
