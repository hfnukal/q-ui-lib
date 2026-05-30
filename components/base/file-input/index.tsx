/**
 * @component file-input
 * @title FileInput
 * @version 1.0.0
 * @example Full screen (fullScreen)
 * Covers the viewport (`fixed`), implicitly `noDropBorder`. Overlay only when dragging files from the OS (not text from anywhere).
 * On a page with multiple zones, enable it conditionally (e.g. a checkbox), otherwise it will override the whole page.
 * ```tsx
 * import { $, component$, useSignal } from "@builder.io/qwik";
 * import { FileInput } from "~/components/ui/base/file-input";
 *
 * export default component$(() => {
 *   const enabled = useSignal(false);
 *   return (
 *     <>
 *       <label class="flex cursor-pointer items-center gap-2 text-callout text-label">
 *         <input
 *           type="checkbox"
 *           class="h-4 w-4 rounded border-separator-opaque accent-accent"
 *           checked={enabled.value}
 *           onChange$={$((_, el) => {
 *             enabled.value = el.checked;
 *           })}
 *         />
 *         Enable full-screen drop (overlays the previews below)
 *       </label>
 *       {enabled.value ? (
 *         <FileInput.DropArea fullScreen dropLabel="Drop files">
 *           <FileInput.Input name="fullscreen-demo" hidden multiple />
 *         </FileInput.DropArea>
 *       ) : null}
 *     </>
 *   );
 * });
 * ```
 *
 * @example Drop zone + hidden input
 * On drag over the border and background change; the text from `dropLabel` appears over the zone.
 * ```tsx
 * import { FileInput } from "~/components/ui/base/file-input";
 * 
 * <FileInput.DropArea dropLabel="Drop a file here" class="max-w-lg">
 *   <FileInput.Input name="doc" hidden accept=".pdf,.png" />
 * </FileInput.DropArea>
 * ```
 *
 * @example Multiple files (hidden input)
 * Multiple files via `multiple` on the hidden input.
 * ```tsx
 * import { FileInput } from "~/components/ui/base/file-input";
 * 
 * <FileInput.DropArea dropLabel="Drop one or more files" class="max-w-lg">
 *   <FileInput.Input name="demo-multi" hidden multiple />
 * </FileInput.DropArea>
 * ```
 *
 * @example Multiple files (visible input)
 * The same interface with a visible file input in the zone content.
 * ```tsx
 * import { FileInput } from "~/components/ui/base/file-input";
 *
 * <FileInput.DropArea dropLabel="Drop one or more files" class="max-w-lg">
 *   <FileInput.Input name="demo-multi" multiple />
 * </FileInput.DropArea>
 * ```
 *
 * @example Without overlay (noDropOverlay)
 * `noDropOverlay` highlights only the border during a drag — without the semi-transparent area with text.
 * ```tsx
 * import { FileInput } from "~/components/ui/base/file-input";
 *
 * <FileInput.DropArea noDropOverlay class="max-w-lg">
 *   <p class="mb-3 text-callout text-secondary-label">Drag a file here or click below.</p>
 *   <FileInput.Input name="nodrop-overlay" hidden />
 * </FileInput.DropArea>
 * ```
 *
 * @example Without border (noDropBorder)
 * `noDropBorder` removes the border and padding — just the content in a clean area; the overlay is turned off automatically.
 * ```tsx
 * import { FileInput } from "~/components/ui/base/file-input";
 *
 * <FileInput.DropArea noDropBorder class="max-w-lg">
 *   <p class="text-callout text-secondary-label">Drag a file here, or click below.</p>
 *   <FileInput.Input name="nodrop-border" hidden />
 * </FileInput.DropArea>
 * ```
 *
 * @example Sizes (variant)
 * Prop `variant`: `xl`, `lg`, `md` (default), `sm`, `xs`. `FileInput.Input` reads context from `FileInput.DropArea`, so wrap it in a `DropArea` (`noDropBorder` keeps it frameless).
 * ```tsx
 * import { FileInput } from "~/components/ui/base/file-input";
 *
 * <FileInput.DropArea noDropBorder class="flex flex-col gap-4">
 *   <FileInput.Input variant="xl" />
 *   <FileInput.Input variant="lg" />
 *   <FileInput.Input variant="md" />
 *   <FileInput.Input variant="sm" />
 *   <FileInput.Input variant="xs" />
 * </FileInput.DropArea>
 * ```
 */

import {
  $,
  component$,
  createContextId,
  type PropsOf,
  type Signal,
  Slot,
  sync$,
  useContext,
  useContextProvider,
  useOnDocument,
  useOnWindow,
  useSignal,
  useVisibleTask$,
} from "@builder.io/qwik";

