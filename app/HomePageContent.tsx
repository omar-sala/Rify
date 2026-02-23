// 'use client'

// import Image from 'next/image'
// import { useEffect, useState } from 'react'
// import { useCart } from './context/CartContext'
// import supabase from '../lib/supabase'
// import { useAuth } from './context/AuthContext'

// interface Product {
//   id: string
//   name: string
//   description: string
//   price: number
//   stock: number
//   image_url: string
//   seller_id: string
// }

// export default function HomePageContent() {
//   const [products, setProducts] = useState<Product[]>([])
//   const [loading, setLoading] = useState(true)
//   const { loading: authLoading } = useAuth() // هنخليها بس مش هنعطل الصفحة بسببها

//   const search = ''

//   // useEffect(() => {
//   //   // دالة جلب البيانات منفصلة تماماً
//   //   const fetchProducts = async () => {
//   //     try {
//   //       const { data, error } = await supabase.from('products').select('*')

//   //       if (error) throw error
//   //       if (data) setProducts(data)
//   //     } catch (err) {
//   //       console.error('Supabase Error:', err)
//   //     } finally {
//   //       setLoading(false)
//   //     }
//   //   }

//   //   fetchProducts()
//   // }, [])

//   useEffect(() => {
//     if (authLoading) return // ⬅️ أهم سطر

//     const fetchProducts = async () => {
//       setLoading(true)

//       const { data, error } = await supabase.from('products').select('*')

//       console.log('DATA:', data)
//       console.log('ERROR:', error)

//       if (!error && data) {
//         setProducts(data)
//       }

//       setLoading(false)
//     }

//     fetchProducts()
//   }, [authLoading])

//   // حساب الفلترة هنا مباشرة وببساطة
//   const filteredProducts = products.filter(
//     (p) =>
//       p.name?.toLowerCase().includes(search.toLowerCase()) ||
//       p.description?.toLowerCase().includes(search.toLowerCase())
//   )

//   // 1. لو لسه بيحمل لأول مرة خالص
//   if (loading && products.length === 0) {
//     return (
//       <div className="text-center pt-32 text-green-700">جارٍ التحميل... 🌿</div>
//     )
//   }

//   return (
//     <div className="pt-32 sm:pt-24 p-6 max-w-7xl mx-auto">
//       {/* 2. لو التحميل خلص والصفحة فعلاً فاضية */}
//       {products.length === 0 && !loading ? (
//         <div className="text-center py-20 text-gray-500">
//           لا توجد منتجات حالياً.
//         </div>
//       ) : (
//         <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
//           {filteredProducts.map((product) => (
//             <ProductCard key={product.id} product={product} />
//           ))}
//         </div>
//       )}
//     </div>
//   )
// }

// // كود الـ ProductCard خليه زي ما هو تحت..
// function ProductCard({ product }: { product: Product }) {
//   const { addToCart } = useCart()
//   const imageUrl = product.image_url
//     ? product.image_url.startsWith('http')
//       ? product.image_url
//       : supabase.storage.from('product-images').getPublicUrl(product.image_url)
//           .data.publicUrl
//     : null

//   return (
//     <div
//       className="border rounded-xl overflow-hidden shadow bg-white flex flex-col h-full text-right"
//       dir="rtl"
//     >
//       <div className="relative w-full h-60 bg-gray-100">
//         {imageUrl && (
//           <Image
//             src={imageUrl}
//             alt={product.name}
//             fill
//             className="object-cover"
//           />
//         )}
//       </div>
//       <div className="p-4 flex flex-col flex-grow">
//         <h2 className="font-bold text-lg">{product.name}</h2>
//         <p className="text-gray-500 text-sm mb-4 line-clamp-2">
//           {product.description}
//         </p>
//         <div className="mt-auto">
//           <div className="flex justify-between items-center mb-4">
//             <span className="text-sm text-gray-600">
//               المخزون: {product.stock}
//             </span>
//             <span className="text-green-700 font-bold">
//               {product.price} جنيه
//             </span>
//           </div>
//           <button
//             onClick={() => addToCart(product as any)}
//             className="w-full bg-green-600 text-white py-2 rounded-lg font-bold"
//           >
//             أضف للسلة
//           </button>
//         </div>
//       </div>
//     </div>
//   )
// }

'use client'

import Image from 'next/image'
import { useEffect, useState, useMemo } from 'react'
import { useCart } from './context/CartContext'
import supabase from '../lib/supabase'

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

  useEffect(() => {
    let isMounted = true

    const fetchProducts = async () => {
      try {
        const { data, error } = await supabase.from('products').select('*')
        if (error) throw error
        if (data && isMounted) setProducts(data)
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

  if (loading && products.length === 0) {
    return (
      <div
        style={{
          textAlign: 'center',
          paddingTop: '8rem',
          color: '#15803d',
          fontWeight: 'bold',
        }}
      >
        جارٍ التحميل... 🌿
      </div>
    )
  }

  return (
    <div className="pt-32 sm:pt-24 p-6 max-w-7xl mx-auto">
      {products.length === 0 && !loading ? (
        <div className="text-center py-20 text-gray-500">
          لا توجد منتجات حالياً.
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {products.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
    </div>
  )
}

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()

  const imageUrl = useMemo(() => {
    if (!product.image_url) return null
    if (product.image_url.startsWith('http')) return product.image_url
    return supabase.storage
      .from('product-images')
      .getPublicUrl(product.image_url).data.publicUrl
  }, [product.image_url])

  return (
    <div
      className="border rounded-xl overflow-hidden shadow-sm bg-white flex flex-col h-full text-right"
      dir="rtl"
    >
      <div className="relative w-full h-60 bg-gray-50">
        {imageUrl && (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        )}
      </div>
      <div className="p-4 flex flex-col flex-grow">
        <h2 className="font-bold text-lg">{product.name}</h2>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-auto">
          <div className="flex justify-between items-center mb-4">
            <span className="text-sm text-gray-600">
              المخزون: {product.stock}
            </span>
            <span className="text-green-700 font-bold">
              {product.price} جنيه
            </span>
          </div>
          <button
            onClick={() => addToCart(product)}
            className="w-full bg-green-600 text-white py-2 rounded-lg font-bold hover:bg-green-700 transition"
          >
            أضف للسلة
          </button>
        </div>
      </div>
    </div>
  )
}
