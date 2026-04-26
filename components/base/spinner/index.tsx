/**
 * @component spinner
 * @title Spinner
 * @version 1.6.0
 * @example Velikosti
 * Velikosti — viz ukázka níže.
 * ```tsx
 * import { Spinner } from "~/components/ui/base/spinner";
 *
 * <div class="flex items-center gap-6">
 *   <Spinner size="sm" />
 *   <Spinner size="md" />
 *   <Spinner size="lg" />
 * </div>
 * ```
 *
 * @example Varianty
 * `variant`: mimo jiné `ring`, `dash`, `dots`, `wave`, `stack`, `square`, `ripple`, `needle`, … (výchozí je `arc`).
 * ```tsx
 * import { Spinner } from "~/components/ui/base/spinner";
 *
 * <div class="flex flex-wrap items-center gap-x-6 gap-y-8">
 *   <Spinner variant="ring" />
 *   <Spinner variant="dash" />
 *   <Spinner variant="dots" />
 *   <Spinner variant="typing" />
 *   <Spinner variant="pulse" />
 *   <Spinner variant="bars" />
 *   <Spinner variant="ping" />
 *   <Spinner variant="orbit" />
 *   <Spinner variant="grid" />
 *   <Spinner variant="activity" />
 *   <Spinner variant="duo" />
 *   <Spinner variant="chase" />
 *   <Spinner variant="square" />
 *   <Spinner variant="ripple" />
 *   <Spinner variant="wave" />
 *   <Spinner variant="stack" />
 *   <Spinner variant="needle" />
 *   <Spinner variant="cube" />
 *   <Spinner variant="arc" />
 * </div>
 * ```
 *
 * @example Styl macOS (Activity)
 * `activity` — paprsky jako indikátor činnosti; `duo` — dva soustředné oblouky proti sobě; `chase` — segmenty po obvodu s vlnou pulzu.
 * ```tsx
 * import { Spinner } from "~/components/ui/base/spinner";
 *
 * <div class="flex flex-wrap items-center gap-8">
 *   <Spinner variant="activity" size="lg" />
 *   <Spinner variant="duo" size="lg" />
 *   <Spinner variant="chase" size="lg" />
 * </div>
 * ```
 *
 * @example S popiskem pro čtečky
 * Prop `label` přidá `role=&quot;status&quot;` a skrytý text ( `sr-only` ).
 * ```tsx
 * import { Spinner } from "~/components/ui/base/spinner";
 *
 * <Spinner size="md" label="Načítám data" />
 * ```
 *
 * @example Vlastní barva
 * U `ring` / `dash` / `duo` / `square` přepiš okraje přes `class`. U `arc` použij `text-*`. U výplňových a „čárových“ variant (`dots`, `wave`, `stack`, `needle`, `ripple`, …) použij `text-*` (`currentColor`).
 * ```tsx
 * import { Spinner } from "~/components/ui/base/spinner";
 *
 * <div class="flex gap-6">
 *   <Spinner class="border-t-system-green" variant="ring" size="lg" />
 *   <Spinner class="text-system-green" variant="arc" size="lg" />
 * </div>
 * ```
 
 
 */

import { component$, useStyles$ } from "@builder.io/qwik";

export type SpinnerVariant =
  | "ring"
  | "dash"
  | "dots"
  | "typing"
  | "pulse"
  | "bars"
  | "ping"
  | "orbit"
  | "grid"
  /** Paprsky jako indikátor činnosti (macOS Activity) */
  | "activity"
  /** Dva soustředné oblouky rotující proti sobě */
  | "duo"
  /** Dvanáct segmentů po obvodu s vlnou pulzu */
  | "chase"
  /** Zaoblený čtverec, otáčející se rám */
  | "square"
  /** Soustředné rozšiřující se kruhy */
  | "ripple"
  /** Pět svislých sloupců (vlna / equalizer) */
  | "wave"
  /** Tři vodorovné čárky (skeleton / řádky) */
  | "stack"
  /** Jedna ručička z centra (ciferník) */
  | "needle"
  /** 3D kostka (CSS transform, lehký náklon + rotace kolem Y) */
  | "cube"
  /** Nedokončený prstenec (conic-gradient + maska) */
  | "arc";

export interface SpinnerProps {
  /** Vizuální styl */
  variant?: SpinnerVariant;
  /** Vizuální velikost */
  size?: "sm" | "md" | "lg";
  /** Doplňkové Tailwind třídy (např. barva) */
  class?: string;
  /**
   * Text pro čtečky (`role="status"`). Bez něj je spinner dekorativní (`aria-hidden`).
   */
  label?: string;
}

