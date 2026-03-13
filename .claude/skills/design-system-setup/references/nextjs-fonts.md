# Next.js Font Setup — next/font/google

## Why next/font

- Zero layout shift (fonts preloaded)
- No external network request at runtime
- CSS variable injection — works perfectly with Tailwind v4 @theme

## Pattern for Multiple Fonts

```tsx
// src/app/layout.tsx
import { Ubuntu, Poppins } from 'next/font/google'

const ubuntu = Ubuntu({
  subsets: ['latin'],
  weight: ['400', '500'],
  variable: '--font-heading', // must match @theme variable name
  display: 'swap',
})

const poppins = Poppins({
  subsets: ['latin'],
  weight: ['400', '500', '600'],
  variable: '--font-body', // must match @theme variable name
  display: 'swap',
})

export default function RootLayout({ children }) {
  return (
    <html className={`${ubuntu.variable} ${poppins.variable}`}>
      <body className="font-body antialiased">{children}</body>
    </html>
  )
}
```

## Common Google Fonts and Their Import Names

| Font Name | Import Name | Notes                   |
| --------- | ----------- | ----------------------- |
| Inter     | `Inter`     | Variable font available |
| Poppins   | `Poppins`   | Must specify weights    |
| Ubuntu    | `Ubuntu`    | Must specify weights    |
| Roboto    | `Roboto`    | Must specify weights    |
| Open Sans | `Open_Sans` | Underscore in name      |
| Nunito    | `Nunito`    | Variable font available |

## Weight Options

Only load weights actually used in the design — keeps bundle small.
Common sets:

- Body text: `['400', '500']`
- With semibold: `['400', '500', '600']`
- With bold: `['400', '500', '600', '700']`

## Variable Fonts (preferred when available)

```tsx
const inter = Inter({
  subsets: ['latin'],
  variable: '--font-body',
  // No weight needed — variable font covers all weights
})
```
