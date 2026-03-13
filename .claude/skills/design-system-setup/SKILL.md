---
name: design-system-setup
description: >
  Automatically sets up a complete frontend design system for a Next.js project using
  Tailwind CSS v4. Invoke this skill whenever the user provides color tokens, typography
  specs, or Figma design system screenshots and wants to configure their frontend repo.
  Also triggers when user says things like "set up design tokens", "configure colors from
  Figma", "set up typography", "initialize design system", "set up theme", or "configure
  frontend foundation". This skill produces a fully wired globals.css with @theme tokens,
  a typography utility layer, font setup in layout.tsx, a tokens reference file, and a
  base component stylesheet — making all future component development consistent,
  disciplined, and streamlined.
---

# Design System Setup Skill

Sets up a production-grade design system foundation in an existing Next.js 15 + Tailwind CSS v4 project.

## When This Skill Is Used

- User shares color palette screenshots or hex values from Figma
- User shares typography specs (fonts, sizes, weights, line heights)
- User says "set up design tokens / theme / design system / frontend config"
- User wants future component development to be consistent and streamlined

---

## What This Skill Produces

1. **`src/styles/globals.css`** — All `@theme {}` tokens (colors + typography)
2. **`src/styles/typography.css`** — `@layer utilities` with named text classes
3. **`src/lib/tokens.ts`** — TypeScript token reference for use in JS/TSX
4. **`src/app/layout.tsx`** — Font wired via `next/font/google`
5. **`src/styles/components.css`** — Base reusable component classes (`@layer components`)
6. **`CLAUDE.md`** — Update Project memory file so Claude always follows design rules

---

## Step-by-Step Execution

### STEP 1 — Extract Design Tokens

Read all color and typography info the user has provided. If images are provided, extract:

- Every color swatch with its name and hex value
- Color scale structure (50–900 or similar)
- Font families (e.g. Ubuntu, Poppins, Inter)
- Every type style: name, font, size, line height, weight

If anything is unclear or missing, ask before proceeding.

Organize tokens into these groups:

- **Brand colors** (primary scale)
- **Semantic UI colors** (navbar, heading, muted, stroke, background, etc.)
- **Status/Badge colors** (success, warning, danger, info, etc.)
- **Text colors** (charcoal, white, black)
- **Typography styles** (headings H1–H6, body variants, UI labels)

**Default typography spec (use unless user provides different fonts):**

| Style | Font | Size / Line-height | Weight |
|---|---|---|---|
| H1 | Ubuntu | 32px / 40px | 500 (Medium) |
| H2 | Ubuntu | 24px / 32px | 500 (Medium) |
| H3 | Ubuntu | 20px / 28px | 500 (Medium) |
| H4 | Ubuntu | 16px / 24px | 400 (Regular) |
| H5 | Poppins | 14px / 22px | 600 (SemiBold) |
| H6 | Poppins | 12px / 18px | 500 (Medium) |
| body-lg / regular | Poppins | 14px / 22px | 400 |
| body-lg / italic | Poppins | 14px / 22px | 400 italic |
| body-lg / medium | Poppins | 14px / 22px | 500 |
| body-md / regular | Poppins | 12px / 20px | 400 |
| body-md / italic | Poppins | 12px / 20px | 400 italic |
| body-md / medium | Poppins | 12px / 20px | 500 |
| body-sm / regular | Poppins | 10px / 16px | 400 |
| body-sm / italic | Poppins | 10px / 16px | 400 italic |
| body-sm / medium | Poppins | 10px / 16px | 500 |

Font assignment rule: **Ubuntu = `--font-heading` (H1–H4), Poppins = `--font-body` (H5–H6, all body)**. If the user provides a different spec, extract and use those values. If a heading font is not specified, default to Ubuntu.

---

### STEP 2 — Write `src/styles/globals.css`

Use Tailwind v4 syntax. No tailwind.config.ts needed.

