import { $, component$, useSignal } from "@builder.io/qwik";
import { Calendar } from "~/components/ui/calendar";
import { CalendarInput } from "~/components/ui/calendar-input";
import { Field } from "~/components/ui/field";
import { Label } from "~/components/ui/label";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";

export const _Example1 = component$(() => {
  const selected = useSignal<string | undefined>(undefined);
  return (
    <Calendar.Panel
      defaultViewMonth="2026-04-01"
      selected={selected.value}
      onSelect$={$((iso) => {
        selected.value = iso;
      })}
    />
  );
});

export const Demo = component$(() => {
  const picked = useSignal("2026-04-12");
  return (
    <Field.Root>
      <Label for="cal-demo">Datum</Label>
      <CalendarInput
        inputId="cal-demo"
        value={picked.value}
        placeholder="např. 12. dubna 2026"
        onValueChange$={$((iso) => {
          picked.value = iso;
        })}
      />
    </Field.Root>
  );
});

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Calendar</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Calendar.Panel</h2>
        <CodeExample>
          <Desc>Zkratka nad stejnými díly — navigace, titulek, záhlaví týdne a mřížka.</Desc>
          <TabExample>
            <_Example1 />
          </TabExample>
          <TabCode>{`import { $, useSignal } from "@builder.io/qwik";
import { Calendar } from "~/components/ui/calendar";

export default component$(() => {
  const selected = useSignal<string | undefined>(undefined);
  return (
    <Calendar.Panel
      defaultViewMonth="2026-04-01"
      selected={selected.value}
      onSelect$={$((iso) => {
        selected.value = iso;
      })}
    />
  );
});`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Složené API</h2>
        <CodeExample>
          <Desc><code class="text-caption-1">Calendar.Root</code> s vlastním rozložením (stejné podkomponenty jako u Panel).</Desc>
          <TabExample>
            <Calendar.Root defaultViewMonth="2026-04-01" weekStartsOn={1}>
              <div class="flex flex-col gap-2">
                <div class="flex items-center gap-1 px-0.5">
                  <Calendar.PrevButton>
                    <span aria-hidden="true">‹</span>
                  </Calendar.PrevButton>
                  <Calendar.Caption format="MMMM YYYY" />
                  <Calendar.NextButton>
                    <span aria-hidden="true">›</span>
                  </Calendar.NextButton>
                </div>
                <Calendar.Weekdays />
                <Calendar.Grid />
              </div>
            </Calendar.Root>
          </TabExample>
          <TabCode>{`import { Calendar } from "~/components/ui/calendar";

<Calendar.Root defaultViewMonth="2026-04-01" weekStartsOn={1}>
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-1 px-0.5">
      <Calendar.PrevButton>
        <span aria-hidden="true">‹</span>
      </Calendar.PrevButton>
      <Calendar.Caption format="MMMM YYYY" />
      <Calendar.NextButton>
        <span aria-hidden="true">›</span>
      </Calendar.NextButton>
    </div>
    <Calendar.Weekdays />
    <Calendar.Grid />
  </div>
</Calendar.Root>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Controlled měsíc a min / max</h2>
        <CodeExample>
          <Desc><code class="text-caption-1">viewMonth</code> + <code class="text-caption-1">onViewMonthChange, omezení rozsahu </code>minDate<code class="text-caption-1"> / </code>maxDate<code class="text-caption-1"> (řetězce </code>YYYY-MM-DD`).</Desc>
          <TabExample>
            {(() => {
              const viewMonth = useSignal("2026-04-01");
              const selected = useSignal<string | undefined>(undefined);
              return (
                <Calendar.Panel
                  viewMonth={viewMonth.value}
                  onViewMonthChange$={$((iso) => {
                    viewMonth.value = iso;
                  })}
                  selected={selected.value}
                  onSelect$={$((iso) => {
                    selected.value = iso;
                  })}
                  minDate="2026-04-05"
                  maxDate="2026-04-25"
                />
              );
            })()}
          </TabExample>
          <TabCode>{`import { $, component$, useSignal } from "@builder.io/qwik";
import { Calendar } from "~/components/ui/calendar";

const viewMonth = useSignal("2026-04-01");
const selected = useSignal<string | undefined>(undefined);

<Calendar.Panel
  viewMonth={viewMonth.value}
  onViewMonthChange$={$((iso) => {
    viewMonth.value = iso;
  })}
  selected={selected.value}
  onSelect$={$((iso) => {
    selected.value = iso;
  })}
  minDate="2026-04-05"
  maxDate="2026-04-25"
/>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Pole data (CalendarInput)</h2>
        <CodeExample>
          <Desc>Vstup s textem <code class="text-caption-1">LL</code>, popover a <code class="text-caption-1">Calendar.Panel</code> — komponenta <code class="text-caption-1">CalendarInput</code> (<code class="text-caption-1">calendar-input</code>). Lze obalit <code class="text-caption-1">Field</code> / <code class="text-caption-1">Label</code>.</Desc>
          <TabExample>
            <Demo />
          </TabExample>
          <TabCode>{`import { $, component$, useSignal } from "@builder.io/qwik";
import { CalendarInput } from "~/components/ui/calendar-input";
import { Field } from "~/components/ui/field";
import { Label } from "~/components/ui/label";

export const Demo = component$(() => {
  const picked = useSignal("2026-04-12");
  return (
    <Field.Root>
      <Label for="cal-demo">Datum</Label>
      <CalendarInput
        inputId="cal-demo"
        value={picked.value}
        placeholder="např. 12. dubna 2026"
        onValueChange$={$((iso) => {
          picked.value = iso;
        })}
      />
    </Field.Root>
  );
});`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
