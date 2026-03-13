# TruCare — Project Rules

## Design System Rules (NEVER BREAK THESE)

- **NEVER hardcode hex colors.** Use Tailwind classes: `bg-brand-500`, `text-danger-600`, `border-stroke`.
- **NEVER hardcode font sizes or line heights.** Use typography classes: `text-h1`, `text-body-md`, `text-body-lg-medium`.
- **ALL design tokens** live in `src/styles/globals.css` inside `@theme {}`.
- **ALL typography utilities** live in `src/styles/typography.css` (`@layer utilities`).
- **ALL reusable component base styles** live in `src/styles/components.css` (`@layer components`).
- **Token reference** (for autocomplete, not inline use) is in `src/lib/tokens.ts`.

---

## Fonts

| Use case                 | Font                    | Tailwind variable |
| ------------------------ | ----------------------- | ----------------- |
| H1 – H4 headings         | Ubuntu (400, 500)       | `font-heading`    |
| H5 – H6, body, UI labels | Poppins (400, 500, 600) | `font-body`       |

Both fonts are loaded via `next/font/google` in `src/app/layout.tsx`.

---

## Color Usage Guide

| Purpose                | Class                                     |
| ---------------------- | ----------------------------------------- |
| Primary action         | `bg-brand-500` hover: `bg-brand-600`      |
| Page background        | `bg-bg`                                   |
| Main text              | `text-heading`                            |
| Muted / secondary text | `text-text-muted`                         |
| Borders / dividers     | `border-stroke`                           |
| Navbar background      | `bg-navbar`                               |
| Success state          | `bg-success-100 text-success-700`         |
| Warning state          | `bg-warning-100 text-warning-700`         |
| Error / Danger state   | `bg-danger-100 text-danger-700`           |
| Info state             | `bg-information-100 text-information-700` |

---

## Typography Classes

| Class                 | Font    | Size / Line-height | Weight     |
| --------------------- | ------- | ------------------ | ---------- |
| `text-h1`             | Ubuntu  | 32px / 40px        | 500        |
| `text-h2`             | Ubuntu  | 24px / 32px        | 500        |
| `text-h3`             | Ubuntu  | 20px / 28px        | 500        |
| `text-h4`             | Ubuntu  | 16px / 24px        | 400        |
| `text-h5`             | Poppins | 14px / 22px        | 600        |
| `text-h6`             | Poppins | 12px / 18px        | 500        |
| `text-body-lg`        | Poppins | 14px / 22px        | 400        |
| `text-body-lg-italic` | Poppins | 14px / 22px        | 400 italic |
| `text-body-lg-medium` | Poppins | 14px / 22px        | 500        |
| `text-body-md`        | Poppins | 12px / 20px        | 400        |
| `text-body-md-italic` | Poppins | 12px / 20px        | 400 italic |
| `text-body-md-medium` | Poppins | 12px / 20px        | 500        |
| `text-body-sm`        | Poppins | 10px / 16px        | 400        |
| `text-body-sm-italic` | Poppins | 10px / 16px        | 400 italic |
| `text-body-sm-medium` | Poppins | 10px / 16px        | 500        |

---

## Component Patterns

| Pattern         | Classes                                                                                       |
| --------------- | --------------------------------------------------------------------------------------------- |
| Button sizes    | `.btn-sm` / `.btn-md` / `.btn-lg`                                                             |
| Button variants | `.btn-primary` / `.btn-secondary` / `.btn-ghost` / `.btn-danger`                              |
| Badges          | `.badge .badge-success` / `.badge-warning` / `.badge-danger` / `.badge-info` / `.badge-other` |
| Card            | `.card` (border + rounded + padding)                                                          |
| Card header     | `.card-header`                                                                                |
| Form input      | `.input`                                                                                      |
| Form label      | `.label`                                                                                      |
| Divider         | `.divider`                                                                                    |
| Status dot      | `.status-dot .status-dot-success` / etc.                                                      |

---

## Stack

- **Next.js, TypeScript strict, Tailwind CSS v4, shadcn/ui, App Router**
- No `tailwind.config.ts` — all tokens in `src/styles/globals.css @theme {}`
- PostCSS config: `@tailwindcss/postcss`

## Commands

```bash
npm run dev       # start dev server
npm run build     # production build — must pass before any PR
npm run lint      # must pass before any PR
```
