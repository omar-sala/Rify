'use client'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login, user, loading } = useAuth()
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [btnLoading, setBtnLoading] = useState(false)

  useEffect(() => {
    if (loading) return
    if (user) {
      console.log('User profile:', user) // ✨ افحص الـ role هنا
      const routes: Record<string, string> = {
        user: '/',
        seller: '/dashboard/seller',
        delivery: '/dashboard/delivery',
      }

      const redirectTo = routes[user.role || 'user'] // fallback للمشتري
      router.push(redirectTo)
    }
  }, [user, loading])

  const handleLogin = async () => {
    try {
      setBtnLoading(true)
      await login(email, password)
    } catch (err: any) {
      alert('خطأ في الدخول: ' + err.message)
    } finally {
      setBtnLoading(false)
    }
  }

  if (user && !loading)
    return <div className="p-20 text-center text-lg">جاري توجيهك...</div>

  return (
    <div className="flex items-center justify-center min-h-screen bg-gray-100">
      <div className="bg-white shadow-lg rounded-2xl p-8 w-full max-w-sm flex flex-col gap-4">
        <h1 className="text-2xl font-bold text-center">Login</h1>

        <input
          className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
          placeholder="Email"
          onChange={(e) => setEmail(e.target.value)}
        />

        <input
          className="border rounded-lg p-3 focus:outline-none focus:ring-2 focus:ring-black"
          type="password"
          placeholder="Password"
          onChange={(e) => setPassword(e.target.value)}
        />

        <button
          className="bg-black cursor-pointer text-white p-3 rounded-lg hover:opacity-90 transition"
          onClick={handleLogin}
          disabled={btnLoading}
        >
          {btnLoading ? 'Loading...' : 'Login'}
        </button>

        {/* زرار التسجيل */}
        <p className="text-center text-sm text-gray-500">مش عندك حساب؟</p>

        <button
          className="border cursor-pointer border-black p-2 rounded-lg hover:bg-black hover:text-white transition"
          onClick={() => router.push('/register')}
        >
          Create Account
        </button>
      </div>
    </div>
  )
}
