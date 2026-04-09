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
} from "@builder.io/qwik";

export interface FileInputContextValue {
  /** Ref na `<input type="file">` uvnitř DropArea — při dropu se sem nastaví soubory. */
  inputRef: Signal<HTMLInputElement | undefined>;
}

const fileInputContextId = createContextId<FileInputContextValue>("q-ui-lib.file-input");

function formatFileList(files: FileList | null | undefined): string {
  if (!files?.length) return "";
  return Array.from(files, (f) => f.name).join(", ");
}

function assignFilesToInput(input: HTMLInputElement, files: FileList) {
  const dt = new DataTransfer();
  const multiple = input.multiple;
  if (multiple) {
    for (let i = 0; i < files.length; i++) dt.items.add(files[i]);
  } else if (files[0]) {
    dt.items.add(files[0]);
  }
  input.files = dt.files;
  input.dispatchEvent(new Event("input", { bubbles: true }));
  input.dispatchEvent(new Event("change", { bubbles: true }));
}

export type FileInputDropAreaProps = Omit<PropsOf<"div">, "class"> & {
  /** Text při přetažení nad zónou (překrytí). */
  dropLabel?: string;
  noFrame?: boolean;
  class?: string;
};

/**
 * Zóna drag-and-drop; poskytuje kontext pro {@link FileInputInput}.
 * Při `dragover` zvýrazní okraj a pozadí a zobrazí `dropLabel`.
 */
export const FileInputDropArea = component$<FileInputDropAreaProps>((props) => {
  const { class: className, noFrame, dropLabel = "Drop files here", ...rest } = props;
  const inputRef = useSignal<HTMLInputElement | undefined>();
  const dragDepth = useSignal(0);

  useContextProvider(fileInputContextId, { inputRef });

  const idle =  
    "relative flex min-h-[7.5rem] flex-col rounded-md border-2 border-dashed border-separator-opaque bg-surface-raised p-4 transition-colors";
  const active =
    "border-accent bg-accent/10 ring-2 ring-ring ring-offset-2 ring-offset-background";
  const merged = [noFrame && !(dragDepth.value > 0) ? "" : idle, dragDepth.value > 0 ? active : "", className].filter(Boolean).join(" ");

  return (
    <div
      {...rest}
      class={merged}
      preventdefault:dragover
      preventdefault:drop
      onDragEnter$={$(() => {
        dragDepth.value++;
      })}
      onDragLeave$={$(() => {
        dragDepth.value = Math.max(0, dragDepth.value - 1);
      })}
      onDrop$={$((e: DragEvent) => {
        dragDepth.value = 0;
        const files = e.dataTransfer?.files;
        if (!files?.length) return;
        const input = inputRef.value;
        if (!input) return;
        assignFilesToInput(input, files);
      })}
    >
      {dragDepth.value > 0 ? (
        <div
          class="pointer-events-none absolute inset-0 z-[1] flex items-center justify-center rounded-[inherit] bg-fill-secondary/40 px-4 text-center"
          aria-hidden="true"
        >
          <span class="text-callout font-medium text-label">{dropLabel}</span>
        </div>
      ) : null}
      <Slot />
    </div>
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

  const patchLabel$ = $((e: Event) => {
    const t = e.target as HTMLInputElement;
    selectedLabel.value = formatFileList(t.files);
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
