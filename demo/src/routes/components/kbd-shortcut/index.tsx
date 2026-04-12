import { component$ } from "@builder.io/qwik";
import { KbdShortcut } from "~/components/ui/kbd-shortcut";
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
        <h1 class="text-title-2 text-label">KbdShortcut</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Základní použití</h2>
        <CodeExample>
          <Desc>Základní použití — viz ukázka níže.</Desc>
          <TabExample>
            <KbdShortcut>⌘K</KbdShortcut>
          </TabExample>
          <TabCode>{`import { KbdShortcut } from "~/components/ui/kbd-shortcut";

<KbdShortcut>⌘K</KbdShortcut>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Více kláves</h2>
        <CodeExample>
          <Desc>Více instancí vedle sebe pro víceznakové zkratky.</Desc>
          <TabExample>
            <span class="flex items-center gap-1">
              <KbdShortcut>Ctrl</KbdShortcut>
              <KbdShortcut>Shift</KbdShortcut>
              <KbdShortcut>P</KbdShortcut>
            </span>
          </TabExample>
          <TabCode>{`import { KbdShortcut } from "~/components/ui/kbd-shortcut";

<span class="flex items-center gap-1">
  <KbdShortcut>Ctrl</KbdShortcut>
  <KbdShortcut>Shift</KbdShortcut>
  <KbdShortcut>P</KbdShortcut>
</span>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Inline v textu</h2>
        <CodeExample>
          <Desc>Zkratky vložené přímo do věty — čitelné vedle běžného textu.</Desc>
          <TabExample>
            <p class="text-body text-secondary-label">
              Stiskni <KbdShortcut>⌘S</KbdShortcut> pro uložení nebo{" "}
              <KbdShortcut>Esc</KbdShortcut> pro zrušení.
            </p>
          </TabExample>
          <TabCode>{`import { KbdShortcut } from "~/components/ui/kbd-shortcut";

<p class="text-body text-secondary-label">
  Stiskni <KbdShortcut>⌘S</KbdShortcut> pro uložení nebo{" "}
  <KbdShortcut>Esc</KbdShortcut> pro zrušení.
</p>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
