/**
 * @component dialog
 * @title Dialog
 * @version 1.0.2
 * @example Základní dialog
 * Základní dialog — viz ukázka níže.
 * ```tsx
 * import { Dialog } from "~/components/ui/dialog";
 * import { Button } from "~/components/ui/button";
 * 
 * <Dialog.Root>
 *   <Dialog.Trigger>Otevřít dialog</Dialog.Trigger>
 *   <Dialog.Panel>
 *     <Dialog.Close class="absolute right-4 top-4 z-10" />
 *     <Dialog.Header>
 *       <Dialog.Title>Upravit profil</Dialog.Title>
 *       <Dialog.Description>
 *         Zde můžeš změnit údaje zobrazené ostatním uživatelům.
 *       </Dialog.Description>
 *     </Dialog.Header>
 *     <Dialog.Content>
 *       <p class="text-callout text-secondary-label">Hlavní obsah dialogu.</p>
 *     </Dialog.Content>
 *     <Dialog.Footer>
 *       <Dialog.Close class="rounded-md border border-separator-opaque bg-surface-raised px-4 py-2 text-callout font-medium text-label shadow-sm hover:bg-surface-overlay">
 *         Zrušit
 *       </Dialog.Close>
 *       <Button>Uložit</Button>
 *     </Dialog.Footer>
 *   </Dialog.Panel>
 * </Dialog.Root>
 * ```
 *
 * @example Alert dialog
 * Na `Dialog.Root` nastav `alert` — headless nastaví `role=&quot;alertdialog&quot;` a vypne zavření klikem na pozadí.
 * ```tsx
 * import { Dialog } from "~/components/ui/dialog";
 * 
 * <Dialog.Root alert>
 *   <Dialog.Trigger>Smazat účet</Dialog.Trigger>
 *   <Dialog.Panel>
 *     <Dialog.Close class="absolute right-4 top-4 z-10" />
 *     <Dialog.Header>
 *       <Dialog.Title>Opravdu smazat?</Dialog.Title>
 *       <Dialog.Description>Tuto akci nelze vrátit zpět.</Dialog.Description>
 *     </Dialog.Header>
 *     <Dialog.Footer>
 *       <Dialog.Close class="rounded-md border border-separator-opaque px-4 py-2 text-callout">
 *         Zrušit
 *       </Dialog.Close>
 *       <Dialog.Close class="rounded-md bg-system-red px-4 py-2 text-callout font-medium text-white">
 *         Smazat
 *       </Dialog.Close>
 *     </Dialog.Footer>
 *   </Dialog.Panel>
 * </Dialog.Root>
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

const rootClass = "contents";

const triggerClass = modalOutlineTriggerClass;

/** `q-dialog-panel` — v global.css je :modal display:flex, skrytý stav a zoom animace (headless čeká na animationend při zavírání). */
const panelBaseClass =
  "q-dialog-panel fixed left-1/2 top-1/2 z-50 m-0 min-w-0 w-[calc(100%-2rem)] max-w-lg max-h-[min(90dvh,40rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-separator-opaque bg-surface-raised p-0 shadow-lg outline-none ring-offset-background backdrop:bg-black/40 rounded-lg";

const contentClass =
  "flex min-w-0 flex-1 flex-col gap-4 overflow-y-auto p-6 text-body text-label ring-offset-background";

const headerClass =
  "flex min-w-0 flex-col gap-1.5 border-b border-separator-opaque p-6 text-left";

const footerClass =
  "flex min-w-0 w-full flex-col-reverse gap-2 border-t border-separator-opaque p-6 sm:flex-row sm:flex-wrap sm:justify-end";

const titleClass = modalTitleClass;

const descriptionClass = modalDescriptionClass;

/** Ikona v rohu — pevná velikost; neslučovat s textovými akcemi v patičce (size-8 by roztrhalo label). */
const closeClass = modalIconCloseButtonClass;

/** Zavírací tlačítko s vlastním obsahem (např. „Zrušit“) — bez size-8. */
const closeWithContentClass =
  "inline-flex min-w-0 items-center justify-center rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none";

export type DialogRootProps = PropsOf<typeof HeadlessModal.Root>;

export type DialogTriggerProps = PropsOf<typeof HeadlessModal.Trigger>;

export type DialogPanelProps = PropsOf<typeof HeadlessModal.Panel>;

export type DialogContentProps = PropsOf<typeof HeadlessModal.Content>;

export type DialogHeaderProps = PropsOf<typeof HeadlessModal.Header>;

export type DialogFooterProps = PropsOf<typeof HeadlessModal.Footer>;

export type DialogTitleProps = PropsOf<typeof HeadlessModal.Title>;

export type DialogDescriptionProps = PropsOf<typeof HeadlessModal.Description>;

export type DialogCloseProps = PropsOf<typeof HeadlessModal.Close>;

export const DialogRoot: FunctionComponent<DialogRootProps> = (props) => {
  const merged = [rootClass, props.class].filter(Boolean).join(" ");
  return <HeadlessModal.Root {...props} class={merged} />;
};

export const DialogTrigger: FunctionComponent<DialogTriggerProps> = (props) => {
  const merged = [triggerClass, props.class].filter(Boolean).join(" ");
  return <HeadlessModal.Trigger {...props} class={merged} />;
};

export const DialogPanel: FunctionComponent<DialogPanelProps> = (props) => {
  const merged = [panelBaseClass, "relative", props.class].filter(Boolean).join(" ");
  return <HeadlessModal.Panel {...props} class={merged} />;
};

export const DialogContent: FunctionComponent<DialogContentProps> = (props) => {
  const merged = [contentClass, props.class].filter(Boolean).join(" ");
  return <HeadlessModal.Content {...props} class={merged} />;
};

export const DialogHeader: FunctionComponent<DialogHeaderProps> = (props) => {
  const merged = [headerClass, props.class].filter(Boolean).join(" ");
  return <HeadlessModal.Header {...props} class={merged} />;
};

export const DialogFooter: FunctionComponent<DialogFooterProps> = (props) => {
  const merged = [footerClass, props.class].filter(Boolean).join(" ");
  return <HeadlessModal.Footer {...props} class={merged} />;
};

export const DialogTitle: FunctionComponent<DialogTitleProps> = (props) => {
  const merged = [titleClass, props.class].filter(Boolean).join(" ");
  return <HeadlessModal.Title {...props} class={merged} />;
};

export const DialogDescription: FunctionComponent<DialogDescriptionProps> = (props) => {
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

export const DialogClose: FunctionComponent<DialogCloseProps> = (props) => {
  const { class: className, children, ...rest } = props;
  const base = children === undefined ? closeClass : closeWithContentClass;
  const merged = [base, className].filter(Boolean).join(" ");
  return (
    <HeadlessModal.Close
      {...rest}
      class={merged}
      aria-label={rest["aria-label"] ?? (children === undefined ? "Zavřít" : undefined)}
    >
      {children ?? closeIcon}
    </HeadlessModal.Close>
  );
};

/**
 * Modální dialog (shadcn Dialog) nad {@link https://qwikui.com/docs/headless/modal | @qwik-ui/headless Modal} —
 * vycentrovaný panel s backdropem, tokeny z COLORS.md. Od Sheetu se liší pozicí a animací (viz `q-dialog-panel` v global.css).
 */
export const Dialog = {
  Root: DialogRoot,
  Trigger: DialogTrigger,
  Panel: DialogPanel,
  Content: DialogContent,
  Header: DialogHeader,
  Footer: DialogFooter,
  Title: DialogTitle,
  Description: DialogDescription,
  Close: DialogClose,
};
