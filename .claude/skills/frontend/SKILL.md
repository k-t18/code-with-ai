---
name: frontend
description: >
  Generate production-grade React frontend code using Tailwind CSS, shadcn/ui,
  cva, clsx, and lucide-react. Activate automatically when the user asks to
  build UI components, pages, layouts, forms, dashboards, or any visual
  interface. Also activate when the user asks to refactor, fix, or improve
  existing frontend code in this stack.
---

# Frontend Skill — Production-Grade React UI

You are generating production-quality frontend code for a React codebase.
The canonical stack is:

| Concern          | Tool                              |
| ---------------- | --------------------------------- |
| Styling          | Tailwind CSS (utility-first)      |
| Component system | shadcn/ui (Radix primitives)      |
| Variant logic    | cva (class-variance-authority)    |
| Class merging    | clsx + tailwind-merge (cn helper) |
| Icons            | lucide-react                      |

Never introduce additional UI libraries unless the user explicitly asks.

---

## 0. Before Writing Any Code

Think through these before touching the keyboard:

1. **What is this component's single responsibility?** Name it clearly.
2. **What are its variants?** (size, intent, state, layout). Model these with `cva`.
3. **What external data does it need?** Define a clean TypeScript props interface.
4. **What accessibility semantics does it need?** (role, aria-\*, keyboard nav)
5. **Does a shadcn/ui primitive already handle 80% of this?** Use it. Don't reinvent.

---

## 1. Project Conventions

### 1.1 The `cn` Helper

Always use a `cn` utility that merges Tailwind classes correctly. Assume it exists at `@/lib/utils`:

```ts
// lib/utils.ts
import { clsx, type ClassValue } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}
```

**Never** concatenate Tailwind class strings with template literals or string addition. Always use `cn()`.

### 1.2 File & Folder Structure

```
src/
  components/
    ui/            ← shadcn primitives (auto-generated, do not hand-edit)
    [feature]/
      ComponentName.tsx      ← component
      ComponentName.types.ts ← props interface (if complex)
      index.ts               ← barrel export
  lib/
    utils.ts       ← cn helper
```

### 1.3 Naming Rules

- Components: `PascalCase`
- Props interfaces: `ComponentNameProps`
- Variant configs: `componentNameVariants` (camelCase)
- Files: `PascalCase.tsx` for components, `camelCase.ts` for utilities

---

## 2. Styling Rules

### 2.1 Tailwind Usage

- Use Tailwind utilities **exclusively** for all spacing, color, typography, layout.
- Respect the design token scale: use `4`, `8`, `12`, `16`, `24`, `32`, `48`, `64` px steps (`p-1` → `p-16`). Do not use arbitrary values like `p-[13px]` unless absolutely unavoidable.
- Prefer semantic color tokens (`bg-background`, `text-foreground`, `text-muted-foreground`, `border-border`, `ring-ring`) over raw Tailwind palette colors (`bg-gray-200`). This ensures dark mode works automatically.
- **Dark mode**: use `dark:` variants only when the semantic token is insufficient.
- **Responsive**: mobile-first. Apply base styles for mobile, then `sm:`, `md:`, `lg:` overrides.
- **State variants**: use `hover:`, `focus-visible:`, `active:`, `disabled:`, `aria-selected:` — never style state via JS class toggling when a CSS variant covers it.

### 2.2 Do Not

- ❌ Use inline `style={{}}` for anything Tailwind can express
- ❌ Write custom CSS files for layout or spacing
- ❌ Mix Tailwind with a separate CSS-in-JS solution
- ❌ Use `!important` or `!` Tailwind prefix unless overriding a third-party lib

---

## 3. Variant Logic with `cva`

Use `cva` for **every component that has more than one visual state or size**.

### 3.1 Pattern

