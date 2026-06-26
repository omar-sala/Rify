'use client'

import Image from 'next/image'

interface HeroProps {
  onExploreClick?: () => void
}

export default function Hero({ onExploreClick }: HeroProps) {
  return (
    <div
      className="relative w-full min-h-screen sm:min-h-[80vh] flex flex-col items-center justify-center overflow-hidden bg-slate-900 px-4 pt-20 pb-8"
      dir="rtl"
    >
      {/* صورة الخلفية */}
      <Image
        src="/hero-farm.jpeg"
        alt="أطيب خيرات الريف"
        fill
        priority
        className="object-cover scale-105 brightness-125"
      />

      {/* طبقة التظليل */}
      <div className="absolute inset-0 bg-gradient-to-t from-[#0b251a]/50 via-slate-950/30 to-slate-950/20" />

      {/* المحتوى */}
      <div className="relative z-10 text-center text-white max-w-3xl flex flex-col items-center justify-center gap-5 w-full my-auto">
        {/* الشريط الأخضر */}
        <div className="px-4 w-full flex justify-center">
          <span
            className="
              inline-flex
              items-center
              justify-center
              text-center
              bg-emerald-500/20
              border
              border-emerald-500/30
              backdrop-blur-sm
              text-emerald-300
              rounded-full
              px-4
              py-2
              text-xs
              sm:text-sm
              font-semibold
              max-w-xs
              sm:max-w-fit
              leading-relaxed
            "
          >
            🌾 من خير مزارعنا إلى باب بيتك مباشرة
          </span>
        </div>

        {/* العنوان */}
        <h1 className="text-3xl sm:text-5xl md:text-6xl font-black tracking-tight leading-tight px-2">
          أطيب{' '}
          <span className="bg-gradient-to-l from-amber-400 to-emerald-400 bg-clip-text text-transparent">
            خيرات الريف
          </span>{' '}
          المصري
        </h1>

        {/* الوصف */}
        <p className="text-xs sm:text-base md:text-lg text-emerald-100/80 max-w-xl mx-auto leading-relaxed font-medium px-4">
          استمتع بمنتجات زراعية طازجة، صحية، ومضمونة 100% مستخرجة بعناية من
          أيادي مزارعينا لتصلك بأعلى جودة وأفضل سعر.
        </p>

        {/* الزر */}
        <div className="pt-2">
          <button
            onClick={onExploreClick}
            className="bg-emerald-600 hover:bg-emerald-700 active:scale-95 text-white font-bold px-7 py-3 sm:px-8 sm:py-3.5 rounded-2xl shadow-lg shadow-emerald-950/50 transition-all duration-200 text-xs sm:text-sm flex items-center gap-2 mx-auto"
          >
            <span>ابدأ التسوق الآن</span>
            <span className="animate-bounce">👇</span>
          </button>
        </div>
      </div>
    </div>
  )
}