```css
@import 'tailwindcss';
@import './typography.css';
@import './components.css';

@theme {
  /* ─── Fonts ─────────────────────────────── */
  --font-heading: 'Ubuntu', sans-serif;
  --font-body: 'Poppins', sans-serif;

  /* ─── Brand Scale ────────────────────────── */
  --color-brand-50: <hex>;
  --color-brand-100: <hex>;
  /* ... through 900 */
  --color-brand-500: <hex>; /* ← primary */

  /* ─── Semantic UI Colors ─────────────────── */
  --color-navbar: <hex>;
  --color-heading: <hex>;
  --color-text-muted: <hex>;
  --color-stroke: <hex>;
  --color-bg: <hex>;

  /* ─── Status Colors ──────────────────────── */
  --color-success-500: <hex>;
  --color-warning-500: <hex>;
  --color-danger-500: <hex>;
  --color-info-500: <hex>;

  /* ─── Typography Scale ───────────────────── */
  --text-h1: 32px;   --leading-h1: 40px;
  --text-h2: 24px;   --leading-h2: 32px;
  --text-h3: 20px;   --leading-h3: 28px;
  --text-h4: 16px;   --leading-h4: 24px;
  --text-h5: 14px;   --leading-h5: 22px;
  --text-h6: 12px;   --leading-h6: 18px;

  --text-body-lg: 14px;  --leading-body-lg: 22px;
  --text-body-md: 12px;  --leading-body-md: 20px;
  --text-body-sm: 10px;  --leading-body-sm: 16px;
}
```

Rules:

- ALL colors must be defined — no skipping swatches
- Use semantic names (`--color-danger-500`) not arbitrary ones (`--color-red`)
- Every scale (brand, success, warning, danger, info, other) must have all steps (50–900)
- Never use hardcoded hex values anywhere outside this file

---

### STEP 3 — Write `src/styles/typography.css`

Create named utility classes so devs never guess font sizes.

**Rules:**
- ALL classes must use CSS variables — never raw px values
- Must include ALL 15 classes: 6 headings + 9 body variants (3 sizes × regular/italic/medium)
- H1–H4 use `--font-heading` (Ubuntu); H5–H6 and all body use `--font-body` (Poppins)

```css
@layer utilities {
  /* ─── Headings (Ubuntu, --font-heading) ── */
  .text-h1 {
    font-family: var(--font-heading);
    font-size: var(--text-h1);
    line-height: var(--leading-h1);
    font-weight: 500;
  }
  .text-h2 {
    font-family: var(--font-heading);
    font-size: var(--text-h2);
    line-height: var(--leading-h2);
    font-weight: 500;
  }
  .text-h3 {
    font-family: var(--font-heading);
    font-size: var(--text-h3);
    line-height: var(--leading-h3);
    font-weight: 500;
  }
  .text-h4 {
    font-family: var(--font-heading);
    font-size: var(--text-h4);
    line-height: var(--leading-h4);
    font-weight: 400;
  }

  /* ─── Headings (Poppins, --font-body) ─── */
  .text-h5 {
    font-family: var(--font-body);
    font-size: var(--text-h5);
    line-height: var(--leading-h5);
    font-weight: 600;
  }
  .text-h6 {
    font-family: var(--font-body);
    font-size: var(--text-h6);
    line-height: var(--leading-h6);
    font-weight: 500;
  }

  /* ─── Body Large · 14px / 22px ── */
  .text-body-lg {
    font-family: var(--font-body);
    font-size: var(--text-body-lg);
    line-height: var(--leading-body-lg);
    font-weight: 400;
  }
  .text-body-lg-italic {
    font-family: var(--font-body);
    font-size: var(--text-body-lg);
    line-height: var(--leading-body-lg);
    font-weight: 400;
    font-style: italic;
  }
  .text-body-lg-medium {
    font-family: var(--font-body);
    font-size: var(--text-body-lg);
    line-height: var(--leading-body-lg);
    font-weight: 500;
  }

  /* ─── Body Medium · 12px / 20px ── */
  .text-body-md {
    font-family: var(--font-body);
    font-size: var(--text-body-md);
    line-height: var(--leading-body-md);
    font-weight: 400;
  }
  .text-body-md-italic {
    font-family: var(--font-body);
    font-size: var(--text-body-md);
    line-height: var(--leading-body-md);
    font-weight: 400;
    font-style: italic;
  }
  .text-body-md-medium {
    font-family: var(--font-body);
    font-size: var(--text-body-md);
    line-height: var(--leading-body-md);
    font-weight: 500;
  }

  /* ─── Body Small · 10px / 16px ── */
  .text-body-sm {
    font-family: var(--font-body);
    font-size: var(--text-body-sm);
    line-height: var(--leading-body-sm);
    font-weight: 400;
  }
  .text-body-sm-italic {
    font-family: var(--font-body);
    font-size: var(--text-body-sm);
    line-height: var(--leading-body-sm);
    font-weight: 400;
    font-style: italic;
  }
  .text-body-sm-medium {
    font-family: var(--font-body);
    font-size: var(--text-body-sm);
    line-height: var(--leading-body-sm);
    font-weight: 500;
  }
}
```

