/**
 * @component select
 * @title Select
 * @version 1.2.3
 * @example Basic select
 * Basic select — see the example below.
 * ```tsx
 * import { Select } from "~/components/ui/base/select";
 * 
 * <Select.Root>
 *   <Select.Label>Theme</Select.Label>
 *   <Select.Trigger>
 *     <Select.DisplayValue placeholder="Select an option" />
 *   </Select.Trigger>
 *   <Select.Popover>
 *     <Select.Item value="light">
 *       <Select.ItemLabel>Light</Select.ItemLabel>
 *       <Select.ItemIndicator>✓</Select.ItemIndicator>
 *     </Select.Item>
 *     <Select.Item value="dark">
 *       <Select.ItemLabel>Dark</Select.ItemLabel>
 *       <Select.ItemIndicator>✓</Select.ItemIndicator>
 *     </Select.Item>
 *   </Select.Popover>
 * </Select.Root>
 * ```
 *
 * @example Align item with trigger vs popper
 * Analogous to Radix/shadcn: `position=&quot;item-aligned&quot;` after opening shifts the panel so that the row with the current value (or highlighted item) is at the same height as the trigger; on a different choice the position is recomputed. `position=&quot;popper&quot;` does not enforce this — it behaves like a standard floating menu. Both variants start with the initial value in the middle of the list (1–10).
 * ```tsx
 * import { component$ } from "@builder.io/qwik";
 * import { Select } from "~/components/ui/base/select";
 * 
 * export const ItemAlignCompare = component$(() => {
 *   const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
 *     <Select.Item key={n} value={String(n)}>
 *       <Select.ItemLabel>{`Option ${n}`}</Select.ItemLabel>
 *     </Select.Item>
 *   ));
 *   return (
 *     <div class="flex flex-wrap gap-10">
 *       <div class="w-56 space-y-1">
 *         <p class="text-caption-1 text-secondary-label">item-aligned (default)</p>
 *         <Select.Root class="!max-w-none w-full" value="6">
 *           <Select.Trigger>
 *             <Select.DisplayValue placeholder="Select" />
 *           </Select.Trigger>
 *           <Select.Popover position="item-aligned">{items}</Select.Popover>
 *         </Select.Root>
 *       </div>
 *       <div class="w-56 space-y-1">
 *         <p class="text-caption-1 text-secondary-label">popper</p>
 *         <Select.Root class="!max-w-none w-full" value="6">
 *           <Select.Trigger>
 *             <Select.DisplayValue placeholder="Select" />
 *           </Select.Trigger>
 *           <Select.Popover position="popper">{items}</Select.Popover>
 *         </Select.Root>
 *       </div>
 *     </div>
 *   );
 * });
 * ```
 *
 * @example Panel alignment (align)
 * The `align` prop on `Select.Popover` : `start` (default, matches `bottom-start` ), `center` , `end` . Here all examples use `position=&quot;popper&quot;` so only the horizontal difference is visible. With a custom `floating` ending in `-start` / `-end`, `align` is not applied.
 * ```tsx
 * import { Select } from "~/components/ui/base/select";
 * 
 * // position="popper" disables vertical snapping to the selected item — shows purely horizontal align.
 * <div class="flex flex-wrap gap-8">
 *   <div class="w-56 space-y-1">
 *     <p class="text-caption-1 text-secondary-label">align="start" (default)</p>
 *     <Select.Root class="!max-w-none w-full">
 *       <Select.Trigger>
 *         <Select.DisplayValue placeholder="Start" />
 *       </Select.Trigger>
 *       <Select.Popover position="popper" align="start">
 *         <Select.Item value="a"><Select.ItemLabel>Ant</Select.ItemLabel></Select.Item>
 *         <Select.Item value="b"><Select.ItemLabel>Bee</Select.ItemLabel></Select.Item>
 *       </Select.Popover>
 *     </Select.Root>
 *   </div>
 *   <div class="w-56 space-y-1">
 *     <p class="text-caption-1 text-secondary-label">align="center"</p>
 *     <Select.Root class="!max-w-none w-full">
 *       <Select.Trigger>
 *         <Select.DisplayValue placeholder="Center" />
 *       </Select.Trigger>
 *       <Select.Popover position="popper" align="center">
 *         <Select.Item value="a"><Select.ItemLabel>Ant</Select.ItemLabel></Select.Item>
 *         <Select.Item value="b"><Select.ItemLabel>Bee</Select.ItemLabel></Select.Item>
 *       </Select.Popover>
 *     </Select.Root>
 *   </div>
 *   <div class="w-56 space-y-1">
 *     <p class="text-caption-1 text-secondary-label">align="end"</p>
 *     <Select.Root class="!max-w-none w-full">
 *       <Select.Trigger>
 *         <Select.DisplayValue placeholder="End" />
 *       </Select.Trigger>
 *       <Select.Popover position="popper" align="end">
 *         <Select.Item value="a"><Select.ItemLabel>Ant</Select.ItemLabel></Select.Item>
 *         <Select.Item value="b"><Select.ItemLabel>Bee</Select.ItemLabel></Select.Item>
 *       </Select.Popover>
 *     </Select.Root>
 *   </div>
 * </div>
 * ```
 *
 * @example Groups
 * Splitting items using `Select.Group` and `GroupLabel` (sections in the list).
 * ```tsx
 * import { Select } from "~/components/ui/base/select";
 * 
 * <Select.Root>
 *   <Select.Trigger>
 *     <Select.DisplayValue placeholder="Framework…" />
 *   </Select.Trigger>
 *   <Select.Popover>
 *     <Select.Group>
 *       <Select.GroupLabel>Popular</Select.GroupLabel>
 *       <Select.Item value="qwik">
 *         <Select.ItemLabel>Qwik</Select.ItemLabel>
 *       </Select.Item>
 *     </Select.Group>
 *     <Select.Group>
 *       <Select.GroupLabel>Other</Select.GroupLabel>
 *       <Select.Item value="other">
 *         <Select.ItemLabel>Other</Select.ItemLabel>
 *       </Select.Item>
 *     </Select.Group>
 *   </Select.Popover>
 * </Select.Root>
 * ```
 *
 * @example Controlled value (bind:value)
 * Controlled value (bind:value) — see the example below.
 * ```tsx
 * import { component$, useSignal } from "@builder.io/qwik";
 * import { Select } from "~/components/ui/base/select";
 * 
 * export const Controlled = component$(() => {
 *   const value = useSignal("banana");
 * 
 *   return (
 *     <>
 *       <Select.Root bind:value={value}>
 *         <Select.Trigger>
 *           <Select.DisplayValue placeholder="Fruit" />
 *         </Select.Trigger>
 *         <Select.Popover>
 *           <Select.Item value="apple">
 *             <Select.ItemLabel>Apple</Select.ItemLabel>
 *           </Select.Item>
 *           <Select.Item value="banana">
 *             <Select.ItemLabel>Banana</Select.ItemLabel>
 *           </Select.Item>
 *         </Select.Popover>
 *       </Select.Root>
 *       <p class="mt-2 text-caption-1 text-secondary-label">Value: {value.value}</p>
 *     </>
 *   );
 * });
 * ```
 
 
 
 */

