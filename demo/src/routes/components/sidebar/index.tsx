import { component$ } from "@builder.io/qwik";
import { Sidebar } from "~/components/ui/sidebar";
import { DropdownMenu } from "~/components/ui/dropdown-menu";
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
        <h1 class="text-title-2 text-label">Sidebar</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Základní skladba</h2>
        <CodeExample>
          <Desc><code class="text-caption-1">Provider</code> → <code class="text-caption-1">Root</code> (panel) + <code class="text-caption-1">Inset</code> (hlavní plocha). <code class="text-caption-1">Rail</code> je úzký klikací pruh na vnitřním kraji panelu (desktop) — zobrazí se ve sbaleném stavu a rozbalí panel; v příkladu je <code class="text-caption-1">defaultCollapsed</code>, aby byl <code class="text-caption-1">Rail</code> vidět. Ikony v <code class="text-caption-1">MenuIcon</code>: jednotný obal <code class="text-caption-1">h-8 w-8</code> + SVG <code class="text-caption-1">h-5 w-5</code>. V záhlaví <code class="text-caption-1">Sidebar.HeaderTitle</code> schová „Aplikace“ při sbalení (<code class="text-caption-1">md:sr-only</code>); <code class="text-caption-1">Sidebar.Header</code> při sbalení vycentruje řádek (<code class="text-caption-1">md:justify-center</code>).</Desc>
          <TabExample>
            <Sidebar.Provider defaultCollapsed class="min-h-[28rem] overflow-hidden rounded-xl border border-separator-opaque">
              <Sidebar.Root>
                <Sidebar.Rail />
                <Sidebar.Header class="flex flex-row items-center gap-2 border-b p-3">
                  <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-fill-accent/20 text-label">
                    <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <rect x="3" y="3" width="7" height="7" rx="1.5" />
                      <rect x="14" y="3" width="7" height="7" rx="1.5" />
                      <rect x="3" y="14" width="7" height="7" rx="1.5" />
                      <rect x="14" y="14" width="7" height="7" rx="1.5" />
                    </svg>
                  </span>
                  <Sidebar.HeaderTitle>Aplikace</Sidebar.HeaderTitle>
                </Sidebar.Header>
                <Sidebar.Content>
                  <Sidebar.Group>
                    <Sidebar.GroupLabel>Menu</Sidebar.GroupLabel>
                    <Sidebar.GroupContent>
                      <Sidebar.Menu>
                        <Sidebar.MenuItem>
                          <Sidebar.MenuButton active>
                            <Sidebar.MenuIcon>
                              <span class="flex h-8 w-8 shrink-0 items-center justify-center text-label [&_svg]:h-5 [&_svg]:w-5">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                  <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                                  <path d="M9 22V12h6v10" />
                                </svg>
                              </span>
                            </Sidebar.MenuIcon>
                            <Sidebar.MenuLabel>Přehled</Sidebar.MenuLabel>
                          </Sidebar.MenuButton>
                        </Sidebar.MenuItem>
                        <Sidebar.MenuItem>
                          <Sidebar.MenuButton>
                            <Sidebar.MenuIcon>
                              <span class="flex h-8 w-8 shrink-0 items-center justify-center text-label [&_svg]:h-5 [&_svg]:w-5">
                                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                                  <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                                </svg>
                              </span>
                            </Sidebar.MenuIcon>
                            <Sidebar.MenuLabel>Projekty</Sidebar.MenuLabel>
                          </Sidebar.MenuButton>
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
                <div class="p-4 text-body text-secondary-label">
                  Klik na <code class="rounded bg-fill-secondary/40 px-1 py-0.5 text-caption-1">Rail</code> u pravého okraje sbaleného panelu nebo na trigger rozbalí navigaci.
                </div>
              </Sidebar.Inset>
            </Sidebar.Provider>
          </TabExample>
          <TabCode>{`import { Sidebar } from "~/components/ui/sidebar";

<Sidebar.Provider defaultCollapsed class="min-h-[28rem] overflow-hidden rounded-xl border border-separator-opaque">
  <Sidebar.Root>
    <Sidebar.Rail />
    <Sidebar.Header class="flex flex-row items-center gap-2 border-b p-3">
      <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-fill-accent/20 text-label">
        <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      </span>
      <Sidebar.HeaderTitle>Aplikace</Sidebar.HeaderTitle>
    </Sidebar.Header>
    <Sidebar.Content>
      <Sidebar.Group>
        <Sidebar.GroupLabel>Menu</Sidebar.GroupLabel>
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton active>
                <Sidebar.MenuIcon>
                  <span class="flex h-8 w-8 shrink-0 items-center justify-center text-label [&_svg]:h-5 [&_svg]:w-5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
                      <path d="M9 22V12h6v10" />
                    </svg>
                  </span>
                </Sidebar.MenuIcon>
                <Sidebar.MenuLabel>Přehled</Sidebar.MenuLabel>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                <Sidebar.MenuIcon>
                  <span class="flex h-8 w-8 shrink-0 items-center justify-center text-label [&_svg]:h-5 [&_svg]:w-5">
                    <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="M22 19a2 2 0 0 1-2 2H4a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h5l2 3h9a2 2 0 0 1 2 2z" />
                    </svg>
                  </span>
                </Sidebar.MenuIcon>
                <Sidebar.MenuLabel>Projekty</Sidebar.MenuLabel>
              </Sidebar.MenuButton>
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
    <div class="p-4 text-body text-secondary-label">
      Klik na <code class="rounded bg-fill-secondary/40 px-1 py-0.5 text-caption-1">Rail</code> u pravého okraje sbaleného panelu nebo na trigger rozbalí navigaci.
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Výchozí sbalený stav</h2>
        <CodeExample>
          <Desc>Prop <code class="text-caption-1">defaultCollapsed</code> na <code class="text-caption-1">Provider</code> — užitečné pro úzké panely s ikonami; popisky v <code class="text-caption-1">GroupLabel</code> jsou na desktopu ve sbaleném režimu skryté ( <code class="text-caption-1">sr-only</code>).</Desc>
          <TabExample>
            <Sidebar.Provider defaultCollapsed class="min-h-[28rem] overflow-hidden rounded-xl border border-separator-opaque">
              <Sidebar.Root>
                <Sidebar.Rail />
                <Sidebar.Header class="flex flex-row items-center gap-2 border-b p-3">
                  <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-fill-accent/20 text-label">
                    <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                      <rect x="3" y="3" width="7" height="7" rx="1.5" />
                      <rect x="14" y="3" width="7" height="7" rx="1.5" />
                      <rect x="3" y="14" width="7" height="7" rx="1.5" />
                      <rect x="14" y="14" width="7" height="7" rx="1.5" />
                    </svg>
                  </span>
                  <Sidebar.HeaderTitle>Aplikace</Sidebar.HeaderTitle>
                </Sidebar.Header>
                <Sidebar.Content>
                  <Sidebar.Group>
                    <Sidebar.GroupLabel>Menu</Sidebar.GroupLabel>
                    <Sidebar.GroupContent>
                      <Sidebar.Menu>
                        <Sidebar.MenuItem>
                          <Sidebar.MenuButton active>
                            <Sidebar.MenuIcon>
                              <span class="text-base leading-none">◉</span>
                            </Sidebar.MenuIcon>
                            <Sidebar.MenuLabel>Přehled</Sidebar.MenuLabel>
                          </Sidebar.MenuButton>
                        </Sidebar.MenuItem>
                        <Sidebar.MenuItem>
                          <Sidebar.MenuButton>
                            <Sidebar.MenuIcon>
                              <span class="text-base leading-none">◇</span>
                            </Sidebar.MenuIcon>
                            <Sidebar.MenuLabel>Projekty</Sidebar.MenuLabel>
                          </Sidebar.MenuButton>
                        </Sidebar.MenuItem>
                        <Sidebar.MenuItem>
                          <Sidebar.MenuButton>
                            <Sidebar.MenuIcon>
                              <span class="text-base leading-none">▤</span>
                            </Sidebar.MenuIcon>
                            <Sidebar.MenuLabel>Dokumenty</Sidebar.MenuLabel>
                          </Sidebar.MenuButton>
                        </Sidebar.MenuItem>
                        <Sidebar.MenuItem>
                          <Sidebar.MenuButton>
                            <Sidebar.MenuIcon>
                              <span class="text-base leading-none">⚙</span>
                            </Sidebar.MenuIcon>
                            <Sidebar.MenuLabel>Nastavení</Sidebar.MenuLabel>
                          </Sidebar.MenuButton>
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
                <div class="p-4 text-body text-secondary-label">
                  Ve sbaleném režimu zůstávají vidět ikony; nápisy položek a skupiny jsou pro čtečky (`sr-only`), po rozbalení se zobrazí vedle ikon.
                </div>
              </Sidebar.Inset>
            </Sidebar.Provider>
          </TabExample>
          <TabCode>{`import { Sidebar } from "~/components/ui/sidebar";

<Sidebar.Provider defaultCollapsed class="min-h-[28rem] overflow-hidden rounded-xl border border-separator-opaque">
  <Sidebar.Root>
    <Sidebar.Rail />
    <Sidebar.Header class="flex flex-row items-center gap-2 border-b p-3">
      <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-fill-accent/20 text-label">
        <svg viewBox="0 0 24 24" class="h-5 w-5" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
          <rect x="3" y="3" width="7" height="7" rx="1.5" />
          <rect x="14" y="3" width="7" height="7" rx="1.5" />
          <rect x="3" y="14" width="7" height="7" rx="1.5" />
          <rect x="14" y="14" width="7" height="7" rx="1.5" />
        </svg>
      </span>
      <Sidebar.HeaderTitle>Aplikace</Sidebar.HeaderTitle>
    </Sidebar.Header>
    <Sidebar.Content>
      <Sidebar.Group>
        <Sidebar.GroupLabel>Menu</Sidebar.GroupLabel>
        <Sidebar.GroupContent>
          <Sidebar.Menu>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton active>
                <Sidebar.MenuIcon>
                  <span class="text-base leading-none">◉</span>
                </Sidebar.MenuIcon>
                <Sidebar.MenuLabel>Přehled</Sidebar.MenuLabel>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                <Sidebar.MenuIcon>
                  <span class="text-base leading-none">◇</span>
                </Sidebar.MenuIcon>
                <Sidebar.MenuLabel>Projekty</Sidebar.MenuLabel>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                <Sidebar.MenuIcon>
                  <span class="text-base leading-none">▤</span>
                </Sidebar.MenuIcon>
                <Sidebar.MenuLabel>Dokumenty</Sidebar.MenuLabel>
              </Sidebar.MenuButton>
            </Sidebar.MenuItem>
            <Sidebar.MenuItem>
              <Sidebar.MenuButton>
                <Sidebar.MenuIcon>
                  <span class="text-base leading-none">⚙</span>
                </Sidebar.MenuIcon>
                <Sidebar.MenuLabel>Nastavení</Sidebar.MenuLabel>
              </Sidebar.MenuButton>
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
    <div class="p-4 text-body text-secondary-label">
      Ve sbaleném režimu zůstávají vidět ikony; nápisy položek a skupiny jsou pro čtečky (\`sr-only\`), po rozbalení se zobrazí vedle ikon.
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">MenuIcon + MenuLabel + MenuAction</h2>
        <CodeExample>
          <Desc><code class="text-caption-1">Sidebar.MenuIcon</code> / <code class="text-caption-1">Sidebar.MenuLabel</code> — viz výše. Rozbalovací řádkové menu: <code class="text-caption-1">DropdownMenu.Root</code> + <code class="text-caption-1">DropdownMenu.Trigger variant="icon"</code> (tečky). <code class="text-caption-1">Sidebar.Trigger</code> v <code class="text-caption-1">Inset</code> přepíná sbalený panel na desktopu — ikona „sbalit postranní panel“ (šipka do panelu). V <code class="text-caption-1">DropdownMenu.Item</code> lze vložit ikonu + text (<code class="text-caption-1">text-label</code> na SVG).</Desc>
          <TabExample>
            <Sidebar.Provider class="min-h-[28rem] overflow-hidden rounded-xl border border-separator-opaque">
              <Sidebar.Root>
                <Sidebar.Rail />
                <Sidebar.Content>
                  <Sidebar.Menu>
                    <Sidebar.MenuItem>
                      <Sidebar.MenuButton>
                        <Sidebar.MenuIcon>
                          <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-fill-accent/25 text-caption-1 font-semibold text-label">
                            AK
                          </span>
                        </Sidebar.MenuIcon>
                        <Sidebar.MenuLabel>Anna Kovářová</Sidebar.MenuLabel>
                      </Sidebar.MenuButton>
                      <DropdownMenu.Root class="absolute right-1 top-1.5 z-20 inline-block md:[aside[data-collapsed]_&]:hidden">
                        <DropdownMenu.Trigger variant="icon" aria-label="Akce kontaktu" data-q-sidebar-menu-action="">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="opacity-90">
                            <circle cx="12" cy="6" r="1.75" />
                            <circle cx="12" cy="12" r="1.75" />
                            <circle cx="12" cy="18" r="1.75" />
                          </svg>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Popover gutter={4}>
                          <DropdownMenu.Item>
                            <svg class="h-4 w-4 shrink-0 text-label" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                              <path d="m22 6-10 7L2 6" />
                            </svg>
                            Zpráva
                          </DropdownMenu.Item>
                          <DropdownMenu.Item>
                            <svg class="h-4 w-4 shrink-0 text-label" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                            </svg>
                            Upravit
                          </DropdownMenu.Item>
                          <DropdownMenu.Separator />
                          <DropdownMenu.Item>
                            <svg class="h-4 w-4 shrink-0 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                            Odebrat
                          </DropdownMenu.Item>
                        </DropdownMenu.Popover>
                      </DropdownMenu.Root>
                    </Sidebar.MenuItem>
                    <Sidebar.MenuItem>
                      <Sidebar.MenuButton>
                        <Sidebar.MenuIcon>
                          <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-fill-secondary/40 text-caption-1 font-semibold text-label">
                            MP
                          </span>
                        </Sidebar.MenuIcon>
                        <Sidebar.MenuLabel>Marek Procházka</Sidebar.MenuLabel>
                      </Sidebar.MenuButton>
                      <DropdownMenu.Root class="absolute right-1 top-1.5 z-20 inline-block md:[aside[data-collapsed]_&]:hidden">
                        <DropdownMenu.Trigger variant="icon" aria-label="Akce kontaktu" data-q-sidebar-menu-action="">
                          <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="opacity-90">
                            <circle cx="12" cy="6" r="1.75" />
                            <circle cx="12" cy="12" r="1.75" />
                            <circle cx="12" cy="18" r="1.75" />
                          </svg>
                        </DropdownMenu.Trigger>
                        <DropdownMenu.Popover gutter={4}>
                          <DropdownMenu.Item>
                            <svg class="h-4 w-4 shrink-0 text-label" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                              <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                              <path d="m22 6-10 7L2 6" />
                            </svg>
                            Zpráva
                          </DropdownMenu.Item>
                          <DropdownMenu.Item>
                            <svg class="h-4 w-4 shrink-0 text-label" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                              <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                            </svg>
                            Upravit
                          </DropdownMenu.Item>
                          <DropdownMenu.Separator />
                          <DropdownMenu.Item>
                            <svg class="h-4 w-4 shrink-0 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                              <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                            </svg>
                            Odebrat
                          </DropdownMenu.Item>
                        </DropdownMenu.Popover>
                      </DropdownMenu.Root>
                    </Sidebar.MenuItem>
                  </Sidebar.Menu>
                </Sidebar.Content>
              </Sidebar.Root>
              <Sidebar.Inset>
                <header class="flex items-center gap-2 border-b p-3">
                  <Sidebar.Trigger aria-label="Sbalit nebo rozbalit postranní panel">
                    <svg class="h-5 w-5 shrink-0 text-label" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
                      <path d="m11 17-5-5 5-5" />
                      <path d="m18 17-5-5 5-5" />
                    </svg>
                  </Sidebar.Trigger>
                  <span class="text-callout font-medium text-label">Hlavní obsah</span>
                </header>
                <div class="p-4 text-body text-secondary-label">
                  Oba řádky mají stejné <code class="rounded bg-fill-secondary/40 px-1 py-0.5 text-caption-1">DropdownMenu</code> u položky; v záhlaví <code class="rounded bg-fill-secondary/40 px-1 py-0.5 text-caption-1">Sidebar.Trigger</code> s ikonou pro přepnutí šířky panelu (desktop).
                </div>
              </Sidebar.Inset>
            </Sidebar.Provider>
          </TabExample>
          <TabCode>{`import { DropdownMenu } from "~/components/ui/dropdown-menu";
import { Sidebar } from "~/components/ui/sidebar";

<Sidebar.Provider class="min-h-[28rem] overflow-hidden rounded-xl border border-separator-opaque">
  <Sidebar.Root>
    <Sidebar.Rail />
    <Sidebar.Content>
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <Sidebar.MenuButton>
            <Sidebar.MenuIcon>
              <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-fill-accent/25 text-caption-1 font-semibold text-label">
                AK
              </span>
            </Sidebar.MenuIcon>
            <Sidebar.MenuLabel>Anna Kovářová</Sidebar.MenuLabel>
          </Sidebar.MenuButton>
          <DropdownMenu.Root class="absolute right-1 top-1.5 z-20 inline-block md:[aside[data-collapsed]_&]:hidden">
            <DropdownMenu.Trigger variant="icon" aria-label="Akce kontaktu" data-q-sidebar-menu-action="">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="opacity-90">
                <circle cx="12" cy="6" r="1.75" />
                <circle cx="12" cy="12" r="1.75" />
                <circle cx="12" cy="18" r="1.75" />
              </svg>
            </DropdownMenu.Trigger>
            <DropdownMenu.Popover gutter={4}>
              <DropdownMenu.Item>
                <svg class="h-4 w-4 shrink-0 text-label" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <path d="m22 6-10 7L2 6" />
                </svg>
                Zpráva
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                <svg class="h-4 w-4 shrink-0 text-label" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                Upravit
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item>
                <svg class="h-4 w-4 shrink-0 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Odebrat
              </DropdownMenu.Item>
            </DropdownMenu.Popover>
          </DropdownMenu.Root>
        </Sidebar.MenuItem>
        <Sidebar.MenuItem>
          <Sidebar.MenuButton>
            <Sidebar.MenuIcon>
              <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-fill-secondary/40 text-caption-1 font-semibold text-label">
                MP
              </span>
            </Sidebar.MenuIcon>
            <Sidebar.MenuLabel>Marek Procházka</Sidebar.MenuLabel>
          </Sidebar.MenuButton>
          <DropdownMenu.Root class="absolute right-1 top-1.5 z-20 inline-block md:[aside[data-collapsed]_&]:hidden">
            <DropdownMenu.Trigger variant="icon" aria-label="Akce kontaktu" data-q-sidebar-menu-action="">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true" class="opacity-90">
                <circle cx="12" cy="6" r="1.75" />
                <circle cx="12" cy="12" r="1.75" />
                <circle cx="12" cy="18" r="1.75" />
              </svg>
            </DropdownMenu.Trigger>
            <DropdownMenu.Popover gutter={4}>
              <DropdownMenu.Item>
                <svg class="h-4 w-4 shrink-0 text-label" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M4 4h16c1.1 0 2 .9 2 2v12c0 1.1-.9 2-2 2H4c-1.1 0-2-.9-2-2V6c0-1.1.9-2 2-2z" />
                  <path d="m22 6-10 7L2 6" />
                </svg>
                Zpráva
              </DropdownMenu.Item>
              <DropdownMenu.Item>
                <svg class="h-4 w-4 shrink-0 text-label" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M12 20h9M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z" />
                </svg>
                Upravit
              </DropdownMenu.Item>
              <DropdownMenu.Separator />
              <DropdownMenu.Item>
                <svg class="h-4 w-4 shrink-0 text-red-500" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" aria-hidden="true">
                  <path d="M3 6h18M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6M8 6V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2" />
                </svg>
                Odebrat
              </DropdownMenu.Item>
            </DropdownMenu.Popover>
          </DropdownMenu.Root>
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.Content>
  </Sidebar.Root>
  <Sidebar.Inset>
    <header class="flex items-center gap-2 border-b p-3">
      <Sidebar.Trigger aria-label="Sbalit nebo rozbalit postranní panel">
        <svg class="h-5 w-5 shrink-0 text-label" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">
          <path d="m11 17-5-5 5-5" />
          <path d="m18 17-5-5 5-5" />
        </svg>
      </Sidebar.Trigger>
      <span class="text-callout font-medium text-label">Hlavní obsah</span>
    </header>
    <div class="p-4 text-body text-secondary-label">
      Oba řádky mají stejné <code class="rounded bg-fill-secondary/40 px-1 py-0.5 text-caption-1">DropdownMenu</code> u položky; v záhlaví <code class="rounded bg-fill-secondary/40 px-1 py-0.5 text-caption-1">Sidebar.Trigger</code> s ikonou pro přepnutí šířky panelu (desktop).
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Sbalený panel: ikony nebo zkratka</h2>
        <CodeExample>
          <Desc>Bez <code class="text-caption-1">Sidebar.MenuIcon</code> doplň na <code class="text-caption-1">Sidebar.MenuLabel</code> prop <code class="text-caption-1">abbrevSource</code>, nebo použij <code class="text-caption-1">Sidebar.MenuButton</code> s <code class="text-caption-1">itemLabel</code> (zkratka v avataru <code class="text-caption-1">rounded-md</code>).</Desc>
          <TabExample>
            <Sidebar.Provider defaultCollapsed class="min-h-[28rem] overflow-hidden rounded-xl border border-separator-opaque">
              <Sidebar.Root>
                <Sidebar.Rail />
                <Sidebar.Content>
                  <Sidebar.Menu>
                    <Sidebar.MenuItem>
                      <Sidebar.MenuButton>
                        <Sidebar.MenuIcon>
                          <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-fill-secondary/30 text-caption-1 font-medium text-label">
                            P
                          </span>
                        </Sidebar.MenuIcon>
                        <Sidebar.MenuLabel>Přehled</Sidebar.MenuLabel>
                      </Sidebar.MenuButton>
                    </Sidebar.MenuItem>
                    <Sidebar.MenuItem>
                      <Sidebar.MenuButton>
                        <Sidebar.MenuLabel abbrevSource="Správa dokumentů">Správa dokumentů</Sidebar.MenuLabel>
                      </Sidebar.MenuButton>
                    </Sidebar.MenuItem>
                    <Sidebar.MenuItem>
                      <Sidebar.MenuButton itemLabel="Nastavení účtu" />
                    </Sidebar.MenuItem>
                  </Sidebar.Menu>
                </Sidebar.Content>
              </Sidebar.Root>
              <Sidebar.Inset>
                <header class="flex items-center gap-2 border-b p-3">
                  <Sidebar.Trigger aria-label="Přepnout panel">☰</Sidebar.Trigger>
                  <span class="text-callout font-medium text-label">Rozbalte triggerem — zkratky vs. plné názvy</span>
                </header>
                <div class="p-4 text-body text-secondary-label">
                  Ve sbaleném stavu: vlastní ikona, zkratka z `abbrevSource`, nebo vygenerovaná z `itemLabel`.
                </div>
              </Sidebar.Inset>
            </Sidebar.Provider>
          </TabExample>
          <TabCode>{`import { Sidebar } from "~/components/ui/sidebar";

<Sidebar.Provider defaultCollapsed class="min-h-[28rem] overflow-hidden rounded-xl border border-separator-opaque">
  <Sidebar.Root>
    <Sidebar.Rail />
    <Sidebar.Content>
      <Sidebar.Menu>
        <Sidebar.MenuItem>
          <Sidebar.MenuButton>
            <Sidebar.MenuIcon>
              <span class="flex h-8 w-8 shrink-0 items-center justify-center rounded-md bg-fill-secondary/30 text-caption-1 font-medium text-label">
                P
              </span>
            </Sidebar.MenuIcon>
            <Sidebar.MenuLabel>Přehled</Sidebar.MenuLabel>
          </Sidebar.MenuButton>
        </Sidebar.MenuItem>
        <Sidebar.MenuItem>
          <Sidebar.MenuButton>
            <Sidebar.MenuLabel abbrevSource="Správa dokumentů">Správa dokumentů</Sidebar.MenuLabel>
          </Sidebar.MenuButton>
        </Sidebar.MenuItem>
        <Sidebar.MenuItem>
          <Sidebar.MenuButton itemLabel="Nastavení účtu" />
        </Sidebar.MenuItem>
      </Sidebar.Menu>
    </Sidebar.Content>
  </Sidebar.Root>
  <Sidebar.Inset>
    <header class="flex items-center gap-2 border-b p-3">
      <Sidebar.Trigger aria-label="Přepnout panel">☰</Sidebar.Trigger>
      <span class="text-callout font-medium text-label">Rozbalte triggerem — zkratky vs. plné názvy</span>
    </header>
    <div class="p-4 text-body text-secondary-label">
      Ve sbaleném stavu: vlastní ikona, zkratka z \`abbrevSource\`, nebo vygenerovaná z \`itemLabel\`.
    </div>
  </Sidebar.Inset>
</Sidebar.Provider>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
