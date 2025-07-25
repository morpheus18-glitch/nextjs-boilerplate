import { NextResponse } from 'next/server'
import { updatePasswordById } from '@/lib/users'

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get('cookie') || ''
    const match = cookie.match(/session=([^;]+)/)
    const session = match ? match[1] : null
    if (!session) return NextResponse.json({ success: false, error: 'Not authorized' })
    const [idStr] = session.split(':')
    const userId = parseInt(idStr, 10)
    if (!userId) return NextResponse.json({ success: false, error: 'Invalid session' })

    const { password } = await req.json()
    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password)) {
      return NextResponse.json({ success: false, error: 'Password does not meet requirements' })
    }
    await updatePasswordById(userId, password)
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Server error: ' + String(err) }, { status: 500 })
  }
}
