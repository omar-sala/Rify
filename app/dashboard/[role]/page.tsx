'use client'

import { useParams, useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import { useEffect } from 'react'

export default function DashboardPage() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const params = useParams()
  const urlRole = params.role as string

  useEffect(() => {
    // 1. لو التحميل خلص ومفيش مستخدم، ارميه على صفحة الـ login
    if (!loading && !user) {
      router.replace('/login') // استخدمنا replace بدل push عشان ميرجعش لورا تاني
      return
    }

    // 2. حماية المسار: لو المستخدم بيحاول يدخل على role مش بتاعته
    // مثال: لو هو user وبيحاول يدخل /dashboard/seller
    if (user && user.role !== urlRole) {
      router.replace(`/dashboard/${user.role}`)
    }
  }, [user, loading, urlRole, router])

  // حالة التحميل: شكلها أشيك بـ Tailwind
  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <p className="animate-pulse text-gray-500">جاري تحميل لوحة التحكم...</p>
      </div>
    )
  }

  // لو مفيش مستخدم أو الدور غلط، متعرضش حاجة لحد ما الـ useEffect يشتغل
  if (!user || user.role !== urlRole) return null

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-blue-600 capitalize">
        Welcome to {user.role} dashboard
      </h1>
      <div className="mt-4 p-6 bg-white rounded-lg shadow-md">
        <p className="text-lg">
          مرحباً بك يا <span className="font-semibold">{user.name}</span>
        </p>
        <p className="text-gray-600">بريدك الإلكتروني: {user.email}</p>
      </div>
    </div>
  )
}
