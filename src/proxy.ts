import { createServerClient, type CookieOptions } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'

/**
 * Next.js 16 Proxy
 * Replaces middleware.ts with the new proxy.ts convention.
 * Handles:
 * 1. Supabase session refreshing
 * 2. Route protection (Auth)
 * 3. Admin Authorization
 */
export async function proxy(request: NextRequest) {
  let response = NextResponse.next({
    request: {
      headers: request.headers,
    },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_PUBLISHABLE_DEFAULT_KEY!,
    {
      cookies: {
        get(name: string) {
          return request.cookies.get(name)?.value
        },
        set(name: string, value: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value,
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value,
            ...options,
          })
        },
        remove(name: string, options: CookieOptions) {
          request.cookies.set({
            name,
            value: '',
            ...options,
          })
          response = NextResponse.next({
            request: {
              headers: request.headers,
            },
          })
          response.cookies.set({
            name,
            value: '',
            ...options,
          })
        },
      },
    },
  )

  // This will refresh the session if expired
  // Important for Next.js 16 & @supabase/ssr
  const {
    data: { user },
  } = await supabase.auth.getUser()

  const pathname = request.nextUrl.pathname

  // 1. Auth Guard: Protect /dashboard, /session, /admin
  if (
    !user &&
    (pathname.startsWith('/dashboard') ||
      pathname.startsWith('/session') ||
      pathname.startsWith('/admin'))
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/login'
    return NextResponse.redirect(url)
  }

  // 2. Admin Guard: Only allow specific users to /admin
  if (user && pathname.startsWith('/admin')) {
    // Current simple admin check (e.g., via metadata or email)
    // In production, use role-based check from database
    const isAdmin =
      user.app_metadata?.role === 'admin' ||
      user.email?.endsWith('@admin.com') ||
      user.email === 'andii@example.com' // Temporary bypass for testing

    if (!isAdmin) {
      const url = request.nextUrl.clone()
      url.pathname = '/dashboard'
      return NextResponse.redirect(url)
    }
  }

  // 3. Authenticated Redirect: Redirect logged-in users away from /login or /register
  if (
    user &&
    (pathname.startsWith('/login') || pathname.startsWith('/register'))
  ) {
    const url = request.nextUrl.clone()
    url.pathname = '/dashboard'
    return NextResponse.redirect(url)
  }

  return response
}

export const config = {
  matcher: [
    /*
     * Match all request paths except for the ones starting with:
     * - _next/static (static files)
     * - _next/image (image optimization files)
     * - favicon.ico (favicon file)
     * Feel free to modify this pattern to include more paths.
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp)$).*)',
  ],
}
