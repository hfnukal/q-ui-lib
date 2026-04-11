/**
 * @component sonner
 * @title Sonner
 * @version 1.0.5
 * @example
 * ```tsx
 * // V kořenovém layoutu:
 * import { Sonner } from "~/components/ui/sonner";
 * 
 * <Sonner.Toaster>
 *   …
 * </Sonner.Toaster>
 * 
 * // Na stránce:
 * import { useSonner } from "~/components/ui/sonner";
 * 
 * const { toast } = useSonner();
 * // toast({ title: "Hotovo" });
 * ```
 * Ukázka v demo aplikaci: route `/components/sonner` (zdroj `demo/src/routes/components/sonner/index.tsx`).
 
 */

import {
  $,
  component$,
  createContextId,
  type QRL,
  Slot,
  useContext,
  useContextProvider,
  useSignal,
  useStore,
  useStyles$,
} from "@builder.io/qwik";
import { isServer } from "@builder.io/qwik/build";

export type SonnerToastType = "default" | "success" | "error" | "info" | "warning" | "loading";

export interface SonnerToastOptions {
  /** Primary line */
  title?: string;
  /** Secondary line */
  description?: string;
  type?: SonnerToastType;
  /** Auto-dismiss in ms; `0` keeps the toast until dismissed. Default 4000. */
  duration?: number;
}

export interface SonnerContextValue {
  /** Push a toast; returns id (await when you need the id; use {@link SonnerContextValue.dismiss} to remove early). */
  toast: QRL<(input: string | SonnerToastOptions) => string | Promise<string>>;
  dismiss: QRL<(id: string) => void | Promise<void>>;
}

const sonnerContextId = createContextId<SonnerContextValue | undefined>("q-ui-lib.sonner");

export type SonnerPosition = "top-left" | "top-right" | "bottom-left" | "bottom-right";

export interface SonnerToasterProps {
  /** Corner placement of the stack. */
  position?: SonnerPosition;
  /** Use stronger semantic backgrounds per toast type (closer to Sonner “rich” mode). */
  richColors?: boolean;
  /** Optional wrapper class for the viewport (fixed region). */
  class?: string;
}

interface InternalToast extends Required<Pick<SonnerToastOptions, "type">> {
  id: string;
  title: string;
  description?: string;
  duration: number;
  dismissing?: boolean;
  /** Snapshot for exit animation + sibling reflow while toast is still in the DOM. */
  dismissMeta?: { nvAtDismiss: number; sliceIndexAtDismiss: number; expanded?: boolean };
}

const TOAST_EXIT_MS = 300;
/** Vertical spacing between full-size rows when the stack is expanded (hover). ~card + tight gap. */
const EXPANDED_ROW_STEP_PX = 88;
/** Duration for layout morph (stack ↔ expanded) and expanded list motion. */
const EXPAND_LAYOUT_MS = 420;

const sonnerMotionStyles = `
@keyframes q-sonner-leave-stack-b {
  to {
    opacity: 0;
    transform: translateY(12px) scale(0.92);
  }
}
@keyframes q-sonner-leave-stack-t {
  to {
    opacity: 0;
    transform: translateY(-12px) scale(0.92);
  }
}
@keyframes q-sonner-leave-expanded-b {
  to {
    opacity: 0;
    transform: translateY(10px) scale(0.96);
  }
}
@keyframes q-sonner-leave-expanded-t {
  to {
    opacity: 0;
    transform: translateY(-10px) scale(0.96);
  }
}
.q-sonner-leave-stack-b {
  animation: q-sonner-leave-stack-b ${TOAST_EXIT_MS}ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
  pointer-events: none;
}
.q-sonner-leave-stack-t {
  animation: q-sonner-leave-stack-t ${TOAST_EXIT_MS}ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
  pointer-events: none;
}
.q-sonner-leave-expanded-b {
  animation: q-sonner-leave-expanded-b ${TOAST_EXIT_MS}ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
  pointer-events: none;
}
.q-sonner-leave-expanded-t {
  animation: q-sonner-leave-expanded-t ${TOAST_EXIT_MS}ms cubic-bezier(0.32, 0.72, 0, 1) forwards;
  pointer-events: none;
}
@media (prefers-reduced-motion: reduce) {
  .q-sonner-leave-stack-b,
  .q-sonner-leave-stack-t,
  .q-sonner-leave-expanded-b,
  .q-sonner-leave-expanded-t {
    animation-duration: 1ms !important;
  }
}
`;

