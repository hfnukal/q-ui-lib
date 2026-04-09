import { component$ } from "@builder.io/qwik";
import { CodeExample } from "~/components/demo/codeexample";
import { Sidebar } from "~/components/ui/sidebar";

const menuIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="18"
    height="18"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <line x1="4" x2="20" y1="12" y2="12" />
    <line x1="4" x2="20" y1="6" y2="6" />
    <line x1="4" x2="20" y1="18" y2="18" />
  </svg>
);

const codeLayout = `import { Sidebar } from "~/components/ui/sidebar";

<Sidebar.Provider class="min-h-[28rem] overflow-hidden rounded-xl border border-separator-opaque">
  <Sidebar.Root>
    <Sidebar.Rail />
    <Sidebar.Header>…</Sidebar.Header>
    <Sidebar.Content>
      <Sidebar.Group>
        <Sidebar.GroupLabel>Menu</Sidebar.GroupLabel>
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton active>Ikona + Přehled</Sidebar.MenuButton>
            </Sidebar.MenuItem>
          </Sidebar.Menu>
        </Sidebar.GroupContent>
      </Sidebar.Group>
    </Sidebar.Content>
  </Sidebar.Root>
  <Sidebar.Inset>
    <header class="flex items-center gap-2 border-b p-3">
      <Sidebar.Trigger aria-label="Panel">☰</Sidebar.Trigger>
      <span class="text-callout font-medium text-label">Hlavní obsah</span>
    </header>
    <div class="p-4 text-body text-secondary-label">…</div>
  </Sidebar.Inset>
</Sidebar.Provider>`;

