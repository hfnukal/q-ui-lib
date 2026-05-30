/**
 * @component tooltip
 * @title Tooltip
 * @version 1.0.0
 * @example Basic usage
 * Opens on hover and on keyboard focus; closes on Escape (headless behavior).
 * ```tsx
 * import { Tooltip } from "~/components/ui/base/tooltip";
 * 
 * <Tooltip.Root>
 *   <Tooltip.Trigger>Hover or focus</Tooltip.Trigger>
 *   <Tooltip.Panel>Short hint for the element.</Tooltip.Panel>
 * </Tooltip.Root>
 * ```
 *
 * @example Placement
 * The `placement` prop on the root matches Floating UI (defaults to `top` ).
 * ```tsx
 * import { Tooltip } from "~/components/ui/base/tooltip";
 * 
 * <Tooltip.Root placement="bottom">
 *   <Tooltip.Trigger>Panel below</Tooltip.Trigger>
 *   <Tooltip.Panel>Placement via the placement prop (as in headless).</Tooltip.Panel>
 * </Tooltip.Root>
 * ```
 *
 * @example Delay
 * The `delayDuration` prop (ms) — a delay before opening, useful for a dense interface.
 * ```tsx
 * import { Tooltip } from "~/components/ui/base/tooltip";
 * 
 * <Tooltip.Root delayDuration={400}>
 *   <Tooltip.Trigger>400 ms delay</Tooltip.Trigger>
 *   <Tooltip.Panel>Opens only after the delay — useful for a dense interface.</Tooltip.Panel>
 * </Tooltip.Root>
 * ```
 *
 * @example Arrow (optional)
 * `Tooltip.Arrow` follows the actual panel position (even after a flip while scrolling) — just add it to the panel and add padding on the relevant side.
 * ```tsx
 * import { Tooltip } from "~/components/ui/base/tooltip";
 *
 * <div class="flex flex-wrap gap-6">
 *   <Tooltip.Root placement="top">
 *     <Tooltip.Trigger>Top</Tooltip.Trigger>
 *     <Tooltip.Panel class="pb-2">
 *       <Tooltip.Arrow />
 *       The arrow follows the panel.
 *     </Tooltip.Panel>
 *   </Tooltip.Root>
 *   <Tooltip.Root placement="bottom">
 *     <Tooltip.Trigger>Bottom</Tooltip.Trigger>
 *     <Tooltip.Panel class="pt-2">
 *       <Tooltip.Arrow />
 *       Panel below.
 *     </Tooltip.Panel>
 *   </Tooltip.Root>
 *   <Tooltip.Root placement="right">
 *     <Tooltip.Trigger>Right</Tooltip.Trigger>
 *     <Tooltip.Panel class="pl-2">
 *       <Tooltip.Arrow />
 *       Panel on the right.
 *     </Tooltip.Panel>
 *   </Tooltip.Root>
 * </div>
 * ```
 
 
 
 
 
 
 
 
 
 */

import { component$, type FunctionComponent, type PropsOf, useContext, useSignal, useTask$ } from "@builder.io/qwik";
import { isServer } from "@builder.io/qwik/build";
import { Tooltip as HeadlessTooltip } from "@qwik-ui/headless";
import { floatingAnchorFromPopoverContext } from "../utilities/floating-ui";
import { headlessPopoverContextId } from "../utilities/headless-popover-context";

/** Root — context for the trigger and panel (Floating UI, default `placement` = top). */
const rootClass = "inline-block";

/**
 * In headless the trigger is always a `<button>` — reset the default button styles so it can be used as a wrapper
 * for an icon or text (focus ring per COLORS.md).
 */
const triggerClass =
  "inline-flex max-w-full cursor-default items-center justify-center rounded-sm border-0 bg-transparent p-0 font-inherit text-inherit shadow-none ring-offset-background transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

/**
 * Outer panel — `data-floating` from headless; reset padding/border/overflow on this node (see popover.css in @qwik-ui/headless).
 * The visuals live on the inner `div` (`panelInnerClass`), so that `px-3` / `py-1.5` and user `class` on the panel don't go to waste.
 */
const panelOuterClass =
  "z-50 max-w-[min(20rem,calc(100vw-2rem))] outline-none ring-offset-background";

/** Inner surface of the tooltip — inverted (`bg-label` / `text-background`); `relative` for the absolute arrow. */
const panelInnerClass =
  "relative overflow-visible rounded-md border border-separator-opaque bg-label px-3 py-1.5 text-caption-1 text-background shadow-md";

