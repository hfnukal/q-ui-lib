import { component$, Slot, useSignal, useTask$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { Sonner } from "../../base/sonner";
import { Sidebar, sidebarLabelAbbrev, useSidebar } from "../../base/sidebar";
import { ScrollArea } from "../../base/scroll-area";
import { ComponentPropsTable } from "../demo-component-props";
import { Screen } from "../../base/screen";
import { Input } from "../../base/input";

/** Vite: seznam route modulů bez čtení disku za běhu (funguje i v prohlížeči po bundlu). */
const COMPONENT_SLUGS: string[] = Object.keys(
  import.meta.glob("../../*/*/index.tsx"),
)
  .map((file) =>
    file
      // .replace(/^\.\/components\//, "")
      .replace(/^\.\.\/\.\.\//, "")
      .replace(/^\.\.\//, "qui-demo/")
      .replace(/\/index\.tsx$/, ""),
  )
  .filter((slug) => !slug.includes("qui-demo"))
  .sort((a, b) => a.localeCompare(b));

type MetaGeneratedLite = { title?: string };

const META_GLOB = import.meta.glob<{ default: MetaGeneratedLite }>(
  "../../*/*/meta.generated.json",
  { eager: true },
);

function componentTitle(slug: string): string {
  const key = `../../${slug}/meta.generated.json`;
  const title = META_GLOB[key]?.default?.title?.trim();
  return title || slug;
}

function matchesComponentFilter(slug: string, queryLower: string): boolean {
  if (!queryLower) return true;
  const title = componentTitle(slug).toLowerCase();
  return title.includes(queryLower) || slug.toLowerCase().includes(queryLower);
}

function normalizePath(path: string) {
  const p = path.replace(/\/$/, "") || "/";
  return p;
}

function menuLinkClass(active: boolean, collapsed: boolean) {
  return [
    "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-callout transition-colors",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-grouped-surface",
    "q-nav-link-on-grouped",
    active ? "font-medium text-label" : "text-label",
    collapsed ? "md:justify-center md:gap-0 md:px-0" : "",
  ].join(" ");
}

const menuTriggerIcon = (
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

/**
 * Tělo layoutu uvnitř `Sidebar.Provider` — potřebuje `useSidebar()` pro zkratky ve sbaleném panelu.
 */
const DemoShellWithSidebar = component$(() => {
  const loc = useLocation();
  const current = normalizePath(loc.url.pathname);
  const componentDemoSlug = useSignal(current.match(/^\/qui-demo\/components\/(.+)$/)?.[1] ?? "");
  useTask$(({ track }) => {
    track(() => loc.url);
    const current = normalizePath(loc.url.pathname);
    componentDemoSlug.value = current.match(/^\/qui-demo\/components\/(.+)$/)?.[1] ?? "";
  })

  const sidebar = useSidebar();
  const collapsed = sidebar.collapsed.value;
  const componentFilter = useSignal("");
  const queryLower = componentFilter.value.trim().toLowerCase();
  const visibleSlugs = queryLower
    ? COMPONENT_SLUGS.filter((slug) => matchesComponentFilter(slug, queryLower))
    : COMPONENT_SLUGS;
  const groupedVisibleSlugs = visibleSlugs.reduce<Record<string, string[]>>((acc, slug) => {
    const [group = "components"] = slug.split("/");
    (acc[group] ??= []).push(slug);
    return acc;
  }, {});

  return (
    <>
      <Sidebar.Root class="h-full overflow-hidden">
        <Sidebar.Rail />
        <Sidebar.Header>
          <Link class="truncate text-headline font-semibold text-label hover:underline" href="/qui-demo">
            QUI Lib Demo
          </Link>
          <div class={collapsed ? "md:hidden" : ""}>
            <Input
              type="search"
              aria-label="Filtrovat komponenty podle názvu"
              placeholder="Hledat komponentu…"
              value={componentFilter.value}
              class="h-9 w-full min-w-0 text-caption"
              onInput$={(e) => {
                componentFilter.value = (e.target as HTMLInputElement).value;
              }}
            />
          </div>
        </Sidebar.Header>
        <Sidebar.Content class="flex min-h-0 flex-1 flex-col overflow-hidden">
          <ScrollArea.Root class="min-h-0 flex-1">
            <ScrollArea.Viewport direction="vertical" keepScroll keepScrollId="sidebar-nav">
              <Sidebar.Group>
                <Sidebar.GroupLabel>Design</Sidebar.GroupLabel>
                <Sidebar.GroupContent>
                  <Sidebar.Menu>
                    {(
                      [{ href: "/qui-demo/", label: "Theme Editor" }] as const
                    ).map(({ href, label }) => {
                      const active = current === normalizePath(href);
                      const abbrev = sidebarLabelAbbrev(label);
                      return (
                        <Sidebar.MenuItem key={href}>
                          <a
                            class={menuLinkClass(active, collapsed)}
                            href={href}
                            data-active={active ? "" : undefined}
                            aria-current={active ? "page" : undefined}
                          >
                            {collapsed ? (
                              <span class="flex min-w-0 flex-1 items-center gap-2">
                                <span
                                  class="hidden h-8 w-8 shrink-0 items-center justify-center rounded-md bg-fill-secondary/30 text-caption-1 font-semibold uppercase leading-none text-label md:flex"
                                  aria-hidden="true"
                                >
                                  {abbrev || "?"}
                                </span>
                                <span class="max-md:truncate md:sr-only">{label}</span>
                              </span>
                            ) : (
                              <span class="truncate">{label}</span>
                            )}
                          </a>
                        </Sidebar.MenuItem>
                      );
                    })}
                  </Sidebar.Menu>
                </Sidebar.GroupContent>
              </Sidebar.Group>
              {Object.entries(groupedVisibleSlugs).map(([groupLabel, slugs]) => (
                <Sidebar.Group key={groupLabel}>
                  <Sidebar.GroupLabel>Libray {groupLabel}</Sidebar.GroupLabel>
                  <Sidebar.GroupContent>
                    <Sidebar.Menu>
                      {slugs.map((slug) => {
                        const href = "/qui-demo/components/" + slug;
                        const active = current === normalizePath(href);
                        const title = componentTitle(slug);
                        const abbrev = sidebarLabelAbbrev(title);
                        return (
                          <Sidebar.MenuItem key={slug}>
                            <a
                              class={menuLinkClass(active, collapsed)}
                              href={href}
                              data-active={active ? "" : undefined}
                              aria-current={active ? "page" : undefined}
                            >
                              {collapsed ? (
                                <span class="flex min-w-0 flex-1 items-center gap-2">
                                  <span
                                    class="hidden h-8 w-8 shrink-0 items-center justify-center rounded-md bg-fill-secondary/30 text-caption-1 font-semibold uppercase leading-none text-label md:flex"
                                    aria-hidden="true"
                                  >
                                    {abbrev || "?"}
                                  </span>
                                  <span class="max-md:truncate md:sr-only">{title}</span>
                                </span>
                              ) : (
                                <span class="truncate">{title}</span>
                              )}
                            </a>
                          </Sidebar.MenuItem>
                        );
                      })}
                    </Sidebar.Menu>
                  </Sidebar.GroupContent>
                </Sidebar.Group>
              ))}
            </ScrollArea.Viewport>
          </ScrollArea.Root>
        </Sidebar.Content>
      </Sidebar.Root>
      <Sidebar.Inset>
        <header class="flex shrink-0 items-center gap-2 border-b border-separator-opaque px-4 py-3">
          <Sidebar.Trigger aria-label="Menu">{menuTriggerIcon}</Sidebar.Trigger>
          <span class="text-callout font-medium text-label">
            {componentDemoSlug.value ? componentTitle(componentDemoSlug.value) : "Color palete"}
          </span>
        </header>
        <ScrollArea.Root class="min-h-0 flex-1">
          <ScrollArea.Viewport direction="vertical" keepScroll keepScrollId="main-content">
            <div class="min-w-0 flex-1 px-6 py-12 text-slate-800">
              <Slot />

              {componentDemoSlug.value ? (
                <ComponentPropsTable
                  filePath={`${componentDemoSlug.value}/index.tsx`}
                />
              ) : null}
            </div>
          </ScrollArea.Viewport>
        </ScrollArea.Root>
      </Sidebar.Inset>
    </>
  );
});

export default component$(() => {
  const loc = useLocation();
  const current = normalizePath(loc.url.pathname);

  /** `/design` a `/dsgn` mají vlastní full-screen shell — bez demo postranního panelu. */
  if (current === "/design" || current === "/dsgn") {
    return <Slot />;
  }

  return (
    <Screen>
      <Sonner.Toaster>
        <Sidebar.Provider class="min-h-screen bg-background text-label md:min-h-svh">
          {/* Router outlet musí být předán jako child — vnitřní <Slot /> v DemoShellWithSidebar jinak nic nepromítne. */}
          <DemoShellWithSidebar>
            <Slot />
          </DemoShellWithSidebar>
        </Sidebar.Provider>
      </Sonner.Toaster>
    </Screen>
  );
});