function positionClasses(p: SonnerPosition): string {
  switch (p) {
    case "top-left":
      return "top-4 left-4 items-start";
    case "top-right":
      return "top-4 right-4 items-end";
    case "bottom-left":
      return "bottom-4 left-4 items-start";
    case "bottom-right":
    default:
      return "bottom-4 right-4 items-end";
  }
}

function typeIcon(t: SonnerToastType) {
  const common = "h-5 w-5 shrink-0";
  switch (t) {
    case "success":
      return (
        <svg class={common} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fill-rule="evenodd"
            d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
            clip-rule="evenodd"
          />
        </svg>
      );
    case "error":
      return (
        <svg class={common} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
        </svg>
      );
    case "warning":
      return (
        <svg class={common} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fill-rule="evenodd"
            d="M8.485 2.495c.673-1.167 2.357-1.167 3.03 0l6.28 10.875c.673 1.167-.17 2.625-1.516 2.625H3.72c-1.347 0-2.189-1.458-1.515-2.625L8.485 2.495zM10 5a.75.75 0 01.75.75v3.5a.75.75 0 01-1.5 0v-3.5A.75.75 0 0110 5zm0 9a1 1 0 100-2 1 1 0 000 2z"
            clip-rule="evenodd"
          />
        </svg>
      );
    case "info":
      return (
        <svg class={common} viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
          <path
            fill-rule="evenodd"
            d="M18 10a8 8 0 11-16 0 8 8 0 0116 0zm-7-4a1 1 0 11-2 0 1 1 0 012 0zM9 9a.75.75 0 000 1.5h.253a.25.25 0 01.244.304l-.459 2.066A1.75 1.75 0 0010.747 15H11a.75.75 0 000-1.5h-.253a.25.25 0 01-.244-.304l.459-2.066A1.75 1.75 0 009.253 9H9z"
            clip-rule="evenodd"
          />
        </svg>
      );
    case "loading":
      return (
        <svg class={`${common} animate-spin`} viewBox="0 0 24 24" fill="none" aria-hidden="true">
          <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4" />
          <path
            class="opacity-75"
            fill="currentColor"
            d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
          />
        </svg>
      );
    default:
      return null;
  }
}

function toastSurface(type: SonnerToastType, rich: boolean): string {
  if (!rich) {
    return "border border-separator-opaque bg-surface-raised text-label shadow-lg";
  }
  switch (type) {
    case "success":
      return "border border-system-green/30 bg-system-green/15 text-label shadow-lg";
    case "error":
      return "border border-system-red/30 bg-system-red/15 text-label shadow-lg";
    case "warning":
      return "border border-system-orange/30 bg-system-orange/15 text-label shadow-lg";
    case "info":
      return "border border-system-blue/30 bg-system-blue/15 text-label shadow-lg";
    case "loading":
      return "border border-separator-opaque bg-surface-raised text-label shadow-lg";
    default:
      return "border border-separator-opaque bg-surface-raised text-label shadow-lg";
  }
}

function iconColor(type: SonnerToastType, rich: boolean): string {
  if (!rich) {
    return type === "default" ? "text-secondary-label" : "text-label";
  }
  switch (type) {
    case "success":
      return "text-system-green";
    case "error":
      return "text-system-red";
    case "warning":
      return "text-system-orange";
    case "info":
      return "text-system-blue";
    default:
      return "text-secondary-label";
  }
}

