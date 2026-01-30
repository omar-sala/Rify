'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
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

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()

  const getFullImageUrl = (path: string) => {
    if (!path) return null
    if (path.startsWith('http')) return path
    const { data } = supabase.storage.from('product-images').getPublicUrl(path)
    return data.publicUrl
  }

  const imageUrl = getFullImageUrl(product.image_url)

  return (
    <div className="border rounded-xl overflow-hidden shadow hover:shadow-xl transition bg-white flex flex-col h-full">
      <div className="relative w-full h-60 bg-gray-100">
        {imageUrl ? (
          <Image
            src={imageUrl}
            alt={product.name}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          />
        ) : (
          <div className="flex items-center justify-center h-full text-gray-400">
            📸 لا توجد صورة
          </div>
        )}
      </div>

      <div className="p-4 flex flex-col flex-grow text-right" dir="rtl">
        <h2 className="font-bold text-lg mb-1">{product.name}</h2>
        <p className="text-gray-500 text-sm mb-4 line-clamp-2">
          {product.description}
        </p>

        <div className="mt-auto">
          <div className="flex justify-between items-center mb-4 flex-row-reverse">
            <span className="text-green-700 font-bold">
              {product.price} جنيه
            </span>
            <span className="text-sm text-gray-600">
              المخزون: {product.stock}
            </span>
          </div>
          <button
            onClick={() => addToCart(product as any)}
            className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition font-bold"
          >
            أضف للسلة
          </button>
        </div>
      </div>
    </div>
  )
}

export default function HomePageContent({
  searchParams,
}: {
  searchParams?: { [key: string]: string | undefined }
}) {
  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)

  // فك الـ searchParams بطريقة آمنة
  const search = (searchParams?.search || '').toLowerCase()

  useEffect(() => {
    const fetchProducts = async () => {
      setLoading(true)
      const { data, error } = await supabase.from('products').select('*')
      if (error) {
        console.error(error)
      } else {
        setProducts(data as Product[])
      }
      setLoading(false)
    }
    fetchProducts()
  }, [])

  const filteredProducts = products.filter((p) =>
    p.name.toLowerCase().includes(search)
  )

  if (loading)
    return (
      <div className="text-center pt-20 animate-pulse text-green-700">
        جارٍ التحميل... 🌿
      </div>
    )

  return (
    <div className="pt-32 sm:pt-24 p-6 max-w-7xl mx-auto">
      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}
