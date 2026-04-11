import { component$, useSignal } from "@builder.io/qwik";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";
import { Select } from "~/components/ui/select";

const chevron = (
  <span class="text-secondary-label" aria-hidden="true">
    <svg
      class="h-4 w-4 shrink-0 opacity-50"
      fill="none"
      stroke="currentColor"
      viewBox="0 0 24 24"
    >
      <path
        stroke-linecap="round"
        stroke-linejoin="round"
        stroke-width="2"
        d="M19 9l-7 7-7-7"
      />
    </svg>
  </span>
);

const codeBasic = `import { Select } from "~/components/ui/select";

<Select.Root>
  <Select.Label>Téma</Select.Label>
  <Select.Trigger>
    <Select.DisplayValue placeholder="Vyberte možnost" />
    {/* šipka */}
  </Select.Trigger>
  <Select.Popover>
    <Select.Item value="light">
      <Select.ItemLabel>Světlý</Select.ItemLabel>
      <Select.ItemIndicator>✓</Select.ItemIndicator>
    </Select.Item>
    <Select.Item value="dark">
      <Select.ItemLabel>Tmavý</Select.ItemLabel>
      <Select.ItemIndicator>✓</Select.ItemIndicator>
    </Select.Item>
  </Select.Popover>
</Select.Root>`;

const codeGroups = `import { Select } from "~/components/ui/select";

<Select.Root>
  <Select.Trigger>
    <Select.DisplayValue placeholder="Framework…" />
  </Select.Trigger>
  <Select.Popover>
    <Select.Group>
      <Select.GroupLabel>Populární</Select.GroupLabel>
      <Select.Item value="qwik">
        <Select.ItemLabel>Qwik</Select.ItemLabel>
      </Select.Item>
    </Select.Group>
    <Select.Group>
      <Select.GroupLabel>Ostatní</Select.GroupLabel>
      <Select.Item value="other">
        <Select.ItemLabel>Jiné</Select.ItemLabel>
      </Select.Item>
    </Select.Group>
  </Select.Popover>
</Select.Root>`;

const codeControlled = `import { component$, useSignal } from "@builder.io/qwik";
import { Select } from "~/components/ui/select";

export const Controlled = component$(() => {
  const value = useSignal("banana");

  return (
    <>
      <Select.Root bind:value={value}>
        <Select.Trigger>
          <Select.DisplayValue placeholder="Ovoce" />
        </Select.Trigger>
        <Select.Popover>
          <Select.Item value="apple">
            <Select.ItemLabel>Jablko</Select.ItemLabel>
          </Select.Item>
          <Select.Item value="banana">
            <Select.ItemLabel>Banán</Select.ItemLabel>
          </Select.Item>
        </Select.Popover>
      </Select.Root>
      <p class="mt-2 text-caption-1 text-secondary-label">Hodnota: {value.value}</p>
    </>
  );
});`;

const codeAlign = `import { Select } from "~/components/ui/select";

// position="popper" vypne svislé dosednutí na vybranou položku — ukazuje čistě horizontální align.
<div class="flex flex-wrap gap-8">
  <div class="w-56 space-y-1">
    <p class="text-caption-1 text-secondary-label">align="start" (výchozí)</p>
    <Select.Root class="!max-w-none w-full">
      <Select.Trigger>
        <Select.DisplayValue placeholder="Start" />
      </Select.Trigger>
      <Select.Popover position="popper" align="start">
        <Select.Item value="a"><Select.ItemLabel>Ant</Select.ItemLabel></Select.Item>
        <Select.Item value="b"><Select.ItemLabel>Bó</Select.ItemLabel></Select.Item>
      </Select.Popover>
    </Select.Root>
  </div>
  <div class="w-56 space-y-1">
    <p class="text-caption-1 text-secondary-label">align="center"</p>
    <Select.Root class="!max-w-none w-full">
      <Select.Trigger>
        <Select.DisplayValue placeholder="Střed" />
      </Select.Trigger>
      <Select.Popover position="popper" align="center">
        <Select.Item value="a"><Select.ItemLabel>Ant</Select.ItemLabel></Select.Item>
        <Select.Item value="b"><Select.ItemLabel>Bó</Select.ItemLabel></Select.Item>
      </Select.Popover>
    </Select.Root>
  </div>
  <div class="w-56 space-y-1">
    <p class="text-caption-1 text-secondary-label">align="end"</p>
    <Select.Root class="!max-w-none w-full">
      <Select.Trigger>
        <Select.DisplayValue placeholder="Konec" />
      </Select.Trigger>
      <Select.Popover position="popper" align="end">
        <Select.Item value="a"><Select.ItemLabel>Ant</Select.ItemLabel></Select.Item>
        <Select.Item value="b"><Select.ItemLabel>Bó</Select.ItemLabel></Select.Item>
      </Select.Popover>
    </Select.Root>
  </div>
</div>`;

