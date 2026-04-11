import { component$, Slot } from "@builder.io/qwik";

/** Prázdný layout — kořenový `routes/layout.tsx` pro `/design` vykreslí jen `<Slot />` (bez demo shellu). */
export default component$(() => {
  return <Slot />;
});