const ringSize = {
  sm: "size-4 border-2",
  md: "size-8 border-2",
  lg: "size-12 border-[3px]",
} as const;

const pulseSize = {
  sm: "size-4",
  md: "size-8",
  lg: "size-12",
} as const;

const dotsLayout = {
  sm: "gap-0.5 [&>span]:size-1",
  md: "gap-1 [&>span]:size-1.5",
  lg: "gap-1.5 [&>span]:size-2",
} as const;

const barsLayout = {
  sm: "h-3 gap-0.5 [&>span]:h-full [&>span]:w-0.5",
  md: "h-5 gap-1 [&>span]:h-full [&>span]:w-1",
  lg: "h-8 gap-1.5 [&>span]:h-full [&>span]:w-1.5",
} as const;

const orbitBox = {
  sm: "size-6 [&>.orbit-dot]:size-1",
  md: "size-8 [&>.orbit-dot]:size-1.5",
  lg: "size-12 [&>.orbit-dot]:size-2",
} as const;

const pingBox = {
  sm: "size-4 [&>.ping-core]:size-1.5",
  md: "size-8 [&>.ping-core]:size-2.5",
  lg: "size-12 [&>.ping-core]:size-3.5",
} as const;

const gridLayout = {
  sm: "grid-cols-2 gap-0.5 [&>span]:size-1",
  md: "grid-cols-2 gap-1 [&>span]:size-2",
  lg: "grid-cols-2 gap-1.5 [&>span]:size-3",
} as const;

/** Úhly paprsků (8 × 45°) — styl Activity indicator */
const ACTIVITY_RAY_DEG = [0, 45, 90, 135, 180, 225, 270, 315] as const;

/** Segmenty po obvodu (12 × 30°) */
const CHASE_RAY_DEG = [0, 30, 60, 90, 120, 150, 180, 210, 240, 270, 300, 330] as const;

/** Relativní výšky sloupců u `wave` (v %) */
const WAVE_HEIGHT_PCT = [48, 74, 100, 68, 52] as const;

const stackWidths = {
  sm: ["w-3.5", "w-5", "w-4"],
  md: ["w-5", "w-7", "w-5"],
  lg: ["w-7", "w-9", "w-6"],
} as const;

/** Hrana 3D kostky (`variant="cube"`) */
const cubeSide = {
  sm: "12px",
  md: "19px",
  lg: "28px",
} as const;

/** Tloušťka „prstence“ u `arc` (maska) */
const arcTrackPx = {
  sm: "3.5px",
  md: "4.5px",
  lg: "6px",
} as const;

const spinnerCubeArcStyles = `
@keyframes q-spinner-cube-y {
  from {
    transform: rotateX(-22deg) rotateY(0deg);
  }
  to {
    transform: rotateX(-22deg) rotateY(360deg);
  }
}
.q-spinner-cube-scene {
  perspective: 560px;
}
.q-spinner-cube-box {
  position: relative;
  transform-style: preserve-3d;
  animation: q-spinner-cube-y 2.6s linear infinite;
  width: var(--q-cube-s, 1rem);
  height: var(--q-cube-s, 1rem);
}
@media (prefers-reduced-motion: reduce) {
  .q-spinner-cube-box {
    animation: none;
    transform: rotateX(-22deg) rotateY(36deg);
  }
}
.q-spinner-cube-face {
  position: absolute;
  inset: 0;
  transform-style: preserve-3d;
  backface-visibility: visible;
}
.q-spinner-cube-f0 {
  transform: rotateY(0deg) translateZ(calc(var(--q-cube-s, 1rem) / 2));
}
.q-spinner-cube-f1 {
  transform: rotateY(90deg) translateZ(calc(var(--q-cube-s, 1rem) / 2));
}
.q-spinner-cube-f2 {
  transform: rotateY(180deg) translateZ(calc(var(--q-cube-s, 1rem) / 2));
}
.q-spinner-cube-f3 {
  transform: rotateY(-90deg) translateZ(calc(var(--q-cube-s, 1rem) / 2));
}
.q-spinner-cube-f4 {
  transform: rotateX(90deg) translateZ(calc(var(--q-cube-s, 1rem) / 2));
}
.q-spinner-cube-f5 {
  transform: rotateX(-90deg) translateZ(calc(var(--q-cube-s, 1rem) / 2));
}
`;

const ringBase =
  "inline-block shrink-0 rounded-full border-fill-tertiary border-t-accent align-middle animate-spin motion-reduce:animate-none";

