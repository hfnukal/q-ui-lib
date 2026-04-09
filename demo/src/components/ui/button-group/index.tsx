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
