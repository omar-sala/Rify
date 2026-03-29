'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useCart } from './context/CartContext'
import { useSearch } from './context/SearchContext'
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

  if (loading && products.length === 0) {
    return (
      <div className="text-center pt-32 text-green-700">جارٍ التحميل... 🌿</div>
    )
  }

  return (
    <div className="pt-32 sm:pt-24 p-6 max-w-7xl mx-auto">
      {filteredProducts.length === 0 && !loading ? (
        <div className="text-center py-20 text-gray-500">
          {search
            ? `لا توجد نتائج بحث لـ "${search}"`
            : 'لا توجد منتجات حالياً.'}
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
          ))}
        </div>
      )}
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
    <div
      className="border rounded-xl overflow-hidden shadow bg-white flex flex-col h-full text-right"
      dir="rtl"
    >
      <div className="relative w-full h-60 bg-gray-100">
        {imageUrl && (
          <Image
            src={imageUrl || '/placeholder.png'}
            alt={product.name}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 25vw"
            loading="eager"
            className="object-cover"
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
            onClick={() => addToCart(product as any)}
            className="w-full bg-green-600 text-white py-2 rounded-lg font-bold"
          >
            أضف للسلة
          </button>
        </div>
      </div>
    </div>
  )
}
