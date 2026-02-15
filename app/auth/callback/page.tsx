'use client'

import { useEffect, useState, Suspense } from 'react'
import supabase from '@/lib/supabase'
import { useRouter } from 'next/navigation'

// فصلنا المحتوى في Component لوحده عشان نغلفه بـ Suspense
function AuthCallbackContent() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const checkUser = async () => {
      // 1. التأكد من وجود جلسة نشطة
      const {
        data: { session },
        error: sessionError,
      } = await supabase.auth.getSession()

      if (sessionError || !session?.user) {
        router.replace('/register')
        return
      }

      const user = session.user

      // 2. جلب الدور من جدول profiles
      const { data: profileData, error: profileError } = await supabase
        .from('profiles')
        .select('role')
        .eq('id', user.id)
        .single()

      if (profileError || !profileData) {
        console.error('Profile fetch error:', profileError?.message)
        router.replace('/register')
        return
      }

      // 3. التوجيه بناءً على الـ Role
      const userRole = profileData.role || 'user'
      router.replace(`/dashboard/${userRole}`)
      setLoading(false)
    }

    checkUser()
  }, [router])

  return (
    <div className="flex items-center justify-center min-h-screen">
      {loading && (
        <div className="text-center">
          <p className="text-lg font-semibold text-green-700">
            جارٍ تسجيل الدخول...
          </p>
          <div className="mt-4 animate-spin rounded-full h-8 w-8 border-b-2 border-green-600 mx-auto"></div>
        </div>
      )}
    </div>
  )
}

// المكون الأساسي اللي Next.js بيشوفه
export default function AuthCallback() {
  return (
    <Suspense
      fallback={
        <div className="flex items-center justify-center min-h-screen text-green-700">
          تحميل... 🌿
        </div>
      }
    >
      <AuthCallbackContent />
    </Suspense>
  )
}
