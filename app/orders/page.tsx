'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '../context/AuthContext'

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // 1. دالة حساب المسافة اللحظية (مؤمنة بالكامل)
  const calculateLiveDistance = (
    lat1: any,
    lon1: any,
    lat2: any,
    lon2: any
  ) => {
    // التأكد إن كل الأرقام موجودة وليست null
    if (!lat1 || !lon1 || !lat2 || !lon2) return null

    try {
      const R = 6371 // نصف قطر الأرض بالكيلومتر
      const dLat = ((Number(lat2) - Number(lat1)) * Math.PI) / 180
      const dLon = ((Number(lon2) - Number(lon1)) * Math.PI) / 180
      const a =
        Math.sin(dLat / 2) * Math.sin(dLat / 2) +
        Math.cos((Number(lat1) * Math.PI) / 180) *
          Math.cos((Number(lat2) * Math.PI) / 180) *
          Math.sin(dLon / 2) *
          Math.sin(dLon / 2)
      const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
      return (R * c).toFixed(1)
    } catch (e) {
      return null
    }
  }

  const fetchOrders = async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('orders')
      .select(
        `
        *,
        product:products!fk_product (name, image_url, price)
      `
      )
      .eq('user_id', user.id)
      .neq('status', 'cancelled')
      .order('created_at', { ascending: false })

    if (!error && data) setOrders(data)
    setLoading(false)
  }

  useEffect(() => {
    fetchOrders()

    // تفعيل التحديث اللحظي (Real-time)
    const channel = supabase
      .channel('order_tracking')
      .on(
        'postgres_changes',
        {
          event: 'UPDATE',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user?.id}`,
        },
        () => fetchOrders() // يعيد تحميل البيانات فور حدوث أي تحديث (زي موقع المندوب)
      )
      .subscribe()

    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id])

  const cancelOrder = async (orderId: string) => {
    if (!confirm('هل أنت متأكد من إلغاء الطلب؟')) return
    const { error } = await supabase
      .from('orders')
      .update({ status: 'cancelled' })
      .eq('id', orderId)

    if (!error) {
      setOrders((prev) => prev.filter((o) => o.id !== orderId))
      alert('تم الإلغاء ✅')
    }
  }

  if (loading)
    return (
      <div className="p-10 text-center font-bold">جاري تحميل طلباتك... ✨</div>
    )

  return (
    <div className="p-6 max-w-4xl mx-auto text-right mb-20" dir="rtl">
      <header className="mb-10 border-b pb-6 flex justify-between items-center">
        <h1 className="text-3xl font-black text-gray-800 tracking-tighter">
          طلباتي من الريف 📦
        </h1>
        <div className="bg-green-50 text-green-700 px-4 py-2 rounded-2xl font-bold text-sm">
          {orders.length} طلب نشط
        </div>
      </header>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-gray-50 rounded-[3rem] border-2 border-dashed border-gray-200">
          <p className="text-gray-400 font-bold">
            سلة طلباتك فارغة.. ابدأ بالتسوق الآن 🌾
          </p>
        </div>
      ) : (
        <div className="space-y-8">
          {orders.map((order) => {
            // مسافة المندوب عن المشتري
            const distToCustomer = calculateLiveDistance(
              order.customer_lat,
              order.customer_lng,
              order.driver_lat,
              order.driver_lng
            )

            // مسافة المندوب عن البائع
            const distToSeller = calculateLiveDistance(
              order.seller_lat,
              order.seller_lng,
              order.driver_lat,
              order.driver_lng
            )

            return (
              <div
                key={order.id}
                className={`bg-white border-2 rounded-[2.5rem] shadow-sm overflow-hidden transition-all ${order.status === 'in_progress' ? 'border-blue-200 ring-4 ring-blue-50' : 'border-gray-50'}`}
              >
                <div className="p-6 md:p-8">
                  {/* بيانات المنتج */}
                  <div className="flex justify-between items-start mb-6">
                    <div className="flex gap-5">
                      <img
                        src={order.product?.image_url}
                        className="w-20 h-20 rounded-3xl object-cover border-2 border-orange-50"
                      />
                      <div>
                        <h3 className="font-black text-xl text-gray-800">
                          {order.product?.name}
                        </h3>
                        <p className="text-sm font-bold text-gray-400">
                          الكمية: {order.quantity} • {order.total} ج.م
                        </p>
                        <div className="mt-2 inline-block px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-bold text-gray-500 uppercase">
                          ID: #{order.id.slice(0, 8)}
                        </div>
                      </div>
                    </div>

                    <div className="text-left">
                      <span
                        className={`px-4 py-2 rounded-2xl text-xs font-black ${order.status === 'pending' ? 'bg-orange-100 text-orange-600' : 'bg-green-600 text-white'}`}
                      >
                        {order.status === 'pending'
                          ? '⏳ قيد الانتظار'
                          : '🚚 جاري التوصيل'}
                      </span>
                    </div>
                  </div>

                  {/* تتبع المندوب اللحظي */}
                  {order.driver_id ? (
                    <div className="bg-blue-50 rounded-3xl p-6 border border-blue-100">
                      <div className="flex justify-between items-center mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg animate-pulse">
                            🚚
                          </div>
                          <div>
                            <p className="text-xs font-bold text-blue-400 uppercase">
                              متابعة المندوب
                            </p>
                            <p className="font-black text-blue-900 text-lg leading-tight">
                              المندوب في الطريق
                            </p>
                          </div>
                        </div>
                        <a
                          href={`tel:${order.driver_phone || ''}`}
                          className="bg-white text-blue-600 p-3 rounded-2xl shadow-sm border border-blue-100 font-bold text-sm hover:bg-blue-600 hover:text-white transition-all"
                        >
                          اتصال 📞
                        </a>
                      </div>

                      {/* إحصائيات المسافات */}
                      <div className="grid grid-cols-2 gap-3 mt-4 border-t border-blue-100 pt-4">
                        <div className="text-center bg-white/50 p-2 rounded-xl border border-blue-100">
                          <p className="text-[10px] text-gray-500 font-bold mb-1">
                            يبعد عنك
                          </p>
                          <p className="text-blue-700 font-black">
                            {distToCustomer
                              ? `${distToCustomer} كم`
                              : 'جاري التحديد'}
                          </p>
                        </div>
                        <div className="text-center bg-white/50 p-2 rounded-xl border border-blue-100">
                          <p className="text-[10px] text-gray-500 font-bold mb-1">
                            يبعد عن البائع
                          </p>
                          <p className="text-blue-700 font-black">
                            {distToSeller ? `${distToSeller} كم` : 'وصل للبائع'}
                          </p>
                        </div>
                      </div>
                    </div>
                  ) : (
                    <div className="bg-orange-50 rounded-3xl p-6 border border-orange-100 text-center">
                      <p className="text-orange-600 font-bold animate-pulse">
                        🔎 جاري البحث عن أقرب مندوب ريفي...
                      </p>
                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="mt-4 text-xs text-red-500 font-bold underline hover:text-red-700"
                      >
                        إلغاء الطلب ×
                      </button>
                    </div>
                  )}

                  <div className="mt-6 flex justify-between items-center px-4">
                    <p className="text-xs font-bold text-gray-400">
                      للاستفسار من البائع:
                    </p>
                    <a
                      href={`tel:${order.seller_phone}`}
                      className="text-xs font-black text-green-600 hover:underline"
                    >
                      اتصال بالبائع 📞
                    </a>
                  </div>
                </div>

                <div className="bg-gray-50 px-8 py-3 flex justify-between items-center border-t border-gray-100">
                  <div className="flex gap-2 items-center">
                    <div
                      className={`w-2 h-2 rounded-full ${order.status === 'pending' ? 'bg-orange-500 animate-ping' : 'bg-green-500'}`}
                    ></div>
                    <span className="text-[10px] font-black text-gray-500 uppercase">
                      {order.status === 'pending'
                        ? 'جاري البحث'
                        : 'تم قبول الطلب'}
                    </span>
                  </div>
                  <span className="text-[10px] font-bold text-gray-400">
                    {new Date(order.created_at).toLocaleString('ar-EG')}
                  </span>
                </div>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