```tsx
import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const buttonVariants = cva(
  // Base classes — always applied
  'inline-flex items-center justify-center gap-2 rounded-md text-sm font-medium transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:pointer-events-none disabled:opacity-50',
  {
    variants: {
      variant: {
        default: 'bg-primary text-primary-foreground hover:bg-primary/90',
        destructive: 'bg-destructive text-destructive-foreground hover:bg-destructive/90',
        outline: 'border border-input bg-background hover:bg-accent hover:text-accent-foreground',
        ghost: 'hover:bg-accent hover:text-accent-foreground',
        link: 'text-primary underline-offset-4 hover:underline',
      },
      size: {
        sm: 'h-8 px-3 text-xs',
        md: 'h-9 px-4',
        lg: 'h-10 px-6 text-base',
        icon: 'h-9 w-9',
      },
    },
    defaultVariants: {
      variant: 'default',
      size: 'md',
    },
  }
)

interface ButtonProps
  extends React.ButtonHTMLAttributes<HTMLButtonElement>, VariantProps<typeof buttonVariants> {
  asChild?: boolean
}

export function Button({ className, variant, size, ...props }: ButtonProps) {
  return <button className={cn(buttonVariants({ variant, size }), className)} {...props} />
}
```

### 3.2 Rules

- Always export both the `variants` config AND the component so consumers can use `buttonVariants({ variant })` in other class strings.
- Always accept and forward `className` as the escape hatch — merge it last via `cn()`.
- `compoundVariants` in cva: use when a specific combination of variants needs unique styles (e.g., `outline` + `sm` needs a different border-radius).
- Do not encode business logic inside variant strings. Variants describe **visual** states only.

---

## 4. shadcn/ui Usage

### 4.1 Core Principle

shadcn/ui components live in `src/components/ui/`. Treat them as **your** code — they are copied, not imported from npm. You may read and extend them. Do not delete or bypass their accessibility wiring (Radix primitives).

### 4.2 When to Use shadcn Primitives

| Need                         | Use                                    |
| ---------------------------- | -------------------------------------- |
| Dialogs / modals             | `Dialog`, `AlertDialog`                |
| Dropdowns / context menus    | `DropdownMenu`, `ContextMenu`          |
| Combobox / searchable select | `Command` + `Popover`                  |
| Tooltips                     | `Tooltip`                              |
| Tabs                         | `Tabs`                                 |
| Forms                        | `Form` (react-hook-form + zod wrapper) |
| Data table                   | `Table` + TanStack Table               |
| Toasts                       | `Sonner` or `useToast`                 |
| Accordions                   | `Accordion`                            |

### 4.3 Composing shadcn Components

Prefer **composition over wrapping**. Build higher-order components by assembling shadcn primitives, not by wrapping them in extra divs:

```tsx
// ✅ Good — compose primitives
function ConfirmDialog({ title, description, onConfirm }: ConfirmDialogProps) {
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button variant="destructive">Delete</Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>{title}</DialogTitle>
          <DialogDescription>{description}</DialogDescription>
        </DialogHeader>
        <DialogFooter>
          <DialogClose asChild>
            <Button variant="outline">Cancel</Button>
          </DialogClose>
          <Button variant="destructive" onClick={onConfirm}>
            Confirm
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  )
}

// ❌ Bad — unnecessary wrapping layer
function ConfirmDialog(props) {
  return (
    <div className="wrapper">
      <Dialog>...</Dialog>
    </div>
  )
}
```

---

## 5. Icons with lucide-react

```tsx
import { Search, X, ChevronDown, Loader2 } from "lucide-react";

// Always size via className, not width/height props
<Search className="h-4 w-4" />

// Loading spinner pattern
<Loader2 className="h-4 w-4 animate-spin" />

// Icon button — always add aria-label
<button aria-label="Close" className={cn(buttonVariants({ size: "icon", variant: "ghost" }))}>
  <X className="h-4 w-4" />
</button>
```

Rules:

- Size icons with `h-*`/`w-*` Tailwind classes, not props.
- For decorative icons alongside text, add `aria-hidden="true"`.
- For standalone icon buttons, always provide `aria-label`.
- Animate with Tailwind animation utilities (`animate-spin`, `animate-pulse`).
- Use `strokeWidth` prop (default `2`) only when design requires thinner/bolder strokes.

