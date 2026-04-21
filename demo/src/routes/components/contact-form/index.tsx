import { $, component$ } from "@builder.io/qwik";
import { WebContactForm } from "~/components/ui/contact-form";
import { CodeExample, Desc, TabExample, TabCode } from "~/components/demo/codeexample";

export default component$(() => {
  return (
    <div class="space-y-10">
      <h1 class="text-title-2 text-label">Web — kontaktní formulář</h1>
      <CodeExample>
        <Desc>Odeslání zpracujte v <code class="text-caption-1">onSubmit$</code> (zde jen <code class="text-caption-1">alert</code>).</Desc>
        <TabExample>
          <WebContactForm
            title="Napište nám"
            description="Jméno, e-mail a zpráva."
            submitLabel="Odeslat"
            onSubmit$={$(() => {
              alert("Ukázka: napojte odeslání na API.");
            })}
          />
        </TabExample>
        <TabCode>{`<WebContactForm
  title="Napište nám"
  submitLabel="Odeslat"
  onSubmit$={$((ev) => { /* FormData */ })}
/>`}</TabCode>
      </CodeExample>
    </div>
  );
});
