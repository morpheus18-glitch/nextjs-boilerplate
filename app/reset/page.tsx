'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function ResetPage() {
  const [step, setStep] = useState<'code' | 'reset'>('code')
  const [username, setUsername] = useState('')
  const [code, setCode] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleCode(e: React.FormEvent) {
    e.preventDefault()
    setMsg('')
    setLoading(true)
    const res = await fetch('/api/reset-code/request', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username })
    })
    const data = await res.json()
    setLoading(false)
    if (data.success) {
      setMsg(`Code sent! (demo code: ${data.code})`)
      setStep('reset')
    } else {
      setMsg(data.error || 'Failed to send code')
    }
  }

  async function handleReset(e: React.FormEvent) {
    e.preventDefault()
    setMsg('')

    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(newPassword)) {
      setMsg('Password too weak')
      return
    }

    if (newPassword !== confirmPassword) {
      setMsg('Passwords do not match')
      return
    }

    setLoading(true)

    const res = await fetch('/api/reset-code', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username, code, password: newPassword })
    })

    const data = await res.json()
    setLoading(false)

    if (data.success) {
      setMsg('✅ Password reset! Redirecting...')
      setTimeout(() => {
        router.replace('/')
      }, 2000)
    } else {
      setMsg(data.error || '❌ Reset failed')
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
              placeholder="Username"
              className="w-full rounded-lg px-5 py-3 bg-gray-900/80 text-white border border-gray-800 focus:border-blue-500 outline-none text-lg"
              value={username}
              onChange={e => setUsername(e.target.value)}
              required
              autoFocus
            />
            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-800 font-bold text-white text-lg"
            >
              {loading ? 'Sending…' : 'Send Code'}
            </button>
          </form>
        ) : (
          <form onSubmit={handleReset} className="space-y-6">
            <input
              type="text"
              placeholder="Reset code"
              className="w-full rounded-lg px-5 py-3 bg-gray-900/80 text-white border border-gray-800 focus:border-blue-500 outline-none text-lg"
              value={code}
              onChange={e => setCode(e.target.value)}
              required
            />
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="New password"
                className="w-full rounded-lg px-5 py-3 bg-gray-900/80 text-white border border-gray-800 focus:border-blue-500 outline-none text-lg"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
                required
                autoFocus
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
                aria-label={showPassword ? 'Hide password' : 'Show password'}
              >
                {showPassword ? (
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M3 3l18 18m-1.41-1.41A9.963 9.963 0 0 1 12 21C6.48 21 2 12 2 12a20.61 20.61 0 0 1 5.13-7.06M10.36 6.37A5.978 5.978 0 0 1 12 6c5.52 0 10 9 10 9a20.612 20.612 0 0 1-4.29 5.29"/></svg>
                ) : (
                  <svg width="22" height="22" fill="none" viewBox="0 0 24 24"><path stroke="currentColor" strokeWidth="2" d="M1 12S6.48 3 12 3s11 9 11 9-4.48 9-11 9S1 12 1 12z"/><circle cx="12" cy="12" r="4" stroke="currentColor" strokeWidth="2"/></svg>
                )}
              </button>
            </div>

            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                className="w-full rounded-lg px-5 py-3 bg-gray-900/80 text-white border border-gray-800 focus:border-blue-500 outline-none text-lg"
                value={confirmPassword}
                onChange={e => setConfirmPassword(e.target.value)}
                required
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 rounded-lg bg-green-600 hover:bg-green-800 font-bold text-white text-lg"
            >
              {loading ? 'Setting…' : 'Set Password'}
            </button>
          </form>
        )}
        {msg && <div className="text-center text-red-300 mt-4">{msg}</div>}
      </div>
    </div>
  )
}
