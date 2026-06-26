'use client'

import Image from 'next/image'
import { useEffect, useState, useRef } from 'react'
import { useCart } from './context/CartContext'
import { useSearch } from './context/SearchContext'
import Hero from '../src/components/Hero'
import Features from '../src/components/Features'
import supabase from '@/lib/supabase'

interface Product {
  id: string
  name: string
  description: string
  price: number
  stock: number
  image_url: string
  seller_id: string
}

export default function HomePageContent() {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const { search } = useSearch()

  // مرجع (Ref) للهبوط السلس لشبكة المنتجات عند الضغط على زرار الـ Hero
  const productsSectionRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let isMounted = true

    const fetchProducts = async () => {
      try {
        setLoading(true)

        const { data, error } = await supabase
          .from('products')
          .select('*')
          .order('created_at', { ascending: false })

        if (error) throw error
        if (isMounted && data) setProducts(data)
      } catch (err) {
        console.error('Supabase Error:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    fetchProducts()

    return () => {
      isMounted = false
    }
  }, [])

  const filteredProducts = products.filter(
    (product) =>
      product.name.toLowerCase().includes(search.toLowerCase()) ||
      product.description.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="min-h-screen bg-slate-50/20" dir="rtl">
      {/* 🌾 استدعاء الـ Hero والتحكم في إخفائه وقت البحث والـ Smooth Scroll */}
      {!search && (
        <Hero
          onExploreClick={() =>
            productsSectionRef.current?.scrollIntoView({
              behavior: 'smooth',
              block: 'start',
            })
          }
        />
      )}

      {/* قسم المميزات ثابت في مكانه لجمال التصميم */}
      {!search && <Features />}

      {/* منطقة المنتجات مع Padding ذكي يتغير حسب وجود الـ Hero أو البحث */}
      <div
        ref={productsSectionRef}
        className={`p-6 max-w-7xl mx-auto ${search ? 'pt-28 md:pt-36' : 'pt-14 scroll-mt-24'}`}
      >
        {/* عنوان جانبي منسق يظهر فقط في الحالة العادية لو مش بنبحث */}
        {!search && (
          <div className="mb-8 text-right">
            <h2 className="text-2xl font-black text-slate-800">
              {loading ? 'جاري تجهيز الخيرات...' : 'أحدث خيراتنا الطازجة'}
            </h2>
            <p className="text-slate-400 text-xs sm:text-sm mt-1">
              {loading
                ? 'نحضر لك أفضل المنتجات من حقولنا مباشرة'
                : 'تصفح منتجات مزارعينا المختارة بعناية اليوم'}
            </p>
          </div>
        )}

        {/* 🌿 حالة التحميل (Skeleton Loading) الحين بتظهر منسقة داخل الـ Grid نفسه */}
        {loading && products.length === 0 ? (
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {[...Array(8)].map((_, i) => (
              <div
                key={i}
                className="bg-white rounded-2xl p-4 border border-emerald-100/50 space-y-4 animate-pulse"
              >
                <div className="bg-slate-200 h-56 rounded-xl w-full"></div>
                <div className="h-4 bg-slate-200 rounded w-2/3"></div>
                <div className="h-3 bg-slate-200 rounded w-full"></div>
                <div className="h-3 bg-slate-200 rounded w-5/6"></div>
                <div className="flex justify-between items-center pt-2">
                  <div className="h-4 bg-slate-200 rounded w-1/4"></div>
                  <div className="h-6 bg-slate-200 rounded w-1/3"></div>
                </div>
                <div className="h-10 bg-slate-200 rounded-xl w-full"></div>
              </div>
            ))}
          </div>
        ) : filteredProducts.length === 0 ? (
          /* حالة عدم وجود منتجات */
          <div className="text-center py-32 bg-white rounded-2xl border border-dashed border-emerald-200 p-8 max-w-md mx-auto shadow-sm">
            <div className="text-4xl mb-4">🌾</div>
            <h3 className="text-lg font-bold text-slate-800 mb-2">
              {search ? 'عذراً، لم نجد ما تبحث عنه' : 'المتجر فارغ حالياً'}
            </h3>
            <p className="text-slate-500 text-sm">
              {search
                ? `لا توجد نتائج تطابق بحثك عن "${search}"، جرب كلمات أخرى.`
                : 'تابعنا لاحقاً لرؤية أحدث المنتجات الريفية الطازجة.'}
            </p>
          </div>
        ) : (
          /* شبكة المنتجات الأساسية */
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-8">
            {filteredProducts.map((product) => (
              <ProductCard key={product.id} product={product} />
            ))}
          </div>
        )}
      </div>
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()

  const imageUrl = product.image_url
    ? product.image_url.startsWith('http')
      ? product.image_url
      : supabase.storage.from('product-images').getPublicUrl(product.image_url)
          .data.publicUrl
    : null

  return (
    <div className="group bg-white border border-emerald-100/60 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 flex flex-col h-full text-right">
      <div className="relative w-full h-56 bg-slate-50 overflow-hidden">
        {imageUrl ? (
          <Image
            src={imageUrl || '/placeholder.png'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            loading="eager"
            className="object-cover group-hover:scale-105 transition-transform duration-500"
          />
        ) : (
          <div className="w-full h-full flex items-center justify-center text-slate-300 bg-slate-100">
            🌾 لا توجد صورة
          </div>
        )}

        <div className="absolute top-3 right-3 bg-white/90 backdrop-blur-md px-3 py-1 rounded-full shadow-sm border border-emerald-50">
          <span className="text-emerald-700 font-extrabold text-sm sm:text-base">
            {product.price}{' '}
            <span className="text-xs font-normal text-emerald-600">جنيه</span>
          </span>
        </div>
      </div>

      <div className="p-5 flex flex-col flex-grow">
        <h2 className="font-bold text-slate-800 text-lg mb-1.5 group-hover:text-emerald-700 transition-colors line-clamp-1">
          {product.name}
        </h2>

        <p className="text-slate-500 text-xs sm:text-sm leading-relaxed mb-4 line-clamp-2 min-h-[40px]">
          {product.description}
        </p>

        <div className="mt-auto space-y-3.5">
          <div className="flex justify-between items-center text-xs border-t border-slate-50 pt-3">
            <span className="text-slate-400 font-medium">حالة التوفر:</span>
            {product.stock > 0 ? (
              <span className="bg-emerald-50 text-emerald-700 px-2.5 py-0.5 rounded-full font-semibold">
                متاح ({product.stock})
              </span>
            ) : (
              <span className="bg-rose-50 text-rose-600 px-2.5 py-0.5 rounded-full font-semibold">
                نفد المخزون
              </span>
            )}
          </div>

          <button
            onClick={() => addToCart(product as any)}
            disabled={product.stock <= 0}
            className="w-full bg-emerald-600 hover:bg-emerald-700 text-white py-3 rounded-xl font-bold shadow-sm shadow-emerald-200 hover:shadow-md active:scale-[0.98] transition-all disabled:bg-slate-200 disabled:text-slate-400 disabled:shadow-none disabled:pointer-events-none flex items-center justify-center gap-2 text-sm sm:text-base"
          >
            <span>🛒</span>
            <span>أضف للسلة</span>
          </button>
        </div>
      </div>
    </div>
  )
}
