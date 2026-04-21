/**
 * @component table
 * @title Table
 * @version 1.0.0
 * @example Základní tabulka
 * Základní tabulka — viz ukázka níže.
 * ```tsx
 * import { Table } from "~/components/ui/table";
 * 
 * <Table.Root class="max-w-2xl rounded-lg border border-separator-opaque">
 *   <Table.Header>
 *     <Table.Row>
 *       <Table.Head>Název</Table.Head>
 *       <Table.Head>Stav</Table.Head>
 *       <Table.Head class="text-right">Částka</Table.Head>
 *     </Table.Row>
 *   </Table.Header>
 *   <Table.Body>
 *     <Table.Row>
 *       <Table.Cell class="font-medium">Projekt Alpha</Table.Cell>
 *       <Table.Cell>
 *         <span class="text-secondary-label">Aktivní</span>
 *       </Table.Cell>
 *       <Table.Cell class="text-right">12 400 Kč</Table.Cell>
 *     </Table.Row>
 *     <Table.Row>
 *       <Table.Cell class="font-medium">Projekt Beta</Table.Cell>
 *       <Table.Cell>
 *         <span class="text-secondary-label">Návrh</span>
 *       </Table.Cell>
 *       <Table.Cell class="text-right">8 200 Kč</Table.Cell>
 *     </Table.Row>
 *   </Table.Body>
 * </Table.Root>
 * ```
 *
 * @example Caption a Footer
 * Caption a Footer — viz ukázka níže.
 * ```tsx
 * import { Table } from "~/components/ui/table";
 * 
 * <Table.Root class="max-w-2xl rounded-lg border border-separator-opaque">
 *   <Table.Caption>Fakturace za období Q1</Table.Caption>
 *   <Table.Header>
 *     <Table.Row>
 *       <Table.Head>Položka</Table.Head>
 *       <Table.Head class="text-right">Hodnota</Table.Head>
 *     </Table.Row>
 *   </Table.Header>
 *   <Table.Body>
 *     <Table.Row>
 *       <Table.Cell>Licence</Table.Cell>
 *       <Table.Cell class="text-right">99 €</Table.Cell>
 *     </Table.Row>
 *     <Table.Row>
 *       <Table.Cell>Podpora</Table.Cell>
 *       <Table.Cell class="text-right">49 €</Table.Cell>
 *     </Table.Row>
 *   </Table.Body>
 *   <Table.Footer>
 *     <Table.Row>
 *       <Table.Cell>Celkem</Table.Cell>
 *       <Table.Cell class="text-right font-semibold">148 €</Table.Cell>
 *     </Table.Row>
 *   </Table.Footer>
 * </Table.Root>
 * ```
 *
 * @example Stav řádku
 * Pro zvýraznění vybraného řádku nastav na `Table.Row` atribut `data-state=&quot;selected&quot;`.
 * ```tsx
 * import { Table } from "~/components/ui/table";
 * 
 * <Table.Root class="max-w-xl rounded-lg border border-separator-opaque">
 *   <Table.Body>
 *     <Table.Row data-state="selected">
 *       <Table.Cell>Vybraný řádek</Table.Cell>
 *       <Table.Cell class="text-secondary-label">data-state=&quot;selected&quot;</Table.Cell>
 *     </Table.Row>
 *     <Table.Row>
 *       <Table.Cell>Běžný řádek</Table.Cell>
 *       <Table.Cell class="text-secondary-label">hover pro zvýraznění</Table.Cell>
 *     </Table.Row>
 *   </Table.Body>
 * </Table.Root>
 * ```
 
 
 
 
 
 
 
 
 
 */

import { component$, type PropsOf, Slot } from "@builder.io/qwik";

export type TableRootProps = PropsOf<"table">;

/**
 * Obal s vodorovným scrollnutím a vnitřní `<table>`. Děti (`Table.Header`, `Table.Body`, …) patří přímo do tabulky.
 * Poznámka: `<caption>` musí být první potomek `<table>` (použij {@link TableCaption}).
 */
export const TableRoot = component$<TableRootProps>((props) => {
  const { class: className, ...rest } = props;
  const base =
    "w-full caption-bottom border-collapse text-body text-label";
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <div class="relative w-full overflow-x-auto">
      <table {...rest} class={merged}>
        <Slot />
      </table>
    </div>
  );
});

export type TableHeaderProps = PropsOf<"thead">;

/** Hlavičková sekce — spodní okraj řádků v hlavičce. */
export const TableHeader = component$<TableHeaderProps>((props) => {
  const { class: className, ...rest } = props;
  const base = "[&_tr]:border-b border-separator-opaque";
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <thead {...rest} class={merged}>
      <Slot />
    </thead>
  );
});

export type TableBodyProps = PropsOf<"tbody">;

/** Tělo tabulky — poslední řádek bez spodního rámečku. */
export const TableBody = component$<TableBodyProps>((props) => {
  const { class: className, ...rest } = props;
  const base = "[&_tr:last-child]:border-0";
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <tbody {...rest} class={merged}>
      <Slot />
    </tbody>
  );
});

export type TableFooterProps = PropsOf<"tfoot">;

/** Patička — horní oddělovač, jemné pozadí (součty, akce). */
export const TableFooter = component$<TableFooterProps>((props) => {
  const { class: className, ...rest } = props;
  const base =
    "border-t border-separator-opaque bg-fill-tertiary/30 font-medium [&>tr]:last:border-b-0";
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <tfoot {...rest} class={merged}>
      <Slot />
    </tfoot>
  );
});

export type TableRowProps = PropsOf<"tr">;

/** Řádek — oddělovač a zvýraznění při hoveru / výběru (`data-state=selected`). */
export const TableRow = component$<TableRowProps>((props) => {
  const { class: className, ...rest } = props;
  const base =
    "border-b border-separator-opaque transition-colors hover:bg-fill-tertiary/40 data-[state=selected]:bg-fill-secondary/30";
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <tr {...rest} class={merged}>
      <Slot />
    </tr>
  );
});

export type TableHeadProps = PropsOf<"th">;

/** Buňka hlavičky — zarovnání a sekundární barva textu. */
export const TableHead = component$<TableHeadProps>((props) => {
  const { class: className, ...rest } = props;
  const base =
    "h-12 px-3 text-left align-middle font-medium text-secondary-label [&:has([role=checkbox])]:pr-0";
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <th {...rest} class={merged}>
      <Slot />
    </th>
  );
});

export type TableCellProps = PropsOf<"td">;

/** Datová buňka. */
export const TableCell = component$<TableCellProps>((props) => {
  const { class: className, ...rest } = props;
  const base = "p-3 align-middle [&:has([role=checkbox])]:pr-0";
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <td {...rest} class={merged}>
      <Slot />
    </td>
  );
});

export type TableCaptionProps = PropsOf<"caption">;

/** Titulek tabulky — umísti jako první dítě uvnitř {@link TableRoot}. */
export const TableCaption = component$<TableCaptionProps>((props) => {
  const { class: className, ...rest } = props;
  const base = "mt-4 text-caption-1 text-secondary-label";
  const merged = [base, className].filter(Boolean).join(" ");

  return (
    <caption {...rest} class={merged}>
      <Slot />
    </caption>
  );
});

/** Namespace: `Table.Root`, `Table.Header`, `Table.Body`, … */
export const Table = {
  Root: TableRoot,
  Header: TableHeader,
  Body: TableBody,
  Footer: TableFooter,
  Row: TableRow,
  Head: TableHead,
  Cell: TableCell,
  Caption: TableCaption,
};
