'use client'

import { Suspense } from 'react'
import HomePageContent from './HomePageContent'

export default function Page({ searchParams }: { searchParams: any }) {
  return (
    <Suspense
      fallback={
        <div className="p-6 text-center animate-pulse text-green-700">
          جاري تحميل المنتجات... 🌿
        </div>
      }
    >
      <HomePageContent searchParams={searchParams} />
    </Suspense>
  )
}
