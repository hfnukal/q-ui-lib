import { component$ } from "@builder.io/qwik";
import { ItemList } from "~/components/ui/item-list";
import { LuFileText, LuFolder, LuImage } from "@qwikest/icons/lucide";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">ItemList</h1>
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
          <TabCode>{`import { ItemList } from "~/components/ui/item-list";

<ItemList>
  <li class="px-2 py-1.5 text-callout text-label">Položka 1</li>
  <li class="px-2 py-1.5 text-callout text-label">Položka 2</li>
  <li class="px-2 py-1.5 text-callout text-label">Položka 3</li>
</ItemList>`}</TabCode>
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
                <li class="flex items-center gap-2 px-3 py-2 text-callout text-label hover:bg-surface-overlay">
                  <span class="text-secondary-label">{item.icon}</span>
                  {item.label}
                </li>
              ))}
            </ItemList>
          </TabExample>
          <TabCode>{`import { ItemList } from "~/components/ui/item-list";
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
</ItemList>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
