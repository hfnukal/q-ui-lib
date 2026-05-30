/**
 * @component toolbar
 * @title Toolbar
 * @version 1.1.0
 * @example Compound API — groups, separator, spacer
 * `Toolbar.Group` provides `role=&quot;group&quot;` and an optional `aria-label`.
 * ```tsx
 * import { Toolbar } from "~/components/ui/base/toolbar";
 * 
 * <Toolbar.Root aria-label="Formatting">
 *   <Toolbar.Group aria-label="History">
 *     <Toolbar.Button>Undo</Toolbar.Button>
 *     <Toolbar.Button>Redo</Toolbar.Button>
 *   </Toolbar.Group>
 *   <Toolbar.Separator />
 *   <Toolbar.Group>
 *     <Toolbar.Link href="#">Help</Toolbar.Link>
 *   </Toolbar.Group>
 *   <Toolbar.Spacer />
 *   <Toolbar.Button>Save</Toolbar.Button>
 * </Toolbar.Root>
 * ```
 *
 * @example With ToggleGroup
 * Insert a headless toggle group as a child of the root; the ToggleGroup root style is toned down so it fits inside the toolbar.
 * ```tsx
 * import { Toolbar } from "~/components/ui/base/toolbar";
 * import { ToggleGroup } from "~/components/ui/base/toggle-group";
 * 
 * <Toolbar.Root aria-label="Text" class="w-full max-w-xl">
 *   <ToggleGroup.Root value="b" aria-label="Style" class="border-0 bg-transparent p-0 shadow-none">
 *     <ToggleGroup.Item value="b">B</ToggleGroup.Item>
 *     <ToggleGroup.Item value="i">I</ToggleGroup.Item>
 *     <ToggleGroup.Item value="u">U</ToggleGroup.Item>
 *   </ToggleGroup.Root>
 *   <Toolbar.Separator />
 *   <Toolbar.Button type="button">Insert link</Toolbar.Button>
 * </Toolbar.Root>
 * ```
 *
 * @example Vertical orientation
 * With `orientation=&quot;vertical&quot;` use `orientation=&quot;horizontal&quot;` on the separator.
 * ```tsx
 * import { Toolbar } from "~/components/ui/base/toolbar";
 * 
 * <Toolbar.Root orientation="vertical" aria-label="Side tools">
 *   <Toolbar.Button>Select</Toolbar.Button>
 *   <Toolbar.Button>Pan</Toolbar.Button>
 *   <Toolbar.Separator orientation="horizontal" />
 *   <Toolbar.Button>Color</Toolbar.Button>
 * </Toolbar.Root>
 * ```
 
 
 
 
 
 
 
 
 
 */

import { component$, type PropsOf, Slot } from "@builder.io/qwik";
import { Separator } from "../separator";

const rootHorizontal =
  "flex min-h-10 max-w-full flex-row flex-wrap items-center gap-1 rounded-md border border-separator-opaque bg-surface-raised p-1 shadow-sm ring-offset-background";

const rootVertical =
  "flex min-h-0 min-w-40 flex-col items-stretch gap-1 rounded-md border border-separator-opaque bg-surface-raised p-1 shadow-sm ring-offset-background";

const groupClass =
  "inline-flex items-center gap-1 [&:empty]:hidden";

const itemClass =
  "inline-flex h-8 shrink-0 select-none items-center justify-center rounded-sm px-2.5 text-callout font-medium text-label outline-none ring-offset-background transition-colors hover:bg-surface-overlay focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50";

export type ToolbarRootProps = Omit<PropsOf<"div">, "role" | "aria-orientation"> & {
  /** Horizontal (default) or vertical. */
  orientation?: "horizontal" | "vertical";
  /** Defaults to `toolbar`; for a menu bar (the `menubar` component) use `menubar`. */
  role?: "toolbar" | "menubar";
  /** Accessibility label — defaults to “Toolbar” for `role="toolbar"`. */
  "aria-label"?: string;
};

/**
 * Container for a set of controls (`role="toolbar"`). No headless primitive in @qwik-ui —
 * composes with {@link Toolbar.Group}, {@link Toolbar.Separator}, buttons or e.g. {@link ToggleGroup}.
 */
