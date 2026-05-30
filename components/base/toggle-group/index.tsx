/**
 * @component toggle-group
 * @title ToggleGroup
 * @version 1.0.0
 * @example Single — ToggleGroupGroup
 * At most one item is active at a time; arrow keys move focus according to the orientation.
 * ```tsx
 * import { ToggleGroupGroup } from "~/components/ui/base/toggle-group";
 * 
 * const items = [
 *   { value: "left", label: "Left" },
 *   { value: "center", label: "Center" },
 *   { value: "right", label: "Right" },
 * ];
 * 
 * <ToggleGroupGroup items={items} defaultValue="center" />
 * ```
 *
 * @example Multiple
 * Multiple active values at once (e.g. bold and italic together).
 * ```tsx
 * import { ToggleGroupGroup } from "~/components/ui/base/toggle-group";
 * 
 * const items = [
 *   { value: "bold", label: "Bold" },
 *   { value: "italic", label: "Italic" },
 *   { value: "underline", label: "Underline" },
 * ];
 * 
 * <ToggleGroupGroup multiple items={items} defaultValue={["bold", "italic"]} />
 * ```
 *
 * @example Vertical
 * Vertical arrangement via `orientation=&quot;vertical&quot;`.
 * ```tsx
 * import { ToggleGroupGroup } from "~/components/ui/base/toggle-group";
 * 
 * const items = [
 *   { value: "left", label: "Left" },
 *   { value: "center", label: "Center" },
 *   { value: "right", label: "Right" },
 * ];
 * 
 * <ToggleGroupGroup
 *   orientation="vertical"
 *   items={items}
 *   defaultValue="left"
 * />
 * ```
 *
 * @example Compound API
 * For controlled state use `bind:value` on `ToggleGroup.Root` (see the Qwik UI Toggle Group documentation).
 * ```tsx
 * import { ToggleGroup } from "~/components/ui/base/toggle-group";
 * 
 * <ToggleGroup.Root multiple value={["a"]} aria-label="Tools">
 *   <ToggleGroup.Item value="a">A</ToggleGroup.Item>
 *   <ToggleGroup.Item value="b">B</ToggleGroup.Item>
 * </ToggleGroup.Root>
 * ```
 
 
 
 
 
 
 
 
 
 */

import { component$, type FunctionComponent, type PropsOf } from "@builder.io/qwik";
import { ToggleGroup as HeadlessToggleGroup } from "@qwik-ui/headless";

/** Appearance matches the tab trigger style (COLORS.md); the pressed state is `aria-pressed`. */
const itemClass =
  "inline-flex shrink-0 items-center justify-center rounded-md border border-transparent px-3 py-1.5 font-medium text-callout text-secondary-label ring-offset-background transition-all focus:outline-none focus-visible:z-10 focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 aria-pressed:border-separator-opaque aria-pressed:bg-surface-overlay aria-pressed:text-label aria-pressed:shadow-inner";

const rootClassHorizontal =
  "inline-flex flex-row items-center gap-0 rounded-lg border border-separator-opaque bg-surface-raised p-1 text-secondary-label shadow-sm";

const rootClassVertical =
  "inline-flex flex-col items-stretch gap-1 rounded-lg border border-separator-opaque bg-surface-raised p-1 text-secondary-label shadow-sm min-w-48 w-fit [&_button[data-qui-togglegroup-item]]:w-full";

export type ToggleGroupRootProps = PropsOf<typeof HeadlessToggleGroup.Root>;

export type ToggleGroupItemProps = PropsOf<typeof HeadlessToggleGroup.Item>;

/** Styled root (`role="group"`). */
export const ToggleGroupRoot: FunctionComponent<ToggleGroupRootProps> = (props) => {
  const orientation = props.orientation ?? "horizontal";
  const base = orientation === "vertical" ? rootClassVertical : rootClassHorizontal;
  const merged = [base, props.class].filter(Boolean).join(" ");
  return <HeadlessToggleGroup.Root {...props} class={merged} />;
};

/** Styled toggle item (`value` identifies the item in the group). */
export const ToggleGroupItem: FunctionComponent<ToggleGroupItemProps> = (props) => {
  const { class: className, ...rest } = props;
  const merged = [itemClass, className].filter(Boolean).join(" ");
  return <HeadlessToggleGroup.Item {...rest} class={merged} />;
};

/**
 * Compound API: {@link ToggleGroupRoot}, {@link ToggleGroupItem}
 * (`ToggleGroup.*` in the Qwik UI documentation).
 */
export const ToggleGroup = {
  Root: ToggleGroupRoot,
  Item: ToggleGroupItem,
};

export type ToggleGroupGroupItem = {
  value: string;
  label: string;
  disabled?: boolean;
};

type ToggleGroupGroupBase = {
  items: ToggleGroupGroupItem[];
  orientation?: ToggleGroupRootProps["orientation"];
  disabled?: ToggleGroupRootProps["disabled"];
  loop?: ToggleGroupRootProps["loop"];
  class?: string;
  "aria-label"?: string;
};

export type ToggleGroupGroupProps =
  | (ToggleGroupGroupBase & { multiple?: false; defaultValue?: string })
  | (ToggleGroupGroupBase & { multiple: true; defaultValue?: string[] });

/**
 * Shortcut over {@link ToggleGroup} from an array of items (`multiple` determines single vs multi selection).
 */
export const ToggleGroupGroup = component$<ToggleGroupGroupProps>((props) => {
  const orientation = props.orientation ?? "horizontal";
  const isMultiple = props.multiple === true;

  if (isMultiple) {
    return (
      <ToggleGroupRoot
        orientation={orientation}
        disabled={props.disabled}
        loop={props.loop}
        class={props.class}
        aria-label={props["aria-label"]}
        multiple={true}
        value={props.defaultValue}
      >
        {props.items.map((item) => (
          <ToggleGroupItem key={item.value} value={item.value} disabled={item.disabled}>
            {item.label}
          </ToggleGroupItem>
        ))}
      </ToggleGroupRoot>
    );
  }

  return (
    <ToggleGroupRoot
      orientation={orientation}
      disabled={props.disabled}
      loop={props.loop}
      class={props.class}
      aria-label={props["aria-label"]}
      multiple={false}
      value={props.defaultValue}
    >
      {props.items.map((item) => (
        <ToggleGroupItem key={item.value} value={item.value} disabled={item.disabled}>
          {item.label}
        </ToggleGroupItem>
      ))}
    </ToggleGroupRoot>
  );
});