import {
  component$,
  createContextId,
  type FunctionComponent,
  type PropsOf,
  type Signal,
  Slot,
  useContext,
  useSignal,
  useStyles$,
  useVisibleTask$,
} from "@builder.io/qwik";
import { Select as HeadlessSelect } from "@qwik-ui/headless";

/**
 * Same context name as in @qwik-ui/headless Select — Qwik matches by `context.id`, not by reference.
 */
type SelectAlignContext = {
  triggerRef: Signal<HTMLButtonElement | undefined>;
  popoverRef: Signal<HTMLElement | undefined>;
  selectedIndexSetSig: Signal<Set<number>>;
  highlightedIndexSig: Signal<number | null>;
  isListboxOpenSig: Signal<boolean>;
};

const selectAlignContextId = createContextId<SelectAlignContext>("Select");

/** Hides the panel until alignment so the Floating UI intermediate step is not visible. */
const selectItemAlignStyles = `
.qui-select-item-aligned[data-open]:not(.qui-select-item-aligned-ready) {
  visibility: hidden !important;
}
`;

const rootClass = "inline-block w-full max-w-xs";

const labelClass = "mb-1.5 block text-caption-1 font-medium text-label";

const triggerClass = [
  "flex h-10 w-full items-center justify-between gap-2 rounded-md border border-separator-opaque bg-surface-raised px-3 py-2 text-callout text-label shadow-sm ring-offset-background transition-colors",
  "hover:bg-surface-overlay focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
  "disabled:pointer-events-none disabled:opacity-50 data-[invalid]:border-destructive",
].join(" ");

const displayValueClass = "block min-w-0 flex-1 truncate text-left";

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

export type SelectRootProps = PropsOf<typeof HeadlessSelect.Root>;

