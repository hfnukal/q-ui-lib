import { $, component$, sync$, useSignal } from "@builder.io/qwik";
import { Link } from "@builder.io/qwik-city";
import { Screen } from "~/components/ui/screen";
import { Sidebar } from "~/components/ui/sidebar";
import { ScrollArea } from "~/components/ui/scroll-area";
import { Sonner } from "~/components/ui/sonner";
import { Designer, type DesignerItem } from "~/components/demo/Designer";

function newDesignerItemId() {
  return typeof crypto !== "undefined" && typeof crypto.randomUUID === "function"
    ? crypto.randomUUID()
    : `id-${Date.now()}-${Math.random().toString(36).slice(2, 11)}`;
}

const COMPONENT_SLUGS: string[] = Object.keys(
  import.meta.glob("../../components/ui/*/index.tsx"),
)
  .map((file) =>
    file
      .replace(/^\.\.\/\.\.\/components\/ui\//, "")
      .replace(/\/index\.tsx$/, ""),
  )
  .sort((a, b) => a.localeCompare(b));

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

function paletteItemClass() {
  return [
    "flex w-full cursor-grab items-center gap-2 overflow-hidden rounded-md border border-transparent p-2 text-left text-callout text-label transition-colors",
    "hover:border-separator-opaque/50 hover:bg-surface-overlay",
    "active:cursor-grabbing",
    "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-grouped-surface",
  ].join(" ");
}

export default component$(() => {
  const items = useSignal<DesignerItem[]>([]);

  /** Přidání z klávesnice */
  const addItem$ = $((slug: string) => {
    items.value = [...items.value, { id: newDesignerItemId(), slug }];
  });

  return (
    <Screen>
      <Sonner.Toaster>
        <Sidebar.Provider class="min-h-screen bg-background text-label md:min-h-svh">
          <Sidebar.Root class="h-full overflow-hidden">
            <Sidebar.Rail />
            <Sidebar.Header>
              <Link
                class="truncate text-headline font-semibold text-label hover:underline"
                href="/"
              >
                UI Lib Demo
              </Link>
              <span class="block truncate text-caption-2 text-tertiary-label">
                Designér
              </span>
            </Sidebar.Header>
            <Sidebar.Content class="flex min-h-0 flex-1 flex-col overflow-hidden">
              <ScrollArea.Root class="min-h-0 flex-1">
                <ScrollArea.Viewport direction="vertical">
                  <Sidebar.Group>
                    <Sidebar.GroupLabel>Komponenty (přetáhni)</Sidebar.GroupLabel>
                    <Sidebar.GroupContent>
                      <Sidebar.Menu>
                        {COMPONENT_SLUGS.map((slug) => (
                          <Sidebar.MenuItem key={slug}>
                            <div
                              role="button"
                              tabIndex={0}
                              draggable={true}
                              data-slug={slug}
                              class={paletteItemClass()}
                              onDragStart$={sync$(
                                (e: DragEvent, currentTarget: HTMLDivElement) => {
                                  const s = currentTarget.getAttribute("data-slug");
                                  if (e.dataTransfer && s) {
                                    e.dataTransfer.setData("text/plain", s);
                                    e.dataTransfer.effectAllowed = "copy";
                                  }
                                },
                              )}
                              onKeyDown$={(e) => {
                                if (e.key === "Enter" || e.key === " ") {
                                  e.preventDefault();
                                  addItem$(slug);
                                }
                              }}
                            >
                              <span class="truncate">{slug}</span>
                            </div>
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
                  <span class="text-callout font-medium text-label">Canvas</span>
                </header>
                {/*
                  Qwik DnD: https://qwik.dev/docs/cookbook/drag&drop/
                  — sync$ pro dataTransfer; preventdefault:* pro výchozí chování prohlížeče.
                */}
                <div
                  class="min-h-0 min-w-0 flex-1 px-6 py-8"
                  data-designer-drop-host=""
                  preventdefault:dragover
                  preventdefault:drop
                  onDrop$={[
                    sync$((e: DragEvent, currentTarget: HTMLDivElement) => {
                      const slug = e.dataTransfer?.getData("text/plain") ?? "";
                      currentTarget.dataset.droppedSlug = slug;
                    }),
                    $((_, currentTarget: HTMLDivElement | undefined) => {
                      /* V async fázi je `e.currentTarget` často null — druhý arg dává Qwik (viz cookbook). */
                      if (!currentTarget) {
                        return;
                      }
                      const slug = currentTarget.dataset.droppedSlug?.trim();
                      if (slug) {
                        items.value = [
                          ...items.value,
                          { id: newDesignerItemId(), slug },
                        ];
                      }
                      delete currentTarget.dataset.droppedSlug;
                    }),
                  ]}
                >
                  <Designer items={items} />
                </div>
              </ScrollArea.Viewport>
            </ScrollArea.Root>
          </Sidebar.Inset>
        </Sidebar.Provider>
      </Sonner.Toaster>
    </Screen>
  );
});
