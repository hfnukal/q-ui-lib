import { $, component$, useSignal } from "@builder.io/qwik";
import { CodeExample } from "~/components/demo/codeexample";
import {
  Combobox,
  comboboxMultiselectControlClass,
  comboboxMultiselectInputClass,
} from "~/components/ui/combobox";

const chevron = (
  <span class="text-secondary-label" aria-hidden="true">
    <svg class="h-4 w-4 shrink-0 opacity-50" fill="none" stroke="currentColor" viewBox="0 0 24 24">
      <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M19 9l-7 7-7-7" />
    </svg>
  </span>
);

const codeBasic = `import { Combobox } from "~/components/ui/combobox";

<Combobox.Root filter placeholder="Hledej framework…">
  <Combobox.Label>Framework</Combobox.Label>
  <Combobox.Control>
    <Combobox.Input />
    <Combobox.Trigger>{/* šipka */}</Combobox.Trigger>
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
</Combobox.Root>`;

const codeControlled = `import { component$, useSignal } from "@builder.io/qwik";
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
});`;

const codeAlign = `import { Combobox } from "~/components/ui/combobox";

<div class="flex flex-wrap gap-8">
  <Combobox.Root class="!max-w-none w-56" filter placeholder="Start…">
    <Combobox.Control>
      <Combobox.Input />
      <Combobox.Trigger />
    </Combobox.Control>
    <Combobox.Popover align="start">
      <Combobox.Item value="a"><Combobox.ItemLabel>Ant</Combobox.ItemLabel></Combobox.Item>
    </Combobox.Popover>
  </Combobox.Root>
  <Combobox.Root class="!max-w-none w-56" filter placeholder="Střed…">
    <Combobox.Control>
      <Combobox.Input />
      <Combobox.Trigger />
    </Combobox.Control>
    <Combobox.Popover align="center">…</Combobox.Popover>
  </Combobox.Root>
</div>`;

const codeMultiselect = `import { $, component$, useSignal } from "@builder.io/qwik";
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
});`;

const checkIcon = (
  <svg
    class="h-3.5 w-3.5 shrink-0"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    aria-hidden="true"
  >
    <path stroke-linecap="round" stroke-linejoin="round" d="M20 6L9 17l-5-5" />
  </svg>
);

const LANG_OPTIONS = [
  { value: "ts", label: "TypeScript" },
  { value: "rust", label: "Rust" },
  { value: "go", label: "Go" },
  { value: "python", label: "Python" },
  { value: "zig", label: "Zig" },
] as const;

