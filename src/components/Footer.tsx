import Link from 'next/link'
import { FaFacebook, FaInstagram, FaLinkedin, FaGithub } from 'react-icons/fa'

import { MapPin, Phone, Mail } from 'lucide-react'

export default function Footer() {
  return (
    <footer className="bg-green-950 text-white mt-20">
      <div className="max-w-7xl mx-auto px-6 py-12">
        {/* المحتوى */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-10">
          {/* اللوجو */}
          <div>
            <h2 className="text-2xl font-bold text-green-400 mb-3">ريفي 🌿</h2>

            <p className="text-gray-300 leading-7">
              منصة تربط المزارعين بالمشترين والدليفري بطريقة سهلة وسريعة.
            </p>

            {/* السوشيال */}
            <div className="flex items-center gap-4 mt-5">
              <a
                href="https://www.facebook.com/omar.salama.508497"
                target="_blank"
                className="bg-green-900 p-2 rounded-full hover:bg-green-700 hover:scale-110 transition"
              >
                <FaFacebook className="text-xl text-white" />
              </a>

              <a
                href="https://www.instagram.com/mrslmhbdlwhb/"
                target="_blank"
                className="bg-green-900 p-2 rounded-full hover:bg-green-700 hover:scale-110 transition"
              >
                <FaInstagram className="text-xl text-white" />
              </a>

              <a
                href="https://www.linkedin.com/in/omarsalama11"
                target="_blank"
                className="bg-green-900 p-2 rounded-full hover:bg-green-700 hover:scale-110 transition"
              >
                <FaLinkedin className="text-xl text-white" />
              </a>

              <a
                href="https://github.com/omar-sala"
                target="_blank"
                className="bg-green-900 p-2 rounded-full hover:bg-green-700 hover:scale-110 transition"
              >
                <FaGithub className="text-xl text-white" />
              </a>
            </div>
          </div>

          {/* روابط */}
          <div>
            <h3 className="text-lg font-semibold mb-4">روابط سريعة</h3>

            <ul className="space-y-3 text-gray-300">
              <li>
                <Link href="/" className="hover:text-green-400 transition">
                  الرئيسية
                </Link>
              </li>

              <li>
                <Link href="/" className="hover:text-green-400 transition">
                  المنتجات
                </Link>
              </li>

              <li>
                <Link href="/" className="hover:text-green-400 transition">
                  لوحة التاجر
                </Link>
              </li>

              <li>
                <Link href="/" className="hover:text-green-400 transition">
                  لوحة الدليفري
                </Link>
              </li>
            </ul>
          </div>

          {/* التواصل */}
          <div>
            <h3 className="text-lg font-semibold mb-4">تواصل معنا</h3>

            <div className="space-y-4 text-gray-300">
              <div className="flex items-center gap-3">
                <MapPin size={18} className="text-green-400" />
                <span>القاهرة، مصر</span>
              </div>

              <div className="flex items-center gap-3">
                <Phone size={18} className="text-green-400" />
                <span>01203073301</span>
              </div>

              <div className="flex items-center gap-3">
                <Mail size={18} className="text-green-400" />
                <span>omarsalamaali870@gmail.com</span>
              </div>
            </div>
          </div>
        </div>

        {/* الجزء السفلي */}
        <div className="border-t border-green-800 mt-10 pt-6 text-center text-gray-400 text-sm space-y-2">
          <p>© 2026 جميع الحقوق محفوظة لمنصة ريفي</p>

          <p className="text-green-400 font-medium">
            تم تصميم وتطوير هذا الموقع بواسطة <br></br> عمر سلامه
          </p>
        </div>
      </div>
    </footer>
  )
}
