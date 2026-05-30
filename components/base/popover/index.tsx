/**
 * @component popover
 * @title Popover
 * @version 1.0.1
 * @example Basic usage
 * Basic usage — see the example below.
 * ```tsx
 * import { Popover } from "~/components/ui/base/popover";
 * 
 * <Popover.Root>
 *   <Popover.Trigger>Open</Popover.Trigger>
 *   <Popover.Panel>
 *     <div class="space-y-2 p-4">
 *       <p class="text-callout font-medium text-label">Popover content</p>
 *       <p class="text-caption-1 text-secondary-label">
 *         An inner block with padding — the panel host in floating mode may have its padding reset by headless CSS.
 *       </p>
 *     </div>
 *   </Popover.Panel>
 * </Popover.Root>
 * ```
 *
 * @example Placement (floating)
 * The `floating` prop on the root passes the Floating UI placement (e.g. `"top"` , `"bottom-end"` ).
 * ```tsx
 * import { Popover } from "~/components/ui/base/popover";
 * 
 * <Popover.Root floating="top">
 *   <Popover.Trigger>Up</Popover.Trigger>
 *   <Popover.Panel>
 *     <div class="p-4 text-callout text-secondary-label">Panel above the trigger.</div>
 *   </Popover.Panel>
 * </Popover.Root>
 * ```
 *
 * @example Arrow
 * Set `arrow` on `Popover.Root` and insert `Popover.PanelArrow` into the panel.
 * ```tsx
 * import { Popover } from "~/components/ui/base/popover";
 * 
 * <Popover.Root gutter={8} arrow floating="left">
 *   <Popover.Trigger>With arrow</Popover.Trigger>
 *   <Popover.Panel>
 *     <Popover.PanelArrow />
 *     <div class="p-4 text-callout text-secondary-label">
 *       The root has an <code>arrow</code> prop for the Floating UI middleware.
 *     </div>
 *   </Popover.Panel>
 * </Popover.Root>
 * 
 * <Popover.Root gutter={8} arrow  floating="top">
 *   <Popover.Trigger>With arrow</Popover.Trigger>
 *   <Popover.Panel>
 *     <Popover.PanelArrow />
 *     <div class="p-4 text-callout text-secondary-label">
 *       The root has an <code>arrow</code> prop for the Floating UI middleware.
 *     </div>
 *   </Popover.Panel>
 * </Popover.Root>
 * 
 * <Popover.Root gutter={8} arrow  floating="bottom">
 *   <Popover.Trigger>With arrow</Popover.Trigger>
 *   <Popover.Panel>
 *     <Popover.PanelArrow />
 *     <div class="p-4 text-callout text-secondary-label">
 *       The root has an <code>arrow</code> prop for the Floating UI middleware.
 *     </div>
 *   </Popover.Panel>
 * </Popover.Root>
 * 
 * <Popover.Root gutter={8} arrow  floating="right">
 *   <Popover.Trigger>With arrow</Popover.Trigger>
 *   <Popover.Panel>
 *     <Popover.PanelArrow />
 *     <div class="p-4 text-callout text-secondary-label">
 *       The root has an <code>arrow</code> prop for the Floating UI middleware.
 *     </div>
 *   </Popover.Panel>
 * </Popover.Root>
 * ```
 
 
 
 
 
 
 
 
 
 */

import { component$, type FunctionComponent, type PropsOf, useContext, useSignal, useTask$ } from "@builder.io/qwik";
import { Popover as HeadlessPopover } from "@qwik-ui/headless";
import {
  floatingAnchorFromPopoverContext,
  floatingArrowEdgeClassForPlacement,
  floatingOutlineButtonTriggerClass,
  floatingPanelArrowClass,
  floatingPopoverPanelClass,
} from "../utilities/floating-ui";
import { headlessPopoverContextId } from "../utilities/headless-popover-context";

/** Root — holds context for the trigger and panel (floating placement via Floating UI by default). */
const rootClass = "inline-block";

/** Button trigger — see {@link floatingOutlineButtonTriggerClass}. */
const triggerClass = floatingOutlineButtonTriggerClass;

/**
 * The panel host may have its padding reset on `[data-floating]` by headless CSS — keep inner spacing
 * in a child block or add a custom `class` with `!p-4` etc.
 */
const panelClass = floatingPopoverPanelClass;

/** Arrow base; the axis perpendicular to the edge is added by {@link floatingArrowEdgeClassForPlacement} via {@link headlessPopoverContextId}. */
const panelArrowClass = floatingPanelArrowClass;

export type PopoverRootProps = PropsOf<typeof HeadlessPopover.Root>;

export type PopoverTriggerProps = PropsOf<typeof HeadlessPopover.Trigger>;

export type PopoverPanelProps = PropsOf<typeof HeadlessPopover.Panel>;

export type PopoverPanelArrowProps = PropsOf<typeof HeadlessPopover.PanelArrow>;

export const PopoverRoot: FunctionComponent<PopoverRootProps> = (props) => {
  const merged = [rootClass, props.class].filter(Boolean).join(" ");
  return <HeadlessPopover.Root {...props} class={merged} />;
};

export const PopoverTrigger: FunctionComponent<PopoverTriggerProps> = (props) => {
  const merged = [triggerClass, props.class].filter(Boolean).join(" ");
  return <HeadlessPopover.Trigger {...props} class={merged} />;
};

export const PopoverPanel: FunctionComponent<PopoverPanelProps> = (props) => {
  const merged = [panelClass, props.class].filter(Boolean).join(" ");
  return <HeadlessPopover.Panel {...props} class={merged} />;
};

export const PopoverPanelArrow = component$<PopoverPanelArrowProps>((props) => {
  const ctx = useContext(headlessPopoverContextId);
  const initialSide =
    typeof ctx.floating === "string" ? ctx.floating.split("-")[0] : "bottom";
  const sideSig = useSignal(initialSide);

  useTask$(({ track, cleanup }) => {
    track(() => ctx.isOpenSig?.value);
    track(() => ctx.anchorRef?.value);
    track(() => ctx.triggerRef?.value);
    if (!ctx.isOpenSig?.value) return;

    const panel = ctx.panelRef?.value;
    const anchor = floatingAnchorFromPopoverContext(ctx);
    if (!panel || !anchor) return;

    const updateSide = () => {
      const pr = panel.getBoundingClientRect();
      const tr = anchor.getBoundingClientRect();
      const dy = Math.abs((pr.top + pr.bottom) / 2 - (tr.top + tr.bottom) / 2);
      const dx = Math.abs((pr.left + pr.right) / 2 - (tr.left + tr.right) / 2);
      if (dy >= dx) {
        sideSig.value = (pr.top + pr.bottom) / 2 < (tr.top + tr.bottom) / 2 ? "top" : "bottom";
      } else {
        sideSig.value = (pr.left + pr.right) / 2 < (tr.left + tr.right) / 2 ? "left" : "right";
      }
    };

    const observer = new MutationObserver(updateSide);
    observer.observe(panel, { attributes: true, attributeFilter: ["style"] });
    updateSide();

    cleanup(() => observer.disconnect());
  });

  const edgeClass = floatingArrowEdgeClassForPlacement(sideSig.value);
  const merged = [panelArrowClass, edgeClass, props.class].filter(Boolean).join(" ");
  return <HeadlessPopover.PanelArrow {...props} class={merged} />;
});

/**
 * Composite API over {@link https://qwikui.com/docs/headless/popover | @qwik-ui/headless Popover}
 * with styles from COLORS.md (tokens as in Tab/Button).
 */
export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Panel: PopoverPanel,
  PanelArrow: PopoverPanelArrow,
};