const dashBase =
  "inline-block shrink-0 rounded-full border-2 border-dashed border-accent/40 align-middle animate-spin motion-reduce:animate-none";

const squareBase =
  "inline-block shrink-0 rounded-md border-fill-tertiary border-t-accent align-middle animate-spin motion-reduce:animate-none";

const rippleParent =
  "relative inline-flex shrink-0 items-center justify-center overflow-visible text-accent";

const rippleRing1 =
  "absolute inset-0 rounded-full border border-current/25 animate-ping [animation-duration:1.75s] motion-reduce:animate-none";

const rippleRing2 =
  "absolute inset-[14%] rounded-full border border-current/35 animate-ping [animation-duration:1.75s] [animation-delay:0.45s] motion-reduce:animate-none";

const rippleRing3 =
  "absolute inset-[28%] rounded-full border border-current/40 animate-ping [animation-duration:1.75s] [animation-delay:0.9s] motion-reduce:animate-none";

const rippleCore = "absolute inset-[43%] z-[1] rounded-full bg-current opacity-90";

const waveParent =
  "inline-flex items-end justify-center text-accent motion-reduce:opacity-85 [&>span]:[animation-duration:0.65s]";

const waveLayout = {
  sm: "h-3 min-w-[1.75rem] gap-0.5 [&>span]:w-[2px]",
  md: "h-5 min-w-[2.5rem] gap-1 [&>span]:w-[3px]",
  lg: "h-9 min-w-[3.5rem] gap-1.5 [&>span]:w-1 [&>span]:max-w-1",
} as const;

const waveBar =
  "self-end shrink-0 rounded-full bg-current animate-bounce motion-reduce:animate-none";

const stackParent =
  "inline-flex flex-col items-center justify-center gap-1 text-accent shrink-0 motion-reduce:opacity-85 [&>span]:[animation-duration:1.05s] [&>span:nth-child(1)]:[animation-delay:0ms] [&>span:nth-child(2)]:[animation-delay:0.15s] [&>span:nth-child(3)]:[animation-delay:0.3s]";

const stackLine = "h-0.5 rounded-full bg-current animate-pulse motion-reduce:animate-none";

const needleParent = "relative inline-block shrink-0 align-middle text-accent";

const needleHand =
  "absolute bottom-1/2 left-1/2 h-[42%] w-[6%] max-w-[3px] min-w-[1.5px] -translate-x-1/2 origin-bottom rounded-full bg-current animate-spin motion-reduce:animate-none";

const dotsParent =
  "inline-flex items-center text-accent motion-reduce:opacity-70 [&>span]:rounded-full [&>span]:bg-current [&>span]:animate-bounce [&>span]:[animation-duration:0.7s] [&>span:nth-child(1)]:[animation-delay:-0.32s] [&>span:nth-child(2)]:[animation-delay:-0.16s] motion-reduce:[&>span]:animate-none";

const typingParent =
  "inline-flex items-center text-accent motion-reduce:opacity-70 [&>span]:rounded-full [&>span]:bg-current [&>span]:animate-pulse [&>span]:[animation-duration:1.1s] [&>span:nth-child(1)]:[animation-delay:0ms] [&>span:nth-child(2)]:[animation-delay:0.2s] [&>span:nth-child(3)]:[animation-delay:0.4s] motion-reduce:[&>span]:animate-none";

const pulseParent =
  "inline-block shrink-0 rounded-full bg-current text-accent align-middle animate-pulse motion-reduce:animate-none";

const barsParent =
  "inline-flex items-end text-accent motion-reduce:opacity-70 [&>span]:shrink-0 [&>span]:rounded-sm [&>span]:bg-current [&>span]:animate-bounce [&>span]:[animation-duration:0.7s] [&>span:nth-child(1)]:[animation-delay:-0.32s] [&>span:nth-child(2)]:[animation-delay:-0.16s] motion-reduce:[&>span]:animate-none";

const pingParent =
  "relative inline-flex shrink-0 items-center justify-center text-accent motion-reduce:opacity-80";

const pingHalo =
  "absolute inset-0 rounded-full bg-current opacity-35 animate-ping motion-reduce:animate-none";

const orbitParent =
  "relative inline-block shrink-0 animate-spin text-accent motion-reduce:animate-none";

const orbitDot =
  "orbit-dot absolute left-1/2 top-0 -translate-x-1/2 rounded-full bg-current";