---

## 6. TypeScript Standards

### 6.1 Props Interfaces

```tsx
// ✅ Explicit, narrow props — never use object or Record<string, unknown> as a lazy escape
interface CardProps {
  title: string
  description?: string
  variant?: 'default' | 'featured' | 'compact'
  onAction?: () => void
  children: React.ReactNode
}

// ✅ Extend native HTML element props for primitive wrappers
// Use ComponentPropsWithoutRef to avoid ref type conflicts
interface InputProps extends React.ComponentPropsWithoutRef<'input'> {
  label: string
  error?: string
  hint?: string
}

// ✅ For forwardRef components, use ComponentPropsWithoutRef + expose ref type
const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, className, ...props }, ref) => {
    return <input ref={ref} className={cn('...', className)} {...props} />
  }
)
Input.displayName = 'Input'
```

### 6.2 Strict Rules — Non-Negotiable

| Rule                                                                  | Reason                                                                                 |
| --------------------------------------------------------------------- | -------------------------------------------------------------------------------------- |
| ❌ Never use `any`                                                    | Silently breaks type safety across the tree                                            |
| ❌ Never use `as SomeType` to silence errors                          | Fix the type, don't cast it away                                                       |
| ❌ Never use non-null assertion `!` unless value is provably non-null | Runtime crashes                                                                        |
| ❌ Never use `React.FC`                                               | Implicitly adds `children`, breaks generic components                                  |
| ❌ Never type event handlers as `any`                                 | Use `React.ChangeEvent<HTMLInputElement>`, `React.MouseEvent<HTMLButtonElement>`, etc. |
| ✅ `interface` for props and object shapes                            | Extends cleanly, better error messages                                                 |
| ✅ `type` for unions, intersections, aliases                          | `type Status = "idle" \| "loading" \| "error"`                                         |
| ✅ Explicit return types on hooks                                     | Makes intent obvious and catches mistakes                                              |

### 6.3 Event Handler Typing

```tsx
// ✅ Always type event handlers explicitly
interface SearchProps {
  onSearch: (query: string) => void
  onChange: React.ChangeEventHandler<HTMLInputElement> // for pass-through
  onKeyDown: React.KeyboardEventHandler<HTMLInputElement>
  onSubmit: React.FormEventHandler<HTMLFormElement>
}

// ✅ Inline handler — type the event, not the function
function Form() {
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    // ...
  }
  return <form onSubmit={handleSubmit} />
}
```

### 6.4 Generic Components

When a component works across data shapes, use generics — don't widen to `unknown[]`:

```tsx
// ✅ Generic select — type-safe value and options
interface SelectProps<T extends string | number> {
  options: Array<{ label: string; value: T }>
  value: T
  onChange: (value: T) => void
}

function Select<T extends string | number>({ options, value, onChange }: SelectProps<T>) {
  // ...
}

// ✅ Generic data table
interface DataTableProps<TData> {
  data: TData[]
  columns: ColumnDef<TData>[]
  isLoading?: boolean
}
```

### 6.5 Discriminated Unions for State

Model component state as discriminated unions — never use optional booleans that conflict:

```tsx
// ❌ Bad — isLoading and isError can both be true, isData is implicit
interface BadProps {
  isLoading?: boolean
  isError?: boolean
  data?: User[]
}

// ✅ Good — states are mutually exclusive by type
type AsyncState<T> =
  | { status: 'idle' }
  | { status: 'loading' }
  | { status: 'error'; error: string }
  | { status: 'success'; data: T }

interface UserListProps {
  state: AsyncState<User[]>
}

function UserList({ state }: UserListProps) {
  if (state.status === 'loading') return <Skeleton />
  if (state.status === 'error') return <ErrorMessage message={state.error} />
  if (state.status === 'success') return <List data={state.data} />
  return null
}
```

### 6.6 Utility Types — Use Them