---

### STEP 4 — Write `src/styles/components.css`

Reusable base classes for common UI patterns.

**Tailwind v4 `@apply` rule:** You cannot `@apply` a class defined in `@layer components` from within another `@layer components` rule. This means `.badge-success { @apply badge ... }` will fail. Instead, repeat the shared base properties inline for each variant.

```css
@layer components {
  /* ─── Badge base ── */
  .badge {
    @apply inline-flex items-center rounded-full px-2 py-0.5;
    font-family: var(--font-body);
    font-size: var(--text-body-sm);
    line-height: var(--leading-body-sm);
    font-weight: 500;
  }

  /* Badge variants — repeat base props, cannot @apply .badge in Tailwind v4 */
  .badge-success {
    @apply inline-flex items-center rounded-full px-2 py-0.5 bg-success-100 text-success-700;
    font-family: var(--font-body);
    font-size: var(--text-body-sm);
    line-height: var(--leading-body-sm);
    font-weight: 500;
  }
  .badge-warning {
    @apply inline-flex items-center rounded-full px-2 py-0.5 bg-warning-100 text-warning-700;
    font-family: var(--font-body);
    font-size: var(--text-body-sm);
    line-height: var(--leading-body-sm);
    font-weight: 500;
  }
  .badge-danger {
    @apply inline-flex items-center rounded-full px-2 py-0.5 bg-danger-100 text-danger-700;
    font-family: var(--font-body);
    font-size: var(--text-body-sm);
    line-height: var(--leading-body-sm);
    font-weight: 500;
  }
  .badge-info {
    @apply inline-flex items-center rounded-full px-2 py-0.5 bg-information-100 text-information-700;
    font-family: var(--font-body);
    font-size: var(--text-body-sm);
    line-height: var(--leading-body-sm);
    font-weight: 500;
  }
  .badge-other {
    @apply inline-flex items-center rounded-full px-2 py-0.5 bg-other-100 text-other-700;
    font-family: var(--font-body);
    font-size: var(--text-body-sm);
    line-height: var(--leading-body-sm);
    font-weight: 500;
  }

  /* ─── Button base ── */
  .btn {
    @apply inline-flex items-center justify-center rounded-md font-medium transition-colors;
    font-family: var(--font-body);
  }

  /* Button variants — repeat base props, cannot @apply .btn in Tailwind v4 */
  .btn-primary {
    @apply inline-flex items-center justify-center rounded-md font-medium transition-colors;
    @apply bg-brand-500 text-white hover:bg-brand-600 active:bg-brand-700;
    font-family: var(--font-body);
  }
  .btn-secondary {
    @apply inline-flex items-center justify-center rounded-md font-medium transition-colors;
    @apply border border-brand-500 text-brand-500 hover:bg-brand-50 active:bg-brand-100;
    font-family: var(--font-body);
  }
  .btn-ghost {
    @apply inline-flex items-center justify-center rounded-md font-medium transition-colors;
    @apply text-brand-500 hover:bg-brand-50 active:bg-brand-100;
    font-family: var(--font-body);
  }
  .btn-danger {
    @apply inline-flex items-center justify-center rounded-md font-medium transition-colors;
    @apply bg-danger-500 text-white hover:bg-danger-600 active:bg-danger-700;
    font-family: var(--font-body);
  }

  /* Button sizes — use CSS vars, never raw px */
  .btn-sm {
    @apply px-3 py-1.5;
    font-size: var(--text-body-sm);
    line-height: var(--leading-body-sm);
    font-weight: 500;
  }
  .btn-md {
    @apply px-4 py-2;
    font-size: var(--text-body-md);
    line-height: var(--leading-body-md);
    font-weight: 500;
  }
  .btn-lg {
    @apply px-5 py-2.5;
    font-size: var(--text-body-lg);
    line-height: var(--leading-body-lg);
    font-weight: 500;
  }

  /* ─── Card ── */
  .card {
    @apply rounded-lg border border-stroke bg-bg p-4;
  }
  .card-header {
    @apply mb-4 border-b border-stroke pb-4;
  }

  /* ─── Form ── */
  .input {
    @apply w-full rounded-md border border-stroke px-3 py-2 outline-none transition-colors;
    @apply focus:border-brand-500 focus:ring-1 focus:ring-brand-500;
    font-family: var(--font-body);
    font-size: var(--text-body-md);
    line-height: var(--leading-body-md);
    color: var(--color-heading);
    background-color: var(--color-bg);
  }
  .input::placeholder {
    color: var(--color-text-muted);
  }
  .label {
    @apply mb-1 block;
    font-family: var(--font-body);
    font-size: var(--text-body-md);
    line-height: var(--leading-body-md);
    font-weight: 500;
    color: var(--color-heading);
  }

  /* ─── Divider ── */
  .divider {
    @apply border-t border-stroke;
  }

  /* ─── Status dots ── */
  .status-dot         { @apply inline-block h-2 w-2 rounded-full; }
  .status-dot-success { @apply inline-block h-2 w-2 rounded-full bg-success-500; }
  .status-dot-warning { @apply inline-block h-2 w-2 rounded-full bg-warning-500; }
  .status-dot-danger  { @apply inline-block h-2 w-2 rounded-full bg-danger-500; }
  .status-dot-info    { @apply inline-block h-2 w-2 rounded-full bg-information-500; }
}
```

