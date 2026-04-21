/**
 * @component calendar
 * @title Calendar
 * @version 1.0.0
 * @example Calendar.Panel
 * Zkratka nad stejnými díly — navigace, titulek, záhlaví týdne a mřížka.
 * ```tsx
 * import { $, useSignal } from "@builder.io/qwik";
 * import { Calendar } from "~/components/ui/calendar";
 * 
 * export default component$(() => {
 *   const selected = useSignal<string | undefined>(undefined);
 *   return (
 *     <Calendar.Panel
 *       defaultViewMonth="2026-04-01"
 *       selected={selected.value}
 *       onSelect$={$((iso) => {
 *         selected.value = iso;
 *       })}
 *     />
 *   );
 * });
 * ```
 *
 * @example Složené API
 * `Calendar.Root` s vlastním rozložením (stejné podkomponenty jako u Panel).
 * ```tsx
 * import { Calendar } from "~/components/ui/calendar";
 * 
 * <Calendar.Root defaultViewMonth="2026-04-01" weekStartsOn={1}>
 *   <div class="flex flex-col gap-2">
 *     <div class="flex items-center gap-1 px-0.5">
 *       <Calendar.PrevButton>
 *         <span aria-hidden="true">‹</span>
 *       </Calendar.PrevButton>
 *       <Calendar.Caption format="MMMM YYYY" />
 *       <Calendar.NextButton>
 *         <span aria-hidden="true">›</span>
 *       </Calendar.NextButton>
 *     </div>
 *     <Calendar.Weekdays />
 *     <Calendar.Grid />
 *   </div>
 * </Calendar.Root>
 * ```
 *
 * @example Controlled měsíc a min / max
 * `viewMonth` + `onViewMonthChange, omezení rozsahu `minDate` / `maxDate` (řetězce `YYYY-MM-DD`).
 * ```tsx
 * import { $, component$, useSignal } from "@builder.io/qwik";
 * import { Calendar } from "~/components/ui/calendar";
 * 
 * const viewMonth = useSignal("2026-04-01");
 * const selected = useSignal<string | undefined>(undefined);
 * 
 * <Calendar.Panel
 *   viewMonth={viewMonth.value}
 *   onViewMonthChange$={$((iso) => {
 *     viewMonth.value = iso;
 *   })}
 *   selected={selected.value}
 *   onSelect$={$((iso) => {
 *     selected.value = iso;
 *   })}
 *   minDate="2026-04-05"
 *   maxDate="2026-04-25"
 * />
 * ```
 *
 * @example Pole data (CalendarInput)
 * Vstup s textem `LL`, popover a `Calendar.Panel` — komponenta `CalendarInput` (`calendar-input`). Lze obalit `Field` / `Label`.
 * ```tsx
 * import { $, component$, useSignal } from "@builder.io/qwik";
 * import { CalendarInput } from "~/components/ui/calendar-input";
 * import { Field } from "~/components/ui/field";
 * import { Label } from "~/components/ui/label";
 *
 * export const Demo = component$(() => {
 *   const picked = useSignal("2026-04-12");
 *   return (
 *     <Field.Root>
 *       <Label for="cal-demo">Datum</Label>
 *       <CalendarInput
 *         inputId="cal-demo"
 *         value={picked.value}
 *         placeholder="např. 12. dubna 2026"
 *         onValueChange$={$((iso) => {
 *           picked.value = iso;
 *         })}
 *       />
 *     </Field.Root>
 *   );
 * });
 * ```
 
 
 
 
 
 
 
 
 
 */

import {
  component$,
  createContextId,
  type PropFunction,
  type PropsOf,
  type Signal,
  Slot,
  useContext,
  useContextProvider,
  useSignal,
  useTask$,
} from "@builder.io/qwik";
import dayjs from "dayjs";

