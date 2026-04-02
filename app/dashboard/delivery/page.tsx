'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import { useAuth } from '../../context/AuthContext'
import supabase from '@/lib/supabase'

export default function DeliveryDashboard() {
  const { user, loading } = useAuth()
  const router = useRouter()
  const [orders, setOrders] = useState<any[]>([])
  const [actionLoading, setActionLoading] = useState<string | null>(null)
  const [myLocation, setMyLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)

  // 1. دالة حساب المسافة (Haversine)
  const calculateDistance = (
    lat1: number,
    lon1: number,
    lat2: number,
    lon2: number
  ) => {
    if (!lat1 || !lon1 || !lat2 || !lon2) return '..'
    const R = 6371
    const dLat = ((lat2 - lat1) * Math.PI) / 180
    const dLon = ((lon2 - lon1) * Math.PI) / 180
    const a =
      Math.sin(dLat / 2) * Math.sin(dLat / 2) +
      Math.cos((lat1 * Math.PI) / 180) *
        Math.cos((lat2 * Math.PI) / 180) *
        Math.sin(dLon / 2) *
        Math.sin(dLon / 2)
    const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1 - a))
    return (R * c).toFixed(1)
  }

  // 2. تحديث موقع المندوب وتتبع حركته
  useEffect(() => {
    if (!user || user.role !== 'delivery') return

    const watchId = navigator.geolocation.watchPosition(
      async (pos) => {
        const { latitude, longitude } = pos.coords
        setMyLocation({ lat: latitude, lng: longitude })

        // تحديث موقع المندوب في الأوردرات اللي "قيد التنفيذ" معاه حالياً
        await supabase
          .from('orders')
          .update({ driver_lat: latitude, driver_lng: longitude })
          .eq('driver_id', user.id)
          .eq('status', 'in_progress')
      },
      (err) => console.error('GPS Error:', err),
      { enableHighAccuracy: true }
    )

    return () => navigator.geolocation.clearWatch(watchId)
  }, [user?.id])

  const fetchOrders = async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('orders')
      .select(
        `
        *,
        product:products!fk_product (
          name, price, image_url
        )
      `
      )
      .or(`and(status.eq.pending,driver_id.is.null),driver_id.eq.${user.id}`)
      .order('created_at', { ascending: false })

    if (!error) setOrders(data || [])
  }

  useEffect(() => {
    if (loading) return
    if (!user || user.role !== 'delivery') router.replace('/')
    fetchOrders()

    const channel = supabase
      .channel('delivery_updates')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        () => fetchOrders()
      )
      .subscribe()
    return () => {
      supabase.removeChannel(channel)
    }
  }, [user?.id, loading])

  const handleAccept = async (orderId: string) => {
    setActionLoading(orderId)
    const { error } = await supabase
      .from('orders')
      .update({
        driver_id: user?.id,
        status: 'in_progress',
        driver_response: 'accepted',
      })
      .eq('id', orderId)
      .is('driver_id', null)

    if (error) alert('عذراً، الطلب لم يعد متاحاً')
    else fetchOrders()
    setActionLoading(null)
  }

  if (loading || !user)
    return <div className="p-10 text-center font-bold">جاري التحميل... 🚚</div>

  return (
    <div className="p-6 max-w-6xl mx-auto text-right" dir="rtl">
      <header className="mb-8 flex justify-between items-center bg-white p-6 rounded-3xl shadow-sm border-r-8 border-green-600">
        <div>
          <h1 className="text-3xl font-black text-gray-900">لوحة المندوب 🚀</h1>
          <p className="text-gray-500 font-bold">
            مرحباً كابتن {user.name}، إليك الطلبات القريبة منك
          </p>
        </div>
      </header>

      <div className="grid gap-6">
        {orders.map((order) => {
          const distToSeller = calculateDistance(
            myLocation?.lat!,
            myLocation?.lng!,
            order.seller_lat,
            order.seller_lng
          )
          const distToCustomer = calculateDistance(
            order.seller_lat,
            order.seller_lng,
            order.customer_lat,
            order.customer_lng
          )

          return (
            <div
              key={order.id}
              className={`bg-white border-2 rounded-[2.5rem] overflow-hidden shadow-sm ${order.driver_id === user.id ? 'border-green-500 ring-4 ring-green-50' : 'border-gray-100'}`}
            >
              <div className="p-6 md:p-8 grid md:grid-cols-3 gap-8">
                {/* المنتج والبيان المالي */}
                <div className="flex gap-4">
                  <img
                    src={order.product?.image_url}
                    className="w-24 h-24 rounded-3xl object-cover border"
                  />
                  <div>
                    <h3 className="font-black text-xl text-gray-800">
                      {order.product?.name}
                    </h3>
                    <p className="text-sm font-bold text-orange-600">
                      الكمية: {order.quantity}
                    </p>
                    <p className="text-2xl font-black text-green-700 mt-1">
                      {order.total} ج.م
                    </p>
                  </div>
                </div>

                {/* خريطة التواصل والمسافات */}
                <div className="grid grid-cols-1 gap-3 border-r-2 border-dashed pr-6">
                  {/* البائع */}
                  <div className="bg-orange-50 p-3 rounded-2xl border border-orange-100 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-black text-orange-600">
                        📍 من البائع (نقطة الاستلام)
                      </p>
                      <p className="font-bold text-gray-700 text-sm">
                        المسافة منك: {distToSeller} كم
                      </p>
                    </div>
                    <a
                      href={`tel:${order.seller_phone}`}
                      className="bg-orange-500 text-white p-2 rounded-full shadow-lg"
                    >
                      📞
                    </a>
                  </div>

                  {/* المشتري */}
                  <div className="bg-blue-50 p-3 rounded-2xl border border-blue-100 flex justify-between items-center">
                    <div>
                      <p className="text-[10px] font-black text-blue-600">
                        🏠 إلى المشتري (نقطة التسليم)
                      </p>
                      <p className="font-bold text-gray-700 text-sm">
                        المسافة من البائع: {distToCustomer} كم
                      </p>
                    </div>
                    <a
                      href={`tel:${order.customer_phone}`}
                      className="bg-blue-600 text-white p-2 rounded-full shadow-lg"
                    >
                      📞
                    </a>
                  </div>
                </div>

                {/* حالة الطلب */}
                <div className="flex flex-col justify-center">
                  {order.driver_id === null ? (
                    <button
                      onClick={() => handleAccept(order.id)}
                      disabled={actionLoading === order.id}
                      className="w-full bg-black text-white py-5 rounded-2xl font-black hover:bg-green-600 transition-all shadow-xl active:scale-95"
                    >
                      {actionLoading === order.id
                        ? 'جاري القبول...'
                        : 'قبول الطلب وتوصيله'}
                    </button>
                  ) : (
                    <div className="space-y-3">
                      <div className="bg-green-600 text-white py-3 rounded-2xl text-center font-black animate-pulse">
                        الطلب معك الآن 🚛
                      </div>
                      <p className="text-center text-xs text-gray-400">
                        تواصل مع البائع والمشتري لتنسيق الموعد
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
