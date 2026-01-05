'use client'

import { useCart } from '../../app/context/CartContext'

export default function CartDrawer() {
  const { cart, increase, decrease, remove, isOpen, closeCart } = useCart()

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 flex">
      {/* Overlay */}
      <div className="flex-1 bg-black/40" onClick={closeCart} />

      {/* Drawer */}
      <div className="w-96 bg-white h-full p-4 shadow-xl">
        <div className="flex justify-between items-center mb-4">
          <h2 className="font-bold text-lg">🛒 سلة الشراء</h2>
          <button onClick={closeCart}>✕</button>
        </div>

        {cart.length === 0 && <p>السلة فارغة</p>}

        {cart.map((item) => (
          <div key={item.id} className="border-b pb-3 mb-3">
            <p className="font-semibold">{item.name}</p>
            <p className="text-sm mb-2">
              {item.price * (item.quantity ?? 1)} جنيه
            </p>

            <div className="flex items-center gap-2">
              <button onClick={() => decrease(item.id)}>-</button>
              <span>{item.quantity}</span>
              <button onClick={() => increase(item.id)}>+</button>
              <button
                onClick={() => remove(item.id)}
                className="text-red-500 ml-auto"
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