export type SelectLabelProps = PropsOf<typeof HeadlessSelect.Label>;

export type SelectTriggerProps = PropsOf<typeof HeadlessSelect.Trigger>;

export type SelectDisplayValueProps = PropsOf<typeof HeadlessSelect.DisplayValue>;

/** Horizontal anchoring of the floating panel (Floating UI). */
export type SelectAlign = "start" | "center" | "end";

/**
 * `item-aligned` — after opening the panel shifts so that the selected (or highlighted) item
 * is at the same height as the trigger; when the selection changes the position is recomputed (like Radix `position="item-aligned"`).
 * `popper` — just standard Floating UI according to `align` / `floating`.
 */
export type SelectPosition = "item-aligned" | "popper";

type HeadlessPopoverProps = PropsOf<typeof HeadlessSelect.Popover>;

export type SelectPopoverProps = HeadlessPopoverProps & {
  /**
   * Horizontal alignment of the panel relative to the trigger (`bottom-start` / `bottom` / `bottom-end` etc.).
   * Ignored if you pass `floating` ending in `-start` or `-end`.
   */
  align?: SelectAlign;
  /**
   * Positioning strategy in the sense of Radix/shadcn Select.
   * Default: `item-aligned`.
   */
  position?: SelectPosition;
};

function resolveSelectPopoverFloating(
  floating: HeadlessPopoverProps["floating"] | undefined,
  align: SelectAlign
): HeadlessPopoverProps["floating"] {
  if (floating === false) return false;
  if (floating === undefined || floating === true) {
    if (align === "center") return true;
    if (align === "end") return "bottom-end";
    return "bottom-start";
  }
  if (typeof floating === "string") {
    if (/-(start|end)$/.test(floating)) return floating;
    if (align === "center") return floating;
    if (align === "end") return `${floating}-end` as HeadlessPopoverProps["floating"];
    return `${floating}-start` as HeadlessPopoverProps["floating"];
  }
  return floating;
}

/** @deprecated In Qwik UI `Listbox` is an empty fragment; insert items directly into {@link SelectPopover}. */
export type SelectListboxProps = PropsOf<typeof HeadlessSelect.Listbox>;

export type SelectGroupProps = PropsOf<typeof HeadlessSelect.Group>;

export type SelectGroupLabelProps = PropsOf<typeof HeadlessSelect.GroupLabel>;

export type SelectItemProps = PropsOf<typeof HeadlessSelect.Item>;

export type SelectItemLabelProps = PropsOf<typeof HeadlessSelect.ItemLabel>;

export type SelectItemIndicatorProps = PropsOf<typeof HeadlessSelect.ItemIndicator>;

export type SelectDescriptionProps = PropsOf<typeof HeadlessSelect.Description>;

export type SelectErrorMessageProps = PropsOf<typeof HeadlessSelect.ErrorMessage>;

export type SelectHiddenNativeSelectProps = PropsOf<typeof HeadlessSelect.HiddenNativeSelect>;

