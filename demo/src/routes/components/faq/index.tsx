import { component$ } from "@builder.io/qwik";
import { WebFaq } from "~/components/ui/faq";
import { CodeExample, Desc, TabExample, TabCode } from "~/components/demo/codeexample";

export default component$(() => {
  return (
    <div class="space-y-10">
      <h1 class="text-title-2 text-label">Web — FAQ</h1>
      <CodeExample>
        <Desc>Otázky a odpovědi v elementech <code class="text-caption-1">details</code> (funguje i bez JS).</Desc>
        <TabExample>
          <WebFaq
            title="Časté dotazy"
            items={[
              {
                question: "Jak dlouho trvá realizace?",
                answer: "Typicky několik týdnů podle rozsahu.",
              },
              {
                question: "Pracujete i online?",
                answer: "Ano, většina komunikace probíhá na dálku.",
              },
            ]}
          />
        </TabExample>
        <TabCode>{`<WebFaq title="…" items={[{ question, answer }, …]} />`}</TabCode>
      </CodeExample>
    </div>
  );
});
