import { type FunctionComponent, type PropsOf } from "@builder.io/qwik";
import { Modal as HeadlessModal } from "@qwik-ui/headless";

const rootClass = "contents";

const triggerClass =
  "inline-flex items-center justify-center rounded-md border border-separator-opaque bg-surface-raised px-3 py-2 font-medium text-callout text-label shadow-sm ring-offset-background transition-colors hover:bg-surface-overlay focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

/** `q-dialog-panel` — v global.css je :modal display:flex, skrytý stav a zoom animace (headless čeká na animationend při zavírání). */
const panelBaseClass =
  "q-dialog-panel fixed left-1/2 top-1/2 z-50 m-0 min-w-0 w-[calc(100%-2rem)] max-w-lg max-h-[min(90dvh,40rem)] -translate-x-1/2 -translate-y-1/2 overflow-hidden border border-separator-opaque bg-surface-raised p-0 shadow-lg outline-none ring-offset-background backdrop:bg-black/40 rounded-lg";

const contentClass =
  "flex min-w-0 flex-1 flex-col gap-4 overflow-y-auto p-6 text-body text-label ring-offset-background";

const headerClass =
  "flex min-w-0 flex-col gap-1.5 border-b border-separator-opaque p-6 text-left";

const footerClass =
  "flex min-w-0 w-full flex-col-reverse gap-2 border-t border-separator-opaque p-6 sm:flex-row sm:flex-wrap sm:justify-end";

const titleClass =
  "text-title-3 font-semibold leading-none tracking-tight text-label";

const descriptionClass = "text-sm text-secondary-label";

/** Ikona v rohu — pevná velikost; neslučovat s textovými akcemi v patičce (size-8 by roztrhalo label). */
const closeClass =
  "inline-flex size-8 shrink-0 items-center justify-center rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none";

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
