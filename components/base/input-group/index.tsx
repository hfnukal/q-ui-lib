/**
 * @component input-group
 * @title InputGroup
 * @version 1.0.0
 * @example Prefix
 * Prefix — see the example below.
 * ```tsx
 * import { InputGroup } from "~/components/ui/base/input-group";
 * 
 * <InputGroup.Root aria-label="URL">
 *   <InputGroup.Addon>https://</InputGroup.Addon>
 *   <InputGroup.Input placeholder="example.com" />
 * </InputGroup.Root>
 * ```
 *
 * @example Suffix
 * Suffix — see the example below.
 * ```tsx
 * import { InputGroup } from "~/components/ui/base/input-group";
 * 
 * <InputGroup.Root aria-label="E-mail">
 *   <InputGroup.Input type="email" placeholder="name" />
 *   <InputGroup.Addon align="end">@company.com</InputGroup.Addon>
 * </InputGroup.Root>
 * ```
 *
 * @example Field and button
 * A direct `Button` child gets alignment and a separating border from the group.
 * ```tsx
 * import { Button } from "~/components/ui/base/button";
 * import { InputGroup } from "~/components/ui/base/input-group";
 * 
 * <InputGroup.Root aria-label="Search">
 *   <InputGroup.Input placeholder="Search…" />
 *   <Button variant="secondary">Search</Button>
 * </InputGroup.Root>
 * ```
 *
 * @example Lucide icon in the addon
 * Icons from `@qwikest/icons/lucide` (e.g. `LuSearch`) — size via `{"[&_svg]:size-4"}` on the addon.
 * ```tsx
 * import { LuSearch } from "@qwikest/icons/lucide";
 * import { InputGroup } from "~/components/ui/base/input-group";
 * 
 * <InputGroup.Root aria-label="Search">
 *   <InputGroup.Addon class="[&_svg]:size-4">
 *     <LuSearch aria-hidden="true" />
 *   </InputGroup.Addon>
 *   <InputGroup.Input placeholder="Query…" />
 * </InputGroup.Root>
 * ```
 
 
 
 
 
 
 
 
 
 */

import { component$, Slot, type PropsOf } from "@builder.io/qwik";
import { Polymorphic } from "@qwik-ui/headless";

export type InputGroupRootProps = Omit<PropsOf<"div">, "as"> & {
  /** When the group has no visible caption, set for accessibility (`role="group"`). */
  "aria-label"?: string;
  /**
   * Root element. Default is `span` so it can be placed inside text parents.
   * For a block wrapper, set `as="div"`.
   */
  as?: "div" | "span";
};

/**
 * Horizontal flex shell for a single merged control: shared border, surface, shadow, and
 * `focus-within` ring (shadcn „Input Group“). Place {@link InputGroupAddon}, {@link InputGroupInput},
 * or a library `Button` as direct children.
 * Via `as` you can switch the root between `span` (default) and `div`.
 * In `<p>`/`<pre>` use only `as="span"` and valid phrasing content.
 */
export const InputGroupRoot = component$<InputGroupRootProps>((props) => {
  const { class: className, "aria-label": ariaLabel, as = "span", ...rest } = props;
  const base = [
    "flex w-full min-w-0 items-stretch overflow-hidden rounded-md",
    "border border-separator-opaque bg-surface-raised shadow-sm transition-colors",
    "focus-within:outline-none focus-within:ring-2 focus-within:ring-ring focus-within:ring-offset-2 ring-offset-background",
    "[&>button]:relative [&>button]:z-0 [&>button]:inline-flex [&>button]:shrink-0 [&>button]:rounded-none [&>button]:shadow-none",
    "[&>button:hover]:z-10 [&>button:focus-visible]:z-20",
    "[&>button:first-child]:rounded-l-md",
    "[&>button:last-child]:rounded-r-md",
    "[&>button:only-child]:rounded-md",
    "[&>button:not(:first-child)]:border-l [&>button:not(:first-child)]:border-separator-opaque",
  ].join(" ");
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <Polymorphic as={as} role="group" class={merged} aria-label={ariaLabel} {...rest}>
      <Slot />
    </Polymorphic>
  );
});

export interface InputGroupAddonProps {
  /** `start`: prefix (border before field). `end`: suffix (border after field). */
  align?: "start" | "end";
  class?: string;
}

/**
 * Non-interactive prefix or suffix (text, icon, currency). Use `align="end"` for trailing addons.
 */
export const InputGroupAddon = component$<InputGroupAddonProps>((props) => {
  const align = props.align ?? "start";
  const edge =
    align === "end"
      ? "border-l border-separator-opaque"
      : "border-r border-separator-opaque";
  const base = [
    "inline-flex min-h-10 shrink-0 items-center justify-center px-3",
    "bg-fill-secondary/20 text-callout text-secondary-label select-none",
    edge,
  ].join(" ");
  const merged = [base, props.class].filter(Boolean).join(" ");

  return (
    <span class={merged}>
      <Slot />
    </span>
  );
});

export type InputGroupInputProps = PropsOf<"input">;

/**
 * Field segment for use inside {@link InputGroupRoot}: no outer border; focus ring comes from the group.
 * Styling matches the `Input` component tokens from COLORS.md.
 */
export const InputGroupInput = component$<InputGroupInputProps>((props) => {
  const { class: className, ...rest } = props;
  const base = [
    "flex h-10 min-w-0 flex-1 border-0 bg-transparent px-3 py-2",
    "text-callout text-label transition-colors",
    "placeholder:text-placeholder",
    "file:border-0 file:bg-transparent file:text-callout file:font-medium file:text-label",
    "focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-offset-0",
    "disabled:cursor-not-allowed disabled:opacity-50",
    "read-only:bg-fill-secondary/30 read-only:cursor-default",
  ].join(" ");
  const merged = [base, className].filter(Boolean).join(" ");

  return <input {...rest} class={merged} />;
});

export const InputGroup = {
  Root: InputGroupRoot,
  Addon: InputGroupAddon,
  Input: InputGroupInput,
};