function stringifyClass(c: unknown): string {
  if (c == null || c === false) return "";
  if (typeof c === "string") return c;
  if (Array.isArray(c)) {
    return c.filter((x): x is string => typeof x === "string" && Boolean(x)).join(" ");
  }
  if (typeof c === "object" && c !== null) {
    return Object.entries(c as Record<string, boolean>)
      .filter(([, v]) => Boolean(v))
      .map(([k]) => k)
      .join(" ");
  }
  return "";
}

function twMerge(base: string, cls: unknown): string {
  const s = stringifyClass(cls);
  return s ? `${base} ${s}` : base;
}

function monthStartIso(d: dayjs.Dayjs) {
  return d.startOf("month").format("YYYY-MM-DD");
}

function parseMonthIso(iso: string) {
  const d = dayjs(iso, "YYYY-MM-DD", true);
  return d.isValid() ? monthStartIso(d) : monthStartIso(dayjs());
}

function calendarPageStarts(viewMonthIso: string, weekStartsOn: 0 | 1): string[] {
  const first = dayjs(viewMonthIso).startOf("month");
  const firstDow = first.day();
  const offset = (firstDow - weekStartsOn + 7) % 7;
  const start = first.subtract(offset, "day");
  const out: string[] = [];
  for (let i = 0; i < 42; i++) {
    out.push(start.add(i, "day").format("YYYY-MM-DD"));
  }
  return out;
}

export interface CalendarContextState {
  viewMonthIso: Signal<string>;
  selectedIso: Signal<string | undefined>;
  weekStartsOn: 0 | 1;
  minIso?: string;
  maxIso?: string;
  onSelect$: PropFunction<(iso: string) => void> | undefined;
  onViewMonthChange$: PropFunction<(iso: string) => void> | undefined;
  viewControlled: boolean;
}

export const calendarContextId = createContextId<CalendarContextState>("q-ui-calendar");

export type CalendarRootProps = Omit<PropsOf<"div">, "children"> & {
  /** Vybraný den `YYYY-MM-DD` (controlled s `onSelect$`). */
  selected?: string;
  /** Výchozí výběr (uncontrolled). */
  defaultSelected?: string;
  onSelect$?: PropFunction<(iso: string) => void>;
  /** Zobrazený měsíc — první den v `YYYY-MM-DD` (controlled s `onViewMonthChange$`). */
  viewMonth?: string;
  defaultViewMonth?: string;
  onViewMonthChange$?: PropFunction<(iso: string) => void>;
  /** 0 = neděle, 1 = pondělí jako začátek týdne. */
  weekStartsOn?: 0 | 1;
  minDate?: string;
  maxDate?: string;
};

/**
 * Kořen kalendáře — stav měsíce a výběr; používá dayjs pro výpočty dní.
 * Skládej s {@link Calendar.PrevButton}, {@link Calendar.Caption}, {@link Calendar.Grid}, …
 */
export const CalendarRoot = component$<CalendarRootProps>((props) => {
  const weekStartsOn = props.weekStartsOn ?? 1;
  const viewControlled = props.viewMonth !== undefined;

  const initialView = parseMonthIso(
    props.viewMonth ?? props.defaultViewMonth ?? monthStartIso(dayjs()),
  );
  const viewMonthIso = useSignal(initialView);
  const selectedIso = useSignal<string | undefined>(
    props.selected ?? props.defaultSelected,
  );

  useTask$(({ track }) => {
    track(() => props.viewMonth);
    if (props.viewMonth !== undefined) {
      viewMonthIso.value = parseMonthIso(props.viewMonth);
    }
  });

  useTask$(({ track }) => {
    track(() => props.selected);
    if (props.selected !== undefined) {
      selectedIso.value = props.selected;
    }
  });

  useContextProvider(calendarContextId, {
    viewMonthIso,
    selectedIso,
    weekStartsOn,
    minIso: props.minDate,
    maxIso: props.maxDate,
    onSelect$: props.onSelect$,
    onViewMonthChange$: props.onViewMonthChange$,
    viewControlled,
  });

  const domProps = { ...(props as unknown as Record<string, unknown>) };
  const className = domProps.class as string | undefined;
  for (const k of [
    "selected",
    "defaultSelected",
    "viewMonth",
    "defaultViewMonth",
    "onSelect$",
    "onViewMonthChange$",
    "weekStartsOn",
    "minDate",
    "maxDate",
    "class",
  ] as const) {
    delete domProps[k];
  }
  const rest = domProps as Omit<PropsOf<"div">, "children">;
  const base =
    "rounded-xl border border-separator-opaque bg-grouped-surface p-3 text-label shadow-sm";
  const merged = twMerge(base, className);

  return (
    <div {...rest} class={merged} role="application" aria-label="Kalendář">
      <Slot />
    </div>
  );
});

