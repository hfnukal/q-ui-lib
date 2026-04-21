import { $, component$ } from "@builder.io/qwik";
import { WebNewsletter } from "~/components/ui/newsletter";
import { CodeExample, Desc, TabExample, TabCode } from "~/components/demo/codeexample";

export default component$(() => {
  return (
    <div class="space-y-10">
      <h1 class="text-title-2 text-label">Web — newsletter</h1>
      <CodeExample>
        <Desc>Přihlášení e-mailem; v ukázce jen <code class="text-caption-1">alert</code>.</Desc>
        <TabExample>
          <WebNewsletter
            title="Novinky e-mailem"
            description="Bez spamu."
            buttonLabel="Přihlásit"
            onSubmit$={$(() => {
              alert("Ukázka: odešlete e-mail na backend.");
            })}
          />
        </TabExample>
        <TabCode>{`<WebNewsletter
  title="Novinky e-mailem"
  onSubmit$={$((ev) => { /* email */ })}
/>`}</TabCode>
      </CodeExample>
    </div>
  );
});
