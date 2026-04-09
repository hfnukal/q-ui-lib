import { component$, Slot, useSignal, useTask$ } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";
import { Sonner } from "~/components/ui/sonner";
import { Sidebar } from "~/components/ui/sidebar";
import { ScrollArea } from "~/components/ui/scroll-area";
import fg from "fast-glob";
import { ComponentPropsTable } from "~/components/demo/component-props";

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

  const SLUGS = useSignal<string[]>([]);

  useTask$(async () => {
    const files = await fg("src/routes/components/*/index.tsx");
    SLUGS.value = files.map((file) => file.replace("src/routes/components/", "")
      .replace("/index.tsx", ""))
      .sort((a, b) => a.localeCompare(b));
  })

  // console.log(slugs);

  return (
    <Sonner.Toaster>
      <Sidebar.Provider class="min-h-screen bg-background text-label md:min-h-svh">
        <Sidebar.Root class="h-full overflow-hidden">
          <Sidebar.Rail />
          <Sidebar.Header>
            <Link class="truncate text-headline font-semibold text-label hover:underline" href="/">
              UI Lib Demo
            </Link>
          </Sidebar.Header>
          <Sidebar.Content class="h-full overflow-hidden">
            <Sidebar.Group>
              <Sidebar.GroupLabel>Demo</Sidebar.GroupLabel>
              <Sidebar.GroupContent>
                <Sidebar.Menu>
                  <ScrollArea.Root>
                    <ScrollArea.Viewport>
                      {SLUGS.value.map((slug) => (
                        <Sidebar.MenuItem key={slug}>
                          <Link
                            class={menuLinkClass(current === normalizePath("/components/" + slug))}
                            href={"/components/" + slug}
                          >
                            <span class="truncate">{slug}</span>
                          </Link>
                        </Sidebar.MenuItem>
                      ))}
                    </ScrollArea.Viewport>
                  </ScrollArea.Root>
                </Sidebar.Menu>
              </Sidebar.GroupContent>
            </Sidebar.Group>
          </Sidebar.Content>
        </Sidebar.Root>
        <Sidebar.Inset>
          <header class="flex shrink-0 items-center gap-2 border-b border-separator-opaque px-4 py-3">
            <Sidebar.Trigger aria-label="Menu">{menuTriggerIcon}</Sidebar.Trigger>
            <span class="text-callout font-medium text-label">Náhled</span>
          </header>
          <div class="min-w-0 flex-1 px-6 py-12 text-slate-800">
            <Slot />

            <ComponentPropsTable filePath={`./src/components/ui/${current.replace("/components/", "")}/index.tsx`} />
          </div>
        </Sidebar.Inset>
      </Sidebar.Provider>
    </Sonner.Toaster>
  );
});
