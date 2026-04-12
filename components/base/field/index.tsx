/**
 * @component field
 * @title Field
 * @version 1.0.0
 * @example Základ (Label + Input)
 * Základ (Label + Input) — viz ukázka níže.
 * ```tsx
 * import { Field } from "~/components/ui/field";
 * import { Input } from "~/components/ui/input";
 * import { Label } from "~/components/ui/label";
 * 
 * <Field.Root>
 *   <Label for="user-email">E-mail</Label>
 *   <Input id="user-email" type="email" name="email" placeholder="you@example.com" />
 * </Field.Root>
 * ```
 *
 * @example S popisem
 * S popisem — viz ukázka níže.
 * ```tsx
 * import { Field } from "~/components/ui/field";
 * import { Input } from "~/components/ui/input";
 * import { Label } from "~/components/ui/label";
 * 
 * <Field.Root>
 *   <Label for="display-name">Zobrazované jméno</Label>
 *   <Input
 *     id="display-name"
 *     type="text"
 *     name="displayName"
 *     aria-describedby="display-name-hint"
 *   />
 *   <Field.Description id="display-name-hint">
 *     Tak vás uvidí ostatní uživatelé.
 *   </Field.Description>
 * </Field.Root>
 * ```
 *
 * @example Chybový stav
 * Chybový stav — viz ukázka níže.
 * ```tsx
 * import { Field } from "~/components/ui/field";
 * import { Input } from "~/components/ui/input";
 * import { Label } from "~/components/ui/label";
 * 
 * <Field.Root>
 *   <Label for="invite-code">Pozvánkový kód</Label>
 *   <Input
 *     id="invite-code"
 *     type="text"
 *     aria-invalid="true"
 *     aria-describedby="invite-code-err"
 *     class="border-system-red focus-visible:ring-system-red"
 *   />
 *   <Field.Error id="invite-code-err">Tento kód neexistuje nebo už vypršel.</Field.Error>
 * </Field.Root>
 * ```
 
 
 
 
 
 
 
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
