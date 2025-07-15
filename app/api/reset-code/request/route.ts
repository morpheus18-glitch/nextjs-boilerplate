import { NextResponse } from 'next/server'
import { createResetCode } from '@/lib/users'

export async function POST(req: Request) {
  try {
    const { username } = await req.json()
    if (!username) {
      return NextResponse.json({ success: false, error: 'Username required' })
    }
    const code = await createResetCode(username)
    // In real app we'd email the code. Return it for demo purposes.
    return NextResponse.json({ success: true, code })
  } catch (err) {
    return NextResponse.json({ success: false, error: 'Server error: ' + String(err) }, { status: 500 })
  }
}
