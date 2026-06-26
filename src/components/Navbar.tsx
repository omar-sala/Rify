'use client'

import { useCart } from '../../app/context/CartContext'
import { useAuth } from '../../app/context/AuthContext'
import { useSearch } from '../../app/context/SearchContext'
import Link from 'next/link'
import { useRouter } from 'next/navigation'

// icons فقط
import { FaShoppingCart, FaUser, FaSignOutAlt, FaSearch } from 'react-icons/fa'

export default function Navbar() {
  const { openCart, cart } = useCart()
  const { user, logout, loading } = useAuth()
  const { search, setSearch } = useSearch()
  const router = useRouter()

  const handleLogout = async () => {
    await logout()
    router.replace('/login')
  }

  return (
    <nav
      className="fixed top-0 left-0 right-0 bg-emerald-50/95 backdrop-blur-md text-slate-800 px-4 py-3.5 sm:px-8 flex flex-col sm:flex-row items-center sm:justify-between gap-3 sm:gap-0 z-50 shadow-sm border-b border-emerald-100/80"
      dir="rtl"
    >
      {/* Brand & Mobile Actions */}
      <div className="flex items-center justify-between w-full sm:w-auto">
        <Link
          href="/"
          className="text-2xl font-black tracking-wider hover:opacity-90 transition-opacity cursor-pointer flex items-center gap-2"
        >
          <span className="bg-gradient-to-l from-emerald-600 to-green-700 bg-clip-text text-transparent">
            RIFY
          </span>
          <span className="text-xl bg-emerald-600/10 p-1.5 rounded-xl border border-emerald-200/50">
            🌿
          </span>
        </Link>

        {/* Mobile Icons Area (With Bug Fix) */}
        <div className="flex items-center gap-2 sm:hidden">
          <button
            onClick={openCart}
            className="relative p-2.5 hover:bg-emerald-600/10 active:bg-emerald-600/20 rounded-xl transition-all duration-200"
          >
            <FaShoppingCart className="text-xl text-emerald-700" />
            {cart?.length > 0 && (
              <span className="absolute top-1 right-1 bg-rose-500 text-white text-[10px] font-bold rounded-full h-4 w-4 flex items-center justify-center animate-bounce shadow-sm">
                {cart.length}
              </span>
            )}
          </button>

          <Link
            href={
              user
                ? user.role === 'user'
                  ? '/orders'
                  : `/dashboard/${user.role}`
                : '/login'
            }
            className="p-2.5 hover:bg-emerald-600/10 active:bg-emerald-600/20 rounded-xl transition-all duration-200 flex items-center justify-center"
          >
            {user ? (
              <div className="w-6 h-6 bg-emerald-600 text-white rounded-full flex items-center justify-center text-xs font-bold shadow-sm">
                {user.name?.charAt(0).toUpperCase() || 'U'}
              </div>
            ) : (
              <FaUser className="text-lg text-emerald-700" />
            )}
          </Link>
        </div>
      </div>

      {/* Balanced Modern Search Bar */}
      <div className="w-full sm:w-5/12 relative group">
        <FaSearch className="absolute top-1/2 right-4 -translate-y-1/2 text-slate-400 group-focus-within:text-emerald-600 transition-colors duration-200" />

        <input
          type="text"
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          placeholder="ابحث عن منتجات ريفية طازجة..."
          className="w-full pl-4 pr-11 py-2.5 text-sm rounded-2xl bg-white text-slate-800 placeholder-slate-400 border border-emerald-200/60 focus:border-emerald-500/30 focus:ring-4 focus:ring-emerald-500/10 outline-none transition-all duration-200 shadow-inner"
        />
      </div>

      {/* Desktop Actions */}
      <div className="hidden sm:flex items-center gap-3">
        <button
          onClick={openCart}
          className="cursor-pointer relative px-4 py-2.5 text-sm font-bold rounded-2xl text-slate-700 hover:text-emerald-700 hover:bg-emerald-600/5 transition-all duration-200 flex items-center gap-2"
        >
          <FaShoppingCart className="text-base text-emerald-600" />
          <span>السلة</span>
          {cart?.length > 0 && (
            <span className="absolute -top-1 -left-1 bg-rose-500 text-white text-xs font-bold rounded-full h-5 w-5 flex items-center justify-center shadow-md">
              {cart.length}
            </span>
          )}
        </button>

        <div className="h-5 w-[1px] bg-emerald-200 mx-1"></div>

        {loading ? (
          <div className="h-10 w-24 bg-slate-200/60 animate-pulse rounded-2xl"></div>
        ) : user ? (
          <div className="flex items-center gap-2">
            <Link
              href={
                user.role === 'user' ? '/orders' : `/dashboard/${user.role}`
              }
              className="px-4 py-2.5 text-sm font-bold rounded-2xl bg-emerald-600 text-white hover:bg-emerald-700 shadow-sm transition-all duration-200 flex items-center gap-2"
            >
              <div className="w-5 h-5 bg-white text-emerald-600 rounded-full flex items-center justify-center text-[10px] font-black">
                {user.name.charAt(0).toUpperCase()}
              </div>
              <span>{user.name.split(' ')[0]}</span>
            </Link>

            <button
              onClick={handleLogout}
              className="p-2.5 text-slate-400 hover:text-rose-600 hover:bg-rose-50 rounded-2xl transition-all duration-200"
              title="تسجيل الخروج"
            >
              <FaSignOutAlt className="text-base" />
            </button>
          </div>
        ) : (
          <Link
            href="/login"
            className="px-5 py-2.5 bg-emerald-600 text-white text-sm font-bold rounded-2xl hover:bg-emerald-700 active:scale-95 shadow-sm transition-all duration-200"
          >
            تسجيل الدخول
          </Link>
        )}
      </div>
    </nav>
  )
}
