import { NextResponse, type NextRequest } from 'next/server'

export function GET(req: NextRequest) {
  const session = req.cookies.get('session')?.value
  if (!session) {
    return NextResponse.json({ authenticated: false })
  }
  const parts = session.split(':')
  if (parts.length !== 2) {
    return NextResponse.json({ authenticated: false })
  }
  const role = parts[1] as 'admin' | 'user'
  return NextResponse.json({ authenticated: true, role })
}
