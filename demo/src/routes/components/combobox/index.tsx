import { $, component$, useSignal } from "@builder.io/qwik";
import {
  Combobox,
  comboboxMultiselectControlClass,
  comboboxMultiselectInputClass,
} from "~/components/ui/combobox";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";

export const Controlled = component$(() => {
  const value = useSignal("praha");

  return (
    <>
      <Combobox.Root bind:value={value} filter placeholder="Město…">
        <Combobox.Label>Město</Combobox.Label>
        <Combobox.Control>
          <Combobox.Input />
          <Combobox.Trigger>▼</Combobox.Trigger>
        </Combobox.Control>
        <Combobox.Popover>
          <Combobox.Item value="praha">
            <Combobox.ItemLabel>Praha</Combobox.ItemLabel>
          </Combobox.Item>
          <Combobox.Item value="brno">
            <Combobox.ItemLabel>Brno</Combobox.ItemLabel>
          </Combobox.Item>
          <Combobox.Empty>Nic nenalezeno.</Combobox.Empty>
        </Combobox.Popover>
      </Combobox.Root>
      <p class="mt-2 text-caption-1 text-secondary-label">Hodnota: {value.value}</p>
    </>
  );
});

const LANGS = [
  { value: "ts", label: "TypeScript" },
  { value: "rust", label: "Rust" },
  { value: "go", label: "Go" },
];

