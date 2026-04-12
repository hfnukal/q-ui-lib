/**
 * @component button-group
 * @title ButtonGroup
 * @version 1.0.0
 * @example Vodorovně
 * Vodorovně — viz ukázka níže.
 * ```tsx
 * import { Button } from "~/components/ui/button";
 * import { ButtonGroup } from "~/components/ui/button-group";
 * 
 * <ButtonGroup aria-label="Text actions">
 *   <Button variant="secondary" onClick$={...}>Left</Button>
 *   <Button variant="secondary" onClick$={...}>Center</Button>
 *   <Button variant="secondary" onClick$={...}>Right</Button>
 * </ButtonGroup>
 * ```
 *
 * @example Svisle
 * Prop `orientation=&quot;vertical&quot;` .
 * ```tsx
 * import { Button } from "~/components/ui/button";
 * import { ButtonGroup } from "~/components/ui/button-group";
 * 
 * <ButtonGroup orientation="vertical" aria-label="Stack">
 *   <Button variant="secondary" onClick$={...}>One</Button>
 *   <Button variant="secondary" onClick$={...}>Two</Button>
 * </ButtonGroup>
 * ```
 *
 * @example Primární varianta
 * Stejné sloučení okrajů funguje i u `primary` / `danger`.
 * ```tsx
 * import { Button } from "~/components/ui/button";
 * import { ButtonGroup } from "~/components/ui/button-group";
 * 
 * <ButtonGroup aria-label="Modes">
 *   <Button variant="primary" onClick$={...}>A</Button>
 *   <Button variant="primary" onClick$={...}>B</Button>
 * </ButtonGroup>
 * ```
 
 */

import { component$, Slot } from "@builder.io/qwik";

export interface ButtonGroupProps {
  /** Row (default) or column layout */
  orientation?: "horizontal" | "vertical";
  /** Use when the group has no visible caption (pairs with `role="group"`) */
  "aria-label"?: string;
  /** Extra Tailwind classes merged after defaults */
  class?: string;
}

/**
 * Spojuje více tlačítek do jednoho vizuálního celku (shadcn „Button Group“): sdílené stíny,
 * překryté okraje (`-space-x/y-px`) a zaoblení jen na koncích. Děti vlož jako přímé potomky
 * (typicky {@link Button} s `variant="secondary"`).
 */
export const ButtonGroup = component$<ButtonGroupProps>((props) => {
  const orient = props.orientation ?? "horizontal";

  const base =
    "inline-flex w-fit items-stretch shadow-sm [&>*]:relative [&>*]:z-0 [&>*:hover]:z-10 [&>*:focus-visible]:z-20 [&>*]:shadow-none";

  const horizontal =
    "-space-x-px flex-row [&>*]:rounded-none [&>*:first-child]:rounded-l-md [&>*:last-child]:rounded-r-md [&>*:only-child]:rounded-md";

  const vertical =
    "-space-y-px flex-col [&>*]:rounded-none [&>*:first-child]:rounded-t-md [&>*:last-child]:rounded-b-md [&>*:only-child]:rounded-md";

  const merged = [base, orient === "vertical" ? vertical : horizontal, props.class]
    .filter(Boolean)
    .join(" ");

  return (
    <div role="group" class={merged} aria-label={props["aria-label"]}>
      <Slot />
    </div>
  );
});
