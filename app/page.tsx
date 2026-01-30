'use client'

import { Suspense, useEffect, useState } from 'react'
import HomePageContent from './HomePageContent'

export default function Page({
  searchParams,
}: {
  searchParams:
    | Promise<{ [key: string]: string | undefined }>
    | { [key: string]: string | undefined }
}) {
  const [params, setParams] = useState<{ [key: string]: string | undefined }>(
    {}
  )

  useEffect(() => {
    // حل الـ Promise لو موجود
    if (searchParams instanceof Promise) {
      searchParams.then((resolved) => setParams(resolved))
    } else {
      setParams(searchParams)
    }
  }, [searchParams])

  return (
    <main>
      <Suspense
        fallback={
          <div className="p-20 text-center text-green-700 animate-pulse">
            جارٍ تحميل ريفي... 🌿
          </div>
        }
      >
        <HomePageContent searchParams={params} />
      </Suspense>
    </main>
  )
}
