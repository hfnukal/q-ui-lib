import { component$, Slot } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { Sonner } from "~/components/ui/sonner";
import { Sidebar } from "~/components/ui/sidebar";
import { ScrollArea } from "~/components/ui/scroll-area";
import { ComponentPropsTable } from "~/components/demo/component-props";
import { Screen } from "~/components/ui/screen";

/** Vite: seznam route modulů bez čtení disku za běhu (funguje i v prohlížeči po bundlu). */
const COMPONENT_SLUGS: string[] = Object.keys(
  import.meta.glob("./components/*/index.tsx"),
)
  .map((file) =>
    file
      .replace(/^\.\/components\//, "")
      .replace(/\/index\.tsx$/, ""),
  )
  .sort((a, b) => a.localeCompare(b));

function normalizePath(path: string) {
  const p = path.replace(/\/$/, "") || "/";
  return p;
}

function menuLinkClass(active: boolean) {
  const variantClass = "hover:bg-surface-overlay hover:text-label";
  const activeClass = active ? "bg-fill-secondary font-medium text-label" : "text-label";
  return [
    "flex w-full items-center gap-2 overflow-hidden rounded-md p-2 text-left text-callout transition-colors",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-grouped-surface",
    variantClass,
    activeClass,
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

export default component$(() => {
  const loc = useLocation();
  const current = normalizePath(loc.url.pathname);
  const componentDemoSlug =
    current.match(/^\/components\/([^/]+)/)?.[1] ?? "";

  /** `/design` a `/dsgn` mají vlastní full-screen shell — bez demo postranního panelu. */
  if (current === "/design" || current === "/dsgn") {
    return <Slot />;
  }

  return (
    <Screen>
      <Sonner.Toaster>
        <Sidebar.Provider class="min-h-screen bg-background text-label md:min-h-svh">
          <Sidebar.Root class="h-full overflow-hidden">
            <Sidebar.Rail />
            <Sidebar.Header>
              <Link class="truncate text-headline font-semibold text-label hover:underline" href="/">
                UI Lib Demo
              </Link>
            </Sidebar.Header>
            <Sidebar.Content class="flex min-h-0 flex-1 flex-col overflow-hidden">
              <ScrollArea.Root class="min-h-0 flex-1">
                <ScrollArea.Viewport direction="vertical">
                  <Sidebar.Group>
                    <Sidebar.GroupLabel>Demo</Sidebar.GroupLabel>
                    <Sidebar.GroupContent>
                      <Sidebar.Menu>
                        {COMPONENT_SLUGS.map((slug) => (
                          <Sidebar.MenuItem key={slug}>
                            <Link
                              class={menuLinkClass(current === normalizePath("/components/" + slug))}
                              href={"/components/" + slug}
                            >
                              <span class="truncate">{slug}</span>
                            </Link>
                          </Sidebar.MenuItem>
                        ))}
                      </Sidebar.Menu>
                    </Sidebar.GroupContent>
                  </Sidebar.Group>
                </ScrollArea.Viewport>
              </ScrollArea.Root>
            </Sidebar.Content>
          </Sidebar.Root>
          <Sidebar.Inset>
            <ScrollArea.Root class="min-h-0 flex-1">
              <ScrollArea.Viewport direction="vertical">
                <header class="flex shrink-0 items-center gap-2 border-b border-separator-opaque px-4 py-3">
                  <Sidebar.Trigger aria-label="Menu">{menuTriggerIcon}</Sidebar.Trigger>
                  <span class="text-callout font-medium text-label">Náhled</span>
                </header>
                <div class="min-w-0 flex-1 px-6 py-12 text-slate-800">
                  <Slot />

                  {componentDemoSlug ? (
                    <ComponentPropsTable
                      filePath={`./src/components/ui/${componentDemoSlug}/index.tsx`}
                    />
                  ) : null}
                </div>
              </ScrollArea.Viewport>
            </ScrollArea.Root>
          </Sidebar.Inset>
        </Sidebar.Provider>
      </Sonner.Toaster>
    </Screen>
  );
});
