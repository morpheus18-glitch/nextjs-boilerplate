import { NextResponse } from 'next/server'
import { verifyPassword } from '../../../lib/password'

export async function POST(req: Request) {
  const { password } = await req.json()
  if (!password) return NextResponse.json({ success: false, error: 'Missing password' })
  const valid = await verifyPassword(password)
  if (!valid) return NextResponse.json({ success: false, error: 'Incorrect password' })
  // Set a session cookie for browser (expires in 1 hour, HttpOnly, Secure)
  const response = NextResponse.json({ success: true })
  response.cookies.set('session', 'authenticated', { httpOnly: true, secure: true, maxAge: 3600, path: '/' })
  return response
}