const SelectItemAlignEffect = component$<{ mode: SelectPosition }>((props) => {
  useStyles$(selectItemAlignStyles);
  const ctx = useContext(selectAlignContextId);
  const prevOpenSig = useSignal(false);

  useVisibleTask$(({ track, cleanup }) => {
    const itemAligned = track(() => props.mode === "item-aligned");
    const open = track(() => ctx.isListboxOpenSig.value);
    track(() => [...ctx.selectedIndexSetSig.value].sort((a, b) => a - b).join(","));
    track(() => ctx.highlightedIndexSig.value);

    const clearReady = () => {
      const p = ctx.popoverRef.value;
      if (p) p.classList.remove("qui-select-item-aligned-ready");
    };

    const readPanelTopPx = (panel: HTMLElement) => {
      const inline = parseFloat(panel.style.top);
      if (Number.isFinite(inline)) return inline;
      return parseFloat(getComputedStyle(panel).top);
    };

    // Only align to a selected item. Falling through to highlighted/first option when nothing is
    // selected causes the popup to jump to center as the user hovers; with no selection the panel
    // stays at its natural Floating UI position (below the trigger).
    const findAlignItem = (panel: HTMLElement) =>
      (panel.querySelector("[data-selected]") as HTMLElement | null);

    const applyAlign = () => {
      const panel = ctx.popoverRef.value;
      const trigger = ctx.triggerRef.value;
      if (!panel || !trigger) return;

      const item = findAlignItem(panel);
      if (!item) return;

      const triggerTop = trigger.getBoundingClientRect().top;
      const itemTop = item.getBoundingClientRect().top;
      const delta = triggerTop - itemTop;
      if (Math.abs(delta) < 0.5) return;

      const topPx = readPanelTopPx(panel);
      if (!Number.isFinite(topPx)) return;

      panel.style.top = `${topPx + delta}px`;
    };

    const revealAfterFloatingAndAlign = () => {
      let attempts = 0;
      const maxAttempts = 120;

      const step = () => {
        const panel = ctx.popoverRef.value;
        const trigger = ctx.triggerRef.value;
        if (!panel || !trigger || !ctx.isListboxOpenSig.value) {
          return;
        }

        const topReady = Number.isFinite(readPanelTopPx(panel));
        if (!topReady && attempts < maxAttempts) {
          attempts += 1;
          requestAnimationFrame(step);
          return;
        }

        if (!topReady) {
          const p = ctx.popoverRef.value;
          if (p && itemAligned && ctx.isListboxOpenSig.value) {
            p.classList.add("qui-select-item-aligned-ready");
          }
          return;
        }

        const item = findAlignItem(panel);
        if (item) {
          item.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "auto" });
        }

        requestAnimationFrame(() => {
          applyAlign();
          requestAnimationFrame(() => {
            applyAlign();
            requestAnimationFrame(() => {
              applyAlign();
              const p = ctx.popoverRef.value;
              if (p && itemAligned && ctx.isListboxOpenSig.value) {
                p.classList.add("qui-select-item-aligned-ready");
              }
            });
          });
        });
      };

      requestAnimationFrame(step);
    };

    if (!itemAligned || !open) {
      prevOpenSig.value = false;
      clearReady();
      return;
    }

    const wasOpen = prevOpenSig.value;
    prevOpenSig.value = true;
    const opening = !wasOpen;

    let rafOuter = 0;
    let rafInner = 0;

    const scheduleAdjust = () => {
      cancelAnimationFrame(rafOuter);
      cancelAnimationFrame(rafInner);
      rafOuter = requestAnimationFrame(() => {
        const panel = ctx.popoverRef.value;
        const item = panel && findAlignItem(panel);
        if (item) {
          item.scrollIntoView({ block: "nearest", inline: "nearest", behavior: "auto" });
        }
        rafInner = requestAnimationFrame(applyAlign);
      });
    };

    if (opening) {
      clearReady();
      revealAfterFloatingAndAlign();
    } else {
      scheduleAdjust();
    }

    const ro = new ResizeObserver(() => scheduleAdjust());
    const tEl = ctx.triggerRef.value;
    const pEl = ctx.popoverRef.value;
    if (tEl) ro.observe(tEl);
    if (pEl) ro.observe(pEl);

    const onScroll = () => scheduleAdjust();
    window.addEventListener("scroll", onScroll, true);

    cleanup(() => {
      cancelAnimationFrame(rafOuter);
      cancelAnimationFrame(rafInner);
      ro.disconnect();
      window.removeEventListener("scroll", onScroll, true);
    });
  });

  return null;
});

export const SelectItem: FunctionComponent<SelectItemProps> = (props) => {
  const merged = [itemClass, props.class].filter(Boolean).join(" ");
  return <HeadlessSelect.Item {...props} class={merged} />;
};

/**
 * The item text in the headless map must be **a single string** (typeahead calls `.slice()` on `displayValue`).
 * E.g. `{`Option ${id}`}` instead of `Option {id}` — otherwise Qwik may pass an array/object and SSR crashes.
 */
export const SelectItemLabel: FunctionComponent<SelectItemLabelProps> = (props) => {
  const merged = [itemLabelClass, props.class].filter(Boolean).join(" ");
  return <HeadlessSelect.ItemLabel {...props} class={merged} />;
};

export const SelectErrorMessage: FunctionComponent<SelectErrorMessageProps> = (props) => {
  const merged = [errorMessageClass, props.class].filter(Boolean).join(" ");
  return <HeadlessSelect.ErrorMessage {...props} class={merged} />;
};

/**
 * Select root — passes styled {@link SelectItem} / {@link SelectItemLabel} / {@link SelectErrorMessage}
 * into the headless walker (same principle as the Dropdown menu).
 */
