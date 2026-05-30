/**
 * @component hover-card
 * @title HoverCard
 * @version 1.0.1
 * @example Basic usage
 * Hovering the trigger opens the panel; the behavior comes from headless (including limitations compared to a full „safe bridge“ between the trigger and panel in some libraries).
 * ```tsx
 * import { HoverCard } from "~/components/ui/base/hover-card";
 * 
 * <HoverCard.Root>
 *   <HoverCard.Trigger>@user</HoverCard.Trigger>
 *   <HoverCard.Content>
 *     <div class="space-y-2 p-4">
 *       <p class="text-callout font-medium text-label">Profile preview</p>
 *       <p class="text-caption-1 text-secondary-label">
 *         Hover Card is built on the headless Popover with the default hover mode — suited for richer content than a Tooltip.
 *       </p>
 *     </div>
 *   </HoverCard.Content>
 * </HoverCard.Root>
 * ```
 *
 * @example Placement (floating)
 * Prop `floating` for the panel direction (e.g. showing above the trigger).
 * ```tsx
 * import { HoverCard } from "~/components/ui/base/hover-card";
 * 
 * <HoverCard.Root floating="top">
 *   <HoverCard.Trigger>Panel above</HoverCard.Trigger>
 *   <HoverCard.Content>
 *     <div class="p-4 text-callout text-secondary-label">Placement via the floating prop on the root.</div>
 *   </HoverCard.Content>
 * </HoverCard.Root>
 * ```
 *
 * @example Arrow
 * Arrow — see the example below.
 * ```tsx
 * import { HoverCard } from "~/components/ui/base/hover-card";
 * 
 * <HoverCard.Root gutter={8} arrow>
 *   <HoverCard.Trigger>With arrow</HoverCard.Trigger>
 *   <HoverCard.Content>
 *     <HoverCard.Arrow />
 *     <div class="p-4 text-callout text-secondary-label">
 *       The same Floating UI options as the Popover (<code>arrow</code>, <code>gutter</code>).
 *     </div>
 *   </HoverCard.Content>
 * </HoverCard.Root>
 * ```
 
 
 
 
 
 
 
 
 
 */

import { component$, type FunctionComponent, type PropsOf, useContext, useSignal, useTask$ } from "@builder.io/qwik";
import { Popover as HeadlessPopover } from "@qwik-ui/headless";
import {
  floatingAnchorFromPopoverContext,
  floatingArrowEdgeClassForPlacement,
  floatingPanelArrowClass,
} from "../utilities/floating-ui";
import { headlessPopoverContextId } from "../utilities/headless-popover-context";

/** Root — context for the trigger and panel; the default `hover` matches the Hover Card pattern (popover on hover). */
const rootClass = "inline-block";

/**
 * The trigger is a `<button>` in headless — an understated style suited for a link/avatar (like Tooltip),
 * not a primary button as in the click Popover.
 */
const triggerClass =
  "inline-flex max-w-full cursor-default items-center justify-center rounded-sm border-0 bg-transparent p-0 font-inherit text-inherit shadow-none ring-offset-background transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

/**
 * Card content — wider than the basic Popover (`w-80`), suited for a profile preview or longer text.
 */
const contentClass =
  "z-50 w-80 max-w-[min(20rem,calc(100vw-2rem))] overflow-visible rounded-lg border border-separator-opaque bg-surface-raised p-0 text-body text-label shadow-md outline-none ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

const arrowClass = floatingPanelArrowClass;

export type HoverCardRootProps = PropsOf<typeof HeadlessPopover.Root>;

export type HoverCardTriggerProps = PropsOf<typeof HeadlessPopover.Trigger>;

export type HoverCardContentProps = PropsOf<typeof HeadlessPopover.Panel>;

export type HoverCardArrowProps = PropsOf<typeof HeadlessPopover.PanelArrow>;

export const HoverCardRoot: FunctionComponent<HoverCardRootProps> = (props) => {
  const { class: className, hover, ...rest } = props;
  const merged = [rootClass, className].filter(Boolean).join(" ");
  return <HeadlessPopover.Root {...rest} hover={hover ?? true} class={merged} />;
};

export const HoverCardTrigger: FunctionComponent<HoverCardTriggerProps> = (props) => {
  const merged = [triggerClass, props.class].filter(Boolean).join(" ");
  return <HeadlessPopover.Trigger {...props} class={merged} type={props.type ?? "button"} />;
};

export const HoverCardContent: FunctionComponent<HoverCardContentProps> = (props) => {
  const merged = [contentClass, props.class].filter(Boolean).join(" ");
  return <HeadlessPopover.Panel {...props} class={merged} />;
};

export const HoverCardArrow = component$<HoverCardArrowProps>((props) => {
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
  const merged = [arrowClass, edgeClass, props.class].filter(Boolean).join(" ");
  return <HeadlessPopover.PanelArrow {...props} class={merged} />;
});

/**
 * Compound API (Hover Card) over {@link https://qwikui.com/docs/headless/popover | @qwik-ui/headless Popover}
 * with the default `hover` and styles from COLORS.md. Maps to the shadcn Hover Card (Content = Panel).
 */
export const HoverCard = {
  Root: HoverCardRoot,
  Trigger: HoverCardTrigger,
  Content: HoverCardContent,
  Arrow: HoverCardArrow,
};
