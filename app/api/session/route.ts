import { NextRequest, NextResponse } from 'next/server'

export async function GET(req: NextRequest) {
  const cookie = req.cookies.get('session')?.value
  if (!cookie) {
    return NextResponse.json({ role: null }, { status: 401 })
  }
  const [, role] = cookie.split(':')
  return NextResponse.json({ role })
}
