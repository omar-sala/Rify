'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../context/AuthContext'

export default function LoginPage() {
  const { login } = useAuth()
  const router = useRouter()

  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)

  const handleLogin = async () => {
    if (!email || !password) return alert('يرجى إكمال البيانات')

    try {
      setLoading(true)
      await login(email, password)

      // التعديل هنا: بنوديه لصفحة الـ callback عشان تفحص الـ Role وتوجهه صح
      router.replace('/auth/callback')
    } catch (err: any) {
      // تنبيه بشكل أشيك شوية
      alert(
        err.message === 'Invalid login credentials'
          ? 'الإيميل أو كلمة المرور غلط'
          : err.message || 'حدث خطأ في تسجيل الدخول'
      )
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="flex items-center justify-center min-h-[80vh] px-4">
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          تسجيل الدخول
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              placeholder="Email"
              className="border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-black outline-none transition-all"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              كلمة المرور
            </label>
            <input
              type="password"
              placeholder="••••••••"
              className="border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-black outline-none transition-all"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
            />
          </div>

          <button
            onClick={handleLogin}
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition-all ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-black text-white hover:bg-gray-800 active:scale-[0.98]'
            }`}
          >
            {loading ? 'جارٍ التحقق...' : 'دخول'}
          </button>
        </div>

        <div className="mt-6 text-sm text-center text-gray-600">
          معندكش حساب؟{' '}
          <button
            className="text-green-600 font-bold hover:underline"
            onClick={() => router.push('/register')}
          >
            سجل هنا
          </button>
        </div>
      </div>
    </div>
  )
}
