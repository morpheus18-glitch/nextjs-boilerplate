'use client'
import React, { useState } from 'react'
import { Eye, EyeOff, Mail, Lock, ArrowLeft, Check, User, Settings, LogOut } from 'lucide-react'

interface Errors {
  email?: string
  password?: string
  resetEmail?: string
  general?: string
}

interface UserRecord {
  password: string
  name: string
}

const users: Record<string, UserRecord> = {
  'user@example.com': { password: 'password123', name: 'John Doe' },
  'admin@example.com': { password: 'admin123', name: 'Admin User' }
}

function validateEmail(email: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)
}

export default function LoginSystem() {
  const [currentView, setCurrentView] = useState<'login' | 'reset' | 'homepage'>('login')
  const [formData, setFormData] = useState({ email: '', password: '', resetEmail: '' })
  const [showPassword, setShowPassword] = useState(false)
  const [errors, setErrors] = useState<Errors>({})
  const [loading, setLoading] = useState(false)
  const [resetSent, setResetSent] = useState(false)
  const [currentUser, setCurrentUser] = useState<{ email: string; name: string } | null>(null)

  function handleInputChange(e: React.ChangeEvent<HTMLInputElement>) {
    const { name, value } = e.target
    setFormData(prev => ({ ...prev, [name]: value }))
    if (errors[name as keyof Errors]) {
      setErrors(prev => ({ ...prev, [name]: '' }))
    }
  }

  function handleLogin(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    const newErrors: Errors = {}
    if (!formData.email) {
      newErrors.email = 'Email is required'
    } else if (!validateEmail(formData.email)) {
      newErrors.email = 'Please enter a valid email'
    }

    if (!formData.password) {
      newErrors.password = 'Password is required'
    }

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors)
      setLoading(false)
      return
    }

    setTimeout(() => {
      const user = users[formData.email]
      if (user && user.password === formData.password) {
        setCurrentUser({ email: formData.email, name: user.name })
        setCurrentView('homepage')
      } else {
        setErrors({ general: 'Invalid email or password' })
      }
      setLoading(false)
    }, 1000)
  }

  function handlePasswordReset(e: React.FormEvent) {
    e.preventDefault()
    setLoading(true)
    setErrors({})

    if (!formData.resetEmail) {
      setErrors({ resetEmail: 'Email is required' })
      setLoading(false)
      return
    }

    if (!validateEmail(formData.resetEmail)) {
      setErrors({ resetEmail: 'Please enter a valid email' })
      setLoading(false)
      return
    }

    setTimeout(() => {
      setResetSent(true)
      setLoading(false)
    }, 1000)
  }

  function handleLogout() {
    setCurrentUser(null)
    setCurrentView('login')
    setFormData({ email: '', password: '', resetEmail: '' })
    setErrors({})
    setResetSent(false)
  }

  if (currentView === 'reset') {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
        <div className="max-w-md w-full space-y-8">
          <div className="bg-white rounded-2xl shadow-xl p-8">
            <div className="text-center mb-8">
              <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
                <Mail className="h-6 w-6 text-white" />
              </div>
              <h2 className="text-3xl font-bold text-gray-900">Reset Password</h2>
              <p className="text-gray-600 mt-2">Enter your email to receive reset instructions</p>
            </div>
            {resetSent ? (
              <div className="text-center">
                <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h3 className="text-lg font-medium text-gray-900 mb-2">Email Sent!</h3>
                <p className="text-gray-600 mb-6">We&apos;ve sent password reset instructions to {formData.resetEmail}</p>
                <button
                  onClick={() => {
                    setCurrentView('login')
                    setResetSent(false)
                    setFormData(prev => ({ ...prev, resetEmail: '' }))
                  }}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 transition-colors"
                >
                  Back to Login
                </button>
              </div>
            ) : (
              <div className="space-y-6">
                <div>
                  <label htmlFor="resetEmail" className="block text-sm font-medium text-gray-700 mb-2">
                    Email Address
                  </label>
                  <div className="relative">
                    <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                    <input
                      id="resetEmail"
                      name="resetEmail"
                      type="email"
                      value={formData.resetEmail}
                      onChange={handleInputChange}
                      onKeyDown={e => e.key === 'Enter' && handlePasswordReset(e)}
                      className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors ${errors.resetEmail ? 'border-red-500' : 'border-gray-300'}`}
                      placeholder="Enter your email"
                    />
                  </div>
                  {errors.resetEmail && <p className="mt-1 text-sm text-red-600">{errors.resetEmail}</p>}
                </div>

                <button
                  onClick={handlePasswordReset}
                  disabled={loading}
                  className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
                >
                  {loading ? 'Sending...' : 'Send Reset Instructions'}
                </button>

                <button
                  type="button"
                  onClick={() => setCurrentView('login')}
                  className="w-full flex items-center justify-center text-gray-600 hover:text-gray-800 py-2"
                >
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back to Login
                </button>
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  if (currentView === 'homepage') {
    return (
      <div className="min-h-screen bg-gray-50">
        <header className="bg-white shadow">
          <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
            <div className="flex justify-between items-center py-6">
              <div className="flex items-center">
                <div className="h-8 w-8 bg-indigo-600 rounded-lg flex items-center justify-center mr-3">
                  <Lock className="h-5 w-5 text-white" />
                </div>
                <h1 className="text-2xl font-bold text-gray-900">Dashboard</h1>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex items-center space-x-2">
                  <User className="h-5 w-5 text-gray-500" />
                  <span className="text-gray-700">{currentUser?.name}</span>
                </div>
                <button
                  onClick={handleLogout}
                  className="flex items-center space-x-2 text-gray-600 hover:text-gray-800 px-3 py-2 rounded-lg hover:bg-gray-100 transition-colors"
                >
                  <LogOut className="h-4 w-4" />
                  <span>Logout</span>
                </button>
              </div>
            </div>
          </div>
        </header>
        <main className="max-w-7xl mx-auto py-6 sm:px-6 lg:px-8">
          <div className="px-4 py-6 sm:px-0">
            <div className="border-4 border-dashed border-gray-200 rounded-lg p-8">
              <div className="text-center">
                <div className="mx-auto h-16 w-16 bg-green-100 rounded-full flex items-center justify-center mb-4">
                  <Check className="h-8 w-8 text-green-600" />
                </div>
                <h2 className="text-3xl font-bold text-gray-900 mb-2">Welcome to Your Dashboard!</h2>
                <p className="text-gray-600 mb-8">You&apos;ve successfully logged in as {currentUser?.email}</p>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-8">
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Profile</h3>
                      <User className="h-5 w-5 text-indigo-600" />
                    </div>
                    <p className="text-gray-600">Manage your account settings and preferences</p>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Settings</h3>
                      <Settings className="h-5 w-5 text-indigo-600" />
                    </div>
                    <p className="text-gray-600">Configure your application preferences</p>
                  </div>
                  <div className="bg-white rounded-lg shadow p-6">
                    <div className="flex items-center justify-between mb-4">
                      <h3 className="text-lg font-medium text-gray-900">Security</h3>
                      <Lock className="h-5 w-5 text-indigo-600" />
                    </div>
                    <p className="text-gray-600">Update your security settings and password</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 flex items-center justify-center p-4">
      <div className="max-w-md w-full space-y-8">
        <div className="bg-white rounded-2xl shadow-xl p-8">
          <div className="text-center mb-8">
            <div className="mx-auto h-12 w-12 bg-indigo-600 rounded-full flex items-center justify-center mb-4">
              <Lock className="h-6 w-6 text-white" />
            </div>
            <h2 className="text-3xl font-bold text-gray-900">Welcome Back</h2>
            <p className="text-gray-600 mt-2">Sign in to your account</p>
          </div>
          {errors.general && <div className="bg-red-50 border border-red-200 text-red-700 px-4 py-3 rounded-lg mb-6">{errors.general}</div>}
          <div className="space-y-6">
            <div>
              <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="email"
                  name="email"
                  type="email"
                  value={formData.email}
                  onChange={handleInputChange}
                  onKeyDown={e => e.key === 'Enter' && handleLogin(e)}
                  className={`w-full pl-10 pr-4 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors ${errors.email ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter your email"
                />
              </div>
              {errors.email && <p className="mt-1 text-sm text-red-600">{errors.email}</p>}
            </div>
            <div>
              <label htmlFor="password" className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <div className="relative">
                <Lock className="absolute left-3 top-3 h-5 w-5 text-gray-400" />
                <input
                  id="password"
                  name="password"
                  type={showPassword ? 'text' : 'password'}
                  value={formData.password}
                  onChange={handleInputChange}
                  onKeyDown={e => e.key === 'Enter' && handleLogin(e)}
                  className={`w-full pl-10 pr-12 py-3 border rounded-lg focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 outline-none transition-colors ${errors.password ? 'border-red-500' : 'border-gray-300'}`}
                  placeholder="Enter your password"
                />
                <button
                  type="button"
                  onClick={() => setShowPassword(!showPassword)}
                  className="absolute right-3 top-3 text-gray-400 hover:text-gray-600"
                >
                  {showPassword ? <EyeOff className="h-5 w-5" /> : <Eye className="h-5 w-5" />}
                </button>
              </div>
              {errors.password && <p className="mt-1 text-sm text-red-600">{errors.password}</p>}
            </div>
            <div className="flex items-center justify-between">
              <button
                type="button"
                onClick={() => setCurrentView('reset')}
                className="text-sm text-indigo-600 hover:text-indigo-500 font-medium"
              >
                Forgot your password?
              </button>
            </div>
            <button
              onClick={handleLogin}
              disabled={loading}
              className="w-full bg-indigo-600 text-white py-3 px-4 rounded-lg font-medium hover:bg-indigo-700 focus:ring-2 focus:ring-indigo-500 focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed transition-colors"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </div>
          <div className="mt-6 text-center">
            <p className="text-sm text-gray-600">Demo credentials: user@example.com / password123</p>
          </div>
        </div>
      </div>
    </div>
  )
}
