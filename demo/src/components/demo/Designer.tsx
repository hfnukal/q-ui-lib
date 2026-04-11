import { component$, type Signal } from "@builder.io/qwik";
import { Box } from "~/components/ui/box";
import { Stack } from "~/components/ui/stack";
import { DesignerCanvasPreview } from "~/components/demo/designer-preview";

/** MIME typ pro přenos slug komponenty z palety do canvasu. */
export const DESIGNER_DRAG_MIME = "application/x-q-ui-designer-slug";

export type DesignerItem = { id: string; slug: string };

export type DesignerProps = {
  items: Signal<DesignerItem[]>;
};

const DesignerCanvasItem = component$((props: { id: string; slug: string }) => {
  return (
    <Box
      border
      rounded="md"
      padding="sm"
      background="raised"
      class="w-full"
      data-designer-item={props.id}
    >
      <div class="mb-2 flex items-center justify-between gap-2">
        <span class="text-caption-2 font-medium text-label">{props.slug}</span>
      </div>
      <DesignerCanvasPreview slug={props.slug} />
    </Box>
  );
});

/** Vizuální slot (Box) — DnD viz `routes/design/index.tsx` (`sync$` + `preventdefault:*`). */
const DesignerSlotImpl = component$<DesignerProps>((props) => {
  const { items } = props;

  return (
    <Box
      border
      rounded="lg"
      padding="md"
      background="grouped"
      class="min-h-[min(50vh,28rem)] w-full border-dashed border-separator-opaque/60"
      data-designer-slot=""
    >
      <Stack direction="column" gap={3} class="min-h-[12rem]">
        {items.value.length === 0 ? (
          <div class="flex flex-1 flex-col items-center justify-center gap-2 py-12 text-center">
            <span class="text-callout text-secondary-label">
              Sem přetáhni komponentu z levého seznamu
            </span>
            <span class="text-caption-2 text-tertiary-label">
              Canvas drží pořadí vložených bloků; model je v JSON níže.
            </span>
          </div>
        ) : (
          items.value.map((it) => (
            <DesignerCanvasItem key={it.id} id={it.id} slug={it.slug} />
          ))
        )}
      </Stack>
    </Box>
  );
});

const DesignerRoot = component$<DesignerProps>((props) => {
  const { items } = props;
  return (
    <div class="flex min-h-0 min-w-0 flex-1 flex-col gap-3">
      <p class="text-callout text-secondary-label">
        Přetáhni položku z levého panelu do rámečku — vytvoříš skládací náhled stránky.
      </p>
      <DesignerSlotImpl {...props} />
      <details class="text-caption-2 text-tertiary-label">
        <summary class="cursor-pointer select-none text-label hover:underline">
          Model stránky (JSON)
        </summary>
        <pre class="mt-2 max-h-40 overflow-auto rounded-md border border-separator-opaque/40 bg-background p-3 font-mono text-caption-2 text-label">
          {JSON.stringify(items.value, null, 2)}
        </pre>
      </details>
    </div>
  );
});

export const Designer = Object.assign(DesignerRoot, {
  Slot: DesignerSlotImpl,
});
