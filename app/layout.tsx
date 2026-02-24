import type { Metadata } from 'next'
import './globals.css'
import { CartProvider } from '../app/context/CartContext'
import Navbar from '@/src/components/Navbar'
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
            </CartProvider>
          </SearchProvider>
        </AuthProvider>
      </body>
    </html>
  )
}

// import type { Metadata } from 'next'
// import { Geist, Geist_Mono } from 'next/font/google'
// import './globals.css'
// import { CartProvider } from '../app/context/CartContext'
// import Navbar from '@/src/components/Navbar'
// import CartDrawer from '@/src/components/CartDrawer'
// import { SearchProvider } from '../app/context/SearchContext'
// import { AuthProvider } from './context/AuthContext'

// const geistSans = Geist({
//   variable: '--font-geist-sans',
//   subsets: ['latin'],
// })

// const geistMono = Geist_Mono({
//   variable: '--font-geist-mono',
//   subsets: ['latin'],
// })

// export const metadata: Metadata = {
//   title: 'RIFY | سوق المنتجات الريفية',
//   description: 'منصة لبيع وشراء المنتجات الريفية مباشرة من البائعين المحليين.',
// }

// export default function RootLayout({
//   children,
// }: {
//   children: React.ReactNode
// }) {
//   return (
//     <html lang="ar" dir="rtl">
//       <body
//         suppressHydrationWarning
//         className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
//       >
//         <AuthProvider>
//           <SearchProvider>
//             <CartProvider>
//               <Navbar />
//               <CartDrawer />
//               {/* الـ children هنا هم اللي فيهم الصفحة والمنتجات */}
//               <main>{children}</main>
//             </CartProvider>
//           </SearchProvider>
//         </AuthProvider>
//       </body>
//     </html>
//   )
// }