export type CalendarNavButtonProps = Omit<PropsOf<"button">, "type" | "onClick$">;

/** Předchozí měsíc. */
export const CalendarPrevButton = component$<CalendarNavButtonProps>((props) => {
  const ctx = useContext(calendarContextId);
  const { class: className, disabled, ...rest } = props;
  const btnClass = twMerge(
    "inline-flex size-8 items-center justify-center rounded-md border border-transparent text-label hover:bg-fill-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40",
    className,
  );

  return (
    <button
      {...rest}
      type="button"
      class={btnClass}
      disabled={disabled}
      aria-label="Předchozí měsíc"
      onClick$={async () => {
        const next = dayjs(ctx.viewMonthIso.value).subtract(1, "month");
        const iso = monthStartIso(next);
        if (ctx.viewControlled) {
          await ctx.onViewMonthChange$?.(iso);
        } else {
          ctx.viewMonthIso.value = iso;
        }
      }}
    >
      <Slot />
    </button>
  );
});

/** Následující měsíc. */
export const CalendarNextButton = component$<CalendarNavButtonProps>((props) => {
  const ctx = useContext(calendarContextId);
  const { class: className, disabled, ...rest } = props;
  const btnClass = twMerge(
    "inline-flex size-8 items-center justify-center rounded-md border border-transparent text-label hover:bg-fill-secondary focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40",
    className,
  );

  return (
    <button
      {...rest}
      type="button"
      class={btnClass}
      disabled={disabled}
      aria-label="Následující měsíc"
      onClick$={async () => {
        const next = dayjs(ctx.viewMonthIso.value).add(1, "month");
        const iso = monthStartIso(next);
        if (ctx.viewControlled) {
          await ctx.onViewMonthChange$?.(iso);
        } else {
          ctx.viewMonthIso.value = iso;
        }
      }}
    >
      <Slot />
    </button>
  );
});

export type CalendarCaptionProps = PropsOf<"div">;

/** Titulek měsíce a roku (dayjs `format`, výchozí `MMMM YYYY`). */
export const CalendarCaption = component$<CalendarCaptionProps & { format?: string }>((props) => {
  const ctx = useContext(calendarContextId);
  const { class: className, format: fmt = "MMMM YYYY", ...rest } = props;
  const base = "min-w-0 flex-1 text-center text-callout font-medium text-label tabular-nums";
  const merged = twMerge(base, className);

  return (
    <div {...rest} class={merged} aria-live="polite">
      {dayjs(ctx.viewMonthIso.value).format(fmt)}
    </div>
  );
});

export type CalendarWeekdaysProps = PropsOf<"div">;

/** Řádek zkratek dnů v týdnu podle `weekStartsOn` a dayjs locale. */
export const CalendarWeekdays = component$<CalendarWeekdaysProps>((props) => {
  const ctx = useContext(calendarContextId);
  const { class: className, ...rest } = props;
  const merged = twMerge(
    "mb-1 grid grid-cols-7 text-center text-caption-1 font-normal text-secondary-label",
    className,
  );

  const refMonday = dayjs("2024-01-01");
  const start = ctx.weekStartsOn === 1 ? refMonday : refMonday.subtract(1, "day");
  const labels: string[] = [];
  for (let i = 0; i < 7; i++) {
    labels.push(start.add(i, "day").format("dd"));
  }

  return (
    <div {...rest} class={merged} role="row">
      {labels.map((label, i) => (
        <div key={i} class="size-9 leading-9" role="columnheader">
          {label}
        </div>
      ))}
    </div>
  );
});

