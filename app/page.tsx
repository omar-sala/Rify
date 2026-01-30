'use client'

import { Suspense } from 'react'
import HomePageContent from './HomePageContent'

// لاحظ مفيش 'use client' هنا
export default function Page({
  searchParams,
}: {
  searchParams:
    | Promise<{ [key: string]: string | undefined }>
    | { [key: string]: string | undefined }
}) {
  return (
    <main>
      <Suspense
        fallback={
          <div className="p-20 text-center text-green-700 animate-pulse">
            جارٍ تحميل ريفي... 🌿
          </div>
        }
      >
        <HomePageContent searchParams={searchParams} />
      </Suspense>
    </main>
  )
}
