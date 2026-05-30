/**
 * Common styles for the modal Dialog and Sheet (Modal from headless) — trigger, titles, icon close.
 * See UNIFICATION.md — public contract; changes are subject to semver.
 */

import { floatingOutlineButtonTriggerClass } from "./floating-ui";

/** Same outline trigger as Popover / Dropdown default — centered Dialog and side Sheet. */
export const modalOutlineTriggerClass = floatingOutlineButtonTriggerClass;

export const modalTitleClass =
  "text-title-3 font-semibold leading-none tracking-tight text-label";

export const modalDescriptionClass = "text-sm text-secondary-label";

/** Close button with an icon (fixed size) — Dialog / Sheet. */
export const modalIconCloseButtonClass =
  "inline-flex size-8 shrink-0 items-center justify-center rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none";
