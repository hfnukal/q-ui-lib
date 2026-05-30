/**
 * @component table
 * @title Table
 * @version 1.0.0
 * @example Basic table
 * Basic table — see the example below.
 * ```tsx
 * import { Table } from "~/components/ui/base/table";
 * 
 * <Table.Root class="max-w-2xl rounded-lg border border-separator-opaque">
 *   <Table.Header>
 *     <Table.Row>
 *       <Table.Head>Name</Table.Head>
 *       <Table.Head>Status</Table.Head>
 *       <Table.Head class="text-right">Amount</Table.Head>
 *     </Table.Row>
 *   </Table.Header>
 *   <Table.Body>
 *     <Table.Row>
 *       <Table.Cell class="font-medium">Project Alpha</Table.Cell>
 *       <Table.Cell>
 *         <span class="text-secondary-label">Active</span>
 *       </Table.Cell>
 *       <Table.Cell class="text-right">$12,400</Table.Cell>
 *     </Table.Row>
 *     <Table.Row>
 *       <Table.Cell class="font-medium">Project Beta</Table.Cell>
 *       <Table.Cell>
 *         <span class="text-secondary-label">Draft</span>
 *       </Table.Cell>
 *       <Table.Cell class="text-right">$8,200</Table.Cell>
 *     </Table.Row>
 *   </Table.Body>
 * </Table.Root>
 * ```
 *
 * @example Caption and Footer
 * Caption and Footer — see the example below.
 * ```tsx
 * import { Table } from "~/components/ui/base/table";
 * 
 * <Table.Root class="max-w-2xl rounded-lg border border-separator-opaque">
 *   <Table.Caption>Invoicing for Q1</Table.Caption>
 *   <Table.Header>
 *     <Table.Row>
 *       <Table.Head>Item</Table.Head>
 *       <Table.Head class="text-right">Value</Table.Head>
 *     </Table.Row>
 *   </Table.Header>
 *   <Table.Body>
 *     <Table.Row>
 *       <Table.Cell>License</Table.Cell>
 *       <Table.Cell class="text-right">99 €</Table.Cell>
 *     </Table.Row>
 *     <Table.Row>
 *       <Table.Cell>Support</Table.Cell>
 *       <Table.Cell class="text-right">49 €</Table.Cell>
 *     </Table.Row>
 *   </Table.Body>
 *   <Table.Footer>
 *     <Table.Row>
 *       <Table.Cell>Total</Table.Cell>
 *       <Table.Cell class="text-right font-semibold">148 €</Table.Cell>
 *     </Table.Row>
 *   </Table.Footer>
 * </Table.Root>
 * ```
 *
 * @example Row state
 * To highlight the selected row, set the `data-state=&quot;selected&quot;` attribute on `Table.Row`.
 * ```tsx
 * import { Table } from "~/components/ui/base/table";
 * 
 * <Table.Root class="max-w-xl rounded-lg border border-separator-opaque">
 *   <Table.Body>
 *     <Table.Row data-state="selected">
 *       <Table.Cell>Selected row</Table.Cell>
 *       <Table.Cell class="text-secondary-label">data-state=&quot;selected&quot;</Table.Cell>
 *     </Table.Row>
 *     <Table.Row>
 *       <Table.Cell>Regular row</Table.Cell>
 *       <Table.Cell class="text-secondary-label">hover to highlight</Table.Cell>
 *     </Table.Row>
 *   </Table.Body>
 * </Table.Root>
 * ```
 
 
 
 
 
 
 
 
 
 */

import { component$, type PropsOf, Slot } from "@builder.io/qwik";

export type TableRootProps = PropsOf<"table">;

/**
 * Wrapper with horizontal scrolling and an inner `<table>`. Children (`Table.Header`, `Table.Body`, …) belong directly in the table.
 * Note: `<caption>` must be the first child of `<table>` (use {@link TableCaption}).
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

/** Header section — bottom border on the header rows. */
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

/** Table body — last row without a bottom border. */
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

/** Footer — top separator, subtle background (totals, actions). */
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

/** Row — separator and highlight on hover / selection (`data-state=selected`). */
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

/** Header cell — alignment and secondary text color. */
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

/** Data cell. */
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

/** Table caption — place as the first child inside {@link TableRoot}. */
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
