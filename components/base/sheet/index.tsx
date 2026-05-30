/**
 * @component sheet
 * @title Sheet
 * @version 1.1.0
 * @example From the right (default)
 * From the right (default) — see the example below.
 * ```tsx
 * import { Sheet } from "~/components/ui/base/sheet";
 * import { Button } from "~/components/ui/base/button";
 * 
 * <Sheet.Root>
 *   <Sheet.Trigger>Open panel</Sheet.Trigger>
 *   <Sheet.Panel>
 *     <Sheet.Close class="absolute right-4 top-4 z-10" />
 *     <Sheet.Header>
 *       <Sheet.Title>Settings</Sheet.Title>
 *       <Sheet.Description>A short description of the panel content.</Sheet.Description>
 *     </Sheet.Header>
 *     <Sheet.Content>
 *       <p class="text-callout text-secondary-label">Main sheet content.</p>
 *     </Sheet.Content>
 *     <Sheet.Footer>
 *       <Sheet.Close class="rounded-md border border-separator-opaque bg-surface-raised px-4 py-2 text-callout font-medium text-label shadow-sm hover:bg-surface-overlay">
 *         Cancel
 *       </Sheet.Close>
 *       <Button>Save</Button>
 *     </Sheet.Footer>
 *   </Sheet.Panel>
 * </Sheet.Root>
 * ```
 *
 * @example Panel sides (top | bottom | left | right)
 * Set `side` on `Sheet.Panel` . Each sheet has its own `Sheet.Root` .
 * ```tsx
 * import { Sheet } from "~/components/ui/base/sheet";
 *
 * <div class="flex flex-wrap gap-2">
 *   <Sheet.Root>
 *     <Sheet.Trigger>From the top</Sheet.Trigger>
 *     <Sheet.Panel side="top">
 *       <Sheet.Close class="absolute right-4 top-4 z-10" />
 *       <Sheet.Header>
 *         <Sheet.Title>Panel from the top</Sheet.Title>
 *         <Sheet.Description>`side="top"`</Sheet.Description>
 *       </Sheet.Header>
 *       <Sheet.Content>
 *         <p class="text-callout text-secondary-label">Content…</p>
 *       </Sheet.Content>
 *     </Sheet.Panel>
 *   </Sheet.Root>
 *   <Sheet.Root>
 *     <Sheet.Trigger>From the bottom</Sheet.Trigger>
 *     <Sheet.Panel side="bottom">
 *       <Sheet.Close class="absolute right-4 top-4 z-10" />
 *       <Sheet.Header>
 *         <Sheet.Title>Panel from the bottom</Sheet.Title>
 *         <Sheet.Description>`side="bottom"`</Sheet.Description>
 *       </Sheet.Header>
 *       <Sheet.Content>
 *         <p class="text-callout text-secondary-label">Content…</p>
 *       </Sheet.Content>
 *     </Sheet.Panel>
 *   </Sheet.Root>
 *   <Sheet.Root>
 *     <Sheet.Trigger>From the left</Sheet.Trigger>
 *     <Sheet.Panel side="left">
 *       <Sheet.Close class="absolute right-4 top-4 z-10" />
 *       <Sheet.Header>
 *         <Sheet.Title>Left panel</Sheet.Title>
 *         <Sheet.Description>`side="left"`</Sheet.Description>
 *       </Sheet.Header>
 *       <Sheet.Content>
 *         <p class="text-callout text-secondary-label">Content…</p>
 *       </Sheet.Content>
 *     </Sheet.Panel>
 *   </Sheet.Root>
 *   <Sheet.Root>
 *     <Sheet.Trigger>From the right</Sheet.Trigger>
 *     <Sheet.Panel side="right">
 *       <Sheet.Close class="absolute right-4 top-4 z-10" />
 *       <Sheet.Header>
 *         <Sheet.Title>Right panel</Sheet.Title>
 *         <Sheet.Description>`side="right"` (default)</Sheet.Description>
 *       </Sheet.Header>
 *       <Sheet.Content>
 *         <p class="text-callout text-secondary-label">Content…</p>
 *       </Sheet.Content>
 *     </Sheet.Panel>
 *   </Sheet.Root>
 * </div>
 * ```
 *
 * @example Fullscreen (top | bottom | left | right)
 * The `fullScreen` prop — a panel over the whole viewport; the animation direction is set by `side` .
 * ```tsx
 * import { Sheet } from "~/components/ui/base/sheet";
 *
 * <div class="flex flex-wrap gap-2">
 *   <Sheet.Root>
 *     <Sheet.Trigger>Fullscreen from the top</Sheet.Trigger>
 *     <Sheet.Panel side="top" fullScreen>
 *       <Sheet.Close class="absolute right-4 top-4 z-10" />
 *       <Sheet.Header>
 *         <Sheet.Title>Fullscreen top</Sheet.Title>
 *         <Sheet.Description>`side="top"` + `fullScreen`</Sheet.Description>
 *       </Sheet.Header>
 *       <Sheet.Content>
 *         <p class="text-callout text-secondary-label">Content…</p>
 *       </Sheet.Content>
 *     </Sheet.Panel>
 *   </Sheet.Root>
 *   <Sheet.Root>
 *     <Sheet.Trigger>Fullscreen from the bottom</Sheet.Trigger>
 *     <Sheet.Panel side="bottom" fullScreen>
 *       <Sheet.Close class="absolute right-4 top-4 z-10" />
 *       <Sheet.Header>
 *         <Sheet.Title>Fullscreen bottom</Sheet.Title>
 *         <Sheet.Description>`side="bottom"` + `fullScreen`</Sheet.Description>
 *       </Sheet.Header>
 *       <Sheet.Content>
 *         <p class="text-callout text-secondary-label">Content…</p>
 *       </Sheet.Content>
 *     </Sheet.Panel>
 *   </Sheet.Root>
 *   <Sheet.Root>
 *     <Sheet.Trigger>Fullscreen from the left</Sheet.Trigger>
 *     <Sheet.Panel side="left" fullScreen>
 *       <Sheet.Close class="absolute right-4 top-4 z-10" />
 *       <Sheet.Header>
 *         <Sheet.Title>Fullscreen left</Sheet.Title>
 *         <Sheet.Description>`side="left"` + `fullScreen`</Sheet.Description>
 *       </Sheet.Header>
 *       <Sheet.Content>
 *         <p class="text-callout text-secondary-label">Content…</p>
 *       </Sheet.Content>
 *     </Sheet.Panel>
 *   </Sheet.Root>
 *   <Sheet.Root>
 *     <Sheet.Trigger>Fullscreen from the right</Sheet.Trigger>
 *     <Sheet.Panel side="right" fullScreen>
 *       <Sheet.Close class="absolute right-4 top-4 z-10" />
 *       <Sheet.Header>
 *         <Sheet.Title>Fullscreen right</Sheet.Title>
 *         <Sheet.Description>`side="right"` + `fullScreen`</Sheet.Description>
 *       </Sheet.Header>
 *       <Sheet.Content>
 *         <p class="text-callout text-secondary-label">Content…</p>
 *       </Sheet.Content>
 *     </Sheet.Panel>
 *   </Sheet.Root>
 * </div>
 * ```
 */

