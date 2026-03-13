import { NextResponse } from 'next/server'

/**
 * Retired. The proxy now uses path-based encoding to avoid next/image
 * requiring `images.localPatterns` config for query-string local URLs.
 * See: /api/image-proxy/[...slug]/route.ts
 */
export function GET(): NextResponse {
  return NextResponse.json(
    { error: 'Use /api/image-proxy/<base64url-encoded-url> instead.' },
    { status: 410 },
  )
}
