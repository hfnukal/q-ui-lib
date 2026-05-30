import { createContextId, type Signal } from "@builder.io/qwik";

/**
 * Same ID as `@qwik-ui/headless` (`qui-popover`) — you cannot wrap `Popover.Root` in another `component$`
 * with its own `useContextProvider`, otherwise the context won't propagate to the `Slot` (trigger / panel).
 * The type is narrowed to reading the fields the arrow needs.
 */
export const headlessPopoverContextId = createContextId<{
  floating?: boolean | string;
  isOpenSig?: Signal<boolean>;
  panelRef?: Signal<HTMLElement | undefined>;
  /** `bind:anchor` from the headless root — Tooltip passes the trigger here; `Popover.Trigger` fills `triggerRef`. */
  anchorRef?: Signal<HTMLElement | undefined>;
  triggerRef?: Signal<HTMLElement | undefined>;
}>("qui-popover");
