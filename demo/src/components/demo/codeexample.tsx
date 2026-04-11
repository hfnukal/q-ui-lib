import {
  component$,
  Slot,
  type FunctionComponent,
  type JSXChildren,
} from "@builder.io/qwik";
import { CodeEdit, type CodeEditLanguage } from "~/components/ui/code-edit";
import { Tab } from "~/components/ui/tabs";

// ─── Slot wrappers ────────────────────────────────────────────────────────────
// FunctionComponent = inline expand → props.children místo <Slot />.
// q:slot na root elementu → Qwik to promítne do příslušného <Slot name="..."> v CodeExample.

/** Popis nad záložkami. */
export const Desc: FunctionComponent<{ children?: JSXChildren }> = (props) => (
  <p q:slot="desc" class="text-callout text-secondary-label">
    {props.children}
  </p>
);

/** Záložka s živým náhledem — `display:contents` aby wrapper div neovlivnil layout. */
export const TabExample: FunctionComponent<{ children?: JSXChildren }> = (props) => (
  <div q:slot="example" style="display:contents">
    {props.children}
  </div>
);

/** Záložka se zdrojákem. Předej kód jako children (template literal). */
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

// ─── CodeExample ──────────────────────────────────────────────────────────────

export interface CodeExampleProps {
  class?: string;
}

/**
 * Rámeček s popisem a záložkami Example / Code.
 *
 * ```tsx
 * <CodeExample>
 *   <Desc>Popis komponenty</Desc>
 *   <TabExample>
 *     <Button>Tlačítko</Button>
 *   </TabExample>
 *   <TabCode>{`<Button>Tlačítko</Button>`}</TabCode>
 * </CodeExample>
 * ```
 */
export const CodeExample = component$<CodeExampleProps>((props) => {
  const wrapperClass = [
    "rounded-xl border border-separator-opaque shadow-sm ring-1 ring-black/5",
    props.class,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div class={wrapperClass}>
      {/* Desc — skryje se pokud je prázdný (CSS :has) */}
      <div class="px-4 pt-4 pb-0 [&:not(:has(*))]:hidden">
        <Slot name="desc" />
      </div>

      {/* Tabs */}
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
