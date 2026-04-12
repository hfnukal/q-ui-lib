/**
 * @component resizable
 * @title Resizable
 * @version 1.0.0
 * @example Vodorovně
 * Přetahujte oddělovač nebo použijte šipky vlevo/vpravo, když má fokus. Volitelně `withHandle` pro vizuální úchop.
 * ```tsx
 * import { Resizable } from "~/components/ui/resizable";
 * 
 * <Resizable.PanelGroup
 *   direction="horizontal"
 *   defaultSplit={40}
 *   class="h-52 rounded-lg border border-separator-opaque/40"
 * >
 *   <Resizable.Panel side="start" minSize={15} class="bg-surface-raised p-4">
 *     <p class="text-callout text-label">Levý panel</p>
 *   </Resizable.Panel>
 *   <Resizable.Handle withHandle />
 *   <Resizable.Panel side="end" minSize={15} class="bg-surface-overlay p-4">
 *     <p class="text-callout text-label">Pravý panel</p>
 *   </Resizable.Panel>
 * </Resizable.PanelGroup>
 * ```
 *
 * @example Svisle
 * `direction=&quot;vertical&quot;` — kurzor `row-resize`, klávesy nahoru/dolů. `withHandle` přidá vizuální úchop.
 * ```tsx
 * import { Resizable } from "~/components/ui/resizable";
 *
 * <Resizable.PanelGroup
 *   direction="vertical"
 *   defaultSplit={35}
 *   class="h-72 max-w-md rounded-lg border border-separator-opaque/40"
 * >
 *   <Resizable.Panel side="start" minSize={10} class="bg-surface-raised p-3">
 *     <p class="text-caption-1 text-secondary-label">Horní část</p>
 *   </Resizable.Panel>
 *   <Resizable.Handle withHandle />
 *   <Resizable.Panel side="end" minSize={15} class="bg-surface-overlay p-3">
 *     <p class="text-caption-1 text-secondary-label">Spodní část</p>
 *   </Resizable.Panel>
 * </Resizable.PanelGroup>
 * ```
 
 
 
 
 
 
 */

