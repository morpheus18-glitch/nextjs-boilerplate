import { NextResponse } from 'next/server'
import { updatePassword, verifyResetCode } from '@/lib/users'

export async function POST(req: Request) {
  try {
    const { username, code, password } = await req.json()
    if (!username || !password || !code) {
      return NextResponse.json({ success: false, error: 'Missing data' })
    }
    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password)) {
      return NextResponse.json({ success: false, error: 'Weak password' })
    }
    const valid = await verifyResetCode(username, code)
    if (!valid) {
      return NextResponse.json({ success: false, error: 'Invalid code' })
    }
    await updatePassword(username, password)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Server error: ' + String(err) }, { status: 500 })
  }
}
