'use client'

import { FaSeedling, FaTruck, FaHandHoldingHeart } from 'react-icons/fa'

export default function Features() {
  const featuresList = [
    {
      id: 1,
      icon: <FaSeedling className="text-2xl sm:text-3xl" />, // شيلنا الكلاس الثابتة هنا
      title: 'طبيعي وطازج 100%',
      description:
        'منتجاتنا تأتي من الحقل إلى بيتك مباشرة، بدون مواد حافظة أو تخزين طويل لضمان أعلى جودة.',
    },
    {
      id: 2,
      icon: <FaHandHoldingHeart className="text-2xl sm:text-3xl" />, // شيلنا الكلاس الثابتة هنا
      title: 'دعم المزارع المحلي',
      description:
        'بشرائك من ريفي، أنت تدعم مباشرة مزارعاً مصرياً بسيطاً وعائلته وتساهم في استمرار الزراعة النظيفة.',
    },
    {
      id: 3,
      icon: <FaTruck className="text-2xl sm:text-3xl" />, // شيلنا الكلاس الثابتة هنا
      title: 'توصيل سريع مبرد',
      description:
        'سيارات توصيل مجهزة للحفاظ على برودة المنتجات وحمايتها لتصلك طازجة تماماً وكأنك قطفتها بنفسك.',
    },
  ]

  return (
    <section
      className="w-full bg-white py-12 px-4 sm:px-6 lg:px-8 border-b border-slate-100"
      dir="rtl"
    >
      <div className="max-w-7xl mx-auto">
        {/* شبكة الكروت (Responsive Grid) */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {featuresList.map((item) => (
            <div
              key={item.id}
              className="group flex flex-col items-center md:items-start text-center md:text-right p-6 rounded-2xl bg-emerald-100/50 border border-emerald-100/40 hover:bg-white hover:border-white hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300"
            >
              {/* حاوية الأيقونة */}
              <div className="mb-4 p-4 rounded-2xl bg-emerald-100/50 text-emerald-700 group-hover:bg-emerald-600 group-hover:text-white transition-colors duration-300 shadow-sm shadow-emerald-700/5">
                {item.icon}
              </div>

              {/* العنوان */}
              <h3 className="text-lg font-black text-slate-800 mb-2 group-hover:text-emerald-700 transition-colors">
                {item.title}
              </h3>

              {/* الوصف */}
              <p className="text-slate-500 text-sm leading-relaxed max-w-sm">
                {item.description}
              </p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
