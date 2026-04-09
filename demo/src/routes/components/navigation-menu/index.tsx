import { component$ } from "@builder.io/qwik";
import { CodeExample } from "~/components/demo/codeexample";
import { NavigationMenu } from "~/components/ui/navigation-menu";

const codeBasic = `import { NavigationMenu } from "~/components/ui/navigation-menu";

<NavigationMenu.Root class="justify-start">
  <NavigationMenu.List>
    <NavigationMenu.Item value="produkty">
      <NavigationMenu.Trigger>Produkty</NavigationMenu.Trigger>
      <NavigationMenu.Content>
        <ul class="grid min-w-[200px] gap-1 p-1">
          <li>
            <a class="block rounded-md px-3 py-2 text-callout hover:bg-surface-overlay" href="#">
              Knihovna
            </a>
          </li>
          <li>
            <a class="block rounded-md px-3 py-2 text-callout hover:bg-surface-overlay" href="#">
              Šablony
            </a>
          </li>
        </ul>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
    <NavigationMenu.Item>
      <NavigationMenu.Link href="#">Ceník</NavigationMenu.Link>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu.Root>`;

const codeWithSeparator = `import { NavigationMenu } from "~/components/ui/navigation-menu";

<NavigationMenu.Root>
  <NavigationMenu.List>
    <NavigationMenu.Item value="dokumentace">
      <NavigationMenu.Trigger>Dokumentace</NavigationMenu.Trigger>
      <NavigationMenu.Content>
        <p class="px-2 py-1 text-caption-1 text-secondary-label">Začínáme</p>
        <a class="block rounded-md px-3 py-2 text-callout hover:bg-surface-overlay" href="#">
          Úvod
        </a>
      </NavigationMenu.Content>
    </NavigationMenu.Item>
    <NavigationMenu.Separator />
    <NavigationMenu.Item>
      <NavigationMenu.Link href="#">Blog</NavigationMenu.Link>
    </NavigationMenu.Item>
  </NavigationMenu.List>
</NavigationMenu.Root>`;

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Navigation menu</h1>
        <p class="mt-2 max-w-prose text-body text-secondary-label">
          Horizontální navigace s rozbalovacími panely ve stylu shadcn/ui. V{" "}
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1 text-label">
            @qwik-ui/headless
          </code>{" "}
          primitivum není — komponenta je v{" "}
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1 text-label">
            components/navigation-menu
          </code>
          , styly podle COLORS.md (jako Dropdown menu). Zavření: Escape, klik mimo.
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Základní složení</h2>
        <p class="text-callout text-secondary-label">
          <code class="text-caption-1">Item value</code> je potřeba u dvojice{" "}
          <code class="text-caption-1">Trigger</code> + <code class="text-caption-1">Content</code>.
          Přímé odkazy použij <code class="text-caption-1">Link</code>.
        </p>
        <CodeExample code={codeBasic}>
          <div class="rounded-lg border border-separator-opaque/40 bg-surface-raised p-4">
            <NavigationMenu.Root class="justify-start">
              <NavigationMenu.List>
                <NavigationMenu.Item value="produkty">
                  <NavigationMenu.Trigger>Produkty</NavigationMenu.Trigger>
                  <NavigationMenu.Content>
                    <ul class="m-0 grid min-w-[200px] list-none gap-0 p-0">
                      <li>
                        <a
                          class="block rounded-md px-3 py-2 text-callout text-label no-underline hover:bg-surface-overlay"
                          href="#nav-demo"
                        >
                          Knihovna
                        </a>
                      </li>
                      <li>
                        <a
                          class="block rounded-md px-3 py-2 text-callout text-label no-underline hover:bg-surface-overlay"
                          href="#nav-demo"
                        >
                          Šablony
                        </a>
                      </li>
                    </ul>
                  </NavigationMenu.Content>
                </NavigationMenu.Item>
                <NavigationMenu.Item>
                  <NavigationMenu.Link href="#nav-demo">Ceník</NavigationMenu.Link>
                </NavigationMenu.Item>
              </NavigationMenu.List>
            </NavigationMenu.Root>
          </div>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Oddělovač v liště</h2>
        <CodeExample code={codeWithSeparator}>
          <div class="rounded-lg border border-separator-opaque/40 bg-surface-raised p-4">
            <NavigationMenu.Root class="justify-start">
              <NavigationMenu.List>
                <NavigationMenu.Item value="dokumentace">
                  <NavigationMenu.Trigger>Dokumentace</NavigationMenu.Trigger>
                  <NavigationMenu.Content>
                    <p class="px-2 py-1 text-caption-1 text-secondary-label">Začínáme</p>
                    <a
                      class="block rounded-md px-3 py-2 text-callout text-label no-underline hover:bg-surface-overlay"
                      href="#nav-demo"
                    >
                      Úvod
                    </a>
                  </NavigationMenu.Content>
                </NavigationMenu.Item>
                <NavigationMenu.Separator />
                <NavigationMenu.Item>
                  <NavigationMenu.Link href="#nav-demo">Blog</NavigationMenu.Link>
                </NavigationMenu.Item>
              </NavigationMenu.List>
            </NavigationMenu.Root>
          </div>
        </CodeExample>
      </section>
    </div>
  );
});
