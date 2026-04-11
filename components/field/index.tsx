/**
 * @component field
 * @title Field
 * @version 1.0.0
 * @example
 * ```tsx
 * import { Field } from "~/components/ui/field";
 * 
 * <Field.Root>
 *   …
 * </Field.Root>
 * ```
 * Ukázka v demo aplikaci: route `/components/field` (zdroj `demo/src/routes/components/field/index.tsx`).
 
 */

import { component$, type PropsOf, Slot } from "@builder.io/qwik";

export type FieldRootProps = PropsOf<"div">;

/**
 * Vertical stack for one form control with consistent spacing (shadcn-style Field).
 * Compose with `Label`, `Input`, `FieldDescription`, and `FieldError`.
 */
export const FieldRoot = component$<FieldRootProps>((props) => {
  const { class: className, ...rest } = props;
  const base = "flex w-full flex-col gap-2";
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <div {...rest} class={merged}>
      <Slot />
    </div>
  );
});

export type FieldDescriptionProps = PropsOf<"p">;

/** Helper or hint text below the control; use with matching `aria-describedby` on the input. */
export const FieldDescription = component$<FieldDescriptionProps>((props) => {
  const { class: className, ...rest } = props;
  const base = "text-caption-1 text-secondary-label";
  const merged = [base, className].filter(Boolean).join(" ");

  return <p {...rest} class={merged} />;
});

export type FieldErrorProps = PropsOf<"p">;

/** Error message; defaults to `role="alert"`. Pair with `aria-invalid` on the control when shown. */
export const FieldError = component$<FieldErrorProps>((props) => {
  const { class: className, role = "alert", ...rest } = props;
  const base = "text-caption-1 font-medium text-system-red";
  const merged = [base, className].filter(Boolean).join(" ");

  return <p {...rest} class={merged} role={role} />;
});

/** Namespace export: `Field.Root`, `Field.Description`, `Field.Error`. */
export const Field = {
  Root: FieldRoot,
  Description: FieldDescription,
  Error: FieldError,
};
