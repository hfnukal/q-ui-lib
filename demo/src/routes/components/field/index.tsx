import { component$ } from "@builder.io/qwik";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";
import { Field } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

const codeBasic = `import { Field } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

<Field.Root>
  <Label for="user-email">E-mail</Label>
  <Input id="user-email" type="email" name="email" placeholder="you@example.com" />
</Field.Root>`;

const codeDescription = `import { Field } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

<Field.Root>
  <Label for="display-name">Zobrazované jméno</Label>
  <Input
    id="display-name"
    type="text"
    name="displayName"
    aria-describedby="display-name-hint"
  />
  <Field.Description id="display-name-hint">
    Tak vás uvidí ostatní uživatelé.
  </Field.Description>
</Field.Root>`;

const codeError = `import { Field } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

<Field.Root>
  <Label for="invite-code">Pozvánkový kód</Label>
  <Input
    id="invite-code"
    type="text"
    aria-invalid="true"
    aria-describedby="invite-code-err"
    class="border-system-red focus-visible:ring-system-red"
  />
  <Field.Error id="invite-code-err">Tento kód neexistuje nebo už vypršel.</Field.Error>
</Field.Root>`;

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Field</h1>
        <p class="mt-2 max-w-prose text-body text-secondary-label">
          Obal pro jedno formulářové pole ve stylu shadcn v4:{" "}
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1 text-label">
            Field.Root
          </code>
          ,{" "}
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1 text-label">
            Field.Description
          </code>
          ,{" "}
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1 text-label">
            Field.Error
          </code>
          . Štítek a vstup jsou stávající{" "}
          <code class="text-caption-1">Label</code> a{" "}
          <code class="text-caption-1">Input</code>.
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Základ (Label + Input)</h2>

        <CodeExample>
          <Desc>Základ (Label + Input) — viz ukázka níže.</Desc>
          <TabExample>
            <div class="max-w-md">
              <Field.Root>
                <Label for="demo-field-email">E-mail</Label>
                <Input
                  id="demo-field-email"
                  type="email"
                  name="email"
                  autoComplete="email"
                  placeholder="you@example.com"
                />
              </Field.Root>
            </div>
          </TabExample>
          <TabCode>{codeBasic}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">S popisem</h2>

        <CodeExample>
          <Desc>S popisem — viz ukázka níže.</Desc>
          <TabExample>
            <div class="max-w-md">
              <Field.Root>
                <Label for="demo-field-display">Zobrazované jméno</Label>
                <Input
                  id="demo-field-display"
                  type="text"
                  name="displayName"
                  aria-describedby="demo-field-display-hint"
                  placeholder="Jan Novák"
                />
                <Field.Description id="demo-field-display-hint">
                  Tak vás uvidí ostatní uživatelé.
                </Field.Description>
              </Field.Root>
            </div>
          </TabExample>
          <TabCode>{codeDescription}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Chybový stav</h2>

        <CodeExample>
          <Desc>Chybový stav — viz ukázka níže.</Desc>
          <TabExample>
            <div class="max-w-md">
              <Field.Root>
                <Label for="demo-field-invite">Pozvánkový kód</Label>
                <Input
                  id="demo-field-invite"
                  type="text"
                  aria-invalid={true}
                  aria-describedby="demo-field-invite-err"
                  class="border-system-red focus-visible:ring-system-red"
                  placeholder="ABC-123"
                />
                <Field.Error id="demo-field-invite-err">
                  Tento kód neexistuje nebo už vypršel.
                </Field.Error>
              </Field.Root>
            </div>
          </TabExample>
          <TabCode>{codeError}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
