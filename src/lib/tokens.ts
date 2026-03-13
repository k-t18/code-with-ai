/**
 * Design token reference for TruCare.
 *
 * Use these as reference only. In JSX/TSX always use Tailwind utility classes
 * (e.g. `bg-brand-500`, `text-danger-600`) — never inline CSS with these values.
 *
 * Typography size vars use the sz-* and lh-* prefix in @theme (not text-* or leading-*)
 * to avoid Tailwind v4 auto-generating conflicting font-size utilities.
 */

// ─── Color Tokens ─────────────────────────────────────────────────────────────

export const colors = {
  brand: {
    50: 'var(--color-brand-50)',
    100: 'var(--color-brand-100)',
    200: 'var(--color-brand-200)',
    300: 'var(--color-brand-300)',
    400: 'var(--color-brand-400)',
    500: 'var(--color-brand-500)', // primary
    600: 'var(--color-brand-600)',
    700: 'var(--color-brand-700)',
    800: 'var(--color-brand-800)',
    900: 'var(--color-brand-900)',
  },
  grays: {
    50: 'var(--color-grays-50)',
    100: 'var(--color-grays-100)',
    200: 'var(--color-grays-200)',
    300: 'var(--color-grays-300)',
    400: 'var(--color-grays-400)',
    500: 'var(--color-grays-500)',
    600: 'var(--color-grays-600)',
    700: 'var(--color-grays-700)',
    800: 'var(--color-grays-800)',
    900: 'var(--color-grays-900)',
  },
  warmWhite: {
    50: 'var(--color-warm-white-50)',
    100: 'var(--color-warm-white-100)',
    200: 'var(--color-warm-white-200)',
    300: 'var(--color-warm-white-300)',
    400: 'var(--color-warm-white-400)',
    500: 'var(--color-warm-white-500)',
    600: 'var(--color-warm-white-600)',
    700: 'var(--color-warm-white-700)',
    800: 'var(--color-warm-white-800)',
    900: 'var(--color-warm-white-900)',
  },
  text: {
    charcoal: 'var(--color-charcoal)',
    white: 'var(--color-white)',
    black: 'var(--color-black)',
  },
  semantic: {
    navbar: 'var(--color-navbar)',
    heading: 'var(--color-heading)',
    muted: 'var(--color-text-muted)',
    stroke: 'var(--color-stroke)',
    bg: 'var(--color-bg)',
  },
  success: {
    50: 'var(--color-success-50)',
    100: 'var(--color-success-100)',
    200: 'var(--color-success-200)',
    300: 'var(--color-success-300)',
    400: 'var(--color-success-400)',
    500: 'var(--color-success-500)',
    600: 'var(--color-success-600)',
    700: 'var(--color-success-700)',
    800: 'var(--color-success-800)',
    900: 'var(--color-success-900)',
  },
  warning: {
    50: 'var(--color-warning-50)',
    100: 'var(--color-warning-100)',
    200: 'var(--color-warning-200)',
    300: 'var(--color-warning-300)',
    400: 'var(--color-warning-400)',
    500: 'var(--color-warning-500)',
    600: 'var(--color-warning-600)',
    700: 'var(--color-warning-700)',
    800: 'var(--color-warning-800)',
    900: 'var(--color-warning-900)',
  },
  danger: {
    50: 'var(--color-danger-50)',
    100: 'var(--color-danger-100)',
    200: 'var(--color-danger-200)',
    300: 'var(--color-danger-300)',
    400: 'var(--color-danger-400)',
    500: 'var(--color-danger-500)',
    600: 'var(--color-danger-600)',
    700: 'var(--color-danger-700)',
    800: 'var(--color-danger-800)',
    900: 'var(--color-danger-900)',
  },
  information: {
    50: 'var(--color-information-50)',
    100: 'var(--color-information-100)',
    200: 'var(--color-information-200)',
    300: 'var(--color-information-300)',
    400: 'var(--color-information-400)',
    500: 'var(--color-information-500)',
    600: 'var(--color-information-600)',
    700: 'var(--color-information-700)',
    800: 'var(--color-information-800)',
    900: 'var(--color-information-900)',
  },
  other: {
    50: 'var(--color-other-50)',
    100: 'var(--color-other-100)',
    200: 'var(--color-other-200)',
    300: 'var(--color-other-300)',
    400: 'var(--color-other-400)',
    500: 'var(--color-other-500)',
    600: 'var(--color-other-600)',
    700: 'var(--color-other-700)',
    800: 'var(--color-other-800)',
    900: 'var(--color-other-900)',
  },
} as const

// ─── Typography Tokens ────────────────────────────────────────────────────────

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

// ─── Component Class Helpers ──────────────────────────────────────────────────

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