```tsx
// Pick only what the child needs from a larger type
type ButtonStyleProps = Pick<ButtonProps, 'variant' | 'size' | 'className'>

// Omit internal/forwarded props before re-exporting
type PublicInputProps = Omit<InputProps, 'ref' | 'onChange'> & {
  onValueChange: (value: string) => void
}

// Make all required fields optional for update forms
type UpdateUserPayload = Partial<Pick<User, 'name' | 'email' | 'avatar'>>

// Readonly for config/constants
const ROUTES = {
  home: '/',
  dashboard: '/dashboard',
} as const satisfies Record<string, string>

type Route = (typeof ROUTES)[keyof typeof ROUTES] // "/" | "/dashboard"
```

### 6.7 Hook Return Types

Always declare explicit return types on custom hooks:

```tsx
// ✅ Explicit return type — callers know exactly what they get
function useDisclosure(defaultOpen = false): {
  isOpen: boolean
  open: () => void
  close: () => void
  toggle: () => void
} {
  const [isOpen, setIsOpen] = React.useState(defaultOpen)
  return {
    isOpen,
    open: () => setIsOpen(true),
    close: () => setIsOpen(false),
    toggle: () => setIsOpen((prev) => !prev),
  }
}

// ✅ Return tuple for useState-like hooks (use `as const`)
function useLocalStorage<T>(key: string, initialValue: T): [T, (value: T) => void] {
  // ...
  return [storedValue, setValue] as const
}
```

### 6.8 File-Level Rules

- All component files: `.tsx`
- All pure logic/utility files: `.ts`
- Export the props interface alongside the component from the same file
- Co-locate types with the code that uses them; only extract to `.types.ts` when shared across 3+ files
- Never use `export default` for components — named exports are refactor-safe and tree-shakeable

---

## 7. Accessibility (Non-Negotiable)

Every component ships accessible. This is not a checklist item at the end — it is built in from the first line.

### 7.1 Semantic HTML First

Use the right HTML element before reaching for `aria-*`. ARIA supplements semantics; it does not replace them.

```tsx
// ❌ Never do this
<div onClick={handleClick} className="...">Submit</div>

// ✅ Correct — native semantics are free
<button type="submit" className="...">Submit</button>

// ❌ Fake heading
<div className="text-xl font-bold">Section Title</div>

// ✅ Real heading — screen readers build a page outline from these
<h2 className="text-xl font-bold">Section Title</h2>
```

Semantic element reference:
| Use case | Element |
|---|---|
| Page regions | `<main>`, `<nav>`, `<header>`, `<footer>`, `<aside>`, `<section>` |
| Actions | `<button>` (in-page), `<a href>` (navigation) |
| Forms | `<form>`, `<label>`, `<input>`, `<select>`, `<textarea>`, `<fieldset>`, `<legend>` |
| Lists | `<ul>/<li>`, `<ol>/<li>`, `<dl>/<dt>/<dd>` |
| Tables | `<table>`, `<thead>`, `<th scope="col/row">`, `<caption>` |
| Headings | `<h1>`–`<h6>` — one `<h1>` per page, logical hierarchy |

### 7.2 Keyboard Navigation

Every interactive element must be fully operable by keyboard alone:

```tsx
// ✅ Tab order — never remove focus, only style it
// NEVER: outline-none without a focus-visible replacement
// ✅ Always pair outline-none with focus-visible:ring-*
className = 'outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2'

// ✅ Custom keyboard handler — support both Enter and Space for buttons
function CustomButton({ onClick, children }: CustomButtonProps) {
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === 'Enter' || e.key === ' ') {
          e.preventDefault()
          onClick()
        }
      }}
    >
      {children}
    </div>
  )
  // Better alternative: just use <button> and avoid this entirely
}

// ✅ Escape key closes modals/dropdowns (Radix handles this automatically)
// ✅ Arrow keys navigate within menus/tabs (Radix handles this automatically)
// ✅ Tab traps focus inside open modals (Radix Dialog handles this automatically)
```

Rule: if Radix/shadcn covers the pattern, use it — don't implement keyboard handling manually.