export const Multi = component$(() => {
  const selected = useSignal<string[]>(["ts", "rust"]);
  const filterText = useSignal("");
  const open = useSignal(false);
  const remove$ = $((v: string) => {
    selected.value = selected.value.filter((x) => x !== v);
  });

  return (
    <Combobox.Root
      multiple
      bind:value={selected}
      bind:open={open}
      filter
      placeholder="Přidej jazyk…"
      onChange$={$(() => {
        filterText.value = "";
      })}
    >
      <Combobox.Label>Jazyky</Combobox.Label>
      <Combobox.Control class={comboboxMultiselectControlClass}>
        {selected.value.map((v) => (
          <Combobox.Chip key={v} value={v} onRemove$={remove$}>
            {LANGS.find((l) => l.value === v)?.label ?? v}
          </Combobox.Chip>
        ))}
        <Combobox.Input
          bind:value={filterText}
          class={comboboxMultiselectInputClass}
          onFocus$={$(() => {
            open.value = true;
          })}
        />
      </Combobox.Control>
      <Combobox.Popover>
        {LANGS.map(({ value, label }) => (
          <Combobox.Item key={value} value={value}>
            <Combobox.ItemLabel>{label}</Combobox.ItemLabel>
            <Combobox.ItemIndicator>
              <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20 6L9 17l-5-5" />
              </svg>
            </Combobox.ItemIndicator>
          </Combobox.Item>
        ))}
        <Combobox.Empty>Žádný jazyk.</Combobox.Empty>
      </Combobox.Popover>
    </Combobox.Root>
  );
});

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Combobox</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Filtrování a prázdný stav</h2>
        <CodeExample>
          <Desc>Headless ve výchozím stavu zapíná <code class="text-caption-1">filter</code> — při psaní se schovávají nevyhovující položky. S <code class="text-caption-1">Combobox.Empty</code> zobrazíš hlášku, když nic nezůstane.</Desc>
          <TabExample>
            <Combobox.Root filter placeholder="Hledej framework…">
              <Combobox.Label>Framework</Combobox.Label>
              <Combobox.Control>
                <Combobox.Input />
                <Combobox.Trigger>▼</Combobox.Trigger>
              </Combobox.Control>
              <Combobox.Popover>
                <Combobox.Item value="qwik">
                  <Combobox.ItemLabel>Qwik</Combobox.ItemLabel>
                </Combobox.Item>
                <Combobox.Item value="react">
                  <Combobox.ItemLabel>React</Combobox.ItemLabel>
                </Combobox.Item>
                <Combobox.Empty>Žádná shoda.</Combobox.Empty>
              </Combobox.Popover>
            </Combobox.Root>
          </TabExample>
          <TabCode>{`import { Combobox } from "~/components/ui/combobox";

<Combobox.Root filter placeholder="Hledej framework…">
  <Combobox.Label>Framework</Combobox.Label>
  <Combobox.Control>
    <Combobox.Input />
    <Combobox.Trigger>▼</Combobox.Trigger>
  </Combobox.Control>
  <Combobox.Popover>
    <Combobox.Item value="qwik">
      <Combobox.ItemLabel>Qwik</Combobox.ItemLabel>
    </Combobox.Item>
    <Combobox.Item value="react">
      <Combobox.ItemLabel>React</Combobox.ItemLabel>
    </Combobox.Item>
    <Combobox.Empty>Žádná shoda.</Combobox.Empty>
  </Combobox.Popover>
</Combobox.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Řízená hodnota (bind:value)</h2>
        <CodeExample>
          <Desc>Vybraná hodnota v signálu přes <code class="text-caption-1">bind:value</code> (řízený combobox).</Desc>
          <TabExample>
            <Controlled />
          </TabExample>
          <TabCode>{`import { component$, useSignal } from "@builder.io/qwik";
import { Combobox } from "~/components/ui/combobox";

export const Controlled = component$(() => {
  const value = useSignal("praha");

  return (
    <>
      <Combobox.Root bind:value={value} filter placeholder="Město…">
        <Combobox.Label>Město</Combobox.Label>
        <Combobox.Control>
          <Combobox.Input />
          <Combobox.Trigger>▼</Combobox.Trigger>
        </Combobox.Control>
        <Combobox.Popover>
          <Combobox.Item value="praha">
            <Combobox.ItemLabel>Praha</Combobox.ItemLabel>
          </Combobox.Item>
          <Combobox.Item value="brno">
            <Combobox.ItemLabel>Brno</Combobox.ItemLabel>
          </Combobox.Item>
          <Combobox.Empty>Nic nenalezeno.</Combobox.Empty>
        </Combobox.Popover>
      </Combobox.Root>
      <p class="mt-2 text-caption-1 text-secondary-label">Hodnota: {value.value}</p>
    </>
  );
});`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Vícenásobný výběr a chipy</h2>
        <CodeExample>
          <Desc>S <code class="text-caption-1">multiple</code> a <code class="text-caption-1">bind:value</code> jako <code class="text-caption-1">string[]</code> (bez jednorázového <code class="text-caption-1">value</code> na kořeni — headless to v multi režimu nepovoluje). Vybrané položky vykresli jako <code class="text-caption-1">Combobox.Chip</code> s <code class="text-caption-1">onRemove ; odfiltrováním z pole se synchronizuje stav. Na </code>Combobox.Control<code class="text-caption-1"> použij </code>comboboxMultiselectControlClass<code class="text-caption-1"> a na vstup </code>comboboxMultiselectInputClass<code class="text-caption-1"> . Bez </code>Combobox.Trigger<code class="text-caption-1"> (žádná šipka): seznam otevři při fokusu vstupu přes </code>bind:open<code class="text-caption-1"> a </code>onFocus . Text ve vstupu drž v samostatném signálu přes <code class="text-caption-1">Combobox.Input bind:value</code> (výchozí prázdný řetězec) — headless by jinak při <code class="text-caption-1">multiple</code> vyplnil vstup názvy vybraných položek; výběr zůstává jen na chipích. Po změně výběru vyčisti filtr v <code class="text-caption-1">onChange na kořeni. V seznamu označ vybrané řádky přes </code>Combobox.ItemIndicator` (headless je zobrazí jen u vybraných položek).</Desc>
          <TabExample>
            <Multi />
          </TabExample>
          <TabCode>{`import { $, component$, useSignal } from "@builder.io/qwik";
import {
  Combobox,
  comboboxMultiselectControlClass,
  comboboxMultiselectInputClass,
} from "~/components/ui/combobox";

const LANGS = [
  { value: "ts", label: "TypeScript" },
  { value: "rust", label: "Rust" },
  { value: "go", label: "Go" },
];

export const Multi = component$(() => {
  const selected = useSignal<string[]>(["ts", "rust"]);
  const filterText = useSignal("");
  const open = useSignal(false);
  const remove$ = $((v: string) => {
    selected.value = selected.value.filter((x) => x !== v);
  });

  return (
    <Combobox.Root
      multiple
      bind:value={selected}
      bind:open={open}
      filter
      placeholder="Přidej jazyk…"
      onChange$={$(() => {
        filterText.value = "";
      })}
    >
      <Combobox.Label>Jazyky</Combobox.Label>
      <Combobox.Control class={comboboxMultiselectControlClass}>
        {selected.value.map((v) => (
          <Combobox.Chip key={v} value={v} onRemove$={remove$}>
            {LANGS.find((l) => l.value === v)?.label ?? v}
          </Combobox.Chip>
        ))}
        <Combobox.Input
          bind:value={filterText}
          class={comboboxMultiselectInputClass}
          onFocus$={$(() => {
            open.value = true;
          })}
        />
      </Combobox.Control>
      <Combobox.Popover>
        {LANGS.map(({ value, label }) => (
          <Combobox.Item key={value} value={value}>
            <Combobox.ItemLabel>{label}</Combobox.ItemLabel>
            <Combobox.ItemIndicator>
              <svg class="h-3.5 w-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                <path stroke-linecap="round" stroke-linejoin="round" d="M20 6L9 17l-5-5" />
              </svg>
            </Combobox.ItemIndicator>
          </Combobox.Item>
        ))}
        <Combobox.Empty>Žádný jazyk.</Combobox.Empty>
      </Combobox.Popover>
    </Combobox.Root>
  );
});`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">showOnFocus — otevření při fokusu</h2>
        <CodeExample>
          <Desc>Prop <code class="text-caption-1">showOnFocus</code> na <code class="text-caption-1">Combobox.Input</code> otevře seznam automaticky při fokusu bez nutnosti psát.</Desc>
          <TabExample>
            <Combobox.Root filter placeholder="Vyber nebo piš…">
              <Combobox.Label>Výběr</Combobox.Label>
              <Combobox.Control>
                <Combobox.Input showOnFocus />
                <Combobox.Trigger>▼</Combobox.Trigger>
              </Combobox.Control>
              <Combobox.Popover>
                <Combobox.Item value="qwik">
                  <Combobox.ItemLabel>Qwik</Combobox.ItemLabel>
                </Combobox.Item>
                <Combobox.Item value="react">
                  <Combobox.ItemLabel>React</Combobox.ItemLabel>
                </Combobox.Item>
                <Combobox.Item value="vue">
                  <Combobox.ItemLabel>Vue</Combobox.ItemLabel>
                </Combobox.Item>
                <Combobox.Empty>Žádná shoda.</Combobox.Empty>
              </Combobox.Popover>
            </Combobox.Root>
          </TabExample>
          <TabCode>{`import { Combobox } from "~/components/ui/combobox";

<Combobox.Root filter placeholder="Vyber nebo piš…">
  <Combobox.Label>Výběr</Combobox.Label>
  <Combobox.Control>
    <Combobox.Input showOnFocus />
    <Combobox.Trigger>▼</Combobox.Trigger>
  </Combobox.Control>
  <Combobox.Popover>
    <Combobox.Item value="qwik">
      <Combobox.ItemLabel>Qwik</Combobox.ItemLabel>
    </Combobox.Item>
    <Combobox.Item value="react">
      <Combobox.ItemLabel>React</Combobox.ItemLabel>
    </Combobox.Item>
    <Combobox.Item value="vue">
      <Combobox.ItemLabel>Vue</Combobox.ItemLabel>
    </Combobox.Item>
    <Combobox.Empty>Žádná shoda.</Combobox.Empty>
  </Combobox.Popover>
</Combobox.Root>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
