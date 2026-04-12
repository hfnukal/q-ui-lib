import { component$, useSignal } from "@builder.io/qwik";
import { Select } from "~/components/ui/select";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";

export const ItemAlignCompare = component$(() => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
    <Select.Item key={n} value={String(n)}>
      <Select.ItemLabel>{`Možnost ${n}`}</Select.ItemLabel>
    </Select.Item>
  ));
  return (
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
    </div>
  );
});

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
});

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Select</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Základní výběr</h2>
        <CodeExample>
          <Desc>Základní výběr — viz ukázka níže.</Desc>
          <TabExample>
            <Select.Root>
              <Select.Label>Téma</Select.Label>
              <Select.Trigger>
                <Select.DisplayValue placeholder="Vyberte možnost" />
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
            </Select.Root>
          </TabExample>
          <TabCode>{`import { Select } from "~/components/ui/select";

<Select.Root>
  <Select.Label>Téma</Select.Label>
  <Select.Trigger>
    <Select.DisplayValue placeholder="Vyberte možnost" />
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
</Select.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Align item with trigger vs popper</h2>
        <CodeExample>
          <Desc>Analogie k Radix/shadcn: <code class="text-caption-1">position="item-aligned"</code> po otevření posune panel tak, aby řádka s aktuální hodnotou (nebo zvýrazněnou položkou) měla stejnou výšku jako trigger; při jiné volbě se pozice znovu dopočítá. <code class="text-caption-1">position="popper"</code> to nevynucuje — chová se jako standardní plovoucí menu. Obě varianty mají počáteční hodnotu uprostřed seznamu (1–10).</Desc>
          <TabExample>
            <ItemAlignCompare />
          </TabExample>
          <TabCode>{`import { component$ } from "@builder.io/qwik";
import { Select } from "~/components/ui/select";

export const ItemAlignCompare = component$(() => {
  const items = [1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((n) => (
    <Select.Item key={n} value={String(n)}>
      <Select.ItemLabel>{\`Možnost \${n}\`}</Select.ItemLabel>
    </Select.Item>
  ));
  return (
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
    </div>
  );
});`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Zarovnání panelu (align)</h2>
        <CodeExample>
          <Desc>Prop <code class="text-caption-1">align</code> na <code class="text-caption-1">Select.Popover</code> : <code class="text-caption-1">start</code> (výchozí, odpovídá <code class="text-caption-1">bottom-start</code> ), <code class="text-caption-1">center</code> , <code class="text-caption-1">end</code> . Zde je u všech příkladů <code class="text-caption-1">position="popper"</code> , aby byl vidět jen horizontální rozdíl. Při vlastním <code class="text-caption-1">floating</code> s příponou <code class="text-caption-1">-start</code> / <code class="text-caption-1">-end</code> se <code class="text-caption-1">align</code> neaplikuje.</Desc>
          <TabExample>
            {(() => {
              // position="popper" vypne svislé dosednutí na vybranou položku — ukazuje čistě horizontální align.
              return (
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
                </div>
              );
            })()}
          </TabExample>
          <TabCode>{`import { Select } from "~/components/ui/select";

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
</div>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Skupiny</h2>
        <CodeExample>
          <Desc>Rozdělení položek pomocí <code class="text-caption-1">Select.Group</code> a <code class="text-caption-1">GroupLabel</code> (sekce v seznamu).</Desc>
          <TabExample>
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
            </Select.Root>
          </TabExample>
          <TabCode>{`import { Select } from "~/components/ui/select";

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
</Select.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Řízená hodnota (bind:value)</h2>
        <CodeExample>
          <Desc>Řízená hodnota (bind:value) — viz ukázka níže.</Desc>
          <TabExample>
            <Controlled />
          </TabExample>
          <TabCode>{`import { component$, useSignal } from "@builder.io/qwik";
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
});`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
