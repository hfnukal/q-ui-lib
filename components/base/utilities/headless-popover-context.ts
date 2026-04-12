import { createContextId, type Signal } from "@builder.io/qwik";

/**
 * Stejné ID jako `@qwik-ui/headless` (`qui-popover`) — nelze obalovat `Popover.Root` dalším `component$`
 * s vlastním `useContextProvider`, jinak se nerozšíří kontext ke `Slot`u (trigger / panel).
 * Typ je zúžený na čtení potřebných polí u šipky.
 */
export const headlessPopoverContextId = createContextId<{
  floating?: boolean | string;
  isOpenSig?: Signal<boolean>;
  panelRef?: Signal<HTMLElement | undefined>;
  /** `bind:anchor` z headless kořene — Tooltip předává trigger sem; `Popover.Trigger` plní `triggerRef`. */
  anchorRef?: Signal<HTMLElement | undefined>;
  triggerRef?: Signal<HTMLElement | undefined>;
}>("qui-popover");
