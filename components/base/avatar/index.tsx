/**
 * @component avatar
 * @title Avatar
 * @version 1.0.0
 * @example Image + fallback
 * Image + fallback — see the example below.
 * ```tsx
 * import { Avatar } from "~/components/ui/base/avatar";
 * 
 * <Avatar.Root>
 *   <Avatar.Image src="…" alt="Preview" />
 *   <Avatar.Fallback>QU</Avatar.Fallback>
 * </Avatar.Root>
 * ```
 *
 * @example Sizes
 * Prop `size` on `Avatar.Root`: `sm`, `md` (default), `lg`.
 * ```tsx
 * import { Avatar } from "~/components/ui/base/avatar";
 * 
 * <div class="flex items-center gap-3">
 *   <Avatar.Root size="sm">
 *     <Avatar.Image src="…" alt="" />
 *     <Avatar.Fallback>S</Avatar.Fallback>
 *   </Avatar.Root>
 *   <Avatar.Root size="md">
 *     <Avatar.Image src="…" alt="" />
 *     <Avatar.Fallback>M</Avatar.Fallback>
 *   </Avatar.Root>
 *   <Avatar.Root size="lg">
 *     <Avatar.Image src="…" alt="" />
 *     <Avatar.Fallback>L</Avatar.Fallback>
 *   </Avatar.Root>
 * </div>
 * ```
 *
 * @example Fallback only
 * Without `Avatar.Image` or without `src`, the initial / placeholder remains.
 * ```tsx
 * import { Avatar } from "~/components/ui/base/avatar";
 * 
 * <Avatar.Root>
 *   <Avatar.Fallback>AB</Avatar.Fallback>
 * </Avatar.Root>
 * ```
 *
 * @example Image load error
 * An invalid URL shows the `Avatar.Fallback` again.
 * ```tsx
 * import { Avatar } from "~/components/ui/base/avatar";
 * 
 * <Avatar.Root>
 *   <Avatar.Image src="https://example.invalid/does-not-exist.jpg" alt="" />
 *   <Avatar.Fallback>!</Avatar.Fallback>
 * </Avatar.Root>
 * ```
 
 
 
 
 
 
 
 
 
 */

import {
  $,
  component$,
  createContextId,
  type PropsOf,
  Slot,
  useContext,
  useContextProvider,
  useSignal,
  useTask$,
  useVisibleTask$,
} from "@builder.io/qwik";

export type AvatarImageStatus = "idle" | "loading" | "loaded" | "error";

const AvatarStatusContext = createContextId<
  ReturnType<typeof useSignal<AvatarImageStatus>>
>("q-ui-lib.avatar-image-status");

export interface AvatarRootProps extends Omit<PropsOf<"div">, "class"> {
  /** Box size; typography inside {@link AvatarFallback} scales with size. */
  size?: "sm" | "md" | "lg";
  class?: string;
}

/**
 * Container for {@link AvatarImage} and {@link AvatarFallback}.
 * Structure matches {@link https://qwikui.com/docs/styled/avatar | Qwik UI Styled Avatar}; colors use COLORS.md tokens.
 */
export const AvatarRoot = component$<AvatarRootProps>((props) => {
  const { size = "md", class: className, ...rest } = props;
  const status = useSignal<AvatarImageStatus>("idle");
  useContextProvider(AvatarStatusContext, status);

  const sizeClasses = {
    sm: "h-8 w-8 [&_.avatar-fallback]:text-caption-1",
    md: "h-10 w-10 [&_.avatar-fallback]:text-callout",
    lg: "h-12 w-12 [&_.avatar-fallback]:text-headline",
  }[size];

  const base =
    "relative flex shrink-0 items-center justify-center overflow-hidden rounded-full ring-offset-background";

  const merged = [base, sizeClasses, className].filter(Boolean).join(" ");

  return (
    <div {...rest} class={merged}>
      <Slot />
    </div>
  );
});

/**
 * Avatar image; coordinates loading / error with {@link AvatarFallback} via context.
 * An invalid URL is never inserted into `<img>` — preload via `Image()` first, then render (no broken-image icon).
 */
export const AvatarImage = component$<PropsOf<"img">>((props) => {
  const status = useContext(AvatarStatusContext);
  const { class: className, ...rest } = props;

  useTask$(({ track }) => {
    const src = track(() => props.src);
    if (!src) {
      status.value = "idle";
    } else {
      status.value = "loading";
    }
  });

  // eslint-disable-next-line qwik/no-use-visible-task -- preload only in the browser; SSR does not render <img> with a bad URL
  useVisibleTask$(({ track, cleanup }) => {
    const src = track(() => props.src);
    if (!src) {
      return;
    }
    let stale = false;
    cleanup(() => {
      stale = true;
    });
    const probe = new Image();
    probe.onload = () => {
      if (stale) {
        return;
      }
      status.value = "loaded";
    };
    probe.onerror = () => {
      if (stale) {
        return;
      }
      status.value = "error";
    };
    probe.src = src;
  });

  if (!props.src || status.value !== "loaded") {
    return null;
  }

  const merged = [
    "avatar-image relative z-10 aspect-square h-full w-full object-cover",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  const handleImgError$ = $(() => {
    status.value = "error";
  });

  return (
    <img
      {...rest}
      class={merged}
      decoding="async"
      onLoad$={props.onLoad$}
      onError$={
        props.onError$ ? [handleImgError$, props.onError$] : handleImgError$
      }
    />
  );
});

export type AvatarFallbackProps = PropsOf<"div">;

/**
 * Shown while the image is loading, when it fails, or when no {@link AvatarImage} src is set.
 */
export const AvatarFallback = component$<AvatarFallbackProps>((props) => {
  const status = useContext(AvatarStatusContext);
  const { class: className, ...rest } = props;

  const base =
    "avatar-fallback absolute inset-0 z-0 flex items-center justify-center rounded-full bg-fill-tertiary font-semibold text-label ring-1 ring-inset ring-separator-opaque select-none";

  const merged = [
    base,
    status.value === "loaded" ? "hidden" : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div {...rest} class={merged} aria-hidden={status.value === "loaded"}>
      <Slot />
    </div>
  );
});

/**
 * Compound API aligned with {@link https://qwikui.com/docs/styled/avatar | Qwik UI Styled Avatar}:
 * `Avatar.Root`, `Avatar.Image`, `Avatar.Fallback`.
 */
export const Avatar = {
  Root: AvatarRoot,
  Image: AvatarImage,
  Fallback: AvatarFallback,
};
