'use client'

import { useCart } from '../../app/context/CartContext'
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { openCart } = useCart()
  const [search, setSearch] = useState('')
  const router = useRouter()

  // فلترة ديناميكية أثناء الكتابة
  useEffect(() => {
    if (!search.trim()) {
      router.replace('/') // لو البحث فاضي نرجع كل المنتجات
    } else {
      router.replace(`/?search=${encodeURIComponent(search)}`)
    }
  }, [search, router])

  return (
    <nav className="fixed top-0 left-0 right-0 bg-green-700 text-white px-4 py-3 flex flex-col sm:flex-row items-center sm:justify-between gap-3 sm:gap-0 z-50 shadow-md">
      {/* Logo */}
      <div className="flex items-center justify-between w-full sm:w-auto">
        <Link href="/" className="text-xl font-bold cursor-pointer">
          RIFY 🌿
        </Link>

        {/* Cart & Profile icons for mobile */}
        <div className="flex items-center gap-3 sm:hidden">
          <button
            onClick={openCart}
            className="cursor-pointer relative px-2 py-1 rounded-lg hover:bg-green-800 transition-all duration-200"
          >
            🛒
          </button>
          <Link href="/register" className="cursor-pointer">
            👤
          </Link>
        </div>
      </div>

      {/* Search input */}
      <div className="w-full sm:w-1/2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث عن منتج..."
          className="
            w-full
            px-3 py-2
            rounded-lg
            border-2 border-gray-300
            focus:border-green-600
            outline-none
            transition
          "
        />
      </div>

      {/* Cart & Profile for desktop */}
      <div className="hidden sm:flex items-center gap-4">
        <button
          onClick={openCart}
          className="cursor-pointer relative px-3 py-2 rounded-lg hover:bg-green-800 transition-all duration-200"
        >
          🛒 السلة
        </button>
        <Link href="/register" className="cursor-pointer">
          👤 حسابي
        </Link>
      </div>
    </nav>
  )
}
