import { component$ } from "@builder.io/qwik";
import { type DocumentHead } from "@builder.io/qwik-city";
import { Badge } from "~/components/ui/badge";
import { Button } from "~/components/ui/button";
import { Card } from "~/components/ui/card";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { CodeEdit } from "~/components/ui/code-edit";

export default component$(() => {
  return (
    <div class="min-h-screen bg-slate-50 px-6 py-12 text-slate-800">
      <h1 class="text-3xl font-semibold tracking-tight text-slate-900">
        q-ui-lib — demo
      </h1>
      <p class="mt-3 max-w-prose text-base text-slate-700">
        Tato aplikace je ukázkové prostředí pro knihovnu Qwik UI komponent s Tailwindem.
        Komponenty si do vlastního projektu zkopírujete přes CLI knihovny (
        <code class="rounded bg-slate-200 px-1.5 py-0.5 text-sm">qui</code>
        ); tady je můžete prohlížet a vyzkoušet v kontextu Qwik City.
      </p>
      <div class="mt-4 max-w-prose text-slate-600">
        <p>
          Tailwind CSS a{" "}
          <code class="rounded bg-slate-200 px-1.5 py-0.5 text-sm">
            @qwik-ui/headless
          </code>{" "}
          jsou nakonfigurované. Ikony přes{" "}
          <code class="rounded bg-slate-200 px-1.5 py-0.5 text-sm">
            @qwikest/icons/lucide
          </code>{" "}
          (např. <code class="text-sm">LuSearch</code>). Bloky přidáte z repozitáře knihovny příkazem:
        </p>
        <CodeEdit
          readOnly
          language="text"
          value="npm run qui -- add ../MyApp Button Input"
          rows={2}
          class="mt-2"
        />
      </div>

      <section class="mt-10 border-t border-separator-opaque pt-10">
        <h2 class="text-xl font-semibold text-slate-900">Ukázka komponent</h2>
        <p class="mt-2 max-w-prose text-slate-600">
          Několik základních komponent z knihovny — stejné zdroje jako v celém demu (
          <code class="rounded bg-slate-200 px-1.5 py-0.5 text-sm">~/components/ui</code>
          ).
        </p>

        <div class="mt-8 grid max-w-4xl gap-10 lg:grid-cols-2">
          <div>
            <h3 class="text-sm font-medium uppercase tracking-wide text-slate-500">
              Button
            </h3>
            <div class="mt-3 flex flex-wrap gap-2">
              <Button variant="primary">Primary</Button>
              <Button variant="secondary">Secondary</Button>
              <Button variant="danger">Danger</Button>
              <Button size="sm" variant="secondary">
                Malý
              </Button>
            </div>
          </div>

          <div>
            <h3 class="text-sm font-medium uppercase tracking-wide text-slate-500">
              Badge
            </h3>
            <div class="mt-3 flex flex-wrap items-center gap-2">
              <Badge variant="default">Default</Badge>
              <Badge variant="secondary">Secondary</Badge>
              <Badge variant="outline">Outline</Badge>
              <Badge variant="destructive">Destructive</Badge>
              <Badge size="sm" variant="secondary">
                SM
              </Badge>
            </div>
          </div>

          <div class="lg:col-span-2">
            <h3 class="text-sm font-medium uppercase tracking-wide text-slate-500">
              Card, Label, Input
            </h3>
            <Card.Root class="mt-3 max-w-lg">
              <Card.Header>
                <Card.Title>Rychlý kontakt</Card.Title>
                <Card.Description>
                  Ukázka složené karty s formulářovým polem — styly podle design tokenů.
                </Card.Description>
                <Card.Action>
                  <Badge variant="outline">Ukázka</Badge>
                </Card.Action>
              </Card.Header>
              <Card.Content class="flex flex-col gap-3">
                <div class="flex flex-col gap-2">
                  <Label for="demo-home-email">E-mail</Label>
                  <Input
                    id="demo-home-email"
                    type="email"
                    name="email"
                    placeholder="you@example.com"
                    autoComplete="email"
                  />
                </div>
              </Card.Content>
              <Card.Footer class="gap-2">
                <Button variant="secondary" size="sm">
                  Zrušit
                </Button>
                <Button size="sm">Odeslat</Button>
              </Card.Footer>
            </Card.Root>
          </div>
        </div>
      </section>

    </div>
  );
});

export const head: DocumentHead = {
  title: "q-ui-lib — demo",
  meta: [
    {
      name: "description",
      content:
        "Ukázková Qwik City aplikace pro knihovnu q-ui-lib: komponenty, Tailwind a CLI pro kopírování do vlastního projektu.",
    },
  ],
};
