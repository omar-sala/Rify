// CartContext.tsx
'use client'

import { createContext, useContext, useState, useEffect } from 'react'

type CartContextType = {
  cart: any[]
  addToCart: (product: any) => void
  increase: (id: string | number) => void
  decrease: (id: string | number) => void
  remove: (id: string | number) => void
  isOpen: boolean
  openCart: () => void
  closeCart: () => void
}

const CartContext = createContext<CartContextType | null>(null)

export function CartProvider({ children }: { children: React.ReactNode }) {
  const [cart, setCart] = useState<any[]>([])
  const [isOpen, setIsOpen] = useState(false)

  // ✅ load from localStorage
  useEffect(() => {
    const stored = localStorage.getItem('cart')
    if (stored) setCart(JSON.parse(stored))
  }, [])

  // ✅ save to localStorage
  useEffect(() => {
    localStorage.setItem('cart', JSON.stringify(cart))
  }, [cart])

  const openCart = () => setIsOpen(true)
  const closeCart = () => setIsOpen(false)

  function addToCart(product: any) {
    const item = cart.find((p) => p.id === product.id)
    if (item) increase(product.id)
    else setCart([...cart, { ...product, quantity: 1 }])
    openCart()
  }

  function increase(id: string | number) {
    setCart(
      cart.map((item) =>
        item.id === id ? { ...item, quantity: (item.quantity ?? 0) + 1 } : item
      )
    )
  }

  function decrease(id: string | number) {
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

  function remove(id: string | number) {
    setCart(cart.filter((item) => item.id !== id))
  }

  return (
    <CartContext.Provider
      value={{
        cart,
        addToCart,
        increase,
        decrease,
        remove,
        isOpen,
        openCart,
        closeCart,
      }}
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
