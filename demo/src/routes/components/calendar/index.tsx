import { $, component$, useId, useSignal, useTask$ } from "@builder.io/qwik";
import dayjs from "dayjs";
import "dayjs/locale/cs";
import customParseFormat from "dayjs/plugin/customParseFormat";
import localizedFormat from "dayjs/plugin/localizedFormat";
import {
  CodeExample,
  Desc,
  TabCode,
  TabExample,
} from "~/components/demo/codeexample";
import { Calendar } from "~/components/ui/calendar";
import { Field } from "~/components/ui/field";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";

dayjs.extend(customParseFormat);
dayjs.extend(localizedFormat);
dayjs.locale("cs");

function isoToLocaleDisplay(iso: string | undefined): string {
  if (!iso) return "";
  const d = dayjs(iso, "YYYY-MM-DD", true);
  return d.isValid() ? d.format("LL") : "";
}

/** ISO `YYYY-MM-DD` z textu v poli (locale cs + běžné číselné zápisy). */
function parseLocaleDateToIso(raw: string): string | undefined {
  const t = raw.trim();
  if (!t) return undefined;
  const tryFmt = (fmt: string) => {
    const d = dayjs(t, fmt, true);
    return d.isValid() ? d.format("YYYY-MM-DD") : undefined;
  };
  return (
    tryFmt("YYYY-MM-DD") ??
    tryFmt("DD.MM.YYYY") ??
    tryFmt("D.M.YYYY") ??
    tryFmt("D. M. YYYY") ??
    tryFmt("D. MMMM YYYY")
  );
}

/** Rozložení českého LL (např. „5. duben 2026“) pro určení segmentu pod kurzorem. */
function parseLLLayout(
  text: string,
): { monthStart: number; yearStart: number } | null {
  const m = text.match(/^(\d{1,2})(\.\s+)(.+?)(\s+)(\d{4})$/);
  if (!m || m.index !== 0) return null;
  const monthStart = m[1].length + m[2].length;
  const yearStart = monthStart + m[3].length + m[4].length;
  return { monthStart, yearStart };
}

function segmentAtCursorLL(
  text: string,
  cursor: number,
): "day" | "month" | "year" | null {
  const lay = parseLLLayout(text);
  if (!lay) return null;
  const pos = Math.max(0, Math.min(cursor, text.length - 1));
  if (pos < lay.monthStart) return "day";
  if (pos < lay.yearStart) return "month";
  return "year";
}

function mapCursorToCanonical(
  draftLen: number,
  draftPos: number,
  canonicalLen: number,
): number {
  if (canonicalLen <= 0) return 0;
  if (draftLen <= 0) return 0;
  return Math.min(
    canonicalLen - 1,
    Math.round((draftPos / draftLen) * canonicalLen),
  );
}

const DATE_FORMAT_HINT =
  "Platné zápisy: ISO 2026-04-05, číselně 05.04.2026 nebo 5.4.2026, textově podle locale např. 5. duben 2026 (formát LL).";

const codePanel = `import { $, useSignal } from "@builder.io/qwik";
import { Calendar } from "~/components/ui/calendar";

export default component$(() => {
  const selected = useSignal<string | undefined>(undefined);
  return (
    <Calendar.Panel
      defaultViewMonth="2026-04-01"
      selected={selected.value}
      onSelect$={$((iso) => {
        selected.value = iso;
      })}
    />
  );
});`;

const codeCompound = `import { Calendar } from "~/components/ui/calendar";

<Calendar.Root defaultViewMonth="2026-04-01" weekStartsOn={1}>
  <div class="flex flex-col gap-2">
    <div class="flex items-center gap-1 px-0.5">
      <Calendar.PrevButton>
        <span aria-hidden="true">‹</span>
      </Calendar.PrevButton>
      <Calendar.Caption format="MMMM YYYY" />
      <Calendar.NextButton>
        <span aria-hidden="true">›</span>
      </Calendar.NextButton>
    </div>
    <Calendar.Weekdays />
    <Calendar.Grid />
  </div>
</Calendar.Root>`;

const codeControlled = `import { $, component$, useSignal } from "@builder.io/qwik";
import { Calendar } from "~/components/ui/calendar";

const viewMonth = useSignal("2026-04-01");
const selected = useSignal<string | undefined>(undefined);

<Calendar.Panel
  viewMonth={viewMonth.value}
  onViewMonthChange$={$((iso) => {
    viewMonth.value = iso;
  })}
  selected={selected.value}
  onSelect$={$((iso) => {
    selected.value = iso;
  })}
  minDate="2026-04-05"
  maxDate="2026-04-25"
/>`;

const codeInput = `// Kalendář + Input: Field (popis + chyba), sync kalendáře při platném parsování,
// řízený viewMonth, šipky ↑/↓ mění den / měsíc / rok podle pozice kurzoru v textu LL.
// Viz živou ukázku níže — pomocné funkce parseLocaleDateToIso, parseLLLayout, segmentAtCursorLL.`;

