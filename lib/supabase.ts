// import { createClient } from '@supabase/supabase-js'

// const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
// const supabaseKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
// const supabase = createClient(supabaseUrl, supabaseKey)

// export default supabase

import { createClient } from '@supabase/supabase-js'

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!

// نعرف متغير على مستوى global علشان ميعملش instance جديد كل مرة
const globalForSupabase = globalThis as unknown as {
  supabase: ReturnType<typeof createClient> | undefined
}

export const supabase =
  globalForSupabase.supabase ?? createClient(supabaseUrl, supabaseAnonKey)

if (process.env.NODE_ENV !== 'production') {
  globalForSupabase.supabase = supabase
}

export default supabase
