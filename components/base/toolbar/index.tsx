/**
 * @component toolbar
 * @title Toolbar
 * @version 1.1.0
 * @example Složené API — skupiny, oddělovač, spacer
 * `Toolbar.Group` dává `role=&quot;group&quot;` a volitelný `aria-label`.
 * ```tsx
 * import { Toolbar } from "~/components/ui/base/toolbar";
 * 
 * <Toolbar.Root aria-label="Formátování">
 *   <Toolbar.Group aria-label="Historie">
 *     <Toolbar.Button>Zpět</Toolbar.Button>
 *     <Toolbar.Button>Vpřed</Toolbar.Button>
 *   </Toolbar.Group>
 *   <Toolbar.Separator />
 *   <Toolbar.Group>
 *     <Toolbar.Link href="#">Nápověda</Toolbar.Link>
 *   </Toolbar.Group>
 *   <Toolbar.Spacer />
 *   <Toolbar.Button>Uložit</Toolbar.Button>
 * </Toolbar.Root>
 * ```
 *
 * @example S ToggleGroup
 * Headless toggle skupinu vlož jako dítě kořene; styl kořene ToggleGroup se zjemní, aby seděl uvnitř lišty.
 * ```tsx
 * import { Toolbar } from "~/components/ui/base/toolbar";
 * import { ToggleGroup } from "~/components/ui/base/toggle-group";
 * 
 * <Toolbar.Root aria-label="Text" class="w-full max-w-xl">
 *   <ToggleGroup.Root value="b" aria-label="Styl" class="border-0 bg-transparent p-0 shadow-none">
 *     <ToggleGroup.Item value="b">B</ToggleGroup.Item>
 *     <ToggleGroup.Item value="i">I</ToggleGroup.Item>
 *     <ToggleGroup.Item value="u">U</ToggleGroup.Item>
 *   </ToggleGroup.Root>
 *   <Toolbar.Separator />
 *   <Toolbar.Button type="button">Vložit odkaz</Toolbar.Button>
 * </Toolbar.Root>
 * ```
 *
 * @example Svislá orientace
 * U `orientation=&quot;vertical&quot;` použij u oddělovače `orientation=&quot;horizontal&quot;` .
 * ```tsx
 * import { Toolbar } from "~/components/ui/base/toolbar";
 * 
 * <Toolbar.Root orientation="vertical" aria-label="Postranní nástroje">
 *   <Toolbar.Button>Výběr</Toolbar.Button>
 *   <Toolbar.Button>Orát</Toolbar.Button>
 *   <Toolbar.Separator orientation="horizontal" />
 *   <Toolbar.Button>Barva</Toolbar.Button>
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
  /** Vodorovně (výchozí) nebo svisle. */
  orientation?: "horizontal" | "vertical";
  /** Výchozí `toolbar`; pro lištu menu (komponenta `menubar`) použij `menubar`. */
  role?: "toolbar" | "menubar";
  /** Popisek pro přístupnost — u `role="toolbar"` výchozí „Toolbar“. */
  "aria-label"?: string;
};

/**
 * Kontejner pro sadu ovládacích prvků (`role="toolbar"`). Bez headless primitivy v @qwik-ui —
 * skládá se s {@link Toolbar.Group}, {@link Toolbar.Separator}, tlačítky nebo např. {@link ToggleGroup}.
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
  /** Když skupina nemá viditelný popisek (páruje s `role="group"`). */
  "aria-label"?: string;
};

/** Logická skupina položek uvnitř lišty (`role="group"`). */
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
  /** Ve vodorovné liště výchozí `vertical`; u `orientation="vertical"` na kořeni použij `horizontal`. */
  orientation?: "horizontal" | "vertical";
};

/** Oddělovač mezi skupinami — výchozí svislá čára; pro svislou lištu nastav `orientation="horizontal"`. */
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

/** Vyplní zbývající prostor ve vodorovné liště (`flex-1`). Ve svislé orientaci má malou výšku. */
export const ToolbarSpacer = component$<ToolbarSpacerProps>((props) => {
  const { class: className, ...rest } = props;
  const merged = ["min-h-0 min-w-0 flex-1 basis-0", className].filter(Boolean).join(" ");
  return <div data-qui-toolbar-spacer="" aria-hidden="true" {...rest} class={merged} />;
});

export type ToolbarButtonProps = Omit<PropsOf<"button">, "type"> & {
  type?: PropsOf<"button">["type"];
};

/** Tlačítko ve stylu položky lišty (neplné {@link Button} varianty). */
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

/** Odkaz se stejným vzhledem jako {@link ToolbarButton}. */
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
 * Složené API lišty nástrojů: {@link ToolbarRoot}, {@link ToolbarGroup}, {@link ToolbarSeparator},
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