export default component$(() => {
  const panelSelected = useSignal<string | undefined>(undefined);
  const controlledView = useSignal("2026-04-01");
  const controlledSelected = useSignal<string | undefined>(undefined);
  const inputPickerIso = useSignal<string | undefined>("2026-04-05");
  const inputDraft = useSignal(isoToLocaleDisplay("2026-04-05"));
  const calendarViewMonth = useSignal(
    dayjs("2026-04-05").startOf("month").format("YYYY-MM-DD"),
  );
  const pickerOpen = useSignal(false);
  const dateInputError = useSignal(false);
  const fieldIds = useId();

  const hintId = `demo-cal-hint-${fieldIds}`;
  const errId = `demo-cal-err-${fieldIds}`;

  useTask$(({ track }) => {
    const iso = track(() => inputPickerIso.value);
    if (iso) {
      calendarViewMonth.value = dayjs(iso)
        .startOf("month")
        .format("YYYY-MM-DD");
    }
  });

  return (
    <div class="space-y-10">
      <div>
        <h1 class="text-title-2 text-label">Calendar</h1>
        <p class="mt-2 max-w-prose text-body text-secondary-label">
          Měsíční kalendář postavený na{" "}
          <code class="rounded bg-fill-secondary/20 px-1 py-0.5 text-caption-1 text-label">
            dayjs
          </code>{" "}
          (výpočet mřížky, formát titulku). Styly odpovídají tokenům z
          COLORS.md; v demu je zapnutá locale{" "}
          <code class="text-caption-1">cs</code> pro názvy měsíců.
        </p>
      </div>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Calendar.Panel</h2>

        <CodeExample>
          <Desc>
            Zkratka nad stejnými díly — navigace, titulek, záhlaví týdne a
            mřížka.
          </Desc>
          <TabExample>
            <div class="flex flex-wrap items-start gap-6">
              <Calendar.Panel
                defaultViewMonth="2026-04-01"
                selected={panelSelected.value}
                onSelect$={$((iso) => {
                  panelSelected.value = iso;
                })}
              />
              <p class="text-callout text-secondary-label">
                Vybrané:{" "}
                <span class="font-medium text-label">
                  {panelSelected.value ?? "—"}
                </span>
              </p>
            </div>
          </TabExample>
          <TabCode>{codePanel}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Složené API</h2>

        <CodeExample>
          <Desc>
            <code class="text-caption-1">Calendar.Root</code> s vlastním
            rozložením (stejné podkomponenty jako u Panel).
          </Desc>
          <TabExample>
            <Calendar.Root defaultViewMonth="2026-04-01" weekStartsOn={1}>
              <div class="flex flex-col gap-2">
                <div class="flex items-center gap-1 px-0.5">
                  <Calendar.PrevButton>
                    <span aria-hidden="true">‹</span>
                  </Calendar.PrevButton>
                  <Calendar.Caption format="MMMM YYYY" />
                  <Calendar.NextButton>
                    <span aria-hidden="true">›</span>
                  </Calendar.NextButton>
                </div>
                <Calendar.Weekdays />
                <Calendar.Grid />
              </div>
            </Calendar.Root>
          </TabExample>
          <TabCode>{codeCompound}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">Controlled měsíc a min / max</h2>

        <CodeExample>
          <Desc>
            <code class="text-caption-1">viewMonth</code> +{" "}
            <code class="text-caption-1">onViewMonthChange$</code>, omezení
            rozsahu <code class="text-caption-1">minDate</code> /{" "}
            <code class="text-caption-1">maxDate</code> (řetězce{" "}
            <code class="text-caption-1">YYYY-MM-DD</code>).
          </Desc>
          <TabExample>
            <div class="flex flex-wrap items-start gap-6">
              <Calendar.Panel
                viewMonth={controlledView.value}
                onViewMonthChange$={$((iso) => {
                  controlledView.value = iso;
                })}
                selected={controlledSelected.value}
                onSelect$={$((iso) => {
                  controlledSelected.value = iso;
                })}
                minDate="2026-04-05"
                maxDate="2026-04-25"
              />
              <div class="text-callout text-secondary-label">
                <p>
                  Měsíc:{" "}
                  <span class="font-medium text-label">
                    {controlledView.value}
                  </span>
                </p>
                <p>
                  Den:{" "}
                  <span class="font-medium text-label">
                    {controlledSelected.value ?? "—"}
                  </span>
                </p>
              </div>
            </div>
          </TabExample>
          <TabCode>{codeControlled}</TabCode>
        </CodeExample>
      </section>

      <section class="space-y-3">
        <h2 class="text-headline text-label">S polem Input</h2>

        <CodeExample>
          <Desc>
            Při platném zápisu se hned přepíše výběr v kalendáři a měsíční
            pohled. Neplatný text po opuštění pole zobrazí{" "}
            <code class="text-caption-1">Field.Error</code> a stále viditelnou
            nápovědu ve <code class="text-caption-1">Field.Description</code>.
            Šipky nahoru / dolů v poli mění podle pozice kurzoru den, měsíc nebo
            rok (u formátu LL).
          </Desc>
          <TabExample>
            <div
              class="relative max-w-xs"
              onFocusOut$={$((e: FocusEvent) => {
                const cur = e.currentTarget as HTMLElement;
                const next = e.relatedTarget as Node | null;
                if (next && cur.contains(next)) return;
                const raw = inputDraft.value.trim();
                const parsed = parseLocaleDateToIso(inputDraft.value);
                if (!raw) {
                  inputPickerIso.value = undefined;
                  dateInputError.value = false;
                  calendarViewMonth.value = dayjs()
                    .startOf("month")
                    .format("YYYY-MM-DD");
                } else if (parsed) {
                  inputPickerIso.value = parsed;
                  inputDraft.value = isoToLocaleDisplay(parsed);
                  dateInputError.value = false;
                } else {
                  dateInputError.value = true;
                }
                pickerOpen.value = false;
              })}
            >
              <Field.Root>
                <Label for="demo-cal-input">Datum</Label>
                <Input
                  id="demo-cal-input"
                  value={inputDraft.value}
                  placeholder="např. 5. duben 2026 nebo 2026-04-05"
                  aria-invalid={dateInputError.value ? "true" : undefined}
                  aria-describedby={
                    dateInputError.value ? `${hintId} ${errId}` : hintId
                  }
                  class={
                    dateInputError.value
                      ? "border-system-red focus-visible:ring-system-red"
                      : undefined
                  }
                  onFocusIn$={$(() => {
                    pickerOpen.value = true;
                    dateInputError.value = false;
                    if (inputPickerIso.value) {
                      inputDraft.value = isoToLocaleDisplay(
                        inputPickerIso.value,
                      );
                    }
                  })}
                  onInput$={$((e) => {
                    const v = (e.target as HTMLInputElement).value;
                    inputDraft.value = v;
                    const parsed = parseLocaleDateToIso(v.trim());
                    if (!v.trim()) {
                      inputPickerIso.value = undefined;
                      dateInputError.value = false;
                      calendarViewMonth.value = dayjs()
                        .startOf("month")
                        .format("YYYY-MM-DD");
                    } else if (parsed) {
                      inputPickerIso.value = parsed;
                      dateInputError.value = false;
                    }
                  })}
                  onKeyDown$={$((e) => {
                    const el = e.target as HTMLInputElement;
                    if (e.key === "Escape") {
                      el.blur();
                      return;
                    }
                    if (e.key !== "ArrowUp" && e.key !== "ArrowDown") return;
                    const isoNow =
                      parseLocaleDateToIso(inputDraft.value.trim()) ??
                      inputPickerIso.value;
                    if (!isoNow) return;
                    const canonical = isoToLocaleDisplay(isoNow);
                    const lay = parseLLLayout(canonical);
                    if (!lay) return;
                    const draft = inputDraft.value;
                    const pos =
                      draft === canonical
                        ? (el.selectionStart ?? 0)
                        : mapCursorToCanonical(
                            draft.length,
                            el.selectionStart ?? 0,
                            canonical.length,
                          );
                    const seg = segmentAtCursorLL(canonical, pos);
                    if (!seg) return;
                    e.preventDefault();
                    const delta = e.key === "ArrowUp" ? 1 : -1;
                    let next = dayjs(isoNow, "YYYY-MM-DD", true);
                    if (seg === "day") next = next.add(delta, "day");
                    else if (seg === "month") next = next.add(delta, "month");
                    else next = next.add(delta, "year");
                    if (!next.isValid()) return;
                    const out = next.format("YYYY-MM-DD");
                    inputPickerIso.value = out;
                    inputDraft.value = isoToLocaleDisplay(out);
                    dateInputError.value = false;
                    requestAnimationFrame(() => {
                      el.setSelectionRange(pos, pos);
                    });
                  })}
                />
                <Field.Description id={hintId}>
                  {DATE_FORMAT_HINT}
                </Field.Description>
                {dateInputError.value ? (
                  <Field.Error id={errId}>
                    Neplatné datum. Zkontrolujte zápis — platí formáty uvedené v
                    nápovědě výše.
                  </Field.Error>
                ) : null}
                <p class="text-caption-1 text-tertiary-label">
                  ISO:{" "}
                  <code class="text-caption-1 text-label">
                    {inputPickerIso.value ?? "—"}
                  </code>
                </p>
              </Field.Root>
              {pickerOpen.value ? (
                <div class="absolute left-0 top-full z-50 mt-1 w-max rounded-xl border border-separator-opaque bg-surface-raised p-1 shadow-md">
                  <Calendar.Panel
                    class="border-0 bg-transparent p-0 shadow-none"
                    viewMonth={calendarViewMonth.value}
                    onViewMonthChange$={$((iso) => {
                      calendarViewMonth.value = iso;
                    })}
                    selected={inputPickerIso.value}
                    onSelect$={$((iso) => {
                      inputPickerIso.value = iso;
                      inputDraft.value = isoToLocaleDisplay(iso);
                      dateInputError.value = false;
                      pickerOpen.value = false;
                    })}
                  />
                </div>
              ) : null}
            </div>
          </TabExample>
          <TabCode>{codeInput}</TabCode>
        </CodeExample>
      </section>
    </div>
  );
});