import { type FunctionComponent, type PropsOf } from "@builder.io/qwik";
import { Modal as HeadlessModal } from "@qwik-ui/headless";
import {
  modalDescriptionClass,
  modalIconCloseButtonClass,
  modalOutlineTriggerClass,
  modalTitleClass,
} from "../utilities/modal-ui";

/** Panel side (slide + position). */
export type SheetSide = "top" | "right" | "bottom" | "left";

const rootClass = "contents";

const triggerClass = modalOutlineTriggerClass;

/** `q-sheet-panel` + `data-sheet-side` — global CSS (global.css) anchors the :modal dialog to the viewport and drives the entry animation. */
/** Do not handle the exit via a Tailwind transition on the dialog — @qwik-ui/headless waits for animationend; see global.css `q-ui-sheet-out-*`. */
/** `display`/`flex-direction` for the open state is in global.css on `:modal` — not `flex` here, so it does not override the closed dialog's display:none. */
const panelBaseClass =
  "q-sheet-panel fixed z-50 m-0 max-h-none max-w-none border-0 border-separator-opaque bg-surface-raised p-0 shadow-lg outline-none ring-offset-background backdrop:bg-black/40";

/**
 * Default ~⅓ of the viewport — `dialog:modal { max-width: unset }` from headless cancels `max-w-*`; keep dimensions via `w-[…]` / `h-[…]`.
 */
const panelSideDefaultClass: Record<SheetSide, string> = {
  /* 100% = layout viewport (without the classic shift from 100vw + scrollbar); width only from right/left. */
  /* The slide animates `translate` in global.css — not translate-* from Tailwind (it would collide with the same property in keyframes). */
  right:
    "top-0 bottom-0 right-0 left-auto h-dvh w-[min(100%,max(18rem,33vw))] max-w-none border-l",
  left:
    "top-0 bottom-0 left-0 right-auto h-dvh w-[min(100%,max(18rem,33vw))] max-w-none border-r",
  top:
    "left-0 right-0 top-0 bottom-auto h-[min(100dvh,max(12rem,33dvh))] w-auto max-w-none border-b",
  bottom:
    "left-0 right-0 top-auto bottom-0 h-[min(100dvh,max(12rem,33dvh))] w-auto max-w-none border-t",
};

/** Fullscreen dimensions are handled by `dialog.q-sheet-panel…:modal` in global.css — here just the marker + insets as a fallback. */
const panelFullscreenClass = "q-sheet-fullscreen inset-0 max-w-none border-0";

const contentClass =
  "flex flex-1 flex-col gap-4 overflow-y-auto p-6 text-body text-label ring-offset-background";

const headerClass =
  "flex flex-col gap-1.5 border-b border-separator-opaque p-6 text-left";

