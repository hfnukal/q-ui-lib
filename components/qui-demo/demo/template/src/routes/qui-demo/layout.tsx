import { component$, Slot } from "@builder.io/qwik";
import DemoLayout from "~/components/ui/qui-demo/demo-layout";

export default component$(() => {
  return (
    <DemoLayout>
      <Slot />
    </DemoLayout>
  );
});
