'use client'
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'

export default function AdminPage() {
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [showPassword, setShowPassword] = useState(false)
  const [msg, setMsg] = useState('')
  const [loading, setLoading] = useState(false)

  const [userName, setUserName] = useState('')
  const [userRole, setUserRole] = useState<'user' | 'admin'>('user')
  const [userPass, setUserPass] = useState('')
  const [userPass2, setUserPass2] = useState('')
  const router = useRouter()

  useEffect(() => {
    if (typeof document === 'undefined') return
    const match = document.cookie.match(/session=([^;]+)/)
    if (!match) {
      router.replace('/')
      return
    }
    const [, value] = match
    const role = value.split(':')[1]
    if (role !== 'admin') router.replace('/dashboard')
  }, [router])

  async function handleChange(e: React.FormEvent) {
    e.preventDefault()
    setMsg('')
    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(newPassword)) {
      setMsg('Password does not meet requirements')
      return
    }
    if (newPassword !== confirmPassword) {
      setMsg('Passwords do not match')
      return
    }
    setLoading(true)
    const res = await fetch('/api/set-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ password: newPassword })
    })
    const data = await res.json()
    setLoading(false)
    setMsg(data.success ? 'Password changed!' : data.error || 'Failed')
    if (data.success) {
      setNewPassword('')
      setConfirmPassword('')
    }
  }

  async function handleCreate(e: React.FormEvent) {
    e.preventDefault()
    setMsg('')
    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(userPass)) {
      setMsg('Password does not meet requirements')
      return
    }
    if (userPass !== userPass2) {
      setMsg('Passwords do not match')
      return
    }
    setLoading(true)
    const res = await fetch('/api/admin/create-user', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: userName, password: userPass, role: userRole })
    })
    const data = await res.json()
    setLoading(false)
    setMsg(data.success ? 'User created' : data.error || 'Failed')
    if (data.success) {
      setUserName('')
      setUserPass('')
      setUserPass2('')
      setUserRole('user')
    }
  }

  async function handleResetUser(e: React.FormEvent) {
    e.preventDefault()
    setMsg('')
    if (!/^(?=.*[A-Z])(?=.*\d)(?=.*[^A-Za-z0-9]).{8,}$/.test(userPass)) {
      setMsg('Password does not meet requirements')
      return
    }
    if (userPass !== userPass2) {
      setMsg('Passwords do not match')
      return
    }
    setLoading(true)
    const res = await fetch('/api/admin/reset-password', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ username: userName, password: userPass })
    })
    const data = await res.json()
    setLoading(false)
    setMsg(data.success ? 'Password reset' : data.error || 'Failed')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-blue-950 via-slate-900 to-gray-950">
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-xl rounded-2xl shadow-2xl p-10 border border-white/10 space-y-10">
        <div>
          <h1 className="text-3xl font-bold text-white text-center mb-8">Admin: Change Own Password</h1>
          <form onSubmit={handleChange} className="space-y-6">
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="New password"
                className="w-full rounded-lg px-5 py-3 bg-gray-900/80 text-white border border-gray-800 focus:border-blue-500 outline-none text-lg"
                value={newPassword}
                onChange={e => setNewPassword(e.target.value)}
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
              className="w-full py-3 rounded-lg bg-purple-600 hover:bg-purple-800 font-bold text-white text-lg"
            >
              {loading ? 'Changing…' : 'Change Password'}
            </button>
          </form>
        </div>

        <div>
          <h2 className="text-2xl font-bold text-white text-center mb-4">Add or Reset User</h2>
          <form onSubmit={handleCreate} className="space-y-4">
            <input
              type="text"
              placeholder="Username"
              className="w-full rounded-lg px-5 py-3 bg-gray-900/80 text-white border border-gray-800 focus:border-blue-500 outline-none text-lg"
              value={userName}
              onChange={e => setUserName(e.target.value)}
              required
            />
            <select
              className="w-full rounded-lg px-5 py-3 bg-gray-900/80 text-white border border-gray-800 focus:border-blue-500 outline-none text-lg"
              value={userRole}
              onChange={e => setUserRole(e.target.value as 'user' | 'admin')}
            >
              <option value="user">User</option>
              <option value="admin">Admin</option>
            </select>
            <div className="relative">
              <input
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="w-full rounded-lg px-5 py-3 bg-gray-900/80 text-white border border-gray-800 focus:border-blue-500 outline-none text-lg"
                value={userPass}
                onChange={e => setUserPass(e.target.value)}
                required
              />
              <button
                type="button"
                tabIndex={-1}
                onClick={() => setShowPassword(v => !v)}
                className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-400 hover:text-white"
              >👁</button>
            </div>
            <input
              type={showPassword ? 'text' : 'password'}
              placeholder="Confirm password"
              className="w-full rounded-lg px-5 py-3 bg-gray-900/80 text-white border border-gray-800 focus:border-blue-500 outline-none text-lg"
              value={userPass2}
              onChange={e => setUserPass2(e.target.value)}
              required
            />
            <div className="flex gap-4">
              <button
                type="submit"
                disabled={loading}
                className="flex-1 py-3 rounded-lg bg-green-600 hover:bg-green-800 font-bold text-white"
              >
                Add User
              </button>
              <button
                type="button"
                disabled={loading}
                onClick={handleResetUser}
                className="flex-1 py-3 rounded-lg bg-blue-600 hover:bg-blue-800 font-bold text-white"
              >
                Reset Password
              </button>
            </div>
          </form>
        </div>
        {msg && <div className="text-center text-green-300 mt-4">{msg}</div>}
        <a href="/" className="block text-blue-300 hover:text-blue-500 text-center">← Back to Dashboard</a>
      </div>
    </div>
  )
}
