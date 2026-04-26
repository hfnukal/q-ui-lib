/**
 * @component tooltip
 * @title Tooltip
 * @version 1.0.0
 * @example Základní použití
 * Otevření na hover a na fokus klávesnicí; zavření Escape (chování headlessu).
 * ```tsx
 * import { Tooltip } from "~/components/ui/base/tooltip";
 * 
 * <Tooltip.Root>
 *   <Tooltip.Trigger>Najet myší nebo fokus</Tooltip.Trigger>
 *   <Tooltip.Panel>Krátká nápověda k prvku.</Tooltip.Panel>
 * </Tooltip.Root>
 * ```
 *
 * @example Umístění
 * Prop `placement` na kořeni odpovídá Floating UI (výchozí `top` ).
 * ```tsx
 * import { Tooltip } from "~/components/ui/base/tooltip";
 * 
 * <Tooltip.Root placement="bottom">
 *   <Tooltip.Trigger>Panel dole</Tooltip.Trigger>
 *   <Tooltip.Panel>Umístění přes prop placement (jako u headlessu).</Tooltip.Panel>
 * </Tooltip.Root>
 * ```
 *
 * @example Zpoždění
 * Prop `delayDuration` (ms) — prodleva před otevřením, vhodná pro husté rozhraní.
 * ```tsx
 * import { Tooltip } from "~/components/ui/base/tooltip";
 * 
 * <Tooltip.Root delayDuration={400}>
 *   <Tooltip.Trigger>Zpoždění 400 ms</Tooltip.Trigger>
 *   <Tooltip.Panel>Otevře se až po prodlevě — vhodné pro husté rozhraní.</Tooltip.Panel>
 * </Tooltip.Root>
 * ```
 *
 * @example Šipka (volitelná)
 * `Tooltip.Arrow` sleduje skutečnou polohu panelu (i po flipu při skrolování) — stačí přidat do panelu a přidat padding dle strany.
 * ```tsx
 * import { Tooltip } from "~/components/ui/base/tooltip";
 *
 * <div class="flex flex-wrap gap-6">
 *   <Tooltip.Root placement="top">
 *     <Tooltip.Trigger>Nahoře</Tooltip.Trigger>
 *     <Tooltip.Panel class="pb-2">
 *       <Tooltip.Arrow />
 *       Šipka sleduje panel.
 *     </Tooltip.Panel>
 *   </Tooltip.Root>
 *   <Tooltip.Root placement="bottom">
 *     <Tooltip.Trigger>Dole</Tooltip.Trigger>
 *     <Tooltip.Panel class="pt-2">
 *       <Tooltip.Arrow />
 *       Panel dole.
 *     </Tooltip.Panel>
 *   </Tooltip.Root>
 *   <Tooltip.Root placement="right">
 *     <Tooltip.Trigger>Vpravo</Tooltip.Trigger>
 *     <Tooltip.Panel class="pl-2">
 *       <Tooltip.Arrow />
 *       Panel vpravo.
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

/** Kořen — kontext triggeru a panelu (Floating UI, výchozí `placement` = top). */
const rootClass = "inline-block";

/**
 * Trigger je v headlessu vždy `<button>` — reset výchozích stylů tlačítka, aby šel použít jako obal
 * ikony nebo textu (focus ring podle COLORS.md).
 */
const triggerClass =
  "inline-flex max-w-full cursor-default items-center justify-center rounded-sm border-0 bg-transparent p-0 font-inherit text-inherit shadow-none ring-offset-background transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

/**
 * Vnější panel — `data-floating` z headlessu; reset padding/border/overflow na tomto uzlu (viz popover.css v @qwik-ui/headless).
 * Vizuál je na vnitřním `div`u (`panelInnerClass`), aby `px-3` / `py-1.5` a uživatelské `class` na panelu nešly do prázdna.
 */
const panelOuterClass =
  "z-50 max-w-[min(20rem,calc(100vw-2rem))] outline-none ring-offset-background";

/** Vnitřní plocha tooltipu — inverzní (`bg-label` / `text-background`); `relative` pro absolutní šipku. */
const panelInnerClass =
  "relative overflow-visible rounded-md border border-separator-opaque bg-label px-3 py-1.5 text-caption-1 text-background shadow-md";

/**
 * Základní třída šipky — border-b border-r s bg-label (inverzní). Polohu a rotaci přidává
 * {@link tooltipArrowEdgeClass} dle placement.
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
  /** Odpovídá `placement` na kořeni — určuje orientaci šipky. Výchozí `top`. */
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
 * Šipka s dynamickým sledováním polohy panelu — reaguje i na flip při skrolování.
 * Tooltip interně používá `HPopoverRoot`, takže je dostupný `headlessPopoverContextId`.
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
 * Složené API nad {@link https://qwikui.com/docs/headless/tooltip | @qwik-ui/headless Tooltip}
 * se styly z COLORS.md (tokeny jako u Popover).
 */
export const Tooltip = {
  Root: TooltipRoot,
  Trigger: TooltipTrigger,
  Panel: TooltipPanel,
  Arrow: TooltipArrow,
};