export interface FileInputContextValue {
  /** Ref to the `<input type="file">` inside DropArea — files are set here on drop. */
  inputRef: Signal<HTMLInputElement | undefined>;
  /** File names from the last drop — a reliable alternative to `input.files` (which the browser may block). */
  droppedLabel: Signal<string>;
}

const fileInputContextId = createContextId<FileInputContextValue>("q-ui-lib.file-input");

function formatFileList(files: FileList | null | undefined): string {
  if (!files?.length) return "";
  return Array.from(files, (f) => f.name).join(", ");
}

/** Selector for the `DropArea` host with `fullScreen` — `sync$` may use only literals, not imports. */
const FILE_INPUT_FS_HOST_SEL = "[data-q-ui-file-input-fullscreen]";

/**
 * For `fullScreen`: listeners on `document` and `window` so a file can be dropped anywhere on the page
 * (not just on a node inside a Tab / clipped container). Without this, the `fixed` host may receive only part of the viewport.
 */
const FileInputFullscreenDocumentHooks = component$<{
  dragDepth: Signal<number>;
  fileTypesDrag: Signal<boolean>;
  droppedLabel: Signal<string>;
}>((props) => {
  useOnDocument(
    "dragover",
    sync$((e: DragEvent) => {
      e.preventDefault();
    }),
  );

  useOnDocument(
    "dragover",
    $((e: DragEvent) => {
      const types = e.dataTransfer?.types;
      if (!types) {
        props.fileTypesDrag.value = false;
        return;
      }
      const list = types as unknown as string[] | DOMStringList;
      props.fileTypesDrag.value =
        typeof (list as DOMStringList).contains === "function"
          ? (list as DOMStringList).contains("Files")
          : Array.from(list as Iterable<string>).includes("Files");
    }),
  );

  useOnWindow(
    "dragenter",
    $(() => {
      props.dragDepth.value++;
    }),
  );
  useOnWindow(
    "dragleave",
    $(() => {
      props.dragDepth.value = Math.max(0, props.dragDepth.value - 1);
      if (props.dragDepth.value === 0) props.fileTypesDrag.value = false;
    }),
  );

  useOnDocument(
    "drop",
    sync$((e: DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      const droppedFiles = e.dataTransfer?.files;
      if (!droppedFiles?.length) return;
      const host = document.querySelector(FILE_INPUT_FS_HOST_SEL);
      if (!host) return;
      const input = host.querySelector<HTMLInputElement>('input[type="file"]');
      if (!input) return;
      const dt = new DataTransfer();
      if (input.multiple) {
        for (let i = 0; i < droppedFiles.length; i++) dt.items.add(droppedFiles[i]);
      } else if (droppedFiles[0]) {
        dt.items.add(droppedFiles[0]);
      }
      input.files = dt.files;
      input.dispatchEvent(new Event("change", { bubbles: true }));
      input.dispatchEvent(new Event("input", { bubbles: true }));
      const names: string[] = [];
      for (let i = 0; i < dt.files.length; i++) names.push(dt.files[i].name);
      (host as HTMLElement).dataset.fileInputDropNames = names.join(", ");
    }),
  );

  useOnDocument(
    "drop",
    $(() => {
      props.dragDepth.value = 0;
      props.fileTypesDrag.value = false;
      const host = document.querySelector(FILE_INPUT_FS_HOST_SEL) as HTMLElement | null;
      if (host?.dataset.fileInputDropNames) {
        props.droppedLabel.value = host.dataset.fileInputDropNames;
        delete host.dataset.fileInputDropNames;
      }
    }),
  );

  return <span class="hidden" aria-hidden="true" />;
});

export type FileInputDropAreaProps = Omit<PropsOf<"div">, "class"> & {
  /** Text shown when dragging over the zone (overlay). */
  dropLabel?: string;
  noFrame?: boolean;
  /**
   * Zone covering the whole viewport (`fixed inset-0`, high `z-index`). Sets `noDropBorder`.
   * Adds listeners on `document` and `window` so a file can be dropped anywhere on the page (not just on a node in a clipped parent).
   * Overlay (unless `noDropOverlay`) only when dragging files (`Files` in `dataTransfer.types`).
   */
  fullScreen?: boolean;
  /**
   * Hides the semi-transparent overlay with text during a drag — highlights only the border.
   * Replaces `dropOverlay={false}`.
   */
  noDropOverlay?: boolean;
  /**
   * Hides the zone's border and padding — a clean area without a visual boundary.
   * Automatically enables `noDropOverlay`.
   */
  noDropBorder?: boolean;
  /** @deprecated Use `noDropOverlay`. */
  dropOverlay?: boolean;
  class?: string;
};

