import { component$ } from "@builder.io/qwik";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";
import { KbdShortcut } from "~/components/ui/kbd-shortcut";

const codeBasic = `import { KbdShortcut } from "~/components/ui/kbd-shortcut";

<KbdShortcut>⌘K</KbdShortcut>`;

const codeMultiple = `import { KbdShortcut } from "~/components/ui/kbd-shortcut";

<span class="flex items-center gap-1">
  <KbdShortcut>Ctrl</KbdShortcut>
  <KbdShortcut>Shift</KbdShortcut>
  <KbdShortcut>P</KbdShortcut>
</span>`;

const codeInline = `import { KbdShortcut } from "~/components/ui/kbd-shortcut";

<p class="text-body text-secondary-label">
  Stiskni <KbdShortcut>⌘S</KbdShortcut> pro uložení nebo{" "}
  <KbdShortcut>Esc</KbdShortcut> pro zrušení.
</p>`;

export default component$(() => (
  <div class="space-y-10">
    <div>
      <h1 class="text-title-2 text-label">KbdShortcut</h1>
      <p class="mt-2 max-w-prose text-body text-secondary-label">
        Stylovaný{" "}
        <code class="rounded bg-fill-secondary px-1 py-0.5 text-caption-1 text-label">
          &lt;kbd&gt;
        </code>{" "}
        prvek pro zobrazení klávesových zkratek. Funguje inline i ve skupinách.
      </p>
    </div>

    <section class="space-y-3">
      <h2 class="text-headline text-label">Základní použití</h2>

      <CodeExample>
        <Desc>Základní použití — viz ukázka níže.</Desc>
        <TabExample>
          <KbdShortcut>⌘K</KbdShortcut>
        </TabExample>
        <TabCode>{codeBasic}</TabCode>
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
        <TabCode>{codeMultiple}</TabCode>
      </CodeExample>
    </section>

    <section class="space-y-3">
      <h2 class="text-headline text-label">Inline v textu</h2>

      <CodeExample>
        <Desc>
          Zkratky vložené přímo do věty — čitelné vedle běžného textu.
        </Desc>
        <TabExample>
          <p class="text-body text-secondary-label">
            Stiskni <KbdShortcut>⌘S</KbdShortcut> pro uložení nebo{" "}
            <KbdShortcut>Esc</KbdShortcut> pro zrušení.
          </p>
        </TabExample>
        <TabCode>{codeInline}</TabCode>
      </CodeExample>
    </section>
  </div>
));
