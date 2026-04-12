import { component$ } from "@builder.io/qwik";
import { Avatar } from "~/components/ui/avatar";
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
        <h1 class="text-title-2 text-label">Avatar</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Obrázek + fallback</h2>
        <CodeExample>
          <Desc>Obrázek + fallback — viz ukázka níže.</Desc>
          <TabExample>
            <Avatar.Root>
              <Avatar.Image src="…" alt="Náhled" />
              <Avatar.Fallback>QU</Avatar.Fallback>
            </Avatar.Root>
          </TabExample>
          <TabCode>{`import { Avatar } from "~/components/ui/avatar";

<Avatar.Root>
  <Avatar.Image src="…" alt="Náhled" />
  <Avatar.Fallback>QU</Avatar.Fallback>
</Avatar.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Velikosti</h2>
        <CodeExample>
          <Desc>Prop <code class="text-caption-1">size</code> na <code class="text-caption-1">Avatar.Root</code>: <code class="text-caption-1">sm</code>, <code class="text-caption-1">md</code> (výchozí), <code class="text-caption-1">lg</code>.</Desc>
          <TabExample>
            <div class="flex items-center gap-3">
              <Avatar.Root size="sm">
                <Avatar.Image src="…" alt="" />
                <Avatar.Fallback>S</Avatar.Fallback>
              </Avatar.Root>
              <Avatar.Root size="md">
                <Avatar.Image src="…" alt="" />
                <Avatar.Fallback>M</Avatar.Fallback>
              </Avatar.Root>
              <Avatar.Root size="lg">
                <Avatar.Image src="…" alt="" />
                <Avatar.Fallback>L</Avatar.Fallback>
              </Avatar.Root>
            </div>
          </TabExample>
          <TabCode>{`import { Avatar } from "~/components/ui/avatar";

<div class="flex items-center gap-3">
  <Avatar.Root size="sm">
    <Avatar.Image src="…" alt="" />
    <Avatar.Fallback>S</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Root size="md">
    <Avatar.Image src="…" alt="" />
    <Avatar.Fallback>M</Avatar.Fallback>
  </Avatar.Root>
  <Avatar.Root size="lg">
    <Avatar.Image src="…" alt="" />
    <Avatar.Fallback>L</Avatar.Fallback>
  </Avatar.Root>
</div>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Jen fallback</h2>
        <CodeExample>
          <Desc>Bez <code class="text-caption-1">Avatar.Image</code> nebo bez <code class="text-caption-1">src</code> zůstane iniciála / placeholder.</Desc>
          <TabExample>
            <Avatar.Root>
              <Avatar.Fallback>AB</Avatar.Fallback>
            </Avatar.Root>
          </TabExample>
          <TabCode>{`import { Avatar } from "~/components/ui/avatar";

<Avatar.Root>
  <Avatar.Fallback>AB</Avatar.Fallback>
</Avatar.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Chyba načtení obrázku</h2>
        <CodeExample>
          <Desc>Neplatná URL zobrazí znovu <code class="text-caption-1">Avatar.Fallback</code>.</Desc>
          <TabExample>
            <Avatar.Root>
              <Avatar.Image src="https://example.invalid/does-not-exist.jpg" alt="" />
              <Avatar.Fallback>!</Avatar.Fallback>
            </Avatar.Root>
          </TabExample>
          <TabCode>{`import { Avatar } from "~/components/ui/avatar";

<Avatar.Root>
  <Avatar.Image src="https://example.invalid/does-not-exist.jpg" alt="" />
  <Avatar.Fallback>!</Avatar.Fallback>
</Avatar.Root>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
