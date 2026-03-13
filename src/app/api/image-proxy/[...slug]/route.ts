import { NextRequest, NextResponse } from 'next/server'

const CACHE_MAX_AGE = 60 * 60 * 24 // 24 h
const ALLOWED_PROTOCOLS = new Set(['https:'])

/**
 * GET /api/image-proxy/<base64url-encoded-src>
 *
 * Path-based image proxy. The external URL is base64url-encoded into the
 * path so there are no query strings — `next/image` accepts plain local
 * paths without any `images.localPatterns` configuration.
 *
 * Security:
 *  - Only HTTPS sources accepted
 *  - Upstream Content-Type must start with "image/"
 *  - 24 h public cache with stale-while-revalidate
 */
export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ slug: string[] }> },
): Promise<NextResponse> {
  const { slug } = await params

  if (!slug || slug.length === 0) {
    return NextResponse.json({ error: 'Missing encoded image path.' }, { status: 400 })
  }

  // Re-join segments, reverse the URL-safe substitution, then decode.
  // Use standard 'base64' (not 'base64url') for Node.js version compat.
  // Buffer.from with 'base64' silently ignores missing padding.
  const encoded = slug.join('/').replace(/-/g, '+').replace(/_/g, '/')
  let rawUrl: string
  try {
    rawUrl = Buffer.from(encoded, 'base64').toString('utf-8')
  } catch {
    return NextResponse.json({ error: 'Invalid encoded path.' }, { status: 400 })
  }

  let parsedUrl: URL
  try {
    parsedUrl = new URL(rawUrl)
  } catch {
    return NextResponse.json({ error: 'Decoded value is not a valid URL.' }, { status: 400 })
  }

  if (!ALLOWED_PROTOCOLS.has(parsedUrl.protocol)) {
    return NextResponse.json({ error: 'Only HTTPS image sources are permitted.' }, { status: 400 })
  }

  let upstream: Response
  try {
    upstream = await fetch(rawUrl, {
      headers: { Accept: 'image/*' },
      next: { revalidate: CACHE_MAX_AGE },
    })
  } catch {
    return NextResponse.json({ error: 'Failed to reach the image source.' }, { status: 502 })
  }

  if (!upstream.ok) {
    return NextResponse.json(
      { error: `Upstream returned ${upstream.status}.` },
      { status: upstream.status },
    )
  }

  const contentType = upstream.headers.get('content-type') ?? ''
  if (!contentType.startsWith('image/')) {
    return NextResponse.json({ error: 'Upstream resource is not an image.' }, { status: 422 })
  }

  const body = await upstream.arrayBuffer()

  return new NextResponse(body, {
    status: 200,
    headers: {
      'Content-Type': contentType,
      'Cache-Control': `public, max-age=${CACHE_MAX_AGE}, stale-while-revalidate=${CACHE_MAX_AGE / 2}`,
    },
  })
}
