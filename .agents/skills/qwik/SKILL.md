---
name: qwik
description: Skill for building Qwik.js and Qwik City applications. Use when creating components, managing state, or handling routing in Qwik projects.
---

# Qwik.js & Qwik City Skill

This skill provides comprehensive instructions for building high-performance, resumable web applications using Qwik and Qwik City.

## Core Concepts

### 1. Resumability vs. Hydration
- **Resumability**: Qwik applications do not "hydrate" on the client. They "resume" from exactly where the server left off.
- **Lazy Loading**: Qwik uses fine-grained lazy loading. Code is only downloaded when needed (e.g., when a user interacts with a component).
- **Zero Hydration Cost**: No JavaScript is executed on boot to make the page interactive.

### 2. The `$` Suffix
- The `$` suffix (as in `component$`, `onClick$`, `useTask$`) defines a **lazy-loading boundary**.
- **Serialization Rules**: Anything captured inside a `$` function must be serializable (primitive types, Signals, Stores, or other `$` functions).
- **Avoid Local variables**: Do not capture local variables in `$` functions unless they are serializable.

## Primitives & Hooks

### State Management
- `useSignal(initialValue)`: Creates a reactive value. Access via `.value`. Best for single values (strings, numbers, booleans).
- `useStore(initialObject)`: Creates a reactive object. Tracks nested property access. Best for complex state.
- `useComputed$(() => ...)`: Creates a reactive value derived from other state.

### Lifecycle & Tasks
- `useTask$(() => ...)`: Runs on both server and client (during resumption). Use for data fetching or side effects that affect state.
- `useVisibleTask$(() => ...)`: Runs ONLY in the browser when the component becomes visible. **Avoid this** unless you need direct DOM access (e.g., initializing a 3rd party library like Chart.js).
- `useVisibleTask$({ strategy: 'document-ready' })`: Runs when the document is ready.

### Components
- Always use `component$((props) => { ... })` for defined components.
- Use `Slot` for content projection (similar to children in React).
- Use `class` instead of `className`.

## Qwik City (Routing & Data)

### Routing
- **Directory-based routing**: `src/routes/path/to/page/index.tsx`.
- **Layouts**: `layout.tsx` in any route directory.

### Data Fetching
- `routeLoader$(() => ...)`: Server-side data fetching. Returns a Signal accessible in components.
- `routeAction$(() => ...)`: Server-side actions (e.g., form submissions). Returns a Signal with `value`, `isRunning`, etc.
- `server$(() => ...)`: Defines a function that always runs on the server.

## Best Practices

1. **Prefer `useTask$` over `useVisibleTask$`**: Keep the client bundle minimal. Only use `useVisibleTask$` for browser-only APIs.
2. **Serializability**: Ensure all data passed to `$` functions is serializable.
3. **CSS Modules**: Use `.module.css` for scoped styling. Use `useStyles$(styles)` or common CSS imports.
4. **Fine-grained Reactivity**: Pass Signals/Stores to children instead of raw values if you want the child to update independently without re-rendering the parent.
5. **Slots**: Use named slots (`<Slot name="header" />`) for complex component architectures.

## This repository (`qui-client`)

The workspace root is the **`qui-client`** npm package: CLI entry `bin/qui.js` → `src/cli.js`. Canonical Qwik component **sources** for the library live under **`components/<uilib>/<slug>/`**. Optional workspace package **`packages/qui-feature`** adds Tailwind v4 + tokens for Qwik apps. For component authoring rules in this repo, use root **`CREATE.md`** and **`CLAUDE.md`**.

## Checklist for Qwik Development
- [ ] Is every event handler suffixed with `$`?
- [ ] Are all components defined with `component$`?
- [ ] am I using `useSignal` for simple state and `useStore` for complex state?
- [ ] Did I avoid `useVisibleTask$` where `useTask$` would suffice?
- [ ] are all values captured by `$` functions serializable?
- [ ] am I using `class` instead of `className`?