const shellClass =
  "min-h-[28rem] overflow-hidden rounded-xl border border-separator-opaque bg-grouped-background shadow-sm";

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Sidebar</h1>
        <p class="mt-2 max-w-prose text-body text-secondary-label">
          Layout postranní navigace (inspirace shadcn/ui) — bez modulu v{" "}
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1 text-label">@qwik-ui/headless</code>{" "}
          (viz{" "}
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1 text-label">SHADCN.md</code>
          ). Styly používají tokeny z{" "}
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1 text-label">COLORS.md</code>.
          Na úzkém viewportu je panel drawerem s překryvem; od{" "}
          <code class="text-caption-1">md</code> jde o flex vedle{" "}
          <code class="text-caption-1">Sidebar.Inset</code>.{" "}
          <code class="text-caption-1">Sidebar.Trigger</code> na mobilu otevírá/zavírá drawer, na desktopu přepíná
          ikonový režim.
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Základní skladba</h2>
        <p class="text-callout text-secondary-label">
          <code class="text-caption-1">Provider</code> → <code class="text-caption-1">Root</code> (panel) +{" "}
          <code class="text-caption-1">Inset</code> (hlavní plocha). Volitelně <code class="text-caption-1">Rail</code>{" "}
          pro rozbalení ze sbaleného stavu.
        </p>
        <CodeExample code={codeLayout} layout="tabs" previewTabLabel="Ukázka" codeTabLabel="Kód">
          <Sidebar.Provider class={shellClass}>
            <Sidebar.Root>
              <Sidebar.Rail />
              <Sidebar.Header>
                <p class="truncate text-headline font-semibold text-label">Aplikace</p>
              </Sidebar.Header>
              <Sidebar.Content>
                <Sidebar.Group>
                  <Sidebar.GroupLabel>Menu</Sidebar.GroupLabel>
                  <Sidebar.GroupContent>
                    <Sidebar.Menu>
                      <Sidebar.MenuItem>
                        <Sidebar.MenuButton active>
                          {menuIcon}
                          <span class="truncate md:inline">Přehled</span>
                        </Sidebar.MenuButton>
                      </Sidebar.MenuItem>
                      <Sidebar.MenuItem>
                        <Sidebar.MenuButton>
                          {menuIcon}
                          <span class="truncate md:inline">Projekty</span>
                        </Sidebar.MenuButton>
                      </Sidebar.MenuItem>
                      <Sidebar.MenuItem>
                        <Sidebar.MenuButton variant="outline">
                          {menuIcon}
                          <span class="truncate md:inline">Nastavení</span>
                        </Sidebar.MenuButton>
                      </Sidebar.MenuItem>
                    </Sidebar.Menu>
                  </Sidebar.GroupContent>
                </Sidebar.Group>
                <Sidebar.Separator />
                <Sidebar.Group>
                  <Sidebar.GroupLabel>Další</Sidebar.GroupLabel>
                  <Sidebar.GroupContent>
                    <Sidebar.Menu>
                      <Sidebar.MenuItem>
                        <Sidebar.MenuButton>
                          {menuIcon}
                          <span class="truncate md:inline">Nápověda</span>
                        </Sidebar.MenuButton>
                      </Sidebar.MenuItem>
                    </Sidebar.Menu>
                  </Sidebar.GroupContent>
                </Sidebar.Group>
              </Sidebar.Content>
              <Sidebar.Footer>
                <p class="truncate text-caption-1 text-secondary-label">Knihovna q-ui-lib</p>
              </Sidebar.Footer>
            </Sidebar.Root>
            <Sidebar.Inset>
              <header class="flex items-center gap-2 border-b border-separator-opaque bg-background p-3">
                <Sidebar.Trigger>{menuIcon}</Sidebar.Trigger>
                <span class="text-callout font-medium text-label">Hlavní obsah</span>
              </header>
              <div class="p-4 text-body text-secondary-label">
                Oblast vedle postranního panelu. Zuž okno pod 768px a použij trigger v záhlaví — panel vyjede zleva přes
                překryv.
              </div>
            </Sidebar.Inset>
          </Sidebar.Provider>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Výchozí sbalený stav</h2>
        <p class="text-callout text-secondary-label">
          Prop <code class="text-caption-1">defaultCollapsed</code> na <code class="text-caption-1">Provider</code> —
          užitečné pro úzké panely s ikonami; popisky v <code class="text-caption-1">GroupLabel</code> jsou na desktopu
          ve sbaleném režimu skryté (<code class="text-caption-1">sr-only</code>).
        </p>
        <div class={shellClass}>
        <CodeExample code={codeLayout} layout="tabs" previewTabLabel="Ukázka" codeTabLabel="Kód">
          <Sidebar.Provider class="h-full min-h-[20rem]" defaultCollapsed>
            <Sidebar.Root>
              <Sidebar.Rail />
              <Sidebar.Header>
                <p class="truncate text-center text-caption-1 font-semibold text-label md:px-0">App</p>
              </Sidebar.Header>
              <Sidebar.Content>
                <Sidebar.Group>
                  <Sidebar.GroupLabel>Zkratky</Sidebar.GroupLabel>
                  <Sidebar.GroupContent>
                    <Sidebar.Menu>
                      <Sidebar.MenuItem>
                        <Sidebar.MenuButton active>{menuIcon}</Sidebar.MenuButton>
                      </Sidebar.MenuItem>
                      <Sidebar.MenuItem>
                        <Sidebar.MenuButton>{menuIcon}</Sidebar.MenuButton>
                      </Sidebar.MenuItem>
                    </Sidebar.Menu>
                  </Sidebar.GroupContent>
                </Sidebar.Group>
              </Sidebar.Content>
            </Sidebar.Root>
            <Sidebar.Inset>
              <div class="flex items-center gap-2 border-b border-separator-opaque p-3">
                <Sidebar.Trigger>{menuIcon}</Sidebar.Trigger>
                <span class="text-callout text-label">Rozbalit panel — trigger nebo rail</span>
              </div>
              <p class="p-4 text-body text-secondary-label">Panel začíná v režimu jen ikon (šířka ~3,5rem na md+).</p>
            </Sidebar.Inset>
          </Sidebar.Provider>
          </CodeExample>
        </div>
      </section>
    </div>
  );
});
