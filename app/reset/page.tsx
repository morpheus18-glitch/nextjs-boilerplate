'use client'
import { useState } from 'react'

export default function ResetPage() {
  const [step, setStep] = useState<'code' | 'reset'>('code')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [msg, setMsg] = useState('')

  async function handleCode(e: React.FormEvent) {
    e.preventDefault()
    if (code === '123456') setStep('reset')
    else setMsg('Invalid code (hint: 123456)')
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    const res = await fetch('/api/reset-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ code, password: newPassword }),
    })
    const data = await res.json()
    if (data.success) {
      setMsg('Password reset! Go login.')
      setStep('code')
    } else {
      setMsg(data.error || 'Reset failed')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-slate-900 via-blue-950 to-gray-950">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-10 border border-white/10">
        <h1 className="text-3xl font-bold text-white text-center mb-8">
          {step === 'code' ? 'Reset Password' : 'Set New Password'}
        </h1>
        {step === 'code' ? (
          <form onSubmit={handleCode} className="space-y-6">
            <input
              type="text"
              placeholder="Enter reset code"
              className="w-full rounded-lg px-5 py-3 bg-gray-900/80 text-white border border-gray-800 focus:border-blue-500 outline-none text-lg"
              value={code}
              onChange={e => setCode(e.target.value)}
              required
              autoFocus
            />
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-800 font-bold text-white text-lg"
            >
              Verify Code
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="space-y-6">
            <input
              type="password"
              placeholder="New password"
              className="w-full rounded-lg px-5 py-3 bg-gray-900/80 text-white border border-gray-800 focus:border-blue-500 outline-none text-lg"
              value={newPassword}
              onChange={e => setNewPassword(e.target.value)}
              required
            />
            <button
              type="submit"
              className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-800 font-bold text-white text-lg"
            >
              Set Password
            </button>
          </form>
        )}
        {msg && <div className="text-center text-red-300 mt-4">{msg}</div>}
      </div>
    </div>
  )
}