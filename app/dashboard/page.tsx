'use client'
import { useEffect } from 'react'

export default function Dashboard() {
  // Optional: client-side redirect if session is missing
  useEffect(() => {
    if (typeof window !== 'undefined' && !document.cookie.includes('session=authenticated')) {
      window.location.href = '/'
    }
  }, [])

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-gray-900 via-blue-950 to-gray-950">
      <div className="w-full max-w-xl bg-white/10 backdrop-blur-xl rounded-2xl shadow-xl p-10 border border-white/10 text-center">
        <h1 className="text-4xl font-bold text-white mb-4">Dashboard</h1>
        <p className="text-lg text-white/80 mb-8">You are securely logged in.</p>
        <div className="flex flex-col items-center gap-4">
          <a href="/admin" className="px-6 py-3 bg-blue-600 hover:bg-blue-800 rounded-lg text-white font-semibold shadow">Change Password</a>
          <a href="/reset" className="px-6 py-3 bg-purple-600 hover:bg-purple-800 rounded-lg text-white font-semibold shadow">Reset Password</a>
          <button
            className="px-6 py-3 bg-gray-700 hover:bg-gray-900 rounded-lg text-white font-semibold shadow"
            onClick={() => {
              document.cookie = 'session=; Max-Age=0; path=/'
              window.location.href = '/'
            }}
          >Logout</button>
        </div>
      </div>
    </div>
  )
}