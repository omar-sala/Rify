'use client'

import { useState, useEffect, useRef } from 'react'
import { useRouter } from 'next/navigation'
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
  created_at: string
}

export default function SellerDashboard() {
  const { user } = useAuth()
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // فورم لإضافة منتج
  const [name, setName] = useState('')
  const [description, setDescription] = useState('')
  const [price, setPrice] = useState<number | string>('') // تعديل هنا لقبول نص فارغ
  const [stock, setStock] = useState<number | string>('') // تعديل هنا لقبol نص فارغ
  const [imageFile, setImageFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState('')

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

  // معالجة اختيار الصورة
  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const file = e.target.files[0]
      setImageFile(file)
      setPreviewUrl(URL.createObjectURL(file)) // عرض صورة مؤقتة للمعاينة
    }
  }

  const handleAddProduct = async () => {
    if (!name || !price || !imageFile)
      return alert('برجاء إكمال البيانات واختيار صورة')

    setLoading(true)
    try {
      // 1. رفع الصورة إلى Supabase Storage
      const fileExt = imageFile.name.split('.').pop()
      const fileName = `${Math.random()}.${fileExt}`
      const filePath = `${user?.id}/${fileName}`

      const { error: uploadError } = await supabase.storage
        .from('product-images')
        .upload(filePath, imageFile)

      if (uploadError) throw uploadError

      // 2. الحصول على رابط الصورة العام
      const {
        data: { publicUrl },
      } = supabase.storage.from('product-images').getPublicUrl(filePath)

      // 3. إضافة المنتج لقاعدة البيانات
      const { error: insertError } = await supabase.from('products').insert({
        name,
        description,
        price: Number(price),
        stock: Number(stock),
        image_url: publicUrl,
        seller_id: user?.id,
      })

      if (insertError) throw insertError

      alert('تم إضافة المنتج بنجاح! 🌿')
      // تصفير الفورم
      setName('')
      setDescription('')
      setPrice('')
      setStock('')
      setImageFile(null)
      setPreviewUrl('')
      fetchProducts()
    } catch (err: any) {
      alert('خطأ: ' + err.message)
    } finally {
      setLoading(false)
    }
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
              <label className="block mb-1 text-sm font-medium">الاسم</label>
              <input
                type="text"
                placeholder="مثلاً: طماطم أورجانيك"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="border p-2.5 rounded-xl w-full focus:ring-2 focus:ring-green-500 outline-none"
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
                  placeholder="0"
                  value={price === 0 ? '' : price} // حل مشكلة الـ 0
                  onChange={(e) => setPrice(e.target.value)}
                  className="border p-2.5 rounded-xl w-full focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
              <div>
                <label className="block mb-1 text-sm font-medium">الكمية</label>
                <input
                  type="number"
                  placeholder="0"
                  value={stock === 0 ? '' : stock} // حل مشكلة الـ 0
                  onChange={(e) => setStock(e.target.value)}
                  className="border p-2.5 rounded-xl w-full focus:ring-2 focus:ring-green-500 outline-none"
                />
              </div>
            </div>

            {/* جزء رفع الصورة */}
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
                    اضغط لرفع صورة أو التصوير
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
          {loading ? 'جاري رفع البيانات...' : 'اضافة المنتج'}
        </button>
      </div>

      <h2 className="text-xl font-bold mb-4 text-gray-700">منتجاتك الحالية</h2>
      <div className="grid grid-cols-2 md:grid-cols-3 gap-4">
        {products.map((p) => (
          <div
            key={p.id}
            className="border rounded-2xl overflow-hidden bg-white shadow-sm relative group"
          >
            <img
              src={p.image_url}
              alt={p.name}
              className="h-40 w-full object-cover"
            />
            <div className="p-3">
              <h3 className="font-bold text-gray-800">{p.name}</h3>
              <div className="flex justify-between items-center mt-2 text-sm">
                <span className="text-green-700 font-bold">{p.price} ج.م</span>
                <span className="text-gray-500">مخزون: {p.stock}</span>
              </div>
            </div>
            <button
              onClick={() => handleDelete(p.id)}
              className="absolute top-2 left-2 bg-white/90 p-1.5 rounded-full text-red-600 opacity-0 group-hover:opacity-100 transition-opacity shadow-sm"
            >
              🗑️
            </button>
          </div>
        ))}
      </div>
    </div>
  )
}