### 7.3 ARIA — Use Only When Needed

Add `aria-*` attributes only when native semantics are insufficient. Never add ARIA that duplicates what the element already communicates.

```tsx
// ✅ aria-label — for elements with no visible text label
<button aria-label="Close dialog">
  <X className="h-4 w-4" aria-hidden="true" />
</button>

// ✅ aria-labelledby — link element to its visible label
<section aria-labelledby="billing-heading">
  <h2 id="billing-heading">Billing</h2>
</section>

// ✅ aria-describedby — link input to helper/error text
<div>
  <input
    id="email"
    aria-describedby={error ? "email-error" : "email-hint"}
    aria-invalid={!!error}
  />
  {error
    ? <p id="email-error" role="alert" className="text-sm text-destructive">{error}</p>
    : <p id="email-hint" className="text-sm text-muted-foreground">We'll never share your email.</p>
  }
</div>

// ✅ aria-expanded — for toggles (Radix sets this automatically on its components)
<button aria-expanded={isOpen} aria-controls="menu-id">Menu</button>
<ul id="menu-id" hidden={!isOpen}>...</ul>

// ✅ aria-live — for dynamic content updates
<div aria-live="polite" aria-atomic="true">
  {statusMessage}  {/* Screen reader announces changes */}
</div>

// ✅ aria-busy — for loading containers
<div aria-busy={isLoading} aria-label={isLoading ? "Loading results" : undefined}>
  {isLoading ? <Skeleton /> : <Results />}
</div>

// ❌ Never do this — redundant ARIA on semantic elements
<button role="button">Click me</button>  // role="button" is implicit on <button>
<input type="checkbox" aria-checked="true" />  // state is native, not ARIA
```

### 7.4 Forms — Full Accessibility Pattern

```tsx
interface FormFieldProps {
  id: string
  label: string
  error?: string
  hint?: string
  required?: boolean
  children: React.ReactElement
}

function FormField({ id, label, error, hint, required, children }: FormFieldProps) {
  const hintId = hint ? `${id}-hint` : undefined
  const errorId = error ? `${id}-error` : undefined
  const describedBy = [hintId, errorId].filter(Boolean).join(' ') || undefined

  return (
    <div className="space-y-1.5">
      <label
        htmlFor={id}
        className="text-sm leading-none font-medium peer-disabled:cursor-not-allowed peer-disabled:opacity-70"
      >
        {label}
        {required && (
          <span aria-hidden="true" className="text-destructive ml-0.5">
            *
          </span>
        )}
        {required && <span className="sr-only">(required)</span>}
      </label>

      {React.cloneElement(children, {
        id,
        'aria-describedby': describedBy,
        'aria-invalid': !!error,
        'aria-required': required,
      })}

      {hint && !error && (
        <p id={hintId} className="text-muted-foreground text-sm">
          {hint}
        </p>
      )}
      {error && (
        <p id={errorId} role="alert" className="text-destructive text-sm">
          {error}
        </p>
      )}
    </div>
  )
}
```

### 7.5 Focus Management

```tsx
// ✅ Restore focus after closing a modal — Radix does this automatically
// ✅ Move focus to first error after form submission
function handleSubmitError(errors: Record<string, string>) {
  const firstErrorField = Object.keys(errors)[0]
  document.getElementById(firstErrorField)?.focus()
}

// ✅ Skip-to-main link — include on every page-level layout
function SkipToMain() {
  return (
    <a
      href="#main-content"
      className="focus:bg-background focus:text-foreground sr-only focus:not-sr-only focus:absolute focus:z-50 focus:p-4"
    >
      Skip to main content
    </a>
  )
}

// ✅ Focus trap in modals — use Radix Dialog, it handles this
// ✅ After route change, move focus to <main> or page heading
```

### 7.6 Color & Contrast

