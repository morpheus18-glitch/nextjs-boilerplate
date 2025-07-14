import { NextResponse } from 'next/server'
import { verifyUser } from '@/lib/users'

export async function POST(req: Request) {
  const { username, password } = await req.json()

  if (!username || !password) {
    return NextResponse.json({ success: false, error: 'Missing credentials' })
  }

  const user = await verifyUser(username, password)

  if (!user) {
    return NextResponse.json({ success: false, error: 'Invalid username or password' })
  }

  const res = NextResponse.json({ success: true, role: user.role })
  res.cookies.set('session', `${user.id}:${user.role}`, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60,
  })

  return res
}
