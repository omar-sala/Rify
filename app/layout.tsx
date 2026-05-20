import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '../app/context/CartContext'
import Navbar from '@/src/components/Navbar'
import Footer from '@/src/components/Footer'
import CartDrawer from '@/src/components/CartDrawer'
import { SearchProvider } from '../app/context/SearchContext'
import { AuthProvider } from './context/AuthContext'

// شيلنا استيراد خطوط Geist اللاتينية خالص

export const metadata: Metadata = {
  title: 'RIFY | سوق المنتجات الريفية',
  description: 'منصة لبيع وشراء المنتجات الريفية مباشرة من البائعين المحليين.',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body
        suppressHydrationWarning
        // شيلنا الـ variables بتاعة الخطوط اللاتينية ونضفنا الـ className
        className="antialiased bg-gray-50 text-gray-900"
      >
        <AuthProvider>
          <SearchProvider>
            <CartProvider>
              <Navbar />
              <CartDrawer />
              <main>{children}</main>
              <Footer />
            </CartProvider>
          </SearchProvider>
        </AuthProvider>
      </body>
    </html>
  )
}
