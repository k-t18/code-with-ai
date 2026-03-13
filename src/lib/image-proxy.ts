/**
 * Convert any external image URL to a proxied path that goes through
 * /api/image-proxy/[...slug], keeping `next/image` happy with zero
 * next.config.js changes.
 *
 * The external URL is base64url-encoded into the path so there is no
 * query string — Next.js only requires `images.localPatterns` config
 * for local URLs that contain query strings, not plain paths.
 *
 * Local paths (starting with "/") and data URIs are returned unchanged.
 */
export function toProxyUrl(src: string): string {
  if (!src || src.startsWith('/') || src.startsWith('data:')) return src
  // Use standard base64 + manual URL-safe substitution — avoids 'base64url'
  // encoding string which is unsupported by browser Buffer polyfills.
  const encoded = Buffer.from(src)
    .toString('base64')
    .replace(/\+/g, '-')
    .replace(/\//g, '_')
    .replace(/=/g, '')
  return `/api/image-proxy/${encoded}`
}
