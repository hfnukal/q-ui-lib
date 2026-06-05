/**
 * @component accordion
 * @title Accordion
 * @version 1.0.1
 * @example Compound API (alternating `Trigger` / `Content`)
 * Compound API (alternating Trigger / Content) — see the example below.
 * ```tsx
 * import { Accordion } from "~/components/ui/base/accordion";
 * 
 * <Accordion.Root>
 *   <Accordion.Trigger>Basic information</Accordion.Trigger>
 *   <Accordion.Content>
 *     A brief introduction to the topic and links to further resources.
 *   </Accordion.Content>
 *   <Accordion.Trigger>Advanced options</Accordion.Trigger>
 *   <Accordion.Content>
 *     Extended settings and tips for everyday use.
 *   </Accordion.Content>
 * </Accordion.Root>
 * ```
 *
 * @example Single open panel
 * Single open panel — see the example below.
 * ```tsx
 * import { AccordionList } from "~/components/ui/base/accordion";
 * 
 * const items = [
 *   {
 *     value: "basics",
 *     title: "What is Qwik?",
 *     content: "A framework focused on instant loading and minimal JavaScript on the client.",
 *   },
 *   {
 *     value: "resumability",
 *     title: "What is resumability?",
 *     content: "The server can resume the application state without a large hydration bundle.",
 *   },
 *   {
 *     value: "signals",
 *     title: "Reactivity",
 *     content: "Fine-grained signals for efficient UI updates.",
 *   },
 * ];
 * 
 * <AccordionList items={items} />
 * ```
 *
 * @example Multiple open panels
 * Multiple open panels — see the example below.
 * ```tsx
 * import { AccordionList } from "~/components/ui/base/accordion";
 * 
 * const items = [
 *   {
 *     value: "basics",
 *     title: "What is Qwik?",
 *     content: "A framework focused on instant loading and minimal JavaScript on the client.",
 *   },
 *   {
 *     value: "resumability",
 *     title: "What is resumability?",
 *     content: "The server can resume the application state without a large hydration bundle.",
 *   },
 *   {
 *     value: "signals",
 *     title: "Reactivity",
 *     content: "Fine-grained signals for efficient UI updates.",
 *   },
 * ];
 * 
 * <AccordionList items={items} multiple />
 * ```


*/

import {
  component$,
  type FunctionComponent,
  type PropsOf,
} from "@builder.io/qwik";
import type { JSXNode } from "@builder.io/qwik/jsx-runtime";
import { Accordion as HeadlessAccordion } from "@qwik-ui/headless";

/** A single continuous card — separated only by a line between items (no gap between rows). */
const itemFrameClass = "min-w-0 overflow-hidden bg-surface-raised";

const headerClass = "flex";

const triggerClass =
  "flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-callout font-medium text-label transition-colors hover:bg-surface-overlay focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background after:ml-auto after:inline-block after:text-tertiary-label after:transition-transform after:duration-200 after:content-['▼'] [&[data-open]]:after:rotate-180";

/** Horizontal padding + vertical spacing (at the top below the trigger, at the bottom near the card's lower edge). */
const contentClass = "px-4 pb-3 pt-3 text-callout text-secondary-label";

const rootClass =
  "w-full divide-y divide-separator-opaque overflow-hidden rounded-lg border border-separator-opaque bg-surface-raised shadow-sm";

export type AccordionRootProps = PropsOf<typeof HeadlessAccordion.Root>;

export type AccordionTriggerProps = PropsOf<typeof HeadlessAccordion.Trigger>;

export type AccordionContentProps = PropsOf<typeof HeadlessAccordion.Content>;

function flattenChildren(children: unknown): JSXNode[] {
  if (children == null || children === false) return [];
  if (Array.isArray(children)) return children.flatMap(flattenChildren);
  return [children as JSXNode];
}

/**
 * Accordion root. Direct children must alternate between {@link AccordionTrigger} and {@link AccordionContent}
 * (Trigger, Content, Trigger, Content, …). Each pair is wrapped into a headless `Item` + `Header`.
 *
 * Note: `AccordionRoot` renders a block root (`<div>`), so it must not be nested inside
 * text containers `<p>` or `<pre>` (invalid HTML).
 */
export const AccordionRoot: FunctionComponent<
  AccordionRootProps & { children?: unknown }
> = (props) => {
  const { children, class: className, ...rest } = props;
  const merged = [rootClass, className].filter(Boolean).join(" ");
  const flat = flattenChildren(children);
  const pairs: Array<{ trigger: JSXNode; content: JSXNode }> = [];
  for (let i = 0; i < flat.length; i += 2) {
    pairs.push({
      trigger: flat[i] as JSXNode,
      content: flat[i + 1] as JSXNode,
    });
  }

  return (
    <HeadlessAccordion.Root {...rest} class={merged}>
      {pairs.map((pair, index) => (
        <HeadlessAccordion.Item
          key={index}
          value={String(index)}
          _index={index}
          class={itemFrameClass}
        >
          <HeadlessAccordion.Header class={headerClass}>
            {pair.trigger}
          </HeadlessAccordion.Header>
          {pair.content}
        </HeadlessAccordion.Item>
      ))}
    </HeadlessAccordion.Root>
  );
};

/** Panel trigger — default content via the headless `<Slot />` (the arrow is `::after`; the headless Trigger does not add extra nodes). */
export const AccordionTrigger: FunctionComponent<AccordionTriggerProps> = (
  props,
) => {
  const merged = [triggerClass, props.class].filter(Boolean).join(" ");
  return <HeadlessAccordion.Trigger {...props} class={merged} />;
};

/** Panel content — default content via the headless `<Slot />`. */
export const AccordionContent: FunctionComponent<AccordionContentProps> = (
  props,
) => {
  const merged = [contentClass, props.class].filter(Boolean).join(" ");
  return <HeadlessAccordion.Content {...props} class={merged} />;
};

/**
 * Compound API: {@link AccordionRoot}, {@link AccordionTrigger}, {@link AccordionContent}.
 * Under `Root`, alternate `Trigger` and `Content` (each has an inner slot).
 * Because `AccordionRoot` renders a `<div>`, do not use `Accordion` inside `<p>` or `<pre>`.
 */
export const Accordion = {
  Root: AccordionRoot,
  Trigger: AccordionTrigger,
  Content: AccordionContent,
};

export type AccordionItemData = {
  value: string;
  title: string;
  content: string;
};

export interface AccordionProps {
  items: AccordionItemData[];
  /** When true, more than one panel can be open at a time. */
  multiple?: boolean;
}

/**
 * Shortcut over {@link Accordion}: items from an array as alternating Trigger / Content.
 */
export const AccordionList = component$<AccordionProps>((props) => {
  return (
    <AccordionRoot class="max-w-xl" multiple={props.multiple}>
      {props.items.flatMap((item) => [
        <AccordionTrigger key={`${item.value}-t`}>{item.title}</AccordionTrigger>,
        <AccordionContent key={`${item.value}-c`}>{item.content}</AccordionContent>,
      ])}
    </AccordionRoot>
  );
});
