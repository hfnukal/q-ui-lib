/**
 * @component calendar-input
 * @title CalendarInput
 * @version 1.0.0
 * @example Základ
 * Vstup s textem data (`LL`, locale z dayjs), ikonou kalendáře a panelem `Calendar.Panel` v popoveru.
 * ```tsx
 * import { CalendarInput } from "~/components/ui/calendar-input";
 *
 * <CalendarInput
 *   defaultValue="2026-04-12"
 *   defaultViewMonth="2026-04-01"
 *   placeholder="např. 12. dubna 2026"
 * />
 * ```
 */

import {
  $,
  component$,
  type PropFunction,
  useId,
  useOnDocument,
  useSignal,
  useTask$,
} from "@builder.io/qwik";
import { usePopover } from "@qwik-ui/headless";
import dayjs from "dayjs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import "dayjs/locale/cs";
import { LuCalendar } from "@qwikest/icons/lucide";
import { Calendar } from "../calendar";
import { InputGroup } from "../input-group";
import { Popover } from "../popover";

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.locale("cs");

const LL_PARSE = "D. MMMM YYYY";

function parseLocaleDateToIso(text: string): string | undefined {
  const t = text.trim();
  if (!t) return undefined;
  const d = dayjs(t, LL_PARSE, true);
  return d.isValid() ? d.format("YYYY-MM-DD") : undefined;
}

function monthStartIso(d: dayjs.Dayjs) {
  return d.startOf("month").format("YYYY-MM-DD");
}

function parseMonthIso(iso: string) {
  const d = dayjs(iso, "YYYY-MM-DD", true);
  return d.isValid() ? monthStartIso(d) : monthStartIso(dayjs());
}

type Seg = "day" | "month" | "year";

function parseLLLayout(ref: dayjs.Dayjs): Record<Seg, [number, number]> {
  const full = ref.format("LL");
  const y = ref.format("YYYY");
  const m = ref.format("MMMM");
  const dPart = `${ref.format("D")}.`;
  const yi = full.indexOf(y);
  const mi = full.indexOf(m);
  const di = full.indexOf(dPart);
  return {
    day: [di, di + dPart.length],
    month: [mi, mi + m.length],
    year: [yi, yi + y.length],
  };
}

function segmentAndOffsetAtCursor(
  cursor: number,
  layout: ReturnType<typeof parseLLLayout>,
): { seg: Seg; offset: number } {
  let nearest: Seg = "month";
  let nearestDist = Infinity;
  for (const s of ["day", "month", "year"] as const) {
    const [a, b] = layout[s];
    if (cursor >= a && cursor < b) {
      return { seg: s, offset: cursor - a };
    }
    const mid = (a + b) / 2;
    const d = Math.abs(cursor - mid);
    if (d < nearestDist) {
      nearestDist = d;
      nearest = s;
    }
  }
  const [a, b] = layout[nearest];
  const clamped = Math.max(a, Math.min(cursor, b - 1));
  return { seg: nearest, offset: clamped - a };
}

function caretInSegmentAfterChange(
  seg: Seg,
  offsetInSeg: number,
  next: dayjs.Dayjs,
): number {
  const layout = parseLLLayout(next);
  const [a, b] = layout[seg];
  const len = b - a;
  const o = len <= 0 ? 0 : Math.max(0, Math.min(offsetInSeg, len - 1));
  return a + o;
}

export interface CalendarInputProps {
  /** Vybrané datum `YYYY-MM-DD` (controlled s `onValueChange$`). */
  value?: string;
  /** Výchozí datum při neřízeném režimu. */
  defaultValue?: string;
  onValueChange$?: PropFunction<(iso: string) => void>;
  /** Výchozí zobrazený měsíc (`YYYY-MM-DD` prvního dne). */
  defaultViewMonth?: string;
  minDate?: string;
  maxDate?: string;
  weekStartsOn?: 0 | 1;
  placeholder?: string;
  /** Kořenový `id` popoveru (`usePopover`); výchozí z `useId`. */
  popoverRootId?: string;
  /** `id` vstupního pole. */
  inputId?: string;
  class?: string;
  /** Popisek skupiny pro čtečky (`InputGroup.Root`). */
  "aria-label"?: string;
}

