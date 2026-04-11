/**
 * @component toggle-group
 * @title ToggleGroup
 * @version 1.0.0
 * @example
 * ```tsx
 * import { ToggleGroup } from "~/components/ui/toggle-group";
 * 
 * <ToggleGroup.Root>
 *   …
 * </ToggleGroup.Root>
 * ```
 * Ukázka v demo aplikaci: route `/components/toggle-group` (zdroj `demo/src/routes/components/toggle-group/index.tsx`).
 
 */

import { component$, type FunctionComponent, type PropsOf } from "@builder.io/qwik";
import { ToggleGroup as HeadlessToggleGroup } from "@qwik-ui/headless";

/** Vzhled odpovídá stylu tab triggerů (COLORS.md); stisk je `aria-pressed`. */
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
 * Složené API: {@link ToggleGroupRoot}, {@link ToggleGroupItem}
 * (v dokumentaci Qwik UI `ToggleGroup.*`).
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
 * Zkratka nad {@link ToggleGroup} z pole položek (`multiple` určí single vs multi výběr).
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