export const SelectRoot: FunctionComponent<SelectRootProps> = (props) => {
  const {
    selectItemComponent,
    selectItemLabelComponent,
    selectErrorMessageComponent,
    class: className,
    ...rest
  } = props;
  const merged = [rootClass, className].filter(Boolean).join(" ");
  return (
    <HeadlessSelect.Root
      {...rest}
      class={merged}
      selectItemComponent={selectItemComponent ?? SelectItem}
      selectItemLabelComponent={selectItemLabelComponent ?? SelectItemLabel}
      selectErrorMessageComponent={selectErrorMessageComponent ?? SelectErrorMessage}
    />
  );
};

export const SelectLabel: FunctionComponent<SelectLabelProps> = (props) => {
  const merged = [labelClass, props.class].filter(Boolean).join(" ");
  return <HeadlessSelect.Label {...props} class={merged} />;
};

export const SelectTrigger: FunctionComponent<SelectTriggerProps> = (props) => {
  const merged = [triggerClass, props.class].filter(Boolean).join(" ");
  return <HeadlessSelect.Trigger {...props} class={merged} />;
};

export const SelectDisplayValue: FunctionComponent<SelectDisplayValueProps> = (props) => {
  const merged = [displayValueClass, props.class].filter(Boolean).join(" ");
  return <HeadlessSelect.DisplayValue {...props} class={merged} />;
};

export const SelectPopover = component$<SelectPopoverProps>((props) => {
  const {
    align = "start",
    position = "item-aligned",
    floating: floatingProp,
    gutter,
    class: className,
    ...rest
  } = props;
  const floating = resolveSelectPopoverFloating(floatingProp, align);
  const merged = [
    popoverPanelClass,
    position === "item-aligned" ? "qui-select-item-aligned" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const ctx = useContext(selectAlignContextId);

  useVisibleTask$(({ track }) => {
    track(() => ctx.isListboxOpenSig.value);
    track(() => ctx.triggerRef.value);
    const open = ctx.isListboxOpenSig.value;
    const panel = ctx.popoverRef.value;
    const trigger = ctx.triggerRef.value;
    if (!open || !panel || !trigger) return;
    const w = trigger.getBoundingClientRect().width;
    panel.style.minWidth = w > 0 ? `${Math.round(w)}px` : "";
  });

  return (
    <>
      <HeadlessSelect.Popover {...rest} class={merged} floating={floating} gutter={gutter ?? 4}>
        <Slot />
      </HeadlessSelect.Popover>
      <SelectItemAlignEffect mode={position} />
    </>
  );
});

/** @deprecated Insert items directly into {@link SelectPopover}. */
export const SelectListbox: FunctionComponent<SelectListboxProps> = (props) => (
  <HeadlessSelect.Listbox {...props} />
);

export const SelectGroup: FunctionComponent<SelectGroupProps> = (props) => {
  const merged = [groupClass, props.class].filter(Boolean).join(" ");
  return <HeadlessSelect.Group {...props} class={merged} />;
};

export const SelectGroupLabel: FunctionComponent<SelectGroupLabelProps> = (props) => {
  const merged = [groupLabelClass, props.class].filter(Boolean).join(" ");
  return <HeadlessSelect.GroupLabel {...props} class={merged} />;
};

export const SelectItemIndicator: FunctionComponent<SelectItemIndicatorProps> = (props) => {
  const merged = [itemIndicatorClass, props.class].filter(Boolean).join(" ");
  return <HeadlessSelect.ItemIndicator {...props} class={merged} />;
};

export const SelectDescription: FunctionComponent<SelectDescriptionProps> = (props) => {
  const merged = [descriptionClass, props.class].filter(Boolean).join(" ");
  return <HeadlessSelect.Description {...props} class={merged} />;
};

export const SelectHiddenNativeSelect: FunctionComponent<SelectHiddenNativeSelectProps> = (props) => (
  <HeadlessSelect.HiddenNativeSelect {...props} />
);

/**
 * Composite API over {@link https://qwikui.com/docs/headless/select | @qwik-ui/headless Select}
 * (shadcn "Select"); styles from COLORS.md as with the Dropdown menu / Popover.
 */
export const Select = {
  Root: SelectRoot,
  Label: SelectLabel,
  Trigger: SelectTrigger,
  DisplayValue: SelectDisplayValue,
  Popover: SelectPopover,
  Listbox: SelectListbox,
  Group: SelectGroup,
  GroupLabel: SelectGroupLabel,
  Item: SelectItem,
  ItemLabel: SelectItemLabel,
  ItemIndicator: SelectItemIndicator,
  Description: SelectDescription,
  ErrorMessage: SelectErrorMessage,
  HiddenNativeSelect: SelectHiddenNativeSelect,
};
