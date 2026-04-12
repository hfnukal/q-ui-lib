import { component$ } from "@builder.io/qwik";
import { CalendarInput } from "~/components/ui/calendar-input";
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
        <h1 class="text-title-2 text-label">CalendarInput</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Základ</h2>
        <CodeExample>
          <Desc>Vstup s textem data (<code class="text-caption-1">LL</code>, locale z dayjs), ikonou kalendáře a panelem <code class="text-caption-1">Calendar.Panel</code> v popoveru.</Desc>
          <TabExample>
            <CalendarInput
              defaultValue="2026-04-12"
              defaultViewMonth="2026-04-01"
              placeholder="např. 12. dubna 2026"
            />
          </TabExample>
          <TabCode>{`import { CalendarInput } from "~/components/ui/calendar-input";

<CalendarInput
  defaultValue="2026-04-12"
  defaultViewMonth="2026-04-01"
  placeholder="např. 12. dubna 2026"
/>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
