'use client'
import { useState } from 'react'

export default function AdminPage() {
  const [password, setPassword] = useState('')
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  async function handleChange(e: React.FormEvent) {
    e.preventDefault()
    setMsg('')
    setLoading(true)
    const res = await fetch('/api/set-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password }),
    })
    const data = await res.json()
    setLoading(false)
    setMsg(data.success ? 'Password changed!' : data.error || 'Failed')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-slate-900 to-gray-950">
      <div className="w-full max-w-md bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-10 border border-white/10">
        <h1 className="text-3xl font-bold text-white text-center mb-8">Admin: Change Password</h1>
        <form onSubmit={handleChange} className="space-y-6">
          <input
            type="password"
            placeholder="New password"
            className="w-full rounded-lg px-5 py-3 bg-gray-900/80 text-white border border-gray-800 focus:border-blue-500 outline-none text-lg"
            value={password}
            onChange={e => setPassword(e.target.value)}
            required
          />
          <button
            type="submit"
            disabled={loading}
            className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-800 font-bold text-white text-lg"
          >
            {loading ? 'Changing…' : 'Change Password'}
          </button>
        </form>
        {msg && <div className="text-center text-green-300 mt-4">{msg}</div>}
      </div>
    </div>
  )
}