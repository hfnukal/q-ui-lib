/**
 * @component sheet
 * @title Sheet
 * @version 1.0.5
 * @example Zprava (výchozí)
 * Zprava (výchozí) — viz ukázka níže.
 * ```tsx
 * import { Sheet } from "~/components/ui/sheet";
 * import { Button } from "~/components/ui/button";
 * 
 * <Sheet.Root>
 *   <Sheet.Trigger>Otevřít panel</Sheet.Trigger>
 *   <Sheet.Panel>
 *     <Sheet.Close class="absolute right-4 top-4 z-10" />
 *     <Sheet.Header>
 *       <Sheet.Title>Nastavení</Sheet.Title>
 *       <Sheet.Description>Krátký popis obsahu panelu.</Sheet.Description>
 *     </Sheet.Header>
 *     <Sheet.Content>
 *       <p class="text-callout text-secondary-label">Hlavní obsah sheetu.</p>
 *     </Sheet.Content>
 *     <Sheet.Footer>
 *       <Sheet.Close class="rounded-md border border-separator-opaque bg-surface-raised px-4 py-2 text-callout font-medium text-label shadow-sm hover:bg-surface-overlay">
 *         Zrušit
 *       </Sheet.Close>
 *       <Button>Uložit</Button>
 *     </Sheet.Footer>
 *   </Sheet.Panel>
 * </Sheet.Root>
 * ```
 *
 * @example Strana panelu
 * Na `Sheet.Panel` nastav `side` : `left` , `right` , `top` , `bottom` .
 * ```tsx
 * import { Sheet } from "~/components/ui/sheet";
 * 
 * <Sheet.Root>
 *   <Sheet.Trigger>Zleva</Sheet.Trigger>
 *   <Sheet.Panel side="left">
 *     <Sheet.Close class="absolute right-4 top-4 z-10" />
 *     <Sheet.Header>
 *       <Sheet.Title>Levý panel</Sheet.Title>
 *       <Sheet.Description>Prop `side="left"` na Panel.</Sheet.Description>
 *     </Sheet.Header>
 *     <Sheet.Content>
 *       <p class="text-callout text-secondary-label">Obsah…</p>
 *     </Sheet.Content>
 *   </Sheet.Panel>
 * </Sheet.Root>
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

/** Boční strana panelu (slide + pozice). */
export type SheetSide = "top" | "right" | "bottom" | "left";

const rootClass = "contents";

const triggerClass = modalOutlineTriggerClass;

/** `q-sheet-panel` + `data-sheet-side` — globální CSS (global.css) ukotvuje :modal dialog k viewportu a řídí vstupní animaci. */
/** Odchod neřeš přes Tailwind transition na dialogu — @qwik-ui/headless čeká na animationend; viz global.css `q-ui-sheet-out-*`. */
/** `display`/`flex-direction` pro otevřený stav je v global.css u `:modal` — zde ne `flex`, aby se nepřebil display:none zavřeného dialogu. */
const panelBaseClass =
  "q-sheet-panel fixed z-50 m-0 max-h-none max-w-none border-0 border-separator-opaque bg-surface-raised p-0 shadow-lg outline-none ring-offset-background backdrop:bg-black/40";

const panelSideClass: Record<SheetSide, string> = {
  right: "inset-y-0 right-0 left-auto h-full w-full max-w-sm border-l translate-x-0",
  left: "inset-y-0 left-0 right-auto h-full w-full max-w-sm border-r translate-x-0",
  top: "inset-x-0 bottom-auto top-0 max-h-[85vh] w-full border-b translate-y-0",
  bottom: "inset-x-0 top-auto bottom-0 max-h-[85vh] w-full border-t translate-y-0",
};

const contentClass =
  "flex flex-1 flex-col gap-4 overflow-y-auto p-6 text-body text-label ring-offset-background";

const headerClass =
  "flex flex-col gap-1.5 border-b border-separator-opaque p-6 text-left";

const footerClass =
  "flex flex-col-reverse gap-2 border-t border-separator-opaque p-6 sm:flex-row sm:justify-end";

const titleClass = modalTitleClass;

const descriptionClass = modalDescriptionClass;

/** Bez pevné pozice — v rohu panelu doplň např. `class="absolute right-4 top-4"`. */
const closeClass = modalIconCloseButtonClass;

export type SheetRootProps = PropsOf<typeof HeadlessModal.Root>;

export type SheetTriggerProps = PropsOf<typeof HeadlessModal.Trigger>;

export type SheetPanelProps = PropsOf<typeof HeadlessModal.Panel> & {
  /** Kraj, ze kterého panel vyjíždí (výchozí `right`). */
  side?: SheetSide;
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
  const { side = "right", class: className, ...rest } = props;
  const merged = [panelBaseClass, panelSideClass[side], "relative", className].filter(Boolean).join(" ");
  return <HeadlessModal.Panel {...rest} class={merged} data-sheet-side={side} />;
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
      aria-label={rest["aria-label"] ?? "Zavřít"}
    >
      {children ?? closeIcon}
    </HeadlessModal.Close>
  );
};

/**
 * Boční panel (sheet) nad {@link https://qwikui.com/docs/headless/modal | @qwik-ui/headless Modal} —
 * stejný vzor jako shadcn Sheet (slide z kraje, backdrop), tokeny z COLORS.md.
 * Pro správné chování zkopíruj z `template/src/global.css` bloky pro `q-sheet-panel` včetně `:not(:modal){display:none}` a `:modal{display:flex}`, vstupní/výstupní keyframes a `.modal-closing`.
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
