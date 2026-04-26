/**
 * @component file-input
 * @title FileInput
 * @version 1.0.0
 * @example Celá obrazovka (fullScreen)
 * Překryje viewport (`fixed`), implicitně `noDropBorder`. Overlay jen při přetahování souborů z OS (ne textu odkudkoliv).
 * Na stránce s více zónami ho zapínejte podmíněně (např. checkbox), jinak přepíše celou stránku.
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
 *         Zapnout celoplošný drop (překryje náhledy níže)
 *       </label>
 *       {enabled.value ? (
 *         <FileInput.DropArea fullScreen dropLabel="Pusťte soubory">
 *           <FileInput.Input name="fullscreen-demo" hidden multiple />
 *         </FileInput.DropArea>
 *       ) : null}
 *     </>
 *   );
 * });
 * ```
 *
 * @example Drop zóna + skrytý input
 * Při drag over se změní okraj a pozadí; přes zónu je text z `dropLabel`.
 * ```tsx
 * import { FileInput } from "~/components/ui/base/file-input";
 * 
 * <FileInput.DropArea dropLabel="Pusťte soubor sem" class="max-w-lg">
 *   <FileInput.Input name="doc" hidden accept=".pdf,.png" />
 * </FileInput.DropArea>
 * ```
 *
 * @example Více souborů (skrytý input)
 * Více souborů přes `multiple` na skrytém inputu.
 * ```tsx
 * import { FileInput } from "~/components/ui/base/file-input";
 * 
 * <FileInput.DropArea dropLabel="Pusťte jeden nebo více souborů" class="max-w-lg">
 *   <FileInput.Input name="demo-multi" hidden multiple />
 * </FileInput.DropArea>
 * ```
 *
 * @example Více souborů (viditelný input)
 * Stejné rozhraní s viditelným file inputem v obsahu zóny.
 * ```tsx
 * import { FileInput } from "~/components/ui/base/file-input";
 *
 * <FileInput.DropArea dropLabel="Pusťte jeden nebo více souborů" class="max-w-lg">
 *   <FileInput.Input name="demo-multi" multiple />
 * </FileInput.DropArea>
 * ```
 *
 * @example Bez překrytí (noDropOverlay)
 * `noDropOverlay` zvýrazní jen okraj při dragu — bez poloprůhledné plochy s textem.
 * ```tsx
 * import { FileInput } from "~/components/ui/base/file-input";
 *
 * <FileInput.DropArea noDropOverlay class="max-w-lg">
 *   <p class="mb-3 text-callout text-secondary-label">Přetáhněte soubor nebo klikněte níže.</p>
 *   <FileInput.Input name="nodrop-overlay" hidden />
 * </FileInput.DropArea>
 * ```
 *
 * @example Bez rámečku (noDropBorder)
 * `noDropBorder` odstraní rámeček i padding — jen obsah v čisté ploše; overlay je automaticky vypnutý.
 * ```tsx
 * import { FileInput } from "~/components/ui/base/file-input";
 *
 * <FileInput.DropArea noDropBorder class="max-w-lg">
 *   <p class="text-callout text-secondary-label">Sem přetáhněte soubor, nebo klikněte níže.</p>
 *   <FileInput.Input name="nodrop-border" hidden />
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
  /** Ref na `<input type="file">` uvnitř DropArea — při dropu se sem nastaví soubory. */
  inputRef: Signal<HTMLInputElement | undefined>;
  /** Názvy souborů z posledního dropu — spolehlivá alternativa k `input.files` (které může prohlížeč blokovat). */
  droppedLabel: Signal<string>;
}

const fileInputContextId = createContextId<FileInputContextValue>("q-ui-lib.file-input");

function formatFileList(files: FileList | null | undefined): string {
  if (!files?.length) return "";
  return Array.from(files, (f) => f.name).join(", ");
}

/** Selektor hosta `DropArea` s `fullScreen` — `sync$` smí používat jen literály, ne importy. */
const FILE_INPUT_FS_HOST_SEL = "[data-q-ui-file-input-fullscreen]";

