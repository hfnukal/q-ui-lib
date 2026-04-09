import { type FunctionComponent, type PropsOf } from "@builder.io/qwik";
import { Popover as HeadlessPopover } from "@qwik-ui/headless";

/** Kořen — drží kontext pro trigger a panel (plovoucí umístění přes Floating UI ve výchozím stavu). */
const rootClass = "inline-block";

/** Tlačítkový trigger v tónu tokenů z COLORS.md (surface, separator, ring). */
const triggerClass =
  "inline-flex items-center justify-center rounded-md border border-separator-opaque bg-surface-raised px-3 py-2 font-medium text-callout text-label shadow-sm ring-offset-background transition-colors hover:bg-surface-overlay focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

/**
 * Panel host může mít u `[data-floating]` reset paddingu z headless CSS — vnitřní mezery
 * drž v dceřiném bloku nebo přidej vlastní `class` s `!p-4` apod.
 */
const panelClass =
  "z-50 w-72 max-w-[min(18rem,calc(100vw-2rem))] overflow-visible rounded-lg border border-separator-opaque bg-surface-raised text-body text-label shadow-md outline-none ring-offset-background focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2";

/**
 * Floating UI na šipku nastavuje `left`/`top` v px — fungují jen u `position: absolute`.
 * Při výchozím `floating` = bottom je na ose Y hodnota z middleware často prázdná; šipku proto
 * vytáhneme nad horní hranu panelu (`-top-2`), aby trojúhelník mířil k triggeru.
 */
const panelArrowClass =
  "pointer-events-none absolute -top-2 z-10 h-2.5 w-2.5 rotate-45 border-l border-t border-separator-opaque bg-surface-raised shadow-sm";

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

export const PopoverPanelArrow: FunctionComponent<PopoverPanelArrowProps> = (props) => {
  const merged = [panelArrowClass, props.class].filter(Boolean).join(" ");
  return <HeadlessPopover.PanelArrow {...props} class={merged} />;
};

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
