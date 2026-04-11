/**
 * @component tooltip
 * @title Tooltip
 * @version 1.0.0
 */

import { type FunctionComponent, type PropsOf } from "@builder.io/qwik";
import { Tooltip as HeadlessTooltip } from "@qwik-ui/headless";

/** Kořen — kontext triggeru a panelu (Floating UI, výchozí `placement` = top). */
const rootClass = "inline-block";

/**
 * Trigger je v headlessu vždy `<button>` — reset výchozích stylů tlačítka, aby šel použít jako obal
 * ikony nebo textu (focus ring podle COLORS.md).
 */
const triggerClass =
  "inline-flex max-w-full cursor-default items-center justify-center rounded-sm border-0 bg-transparent p-0 font-inherit text-inherit shadow-none ring-offset-background transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

/** Panel — inverzní plocha (`bg-label` / `text-background`) jako typický tooltip; `relative` pro absolutní šipku. */
const panelClass =
  "relative z-50 max-w-[min(20rem,calc(100vw-2rem))] overflow-visible rounded-md border border-separator-opaque bg-label px-3 py-1.5 text-caption-1 text-background shadow-md outline-none ring-offset-background";

/**
 * Šipka pro výchozí `placement="top"` (panel nad triggerem): trojúhelník dolů, napojený na spodní hranu panelu.
 * Headless ve výchozím nastavuje width/height na 10×5 px — obdélník po rotate-45 vypadá křivě; proto v {@link TooltipArrow}
 * předáváme čtverec (8×8).
 *
 * Pro `placement="bottom"` doplň vlastní `class` (zrcadlově: `bottom-full left-1/2 -translate-x-1/2 translate-y-1/2 border-l border-t`).
 */
const arrowClass =
  "pointer-events-none absolute left-1/2 top-full z-10 -translate-x-1/2 -translate-y-1/2 rotate-45 border-b border-r border-separator-opaque bg-label shadow-sm";

export type TooltipRootProps = PropsOf<typeof HeadlessTooltip.Root>;

export type TooltipTriggerProps = PropsOf<typeof HeadlessTooltip.Trigger>;

export type TooltipPanelProps = PropsOf<typeof HeadlessTooltip.Panel>;

export type TooltipArrowProps = PropsOf<typeof HeadlessTooltip.Arrow>;

export const TooltipRoot: FunctionComponent<TooltipRootProps> = (props) => {
  const merged = [rootClass, props.class].filter(Boolean).join(" ");
  return <HeadlessTooltip.Root {...props} class={merged} />;
};

export const TooltipTrigger: FunctionComponent<TooltipTriggerProps> = (props) => {
  const merged = [triggerClass, props.class].filter(Boolean).join(" ");
  return <HeadlessTooltip.Trigger {...props} class={merged} type={props.type ?? "button"} />;
};

export const TooltipPanel: FunctionComponent<TooltipPanelProps> = (props) => {
  const merged = [panelClass, props.class].filter(Boolean).join(" ");
  return <HeadlessTooltip.Panel {...props} class={merged} />;
};

const arrowSize = 8;

export const TooltipArrow: FunctionComponent<TooltipArrowProps> = (props) => {
  const { width = arrowSize, height = arrowSize, class: className, ...rest } = props;
  const merged = [arrowClass, className].filter(Boolean).join(" ");
  return <HeadlessTooltip.Arrow {...rest} width={width} height={height} class={merged} />;
};

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