import {
  $,
  component$,
  createContextId,
  type PropsOf,
  type Signal,
  Slot,
  useContext,
  useContextProvider,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";

export type ResizableDirection = "horizontal" | "vertical";

export interface ResizableContextValue {
  direction: ResizableDirection;
  splitPercent: Signal<number>;
  minStart: Signal<number>;
  minEnd: Signal<number>;
  groupRef: Signal<HTMLElement | undefined>;
}

const resizableContextId = createContextId<ResizableContextValue>("q-ui-lib.resizable");

export interface ResizablePanelGroupProps extends Omit<PropsOf<"div">, "class"> {
  /** Flex direction of panels; affects cursor and drag axis. */
  direction?: ResizableDirection;
  /** Initial size of the start panel in percent (0–100). */
  defaultSplit?: number;
  class?: string;
}

function clamp(n: number, min: number, max: number) {
  return Math.min(max, Math.max(min, n));
}

/** Immediates layout update even when signal writes from a native listener do not re-run Qwik. */
function applyResizableSplitCss(group: HTMLElement, pct: number) {
  group.style.setProperty("--q-resizable-start", `${pct}%`);
  group.style.setProperty("--q-resizable-end", `${100 - pct}%`);
}

/**
 * Container for two {@link ResizablePanel}s separated by one {@link ResizableHandle}.
 * Uses flex % basis; give the group explicit height (horizontal) or width (vertical) as needed.
 */
export const ResizablePanelGroup = component$<ResizablePanelGroupProps>((props) => {
  const {
    class: className,
    direction = "horizontal",
    defaultSplit: ds = 50,
    style: userStyle,
    ...rest
  } = props;
  const splitPercent = useSignal(clamp(ds, 1, 99));
  const minStart = useSignal(10);
  const minEnd = useSignal(10);
  const groupRef = useSignal<HTMLElement>();

  useContextProvider(resizableContextId, {
    direction,
    splitPercent,
    minStart,
    minEnd,
    groupRef,
  });

  const flexDir =
    direction === "horizontal" ? "flex h-full min-h-[8rem] w-full flex-row" : "flex min-h-[12rem] w-full min-w-0 flex-col";

  const merged = [flexDir, "min-w-0 overflow-hidden", className].filter(Boolean).join(" ");

  // Reading splitPercent here subscribes the group to updates so CSS vars refresh (child Panels alone may not re-run).
  const split = splitPercent.value;
  const groupStyle = {
    ...(typeof userStyle === "object" && userStyle !== null && !Array.isArray(userStyle)
      ? userStyle
      : {}),
    "--q-resizable-start": `${split}%`,
    "--q-resizable-end": `${100 - split}%`,
  };

  return (
    <div
      ref={groupRef}
      data-q-resizable-root=""
      {...rest}
      class={merged}
      style={groupStyle}
    >
      <Slot />
    </div>
  );
});

export interface ResizablePanelProps extends Omit<PropsOf<"div">, "class"> {
  /** `start` — first pane (size from split %); `end` — second pane (remainder). */
  side: "start" | "end";
  /** Minimum size of this pane in percent (0–100). */
  minSize?: number;
  class?: string;
}

export const ResizablePanel = component$<ResizablePanelProps>((props) => {
  const ctx = useContext(resizableContextId);
  const { side, minSize, class: className, ...rest } = props;

  const m = clamp(minSize ?? 10, 0, 50);
  if (side === "start") {
    ctx.minStart.value = m;
  } else {
    ctx.minEnd.value = m;
  }

  const min0 = side === "start" ? "min-w-0 min-h-0" : "min-w-0 min-h-0";

  const merged = [
    "overflow-auto",
    min0,
    "shrink-0 grow-0",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const flexBasis =
    side === "start" ? "var(--q-resizable-start)" : "var(--q-resizable-end)";

  return (
    <div
      {...rest}
      class={merged}
      style={{
        flexBasis,
        flexGrow: 0,
        flexShrink: 0,
      }}
    >
      <Slot />
    </div>
  );
});

export interface ResizableHandleProps extends Omit<PropsOf<"div">, "class"> {
  /** Visual grip (three dots) in the hit area. */
  withHandle?: boolean;
  /** Disables dragging. */
  disabled?: boolean;
  /**
   * Position of the visual grip along the separator (CSS length, e.g. `"50%"`, `"100px"`, `"10%"`).
   * Default: `"50%"` (centre). Only relevant when `withHandle` is true.
   */
  handlePosition?: string;
  class?: string;
}

/**
 * Draggable separator between start and end panels. Keyboard: arrows nudge split by 2%.
 */
export const ResizableHandle = component$<ResizableHandleProps>((props) => {
  const ctx = useContext(resizableContextId);
  const rootRef = useSignal<HTMLElement | undefined>();

  const { withHandle, disabled, handlePosition, class: className, ...rest } = props;
  const horizontal = ctx.direction === "horizontal";

  const merged = [
    horizontal
      ? "group/rhandle relative flex w-3 shrink-0 cursor-col-resize items-stretch justify-center"
      : "group/rhandle relative flex h-3 shrink-0 cursor-row-resize items-center justify-stretch",
    "touch-none select-none outline-none transition-colors duration-150",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    disabled ? "pointer-events-none cursor-not-allowed opacity-40" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const ariaOrientation = horizontal ? "vertical" : "horizontal";

  const onKeyDown$ = $((e: KeyboardEvent) => {
    if (disabled) {
      return;
    }
    const keys = horizontal
      ? { dec: ["ArrowLeft"], inc: ["ArrowRight"] }
      : { dec: ["ArrowUp"], inc: ["ArrowDown"] };
    const step = 2;
    const maxStart = 100 - ctx.minEnd.value;
    let next = ctx.splitPercent.value;
    if (keys.dec.includes(e.key)) {
      next = clamp(next - step, ctx.minStart.value, maxStart);
    } else if (keys.inc.includes(e.key)) {
      next = clamp(next + step, ctx.minStart.value, maxStart);
    } else {
      return;
    }
    ctx.splitPercent.value = next;
    const group = ctx.groupRef.value;
    if (group) {
      applyResizableSplitCss(group, next);
    }
  });

  // Qwik může spustit onPointerDown$ se zpožděním → currentTarget je null a drag se nikdy nezaregistruje.
  // Nativní listener na reálném DOM uzlu + přímá úprava CSS proměnných na skupině zajistí okamžitý layout.
  // eslint-disable-next-line qwik/no-use-visible-task -- výhradně registrace DOM pointerdown (QRL nespolehlivé)
  useVisibleTask$(({ track, cleanup }) => {
    track(() => rootRef.value);
    const root = rootRef.value;
    if (!root) {
      return;
    }

    const dir = ctx.direction;

    const onPointerDown = (e: PointerEvent) => {
      const target = e.currentTarget;
      if (!target || !(target instanceof HTMLElement)) {
        return;
      }
      if (target.getAttribute("aria-disabled") === "true") {
        return;
      }
      e.preventDefault();
      if (typeof target.setPointerCapture !== "function") {
        return;
      }
      const pid = e.pointerId;
      target.setPointerCapture(pid);

      const horiz = dir === "horizontal";
      const startCoord = horiz ? e.clientX : e.clientY;
      const startSplit = ctx.splitPercent.value;

      const resolveGroup = () =>
        ctx.groupRef.value ??
        target.closest<HTMLElement>("[data-q-resizable-root]") ??
        target.parentElement;

      const onMove = (ev: PointerEvent) => {
        if (ev.pointerId !== pid) {
          return;
        }
        const group = resolveGroup();
        if (!group) {
          return;
        }
        const size = horiz ? group.offsetWidth : group.offsetHeight;
        if (size <= 0) {
          return;
        }
        const cur = horiz ? ev.clientX : ev.clientY;
        const deltaPct = ((cur - startCoord) / size) * 100;
        const maxStart = 100 - ctx.minEnd.value;
        const next = clamp(startSplit + deltaPct, ctx.minStart.value, maxStart);
        ctx.splitPercent.value = next;
        applyResizableSplitCss(group, next);
      };

      const onEnd = (ev: PointerEvent) => {
        if (ev.pointerId !== pid) {
          return;
        }
        document.removeEventListener("pointermove", onMove, true);
        document.removeEventListener("pointerup", onEnd, true);
        document.removeEventListener("pointercancel", onEnd, true);
        if (target.hasPointerCapture?.(pid)) {
          target.releasePointerCapture(pid);
        }
      };

      document.addEventListener("pointermove", onMove, true);
      document.addEventListener("pointerup", onEnd, true);
      document.addEventListener("pointercancel", onEnd, true);
    };

    root.addEventListener("pointerdown", onPointerDown);
    cleanup(() => root.removeEventListener("pointerdown", onPointerDown));
  });

  return (
    <div
      {...rest}
      ref={rootRef}
      role="separator"
      aria-orientation={ariaOrientation}
      aria-valuenow={Math.round(ctx.splitPercent.value)}
      aria-valuemin={Math.round(ctx.minStart.value)}
      aria-valuemax={Math.round(100 - ctx.minEnd.value)}
      tabIndex={disabled ? -1 : 0}
      aria-disabled={disabled ? true : undefined}
      class={merged}
      onKeyDown$={onKeyDown$}
    >
      {/* Tenká vizuální linka — jemná barva, při hover se mírně zesiluje */}
      <span
        class={
          horizontal
            ? "pointer-events-none absolute inset-y-0 left-1/2 w-px -translate-x-1/2 bg-separator-opaque/40 transition-colors duration-150 group-hover/rhandle:bg-separator-opaque"
            : "pointer-events-none absolute inset-x-0 top-1/2 h-px -translate-y-1/2 bg-separator-opaque/40 transition-colors duration-150 group-hover/rhandle:bg-separator-opaque"
        }
        aria-hidden="true"
      />
      {withHandle ? (
        <span
          class={[
            "pointer-events-none absolute z-10 flex items-center justify-center gap-0.5 rounded-sm border border-separator-opaque bg-surface-raised shadow-sm",
            "opacity-60 transition-[padding,width,height,opacity] duration-150 group-hover/rhandle:opacity-100",
            // Fit-content: not inset-y/x-0. Centered along the separator; expand on hover.
            horizontal
              ? "w-4 flex-col py-2 group-hover/rhandle:py-3 group-hover/rhandle:w-5"
              : "h-4 flex-row px-2 group-hover/rhandle:px-3 group-hover/rhandle:h-5",
          ].join(" ")}
          style={
            horizontal
              // Centre vertically; handlePosition controls position along the separator
              ? { left: handlePosition ?? "50%", top: "50%", transform: "translateX(-50%) translateY(-50%)" }
              : { top: handlePosition ?? "50%", left: "50%", transform: "translateY(-50%) translateX(-50%)" }
          }
          aria-hidden="true"
        >
          <span class="h-1 w-1 shrink-0 rounded-full bg-secondary-label" />
          <span class="h-1 w-1 shrink-0 rounded-full bg-secondary-label" />
          <span class="h-1 w-1 shrink-0 rounded-full bg-secondary-label" />
        </span>
      ) : null}
    </div>
  );
});

/**
 * Resizable split view (two panels + handle). Not in @qwik-ui/headless — native flex + pointer events, COLORS.md tokens.
 *
 * @example
 * ```tsx
 * <Resizable.PanelGroup direction="horizontal" class="h-48 rounded-lg border border-separator-opaque/40">
 *   <Resizable.Panel side="start" minSize={20} class="bg-surface-raised p-3">Left</Resizable.Panel>
 *   <Resizable.Handle withHandle />
 *   <Resizable.Panel side="end" minSize={20} class="bg-surface-overlay p-3">Right</Resizable.Panel>
 * </Resizable.PanelGroup>
 * ```
 */
export const Resizable = {
  PanelGroup: ResizablePanelGroup,
  Panel: ResizablePanel,
  Handle: ResizableHandle,
};
