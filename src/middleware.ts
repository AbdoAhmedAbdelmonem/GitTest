import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

// ⚠️ Toggle this to enable/disable maintenance mode
const MAINTENANCE_MODE = false

export function middleware(request: NextRequest) {
  // If maintenance mode is enabled
  if (MAINTENANCE_MODE) {
    const { pathname } = request.nextUrl

    // Allow access to maintenance page itself and essential assets
    const allowedPaths = [
      '/maintenance',
      '/api',
      '/_next',
      '/favicon.ico',
    ]

    // Check if the path is allowed
    const isAllowed = allowedPaths.some(path => pathname.startsWith(path))

    // If not allowed, redirect to maintenance page
    if (!isAllowed) {
      const maintenanceUrl = new URL('/maintenance', request.url)
      return NextResponse.redirect(maintenanceUrl)
    }
  }

  // Simply pass through all requests
  return NextResponse.next()
}

// Optionally, you can specify which paths this middleware should run on
export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     */
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}




