import { NextResponse } from 'next/server'
import { createUser } from '@/lib/users'

export async function POST(req: Request) {
  try {
    const cookie = req.headers.get('cookie') || ''
    const match = cookie.match(/session=([^;]+)/)
    const session = match ? match[1] : null
    const role = session?.split(':')[1]
    if (role !== 'admin') return NextResponse.json({ success: false, error: 'Not authorized' })

    const { username, password, role: userRole } = await req.json()
    if (!username || !password || !userRole) {
      return NextResponse.json({ success: false, error: 'Missing fields' })
    }
    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(password)) {
      return NextResponse.json({ success: false, error: 'Weak password' })
    }
    await createUser(username, password, userRole === 'admin' ? 'admin' : 'user')
    return NextResponse.json({ success: true })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Server error: ' + String(err) }, { status: 500 })
  }
}
