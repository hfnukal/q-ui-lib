/**
 * @component field
 * @title Field
 * @version 1.0.0
 * @example Basics (Label + Input)
 * Basics (Label + Input) — see the example below.
 * ```tsx
 * import { Field } from "~/components/ui/base/field";
 * import { Input } from "~/components/ui/base/input";
 * import { Label } from "~/components/ui/base/label";
 * 
 * <Field.Root>
 *   <Label for="user-email">E-mail</Label>
 *   <Input id="user-email" type="email" name="email" placeholder="you@example.com" />
 * </Field.Root>
 * ```
 *
 * @example With description
 * With description — see the example below.
 * ```tsx
 * import { Field } from "~/components/ui/base/field";
 * import { Input } from "~/components/ui/base/input";
 * import { Label } from "~/components/ui/base/label";
 * 
 * <Field.Root>
 *   <Label for="display-name">Display name</Label>
 *   <Input
 *     id="display-name"
 *     type="text"
 *     name="displayName"
 *     aria-describedby="display-name-hint"
 *   />
 *   <Field.Description id="display-name-hint">
 *     This is how other users will see you.
 *   </Field.Description>
 * </Field.Root>
 * ```
 *
 * @example Error state
 * Error state — see the example below.
 * ```tsx
 * import { Field } from "~/components/ui/base/field";
 * import { Input } from "~/components/ui/base/input";
 * import { Label } from "~/components/ui/base/label";
 * 
 * <Field.Root>
 *   <Label for="invite-code">Invite code</Label>
 *   <Input
 *     id="invite-code"
 *     type="text"
 *     aria-invalid="true"
 *     aria-describedby="invite-code-err"
 *     class="border-system-red focus-visible:ring-system-red"
 *   />
 *   <Field.Error id="invite-code-err">This code does not exist or has already expired.</Field.Error>
 * </Field.Root>
 * ```
 
 
 
 
 
 
 
 
 
 */

import { component$, type PropsOf, Slot } from "@builder.io/qwik";
import { Polymorphic } from "@qwik-ui/headless";

export type FieldRootProps = Omit<PropsOf<"div">, "as"> & {
  /**
   * Root element. Default is `span` so it can be placed inside text parents.
   * For a classic block layout, set `as="div"`.
   */
  as?: "div" | "span";
};

/**
 * Vertical stack for one form control with consistent spacing (shadcn-style Field).
 * Compose with `Label`, `Input`, `FieldDescription`, and `FieldError`.
 * Via `as` you can switch the root between `span` (default) and `div`.
 * In `<p>`/`<pre>` use only `as="span"` and only text-valid children.
 */
export const FieldRoot = component$<FieldRootProps>((props) => {
  const { class: className, as = "span", ...rest } = props;
  const base = "flex w-full flex-col gap-2";
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <Polymorphic as={as} {...rest} class={merged}>
      <Slot />
    </Polymorphic>
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
