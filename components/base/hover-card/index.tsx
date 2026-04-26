/**
 * @component hover-card
 * @title HoverCard
 * @version 1.0.1
 * @example Základní použití
 * Najetí na trigger otevře panel; chování vychází z headlessu (včetně omezení oproti plnému „bezpečnému mostu“ mezi triggerem a panelem u některých knihoven).
 * ```tsx
 * import { HoverCard } from "~/components/ui/base/hover-card";
 * 
 * <HoverCard.Root>
 *   <HoverCard.Trigger>@uživatel</HoverCard.Trigger>
 *   <HoverCard.Content>
 *     <div class="space-y-2 p-4">
 *       <p class="text-callout font-medium text-label">Náhled profilu</p>
 *       <p class="text-caption-1 text-secondary-label">
 *         Hover Card je postavený na headless Popoveru s výchozím hover režimem — vhodný pro bohatší obsah než Tooltip.
 *       </p>
 *     </div>
 *   </HoverCard.Content>
 * </HoverCard.Root>
 * ```
 *
 * @example Umístění (floating)
 * Prop `floating` pro směr panelu (např. zobrazení nad triggerem).
 * ```tsx
 * import { HoverCard } from "~/components/ui/base/hover-card";
 * 
 * <HoverCard.Root floating="top">
 *   <HoverCard.Trigger>Panel nahoře</HoverCard.Trigger>
 *   <HoverCard.Content>
 *     <div class="p-4 text-callout text-secondary-label">Umístění přes prop floating na kořeni.</div>
 *   </HoverCard.Content>
 * </HoverCard.Root>
 * ```
 *
 * @example Šipka
 * Šipka — viz ukázka níže.
 * ```tsx
 * import { HoverCard } from "~/components/ui/base/hover-card";
 * 
 * <HoverCard.Root gutter={8} arrow>
 *   <HoverCard.Trigger>Se šipkou</HoverCard.Trigger>
 *   <HoverCard.Content>
 *     <HoverCard.Arrow />
 *     <div class="p-4 text-callout text-secondary-label">
 *       Stejné Floating UI volby jako u Popoveru (<code>arrow</code>, <code>gutter</code>).
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

/** Kořen — kontext triggeru a panelu; výchozí `hover` odpovídá vzoru Hover Card (popover při najetí). */
const rootClass = "inline-block";

/**
 * Trigger je u headlessu `<button>` — nenápadný styl vhodný pro odkaz/avatar (jako Tooltip),
 * ne primární tlačítko jako u klikacího Popoveru.
 */
const triggerClass =
  "inline-flex max-w-full cursor-default items-center justify-center rounded-sm border-0 bg-transparent p-0 font-inherit text-inherit shadow-none ring-offset-background transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

/**
 * Obsah karty — širší než základní Popover (`w-80`), vhodné pro náhled profilu nebo delší text.
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
 * Složené API (Hover Card) nad {@link https://qwikui.com/docs/headless/popover | @qwik-ui/headless Popover}
 * s výchozím `hover` a styly z COLORS.md. Mapuje se na shadcn Hover Card (Content = Panel).
 */
export const HoverCard = {
  Root: HoverCardRoot,
  Trigger: HoverCardTrigger,
  Content: HoverCardContent,
  Arrow: HoverCardArrow,
};
