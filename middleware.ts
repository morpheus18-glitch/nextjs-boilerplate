import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const sessionCookie = req.cookies.get('session')
  const isAuth = sessionCookie?.value === 'authenticated'

  const protectedPaths = ['/dashboard', '/admin']

  if (protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
    if (!isAuth) {
      return NextResponse.redirect(new URL('/', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}
