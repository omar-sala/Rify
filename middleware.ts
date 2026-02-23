import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { createClient } from '@supabase/supabase-js'

export async function middleware(req: NextRequest) {
  const url = req.nextUrl.clone()

  const isProtectedPage =
    url.pathname.startsWith('/dashboard') || url.pathname.startsWith('/buy')

  if (isProtectedPage) {
    const supabaseMiddleware = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/dashboard/:path*', '/buy/:path*'],
}
