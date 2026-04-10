import { type FunctionComponent, type PropsOf } from "@builder.io/qwik";
import { Popover as HeadlessPopover } from "@qwik-ui/headless";
import { floatingPanelArrowClass } from "../utilities/floating-ui";

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

export const HoverCardArrow: FunctionComponent<HoverCardArrowProps> = (props) => {
  const merged = [arrowClass, props.class].filter(Boolean).join(" ");
  return <HeadlessPopover.PanelArrow {...props} class={merged} />;
};

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