const gridParent =
  "inline-grid text-accent motion-reduce:opacity-70 [&>span]:rounded-sm [&>span]:bg-current [&>span]:animate-pulse [&>span]:[animation-duration:1s] [&>span:nth-child(1)]:[animation-delay:0ms] [&>span:nth-child(2)]:[animation-delay:0.15s] [&>span:nth-child(3)]:[animation-delay:0.3s] [&>span:nth-child(4)]:[animation-delay:0.45s] motion-reduce:[&>span]:animate-none";

const activityParent =
  "relative inline-block shrink-0 animate-spin align-middle text-accent motion-reduce:animate-none";

const activityRay =
  "absolute left-1/2 top-1/2 block h-[38%] w-[12%] max-w-[3px] min-w-[1px] -translate-x-1/2 origin-bottom rounded-full bg-current opacity-[0.92]";

const duoParent = "relative inline-block shrink-0 align-middle text-accent";

const duoOuter =
  "absolute inset-0 rounded-full border-2 border-fill-tertiary border-t-accent animate-spin motion-reduce:animate-none";

const duoInner =
  "absolute inset-[14%] rounded-full border-2 border-fill-tertiary border-b-accent animate-spin motion-reduce:animate-none [animation-direction:reverse]";

const chaseParent =
  "relative inline-block shrink-0 align-middle text-accent motion-reduce:opacity-85 [&>span]:[animation-duration:1.05s]";

const chaseRay =
  "absolute left-1/2 top-1/2 block h-[30%] w-[7%] max-w-[2.5px] min-w-[1px] -translate-x-1/2 origin-bottom rounded-full bg-current opacity-50 animate-pulse motion-reduce:animate-none";

/**
 * Indikátor načítání (bez SVG), barvy z COLORS.md (`accent`, výplně).
 */
