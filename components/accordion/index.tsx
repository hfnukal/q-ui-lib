import { component$ } from "@builder.io/qwik";
import { Accordion } from "@qwik-ui/headless";

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
 * Accessible accordion built on {@link https://qwikui.com/docs/headless/accordion | @qwik-ui/headless}
 * with Tailwind styling.
 */
export const AccordionList = component$<AccordionProps>((props) => {
  return (
    <Accordion.Root
      class="w-full max-w-xl space-y-2"
      multiple={props.multiple}
    >
      {props.items.map((item) => (
        <Accordion.Item
          key={item.value}
          value={item.value}
          class="overflow-hidden rounded-lg border border-slate-200 bg-white shadow-sm"
        >
          <Accordion.Header class="flex">
            <Accordion.Trigger class="flex w-full items-center justify-between gap-2 px-4 py-3 text-left text-sm font-medium text-slate-800 transition-colors hover:bg-slate-50 focus:outline-none focus-visible:ring-2 focus-visible:ring-indigo-500 focus-visible:ring-offset-2 [&[data-open]>span.chevron]:rotate-180">
              <span>{item.title}</span>
              <span aria-hidden="true" class="chevron text-slate-400 transition-transform duration-200">
                ▼
              </span>
            </Accordion.Trigger>
          </Accordion.Header>
          <Accordion.Content class="border-t border-slate-100 px-4 py-3 text-sm text-slate-600">
            <p>{item.content}</p>
          </Accordion.Content>
        </Accordion.Item>
      ))}
    </Accordion.Root>
  );
});
