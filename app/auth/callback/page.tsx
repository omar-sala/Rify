'use client'

import { useEffect, useState } from 'react'
import supabase from '@/lib/supabase'
import { useRouter } from 'next/navigation'

export default function AuthCallback() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      // 1. التأكد من وجود جلسة (Session) نشطة
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError || !session?.user) {
        router.push('/register')
        return
      }

      const user = session.user

      // 2. جلب الدور (role) من جدول profiles بدلاً من users
      const { data: profileData, error: profileError } = await supabase
        .from('profiles') // تغيير اسم الجدول لـ profiles
        .select('role')
        .eq('id', user.id)
        .single()

      if (profileError || !profileData) {
        console.error('Profile fetch error:', profileError?.message)
        // إذا لم يجد ملف شخصي، قد يكون المستخدم جديداً جداً، يفضل توجيهه للإكمال أو التسجيل
        router.push('/register')
        return
      }

      // 3. إعادة التوجيه بناءً على الـ Role
      // ملاحظة: تأكد أن لديك مجلدات داخل الـ dashboard لكل دور (user, seller, delivery)
      const userRole = profileData.role || 'user'
      router.push(`/dashboard/${userRole}`)

      setLoading(false)
    }

    checkUser()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      {loading && (
        <div className="text-center">
          <p className="text-lg font-semibold">جارٍ تسجيل الدخول...</p>
          {/* يمكنك إضافة Spinner هنا باستخدام Tailwind */}
          <div className="mt-4 animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600 mx-auto"></div>
        </div>
      )}
    </div>
  )
}