/** Vertical step between stacked toasts (peek of older cards). */
const STACK_PEEK_PX = 14;
/** Scale reduction per level behind the front toast. */
const STACK_SCALE_STEP = 0.05;
const STACK_MIN_SCALE = 0.88;
/** After this depth (0 = front), further cards keep the same scale as this level. */
const MAX_SCALE_DEPTH = 3;
/** Collapsed stack shows only this many newest toasts; the rest appears after hover. */
const MAX_COLLAPSED_VISIBLE = 3;
/** Each step toward the back adds this much transparency (opacity -= step). */
const STACK_OPACITY_STEP = 0.3;
const STACK_MIN_OPACITY = 0.1;

function stackedVisual(
  depth: number,
  bottom: boolean,
  collapsedStacked: boolean,
  zIndex: number,
): Record<string, string | number> {
  if (!collapsedStacked) {
    return { opacity: 1, zIndex };
  }
  const scaleDepth = Math.min(depth, MAX_SCALE_DEPTH);
  const scale = Math.max(STACK_MIN_SCALE, 1 - scaleDepth * STACK_SCALE_STEP);
  const peekDepth = Math.min(depth, MAX_SCALE_DEPTH);
  const translate =
    peekDepth > 0 ? (bottom ? -peekDepth * STACK_PEEK_PX : peekDepth * STACK_PEEK_PX) : 0;
  return {
    transform: `translateY(${translate}px) scale(${scale})`,
    zIndex,
    transformOrigin: bottom ? "bottom center" : "top center",
    opacity: Math.max(STACK_MIN_OPACITY, 1 - depth * STACK_OPACITY_STEP),
  };
}

function isBottomStack(position: SonnerPosition): boolean {
  return position === "bottom-right" || position === "bottom-left";
}

