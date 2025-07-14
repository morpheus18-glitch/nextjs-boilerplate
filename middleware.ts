import { NextRequest, NextResponse } from 'next/server'

// Match routes that require authentication
export function middleware(req: NextRequest) {
  const cookie = req.cookies.get('session')
  const isAuth = cookie && cookie.value === 'authenticated'
  const protectedPaths = ['/dashboard', '/admin']

  if (protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
    if (!isAuth) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }
  return NextResponse.next()
}

// Specify which routes to run the middleware on
export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*', '/reset/:path*'],
}