---

### STEP 5 — Update `src/app/layout.tsx`

Wire both fonts via `next/font/google`:

```tsx
import { Ubuntu, Poppins } from 'next/font/google'
import '../styles/globals.css'

const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-heading',
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  style: ['normal', 'italic'], // required for .text-body-*-italic classes
  variable: '--font-body',
  display: 'swap',
})

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${ubuntu.variable} ${poppins.variable}`}>
      <body className="bg-bg text-heading font-body antialiased">{children}</body>
    </html>
  )
}
```

---

### STEP 6 — Write `src/lib/tokens.ts`

TypeScript reference so devs get autocomplete and never hardcode values:

```ts
// ─── Color Tokens ────────────────────────────────────────────────────────────
// Use these as references. In JSX, always use Tailwind classes, not these values directly.

export const colors = {
  brand: {
    50: 'var(--color-brand-50)',
    // ...
    500: 'var(--color-brand-500)',
  },
  status: {
    success: 'var(--color-success-500)',
    warning: 'var(--color-warning-500)',
    danger: 'var(--color-danger-500)',
    info: 'var(--color-info-500)',
  },
} as const

// ─── Typography Tokens ───────────────────────────────────────────────────────
export const typography = {
  h1: 'text-h1',
  h2: 'text-h2',
  h3: 'text-h3',
  h4: 'text-h4',
  h5: 'text-h5',
  h6: 'text-h6',
  bodyLg: 'text-body-lg',
  bodyLgItalic: 'text-body-lg-italic',
  bodyLgMedium: 'text-body-lg-medium',
  bodyMd: 'text-body-md',
  bodyMdItalic: 'text-body-md-italic',
  bodyMdMedium: 'text-body-md-medium',
  bodySm: 'text-body-sm',
  bodySmItalic: 'text-body-sm-italic',
  bodySmMedium: 'text-body-sm-medium',
} as const

