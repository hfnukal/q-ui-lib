/**
 * Společné styly pro modální Dialog a Sheet (Modal z headlessu) — trigger, titulky, ikonové zavření.
 * Viz UNIFICATION.md — veřejný kontrakt; změny podléhají semver.
 */

import { floatingOutlineButtonTriggerClass } from "./floating-ui";

/** Stejný outline trigger jako Popover / Dropdown default — vycentrovaný Dialog i boční Sheet. */
export const modalOutlineTriggerClass = floatingOutlineButtonTriggerClass;

export const modalTitleClass =
  "text-title-3 font-semibold leading-none tracking-tight text-label";

export const modalDescriptionClass = "text-sm text-secondary-label";

/** Zavírací tlačítko s ikonou (pevná velikost) — Dialog / Sheet. */
export const modalIconCloseButtonClass =
  "inline-flex size-8 shrink-0 items-center justify-center rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none";
