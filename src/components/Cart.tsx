'use client'
import { useCart } from '../../app/context/CartContext'

export default function Cart() {
  const { cart, increase, decrease, remove } = useCart()

  if (cart.length === 0) {
    return <p className="p-4">🛒 السلة فاضية</p>
  }

  return (
    <div className="p-4 border rounded">
      <h2 className="font-bold mb-4">🛒 السلة</h2>

      {cart.map((item) => (
        <div key={item.id} className="flex justify-between items-center mb-2">
          <span>{item.name}</span>
          <span>السعر({item.price * (item.quantity ?? 0)})</span>

          <div className="flex items-center gap-2">
            <button
              onClick={() => decrease(item.id)}
              className="px-2 bg-gray-300"
            >
              -
            </button>

            <span>{item.quantity ?? 0}</span>

            <button
              onClick={() => increase(item.id)}
              className="px-2 bg-gray-300"
            >
              +
            </button>

            <button
              onClick={() => remove(item.id)}
              className="px-2 bg-red-500 text-white"
            >
              ✕
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
