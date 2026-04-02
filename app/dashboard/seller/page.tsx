'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import supabase from '@/lib/supabase'

interface Product {
  id: number
  name: string
  description: string
  price: number
  stock: number
  image_url: string
  seller_id: string
  seller_phone: string
  lat: number
  lng: number
  created_at: string
}

export default function SellerDashboard() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // الحقول الأساسية
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState<number | string>('')
  const [stock, setStock] = useState<number | string>('')

  // الحقول الجديدة (إجباري)
  const [sellerPhone, setSellerPhone] = useState('')
  const [location, setLocation] = useState<{ lat: number; lng: number } | null>(
    null
  )

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')
  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // 1. جلب موقع التاجر عند فتح الصفحة
  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          setLocation({
            lat: position.coords.latitude,
            lng: position.coords.longitude,
          })
        },
        () =>
          alert(
            'برجاء تفعيل الموقع (GPS) لتتمكن من إضافة المنتجات بدقة للمندوبين'
          )
      )
    }
  }, [])

  const fetchProducts = async () => {
    if (!user) return
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('seller_id', user.id)
      .order('created_at', { ascending: false })
    if (!error) setProducts(data)
  }

  useEffect(() => {
    fetchProducts()
  }, [user])

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  const handleAddProduct = async () => {
    // التحقق من البيانات الجديدة
    if (!name || !price || !imageFile || !sellerPhone)
      return alert('برجاء إكمال البيانات (الاسم، السعر، الصورة، ورقم التليفون)')

    if (!location)
      return alert('جاري تحديد موقعك.. برجاء الانتظار ثانية أو تفعيل الـ GPS')

    setLoading(true)
    try {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${user?.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile)

      if (uploadError) throw uploadError

      const {
        data: { publicUrl },
      } = supabase.storage.from('product-images').getPublicUrl(filePath)

      // إضافة المنتج مع التليفون واللوكيشن
      const { error: insertError } = await supabase.from('products').insert({
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        image_url: publicUrl,
        seller_id: user?.id,
        seller_phone: sellerPhone, // حفظ الرقم في المنتج
        lat: location.lat, // حفظ خط العرض
        lng: location.lng, // حفظ خط الطول
      })

      if (insertError) throw insertError

      alert('تم إضافة المنتج بنجاح! 🌿')
      setName('')
      setDescription('')
      setPrice('')
      setStock('')
      setSellerPhone('')
      setImageFile(null)
      setPreviewUrl('')
      fetchProducts()
    } catch (err: any) {
      alert('خطأ: ' + err.message)
    } finally {
      setLoading(false)
    }
  }

  const handleUpdate = async (id: number, updatedData: any) => {
    const { error } = await supabase
      .from('products')
      .update(updatedData)
      .eq('id', id)

    if (error) console.log(error)
    else alert('تم التعديل ✅')
  }

  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return
    const { error } = await supabase.from('products').delete().eq('id', id)
    if (!error) fetchProducts()
  }

  return (
    <div className="p-6 max-w-4xl mx-auto mt-20" dir="rtl">
      <h1 className="text-2xl font-bold mb-6 text-green-800">
        لوحة تحكم التاجر
      </h1>

      <div className="mb-8 p-6 border rounded-2xl shadow-sm bg-white border-green-100">
        <h2 className="font-semibold mb-6 text-lg border-b pb-2">
          إضافة منتج جديد للريف
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="space-y-4">
            <div>
              <label className="block mb-1 text-sm font-medium">
                اسم المنتج
              </label>
              <input
                type="text"
                placeholder="طماطم أورجانيك"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2.5 rounded-xl w-full focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            {/* حقل رقم التليفون الجديد */}
            <div>
              <label className="block mb-1 text-sm font-medium text-orange-600 font-bold">
                رقم التواصل (واتساب/اتصال) *
              </label>
              <input
                type="text"
                placeholder="010XXXXXXXX"
                value={sellerPhone}
                onChange={(e) => setSellerPhone(e.target.value)}
                className="border-2 border-orange-100 p-2.5 rounded-xl w-full focus:ring-2 focus:ring-orange-500 outline-none font-mono"
              />
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">الوصف</label>
              <textarea
                placeholder="وصف بسيط للمنتج..."
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border p-2.5 rounded-xl w-full h-24 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-2">
              <div>
                <label className="block mb-1 text-sm font-medium">
                  السعر (جنيه)
                </label>
                <input
                  type="number"
                  value={price}
                  onChange={(e) => setPrice(e.target.value)}
                  className="border p-2.5 rounded-xl w-full focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">الكمية</label>
                <input
                  type="number"
                  value={stock}
                  onChange={(e) => setStock(e.target.value)}
                  className="border p-2.5 rounded-xl w-full focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>

            <div>
              <label className="block mb-1 text-sm font-medium">
                صورة المنتج
              </label>
              <div
                onClick={() => fileInputRef.current?.click()}
                className="border-2 border-dashed border-green-200 rounded-xl p-4 text-center cursor-pointer hover:bg-green-50 transition"
              >
                {previewUrl ? (
                  <img
                    src={previewUrl}
                    alt="معاينة"
                    className="h-32 mx-auto rounded-lg object-cover"
                  />
                ) : (
                  <div className="py-4 text-gray-400">
                    <span className="block text-2xl">📸</span>
                    اضغط لرفع صورة
                  </div>
                )}
                <input
                  type="file"
                  ref={fileInputRef}
                  hidden
                  accept="image/*"
                  onChange={handleFileChange}
                />
              </div>
            </div>

            {/* عرض حالة الموقع */}
            <div
              className={`text-xs p-2 rounded-lg ${location ? 'bg-green-50 text-green-700' : 'bg-red-50 text-red-600'}`}
            >
              {location
                ? '📍 تم تحديد موقعك التلقائي بنجاح'
                : '📍 جاري تحديد موقعك...'}
            </div>
          </div>
        </div>

        <button
          onClick={handleAddProduct}
          disabled={loading}
          className={`mt-6 w-full py-3 rounded-xl font-bold text-white transition-all ${
            loading
              ? 'bg-gray-400'
              : 'bg-green-600 hover:bg-green-700 active:scale-95'
          }`}
        >
          {loading ? 'جاري رفع البيانات...' : 'اضافة المنتج للريف'}
        </button>
      </div>

      {/* عرض المنتجات الحالية */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800">منتجاتك الحالية</h2>
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group relative border"
          >
            <div className="overflow-hidden relative">
              <img
                src={p.image_url}
                alt={p.name}
                className="h-48 w-full object-cover"
              />
            </div>
            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">
                {p.name}
              </h3>
              <p className="text-orange-600 text-xs font-bold font-mono">
                {p.seller_phone}
              </p>
              <div className="flex justify-between items-center pt-2">
                <span className="text-green-600 font-bold text-lg">
                  {p.price} ج.م
                </span>
              </div>
            </div>
            {/* أزرار التعديل والحذف */}
            <button
              onClick={() => setEditingProduct(p)}
              className="absolute top-3 right-3 bg-white p-2 rounded-full text-blue-500 shadow-md"
            >
              ✏️
            </button>
            <button
              onClick={() => handleDelete(p.id)}
              className="absolute top-3 left-3 bg-white p-2 rounded-full text-red-500 shadow-md"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>

      {/* مودال التعديل (نفس المنطق مع إضافة الحقول الجديدة لو حبيت) */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[350px] space-y-4 shadow-xl">
            <h2 className="text-xl font-bold">تعديل المنتج</h2>
            <input
              type="text"
              value={editingProduct.name}
              onChange={(e) =>
                setEditingProduct({ ...editingProduct, name: e.target.value })
              }
              className="w-full border p-2 rounded-lg"
              placeholder="الاسم"
            />
            <input
              type="text"
              value={editingProduct.seller_phone}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  seller_phone: e.target.value,
                })
              }
              className="w-full border p-2 rounded-lg"
              placeholder="رقم التليفون"
            />
            <div className="flex gap-2">
              <button
                onClick={() => setEditingProduct(null)}
                className="w-full py-2 rounded-lg bg-gray-200"
              >
                إلغاء
              </button>
              <button
                onClick={async () => {
                  await handleUpdate(editingProduct.id, editingProduct)
                  setEditingProduct(null)
                  fetchProducts()
                }}
                className="w-full py-2 rounded-lg bg-green-600 text-white"
              >
                حفظ
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