export default component$(() => {
  const city = useSignal("praha");
  const langs = useSignal<string[]>(["ts", "rust"]);
  const langsFilter = useSignal("");
  const langsOpen = useSignal(false);
  const removeLang$ = $((v: string) => {
    langs.value = langs.value.filter((x) => x !== v);
  });

  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Combobox</h1>
        <p class="mt-2 max-w-prose text-sm text-slate-600">
          Kombinované pole (vyhledávání + výběr) nad{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">@qwik-ui/headless</code> Combobox — stejné
          tokeny jako Select (COLORS.md). Výchozí režim je <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">popover</code>
          ; struktura odpovídá shadcn Combobox (<code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">Control</code> = vstup + tlačítko,
          seznam v <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">Popover</code>).
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">Filtrování a prázdný stav</h2>
        <p class="max-w-prose text-sm text-slate-600">
          Headless ve výchozím stavu zapíná <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">filter</code> — při psaní se
          schovávají nevyhovující položky. S <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">Combobox.Empty</code> zobrazíš
          hlášku, když nic nezůstane.
        </p>
        <CodeExample code={codeBasic} previewTabLabel="Ukázka" codeTabLabel="Kód">
          <Combobox.Root class="w-full max-w-md" filter placeholder="Hledej framework…">
            <Combobox.Label>Framework</Combobox.Label>
            <Combobox.Control>
              <Combobox.Input />
              <Combobox.Trigger>{chevron}</Combobox.Trigger>
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
              <Combobox.Item value="svelte">
                <Combobox.ItemLabel>Svelte</Combobox.ItemLabel>
              </Combobox.Item>
              <Combobox.Empty>Žádný framework neodpovídá.</Combobox.Empty>
            </Combobox.Popover>
          </Combobox.Root>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">Řízená hodnota (bind:value)</h2>
        <CodeExample code={codeControlled} previewTabLabel="Ukázka" codeTabLabel="Kód">
          <div>
            <Combobox.Root class="w-full max-w-md" bind:value={city}
              filter
              placeholder="Město…"
            >
              <Combobox.Label>Město</Combobox.Label>
              <Combobox.Control>
                <Combobox.Input />
                <Combobox.Trigger>{chevron}</Combobox.Trigger>
              </Combobox.Control>
              <Combobox.Popover>
                <Combobox.Item value="praha">
                  <Combobox.ItemLabel>Praha</Combobox.ItemLabel>
                  <Combobox.ItemIndicator>
                    <span aria-hidden="true">✓</span>
                  </Combobox.ItemIndicator>
                </Combobox.Item>
                <Combobox.Item value="brno">
                  <Combobox.ItemLabel>Brno</Combobox.ItemLabel>
                  <Combobox.ItemIndicator>
                    <span aria-hidden="true">✓</span>
                  </Combobox.ItemIndicator>
                </Combobox.Item>
                <Combobox.Item value="ostrava">
                  <Combobox.ItemLabel>Ostrava</Combobox.ItemLabel>
                  <Combobox.ItemIndicator>
                    <span aria-hidden="true">✓</span>
                  </Combobox.ItemIndicator>
                </Combobox.Item>
                <Combobox.Empty>Žádné město v seznamu.</Combobox.Empty>
              </Combobox.Popover>
            </Combobox.Root>
            <p class="mt-2 text-caption-1 text-secondary-label">
              Aktuální hodnota: <span class="font-medium text-label">{city.value}</span>
            </p>
          </div>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">Vícenásobný výběr a chipy</h2>
        <p class="max-w-prose text-sm text-slate-600">
          S <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">multiple</code> a{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">bind:value</code> jako{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">string[]</code> (bez jednorázového{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">value</code> na kořeni — headless to v multi režimu
          nepovoluje). Vybrané položky vykresli jako <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">Combobox.Chip</code> s{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">onRemove$</code>; odfiltrováním z pole se synchronizuje stav.
          Na <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">Combobox.Control</code> použij{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">comboboxMultiselectControlClass</code> a na vstup{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">comboboxMultiselectInputClass</code>. Bez{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">Combobox.Trigger</code> (žádná šipka): seznam otevři při fokusu vstupu přes{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">bind:open</code> a{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">onFocus$</code>. Text ve vstupu drž v samostatném signálu přes{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">Combobox.Input bind:value</code> (výchozí prázdný řetězec) — headless by jinak při{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">multiple</code> vyplnil vstup názvy vybraných položek; výběr zůstává jen na chipích. Po změně výběru
          vyčisti filtr v <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">onChange$</code> na kořeni. V seznamu označ vybrané řádky přes{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">Combobox.ItemIndicator</code> (headless je zobrazí jen u vybraných položek).
        </p>
        <CodeExample code={codeMultiselect} previewTabLabel="Ukázka" codeTabLabel="Kód">
          <div>
            <Combobox.Root
              class="w-full max-w-md"
              multiple
              bind:value={langs}
              bind:open={langsOpen}
              filter
              placeholder="Přidej nebo vyhledej jazyk…"
              onChange$={$(() => {
                langsFilter.value = "";
              })}
            >
              <Combobox.Label>Programovací jazyky</Combobox.Label>
              <Combobox.Control class={comboboxMultiselectControlClass}>
                {langs.value.map((v) => (
                  <Combobox.Chip key={v} value={v} onRemove$={removeLang$}>
                    {LANG_OPTIONS.find((l) => l.value === v)?.label ?? v}
                  </Combobox.Chip>
                ))}
                <Combobox.Input
                  bind:value={langsFilter}
                  class={comboboxMultiselectInputClass}
                  onFocus$={$(() => {
                    langsOpen.value = true;
                  })}
                />
              </Combobox.Control>
              <Combobox.Popover>
                {LANG_OPTIONS.map(({ value, label }) => (
                  <Combobox.Item key={value} value={value}>
                    <Combobox.ItemLabel>{label}</Combobox.ItemLabel>
                    <Combobox.ItemIndicator>{checkIcon}</Combobox.ItemIndicator>
                  </Combobox.Item>
                ))}
                <Combobox.Empty>Žádný jazyk v seznamu.</Combobox.Empty>
              </Combobox.Popover>
            </Combobox.Root>
            <p class="mt-2 text-caption-1 text-secondary-label">
              Hodnoty:{" "}
              <span class="font-medium text-label">
                {langs.value.length ? langs.value.join(", ") : "—"}
              </span>
            </p>
          </div>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">Zarovnání panelu (align)</h2>
        <p class="max-w-prose text-sm text-slate-600">
          Prop <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">align</code> na{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">Combobox.Popover</code> mapuje na Floating UI umístění
          (<code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">bottom-start</code> / <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">bottom</code> /{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">bottom-end</code>), stejně jako u Select.Popover.
        </p>
        <CodeExample code={codeAlign} previewTabLabel="Ukázka" codeTabLabel="Kód">
          <div class="flex flex-wrap gap-8">
            <div class="w-56 space-y-1">
              <p class="text-caption-1 font-medium text-secondary-label">align=&quot;start&quot; (výchozí)</p>
              <Combobox.Root class="!max-w-none w-full" filter placeholder="Start…">
                <Combobox.Control>
                  <Combobox.Input />
                  <Combobox.Trigger>{chevron}</Combobox.Trigger>
                </Combobox.Control>
                <Combobox.Popover align="start">
                  <Combobox.Item value="a-s">
                    <Combobox.ItemLabel>Ant</Combobox.ItemLabel>
                  </Combobox.Item>
                  <Combobox.Item value="b-s">
                    <Combobox.ItemLabel>Bó</Combobox.ItemLabel>
                  </Combobox.Item>
                </Combobox.Popover>
              </Combobox.Root>
            </div>
            <div class="w-56 space-y-1">
              <p class="text-caption-1 font-medium text-secondary-label">align=&quot;center&quot;</p>
              <Combobox.Root class="!max-w-none w-full" filter placeholder="Střed…">
                <Combobox.Control>
                  <Combobox.Input />
                  <Combobox.Trigger>{chevron}</Combobox.Trigger>
                </Combobox.Control>
                <Combobox.Popover align="center">
                  <Combobox.Item value="a-c">
                    <Combobox.ItemLabel>Ant</Combobox.ItemLabel>
                  </Combobox.Item>
                  <Combobox.Item value="b-c">
                    <Combobox.ItemLabel>Bó</Combobox.ItemLabel>
                  </Combobox.Item>
                </Combobox.Popover>
              </Combobox.Root>
            </div>
            <div class="w-56 space-y-1">
              <p class="text-caption-1 font-medium text-secondary-label">align=&quot;end&quot;</p>
              <Combobox.Root class="!max-w-none w-full" filter placeholder="Konec…">
                <Combobox.Control>
                  <Combobox.Input />
                  <Combobox.Trigger>{chevron}</Combobox.Trigger>
                </Combobox.Control>
                <Combobox.Popover align="end">
                  <Combobox.Item value="a-e">
                    <Combobox.ItemLabel>Ant</Combobox.ItemLabel>
                  </Combobox.Item>
                  <Combobox.Item value="b-e">
                    <Combobox.ItemLabel>Bó</Combobox.ItemLabel>
                  </Combobox.Item>
                </Combobox.Popover>
              </Combobox.Root>
            </div>
          </div>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">Skupiny a formulář</h2>
        <p class="max-w-prose text-sm text-slate-600">
          Pro odeslání formuláře použij <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">name</code> na kořeni a{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">Combobox.HiddenNativeSelect</code>. Popis a chyby:{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">Description</code> /{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">ErrorMessage</code>.
        </p>
        <div class="max-w-md rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <Combobox.Root name="demo-lang" required value="cs" filter={false} placeholder="Jazyk…">
            <Combobox.Label>Jazyk rozhraní</Combobox.Label>
            <Combobox.Description>Vyberte výchozí jazyk (filtrování vypnuto).</Combobox.Description>
            <Combobox.Control>
              <Combobox.Input />
              <Combobox.Trigger>{chevron}</Combobox.Trigger>
            </Combobox.Control>
            <Combobox.HiddenNativeSelect />
            <Combobox.Popover>
              <Combobox.Group>
                <Combobox.GroupLabel>Evropa</Combobox.GroupLabel>
                <Combobox.Item value="cs">
                  <Combobox.ItemLabel>Čeština</Combobox.ItemLabel>
                </Combobox.Item>
                <Combobox.Item value="sk">
                  <Combobox.ItemLabel>Slovenština</Combobox.ItemLabel>
                </Combobox.Item>
              </Combobox.Group>
              <Combobox.Group>
                <Combobox.GroupLabel>Ostatní</Combobox.GroupLabel>
                <Combobox.Item value="en">
                  <Combobox.ItemLabel>English</Combobox.ItemLabel>
                </Combobox.Item>
              </Combobox.Group>
            </Combobox.Popover>
          </Combobox.Root>
        </div>
      </section>
    </div>
  );
});
