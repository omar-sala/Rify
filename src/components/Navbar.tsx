'use client'

import { useCart } from '../../app/context/CartContext' // استدعاء السلة
import { useAuth } from '../../app/context/AuthContext' // استدعاء تسجيل الدخول
import Link from 'next/link'
import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'

export default function Navbar() {
  const { openCart, cartItems } = useCart() // نفترض وجود عدد العناصر في السلة
  const { user, logout, loading } = useAuth()
  const [search, setSearch] = useState('')
  const router = useRouter()

  // فلترة ديناميكية أثناء الكتابة
  useEffect(() => {
    const delayDebounceFn = setTimeout(() => {
      if (!search.trim()) {
        router.replace('/')
      } else {
        router.replace(`/?search=${encodeURIComponent(search)}`)
      }
    }, 500)
    return () => clearTimeout(delayDebounceFn)
  }, [search, router])

  const handleLogout = async () => {
    await logout()
    router.push('/login')
  }

  return (
    <nav className="fixed top-0 left-0 right-0 bg-green-700 text-white px-4 py-3 flex flex-col sm:flex-row items-center sm:justify-between gap-3 sm:gap-0 z-50 shadow-md">
      {/* Logo Section */}
      <div className="flex items-center justify-between w-full sm:w-auto">
        <Link href="/" className="text-xl font-bold cursor-pointer">
          RIFY 🌿
        </Link>

        {/* Mobile Icons (Cart & Profile) */}
        <div className="flex items-center gap-3 sm:hidden">
          {/* السلة تظهر للمشتري فقط أو غير المسجل */}
          {(!user || user.role === 'user') && (
            <button
              onClick={openCart}
              className="relative px-2 py-1 hover:bg-green-800 rounded-lg transition"
            >
              🛒
              {cartItems?.length > 0 && (
                <span className="absolute -top-1 -right-1 bg-red-500 text-[10px] rounded-full h-4 w-4 flex items-center justify-center">
                  {cartItems.length}
                </span>
              )}
            </button>
          )}
          <Link href={user ? `/dashboard/${user.role}` : '/login'}>👤</Link>
        </div>
      </div>

      {/* Search Input */}
      <div className="w-full sm:w-1/2">
        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث عن منتج..."
          className="w-full px-3 py-2 rounded-lg border-2 border-gray-300 text-black focus:border-green-600 outline-none transition"
        />
      </div>

      {/* Desktop Section */}
      <div className="hidden sm:flex items-center gap-4">
        {/* زر السلة */}
        {(!user || user.role === 'user') && (
          <button
            onClick={openCart}
            className="cursor-pointer relative px-3 py-2 rounded-lg hover:bg-green-800 transition-all duration-200"
          >
            🛒 السلة
            {cartItems?.length > 0 && (
              <span className="absolute top-0 right-0 bg-red-500 text-xs rounded-full h-5 w-5 flex items-center justify-center translate-x-1/2 -translate-y-1/2">
                {cartItems.length}
              </span>
            )}
          </button>
        )}

        {/* زر الحساب أو تسجيل الدخول */}
        {loading ? (
          <div className="h-8 w-20 bg-green-600 animate-pulse rounded"></div>
        ) : user ? (
          <div className="flex items-center gap-2">
            <Link
              href={`/dashboard/${user.role}`}
              className="px-3 py-2 rounded-lg hover:bg-green-800 transition"
            >
              {user.name.split(' ')[0]} 👤
            </Link>
            <button
              onClick={handleLogout}
              className="px-2 py-1 bg-red-600 rounded hover:bg-red-700 text-xs"
            >
              خروج
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="px-4 py-2 bg-white text-green-700 rounded-lg font-bold hover:bg-gray-200 transition"
          >
            دخول
          </Link>
        )}
      </div>
    </nav>
  )
}
