# Tailwind CSS v4 — @theme Reference

## Key Difference from v3

- No `tailwind.config.ts` for design tokens
- All tokens defined in CSS using `@theme {}` inside `globals.css`
- Tailwind auto-generates utility classes from CSS variables

## Syntax

```css
@import 'tailwindcss';

@theme {
  /* Colors → generates bg-*, text-*, border-*, etc. */
  --color-brand-500: #6366f1;
  --color-brand-600: #4f46e5;

  /* Font families → generates font-* */
  --font-heading: 'Ubuntu', sans-serif;
  --font-body: 'Poppins', sans-serif;

  /* Font sizes → generates text-* */
  --text-h1: 32px;
  --text-body-lg: 14px;

  /* Spacing, radii, shadows follow same pattern */
  --radius-card: 8px;
  --shadow-card: 0 1px 3px rgb(0 0 0 / 0.1);
}
```

## Generated Classes

Given `--color-brand-500: #6366f1`, Tailwind generates:

- `bg-brand-500`
- `text-brand-500`
- `border-brand-500`
- `ring-brand-500`
- `fill-brand-500`
- `stroke-brand-500`
- `shadow-brand-500`

Given `--font-heading: 'Ubuntu'`, Tailwind generates:

- `font-heading`

Given `--text-h1: 32px`, Tailwind generates:

- `text-h1` (but prefer custom utility class with line-height bundled)

## @layer Usage

```css
/* Component base classes */
@layer components {
  .btn {
    @apply inline-flex items-center rounded-md;
  }
}

/* Utility overrides */
@layer utilities {
  .text-h1 {
    font-size: var(--text-h1);
    line-height: var(--leading-h1);
    font-weight: 500;
  }
}
```

## Importing Multiple CSS Files

```css
/* globals.css */
@import "tailwindcss";
@import "./typography.css";
@import "./components.css";

@theme { ... }
```