/**
 * Base arrow class — border-b border-r with bg-label (inverted). Position and rotation are added by
 * {@link tooltipArrowEdgeClass} based on placement.
 */
const arrowBaseClass =
  "pointer-events-none absolute z-10 h-2 w-2 border-b border-r border-separator-opaque bg-label shadow-sm transition-none";

function tooltipArrowEdgeClass(side: string): string {
  switch (side) {
    case "bottom": return "top-0 left-1/2 [transform:translateX(-50%)_translateY(-50%)_rotate(225deg)]";
    case "left":   return "right-0 top-1/2 [transform:translateX(50%)_translateY(-50%)_rotate(315deg)]";
    case "right":  return "left-0 top-1/2 [transform:translateX(-50%)_translateY(-50%)_rotate(135deg)]";
    case "top": default: return "top-full left-1/2 [transform:translateX(-50%)_translateY(-50%)_rotate(45deg)]";
  }
}

export type TooltipRootProps = PropsOf<typeof HeadlessTooltip.Root>;

export type TooltipTriggerProps = PropsOf<typeof HeadlessTooltip.Trigger>;

export type TooltipPanelProps = PropsOf<typeof HeadlessTooltip.Panel>;

export type TooltipArrowProps = PropsOf<typeof HeadlessTooltip.Arrow> & {
  /** Matches `placement` on the root — determines the arrow orientation. Defaults to `top`. */
  placement?: "top" | "bottom" | "left" | "right" | string;
};

export const TooltipRoot: FunctionComponent<TooltipRootProps> = (props) => {
  const merged = [rootClass, props.class].filter(Boolean).join(" ");
  return <HeadlessTooltip.Root {...props} class={merged} />;
};

export const TooltipTrigger: FunctionComponent<TooltipTriggerProps> = (props) => {
  const merged = [triggerClass, props.class].filter(Boolean).join(" ");
  return <HeadlessTooltip.Trigger {...props} class={merged} type={props.type ?? "button"} />;
};

export const TooltipPanel: FunctionComponent<TooltipPanelProps> = (props) => {
  const { class: userClass, children, ...rest } = props;
  const innerMerged = [panelInnerClass, userClass].filter(Boolean).join(" ");
  return (
    <HeadlessTooltip.Panel {...rest} class={panelOuterClass}>
      <div class={innerMerged}>{children}</div>
    </HeadlessTooltip.Panel>
  );
};

const arrowSize = 8;

/**
 * Arrow with dynamic tracking of the panel position — reacts to a flip while scrolling too.
 * Tooltip internally uses `HPopoverRoot`, so `headlessPopoverContextId` is available.
 */
export const TooltipArrow = component$<TooltipArrowProps>((props) => {
  const { width = arrowSize, height = arrowSize, class: className, placement = "top", ...rest } = props;
  const ctx = useContext(headlessPopoverContextId);
  const initialSide =
    typeof ctx.floating === "string" ? ctx.floating.split("-")[0] : placement.split("-")[0];
  const sideSig = useSignal(initialSide);
  const placedSig = useSignal(false);

  useTask$(({ track, cleanup }) => {
    track(() => ctx.isOpenSig?.value);
    track(() => ctx.panelRef?.value);
    track(() => ctx.triggerRef?.value);
    track(() => ctx.anchorRef?.value);
    if (!ctx.isOpenSig?.value) {
      placedSig.value = false;
      return;
    }
    if (isServer) return;

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

    let raf1Id = 0;
    let raf2Id = 0;
    raf1Id = requestAnimationFrame(() => {
      updateSide();
      raf2Id = requestAnimationFrame(() => {
        updateSide();
        placedSig.value = true;
      });
    });

    cleanup(() => {
      observer.disconnect();
      cancelAnimationFrame(raf1Id);
      cancelAnimationFrame(raf2Id);
    });
  });

  const edgeClass = tooltipArrowEdgeClass(sideSig.value);
  const showClass = placedSig.value ? "" : "opacity-0";
  const merged = [arrowBaseClass, edgeClass, showClass, className].filter(Boolean).join(" ");
  return <HeadlessTooltip.Arrow {...rest} width={width} height={height} class={merged} />;
});

/**
 * Compound API over {@link https://qwikui.com/docs/headless/tooltip | @qwik-ui/headless Tooltip}
 * with styles from COLORS.md (tokens as in Popover).
 */
export const Tooltip = {
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Panel: TooltipPanel,
  Arrow: TooltipArrow,
};