- Body text on backgrounds: minimum **4.5:1** contrast ratio (WCAG AA)
- Large text (18px+ or 14px+ bold): minimum **3:1**
- UI components and focus indicators: minimum **3:1**
- Never convey information through color alone — pair with icon, text, or pattern
- Test with shadcn's semantic tokens — they are designed for sufficient contrast in both light and dark mode

```tsx
// ❌ Color alone communicates status
<span className="text-red-500">Error</span>

// ✅ Color + icon + text communicates status
<span className="flex items-center gap-1.5 text-destructive">
  <AlertCircle className="h-4 w-4" aria-hidden="true" />
  Payment failed
</span>
```

### 7.7 Images & Media

```tsx
// ✅ Informative image — describe what it conveys
<img src={chart} alt="Monthly revenue increased 23% from January to March" />

// ✅ Decorative image — empty alt, screen reader skips it
<img src={decoration} alt="" role="presentation" />

// ✅ Icon as image — describe the action/meaning
<img src={logoSrc} alt="Acme Inc." />

// ✅ next/image or <img> — always provide alt
// ❌ Never omit alt attribute entirely (different from alt="")
```

### 7.8 Motion & Animation

Respect user's motion preferences:

```tsx
// ✅ Tailwind — use motion-safe: and motion-reduce: variants
className = 'transition-transform motion-reduce:transition-none motion-safe:hover:scale-105'

// ✅ CSS — @media (prefers-reduced-motion: reduce)
// Tailwind's motion-reduce: variant handles this

// ✅ Never autoplay video/animation without a pause control
// ✅ Flashing content: never flash more than 3 times per second (seizure risk)
```

### 7.9 Baseline Requirements Table

| Requirement          | Implementation                                                             |
| -------------------- | -------------------------------------------------------------------------- |
| Keyboard navigation  | All interactive elements Tab-reachable; Enter/Space activate               |
| Visible focus        | `focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2` |
| No focus suppression | Never `outline-none` without `focus-visible:ring-*` replacement            |
| Color contrast       | WCAG AA minimum — use shadcn semantic tokens                               |
| Not color-alone      | Pair color cues with icon or text                                          |
| Screen reader labels | `aria-label` or `aria-labelledby` on all unlabelled interactive elements   |
| Form labels          | Every `<input>` has an associated `<label htmlFor>`                        |
| Error messages       | `role="alert"` + `aria-describedby` linking input to error                 |
| Loading states       | `aria-busy="true"` on container; spinner has `aria-label`                  |
| Decorative icons     | `aria-hidden="true"`                                                       |
| Icon-only buttons    | `aria-label` describing the action                                         |
| Skip navigation      | Skip-to-main link on page layouts                                          |
| Semantic structure   | One `<h1>`, logical heading hierarchy, landmark regions                    |
| Motion               | `motion-reduce:` variant on all transitions/animations                     |

---

## 8. Component Anatomy Template

Use this structure for every new component:

```tsx
// 1. Imports — external libs, then internal
import { cva, type VariantProps } from "class-variance-authority";
import { SomeIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { ShadcnPrimitive } from "@/components/ui/primitive";

// 2. Variant definition
const componentVariants = cva("base-classes", {
  variants: { ... },
  defaultVariants: { ... },
});

// 3. Props interface
interface ComponentProps
  extends React.HTMLAttributes<HTMLDivElement>,
    VariantProps<typeof componentVariants> {
  // component-specific props
}

// 4. Component — named export, no React.FC
export function Component({
  className,
  variant,
  size,
  children,
  ...props
}: ComponentProps) {
  return (
    <div
      className={cn(componentVariants({ variant, size }), className)}
      {...props}
    >
      {children}
    </div>
  );
}

// 5. Display name (required for DevTools and forwardRef)
Component.displayName = "Component";
```

---

## 9. Common Patterns

### Loading State

```tsx
function SubmitButton({ isLoading, children }: { isLoading: boolean; children: React.ReactNode }) {
  return (
    <Button disabled={isLoading} aria-busy={isLoading}>
      {isLoading && <Loader2 className="h-4 w-4 animate-spin" />}
      {children}
    </Button>
  )
}
```

