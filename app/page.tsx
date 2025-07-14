'use client'
import { useState } from 'react'

export default function LoginPage() {
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setError('')
    setLoading(true)
   
    try {
      const res = await fetch('/api/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ password }),
    })
    const data = await res.json()
    setLoading(false)

    if (res.ok && data.success) {
      setTimeout(() => 
        window.location.href = '/dashboard'
      }, 150)
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
            type="password"
            placeholder="Password"
            className="w-full rounded-lg px-5 py-3 bg-gray-900/80 text-white border border-gray-800 focus:border-blue-500 outline-none text-lg"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
            autoFocus
          />
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
            onClick={() => window.location.href = '/reset'}
          >
            Forgot password?
          </button>
          {error && <div className="text-center text-red-300 mt-2">{error}</div>}
        </form>
      </div>
    </div>
  )
}
