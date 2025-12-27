import type { Metadata } from 'next'
import { Geist, Geist_Mono } from 'next/font/google'
import './globals.css'
import { CartProvider } from '../app/context/CartContext'

const geistSans = Geist({
  variable: '--font-geist-sans',
  subsets: ['latin'],
})

const geistMono = Geist_Mono({
  variable: '--font-geist-mono',
  subsets: ['latin'],
})

export const metadata: Metadata = {
  title: 'RIFY | سوق المنتجات الريفية',
  description:
    'RIFY منصة لبيع وشراء المنتجات الريفية مباشرة من البائعين المحليين. منتجات بيتية، ألبان، مخبوزات، وعسل نحل.',
  keywords: [
    'RIFY',
    'سوق ريفي',
    'منتجات ريفية',
    'عسل نحل',
    'جبنة قريش',
    'فطير بلدي',
    'منتجات بيتية',
    'local products',
    'rural market',
  ],
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="ar" dir="rtl">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased bg-gray-50 text-gray-900`}
      >
        <CartProvider>{children}</CartProvider>
      </body>
    </html>
  )
}