### Empty State

```tsx
function EmptyState({ icon: Icon, title, description, action }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 rounded-lg border border-dashed p-12 text-center">
      <div className="bg-muted rounded-full p-3">
        <Icon className="text-muted-foreground h-6 w-6" aria-hidden="true" />
      </div>
      <div className="space-y-1">
        <p className="text-sm font-medium">{title}</p>
        <p className="text-muted-foreground text-sm">{description}</p>
      </div>
      {action}
    </div>
  )
}
```

### Conditional Classes (clsx pattern)

```tsx
<div
  className={cn(
    'rounded-md border p-4 transition-colors',
    isSelected && 'border-primary bg-primary/5',
    isDisabled && 'cursor-not-allowed opacity-50',
    hasError && 'border-destructive bg-destructive/5',
    className
  )}
/>
```

### Data Table Column Definition

```tsx
const columns: ColumnDef<Payment>[] = [
  {
    accessorKey: 'status',
    header: 'Status',
    cell: ({ row }) => (
      <Badge variant={row.getValue('status') === 'paid' ? 'default' : 'secondary'}>
        {row.getValue('status')}
      </Badge>
    ),
  },
]
```

---

## 10. Anti-Patterns — Never Do These

| ❌ Anti-pattern                       | ✅ Correct approach                           |
| ------------------------------------- | --------------------------------------------- |
| `style={{ color: "red" }}`            | `className="text-destructive"`                |
| `className={"btn " + variant}`        | `className={cn(buttonVariants({ variant }))}` |
| Hardcoded hex colors in className     | Tailwind semantic tokens (`text-foreground`)  |
| `<div onClick={...}>` for buttons     | `<button>` or `<Button>`                      |
| `React.FC<Props>`                     | `function Comp(props: Props)`                 |
| Skipping `aria-label` on icon buttons | Always add `aria-label`                       |
| Arbitrary Tailwind values `w-[237px]` | Nearest scale value or layout approach        |
| One giant component file              | Split into focused sub-components             |
| Hard-coded breakpoints in JS          | Tailwind responsive variants                  |
| `!important` overrides                | Fix specificity at the source                 |

---

## 11. Code Review Checklist

Before considering a component done, verify every item:

**Styling**

- [ ] `cn()` used for all class merging — no string concatenation
- [ ] `cva` used for all variant logic
- [ ] `className` prop accepted and forwarded last
- [ ] Semantic color tokens used throughout (no raw palette colors)
- [ ] Mobile-first responsive classes applied

**TypeScript**

- [ ] No `any` types anywhere
- [ ] No `as SomeType` casts to silence errors
- [ ] No `React.FC` — plain named function with typed props
- [ ] Props interface exported alongside the component
- [ ] Event handlers typed explicitly (`React.ChangeEvent<HTMLInputElement>`, etc.)
- [ ] `forwardRef` components have `displayName` set
- [ ] Discriminated unions used for multi-state props (not conflicting optionals)
- [ ] Custom hooks have explicit return types

**Accessibility**

- [ ] Semantic HTML used — no `<div>` for buttons, headings, or landmarks
- [ ] All interactive elements keyboard-reachable via Tab
- [ ] `focus-visible:ring-*` present on every focusable element — no bare `outline-none`
- [ ] Every `<input>` has a `<label htmlFor>` association
- [ ] Error messages use `role="alert"` and are linked via `aria-describedby`
- [ ] Icon-only buttons have `aria-label`
- [ ] Decorative icons have `aria-hidden="true"`
- [ ] Loading containers have `aria-busy="true"`
- [ ] Color is never the sole indicator of state — icon or text paired
- [ ] Animations wrapped in `motion-safe:` / `motion-reduce:` variants
- [ ] No Radix ARIA props removed or overridden

**Component Quality**

- [ ] Single responsibility — one clear job
- [ ] Loading, empty, and error states all handled
- [ ] `displayName` set on forwardRef components
- [ ] No hardcoded breakpoints in JS — Tailwind responsive variants only