export const ToolbarRoot = component$<ToolbarRootProps>((props) => {
  const {
    class: className,
    orientation = "horizontal",
    role = "toolbar",
    "aria-label": ariaLabel = "Toolbar",
    children,
    ...rest
  } = props;

  const base = orientation === "vertical" ? rootVertical : rootHorizontal;
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <div
      role={role}
      aria-orientation={orientation}
      aria-label={ariaLabel}
      data-orientation={orientation}
      data-qui-toolbar=""
      {...rest}
      class={merged}
    >
      {children ?? <Slot />}
    </div>
  );
});

export type ToolbarGroupProps = PropsOf<"div"> & {
  /** When the group has no visible label (pairs with `role="group"`). */
  "aria-label"?: string;
};

/** Logical group of items inside the toolbar (`role="group"`). */
export const ToolbarGroup = component$<ToolbarGroupProps>((props) => {
  const { class: className, "aria-label": ariaLabel, children, ...rest } = props;
  const merged = [groupClass, className].filter(Boolean).join(" ");

  return (
    <div role="group" aria-label={ariaLabel} {...rest} class={merged}>
      {children ?? <Slot />}
    </div>
  );
});

export type ToolbarSeparatorProps = Pick<PropsOf<typeof Separator>, "class" | "decorative"> & {
  /** In a horizontal toolbar defaults to `vertical`; for `orientation="vertical"` on the root use `horizontal`. */
  orientation?: "horizontal" | "vertical";
};

/** Separator between groups — defaults to a vertical line; for a vertical toolbar set `orientation="horizontal"`. */
export const ToolbarSeparator = component$<ToolbarSeparatorProps>((props) => {
  const orient = props.orientation ?? "vertical";
  const isVertical = orient === "vertical";
  const merged = [
    "shrink-0",
    isVertical ? "mx-1 h-6 min-h-0 self-center" : "my-1 w-full min-h-px",
    props.class,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <Separator
      orientation={isVertical ? "vertical" : "horizontal"}
      decorative={props.decorative}
      class={merged}
    />
  );
});

export type ToolbarSpacerProps = PropsOf<"div">;

/** Fills the remaining space in a horizontal toolbar (`flex-1`). In vertical orientation it has a small height. */
export const ToolbarSpacer = component$<ToolbarSpacerProps>((props) => {
  const { class: className, ...rest } = props;
  const merged = ["min-h-0 min-w-0 flex-1 basis-0", className].filter(Boolean).join(" ");
  return <div data-qui-toolbar-spacer="" aria-hidden="true" {...rest} class={merged} />;
});

export type ToolbarButtonProps = Omit<PropsOf<"button">, "type"> & {
  type?: PropsOf<"button">["type"];
};

/** Button styled as a toolbar item (not the full {@link Button} variants). */
export const ToolbarButton = component$<ToolbarButtonProps>((props) => {
  const { class: className, type = "button", children, ...rest } = props;
  const merged = [itemClass, className].filter(Boolean).join(" ");
  return (
    <button type={type} data-qui-toolbar-button="" {...rest} class={merged}>
      {children ?? <Slot />}
    </button>
  );
});

export type ToolbarLinkProps = PropsOf<"a">;

/** Link with the same appearance as {@link ToolbarButton}. */
export const ToolbarLink = component$<ToolbarLinkProps>((props) => {
  const { class: className, children, ...rest } = props;
  const merged = [itemClass, className].filter(Boolean).join(" ");
  return (
    <a data-qui-toolbar-link="" {...rest} class={merged}>
      {children ?? <Slot />}
    </a>
  );
});

/**
 * Compound toolbar API: {@link ToolbarRoot}, {@link ToolbarGroup}, {@link ToolbarSeparator},
 * {@link ToolbarSpacer}, {@link ToolbarButton}, {@link ToolbarLink}.
 */
export const Toolbar = {
  Root: ToolbarRoot,
  Group: ToolbarGroup,
  Separator: ToolbarSeparator,
  Spacer: ToolbarSpacer,
  Button: ToolbarButton,
  Link: ToolbarLink,
};
