import { NextResponse } from 'next/server'
import { updatePassword } from '@/lib/users'

export async function POST(req: Request) {
  try {
    const { username, code, password } = await req.json()
    if (code !== '123456') {
      return NextResponse.json({ success: false, error: 'Invalid code' })
    }
    if (!username || !password) {
      return NextResponse.json({ success: false, error: 'Missing data' })
    }
    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password)) {
      return NextResponse.json({ success: false, error: 'Weak password' })
    }
    await updatePassword(username, password)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Server error: ' + String(err) }, { status: 500 })
  }
}
