import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { getToken } from 'next-auth/jwt'

// Map roles to their allowed root path
const rolePath: Record<string, string> = {
  SUPER_ADMIN: '/super-admin',
  ADMIN: '/admin',
  SHOP_OWNER: '/shop-owner',
  USER: '/user',
}

export async function middleware(request: NextRequest) {
  const token = await getToken({ req: request })
  const url = request.nextUrl
  const pathname = url.pathname

  // If not authenticated or not active, redirect to signin for protected routes
  if (!token || token.status !== "ACTIVE") {
    // Only protect non-public routes
    if (
      pathname.startsWith('/user') ||
      pathname.startsWith('/super-admin') ||
      pathname.startsWith('/admin') ||
      pathname.startsWith('/shop-owner') ||
      pathname.startsWith('/api')
    ) {
      return NextResponse.redirect(new URL('/signin', request.url))
    }
    return NextResponse.next()
  }

  // Redirect authenticated users away from sign-in and home to their dashboard
  if (pathname === '/' || pathname.startsWith('/signin')) {
    const dashboard = rolePath[token.role as string] || '/user'
    return NextResponse.redirect(new URL(dashboard, request.url))
  }

  // Role-based route protection
  for (const [role, path] of Object.entries(rolePath)) {
    if (pathname.startsWith(path) && token.role !== role) {
      return NextResponse.redirect(new URL('/signin', request.url))
    }
  }

  // Protect API routes by role if needed (optional, example for admin API)
  if (pathname.startsWith('/api/admin') && token.role !== 'ADMIN') {
    return NextResponse.redirect(new URL('/signin', request.url))
  }
  if (pathname.startsWith('/api/super-admin') && token.role !== 'SUPER_ADMIN') {
    return NextResponse.redirect(new URL('/signin', request.url))
  }
  if (pathname.startsWith('/api/shop-owner') && token.role !== 'SHOP_OWNER') {
    return NextResponse.redirect(new URL('/signin', request.url))
  }
  if (pathname.startsWith('/api/user') && token.role !== 'USER') {
    return NextResponse.redirect(new URL('/signin', request.url))
  }

  return NextResponse.next()
}

// Protect all routes except Next.js internals and static assets
export const config = {
  matcher: ['/((?!_next|api|auth|favicon.ico).*)'], // Apply to all except these
}