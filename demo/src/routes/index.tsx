import { component$ } from "@builder.io/qwik";
import { Link, type DocumentHead } from "@builder.io/qwik-city";

export default component$(() => {
  return (
    <div class="min-h-screen bg-slate-50 px-6 py-12 text-slate-800">
      <h1 class="text-3xl font-semibold tracking-tight text-slate-900">
        Hi 👋
      </h1>
      <p class="mt-4 max-w-prose text-slate-600">
        Tailwind CSS and{" "}
        <code class="rounded bg-slate-200 px-1.5 py-0.5 text-sm">
          @qwik-ui/headless
        </code>{" "}
        are configured. Icons use{" "}
        <code class="rounded bg-slate-200 px-1.5 py-0.5 text-sm">
          @qwikest/icons/lucide
        </code>{" "}
        (e.g. <code class="text-sm">LuSearch</code>). Add UI blocks with{" "}
        <code class="rounded bg-slate-200 px-1.5 py-0.5 text-sm">
          npm run q -- add …
        </code>{" "}
        from the library repo.
      </p>
      <p><Link href="/admin">Admin</Link></p>
    </div>
  );
});

export const head: DocumentHead = {
  title: "Welcome to Qwik",
  meta: [
    {
      name: "description",
      content: "Qwik site description",
    },
  ],
};