const SonnerToaster = component$<SonnerToasterProps>((props) => {
  useStyles$(sonnerMotionStyles);

  const position = props.position ?? "bottom-right";
  const richColors = props.richColors ?? false;
  const stackExpanded = useSignal(false);

  const state = useStore<{ items: InternalToast[] }>({ items: [] });

  const dismiss$ = $((id: string) => {
    const active = state.items.filter((t) => !t.dismissing);
    if (active.length <= 1) {
      state.items = state.items.filter((t) => t.id !== id);
      return;
    }
    const expanded = stackExpanded.value;
    const slice = expanded
      ? active
      : active.length <= MAX_COLLAPSED_VISIBLE
        ? active
        : active.slice(-MAX_COLLAPSED_VISIBLE);
    const sliceIndex = slice.findIndex((t) => t.id === id);
    if (sliceIndex === -1) {
      state.items = state.items.filter((t) => t.id !== id);
      return;
    }
    const nvAtDismiss = slice.length;
    state.items = state.items.map((t) =>
      t.id === id
        ? {
            ...t,
            dismissing: true,
            dismissMeta: { nvAtDismiss, sliceIndexAtDismiss: sliceIndex, expanded },
          }
        : t,
    );
    if (!isServer) {
      setTimeout(() => {
        state.items = state.items.filter((t) => t.id !== id);
      }, TOAST_EXIT_MS);
    } else {
      state.items = state.items.filter((t) => t.id !== id);
    }
  });

  const toast$ = $((input: string | SonnerToastOptions) => {
    const opts: SonnerToastOptions = typeof input === "string" ? { title: input } : input;
    const id =
      typeof crypto !== "undefined" && crypto.randomUUID
        ? crypto.randomUUID()
        : `toast-${Date.now()}-${Math.random().toString(36).slice(2, 9)}`;
    const duration = opts.duration ?? 4000;
    const item: InternalToast = {
      id,
      title: opts.title ?? "",
      description: opts.description,
      type: opts.type ?? "default",
      duration,
    };
    state.items = [...state.items, item];

    if (!isServer && duration > 0) {
      setTimeout(() => {
        dismiss$(id);
      }, duration);
    }

    return id;
  });

  useContextProvider(sonnerContextId, { toast: toast$, dismiss: dismiss$ });

  const viewport = [
    "pointer-events-none fixed z-[100] flex max-h-screen w-full max-w-[420px] flex-col p-4 sm:max-w-md",
    positionClasses(position),
    props.class,
  ]
    .filter(Boolean)
    .join(" ");

  const bar = "flex w-full gap-3 rounded-lg p-4 pr-10";

  const bottom = isBottomStack(position);
  const activeItems = state.items.filter((t) => !t.dismissing);
  const exitingItems = state.items.filter((t) => t.dismissing);
  const na = activeItems.length;
  const nTotal = state.items.length;
  const itemsForView =
    stackExpanded.value || na <= MAX_COLLAPSED_VISIBLE
      ? activeItems
      : activeItems.slice(-MAX_COLLAPSED_VISIBLE);
  const nv = itemsForView.length;
  const hasExiting = exitingItems.length > 0;
  const collapsedStacked =
    nTotal > 1 && !stackExpanded.value && (nv > 1 || (nv === 1 && hasExiting));
  const stackLayerCount = collapsedStacked ? nv + exitingItems.length : nv;
  const layoutAbsolute =
    collapsedStacked || (stackExpanded.value && (nv > 1 || hasExiting));

  let stackMinHeightPx: number | undefined;
  if (collapsedStacked && stackLayerCount > 1) {
    stackMinHeightPx = 96 + (stackLayerCount - 1) * STACK_PEEK_PX;
  } else if (stackExpanded.value) {
    const rows = nv + exitingItems.length;
    if (rows > 1) {
      stackMinHeightPx = 96 + (rows - 1) * EXPANDED_ROW_STEP_PX;
    }
  }

  const liTransition = [
    `transition-[transform,opacity,bottom,top] duration-[${EXPAND_LAYOUT_MS}ms]`,
    "motion-reduce:transition-none [transition-timing-function:cubic-bezier(0.32,0.72,0,1)]",
  ].join(" ");

  const hasToasts = nTotal > 0;

  return (
    <>
      <div class={viewport}>
        <div
          class={[
            "w-full max-w-full",
            hasToasts ? "pointer-events-auto" : "pointer-events-none",
          ].join(" ")}
          onMouseEnter$={() => {
            stackExpanded.value = true;
          }}
          onMouseLeave$={() => {
            stackExpanded.value = false;
          }}
        >
          <ol
            class="relative w-full motion-reduce:transition-none"
            style={
              stackMinHeightPx !== undefined
                ? {
                    minHeight: `${stackMinHeightPx}px`,
                    transition: `min-height ${EXPAND_LAYOUT_MS}ms cubic-bezier(0.32, 0.72, 0, 1)`,
                  }
                : undefined
            }
            aria-live="polite"
            aria-relevant="additions text"
            aria-atomic="false"
          >
            {itemsForView.map((t, i) => {
              const depth = nv - 1 - i;
              const stackStyle = stackedVisual(depth, bottom, collapsedStacked, i + 1);
              const positionClassesLi = layoutAbsolute
                ? "absolute left-0 right-0 w-full max-w-full"
                : "relative";

              const style: Record<string, string | number> = { ...stackStyle };
              if (layoutAbsolute) {
                if (stackExpanded.value && (nv > 1 || hasExiting)) {
                  const off = (nv - 1 - i) * EXPANDED_ROW_STEP_PX;
                  if (bottom) {
                    style.bottom = `${off}px`;
                    style.top = "auto";
                  } else {
                    style.top = `${off}px`;
                    style.bottom = "auto";
                  }
                } else {
                  if (bottom) {
                    style.bottom = "0";
                    style.top = "auto";
                  } else {
                    style.top = "0";
                    style.bottom = "auto";
                  }
                }
              }

              return (
                <li
                  key={t.id}
                  class={[bar, positionClassesLi, toastSurface(t.type, richColors), liTransition].join(" ")}
                  style={style}
                  role="status"
                >
                  {t.type !== "default" ? (
                    <span class={iconColor(t.type, richColors)}>{typeIcon(t.type)}</span>
                  ) : null}
                  <div class="min-w-0 flex-1">
                    {t.title ? <p class="text-callout font-medium leading-snug">{t.title}</p> : null}
                    {t.description ? (
                      <p class="mt-0.5 text-caption-1 text-secondary-label leading-snug">{t.description}</p>
                    ) : null}
                  </div>
                  <button
                    type="button"
                    class={[
                      "absolute right-2 top-2 rounded-md p-1.5 text-tertiary-label transition-colors",
                      "hover:bg-fill-secondary hover:text-label",
                      "focus:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2",
                    ].join(" ")}
                    aria-label="Close notification"
                    onClick$={() => dismiss$(t.id)}
                  >
                    <svg class="h-4 w-4" viewBox="0 0 20 20" fill="currentColor" aria-hidden="true">
                      <path d="M6.28 5.22a.75.75 0 00-1.06 1.06L8.94 10l-3.72 3.72a.75.75 0 101.06 1.06L10 11.06l3.72 3.72a.75.75 0 101.06-1.06L11.06 10l3.72-3.72a.75.75 0 00-1.06-1.06L10 8.94 6.28 5.22z" />
                    </svg>
                  </button>
                </li>
              );
            })}
            {exitingItems.map((t) => {
              const meta = t.dismissMeta;
              if (!meta) {
                return null;
              }
              const depth = meta.nvAtDismiss - 1 - meta.sliceIndexAtDismiss;
              const stackStyle = stackedVisual(depth, bottom, !meta.expanded, meta.sliceIndexAtDismiss + 1);
              const leave = meta.expanded
                ? bottom
                  ? "q-sonner-leave-expanded-b"
                  : "q-sonner-leave-expanded-t"
                : bottom
                  ? "q-sonner-leave-stack-b"
                  : "q-sonner-leave-stack-t";
              const positionClassesLi = "absolute left-0 right-0 w-full max-w-full";

              const style: Record<string, string | number> = { ...stackStyle };
              if (meta.expanded) {
                const off = (meta.nvAtDismiss - 1 - meta.sliceIndexAtDismiss) * EXPANDED_ROW_STEP_PX;
                if (bottom) {
                  style.bottom = `${off}px`;
                  style.top = "auto";
                } else {
                  style.top = `${off}px`;
                  style.bottom = "auto";
                }
              } else {
                if (bottom) {
                  style.bottom = "0";
                  style.top = "auto";
                } else {
                  style.top = "0";
                  style.bottom = "auto";
                }
              }

              return (
                <li
                  key={`${t.id}__exit`}
                  class={[bar, positionClassesLi, toastSurface(t.type, richColors), leave].join(" ")}
                  style={style}
                  role="status"
                  aria-hidden="true"
                >
                  {t.type !== "default" ? (
                    <span class={iconColor(t.type, richColors)}>{typeIcon(t.type)}</span>
                  ) : null}
                  <div class="min-w-0 flex-1">
                    {t.title ? <p class="text-callout font-medium leading-snug">{t.title}</p> : null}
                    {t.description ? (
                      <p class="mt-0.5 text-caption-1 text-secondary-label leading-snug">{t.description}</p>
                    ) : null}
                  </div>
                </li>
              );
            })}
          </ol>
        </div>
      </div>
      <Slot />
    </>
  );
});

/**
 * Programmatic toasts; must be used in a component rendered under {@link Sonner.Toaster}.
 */
export function useSonner(): SonnerContextValue {
  const ctx = useContext(sonnerContextId);
  if (!ctx) {
    throw new Error("useSonner() must be used within a component tree that includes <Sonner.Toaster />.");
  }
  return ctx;
}

/** Sonner-style toast stack (Qwik port; no React `sonner` dependency). */
export const Sonner = {
  Toaster: SonnerToaster,
};
