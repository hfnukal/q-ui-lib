import { component$ } from "@builder.io/qwik";
import { Field } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
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
        <h1 class="text-title-2 text-label">Field</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Základ (Label + Input)</h2>
        <CodeExample>
          <Desc>Základ (Label + Input) — viz ukázka níže.</Desc>
          <TabExample>
            <Field.Root>
              <Label for="user-email">E-mail</Label>
              <Input id="user-email" type="email" name="email" placeholder="you@example.com" />
            </Field.Root>
          </TabExample>
          <TabCode>{`import { Field } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

<Field.Root>
  <Label for="user-email">E-mail</Label>
  <Input id="user-email" type="email" name="email" placeholder="you@example.com" />
</Field.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">S popisem</h2>
        <CodeExample>
          <Desc>S popisem — viz ukázka níže.</Desc>
          <TabExample>
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
            </Field.Root>
          </TabExample>
          <TabCode>{`import { Field } from "~/components/ui/field";
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
</Field.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Chybový stav</h2>
        <CodeExample>
          <Desc>Chybový stav — viz ukázka níže.</Desc>
          <TabExample>
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
            </Field.Root>
          </TabExample>
          <TabCode>{`import { Field } from "~/components/ui/field";
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
</Field.Root>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