const codePosition = `import { Select } from "~/components/ui/select";

// Stejné položky a počáteční hodnota uprostřed — porovnej otevření:
// position="item-aligned" (výchozí): vybraná řádka sedí na triggeru, při změně výběru se panel posune.
// position="popper": panel zůstane „pod“ triggerem jako u čistého Floating UI.

const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
  <Select.Item key={n} value={String(n)}>
    <Select.ItemLabel>{\`Možnost \${n}\`}</Select.ItemLabel>
  </Select.Item>
));

<div class="flex flex-wrap gap-10">
  <div class="w-56 space-y-1">
    <p class="text-caption-1 text-secondary-label">item-aligned (výchozí)</p>
    <Select.Root class="!max-w-none w-full" value="6">
      <Select.Trigger>
        <Select.DisplayValue placeholder="Vyberte" />
      </Select.Trigger>
      <Select.Popover position="item-aligned">{items}</Select.Popover>
    </Select.Root>
  </div>
  <div class="w-56 space-y-1">
    <p class="text-caption-1 text-secondary-label">popper</p>
    <Select.Root class="!max-w-none w-full" value="6">
      <Select.Trigger>
        <Select.DisplayValue placeholder="Vyberte" />
      </Select.Trigger>
      <Select.Popover position="popper">{items}</Select.Popover>
    </Select.Root>
  </div>
</div>`;