export type CalendarGridProps = PropsOf<"div">;

/** Mřížka 6×7 dnů; dny mimo měsíc jsou vizuálně ztlumené. */
export const CalendarGrid = component$<CalendarGridProps>((props) => {
  const ctx = useContext(calendarContextId);
  const { class: className, ...rest } = props;
  const merged = twMerge("grid grid-cols-7 gap-0.5", className);

  const days = calendarPageStarts(ctx.viewMonthIso.value, ctx.weekStartsOn);
  const viewMonth = ctx.viewMonthIso.value;
  const today = dayjs().format("YYYY-MM-DD");

  return (
    <div {...rest} class={merged} role="grid" aria-readonly="true">
      {days.map((iso) => (
        <CalendarDayCell key={iso} iso={iso} viewMonth={viewMonth} today={today} />
      ))}
    </div>
  );
});

const CalendarDayCell = component$<{
  iso: string;
  viewMonth: string;
  today: string;
}>((props) => {
  const ctx = useContext(calendarContextId);
  const { iso, viewMonth, today } = props;
  const d = dayjs(iso);
  const inMonth = d.isSame(viewMonth, "month");
  const isToday = iso === today;
  const selected = ctx.selectedIso.value === iso;

  let disabled = false;
  if (ctx.minIso && d.isBefore(dayjs(ctx.minIso), "day")) disabled = true;
  if (ctx.maxIso && d.isAfter(dayjs(ctx.maxIso), "day")) disabled = true;

  const base =
    "inline-flex size-9 items-center justify-center rounded-md text-callout tabular-nums transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background disabled:pointer-events-none disabled:opacity-40";
  const outside = inMonth ? "" : "text-tertiary-label";
  const selectedCls = selected
    ? "bg-accent font-medium text-white hover:bg-accent/90"
    : inMonth
      ? "text-label hover:bg-fill-secondary"
      : "hover:bg-fill-tertiary/60";
  const todayCls =
    !selected && isToday ? "border border-accent/50 bg-accent/10 font-medium" : "";

  const merged = [base, outside, selectedCls, todayCls].filter(Boolean).join(" ");

  return (
    <button
      type="button"
      role="gridcell"
      class={merged}
      disabled={disabled}
      aria-selected={selected ? "true" : undefined}
      aria-current={isToday ? "date" : undefined}
      data-outside={inMonth ? undefined : ""}
      onClick$={async () => {
        ctx.selectedIso.value = iso;
        await ctx.onSelect$?.(iso);
      }}
    >
      {d.date()}
    </button>
  );
});

export type CalendarPanelProps = CalendarRootProps;

/**
 * Výchozí rozložení: navigace, titulek, dny v týdnu a mřížka (stejné díly jako u manuálního skládání).
 */
export const CalendarPanel = component$<CalendarPanelProps>((props) => {
  return (
    <CalendarRoot {...props}>
      <div class="flex flex-col gap-2">
        <div class="flex items-center gap-1 px-0.5">
          <CalendarPrevButton>
            <span aria-hidden="true">‹</span>
          </CalendarPrevButton>
          <CalendarCaption />
          <CalendarNextButton>
            <span aria-hidden="true">›</span>
          </CalendarNextButton>
        </div>
        <CalendarWeekdays />
        <CalendarGrid />
      </div>
    </CalendarRoot>
  );
});

/** Namespace: `Calendar.Root`, `Calendar.Panel`, `Calendar.Grid`, … */
export const Calendar = {
  Root: CalendarRoot,
  Panel: CalendarPanel,
  PrevButton: CalendarPrevButton,
  NextButton: CalendarNextButton,
  Caption: CalendarCaption,
  Weekdays: CalendarWeekdays,
  Grid: CalendarGrid,
};
