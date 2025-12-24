'use client'

import Image from 'next/image'
import { products } from '../src/data/products'
import { Product } from '../src/types/product'

function ProductCard({ product }: { product: Product }) {
  return (
    <div className="border rounded-xl overflow-hidden shadow hover:shadow-xl transition bg-white">
      {/* Product / Seller Image */}
      <div className="relative w-full h-70">
        <Image
          src={product.seller.image}
          alt={product.seller.name}
          fill
          priority
          className="object-cover"
        />
      </div>

      {/* Content */}
      <div className="p-4" dir="rtl">
        <h2 className="font-bold text-lg mb-2">{product.name}</h2>

        <p className="text-sm text-gray-500 mb-1">
          البائع: {product.seller.name} • {product.seller.distance} كم
        </p>

        <p className="text-gray-700 mb-3">
          {product.unit} / {product.price} جنيه
        </p>

        <button className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition">
          أضف للسلة
        </button>
      </div>
    </div>
  )
}

export default function HomePage() {
  return (
    <div className="p-6 grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
      {products.map((product) => (
        <ProductCard key={product.id} product={product} />
      ))}
    </div>
  )
}
