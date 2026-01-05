'use client'

import { Suspense } from 'react'
import HomePageContent from './HomePageContent'

export default function Page() {
  return (
    <Suspense fallback={<div className="p-6 text-center">جاري التحميل...</div>}>
      <HomePageContent />
    </Suspense>
  )
}
