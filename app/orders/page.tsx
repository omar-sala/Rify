'use client'

import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuth } from '../context/AuthContext'

import {
  FaBoxOpen,
  FaTruck,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaClock,
  FaCheckCircle,
  FaTimesCircle,
} from 'react-icons/fa'

export default function OrdersPage() {
  const { user } = useAuth()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  // حساب المسافة
  const calculateLiveDistance = (
    lat1: any,
    lon1: any,
    lat2: any,
    lon2: any
  ) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return null

    try {
      const R = 6371
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
    } catch {
      return null
    }
  }

  useEffect(() => {
    if (!user) return

    const init = async () => {
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

    init()
  }, [user?.id])

  useEffect(() => {
    if (!user) return

    const channel = supabase
      .channel('order_tracking')
      .on(
        'postgres_changes',
        {
          event: '*',
          schema: 'public',
          table: 'orders',
          filter: `user_id=eq.${user.id}`,
        },
        (payload) => {
          setOrders((prev) => {
            // 🔥 الحل المهم: نعرف النوع بشكل آمن
            const updated = payload.new as any
            const old = payload.old as any

            if (payload.eventType === 'INSERT') {
              return [updated, ...prev]
            }

            if (payload.eventType === 'UPDATE') {
              return prev.map((order) =>
                order?.id === updated?.id ? { ...order, ...updated } : order
              )
            }

            if (payload.eventType === 'DELETE') {
              return prev.filter((o) => o?.id !== old?.id)
            }

            return prev
          })
        }
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
    <div
      className="p-4 md:p-6 max-w-4xl mx-auto text-right mb-20 mt-24"
      dir="rtl"
    >
      {/* Header */}
      <header className="mb-10 border-b pb-6 flex flex-col md:flex-row gap-4 justify-between md:items-center">
        <h1 className="text-2xl md:text-3xl font-black text-gray-800 tracking-tighter flex items-center gap-3">
          <FaBoxOpen className="text-green-600" />
          طلباتي من الريف
        </h1>

        <div className="bg-green-50 text-green-700 px-4 py-2 rounded-2xl font-bold text-sm w-fit">
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
            const distToCustomer = calculateLiveDistance(
              order.customer_lat,
              order.customer_lng,
              order.driver_lat,
              order.driver_lng
            )

            const distToSeller = calculateLiveDistance(
              order.seller_lat,
              order.seller_lng,
              order.driver_lat,
              order.driver_lng
            )

            return (
              <div
                key={order.id}
                className={`bg-white border-2 rounded-[2.5rem] shadow-sm overflow-hidden transition-all duration-300 hover:shadow-xl ${
                  order.status === 'in_progress'
                    ? 'border-blue-200 ring-4 ring-blue-50'
                    : 'border-gray-50'
                }`}
              >
                <div className="p-4 md:p-8">
                  {/* بيانات المنتج */}
                  <div className="flex flex-col md:flex-row justify-between gap-5 items-start mb-6">
                    <div className="flex gap-4">
                      <img
                        src={order.product?.image_url}
                        className="w-20 h-20 rounded-3xl object-cover border-2 border-orange-50"
                      />

                      <div>
                        <h3 className="font-black text-xl text-gray-800 flex items-center gap-2">
                          <FaBoxOpen className="text-orange-500" />
                          {order.product?.name}
                        </h3>

                        <p className="text-sm font-bold text-gray-400 mt-1">
                          الكمية: {order.quantity} • {order.total} ج.م
                        </p>

                        <div className="mt-2 inline-block px-3 py-1 bg-gray-100 rounded-lg text-[10px] font-bold text-gray-500 uppercase">
                          ID: #{order.id.slice(0, 8)}
                        </div>
                      </div>
                    </div>

                    <div>
                      <span
                        className={`px-4 py-2 rounded-2xl text-xs font-black flex items-center gap-2 ${
                          order.status === 'pending'
                            ? 'bg-orange-100 text-orange-600'
                            : 'bg-green-600 text-white'
                        }`}
                      >
                        {order.status === 'pending' ? (
                          <>
                            <FaClock />
                            قيد الانتظار
                          </>
                        ) : (
                          <>
                            <FaTruck />
                            جاري التوصيل
                          </>
                        )}
                      </span>
                    </div>
                  </div>

                  {/* تتبع المندوب */}
                  {order.driver_id ? (
                    <div className="bg-blue-50 rounded-3xl p-4 md:p-6 border border-blue-100">
                      <div className="flex flex-col md:flex-row justify-between gap-4 md:items-center mb-4">
                        <div className="flex items-center gap-3">
                          <div className="w-12 h-12 bg-blue-600 rounded-full flex items-center justify-center text-white shadow-lg animate-pulse">
                            <FaTruck />
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
                          className="bg-white text-blue-600 px-4 py-3 rounded-2xl shadow-sm border border-blue-100 font-bold text-sm hover:bg-blue-600 hover:text-white transition-all flex items-center justify-center gap-2"
                        >
                          <FaPhoneAlt />
                          اتصال بالمندوب
                        </a>
                      </div>

                      {/* الخريطة */}
                      {order.driver_lat && order.driver_lng && (
                        <div className="mb-4 overflow-hidden rounded-2xl">
                          <iframe
                            width="100%"
                            height="250"
                            style={{ border: 0 }}
                            loading="lazy"
                            allowFullScreen
                            referrerPolicy="no-referrer-when-downgrade"
                            src={`https://www.google.com/maps?q=${order.driver_lat},${order.driver_lng}&z=15&output=embed`}
                          />
                        </div>
                      )}

                      {/* المسافات */}
                      <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 mt-4 border-t border-blue-100 pt-4">
                        <div className="text-center bg-white/50 p-3 rounded-xl border border-blue-100">
                          <p className="text-[10px] text-gray-500 font-bold mb-1 flex items-center justify-center gap-1">
                            <FaMapMarkerAlt />
                            يبعد عنك
                          </p>

                          <p className="text-blue-700 font-black">
                            {distToCustomer
                              ? `${distToCustomer} كم`
                              : 'جاري التحديد'}
                          </p>
                        </div>

                        <div className="text-center bg-white/50 p-3 rounded-xl border border-blue-100">
                          <p className="text-[10px] text-gray-500 font-bold mb-1 flex items-center justify-center gap-1">
                            <FaMapMarkerAlt />
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
                      <p className="text-orange-600 font-bold animate-pulse flex items-center justify-center gap-2">
                        <FaTruck />
                        جاري البحث عن أقرب مندوب ريفي...
                      </p>

                      <button
                        onClick={() => cancelOrder(order.id)}
                        className="mt-4 text-xs text-red-500 font-bold underline hover:text-red-700 transition flex items-center justify-center gap-1 mx-auto"
                      >
                        <FaTimesCircle />
                        إلغاء الطلب
                      </button>
                    </div>
                  )}

                  {/* التواصل مع البائع */}
                  <div className="mt-6 flex flex-col sm:flex-row justify-between gap-3 sm:items-center px-2 md:px-4">
                    <p className="text-xs font-bold text-gray-400">
                      للاستفسار من البائع:
                    </p>

                    <a
                      href={`tel:${order.seller_phone}`}
                      className="text-sm font-black text-green-600 hover:text-green-700 transition flex items-center gap-2"
                    >
                      <FaPhoneAlt />
                      اتصال بالبائع
                    </a>
                  </div>
                </div>

                {/* Footer */}
                <div className="bg-gray-50 px-4 md:px-8 py-3 flex flex-col sm:flex-row gap-3 justify-between sm:items-center border-t border-gray-100">
                  <div className="flex gap-2 items-center">
                    <div
                      className={`w-2 h-2 rounded-full ${
                        order.status === 'pending'
                          ? 'bg-orange-500 animate-ping'
                          : 'bg-green-500'
                      }`}
                    ></div>

                    <span className="text-[10px] font-black text-gray-500 uppercase flex items-center gap-1">
                      {order.status === 'pending' ? (
                        <>
                          <FaClock />
                          جاري البحث
                        </>
                      ) : (
                        <>
                          <FaCheckCircle />
                          تم قبول الطلب
                        </>
                      )}
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
