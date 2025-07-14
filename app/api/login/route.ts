import { NextResponse } from 'next/server'
import { verifyPassword } from '@/lib/password'

export async function POST(req: Request) {
  const { password } = await req.json()

  if (!password) {
    return NextResponse.json({ success: false, error: 'Missing password' })
  }

  const valid = await verifyPassword(password)

  if (!valid) {
    return NextResponse.json({ success: false, error: 'Incorrect password' })
  }

  const res = NextResponse.json({ success: true })
  res.cookies.set('session', 'authenticated', {
    httpOnly: true,
    secure: true,
    path: '/',
    maxAge: 60 * 60,
  })

  return res
}