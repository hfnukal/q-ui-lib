import { component$ } from "@builder.io/qwik";
import { LuFileText, LuFolder, LuImage } from "@qwikest/icons/lucide";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";
import { ItemList } from "~/components/ui/item-list";

const codeBasic = `import { ItemList } from "~/components/ui/item-list";

<ItemList>
  <li class="px-2 py-1.5 text-callout text-label">Položka 1</li>
  <li class="px-2 py-1.5 text-callout text-label">Položka 2</li>
  <li class="px-2 py-1.5 text-callout text-label">Položka 3</li>
</ItemList>`;

const codeWithItem = `import { ItemList } from "~/components/ui/item-list";
import { LuFileText, LuFolder, LuImage } from "@qwikest/icons/lucide";

<ItemList class="rounded-lg border border-separator-opaque bg-surface-raised">
  {[
    { icon: <LuFolder />, label: "Dokumenty" },
    { icon: <LuFileText />, label: "Soubor.pdf" },
    { icon: <LuImage />, label: "Fotka.png" },
  ].map((item) => (
    <li class="flex items-center gap-2 px-3 py-2 text-callout text-label hover:bg-surface-overlay">
      <span class="text-secondary-label">{item.icon}</span>
      {item.label}
    </li>
  ))}
</ItemList>`;

export default component$(() => (
  <div class="space-y-10">
    <div>
      <h1 class="text-title-2 text-label">ItemList</h1>
      <p class="mt-2 max-w-prose text-body text-secondary-label">
        Sloupec-kontejner{" "}
        <code class="rounded bg-fill-secondary px-1 py-0.5 text-caption-1 text-label">
          &lt;ul role="list"&gt;
        </code>{" "}
        pro seznam položek. Přímé potomky by měly být{" "}
        <code class="text-caption-1">&lt;li&gt;</code> prvky. Používá se jako
        základ pro menu, výsledky vyhledávání nebo select options.
      </p>
    </div>

    <section class="space-y-3">
      <h2 class="text-headline text-label">Základní použití</h2>

      <CodeExample>
        <Desc>Základní použití — viz ukázka níže.</Desc>
        <TabExample>
          <ItemList>
            <li class="px-2 py-1.5 text-callout text-label">Položka 1</li>
            <li class="px-2 py-1.5 text-callout text-label">Položka 2</li>
            <li class="px-2 py-1.5 text-callout text-label">Položka 3</li>
          </ItemList>
        </TabExample>
        <TabCode>{codeBasic}</TabCode>
      </CodeExample>
    </section>

    <section class="space-y-3">
      <h2 class="text-headline text-label">S ikonami</h2>

      <CodeExample>
        <Desc>S ikonami — viz ukázka níže.</Desc>
        <TabExample>
          <ItemList class="rounded-lg border border-separator-opaque bg-surface-raised">
            {[
              { icon: <LuFolder />, label: "Dokumenty" },
              { icon: <LuFileText />, label: "Soubor.pdf" },
              { icon: <LuImage />, label: "Fotka.png" },
            ].map((item) => (
              <li
                key={item.label}
                class="flex items-center gap-2 px-3 py-2 text-callout text-label hover:bg-surface-overlay"
              >
                <span class="text-secondary-label [&_svg]:size-4">
                  {item.icon}
                </span>
                {item.label}
              </li>
            ))}
          </ItemList>
        </TabExample>
        <TabCode>{codeWithItem}</TabCode>
      </CodeExample>
    </section>
  </div>
));
