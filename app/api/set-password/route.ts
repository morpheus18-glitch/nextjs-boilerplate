import { NextResponse } from 'next/server'
import { setPassword } from '../../../lib/password'

export async function POST(req: Request) {
  try {
    // Optional: Add session check here for production!
    const cookie = req.headers.get('cookie') || ''
    const isAuth = cookie.includes('session=authenticated')
    if (!isAuth) return NextResponse.json({ success: false, error: 'Not authorized' })

    const { password } = await req.json()
    if (!password || password.length < 6) {
      return NextResponse.json({ success: false, error: 'Password must be at least 6 characters' })
    }
    await setPassword(password)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Server error: ' + String(err) }, { status: 500 })
  }
}
