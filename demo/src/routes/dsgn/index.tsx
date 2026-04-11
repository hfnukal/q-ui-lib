import { component$, sync$, useSignal, useComputed$ } from "@builder.io/qwik";
import {
  DsgnProvider,
  DsgnCanvas,
  DsgnProperties,
  ALL_SLUGS,
  getSlugMeta,
} from "~/components/demo/Dsgn";

// ─── PaletteItem ──────────────────────────────────────────────────────────────
const PaletteItem = component$<{ slug: string }>((props) => {
  const meta = getSlugMeta(props.slug);
  const label = meta?.title ?? props.slug
    .split("-")
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join("\u00a0");

  return (
    <div
      class="cursor-grab select-none rounded-md px-2 py-1.5 text-callout text-label transition-colors hover:bg-surface-overlay active:cursor-grabbing"
      draggable
      data-slug={props.slug}
      title={props.slug}
      onDragStart$={sync$((e: DragEvent, el: Element) => {
        if (!e.dataTransfer) return;
        const slug = (el as HTMLElement).dataset.slug ?? "";
        e.dataTransfer.setData("application/x-q-ui-slug", slug);
        e.dataTransfer.setData("text/plain", slug);
        e.dataTransfer.effectAllowed = "copy";
      })}
    >
      {label}
    </div>
  );
});

// ─── Toolbar icons ─────────────────────────────────────────────────────────────
const PanelRightIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="16"
    height="16"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
  >
    <rect width="18" height="18" x="3" y="3" rx="2" />
    <path d="M15 3v18" />
  </svg>
);

const SearchIcon = (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    width="13"
    height="13"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    stroke-width="2"
    stroke-linecap="round"
    stroke-linejoin="round"
    aria-hidden="true"
    class="shrink-0 text-tertiary-label"
  >
    <circle cx="11" cy="11" r="8" />
    <path d="m21 21-4.3-4.3" />
  </svg>
);

// ─── Page ─────────────────────────────────────────────────────────────────────
export default component$(() => {
  const panelOpen = useSignal(true);
  const query = useSignal("");

  const filtered = useComputed$(() => {
    const q = query.value.trim().toLowerCase();
    if (!q) return ALL_SLUGS;
    return ALL_SLUGS.filter((slug) => {
      if (slug.includes(q)) return true;
      const title = getSlugMeta(slug)?.title?.toLowerCase() ?? "";
      return title.includes(q);
    });
  });

  return (
    <DsgnProvider>
      <div class="flex h-screen flex-col overflow-hidden bg-background text-label">

        {/* ── Toolbar ──────────────────────────────────────────────────── */}
        <header class="flex shrink-0 items-center gap-3 border-b border-separator-opaque bg-background px-4 py-2">
          <span class="text-callout font-semibold text-label">Návrhář</span>
          <span class="text-caption-1 text-tertiary-label">
            Přetáhni komponentu z levého panelu na canvas
          </span>
          <div class="flex-1" />
          <button
            type="button"
            class={[
              "flex items-center gap-1.5 rounded-md px-2.5 py-1.5 text-caption-1 transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring",
              panelOpen.value
                ? "bg-fill-secondary text-label"
                : "text-secondary-label hover:bg-surface-overlay hover:text-label",
            ].join(" ")}
            aria-label="Přepnout panel vlastností"
            aria-pressed={panelOpen.value}
            onClick$={() => { panelOpen.value = !panelOpen.value; }}
          >
            {PanelRightIcon}
            <span>Vlastnosti</span>
          </button>
        </header>

        {/* ── Body ─────────────────────────────────────────────────────── */}
        <div class="flex min-h-0 flex-1 overflow-hidden">

          {/* ── Palette sidebar ────────────────────────────────────────── */}
          <aside class="flex w-52 flex-none flex-col overflow-hidden border-r border-separator-opaque bg-grouped-surface">
            {/* Header */}
            <div class="shrink-0 border-b border-separator-opaque px-3 py-3">
              <span class="block text-headline font-semibold text-label">Komponenty</span>
            </div>

            {/* Search */}
            <div class="shrink-0 border-b border-separator-opaque px-2 py-2">
              <label class="flex items-center gap-1.5 rounded-md border border-separator-opaque bg-background px-2 py-1.5 focus-within:ring-2 focus-within:ring-ring">
                {SearchIcon}
                <input
                  type="search"
                  class="min-w-0 flex-1 bg-transparent text-callout text-label outline-none placeholder:text-tertiary-label"
                  placeholder="Hledat…"
                  value={query.value}
                  onInput$={(_, el) => { query.value = el.value; }}
                />
              </label>
            </div>

            {/* Scrollable list */}
            <div class="min-h-0 flex-1 overflow-y-auto px-2 py-2">
              {filtered.value.length === 0 ? (
                <p class="px-2 py-4 text-center text-caption-1 text-tertiary-label">
                  Žádná shoda
                </p>
              ) : (
                filtered.value.map((slug) => (
                  <PaletteItem key={slug} slug={slug} />
                ))
              )}
            </div>

            {/* Count */}
            <div class="shrink-0 border-t border-separator-opaque px-3 py-1.5">
              <span class="text-caption-2 text-tertiary-label">
                {filtered.value.length} / {ALL_SLUGS.length}
              </span>
            </div>
          </aside>

          {/* ── Canvas ─────────────────────────────────────────────────── */}
          <main class="min-h-0 flex-1 overflow-y-auto">
            <DsgnCanvas class="p-4" />
          </main>

          {/* ── Properties panel ───────────────────────────────────────── */}
          {panelOpen.value && (
            <aside class="flex w-72 flex-none flex-col overflow-hidden border-l border-separator-opaque bg-grouped-surface">
              <div class="shrink-0 border-b border-separator-opaque px-4 py-3">
                <span class="text-headline font-semibold text-label">Vlastnosti</span>
              </div>
              <DsgnProperties />
            </aside>
          )}
        </div>
      </div>
    </DsgnProvider>
  );
});
