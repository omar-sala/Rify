'use client'

import Image from 'next/image'
import { useEffect, useState } from 'react'
import { useCart } from './context/CartContext'
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

function ProductCard({ product }: { product: Product }) {
  const { addToCart } = useCart()

  return (
    <div className="border rounded-xl overflow-hidden shadow hover:shadow-xl transition bg-white">
      {/* <div className="relative w-full h-60">
        <Image
          src={product.image_url}
          alt={product.name}
          fill
          className="object-cover"
        />
      </div> */}

      <div className="p-4" dir="rtl">
        <h2 className="font-bold text-lg mb-2">{product.name}</h2>
        <p className="text-gray-700 mb-3">
          {product.stock} قطعة / {product.price} جنيه
        </p>

        <button
          onClick={() => addToCart(product)}
          className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
        >
          أضف للسلة
        </button>
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
  const search = (searchParams?.search ?? '').toLowerCase()

  useEffect(() => {
    const fetchProducts = async () => {
      const { data, error } = await supabase.from('products').select(`
          id,
          name,
          description,
          price,
          stock,
          image_url,
          seller_id
        `)

      if (error) console.error(error)
      else setProducts(data as Product[])

      setLoading(false)
    }

    fetchProducts()
  }, [])

  const filteredProducts = products.filter((product) =>
    product.name.toLowerCase().includes(search)
  )

  if (loading)
    return <p className="text-center mt-10">جارٍ تحميل المنتجات...</p>

  return (
    <div className="pt-28 sm:pt-20 p-6">
      {filteredProducts.length === 0 && (
        <p className="text-center text-gray-500 mb-6">لا توجد نتائج 🔍</p>
      )}

      <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
        {filteredProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>
    </div>
  )
}

// 'use client'

// import Image from 'next/image'
// import { products } from '../src/data/products'
// import { Product } from '../src/types/product'
// import { useCart } from './context/CartContext'
// import { useSearchParams } from 'next/navigation'
// import supabase from '@/lib/supabase'

// function ProductCard({ product }: { product: Product }) {
//   const { addToCart } = useCart()

//   return (
//     <div className="border rounded-xl overflow-hidden shadow hover:shadow-xl transition bg-white">
//       <div className="relative w-full h-60">
//         <Image
//           src={product.seller.image}
//           alt={product.seller.name}
//           fill
//           className="object-cover"
//         />
//       </div>

//       <div className="p-4" dir="rtl">
//         <h2 className="font-bold text-lg mb-2">{product.name}</h2>

//         <p className="text-sm text-gray-500 mb-1">
//           البائع: {product.seller.name} • {product.seller.distance} كم
//         </p>

//         <p className="text-gray-700 mb-3">
//           {product.unit} / {product.price} جنيه
//         </p>

//         <button
//           onClick={() => addToCart(product)}
//           className="w-full bg-green-600 text-white py-2 rounded-lg hover:bg-green-700 transition"
//         >
//           أضف للسلة
//         </button>
//       </div>
//     </div>
//   )
// }

// export default function HomePageContent() {
//   const searchParams = useSearchParams()
//   const search = searchParams.get('search')?.toLowerCase() || ''

//   const filteredProducts = products.filter((product) =>
//     product.name.toLowerCase().includes(search)
//   )

//   return (
//     <div className="pt-28 sm:pt-20 p-6">
//       {filteredProducts.length === 0 && (
//         <p className="text-center text-gray-500 mb-6">لا توجد نتائج 🔍</p>
//       )}

//       <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
//         {filteredProducts.map((product) => (
//           <ProductCard key={product.id} product={product} />
//         ))}
//       </div>
//     </div>
//   )
// }