/**
 * Pro `fullScreen`: posluchače na `document` a `window`, aby šlo soubor pustit kdekoli na stránce
 * (ne jen na uzel uvnitř Tabu / oříznutého kontejneru). Bez toho může `fixed` host dostat jen část viewportu.
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
  /** Text při přetažení nad zónou (překrytí). */
  dropLabel?: string;
  noFrame?: boolean;
  /**
   * Zóna přes celý viewport (`fixed inset-0`, vysoký `z-index`). Nastaví se `noDropBorder`.
   * Přidá posluchače na `document` a `window`, aby šlo soubor pustit kdekoli na stránce (ne jen na uzel v oříznutém rodiči).
   * Overlay (pokud není `noDropOverlay`) jen při dragu souborů (`Files` v `dataTransfer.types`).
   */
  fullScreen?: boolean;
  /**
   * Skryje poloprůhledné překrytí s textem při dragu — zvýrazní jen okraj.
   * Nahrazuje `dropOverlay={false}`.
   */
  noDropOverlay?: boolean;
  /**
   * Skryje rámeček a padding zóny — čistá plocha bez vizuálního ohraničení.
   * Automaticky aktivuje `noDropOverlay`.
   */
  noDropBorder?: boolean;
  /** @deprecated Použij `noDropOverlay`. */
  dropOverlay?: boolean;
  class?: string;
};

/**
 * Zóna drag-and-drop; poskytuje kontext pro {@link FileInputInput}.
 * Při `dragover` zvýrazní okraj a pozadí a zobrazí `dropLabel` (u `fullScreen` jen při dragu souborů z OS).
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
  /** Klasická zóna: overlay při jakémkoli dragu. fullScreen: overlay jen při dragu souborů (viz `fileTypesDrag`). */
  const overlayAllowedNonFs = !noDropOverlay && !noDropBorder && dropOverlay !== false;
  const overlayAllowedFs = !!fullScreen && !noDropOverlay && dropOverlay !== false;

  const inputRef = useSignal<HTMLInputElement | undefined>();
  const droppedLabel = useSignal("");
  const dragDepth = useSignal(0);
  /** Jen při `fullScreen`: true když `dataTransfer` nese soubory (typ `Files`). */
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
               * Qwik spouští handlery asynchronně — `dataTransfer.files` pak často není k dispozici.
               * Soubory musíme přečíst a přiřadit inputu synchronně (`sync$`); viz cookbook Drag & Drop.
               * `sync$` nesmí volat importované funkce — logika přiřazení je zde inline.
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
  /** Skryje vizuálně input (`sr-only`); vybrané soubory zobrazí jako text pod ním (i po dropu). */
  hidden?: boolean;
  /** Zobrazí název souboru pod inputem. */
  hideFileName?: boolean;
  class?: string;
};

const fileInputBaseClass = [
  "flex w-full min-w-0 rounded-md border border-separator-opaque bg-surface-raised px-3 py-2",
  "text-callout text-label shadow-sm transition-colors",
  "file:border-0 file:bg-transparent file:text-callout file:font-medium file:text-label",
  "focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 ring-offset-background",
  "disabled:cursor-not-allowed disabled:opacity-50",
].join(" ");

const srOnlyClass = "sr-only";

/**
 * Nativní `input type="file"` ve stylu Input; uvnitř {@link FileInputDropArea} při dropu přijme soubory.
 * S `hidden` zůstane přístupný pro AT a formulář; název souboru se zobrazí pod ním.
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

  const merged = [fileInputBaseClass, visuallyHidden ? srOnlyClass : "", className].filter(Boolean).join(" ");

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
        <p class="min-h-[1.25rem] text-callout text-secondary-label" aria-live="polite">
          {selectedLabel.value || "No file selected"}
        </p>
      ) : null}
    </div>
  );
});

/** Složené API: `FileInput.DropArea` + `FileInput.Input`. */
export const FileInput = {
  DropArea: FileInputDropArea,
  Input: FileInputInput,
};