export const CalendarInput = component$<CalendarInputProps>((props) => {
  const qid = useId();
  const safeQ = qid.replace(/:/g, "");
  const popoverRootId = props.popoverRootId ?? `cal-in-${safeQ}`;
  const inputId = props.inputId ?? `${popoverRootId}-field`;

  const { showPopover, hidePopover } = usePopover(popoverRootId);
  const anchorRef = useSignal<HTMLElement>();
  const groupRef = useSignal<HTMLElement>();

  const initialIso = props.value ?? props.defaultValue;
  const initialDay = initialIso ? dayjs(initialIso, "YYYY-MM-DD", true) : null;
  const initialValid = initialDay?.isValid() ? initialDay : null;

  const viewMonthIso = useSignal(
    parseMonthIso(
      props.defaultViewMonth ??
        (initialValid ? monthStartIso(initialValid) : monthStartIso(dayjs())),
    ),
  );
  const selectedIso = useSignal<string | undefined>(
    initialValid ? initialValid.format("YYYY-MM-DD") : undefined,
  );
  const text = useSignal(initialValid ? initialValid.format("LL") : "");

  useTask$(({ track }) => {
    track(() => props.value);
    if (props.value === undefined) return;
    const d = dayjs(props.value, "YYYY-MM-DD", true);
    if (!d.isValid()) return;
    selectedIso.value = props.value;
    text.value = d.format("LL");
    viewMonthIso.value = monthStartIso(d);
  });

  useOnDocument(
    "pointerdown",
    $((event) => {
      const t = (event as PointerEvent).target as Node | null;
      if (!t) return;
      const group = groupRef.value;
      const panel = document.getElementById(`${popoverRootId}-panel`);
      if (group?.contains(t)) return;
      if (panel?.contains(t)) return;
      void hidePopover();
    }),
  );

  const aria = props["aria-label"] ?? props.placeholder ?? "Datum";

  return (
    <div class={["w-full min-w-0", props.class].filter(Boolean).join(" ")}>
      <Popover.Root
        id={popoverRootId}
        manual
        bind:anchor={anchorRef}
        floating="bottom-start"
        gutter={8}
        class="block w-full"
      >
        <InputGroup.Root ref={groupRef} aria-label={aria}>
          <InputGroup.Input
            id={inputId}
            ref={anchorRef}
            value={text.value}
            placeholder={props.placeholder}
            onFocusIn$={$(async () => {
              await showPopover();
            })}
            onInput$={$((e) => {
              const v = (e.target as HTMLInputElement).value;
              text.value = v;
              const iso = parseLocaleDateToIso(v);
              if (iso) {
                selectedIso.value = iso;
                viewMonthIso.value = dayjs(iso).startOf("month").format("YYYY-MM-DD");
                void props.onValueChange$?.(iso);
              }
            })}
            onBlur$={$(async (e) => {
              const el = e.target as HTMLInputElement;
              const v = el.value.trim();
              const rel = (e as FocusEvent).relatedTarget as Node | null;
              const panel = document.getElementById(`${popoverRootId}-panel`);
              if (rel && panel?.contains(rel)) return;
              await hidePopover();
              const iso = parseLocaleDateToIso(v);
              if (iso) {
                void props.onValueChange$?.(iso);
              }
            })}
            onKeyDown$={$((e) => {
              if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
              e.preventDefault();
              const el = e.target as HTMLInputElement;
              const cursor = el.selectionStart ?? 0;
              const iso = parseLocaleDateToIso(text.value);
              const base = iso
                ? dayjs(iso)
                : dayjs(viewMonthIso.value).date(12);
              const layout = parseLLLayout(base);
              const { seg, offset } = segmentAndOffsetAtCursor(cursor, layout);
              const step = e.key === "ArrowUp" ? 1 : -1;
              const next =
                seg === "day"
                  ? base.add(step, "day")
                  : seg === "month"
                    ? base.add(step, "month")
                    : base.add(step, "year");
              const out = next.format("YYYY-MM-DD");
              selectedIso.value = out;
              viewMonthIso.value = next.startOf("month").format("YYYY-MM-DD");
              text.value = next.format("LL");
              void props.onValueChange$?.(out);
              const pos = caretInSegmentAfterChange(seg, offset, next);
              requestAnimationFrame(() => {
                requestAnimationFrame(() => {
                  const inp = document.getElementById(inputId) as HTMLInputElement | null;
                  if (!inp) return;
                  const len = inp.value.length;
                  const safe = Math.max(0, Math.min(pos, len));
                  inp.setSelectionRange(safe, safe);
                });
              });
            })}
          />
          <InputGroup.Addon align="end" class="[&_svg]:size-4 text-secondary-label">
            <LuCalendar aria-hidden="true" />
          </InputGroup.Addon>
        </InputGroup.Root>
        <Popover.Panel
          class="!p-0 !w-auto min-w-[280px]"
          onMouseDown$={$((e) => e.preventDefault())}
        >
          <Calendar.Panel
            viewMonth={viewMonthIso.value}
            onViewMonthChange$={$((iso) => {
              viewMonthIso.value = iso;
            })}
            selected={selectedIso.value}
            onSelect$={$(async (iso) => {
              selectedIso.value = iso;
              text.value = dayjs(iso).format("LL");
              viewMonthIso.value = dayjs(iso).startOf("month").format("YYYY-MM-DD");
              await props.onValueChange$?.(iso);
              await hidePopover();
            })}
            minDate={props.minDate}
            maxDate={props.maxDate}
            weekStartsOn={props.weekStartsOn}
          />
        </Popover.Panel>
      </Popover.Root>
    </div>
  );
});