export default component$(() => {
  const fruit = useSignal("banana");

  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-2xl font-semibold text-slate-900">Select</h1>
        <p class="mt-2 max-w-prose text-sm text-slate-600">
          Vlastní (ne nativní) rozbalovací výběr nad{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
            @qwik-ui/headless
          </code>{" "}
          Select — stejný compound vzor jako u Dropdown menu (tokeny z
          COLORS.md).{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
            Select.Popover
          </code>{" "}
          má{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
            position=&quot;item-aligned&quot;
          </code>{" "}
          (výchozí; vybraná položka na úrovni triggeru) nebo{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
            position=&quot;popper&quot;
          </code>{" "}
          (čistý Floating UI). Horizontální{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">align</code>{" "}
          je v další sekci.
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">Základní výběr</h2>

        <CodeExample>
          <Desc>Základní výběr — viz ukázka níže.</Desc>
          <TabExample>
            <Select.Root>
              <Select.Label>Téma</Select.Label>
              <Select.Trigger>
                <Select.DisplayValue placeholder="Vyberte možnost" />
                {chevron}
              </Select.Trigger>
              <Select.Popover>
                <Select.Item value="light">
                  <Select.ItemLabel>Světlý</Select.ItemLabel>
                  <Select.ItemIndicator>
                    <span aria-hidden="true">✓</span>
                  </Select.ItemIndicator>
                </Select.Item>
                <Select.Item value="dark">
                  <Select.ItemLabel>Tmavý</Select.ItemLabel>
                  <Select.ItemIndicator>
                    <span aria-hidden="true">✓</span>
                  </Select.ItemIndicator>
                </Select.Item>
                <Select.Item value="system" disabled>
                  <Select.ItemLabel>Systém (neaktivní)</Select.ItemLabel>
                </Select.Item>
              </Select.Popover>
            </Select.Root>
          </TabExample>
          <TabCode>{codeBasic}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">
          Align item with trigger vs popper
        </h2>

        <CodeExample>
          <Desc>
            Analogie k Radix/shadcn:{" "}
            <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
              position=&quot;item-aligned&quot;
            </code>{" "}
            po otevření posune panel tak, aby řádka s aktuální hodnotou (nebo
            zvýrazněnou položkou) měla stejnou výšku jako trigger; při jiné
            volbě se pozice znovu dopočítá.{" "}
            <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
              position=&quot;popper&quot;
            </code>{" "}
            to nevynucuje — chová se jako standardní plovoucí menu. Obě varianty
            mají počáteční hodnotu uprostřed seznamu (1–10).
          </Desc>
          <TabExample>
            <div class="flex flex-wrap gap-10">
              <div class="w-56 space-y-1">
                <p class="text-caption-1 font-medium text-secondary-label">
                  item-aligned (výchozí)
                </p>
                <Select.Root class="!max-w-none w-full" value="6">
                  <Select.Trigger>
                    <Select.DisplayValue placeholder="Vyberte" />
                    {chevron}
                  </Select.Trigger>
                  <Select.Popover position="item-aligned">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <Select.Item key={n} value={String(n)}>
                        <Select.ItemLabel>{`Možnost ${n}`}</Select.ItemLabel>
                      </Select.Item>
                    ))}
                  </Select.Popover>
                </Select.Root>
              </div>
              <div class="w-56 space-y-1">
                <p class="text-caption-1 font-medium text-secondary-label">
                  popper
                </p>
                <Select.Root class="!max-w-none w-full" value="6">
                  <Select.Trigger>
                    <Select.DisplayValue placeholder="Vyberte" />
                    {chevron}
                  </Select.Trigger>
                  <Select.Popover position="popper">
                    {[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
                      <Select.Item key={n} value={String(n)}>
                        <Select.ItemLabel>{`Možnost ${n}`}</Select.ItemLabel>
                      </Select.Item>
                    ))}
                  </Select.Popover>
                </Select.Root>
              </div>
            </div>
          </TabExample>
          <TabCode>{codePosition}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">
          Zarovnání panelu (align)
        </h2>

        <CodeExample>
          <Desc>
            Prop{" "}
            <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
              align
            </code>{" "}
            na{" "}
            <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
              Select.Popover
            </code>
            :{" "}
            <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
              start
            </code>{" "}
            (výchozí, odpovídá{" "}
            <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
              bottom-start
            </code>
            ),{" "}
            <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
              center
            </code>
            ,{" "}
            <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">end</code>
            . Zde je u všech příkladů{" "}
            <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
              position=&quot;popper&quot;
            </code>
            , aby byl vidět jen horizontální rozdíl. Při vlastním{" "}
            <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
              floating
            </code>{" "}
            s příponou{" "}
            <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
              -start
            </code>{" "}
            /{" "}
            <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
              -end
            </code>{" "}
            se{" "}
            <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
              align
            </code>{" "}
            neaplikuje.
          </Desc>
          <TabExample>
            <div class="flex flex-wrap gap-8">
              <div class="w-56 space-y-1">
                <p class="text-caption-1 font-medium text-secondary-label">
                  align=&quot;start&quot; (výchozí)
                </p>
                <Select.Root class="!max-w-none w-full">
                  <Select.Trigger>
                    <Select.DisplayValue placeholder="Start" />
                    {chevron}
                  </Select.Trigger>
                  <Select.Popover position="popper" align="start">
                    <Select.Item value="a-start">
                      <Select.ItemLabel>Ant</Select.ItemLabel>
                    </Select.Item>
                    <Select.Item value="b-start">
                      <Select.ItemLabel>Bó</Select.ItemLabel>
                    </Select.Item>
                  </Select.Popover>
                </Select.Root>
              </div>
              <div class="w-56 space-y-1">
                <p class="text-caption-1 font-medium text-secondary-label">
                  align=&quot;center&quot;
                </p>
                <Select.Root class="!max-w-none w-full">
                  <Select.Trigger>
                    <Select.DisplayValue placeholder="Střed" />
                    {chevron}
                  </Select.Trigger>
                  <Select.Popover position="popper" align="center">
                    <Select.Item value="a-center">
                      <Select.ItemLabel>Ant</Select.ItemLabel>
                    </Select.Item>
                    <Select.Item value="b-center">
                      <Select.ItemLabel>Bó</Select.ItemLabel>
                    </Select.Item>
                  </Select.Popover>
                </Select.Root>
              </div>
              <div class="w-56 space-y-1">
                <p class="text-caption-1 font-medium text-secondary-label">
                  align=&quot;end&quot;
                </p>
                <Select.Root class="!max-w-none w-full">
                  <Select.Trigger>
                    <Select.DisplayValue placeholder="Konec" />
                    {chevron}
                  </Select.Trigger>
                  <Select.Popover position="popper" align="end">
                    <Select.Item value="a-end">
                      <Select.ItemLabel>Ant</Select.ItemLabel>
                    </Select.Item>
                    <Select.Item value="b-end">
                      <Select.ItemLabel>Bó</Select.ItemLabel>
                    </Select.Item>
                  </Select.Popover>
                </Select.Root>
              </div>
            </div>
          </TabExample>
          <TabCode>{codeAlign}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">Skupiny</h2>

        <CodeExample>
          <Desc>
            Rozdělení položek pomocí{" "}
            <code class="text-caption-1">Select.Group</code> a{" "}
            <code class="text-caption-1">GroupLabel</code> (sekce v seznamu).
          </Desc>
          <TabExample>
            <Select.Root>
              <Select.Label>Framework</Select.Label>
              <Select.Trigger>
                <Select.DisplayValue placeholder="Vyberte…" />
                {chevron}
              </Select.Trigger>
              <Select.Popover>
                <Select.Group>
                  <Select.GroupLabel>Populární</Select.GroupLabel>
                  <Select.Item value="qwik">
                    <Select.ItemLabel>Qwik</Select.ItemLabel>
                  </Select.Item>
                </Select.Group>
                <Select.Group>
                  <Select.GroupLabel>Ostatní</Select.GroupLabel>
                  <Select.Item value="other">
                    <Select.ItemLabel>Jiné</Select.ItemLabel>
                  </Select.Item>
                </Select.Group>
              </Select.Popover>
            </Select.Root>
          </TabExample>
          <TabCode>{codeGroups}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">
          Řízená hodnota (bind:value)
        </h2>

        <CodeExample>
          <Desc>Řízená hodnota (bind:value) — viz ukázka níže.</Desc>
          <TabExample>
            <div>
              <Select.Root bind:value={fruit}>
                <Select.Trigger>
                  <Select.DisplayValue placeholder="Ovoce" />
                  {chevron}
                </Select.Trigger>
                <Select.Popover>
                  <Select.Item value="apple">
                    <Select.ItemLabel>Jablko</Select.ItemLabel>
                  </Select.Item>
                  <Select.Item value="banana">
                    <Select.ItemLabel>Banán</Select.ItemLabel>
                  </Select.Item>
                  <Select.Item value="citrus">
                    <Select.ItemLabel>Citrus</Select.ItemLabel>
                  </Select.Item>
                </Select.Popover>
              </Select.Root>
              <p class="mt-2 text-caption-1 text-secondary-label">
                Aktuální hodnota:{" "}
                <span class="font-medium text-label">{fruit.value}</span>
              </p>
            </div>
          </TabExample>
          <TabCode>{codeControlled}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-lg font-medium text-slate-800">
          Popis a nativní pole pro formulář
        </h2>
        <p class="max-w-prose text-sm text-slate-600">
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
            Select.Description
          </code>{" "}
          doplňuje{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
            aria-describedby
          </code>
          . S{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">name</code>{" "}
          na kořeni vložte{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
            Select.HiddenNativeSelect
          </code>{" "}
          — vznikne skrytý{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
            &lt;select&gt;
          </code>{" "}
          pro submit. Pro chyby validace použijte{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
            Select.ErrorMessage
          </code>{" "}
          (headless pak označí trigger atributem{" "}
          <code class="rounded bg-slate-200/80 px-1 py-0.5 text-xs">
            data-invalid
          </code>
          ).
        </p>
        <div class="max-w-xs rounded-lg border border-slate-200 bg-white p-4 shadow-sm">
          <Select.Root name="demo-priority" required value="low">
            <Select.Label>Priorita</Select.Label>
            <Select.Description>Zvolte prioritu ticketu.</Select.Description>
            <Select.Trigger>
              <Select.DisplayValue placeholder="Vyberte prioritu" />
              {chevron}
            </Select.Trigger>
            <Select.HiddenNativeSelect />
            <Select.Popover>
              <Select.Item value="low">
                <Select.ItemLabel>Nízká</Select.ItemLabel>
              </Select.Item>
              <Select.Item value="high">
                <Select.ItemLabel>Vysoká</Select.ItemLabel>
              </Select.Item>
            </Select.Popover>
          </Select.Root>
        </div>
      </section>
    </div>
  );
});
