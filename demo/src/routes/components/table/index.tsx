import { component$ } from "@builder.io/qwik";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";
import { Badge } from "~/components/ui/badge";
import { Table } from "~/components/ui/table";

const codeBasic = `import { Table } from "~/components/ui/table";

<Table.Root class="max-w-2xl rounded-lg border border-separator-opaque">
  <Table.Header>
    <Table.Row>
      <Table.Head>Název</Table.Head>
      <Table.Head>Stav</Table.Head>
      <Table.Head class="text-right">Částka</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell class="font-medium">Projekt Alpha</Table.Cell>
      <Table.Cell>
        <span class="text-secondary-label">Aktivní</span>
      </Table.Cell>
      <Table.Cell class="text-right">12 400 Kč</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell class="font-medium">Projekt Beta</Table.Cell>
      <Table.Cell>
        <span class="text-secondary-label">Návrh</span>
      </Table.Cell>
      <Table.Cell class="text-right">8 200 Kč</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table.Root>`;

const codeCaptionFooter = `import { Table } from "~/components/ui/table";

<Table.Root class="max-w-2xl rounded-lg border border-separator-opaque">
  <Table.Caption>Fakturace za období Q1</Table.Caption>
  <Table.Header>
    <Table.Row>
      <Table.Head>Položka</Table.Head>
      <Table.Head class="text-right">Hodnota</Table.Head>
    </Table.Row>
  </Table.Header>
  <Table.Body>
    <Table.Row>
      <Table.Cell>Licence</Table.Cell>
      <Table.Cell class="text-right">99 €</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Podpora</Table.Cell>
      <Table.Cell class="text-right">49 €</Table.Cell>
    </Table.Row>
  </Table.Body>
  <Table.Footer>
    <Table.Row>
      <Table.Cell>Celkem</Table.Cell>
      <Table.Cell class="text-right font-semibold">148 €</Table.Cell>
    </Table.Row>
  </Table.Footer>
</Table.Root>`;

const codeSelected = `import { Table } from "~/components/ui/table";

<Table.Root class="max-w-xl rounded-lg border border-separator-opaque">
  <Table.Body>
    <Table.Row data-state="selected">
      <Table.Cell>Vybraný řádek</Table.Cell>
      <Table.Cell class="text-secondary-label">data-state=&quot;selected&quot;</Table.Cell>
    </Table.Row>
    <Table.Row>
      <Table.Cell>Běžný řádek</Table.Cell>
      <Table.Cell class="text-secondary-label">hover pro zvýraznění</Table.Cell>
    </Table.Row>
  </Table.Body>
</Table.Root>`;

export default component$(() => {
  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Table</h1>
        <p class="mt-2 max-w-prose text-body text-secondary-label">
          Sémantická tabulka (`table`, `thead`, `tbody`, …) se styly z tokenů v{" "}
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1 text-label">
            COLORS.md
          </code>
          . Bez @qwik-ui/headless — viz{" "}
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1 text-label">
            CREATE.md
          </code>
          ,{" "}
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1 text-label">
            BASE_COMPONENTS.md
          </code>
          .
        </p>
      </div>

      <section class="space-y-4">
        <h2 class="text-title-3 text-label">Základní tabulka</h2>

        <CodeExample>
          <Desc>Základní tabulka — viz ukázka níže.</Desc>
          <TabExample>
            <Table.Root class="max-w-2xl rounded-lg border border-separator-opaque">
              <Table.Header>
                <Table.Row>
                  <Table.Head>Název</Table.Head>
                  <Table.Head>Stav</Table.Head>
                  <Table.Head class="text-right">Částka</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell class="font-medium">Projekt Alpha</Table.Cell>
                  <Table.Cell>
                    <Badge variant="secondary">Aktivní</Badge>
                  </Table.Cell>
                  <Table.Cell class="text-right tabular-nums">
                    12 400 Kč
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell class="font-medium">Projekt Beta</Table.Cell>
                  <Table.Cell>
                    <span class="text-secondary-label">Návrh</span>
                  </Table.Cell>
                  <Table.Cell class="text-right tabular-nums">
                    8 200 Kč
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
          </TabExample>
          <TabCode>{codeBasic}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-4">
        <h2 class="text-title-3 text-label">Caption a Footer</h2>

        <CodeExample>
          <Desc>Caption a Footer — viz ukázka níže.</Desc>
          <TabExample>
            <Table.Root class="max-w-2xl rounded-lg border border-separator-opaque">
              <Table.Caption>Fakturace za období Q1</Table.Caption>
              <Table.Header>
                <Table.Row>
                  <Table.Head>Položka</Table.Head>
                  <Table.Head class="text-right">Hodnota</Table.Head>
                </Table.Row>
              </Table.Header>
              <Table.Body>
                <Table.Row>
                  <Table.Cell>Licence</Table.Cell>
                  <Table.Cell class="text-right tabular-nums">99 €</Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Podpora</Table.Cell>
                  <Table.Cell class="text-right tabular-nums">49 €</Table.Cell>
                </Table.Row>
              </Table.Body>
              <Table.Footer>
                <Table.Row>
                  <Table.Cell>Celkem</Table.Cell>
                  <Table.Cell class="text-right font-semibold tabular-nums">
                    148 €
                  </Table.Cell>
                </Table.Row>
              </Table.Footer>
            </Table.Root>
          </TabExample>
          <TabCode>{codeCaptionFooter}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-4">
        <h2 class="text-title-3 text-label">Stav řádku</h2>

        <CodeExample>
          <Desc>
            Pro zvýraznění vybraného řádku nastav na{" "}
            <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1">
              Table.Row
            </code>{" "}
            atribut{" "}
            <code class="text-caption-1">data-state=&quot;selected&quot;</code>.
          </Desc>
          <TabExample>
            <Table.Root class="max-w-xl rounded-lg border border-separator-opaque">
              <Table.Body>
                <Table.Row data-state="selected">
                  <Table.Cell>Vybraný řádek</Table.Cell>
                  <Table.Cell class="text-secondary-label">
                    data-state=&quot;selected&quot;
                  </Table.Cell>
                </Table.Row>
                <Table.Row>
                  <Table.Cell>Běžný řádek</Table.Cell>
                  <Table.Cell class="text-secondary-label">
                    hover pro zvýraznění
                  </Table.Cell>
                </Table.Row>
              </Table.Body>
            </Table.Root>
          </TabExample>
          <TabCode>{codeSelected}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
