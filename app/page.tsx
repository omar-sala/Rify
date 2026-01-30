import { Suspense } from 'react'
import HomePageContent from './HomePageContent'

export default function Page() {
  return (
    <main>
      <Suspense
        fallback={
          <div className="p-20 text-center text-green-700">جارٍ التحميل...</div>
        }
      >
        <HomePageContent />
      </Suspense>
    </main>
  )
}
