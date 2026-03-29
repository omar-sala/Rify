'use client'

import {
  createContext,
  useContext,
  useEffect,
  useState,
  useCallback,
} from 'react'
import supabase from '@/lib/supabase'

export type Role = 'user' | 'seller' | 'delivery'

export interface AppUser {
  id: string
  email: string
  name: string
  role: Role
}

type AuthContextType = {
  user: AppUser | null
  loading: boolean
  login: (email: string, password: string) => Promise<void>
  register: (
    name: string,
    email: string,
    password: string,
    role: Role
  ) => Promise<void>
  logout: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = useCallback(async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) return null
    return data as AppUser
  }, [])

  useEffect(() => {
    const init = async () => {
      setLoading(true)

      const {
        data: { session },
      } = await supabase.auth.getSession()

      if (session?.user) {
        const profile = await fetchProfile(session.user.id)
        setUser(profile)
      }

      setLoading(false)
    }

    init()
  }, [fetchProfile])

  // ✅ LOGIN
  const login = async (email: string, password: string) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email,
        password,
      })

      if (error) throw error

      if (data.user) {
        const profile = await fetchProfile(data.user.id)
        setUser(profile)
      }
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  // ✅ REGISTER (🔥 الجديد)
  const register = async (
    name: string,
    email: string,
    password: string,
    role: Role
  ) => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email,
        password,
      })

      if (error) throw error

      const userId = data.user?.id

      if (userId) {
        // 🔥 تخزين البيانات في profiles
        const { error: dbError } = await supabase.from('profiles').insert({
          id: userId,
          name,
          email,
          role,
        })

        if (dbError) throw dbError

        // 🔥 تحديث اليوزر مباشرة بعد التسجيل
        const profile = await fetchProfile(userId)
        setUser(profile)
      }
    } catch (error) {
      throw error
    } finally {
      setLoading(false)
    }
  }

  // ✅ LOGOUT
  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
