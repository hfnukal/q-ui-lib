import { $, component$ } from "@builder.io/qwik";
import { Button } from "~/components/ui/button";

export default component$(() => {
  return (
    <div>
      <h1>Button</h1>
      <div>
        <Button
          label="Click me"
          onClick$={$(() => {
            alert("Button clicked");
          })}
        />
      </div>
    </div>
  );
});