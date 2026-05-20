'use client'

import { useState, useEffect, useRef } from 'react'
import { useAuth } from '../../context/AuthContext'
import supabase from '@/lib/supabase'

import {
  FaEdit,
  FaTrash,
  FaPhoneAlt,
  FaMapMarkerAlt,
  FaImage,
  FaBoxOpen,
} from 'react-icons/fa'

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

  // الحقول الجديدة
  const [sellerPhone, setSellerPhone] = useState('')

  const [location, setLocation] = useState<{
    lat: number
    lng: number
  } | null>(null)

  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')

  const [editingProduct, setEditingProduct] = useState<Product | null>(null)

  // جلب الموقع
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

  // جلب المنتجات
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

  // اختيار الصورة
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]

      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file))
    }
  }

  // إضافة المنتج
  const handleAddProduct = async () => {
    if (!name || !price || !imageFile || !sellerPhone) {
      return alert('برجاء إكمال البيانات (الاسم، السعر، الصورة، ورقم التليفون)')
    }

    if (!location) {
      return alert('جاري تحديد موقعك.. برجاء الانتظار ثانية أو تفعيل الـ GPS')
    }

    setLoading(true)

    try {
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${user?.id}/${fileName}`

      // رفع الصورة
      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile)

      if (uploadError) throw uploadError

      // جلب الرابط
      const {
        data: { publicUrl },
      } = supabase.storage.from('product-images').getPublicUrl(filePath)

      // إضافة المنتج
      const { error: insertError } = await supabase.from('products').insert({
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        image_url: publicUrl,
        seller_id: user?.id,
        seller_phone: sellerPhone,
        lat: location.lat,
        lng: location.lng,
      })

      if (insertError) throw insertError

      alert('تم إضافة المنتج بنجاح 🌿')

      // reset
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

  // تعديل المنتج
  const handleUpdate = async (id: number, updatedData: any) => {
    const { error } = await supabase
      .from('products')
      .update(updatedData)
      .eq('id', id)

    if (error) {
      console.log(error)
    } else {
      alert('تم التعديل ✅')
    }
  }

  // حذف المنتج
  const handleDelete = async (id: number) => {
    if (!confirm('هل أنت متأكد من حذف هذا المنتج؟')) return

    const { error } = await supabase.from('products').delete().eq('id', id)

    if (!error) fetchProducts()
  }

  return (
    <div className="p-6 max-w-4xl mx-auto mt-24" dir="rtl">
      {/* العنوان */}
      <h1 className="text-2xl font-bold mb-6 text-green-800 flex items-center gap-2">
        <FaBoxOpen className="text-green-600" />
        لوحة تحكم التاجر
      </h1>

      {/* الفورم */}
      <div className="mb-8 p-6 border rounded-2xl shadow-sm bg-white border-green-100">
        <h2 className="font-semibold mb-6 text-lg border-b pb-2">
          إضافة منتج جديد للريف
        </h2>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* العمود الأول */}
          <div className="space-y-4">
            {/* اسم البائع */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                اسم البائع
              </label>

              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2.5 rounded-xl w-full focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>

            {/* رقم التليفون */}
            <div>
              <label className="mb-1 text-sm font-medium text-orange-600 font-bold flex items-center gap-2">
                <FaPhoneAlt />
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

            {/* الوصف */}
            <div>
              <label className="block mb-1 text-sm font-medium">
                اسم المنتج
              </label>

              <textarea
                placeholder="سمنه او فطير او قشطه"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                className="border p-2.5 rounded-xl w-full h-24 focus:ring-2 focus:ring-green-500 outline-none"
              />
            </div>
          </div>

          {/* العمود الثاني */}
          <div className="space-y-4">
            {/* السعر والكمية */}
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

            {/* رفع الصورة */}
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
                    <FaImage className="text-3xl mx-auto mb-2 text-green-500" />
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

            {/* الموقع */}
            <div
              className={`text-xs p-2 rounded-lg flex items-center gap-2 ${
                location
                  ? 'bg-green-50 text-green-700'
                  : 'bg-red-50 text-red-600'
              }`}
            >
              <FaMapMarkerAlt />

              <span>
                {location
                  ? 'تم تحديد موقعك التلقائي بنجاح'
                  : 'جاري تحديد موقعك...'}
              </span>
            </div>
          </div>
        </div>

        {/* زر الإضافة */}
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

      {/* المنتجات */}
      <h2 className="text-2xl font-bold mb-6 text-gray-800">منتجاتك الحالية</h2>

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {products.map((p) => (
          <div
            key={p.id}
            className="bg-white rounded-2xl overflow-hidden shadow-md hover:shadow-xl transition-all duration-300 group relative border"
          >
            {/* الصورة */}
            <div className="overflow-hidden relative">
              <img
                src={p.image_url}
                alt={p.name}
                className="h-48 w-full object-cover"
              />
            </div>

            {/* المحتوى */}
            <div className="p-4 space-y-2">
              <h3 className="font-semibold text-lg text-gray-800 line-clamp-1">
                {p.name}
              </h3>

              <div className="flex items-center gap-2 text-orange-600 text-xs font-bold font-mono">
                <FaPhoneAlt className="text-[10px]" />
                {p.seller_phone}
              </div>

              <div className="flex justify-between items-center pt-2">
                <span className="text-green-600 font-bold text-lg">
                  {p.price} ج.م
                </span>
              </div>
            </div>

            {/* تعديل */}
            <button
              onClick={() => setEditingProduct(p)}
              className="absolute top-3 right-3 bg-white p-2 rounded-full text-blue-500 shadow-md hover:bg-blue-100 hover:scale-110 transition-all duration-200 cursor-pointer"
            >
              <FaEdit />
            </button>

            {/* حذف */}
            <button
              onClick={() => handleDelete(p.id)}
              className="absolute top-3 left-3 bg-white p-2 rounded-full text-red-500 shadow-md hover:bg-red-100 hover:scale-110 transition-all duration-200 cursor-pointer"
            >
              <FaTrash />
            </button>
          </div>
        ))}
      </div>

      {/* مودال التعديل */}
      {editingProduct && (
        <div className="fixed inset-0 bg-black/40 backdrop-blur-sm flex items-center justify-center z-50">
          <div className="bg-white rounded-2xl p-6 w-[350px] space-y-4 shadow-xl">
            <h2 className="text-xl font-bold">تعديل المنتج</h2>

            <input
              type="text"
              value={editingProduct.name}
              onChange={(e) =>
                setEditingProduct({
                  ...editingProduct,
                  name: e.target.value,
                })
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
                className="w-full py-2 rounded-lg bg-gray-200 hover:bg-gray-300 transition"
              >
                إلغاء
              </button>

              <button
                onClick={async () => {
                  await handleUpdate(editingProduct.id, editingProduct)

                  setEditingProduct(null)

                  fetchProducts()
                }}
                className="w-full py-2 rounded-lg bg-green-600 text-white hover:bg-green-700 transition"
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