export const Spinner = component$<SpinnerProps>((props) => {
  useStyles$(spinnerCubeArcStyles);
  const variant = props.variant ?? "arc";
  const sizeKey = props.size ?? "md";
  const label = props.label;

  const graphic = (() => {
    switch (variant) {
      case "dash": {
        const merged = [dashBase, ringSize[sizeKey], props.class].filter(Boolean).join(" ");
        return <span class={merged} aria-hidden="true" />;
      }
      case "dots": {
        const merged = [dotsParent, dotsLayout[sizeKey], props.class].filter(Boolean).join(" ");
        return (
          <span class={merged} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        );
      }
      case "typing": {
        const merged = [typingParent, dotsLayout[sizeKey], props.class].filter(Boolean).join(" ");
        return (
          <span class={merged} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        );
      }
      case "pulse": {
        const merged = [pulseParent, pulseSize[sizeKey], props.class].filter(Boolean).join(" ");
        return <span class={merged} aria-hidden="true" />;
      }
      case "bars": {
        const merged = [barsParent, barsLayout[sizeKey], props.class].filter(Boolean).join(" ");
        return (
          <span class={merged} aria-hidden="true">
            <span />
            <span />
            <span />
          </span>
        );
      }
      case "ping": {
        const merged = [pingParent, pingBox[sizeKey], props.class].filter(Boolean).join(" ");
        return (
          <span class={merged} aria-hidden="true">
            <span class={pingHalo} />
            <span class="ping-core relative rounded-full bg-current" />
          </span>
        );
      }
      case "orbit": {
        const merged = [orbitParent, orbitBox[sizeKey], props.class].filter(Boolean).join(" ");
        return (
          <span class={merged} aria-hidden="true">
            <span class={orbitDot} />
          </span>
        );
      }
      case "grid": {
        const merged = [gridParent, gridLayout[sizeKey], props.class].filter(Boolean).join(" ");
        return (
          <span class={merged} aria-hidden="true">
            <span />
            <span />
            <span />
            <span />
          </span>
        );
      }
      case "activity": {
        const merged = [activityParent, pulseSize[sizeKey], props.class].filter(Boolean).join(" ");
        return (
          <span class={merged} aria-hidden="true">
            {ACTIVITY_RAY_DEG.map((deg) => (
              <span
                key={deg}
                class={activityRay}
                style={{
                  transform: `translate(-50%, -100%) rotate(${deg}deg)`,
                }}
              />
            ))}
          </span>
        );
      }
      case "duo": {
        const merged = [duoParent, pulseSize[sizeKey], props.class].filter(Boolean).join(" ");
        return (
          <span class={merged} aria-hidden="true">
            <span class={duoOuter} />
            <span class={duoInner} />
          </span>
        );
      }
      case "chase": {
        const merged = [chaseParent, pulseSize[sizeKey], props.class].filter(Boolean).join(" ");
        return (
          <span class={merged} aria-hidden="true">
            {CHASE_RAY_DEG.map((deg, i) => (
              <span
                key={deg}
                class={chaseRay}
                style={{
                  transform: `translate(-50%, -100%) rotate(${deg}deg)`,
                  animationDelay: `${i * 0.065}s`,
                }}
              />
            ))}
          </span>
        );
      }
      case "square": {
        const merged = [squareBase, ringSize[sizeKey], props.class].filter(Boolean).join(" ");
        return <span class={merged} aria-hidden="true" />;
      }
      case "ripple": {
        const merged = [rippleParent, pulseSize[sizeKey], props.class].filter(Boolean).join(" ");
        return (
          <span class={merged} aria-hidden="true">
            <span class={rippleRing1} />
            <span class={rippleRing2} />
            <span class={rippleRing3} />
            <span class={rippleCore} />
          </span>
        );
      }
      case "wave": {
        const merged = [waveParent, waveLayout[sizeKey], props.class].filter(Boolean).join(" ");
        return (
          <span class={merged} aria-hidden="true">
            {WAVE_HEIGHT_PCT.map((pct, i) => (
              <span
                key={i}
                class={waveBar}
                style={{
                  height: `${pct}%`,
                  animationDelay: `${i * 0.09}s`,
                }}
              />
            ))}
          </span>
        );
      }
      case "stack": {
        const w = stackWidths[sizeKey];
        const merged = [stackParent, props.class].filter(Boolean).join(" ");
        return (
          <span class={merged} aria-hidden="true">
            <span class={[stackLine, w[0]].filter(Boolean).join(" ")} />
            <span class={[stackLine, w[1]].filter(Boolean).join(" ")} />
            <span class={[stackLine, w[2]].filter(Boolean).join(" ")} />
          </span>
        );
      }
      case "needle": {
        const merged = [needleParent, pulseSize[sizeKey], props.class].filter(Boolean).join(" ");
        return (
          <span class={merged} aria-hidden="true">
            <span class={needleHand} />
          </span>
        );
      }
      case "cube": {
        const edge = cubeSide[sizeKey];
        const merged = [
          "q-spinner-cube-scene inline-flex shrink-0 items-center justify-center align-middle text-accent",
          pulseSize[sizeKey],
          props.class,
        ]
          .filter(Boolean)
          .join(" ");
        return (
          <span class={merged} aria-hidden="true">
            <span class="q-spinner-cube-box" style={{ "--q-cube-s": edge }}>
              <span class="q-spinner-cube-face q-spinner-cube-f0 rounded-[2px] border border-current/50 bg-current/10" />
              <span class="q-spinner-cube-face q-spinner-cube-f1 rounded-[2px] border border-current/50 bg-current/10" />
              <span class="q-spinner-cube-face q-spinner-cube-f2 rounded-[2px] border border-current/45 bg-current/8" />
              <span class="q-spinner-cube-face q-spinner-cube-f3 rounded-[2px] border border-current/45 bg-current/8" />
              <span class="q-spinner-cube-face q-spinner-cube-f4 rounded-[2px] border border-current/40 bg-current/12" />
              <span class="q-spinner-cube-face q-spinner-cube-f5 rounded-[2px] border border-current/40 bg-current/12" />
            </span>
          </span>
        );
      }
      case "arc": {
        const track = arcTrackPx[sizeKey];
        const merged = [
          "inline-block shrink-0 text-accent align-middle animate-spin motion-reduce:animate-none",
          pulseSize[sizeKey],
          props.class,
        ]
          .filter(Boolean)
          .join(" ");
        return (
          <span
            class={merged}
            style={{
              borderRadius: "50%",
              background: "conic-gradient(from 0deg, transparent 0deg 110deg, currentColor 110deg 360deg)",
              WebkitMask: `radial-gradient(farthest-side, transparent calc(100% - ${track}), #000 0)`,
              mask: `radial-gradient(farthest-side, transparent calc(100% - ${track}), #000 0)`,
            }}
            aria-hidden="true"
          />
        );
      }
      case "ring":
      default: {
        const merged = [ringBase, ringSize[sizeKey], props.class].filter(Boolean).join(" ");
        return <span class={merged} aria-hidden="true" />;
      }
    }
  })();

  if (label) {
    return (
      <span class="inline-flex items-center gap-2" role="status">
        {graphic}
        <span class="sr-only">{label}</span>
      </span>
    );
  }

  return graphic;
});