/**
 * Drag-and-drop zone; provides context for {@link FileInputInput}.
 * On `dragover` it highlights the border and background and shows `dropLabel` (for `fullScreen` only when dragging files from the OS).
 */
export const FileInputDropArea = component$<FileInputDropAreaProps>((props) => {
  const {
    class: className,
    noFrame,
    fullScreen,
    noDropOverlay,
    noDropBorder,
    dropOverlay,
    dropLabel = "Drop files here",
    ...rest
  } = props;
  const effectiveNoDropBorder = !!noDropBorder || !!fullScreen;
  /** Classic zone: overlay on any drag. fullScreen: overlay only when dragging files (see `fileTypesDrag`). */
  const overlayAllowedNonFs = !noDropOverlay && !noDropBorder && dropOverlay !== false;
  const overlayAllowedFs = !!fullScreen && !noDropOverlay && dropOverlay !== false;

  const inputRef = useSignal<HTMLInputElement | undefined>();
  const droppedLabel = useSignal("");
  const dragDepth = useSignal(0);
  /** Only for `fullScreen`: true when `dataTransfer` carries files (type `Files`). */
  const fileTypesDrag = useSignal(false);

  useContextProvider(fileInputContextId, { inputRef, droppedLabel });

  const idle =
    "relative flex min-h-[7.5rem] flex-col rounded-md border-2 border-dashed border-separator-opaque bg-surface-raised p-4 transition-colors";
  const active =
    "border-accent bg-accent/10 ring-2 ring-ring ring-offset-2 ring-offset-background";
  // noDropBorder removes all framing; noFrame removes idle frame (keeps active ring)
  const baseClass = effectiveNoDropBorder
    ? "relative"
    : noFrame && !(dragDepth.value > 0)
      ? ""
      : idle;
  const fullScreenClass = fullScreen
    ? "fixed inset-0 z-[100] box-border flex min-h-[100dvh] w-full max-w-none flex-col gap-2 p-4 pointer-events-auto"
    : "";
  const hot =
    dragDepth.value > 0 && (!fullScreen || fileTypesDrag.value);
  const merged = [baseClass, fullScreenClass, hot ? active : "", className].filter(Boolean).join(" ");

  const showOverlayLayer = fullScreen
    ? overlayAllowedFs && dragDepth.value > 0 && fileTypesDrag.value
    : overlayAllowedNonFs && dragDepth.value > 0;

  return (
    <>
      {fullScreen ? (
        <FileInputFullscreenDocumentHooks dragDepth={dragDepth} fileTypesDrag={fileTypesDrag} droppedLabel={droppedLabel} />
      ) : null}
      <div
        {...rest}
        class={merged}
        {...(fullScreen
          ? { "data-q-ui-file-input-fullscreen": "" }
          : {
              "preventdefault:dragover": true,
              "preventdefault:drop": true,
              onDragEnter$: $(() => {
                dragDepth.value++;
              }),
              onDragLeave$: $(() => {
                dragDepth.value = Math.max(0, dragDepth.value - 1);
                if (dragDepth.value === 0) fileTypesDrag.value = false;
              }),
              /**
               * Qwik runs handlers asynchronously — `dataTransfer.files` is then often unavailable.
               * We must read the files and assign them to the input synchronously (`sync$`); see the Drag & Drop cookbook.
               * `sync$` must not call imported functions — the assignment logic is inline here.
               */
              onDrop$: [
                sync$((e: DragEvent, currentTarget: HTMLElement) => {
                  const droppedFiles = e.dataTransfer?.files;
                  if (!droppedFiles?.length) return;
                  const input = currentTarget.querySelector<HTMLInputElement>('input[type="file"]');
                  if (!input) return;
                  const dt = new DataTransfer();
                  if (input.multiple) {
                    for (let i = 0; i < droppedFiles.length; i++) dt.items.add(droppedFiles[i]);
                  } else if (droppedFiles[0]) {
                    dt.items.add(droppedFiles[0]);
                  }
                  input.files = dt.files;
                  input.dispatchEvent(new Event("change", { bubbles: true }));
                  input.dispatchEvent(new Event("input", { bubbles: true }));
                  const names: string[] = [];
                  for (let i = 0; i < dt.files.length; i++) names.push(dt.files[i].name);
                  currentTarget.dataset.fileInputDropNames = names.join(", ");
                }),
                $((_, currentTarget: HTMLElement) => {
                  dragDepth.value = 0;
                  fileTypesDrag.value = false;
                  const names = currentTarget.dataset.fileInputDropNames;
                  if (names !== undefined) {
                    droppedLabel.value = names;
                    delete currentTarget.dataset.fileInputDropNames;
                  }
                }),
              ],
            })}
      >
        {showOverlayLayer ? (
          <div
            class="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center rounded-[inherit] bg-fill-secondary/40 px-4 text-center"
            aria-hidden="true"
          >
            <span class="text-callout font-medium text-label">{dropLabel}</span>
          </div>
        ) : null}
        <Slot />
      </div>
    </>
  );
});

