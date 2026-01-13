'use client'

import { useCart } from '../../app/context/CartContext'

export default function CartDrawer() {
  const { cart, increase, decrease, remove, isOpen, closeCart } = useCart()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="flex-1 bg-black/40 cursor-pointer" onClick={closeCart} />

      {/* Drawer */}
      <div className="w-96 bg-white h-full p-4 shadow-2xl">
        <div className="flex justify-between items-center mb-6">
          <h2 className="font-bold text-lg">🛒 سلة الشراء</h2>

          <button
            onClick={closeCart}
            className="cursor-pointer px-3 py-1.5 bg-green-500 text-white rounded
                       transition-all duration-300 ease-in-out
                       hover:scale-110 hover:bg-red-600"
          >
            ✕
          </button>
        </div>

        {cart.length === 0 && (
          <p className="text-center text-gray-500 mt-10">السلة فارغة</p>
        )}

        {cart.map((item) => (
          <div key={item.id} className="border-b pb-4 mb-4 last:border-b-0">
            <p className="font-semibold mb-1">{item.name}</p>

            <p className="text-sm text-gray-600 mb-3">
              {item.price * (item.quantity ?? 1)} جنيه
            </p>

            <div className="flex items-center gap-2">
              <button
                onClick={() => decrease(item.id)}
                className="w-8 h-8 flex items-center justify-center
                           border rounded cursor-pointer
                           transition hover:bg-gray-200"
              >
                −
              </button>

              <span className="min-w-[20px] text-center font-medium">
                {item.quantity}
              </span>

              <button
                onClick={() => increase(item.id)}
                className="w-8 h-8 flex items-center justify-center
                           border rounded cursor-pointer
                           transition hover:bg-gray-200"
              >
                +
              </button>

              <button
                onClick={() => remove(item.id)}
                className="ml-auto text-red-500 cursor-pointer
                           transition hover:text-red-700"
              >
                حذف
              </button>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
