'use client'

import { createContext, useContext, useState } from 'react'
import { Product } from '../../src/types/product'

type CartContextType = {
  cart: Product[]
  addToCart: (product: Omit<Product, 'quantity'>) => void
  increase: (id: number) => void
  decrease: (id: number) => void
  remove: (id: number) => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<Product[]>([])

  function addToCart(product: Omit<Product, 'quantity'>) {
    const item = cart.find((p) => p.id === product.id)

    if (item) {
      increase(product.id)
    } else {
      setCart([...cart, { ...product, quantity: 1 }])
    }
  }

  function increase(id: number) {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: (item.quantity ?? 0) + 1 } : item
      )
    )
  }

  function decrease(id: number) {
    setCart(
      cart
        .map((item) =>
          item.id === id
            ? { ...item, quantity: (item.quantity ?? 1) - 1 }
            : item
        )
        .filter((item) => (item.quantity ?? 0) > 0)
    )
  }

  function remove(id: number) {
    setCart(cart.filter((item) => item.id !== id))
  }

  return (
    <CartContext.Provider
      value={{ cart, addToCart, increase, decrease, remove }}
    >
      {children}
    </CartContext.Provider>
  )
}

export function useCart() {
  const context = useContext(CartContext)
  if (!context) throw new Error('useCart must be used inside CartProvider')
  return context
}
