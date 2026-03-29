'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'

export default function DeliveryDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()

  useEffect(() => {
    // الانتظار حتى انتهاء التحميل لمنع التوجيه الخاطئ
    if (loading) return

    if (!user) {
      router.replace('/login')
    } else if (user.role !== 'delivery') {
      // توجيه المستخدم لصفحته الصحيحة بناءً على رتبته لو حاول يدخل هنا غلط
      const routes: any = {
        user: '/',
        seller: '/dashboard/seller',
      }
      router.replace(routes[user.role] || '/')
    }
  }, [user, loading, router])

  // عرض شاشة تحميل بسيطة أو فارغة أثناء التحقق
  if (loading || !user || user.role !== 'delivery') {
    return (
      <div className="flex items-center justify-center min-h-screen font-bold text-gray-500">
        جاري التحقق من الصلاحيات... 🚚
      </div>
    )
  }

  return (
    <div className="p-10 text-right" dir="rtl">
      <h1 className="text-3xl font-bold text-orange-600 mb-4">
        لوحة تحكم المندوب
      </h1>
      <div className="bg-white p-6 rounded-xl shadow-md border border-gray-100">
        <p className="text-xl">
          مرحباً بك يا كابتن <span className="font-bold">{user.name}</span> 👋
        </p>
        <p className="mt-2 text-gray-600">جاهز لتوصيل الطلبات اليوم؟</p>
      </div>
    </div>
  )
}
