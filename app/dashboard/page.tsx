'use client'
import { useEffect, useState } from 'react'

export default function Dashboard() {
  const [role, setRole] = useState<'admin' | 'user' | null>(null)

  useEffect(() => {
    if (typeof document === 'undefined') return
    const match = document.cookie.match(/session=([^;]+)/)
    if (!match) {
      window.location.href = '/'
      return
    }
    const [, value] = match
    const parts = value.split(':')
    const userRole = parts[1] as 'admin' | 'user'
    setRole(userRole)
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-950 to-gray-950">
      <div className="w-full max-w-3xl bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-10 border border-white/10 text-center space-y-8">
        <h1 className="text-4xl font-bold text-white mb-4">Dealership Dashboard</h1>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6 text-white">
          <a href="#inventory" className="p-6 rounded-xl bg-gray-800/70 hover:bg-gray-700">Inventory</a>
          <a href="#sales" className="p-6 rounded-xl bg-gray-800/70 hover:bg-gray-700">Sales</a>
          <a href="#service" className="p-6 rounded-xl bg-gray-800/70 hover:bg-gray-700">Service</a>
          <a href="#customers" className="p-6 rounded-xl bg-gray-800/70 hover:bg-gray-700">Customers</a>
          <a href="#financing" className="p-6 rounded-xl bg-gray-800/70 hover:bg-gray-700">Financing</a>
          <a href="#reports" className="p-6 rounded-xl bg-gray-800/70 hover:bg-gray-700">Reports</a>
        </div>
        {role === 'admin' && (
          <a href="/admin" className="inline-block px-6 py-3 bg-blue-600 hover:bg-blue-800 rounded-lg text-white font-semibold shadow">Admin Panel</a>
        )}
        <button
          className="px-6 py-3 bg-gray-700 hover:bg-gray-900 rounded-lg text-white font-semibold shadow"
          onClick={() => {
            document.cookie = 'session=; Max-Age=0; path=/'
            window.location.href = '/'
          }}
        >Logout</button>
      </div>
    </div>
  )
}