const footerClass =
  "flex flex-col-reverse gap-2 border-t border-separator-opaque p-6 sm:flex-row sm:justify-end";

const titleClass = modalTitleClass;

const descriptionClass = modalDescriptionClass;

/** No fixed position — in the panel corner add e.g. `class="absolute right-4 top-4"`. */
const closeClass = modalIconCloseButtonClass;

export type SheetRootProps = PropsOf<typeof HeadlessModal.Root>;

export type SheetTriggerProps = PropsOf<typeof HeadlessModal.Trigger>;

export type SheetPanelProps = PropsOf<typeof HeadlessModal.Panel> & {
  /** The edge the panel slides in from (default `right`). */
  side?: SheetSide;
  /** The whole viewport (slide by the chosen `side`); default is ~⅓ of the width / height. */
  fullScreen?: boolean;
};

export type SheetContentProps = PropsOf<typeof HeadlessModal.Content>;

export type SheetHeaderProps = PropsOf<typeof HeadlessModal.Header>;

export type SheetFooterProps = PropsOf<typeof HeadlessModal.Footer>;

export type SheetTitleProps = PropsOf<typeof HeadlessModal.Title>;

export type SheetDescriptionProps = PropsOf<typeof HeadlessModal.Description>;

export type SheetCloseProps = PropsOf<typeof HeadlessModal.Close>;

export const SheetRoot: FunctionComponent<SheetRootProps> = (props) => {
  const merged = [rootClass, props.class].filter(Boolean).join(" ");
  return <HeadlessModal.Root {...props} class={merged} />;
};

export const SheetTrigger: FunctionComponent<SheetTriggerProps> = (props) => {
  const merged = [triggerClass, props.class].filter(Boolean).join(" ");
  return <HeadlessModal.Trigger {...props} class={merged} />;
};

export const SheetPanel: FunctionComponent<SheetPanelProps> = (props) => {
  const { side = "right", fullScreen = false, class: className, ...rest } = props;
  const sideLayout = fullScreen ? panelFullscreenClass : panelSideDefaultClass[side];
  /* No `relative` — it would override `fixed` from panelBaseClass (same specificity in Tailwind) and the panel would not be at the viewport edge. The `fixed` dialog already anchors the `absolute` Sheet.Close. */
  const merged = [panelBaseClass, sideLayout, className].filter(Boolean).join(" ");
  return (
    <HeadlessModal.Panel
      {...rest}
      class={merged}
      data-sheet-side={side}
      data-sheet-fullscreen={fullScreen ? "" : undefined}
    />
  );
};

export const SheetContent: FunctionComponent<SheetContentProps> = (props) => {
  const merged = [contentClass, props.class].filter(Boolean).join(" ");
  return <HeadlessModal.Content {...props} class={merged} />;
};

export const SheetHeader: FunctionComponent<SheetHeaderProps> = (props) => {
  const merged = [headerClass, props.class].filter(Boolean).join(" ");
  return <HeadlessModal.Header {...props} class={merged} />;
};

export const SheetFooter: FunctionComponent<SheetFooterProps> = (props) => {
  const merged = [footerClass, props.class].filter(Boolean).join(" ");
  return <HeadlessModal.Footer {...props} class={merged} />;
};

export const SheetTitle: FunctionComponent<SheetTitleProps> = (props) => {
  const merged = [titleClass, props.class].filter(Boolean).join(" ");
  return <HeadlessModal.Title {...props} class={merged} />;
};

export const SheetDescription: FunctionComponent<SheetDescriptionProps> = (props) => {
  const merged = [descriptionClass, props.class].filter(Boolean).join(" ");
  return <HeadlessModal.Description {...props} class={merged} />;
};

const closeIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    class="text-label"
  >
    <path d="M18 6 6 18" />
    <path d="m6 6 12 12" />
  </svg>
);

export const SheetClose: FunctionComponent<SheetCloseProps> = (props) => {
  const { class: className, children, ...rest } = props;
  const merged = [closeClass, className].filter(Boolean).join(" ");
  return (
    <HeadlessModal.Close
      {...rest}
      class={merged}
      aria-label={rest["aria-label"] ?? "Close"}
    >
      {children ?? closeIcon}
    </HeadlessModal.Close>
  );
};

/**
 * Side panel (sheet) over {@link https://qwikui.com/docs/headless/modal | @qwik-ui/headless Modal} —
 * the same pattern as shadcn Sheet (slide from the edge, backdrop), tokens from COLORS.md.
 * For correct behavior copy from `template/src/global.css` the blocks for `q-sheet-panel` including `:not(:modal){display:none}` and `:modal{display:flex}`, the entry/exit keyframes and `.modal-closing`.
 */
export const Sheet = {
  Root: SheetRoot,
  Trigger: SheetTrigger,
  Panel: SheetPanel,
  Content: SheetContent,
  Header: SheetHeader,
  Footer: SheetFooter,
  Title: SheetTitle,
  Description: SheetDescription,
  Close: SheetClose,
};
