/**
 * @component accordion
 * @title Accordion
 * @version 1.0.1
 */

import {
  component$,
  type FunctionComponent,
  type PropsOf,
} from "@builder.io/qwik";
import type { JSXNode } from "@builder.io/qwik/jsx-runtime";
import { Accordion as HeadlessAccordion } from "@qwik-ui/headless";

const itemFrameClass =
  "overflow-hidden rounded-lg border border-separator-opaque bg-surface-raised shadow-sm";

const headerClass = "flex";

const triggerClass =
  "flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-callout font-medium text-label transition-colors hover:bg-surface-overlay focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background after:ml-auto after:inline-block after:text-tertiary-label after:transition-transform after:duration-200 after:content-['▼'] [&[data-open]]:after:rotate-180";

const contentClass =
  "border-t border-separator px-4 py-3 text-callout text-secondary-label";

const rootClass = "w-full max-w-xl space-y-2";

export type AccordionRootProps = PropsOf<typeof HeadlessAccordion.Root>;

export type AccordionTriggerProps = PropsOf<typeof HeadlessAccordion.Trigger>;

export type AccordionContentProps = PropsOf<typeof HeadlessAccordion.Content>;

function flattenChildren(children: unknown): JSXNode[] {
  if (children == null || children === false) return [];
  if (Array.isArray(children)) return children.flatMap(flattenChildren);
  return [children as JSXNode];
}

/**
 * Kořen accordionu. Přímé děti musí být střídavě {@link AccordionTrigger} a {@link AccordionContent}
 * (Trigger, Content, Trigger, Content, …). Každá dvojice se zabalí do headless `Item` + `Header`.
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

/** Trigger panelu — výchozí obsah přes headless `<Slot />` (šipka je `::after`, headless Trigger nepřidává další uzly). */
export const AccordionTrigger: FunctionComponent<AccordionTriggerProps> = (
  props,
) => {
  const merged = [triggerClass, props.class].filter(Boolean).join(" ");
  return <HeadlessAccordion.Trigger {...props} class={merged} />;
};

/** Obsah panelu — výchozí obsah přes headless `<Slot />`. */
export const AccordionContent: FunctionComponent<AccordionContentProps> = (
  props,
) => {
  const merged = [contentClass, props.class].filter(Boolean).join(" ");
  return <HeadlessAccordion.Content {...props} class={merged} />;
};

/**
 * Složené API: {@link AccordionRoot}, {@link AccordionTrigger}, {@link AccordionContent}.
 * Pod `Root` střídavě `Trigger` a `Content` (každý má vnitřní slot).
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
 * Zkratka nad {@link Accordion}: položky z pole jako střídavé Trigger / Content.
 */
export const AccordionList = component$<AccordionProps>((props) => {
  return (
    <AccordionRoot multiple={props.multiple}>
      {props.items.flatMap((item) => [
        <AccordionTrigger key={`${item.value}-t`}>{item.title}</AccordionTrigger>,
        <AccordionContent key={`${item.value}-c`}>{item.content}</AccordionContent>,
      ])}
    </AccordionRoot>
  );
});
