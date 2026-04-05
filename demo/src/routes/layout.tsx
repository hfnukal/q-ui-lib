import { component$, Slot } from "@builder.io/qwik";
import { Link, useLocation } from "@builder.io/qwik-city";

function normalizePath(path: string) {
  const p = path.replace(/\/$/, "") || "/";
  return p;
}

function navLinkClass(active: boolean) {
  return [
    "block rounded-md px-2 py-1 -mx-2 text-left text-sm transition-colors",
    active
      ? "bg-slate-900 font-semibold text-white"
      : "text-slate-700 hover:bg-slate-200/80",
  ].join(" ");
}

export default component$(() => {
  const loc = useLocation();
  const current = normalizePath(loc.url.pathname);

  return (
    <div class="min-h-screen bg-slate-50 px-6 py-12 text-slate-800">
      <header class="mb-8">
        <h1 class="text-3xl font-semibold tracking-tight text-slate-900">
          UI Lib Demo 👋
        </h1>
      </header>
      <div class="flex gap-8">
        <nav class="flex shrink-0 flex-col gap-1 border-r border-slate-200 pr-6">
          <Link class={navLinkClass(current === normalizePath("/"))} href="/">
            Home
          </Link>
          <Link
            class={navLinkClass(current === normalizePath("/button"))}
            href="/button"
          >
            Button
          </Link>
          <Link
            class={navLinkClass(current === normalizePath("/accordion"))}
            href="/accordion"
          >
            Accordion
          </Link>
          <Link
            class={navLinkClass(current === normalizePath("/tabs"))}
            href="/tabs"
          >
            Tabs
          </Link>
        </nav>
        <main class="min-w-0 flex-1">
          <Slot />
        </main>
      </div>
    </div>
  );
});