// ─── Semantic class helpers ──────────────────────────────────────────────────
export const badge = {
  success: 'badge-success',
  warning: 'badge-warning',
  danger: 'badge-danger',
  info: 'badge-info',
  other: 'badge-other',
} as const

export const btn = {
  primary: { sm: 'btn-primary btn-sm', md: 'btn-primary btn-md', lg: 'btn-primary btn-lg' },
  secondary: { sm: 'btn-secondary btn-sm', md: 'btn-secondary btn-md', lg: 'btn-secondary btn-lg' },
  ghost: { sm: 'btn-ghost btn-sm', md: 'btn-ghost btn-md', lg: 'btn-ghost btn-lg' },
  danger: { sm: 'btn-danger btn-sm', md: 'btn-danger btn-md', lg: 'btn-danger btn-lg' },
} as const
```

---

### STEP 7 — Write `CLAUDE.md`

Update a CLAUDE.md at the project root so all future Claude Code sessions follow these rules:

```markdown
## Project: [Project Name]

## Design System Rules (NEVER BREAK THESE)

- NEVER hardcode hex colors. Use Tailwind classes like `bg-brand-500`, `text-danger-600`.
- NEVER hardcode font sizes. Use typography classes like `text-h1`, `text-body-md`.
- ALL design tokens live in `src/styles/globals.css` inside `@theme {}`.
- ALL typography utilities live in `src/styles/typography.css`.
- ALL reusable component base styles live in `src/styles/components.css`.

## Fonts

- Headings (H1–H4): Ubuntu — use `font-heading` or `.text-h1/.text-h2` etc.
- Body + UI (H5–H6, body, labels): Poppins — use `font-body` or `.text-body-*` classes.

## Color Usage Guide

- Primary actions: `brand-500`, hover: `brand-600`
- Success states: `success-500` bg, `success-700` text
- Warning states: `warning-500` bg, `warning-700` text
- Danger/Error: `danger-500` bg, `danger-700` text
- Borders: `stroke` — always use `border-stroke`
- Page background: `bg-bg`
- Main text: `text-heading`
- Muted text: `text-text-muted`

## Component Patterns

- Buttons: always use `.btn` + `.btn-primary/.btn-secondary` + `.btn-sm/.btn-md/.btn-lg`
- Badges: always use `.badge` + `.badge-success/.badge-warning` etc.
- Cards: always use `.card`
- Inputs: always use `.input`

## Commands

- `npm run dev` — start dev server
- `npm run build` — production build (must pass before any PR)
- `npm run lint` — must pass before any PR

## Stack

- Next.js 15, TypeScript strict, Tailwind CSS v4, ShadCN UI, App Router
- No `tailwind.config.ts` — all tokens in `globals.css @theme {}`
```

---

### STEP 8 — Verify

Run these checks after all files are written:

```bash
# 1. Build must pass
npm run build

# 2. Lint must pass
npm run lint

# 3. Confirm token count
grep -c "^  --color" src/styles/globals.css
echo "↑ should match number of colors you extracted"
```

If build fails, fix before finishing.

---

## Quality Rules

- Every color from the user's design must be in `globals.css` — no omissions
- Typography must include all 15 classes: `text-h1` through `text-h6` + 9 body variants
- All typography classes must use CSS variables (`var(--text-*)`) — never raw `px` values
- No hardcoded values anywhere except inside `@theme {}`
- `tokens.ts` exports must match what's in `globals.css`
- `CLAUDE.md` must be written — this is what makes future sessions disciplined
- If fonts require Google Fonts, use `next/font/google` — never `<link>` tags
- Poppins must always be loaded with `style: ['normal', 'italic']` to support italic body classes
- Do NOT use `@apply <component-class>` inside `@layer components` — Tailwind v4 does not allow applying other component-layer classes. Inline the base properties instead.

## See Also

- `references/tailwind-v4-theme.md` — Tailwind v4 `@theme` syntax reference
- `references/nextjs-fonts.md` — next/font patterns
