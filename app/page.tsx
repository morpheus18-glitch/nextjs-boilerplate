'use client'
import React, { useState } from 'react'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)
  const router = useRouter()

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username, password })
      })
      const data = await res.json()
      setLoading(false)

      if (res.ok && data.success) {
        router.push('/dashboard')
      } else {
        setError(data.error || 'Login failed')
      }
    } catch (err) {
      console.error('Login error:', err)
      setLoading(false)
      setError('Something went wrong. Try again.')
    }
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-slate-900 to-blue-950">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-10 border border-white/10">
        <h1 className="text-4xl font-extrabold text-white text-center mb-8">🔒 Secure Login</h1>
        <form onSubmit={handleLogin} className="space-y-6">
          <input
            type="text"
            placeholder="Username"
            className="w-full rounded-lg px-5 py-3 bg-gray-900/80 text-white border border-gray-800 focus:border-blue-500 outline-none text-lg"
            value={username}
            onChange={e => setUsername(e.target.value)}
            required
            autoFocus
          />
          <div className="relative">
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Password"
              className="w-full rounded-lg px-5 py-3 bg-gray-900/80 text-white border border-gray-800 focus:border-blue-500 outline-none text-lg"
              value={password}
              onChange={e => setPassword(e.target.value)}
              required
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
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-blue-600 hover:bg-blue-800 font-bold text-white text-lg"
          >
            {loading ? 'Signing in…' : 'Login'}
          </button>
          <button
            type="button"
            className="w-full py-2 text-sm text-blue-200 hover:text-blue-400"
            onClick={() => router.push('/reset')}
          >
            Forgot password?
          </button>
          {error && <div className="text-center text-red-300 mt-2">{error}</div>}
        </form>
      </div>
    </div>
  )
}
