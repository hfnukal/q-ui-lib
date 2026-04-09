import { component$, createContextId, Slot, useContext, useContextProvider, useSignal, useStore, useTask$ } from "@builder.io/qwik";

export interface TestContextValue {
  store: Record<string, string>;
};

const TestContext = createContextId<ReturnType<typeof useSignal<TestContextValue>>>('test-context');

export const Root = component$(() => {
  const store = useSignal<TestContextValue>({
    store: { root: 'root' },
  });
  useContextProvider(TestContext, store);
  return <div>
    <h1>Root</h1>
    <pre>
      Store:
      {JSON.stringify(store.value.store, null, 2)}
    </pre>
    <Slot />
    </div>;
});

export const Test = component$(() => {
  // const parentContext = useContext<ReturnType<typeof useSignal<TestContextValue>>>(TestContext);
  const store = useSignal<TestContextValue>({
    // store: {...(parentContext.value.store || {})},
    store: {},
  });
  useContextProvider(TestContext, store);
  return <Slot />;
});

export const TestChild = component$((props: { name: string }) => {
  
  const context = useContext<ReturnType<typeof useSignal<TestContextValue>>>(TestContext);
  useTask$(({ track }) => {
    // track(() => context.value.store.root);
    context.value = {
      store: {
        ...context.value.store,
        name: props.name,
        [props.name]: props.name,
      },
    }
  });

  return (
    <div>
      <h2>TestChild {props.name}</h2>
      <pre>
        Store:
        {JSON.stringify(context.value.store, null, 2)}
      </pre>
    </div>
  );
});

export default component$(() => {
  return (
    <Root>
      <Test>
        <TestChild name="John" />
        <TestChild name="Jane" />
        <Test>
          <TestChild name="JohnB" />
          <TestChild name="JaneB" />
        </Test>
      </Test>
    </Root>
  );
});