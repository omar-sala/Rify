// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// const supabase = createClient(supabaseUrl, supabaseKey)

// export default supabase

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// منع إنشاء نسخ متعددة في الذاكرة أثناء الـ Development
const createSupabaseClient = () => {
  return createClient(supabaseUrl, supabaseAnonKey, {
    auth: {
      persistSession: true,
      autoRefreshToken: true,
      detectSessionInUrl: true,
    },
  })
}

const globalForSupabase = globalThis as unknown as {
  supabase: ReturnType<typeof createSupabaseClient> | undefined
}

export const supabase = globalForSupabase.supabase ?? createSupabaseClient()

if (process.env.NODE_ENV !== 'production') {
  globalForSupabase.supabase = supabase
}

export default supabase
