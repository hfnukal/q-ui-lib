import { component$ } from "@builder.io/qwik";
import { Button } from "~/components/ui/button";
import { ButtonGroup } from "~/components/ui/button-group";
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
        <h1 class="text-title-2 text-label">ButtonGroup</h1>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Vodorovně</h2>
        <CodeExample>
          <Desc>Vodorovně — viz ukázka níže.</Desc>
          <TabExample>
            <ButtonGroup aria-label="Text actions">
              <Button variant="secondary" onClick$={() => {}}>Left</Button>
              <Button variant="secondary" onClick$={() => {}}>Center</Button>
              <Button variant="secondary" onClick$={() => {}}>Right</Button>
            </ButtonGroup>
          </TabExample>
          <TabCode>{`import { Button } from "~/components/ui/button";
import { ButtonGroup } from "~/components/ui/button-group";

<ButtonGroup aria-label="Text actions">
  <Button variant="secondary" onClick$={() => {}}>Left</Button>
  <Button variant="secondary" onClick$={() => {}}>Center</Button>
  <Button variant="secondary" onClick$={() => {}}>Right</Button>
</ButtonGroup>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Svisle</h2>
        <CodeExample>
          <Desc>Prop <code class="text-caption-1">orientation="vertical"</code> .</Desc>
          <TabExample>
            <ButtonGroup orientation="vertical" aria-label="Stack">
              <Button variant="secondary" onClick$={() => {}}>One</Button>
              <Button variant="secondary" onClick$={() => {}}>Two</Button>
            </ButtonGroup>
          </TabExample>
          <TabCode>{`import { Button } from "~/components/ui/button";
import { ButtonGroup } from "~/components/ui/button-group";

<ButtonGroup orientation="vertical" aria-label="Stack">
  <Button variant="secondary" onClick$={() => {}}>One</Button>
  <Button variant="secondary" onClick$={() => {}}>Two</Button>
</ButtonGroup>`}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Primární varianta</h2>
        <CodeExample>
          <Desc>Stejné sloučení okrajů funguje i u <code class="text-caption-1">primary</code> / <code class="text-caption-1">danger</code>.</Desc>
          <TabExample>
            <ButtonGroup aria-label="Modes">
              <Button variant="primary" onClick$={() => {}}>A</Button>
              <Button variant="primary" onClick$={() => {}}>B</Button>
            </ButtonGroup>
          </TabExample>
          <TabCode>{`import { Button } from "~/components/ui/button";
import { ButtonGroup } from "~/components/ui/button-group";

<ButtonGroup aria-label="Modes">
  <Button variant="primary" onClick$={() => {}}>A</Button>
  <Button variant="primary" onClick$={() => {}}>B</Button>
</ButtonGroup>`}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
