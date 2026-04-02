'use client'

import { useCart } from '../../app/context/CartContext'
import { useAuth } from '../../app/context/AuthContext'
import { useEffect, useState } from 'react'
import supabase from '@/lib/supabase'

export default function CartDrawer() {
  const { cart, increase, decrease, remove, isOpen, closeCart, clearCart } =
    useCart()
  const { user } = useAuth()
  const [total, setTotal] = useState(0)
  const [loading, setLoading] = useState(false)

  // حقل رقم تليفون المشتري
  const [customerPhone, setCustomerPhone] = useState('')

  useEffect(() => {
    const sum = cart.reduce(
      (acc, item) => acc + item.price * (item.quantity ?? 1),
      0
    )
    setTotal(sum)
  }, [cart])

  if (!isOpen || !user) return null

  const handleCheckout = async () => {
    if (cart.length === 0) return
    if (!customerPhone || customerPhone.length < 10) {
      return alert('برجاء إدخال رقم تليفون صحيح للتواصل مع المندوب 📱')
    }

    setLoading(true)

    navigator.geolocation.getCurrentPosition(
      async (position) => {
        const { latitude, longitude } = position.coords

        try {
          const inserts = cart.map((item) => ({
            user_id: user.id,
            product_id: item.id,
            quantity: item.quantity ?? 1,
            total: item.price * (item.quantity ?? 1),
            status: 'pending',
            driver_id: null,

            // البيانات اللي المندوب هيحتاجها فعلياً
            customer_phone: customerPhone,
            customer_lat: latitude,
            customer_lng: longitude,

            // بيانات البائع
            seller_phone: item.seller_phone,
            seller_lat: item.lat,
            seller_lng: item.lng,

            // التعديل هنا: شيلنا النص اللي كان بيعمل Error
            // لو العمود "location" في الداتابيز Geometry سيبه فاضي أو ابعت NULL
            location: null,
          }))

          const { error } = await supabase.from('orders').insert(inserts)

          if (error) {
            console.error('Supabase Insert Error:', error)
            throw error
          }

          alert('تم إرسال طلبك للمناديب بنجاح! 🚀')
          clearCart()
          closeCart()
          setCustomerPhone('')
        } catch (err: any) {
          console.error('Full Error Object:', err)
          alert('حدث خطأ: ' + (err.message || 'تأكد من إعدادات الجدول'))
        } finally {
          setLoading(false)
        }
      },
      (error) => {
        setLoading(false)
        alert('برجاء تفعيل الـ GPS لتحديد موقع التوصيل 📍')
      }
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex">
      <div
        className="flex-1 bg-black/40 backdrop-blur-sm"
        onClick={closeCart}
      />
      <div
        className="w-96 bg-white h-full p-6 shadow-2xl flex flex-col"
        dir="rtl"
      >
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-xl text-orange-600 font-black">
            🛒 سلة المشتريات
          </h2>
          <button
            onClick={closeCart}
            className="text-gray-400 hover:text-red-500 text-2xl"
          >
            ✕
          </button>
        </div>

        <div className="flex-1 overflow-y-auto space-y-4">
          {cart.length === 0 ? (
            <div className="text-center mt-20">
              <span className="text-5xl block mb-4">🌾</span>
              <p className="text-gray-400">سلتك خالية من خيرات الريف</p>
            </div>
          ) : (
            cart.map((item) => (
              <div
                key={item.id}
                className="bg-gray-50 p-4 rounded-2xl border border-gray-100 flex flex-col gap-2"
              >
                <div className="flex justify-between items-start">
                  <p className="font-black text-gray-800">{item.name}</p>
                  <button
                    onClick={() => remove(item.id)}
                    className="text-xs text-red-400 hover:underline text-left"
                  >
                    حذف
                  </button>
                </div>
                <div className="flex justify-between items-center text-sm">
                  <span className="text-green-700 font-bold">
                    {item.price * (item.quantity ?? 1)} ج.م
                  </span>
                  <div className="flex items-center gap-3 bg-white border border-gray-200 px-3 py-1 rounded-full shadow-sm">
                    <button
                      onClick={() => decrease(item.id)}
                      className="font-bold text-orange-600 text-lg"
                    >
                      −
                    </button>
                    <span className="font-black w-4 text-center">
                      {item.quantity}
                    </span>
                    <button
                      onClick={() => increase(item.id)}
                      className="font-bold text-orange-600 text-lg"
                    >
                      +
                    </button>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {cart.length > 0 && (
          <div className="mt-auto pt-6 space-y-4 border-t-2 border-dashed border-gray-100">
            {/* حقل رقم التليفون - إجباري */}
            <div className="bg-orange-50 p-4 rounded-2xl border border-orange-100">
              <label className="block text-xs font-bold text-orange-600 mb-2 uppercase">
                رقم تليفونك للتواصل مع المندوب *
              </label>
              <input
                type="tel"
                placeholder="010XXXXXXXX"
                value={customerPhone}
                onChange={(e) => setCustomerPhone(e.target.value)}
                className="w-full p-3 rounded-xl border-2 border-orange-200 focus:border-orange-500 outline-none font-bold text-center tracking-widest"
              />
            </div>

            <div className="flex justify-between items-center px-2">
              <span className="text-gray-600 font-bold">الإجمالي:</span>
              <span className="text-3xl font-black text-green-700">
                {total} ج.م
              </span>
            </div>

            <button
              onClick={handleCheckout}
              disabled={loading}
              className="w-full bg-orange-600 text-white py-4 rounded-2xl font-black text-lg hover:bg-orange-700 transition-all disabled:opacity-50 shadow-xl shadow-orange-100 active:scale-95"
            >
              {loading ? 'جاري إرسال طلبك...' : 'تأكيد وشراء الخير ✅'}
            </button>
            <p className="text-[10px] text-center text-gray-400">
              بالضغط على تأكيد، سيتم تحديد موقعك بدقة لتسهيل وصول المندوب
            </p>
          </div>
        )}
      </div>
    </div>
  )
}
