import {
  component$,
  Slot,
  type FunctionComponent,
  type JSXChildren,
} from "@builder.io/qwik";
import { CodeEdit, type CodeEditLanguage } from "../../base/code-edit";
import { Tab } from "../../base/tabs";

/** Popis nad zalozkami. */
export const Desc: FunctionComponent<{ children?: JSXChildren }> = (props) => (
  <p q:slot="desc" class="text-callout text-secondary-label">
    {props.children}
  </p>
);

/** Zalozka s nahledem. */
export const TabExample: FunctionComponent<{ children?: JSXChildren }> = (props) => (
  <div q:slot="example" style="display:contents">
    {props.children}
  </div>
);

/** Zalozka se zdrojakem. */
export const TabCode: FunctionComponent<{
  children?: string;
  language?: CodeEditLanguage;
}> = (props) => {
  const code = typeof props.children === "string" ? props.children : "";
  const rows = Math.min(Math.max(4, code.split("\n").length + 1), 28);
  return (
    <div q:slot="code">
      <CodeEdit readOnly value={code} language={props.language ?? "tsx"} rows={rows} />
    </div>
  );
};

export interface CodeExampleProps {
  class?: string;
}

export const CodeExample = component$<CodeExampleProps>((props) => {
  const wrapperClass = [
    "rounded-xl border border-separator-opaque shadow-sm ring-1 ring-black/5",
    props.class,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div class={wrapperClass}>
      <div class="px-4 pt-4 pb-0 [&:not(:has(*))]:hidden">
        <Slot name="desc" />
      </div>
      <div class="p-4">
        <Tab.Root behavior="manual" selectedTabId="example" class="!max-w-none">
          <Tab.List>
            <Tab.Tab key="example">Example</Tab.Tab>
            <Tab.Tab key="code">Code</Tab.Tab>
          </Tab.List>
          <Tab.Panel key="example">
            <Slot name="example" />
          </Tab.Panel>
          <Tab.Panel key="code" class="!mt-0 !p-0 border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0">
            <Slot name="code" />
          </Tab.Panel>
        </Tab.Root>
      </div>
    </div>
  );
});
