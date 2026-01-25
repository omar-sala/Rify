import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import supabase from '@/lib/supabase'

// لازم يكون اسم الوظيفة middleware وتكون مسبوقة بـ export
export async function middleware(req: NextRequest) {
  const res = NextResponse.next()

  try {
    // جلب الجلسة
    const {
      data: { session },
    } = await supabase.auth.getSession()

    const url = req.nextUrl.clone()

    // 1. حماية لوحة التحكم
    if (url.pathname.startsWith('/dashboard')) {
      if (!session) {
        url.pathname = '/login'
        return NextResponse.redirect(url)
      }
    }

    // 2. حماية صفحات الشراء أو أي مسار آخر
    if (url.pathname.startsWith('/buy')) {
      if (!session) {
        url.pathname = '/login'
        return NextResponse.redirect(url)
      }
    }
  } catch (error) {
    // في حالة وجود خطأ في الـ Auth، نمرر الطلب عادي أو نحوله للـ login
    console.error('Middleware Auth Error:', error)
  }

  return res
}

// الـ Matcher عشان نحدد المسارات
export const config = {
  matcher: [
    '/dashboard/:path*',
    '/buy/:path*',
    // استثناء ملفات الـ Static والـ Images من الـ Middleware لتحسين الأداء
    '/((?!_next/static|_next/image|favicon.ico).*)',
  ],
}
