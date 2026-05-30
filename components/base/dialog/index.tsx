/**
 * @component dialog
 * @title Dialog
 * @version 1.0.3
 * @example Basic dialog
 * Basic dialog — see the example below.
 * ```tsx
 * import { Dialog } from "~/components/ui/base/dialog";
 * import { Button } from "~/components/ui/base/button";
 * 
 * <Dialog.Root>
 *   <Dialog.Trigger>Open dialog</Dialog.Trigger>
 *   <Dialog.Panel>
 *     <Dialog.Close class="absolute right-4 top-4 z-10" />
 *     <Dialog.Header>
 *       <Dialog.Title>Edit profile</Dialog.Title>
 *       <Dialog.Description>
 *         Here you can change the details shown to other users.
 *       </Dialog.Description>
 *     </Dialog.Header>
 *     <Dialog.Content>
 *       <p class="text-callout text-secondary-label">Main dialog content.</p>
 *     </Dialog.Content>
 *     <Dialog.Footer>
 *       <Dialog.Close class="rounded-md border border-separator-opaque bg-surface-raised px-4 py-2 text-callout font-medium text-label shadow-sm hover:bg-surface-overlay">
 *         Cancel
 *       </Dialog.Close>
 *       <Button>Save</Button>
 *     </Dialog.Footer>
 *   </Dialog.Panel>
 * </Dialog.Root>
 * ```
 *
 * @example Alert dialog
 * Set `alert` on `Dialog.Root` — headless sets `role=&quot;alertdialog&quot;` and disables closing by clicking the backdrop.
 * ```tsx
 * import { Dialog } from "~/components/ui/base/dialog";
 * 
 * <Dialog.Root alert>
 *   <Dialog.Trigger>Delete account</Dialog.Trigger>
 *   <Dialog.Panel>
 *     <Dialog.Close class="absolute right-4 top-4 z-10" />
 *     <Dialog.Header>
 *       <Dialog.Title>Really delete?</Dialog.Title>
 *       <Dialog.Description>This action cannot be undone.</Dialog.Description>
 *     </Dialog.Header>
 *     <Dialog.Footer>
 *       <Dialog.Close class="rounded-md border border-separator-opaque px-4 py-2 text-callout">
 *         Cancel
 *       </Dialog.Close>
 *       <Dialog.Close class="rounded-md bg-system-red px-4 py-2 text-callout font-medium text-white">
 *         Delete
 *       </Dialog.Close>
 *     </Dialog.Footer>
 *   </Dialog.Panel>
 * </Dialog.Root>
 * ```
 *
 * @example Panel size (variant)
 * Set `variant` on `Dialog.Panel` (`"xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "full"`) — dimensions are handled by `data-dialog-size` in global.css. Without `variant` the default width applies.
 * ```tsx
 * import { Dialog } from "~/components/ui/base/dialog";
 *
 * <Dialog.Root>
 *   <Dialog.Trigger>Open large dialog</Dialog.Trigger>
 *   <Dialog.Panel variant="lg">
 *     <Dialog.Close class="absolute right-4 top-4 z-10" />
 *     <Dialog.Header>
 *       <Dialog.Title>Large dialog</Dialog.Title>
 *       <Dialog.Description>Panel with the `lg` variant.</Dialog.Description>
 *     </Dialog.Header>
 *     <Dialog.Content>
 *       <p class="text-callout text-secondary-label">More space for content.</p>
 *     </Dialog.Content>
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

/**
 * `q-dialog-panel` — in global.css there is the :modal width, `display:flex`, `margin:auto` and animation (headless waits for animationend).
 * Centered via `inset-0` + `m-auto`; the width is in CSS because of the headless `dialog:modal { max-width: unset }`.
 */
const panelBaseClass =
  "q-dialog-panel fixed inset-0 z-50 m-auto h-fit min-w-0 max-h-[min(90dvh,40rem)] overflow-hidden border border-separator-opaque bg-surface-raised p-0 shadow-lg outline-none ring-offset-background backdrop:bg-black/40 rounded-lg";

const contentClass =
  "flex min-w-0 flex-1 flex-col gap-4 overflow-y-auto p-6 text-body text-label ring-offset-background";

const headerClass =
  "flex min-w-0 flex-col gap-1.5 border-b border-separator-opaque p-6 text-left";

const footerClass =
  "flex min-w-0 w-full flex-col-reverse gap-2 border-t border-separator-opaque p-6 sm:flex-row sm:flex-wrap sm:justify-end";

const titleClass = modalTitleClass;

const descriptionClass = modalDescriptionClass;

/** Corner icon — fixed size; do not merge with text actions in the footer (size-8 would stretch the label). */
const closeClass = modalIconCloseButtonClass;

/** Close button with custom content (e.g. "Cancel") — without size-8. */
const closeWithContentClass =
  "inline-flex min-w-0 items-center justify-center rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none";

export type DialogRootProps = PropsOf<typeof HeadlessModal.Root>;

export type DialogTriggerProps = PropsOf<typeof HeadlessModal.Trigger>;

/** Panel size — width/height are in `global.css` for `dialog.q-dialog-panel[data-dialog-size=…]:modal`. Without `variant` the default dimensions apply. */
export type DialogPanelVariant = "xs" | "sm" | "md" | "lg" | "xl" | "xxl" | "full";

export type DialogPanelProps = PropsOf<typeof HeadlessModal.Panel> & {
  variant?: DialogPanelVariant;
};

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
  const { variant, class: className, ...rest } = props;
  const merged = [panelBaseClass, "relative", className].filter(Boolean).join(" ");
  return (
    <HeadlessModal.Panel
      {...rest}
      class={merged}
      {...(variant ? { "data-dialog-size": variant } : {})}
    />
  );
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
      aria-label={rest["aria-label"] ?? (children === undefined ? "Close" : undefined)}
    >
      {children ?? closeIcon}
    </HeadlessModal.Close>
  );
};

/**
 * Modal dialog (shadcn Dialog) over {@link https://qwikui.com/docs/headless/modal | @qwik-ui/headless Modal} —
 * a centered panel with a backdrop, tokens from COLORS.md. It differs from Sheet in position and animation (see `q-dialog-panel` in global.css).
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