export type FileInputInputProps = Omit<PropsOf<"input">, "type" | "class"> & {
  type?: "file";
  /** Visually hides the input (`sr-only`); shows the selected files as text below it (also after a drop). */
  hidden?: boolean;
  /** Shows the file name below the input. */
  hideFileName?: boolean;
  class?: string;
  /**
   * Visual variant affecting size: xl, lg, md (default), sm, xs
   * @example variant="sm"
   */
  variant?: "xl" | "lg" | "md" | "sm" | "xs";
};

const fileInputBaseClass = [
  "flex w-full min-w-0 rounded-md border border-separator-opaque bg-surface-raised transition-colors",
  "text-label shadow-sm",
  "file:border-0 file:bg-transparent file:font-medium file:text-label",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
  "disabled:cursor-not-allowed disabled:opacity-50",
].join(" ");

const fileInputVariants = {
  xl: "h-14 px-5 py-4 text-title-3 file:text-title-3",
  lg: "h-12 px-4 py-3 text-headline file:text-headline",
  md: "h-10 px-3 py-2 text-callout file:text-callout",
  sm: "h-8 px-2.5 py-1.5 text-caption-1 file:text-caption-1",
  xs: "h-7 px-2 py-1 text-caption-2 file:text-caption-2",
};

const srOnlyClass = "sr-only";

/**
 * Native `input type="file"` styled like Input; inside {@link FileInputDropArea} it accepts files on drop.
 * With `hidden` it stays accessible to AT and the form; the file name is shown below it.
 * Must be rendered inside a {@link FileInputDropArea}, which provides its context.
 *
 * @example Sizes (variant)
 * ```tsx
 * <FileInput.DropArea noDropBorder>
 *   <FileInput.Input variant="sm" />
 * </FileInput.DropArea>
 * ```
 */
export const FileInputInput = component$<FileInputInputProps>((props) => {
  const ctx = useContext(fileInputContextId, undefined);
  const fallbackRef = useSignal<HTMLInputElement>();
  const refBinding = ctx?.inputRef ?? fallbackRef;

  const selectedLabel = useSignal("");
  const {
    class: className,
    hidden: visuallyHidden,
    hideFileName: hideFileName,
    onChange$: userOnChange$,
    onInput$: userOnInput$,
    variant = "md",
    ...rest
  } = props;

  // Explicitly track droppedLabel from context — ensures reactivity across the QRL boundary.
  // eslint-disable-next-line qwik/no-use-visible-task
  useVisibleTask$(({ track }) => {
    const dropped = track(() => ctx?.droppedLabel?.value ?? "");
    if (dropped) selectedLabel.value = dropped;
  });

  const patchLabel$ = $((e: Event) => {
    const t = e.target as HTMLInputElement;
    const manual = formatFileList(t.files);
    selectedLabel.value = manual;
    // Clear drop label when user picks manually so the two sources don't conflict
    if (ctx?.droppedLabel) ctx.droppedLabel.value = "";
  });

  const onInputMerged = [patchLabel$, userOnInput$].filter(Boolean);
  const onChangeMerged = [patchLabel$, userOnChange$].filter(Boolean);

  const merged = [
    fileInputBaseClass,
    fileInputVariants[variant],
    visuallyHidden ? srOnlyClass : "",
    className,
  ]
    .filter(Boolean)
    .join(" ");

  return (
    <div class={visuallyHidden ? "flex w-full flex-col gap-1" : "contents"}>
      <input
        {...rest}
        type="file"
        ref={refBinding}
        class={merged}
        onInput$={onInputMerged.length === 1 ? onInputMerged[0] : onInputMerged}
        onChange$={onChangeMerged.length === 1 ? onChangeMerged[0] : onChangeMerged}
      />
      {visuallyHidden && !hideFileName ? (
        <p
          class={[
            "text-secondary-label",
            fileInputVariants[variant].split(" ").find((c) => c.startsWith("text-")),
          ].join(" ")}
          aria-live="polite"
        >
          {selectedLabel.value || "No file selected"}
        </p>
      ) : null}
    </div>
  );
});

/** Compound API: `FileInput.DropArea` + `FileInput.Input`. */
export const FileInput = {
  DropArea: FileInputDropArea,
  Input: FileInputInput,
};
