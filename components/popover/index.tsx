/**
 * @component popover
 * @title Popover
 * @version 1.0.1
 * @example
 * ```tsx
 * import { Popover } from "~/components/ui/popover";
 * 
 * <Popover.Root>
 *   …
 * </Popover.Root>
 * ```
 * Ukázka v demo aplikaci: route `/components/popover` (zdroj `demo/src/routes/components/popover/index.tsx`).
 
 */

import { type FunctionComponent, type PropsOf } from "@builder.io/qwik";
import { Popover as HeadlessPopover } from "@qwik-ui/headless";
import {
  floatingOutlineButtonTriggerClass,
  floatingPanelArrowClass,
  floatingPopoverPanelClass,
} from "../utilities/floating-ui";

/** Kořen — drží kontext pro trigger a panel (plovoucí umístění přes Floating UI ve výchozím stavu). */
const rootClass = "inline-block";

/** Tlačítkový trigger — viz {@link floatingOutlineButtonTriggerClass}. */
const triggerClass = floatingOutlineButtonTriggerClass;

/**
 * Panel host může mít u `[data-floating]` reset paddingu z headless CSS — vnitřní mezery
 * drž v dceřiném bloku nebo přidej vlastní `class` s `!p-4` apod.
 */
const panelClass = floatingPopoverPanelClass;

/**
 * Floating UI na šipku nastavuje `left`/`top` v px — fungují jen u `position: absolute`.
 * Při výchozím `floating` = bottom je na ose Y hodnota z middleware často prázdná; šipku proto
 * vytáhneme nad horní hranu panelu (`-top-2`), aby trojúhelník mířil k triggeru.
 */
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
