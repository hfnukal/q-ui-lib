import { component$, Slot, type JSXChildren } from "@builder.io/qwik";
import { Tab } from "~/components/ui/tabs";

export interface CodeExampleProps {
  /** Zobrazený zdrojový kód (např. JSX použití komponenty). */
  code: string;
  class?: string;
  /**
   * `tabs` — přepínač náhled / kód (neaktivní panel má `hidden`; nevhodné pro modaly/dialogy v náhledu).
   * `stack` — náhled vždy nad kódem, obojí v DOM viditelné rozloženě (dialogy v top layer sedí k viewportu).
   */
  layout?: "tabs" | "stack";
  /** Popisek karty s náhledem (výchozí: Example). */
  previewTabLabel?: string;
  /** Popisek karty se zdrojákem (výchozí: Code). */
  codeTabLabel?: string;
  /** Obsah záložky náhledu (vnořený obsah mezi značkami komponenty). */
  children?: JSXChildren;
}

/**
 * Rámeček s přepínačem náhled / zdrojový kód. Používá stejný stylovaný {@link Tab} jako stránka komponenty Tabs.
 */
export const CodeExample = component$<CodeExampleProps>((props) => {
  const previewLabel = props.previewTabLabel ?? "Example";
  const codeLabel = props.codeTabLabel ?? "Code";
  const layout = props.layout ?? "tabs";

  const boxClass = [
    "rounded-xl border border-separator-opaque bg-surface-overlay/40 p-4 shadow-sm ring-1 ring-black/5",
    props.class,
  ]
    .filter(Boolean)
    .join(" ");

  const codeBlock = (
    <pre class="max-h-[28rem] overflow-auto rounded-lg bg-slate-950 p-4 text-xs leading-relaxed text-slate-100">
      <code class="font-mono whitespace-pre">{props.code}</code>
    </pre>
  );

  if (layout === "stack") {
    return (
      <div class={boxClass}>
        <p class="mb-3 text-caption-1 font-medium text-secondary-label">{previewLabel}</p>
        <div class="min-w-0">
          <Slot />
        </div>
        <p class="mb-2 mt-6 text-caption-1 font-medium text-secondary-label">{codeLabel}</p>
        {codeBlock}
      </div>
    );
  }

  return (
    <div class={boxClass}>
      <Tab.Root class="w-full min-w-0" behavior="manual" selectedTabId="example">
        <Tab.List>
          <Tab.Tab key="example">{previewLabel}</Tab.Tab>
          <Tab.Tab key="code">{codeLabel}</Tab.Tab>
        </Tab.List>
        <Tab.Panel key="example">
          <div class="min-w-0">
            <Slot />
          </div>
        </Tab.Panel>
        <Tab.Panel key="code" class="!min-h-0 !p-0 border-0 bg-transparent shadow-none ring-0 focus-visible:ring-0">
          {codeBlock}
        </Tab.Panel>
      </Tab.Root>
    </div>
  );
});
