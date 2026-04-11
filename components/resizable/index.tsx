/**
 * @component resizable
 * @title Resizable
 * @version 1.0.0
 * @example
 * ```tsx
 * import { Resizable } from "~/components/ui/resizable";
 *
 * <Resizable.PanelGroup direction="horizontal" class="h-48 rounded-lg border border-separator-opaque/40">
 *   <Resizable.Panel side="start" minSize={20}>…</Resizable.Panel>
 *   <Resizable.Handle withHandle />
 *   <Resizable.Panel side="end" minSize={20}>…</Resizable.Panel>
 * </Resizable.PanelGroup>
 * ```
 * Ukázka v demo aplikaci: route `/components/resizable` (zdroj `demo/src/routes/components/resizable/index.tsx`).
 
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
  class?: string;
}

/**
 * Draggable separator between start and end panels. Keyboard: arrows nudge split by 2%.
 */
export const ResizableHandle = component$<ResizableHandleProps>((props) => {
  const ctx = useContext(resizableContextId);
  const rootRef = useSignal<HTMLElement | undefined>();

  const { withHandle, disabled, class: className, ...rest } = props;
  const horizontal = ctx.direction === "horizontal";

  const merged = [
    horizontal
      ? "relative flex w-px shrink-0 cursor-col-resize items-stretch justify-center bg-separator"
      : "relative flex h-px shrink-0 cursor-row-resize items-center justify-stretch bg-separator",
    "touch-none select-none outline-none transition-colors",
    "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:ring-offset-background",
    "hover:bg-separator-opaque/80",
    disabled ? "pointer-events-none cursor-not-allowed opacity-40" : "",
    withHandle ? (horizontal ? "w-2" : "h-2") : "",
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
      {withHandle ? (
        <span
          class={
            horizontal
              ? "pointer-events-none absolute inset-y-0 flex w-full flex-col items-center justify-center gap-0.5 py-1"
              : "pointer-events-none absolute inset-x-0 flex h-full flex-row items-center justify-center gap-0.5 px-1"
          }
          aria-hidden="true"
        >
          <span class="h-1 w-1 rounded-full bg-secondary-label" />
          <span class="h-1 w-1 rounded-full bg-secondary-label" />
          <span class="h-1 w-1 rounded-full bg-secondary-label" />
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
