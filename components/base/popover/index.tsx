/**
 * @component popover
 * @title Popover
 * @version 1.0.1
 * @example Základní použití
 * Základní použití — viz ukázka níže.
 * ```tsx
 * import { Popover } from "~/components/ui/popover";
 * 
 * <Popover.Root>
 *   <Popover.Trigger>Otevřít</Popover.Trigger>
 *   <Popover.Panel>
 *     <div class="space-y-2 p-4">
 *       <p class="text-callout font-medium text-label">Obsah popoveru</p>
 *       <p class="text-caption-1 text-secondary-label">
 *         Vnitřní blok s paddingem — host panelu u plovoucího režimu může mít reset paddingu z headless CSS.
 *       </p>
 *     </div>
 *   </Popover.Panel>
 * </Popover.Root>
 * ```
 *
 * @example Umístění (floating)
 * Prop `floating` na kořeni předává umístění Floating UI (např. `"top"` , `"bottom-end"` ).
 * ```tsx
 * import { Popover } from "~/components/ui/popover";
 * 
 * <Popover.Root floating="top">
 *   <Popover.Trigger>Nahoru</Popover.Trigger>
 *   <Popover.Panel>
 *     <div class="p-4 text-callout text-secondary-label">Panel nad triggerem.</div>
 *   </Popover.Panel>
 * </Popover.Root>
 * ```
 *
 * @example Šipka (arrow)
 * Na `Popover.Root` nastav `arrow` a do panelu vlož `Popover.PanelArrow` .
 * ```tsx
 * import { Popover } from "~/components/ui/popover";
 * 
 * <Popover.Root gutter={8} arrow floating="left">
 *   <Popover.Trigger>Se šipkou</Popover.Trigger>
 *   <Popover.Panel>
 *     <Popover.PanelArrow />
 *     <div class="p-4 text-callout text-secondary-label">
 *       Kořen má prop <code>arrow</code> pro middleware Floating UI.
 *     </div>
 *   </Popover.Panel>
 * </Popover.Root>
 * 
 * <Popover.Root gutter={8} arrow  floating="top">
 *   <Popover.Trigger>Se šipkou</Popover.Trigger>
 *   <Popover.Panel>
 *     <Popover.PanelArrow />
 *     <div class="p-4 text-callout text-secondary-label">
 *       Kořen má prop <code>arrow</code> pro middleware Floating UI.
 *     </div>
 *   </Popover.Panel>
 * </Popover.Root>
 * 
 * <Popover.Root gutter={8} arrow  floating="bottom">
 *   <Popover.Trigger>Se šipkou</Popover.Trigger>
 *   <Popover.Panel>
 *     <Popover.PanelArrow />
 *     <div class="p-4 text-callout text-secondary-label">
 *       Kořen má prop <code>arrow</code> pro middleware Floating UI.
 *     </div>
 *   </Popover.Panel>
 * </Popover.Root>
 * 
 * <Popover.Root gutter={8} arrow  floating="right">
 *   <Popover.Trigger>Se šipkou</Popover.Trigger>
 *   <Popover.Panel>
 *     <Popover.PanelArrow />
 *     <div class="p-4 text-callout text-secondary-label">
 *       Kořen má prop <code>arrow</code> pro middleware Floating UI.
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

/** Kořen — drží kontext pro trigger a panel (plovoucí umístění přes Floating UI ve výchozím stavu). */
const rootClass = "inline-block";

/** Tlačítkový trigger — viz {@link floatingOutlineButtonTriggerClass}. */
const triggerClass = floatingOutlineButtonTriggerClass;

/**
 * Panel host může mít u `[data-floating]` reset paddingu z headless CSS — vnitřní mezery
 * drž v dceřiném bloku nebo přidej vlastní `class` s `!p-4` apod.
 */
const panelClass = floatingPopoverPanelClass;

/** Základ šipky; osu kolmo k hraně doplňuje {@link floatingArrowEdgeClassForPlacement} přes {@link headlessPopoverContextId}. */
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
 * Složené API nad {@link https://qwikui.com/docs/headless/popover | @qwik-ui/headless Popover}
 * se styly z COLORS.md (tokeny jako u Tab/Button).
 */
export const Popover = {
  Root: PopoverRoot,
  Trigger: PopoverTrigger,
  Panel: PopoverPanel,
  PanelArrow: PopoverPanelArrow,
};
