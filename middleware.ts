import { NextRequest, NextResponse } from 'next/server'

// Match routes that require authentication
export function middleware(req: NextRequest) {
  const sessionCookie = req.cookies.get('session')
  const isAuth = sessionCookie?.value === 'authenticated'

  const protectedPaths = ['/dashboard', '/admin']

  if (protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
    if (!isAuth) {
      console.log('Not authenticated — redirecting to login')
      return NextResponse.redirect(new URL('/', req.url))
    }
  }
  return NextResponse.next()
}

// Specify which routes to run the middleware on
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/reset/:path*'],
}
