'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth, Role } from '../context/AuthContext'

export default function RegisterPage() {
  const router = useRouter()
  const { register } = useAuth()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [role, setRole] = useState<Role>('user')
  const [loading, setLoading] = useState(false)

  const handleRegister = async () => {
    if (!name || !email || !password) return alert('برجاء ملء جميع البيانات')
    if (password.length < 6)
      return alert('كلمة المرور يجب أن تكون 6 أحرف على الأقل')

    setLoading(true)

    try {
      console.log('Starting registration for:', email) // مراقبة البداية
      await register(name, email, password, role)

      console.log('Registration successful, redirecting...')
      router.push('/auth/callback')
    } catch (err: any) {
      // طباعة الخطأ كامل في الكونسول عشان نعرف المشكلة من سوبابيز ولا من الكود
      console.error('Registration Error Details:', err)
      alert(err.message || 'حدث خطأ غير متوقع')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div
      className="flex items-center justify-center min-h-[90vh] px-4 text-right"
      dir="rtl"
    >
      <div className="max-w-md w-full bg-white p-8 rounded-xl shadow-lg border border-gray-100">
        <h2 className="text-2xl font-bold mb-6 text-center text-gray-800">
          إنشاء حساب جديد
        </h2>

        <div className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              الاسم الكامل
            </label>
            <input
              type="text"
              placeholder="مثال: عمر محمد"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              البريد الإلكتروني
            </label>
            <input
              type="email"
              placeholder="Email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all text-left"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              كلمة المرور
            </label>
            <input
              type="password"
              placeholder="••••••••"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="border border-gray-300 p-2.5 w-full rounded-lg focus:ring-2 focus:ring-green-500 outline-none transition-all text-left"
            />
          </div>

          <div className="relative">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              سجلت كـ :
            </label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value as Role)}
              className="border border-gray-300 p-2.5 w-full rounded-lg bg-gray-50 focus:ring-2 focus:ring-green-500 outline-none appearance-none cursor-pointer"
            >
              <option value="user">مشتري (User)</option>
              <option value="seller">تاجر (Seller)</option>
              <option value="delivery">مندوب شحن (Delivery)</option>
            </select>
          </div>

          <button
            onClick={handleRegister}
            disabled={loading}
            className={`w-full py-3 rounded-lg font-semibold transition-all mt-2 ${
              loading
                ? 'bg-gray-400 cursor-not-allowed'
                : 'bg-green-600 text-white hover:bg-green-700 active:scale-[0.98]'
            }`}
          >
            {loading ? 'جارٍ إنشاء الحساب...' : 'إنشاء حساب'}
          </button>
        </div>

        <p className="mt-6 text-sm text-center text-gray-600">
          عندك حساب فعلاً؟{' '}
          <button
            className="text-black font-bold hover:underline"
            onClick={() => router.push('/login')}
          >
            سجل دخول
          </button>
        </p>
      </div>
    </div>
  )
}
