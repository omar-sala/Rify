'use client'

import { useEffect } from 'react'
import { useRouter } from 'next/navigation'
import { FaCheckCircle } from 'react-icons/fa'

export default function PaymentSuccess() {
  const router = useRouter()

  useEffect(() => {
    setTimeout(() => {
      router.push('/orders')
    }, 4000)
  }, [])

  return (
    <div
      className="min-h-screen flex flex-col items-center justify-center bg-green-50"
      dir="rtl"
    >
      <div className="bg-white p-10 rounded-3xl shadow-xl text-center space-y-6">
        <FaCheckCircle className="text-green-500 text-7xl mx-auto animate-bounce" />

        <h1 className="text-3xl font-black text-gray-800">
          تم الدفع بنجاح! 🎉
        </h1>

        <p className="text-gray-500 font-bold">
          طلبك في الطريق إليك من الريف 🌿
        </p>

        <p className="text-sm text-gray-400">
          سيتم تحويلك لصفحة طلباتك خلال ثوانٍ...
        </p>

        <button
          onClick={() => router.push('/orders')}
          className="w-full bg-green-600 text-white py-3 rounded-2xl font-black hover:bg-green-700 transition"
        >
          عرض طلباتي الآن
        </button>
      </div>
    </div>
  )
}
