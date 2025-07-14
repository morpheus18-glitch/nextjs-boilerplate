import { NextRequest, NextResponse } from 'next/server'

export function middleware(req: NextRequest) {
  const sessionCookie = req.cookies.get('session')?.value
  const [id, role] = sessionCookie ? sessionCookie.split(':') : [null, null]

  const protectedPaths = ['/dashboard', '/admin']

  if (protectedPaths.some(path => req.nextUrl.pathname.startsWith(path))) {
    if (!id) {
      return NextResponse.redirect(new URL('/', req.url))
    }
    if (req.nextUrl.pathname.startsWith('/admin') && role !== 'admin') {
      return NextResponse.redirect(new URL('/dashboard', req.url))
    }
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/admin/:path*'],
}
