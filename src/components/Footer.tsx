'use client'

import Link from 'next/link'
import {
  FaFacebookF,
  FaInstagram,
  FaLinkedinIn,
  FaGithub,
} from 'react-icons/fa'
import { MapPin, Phone, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer
      className="bg-slate-900 border-t border-emerald-950/20 text-slate-200 mt-20 relative overflow-hidden"
      dir="rtl"
    >
      {/* لمسة ديكورية علوية بلون البراند */}
      <div className="absolute top-0 left-0 right-0 h-[3px] bg-gradient-to-l from-amber-400 via-emerald-500 to-green-600" />

      <div className="max-w-7xl mx-auto px-6 py-14 sm:px-8">
        {/* المحتوى الرئيسي للـ Footer */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-12 md:gap-8 mb-12">
          {/* العمود الأول: اللوجو والتعريف والسوشيال */}
          <div className="space-y-5">
            <Link
              href="/"
              className="text-2xl font-black tracking-wider flex items-center gap-2"
            >
              <span className="bg-gradient-to-l from-emerald-400 to-green-500 bg-clip-text text-transparent">
                RIFY
              </span>
              <span className="text-xl bg-white/5 p-1.5 rounded-xl border border-white/10">
                🌿
              </span>
            </Link>

            <p className="text-slate-400 text-sm leading-relaxed max-w-sm">
              منصة ريفية ذكية تربط المزارع المصري مباشرة بالمشترين والدليفري
              لتوفير خيرات حقولنا الطازجة بأسهل طريقة وبأعلى جودة للجميع.
            </p>

            {/* أزرار السوشيال ميديا بتأثير زجاجي مودرن */}
            <div className="flex items-center gap-3 pt-2">
              {[
                {
                  href: 'https://www.facebook.com/omar.salama.508497',
                  icon: <FaFacebookF />,
                },
                {
                  href: 'https://www.instagram.com/mrslmhbdlwhb/',
                  icon: <FaInstagram />,
                },
                {
                  href: 'https://www.linkedin.com/in/omarsalama11',
                  icon: <FaLinkedinIn />,
                },
                { href: 'https://github.com/omar-sala', icon: <FaGithub /> },
              ].map((social, index) => (
                <a
                  key={index}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="w-9 h-9 flex items-center justify-center rounded-xl bg-white/5 border border-white/10 text-slate-300 hover:bg-emerald-600 hover:text-white hover:border-emerald-500 hover:scale-110 active:scale-95 transition-all duration-300 shadow-sm"
                >
                  <span className="text-base">{social.icon}</span>
                </a>
              ))}
            </div>
          </div>

          {/* العمود الثاني: الروابط السريعة بتأثير خط Hover مميز */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 mb-5 relative inline-block after:content-[''] after:absolute after:-bottom-1 after:right-0 after:w-6 after:h-[2px] after:bg-emerald-500">
              روابط سريعة
            </h3>

            <ul className="space-y-3.5 text-sm">
              {[
                { name: 'الرئيسية', href: '/' },
                { name: 'المنتجات الطازجة', href: '/' },
                { name: 'لوحة تحكم التاجر', href: '/' },
                { name: 'بوابة الدليفري', href: '/' },
              ].map((link, index) => (
                <li key={index}>
                  <Link
                    href={link.href}
                    className="text-slate-400 hover:text-emerald-400 transition-colors duration-200 relative group py-0.5"
                  >
                    {link.name}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          {/* العمود الثالث: بيانات التواصل والمعلومات */}
          <div>
            <h3 className="text-sm font-bold uppercase tracking-wider text-slate-100 mb-5 relative inline-block after:content-[''] after:absolute after:-bottom-1 after:right-0 after:w-6 after:h-[2px] after:bg-emerald-500">
              تواصل معنا
            </h3>

            <div className="space-y-4 text-sm text-slate-400">
              <div className="flex items-center gap-3.5 group">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                  <MapPin size={16} />
                </div>
                <span className="group-hover:text-slate-300 transition-colors">
                  القاهرة، مصر
                </span>
              </div>

              <div className="flex items-center gap-3.5 group">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                  <Phone size={16} />
                </div>
                <span className="group-hover:text-slate-300 transition-colors dir-ltr">
                  01203073301
                </span>
              </div>

              <div className="flex items-center gap-3.5 group">
                <div className="w-8 h-8 rounded-xl bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center text-emerald-400 group-hover:bg-emerald-500 group-hover:text-white transition-all duration-300">
                  <Mail size={16} />
                </div>
                <span className="group-hover:text-slate-300 transition-colors break-all">
                  omarsalamaali870@gmail.com
                </span>
              </div>
            </div>
          </div>
        </div>

        {/* الجزء السفلي: الحقوق وإمضاء المطور الاحترافية */}
        <div className="border-t border-white/5 pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-xs text-slate-500">
          <p>© 2026 منصة ريفي. جميع الحقوق محفوظة للمطور.</p>

          <div className="flex items-center gap-1 text-slate-400 bg-white/5 px-4 py-2 rounded-2xl border border-white/5">
            <span>تم التصميم والتطوير بواسطة</span>
            <span className="font-bold text-emerald-400 hover:text-amber-400 transition-colors cursor-pointer">
              عمر سلامة
            </span>
          </div>
        </div>
      </div>
    </footer>
  )
}
