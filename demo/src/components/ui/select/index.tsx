/**
 * @component select
 * @title Select
 * @version 1.2.3
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
 * Stejný název kontextu jako v @qwik-ui/headless Select — Qwik páruje podle `context.id`, ne podle reference.
 */
type SelectAlignContext = {
  triggerRef: Signal<HTMLButtonElement | undefined>;
  popoverRef: Signal<HTMLElement | undefined>;
  selectedIndexSetSig: Signal<Set<number>>;
  highlightedIndexSig: Signal<number | null>;
  isListboxOpenSig: Signal<boolean>;
};

const selectAlignContextId = createContextId<SelectAlignContext>("Select");

/** Skryje panel do zarovnání, aby nebyl vidět mezikrok Floating UI. */
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

/** Horizontální ukotvení plovoucího panelu (Floating UI). */
export type SelectAlign = "start" | "center" | "end";

/**
 * `item-aligned` — po otevření se panel posune tak, aby vybraná (nebo zvýrazněná) položka
 * byla na stejné výšce jako trigger; při změně výběru se pozice znovu dopočítá (jako Radix `position="item-aligned"`).
 * `popper` — jen standardní Floating UI podle `align` / `floating`.
 */
export type SelectPosition = "item-aligned" | "popper";

type HeadlessPopoverProps = PropsOf<typeof HeadlessSelect.Popover>;

export type SelectPopoverProps = HeadlessPopoverProps & {
  /**
   * Horizontální zarovnání panelu vůči triggeru (`bottom-start` / `bottom` / `bottom-end` apod.).
   * Ignoruje se, pokud předáš `floating` s příponou `-start` nebo `-end`.
   */
  align?: SelectAlign;
  /**
   * Strategie pozicování ve smyslu Radix/shadcn Select.
   * Výchozí: `item-aligned`.
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

/** @deprecated V Qwik UI je `Listbox` prázdný fragment; položky vkládej přímo do {@link SelectPopover}. */
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

    const findAlignItem = (panel: HTMLElement) =>
      (panel.querySelector("[data-selected]") as HTMLElement | null) ??
      (panel.querySelector("[data-highlighted]") as HTMLElement | null) ??
      (panel.querySelector('[role="option"]:not([data-disabled])') as HTMLElement | null);

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
            const p = ctx.popoverRef.value;
            if (p && itemAligned && ctx.isListboxOpenSig.value) {
              p.classList.add("qui-select-item-aligned-ready");
            }
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
 * Text položky v mapě headlessu musí být **jeden řetězec** (typeahead volá `.slice()` na `displayValue`).
 * Např. `{`Možnost ${id}`}` místo `Možnost {id}` — jinak Qwik může předat pole/objekt a SSR spadne.
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
 * Kořen selectu — předává stylované {@link SelectItem} / {@link SelectItemLabel} / {@link SelectErrorMessage}
 * do headless walkeru (stejný princip jako u Dropdown menu).
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

  return (
    <>
      <HeadlessSelect.Popover {...rest} class={merged} floating={floating} gutter={gutter ?? 4}>
        <Slot />
      </HeadlessSelect.Popover>
      <SelectItemAlignEffect mode={position} />
    </>
  );
});

/** @deprecated Položky vkládej přímo do {@link SelectPopover}. */
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
 * Složené API nad {@link https://qwikui.com/docs/headless/select | @qwik-ui/headless Select}
 * (shadcn „Select“); styly z COLORS.md jako u Dropdown menu / Popover.
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
