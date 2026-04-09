# Layout Components Prompt (Tailwind + Qwik)

## Overview
This document describes a minimal but scalable layout system built with reusable components. The goal is to standardize layout composition using Tailwind CSS utilities while keeping components simple and composable.

---

## 1. Screen

### Purpose
Top-level container that fills the viewport and controls global scrolling.

### Behavior
- Takes full width and height of viewport
- Prevents body scrolling
- Defines layout root

### Tailwind
```tsx
<div class="w-screen h-screen overflow-hidden flex flex-col">
  {children}
</div>
```

---

## 2. ScrollArea

### Purpose
Provides controlled scrolling inside layout sections.

### Props
- direction: vertical | horizontal | both

### Tailwind
```tsx
<div class="w-full h-full overflow-auto">
  {children}
</div>
```

Variants:
- vertical: overflow-y-auto overflow-x-hidden
- horizontal: overflow-x-auto overflow-y-hidden

---

## 3. Split

### Purpose
Static layout split (non-resizable)

### Props
- direction: horizontal | vertical
- sizes: array (e.g. [200px, 1fr])

### Tailwind
```tsx
<div class="flex w-full h-full">
  <div class="basis-[200px] shrink-0"></div>
  <div class="flex-1"></div>
</div>
```

Vertical:
```tsx
<div class="flex flex-col w-full h-full">
```

---

## 4. Resizable

### Purpose
Interactive split with draggable divider

### Notes
- Same base as Split
- Add draggable handle
- Use inline style for dynamic sizing

### Tailwind (base)
```tsx
<div class="flex w-full h-full">
  <div style="width: 300px" class="shrink-0"></div>
  <div class="w-1 cursor-col-resize bg-gray-300"></div>
  <div class="flex-1"></div>
</div>
```

---

## 5. Stack

### Purpose
Flex abstraction for vertical/horizontal layouts

### Props
- direction: row | column
- gap
- align
- justify
- wrap

### Tailwind
```tsx
<div class="flex flex-col gap-4">
  {children}
</div>
```

Horizontal:
```tsx
<div class="flex flex-row items-center justify-between gap-2">
```

---

## 6. Box

### Purpose
Generic container for spacing and styling

### Props
- padding
- margin
- background
- border
- width / height

### Tailwind
```tsx
<div class="p-4 bg-white border rounded-lg">
  {children}
</div>
```

---

## 7. Grid

### Purpose
Grid layout for complex responsive designs

### Props
- columns
- gap

### Tailwind
```tsx
<div class="grid grid-cols-12 gap-4">
  <div class="col-span-6"></div>
  <div class="col-span-6"></div>
</div>
```

Responsive:
```tsx
<div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
```

---

## Design Principles

### 1. Control scrolling explicitly
- Never rely on body scroll
- Always use ScrollArea

### 2. Prefer composition over configuration
- Combine small primitives

### 3. Keep components dumb
- No business logic
- Only layout responsibility

### 4. Use Tailwind as source of truth
- Avoid custom CSS when possible

---

## Example Layout

```tsx
<Screen>
  <Split direction="horizontal">
    <Box class="w-64">Sidebar</Box>
    <Stack class="flex-1">
      <Box>Header</Box>
      <ScrollArea>
        <Box>Main content (scrollable)</Box>
      </ScrollArea>
    </Stack>
  </Split>
</Screen>