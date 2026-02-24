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

  // استخدام useCallback لمنع إعادة تعريف الدالة مع كل رندر
  const fetchProfile = useCallback(async (userId: string) => {
    try {
      const { data, error } = await supabase
        .from('profiles')
        .select('*')
        .eq('id', userId)
        .single()

      if (error) return null
      return data as AppUser
    } catch {
      return null
    }
  }, [])

  useEffect(() => {
    let isMounted = true

    const initializeAuth = async () => {
      try {
        const {
          data: { session },
        } = await supabase.auth.getSession()

        if (!isMounted) return

        if (session?.user) {
          const profile = await fetchProfile(session.user.id)
          if (isMounted) setUser(profile)
        }
      } catch (err) {
        console.error('Auth init error:', err)
      } finally {
        if (isMounted) setLoading(false)
      }
    }

    initializeAuth()

    // استماع لتغييرات الجلسة بشكل أكثر استقراراً
    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!isMounted) return

      if (event === 'SIGNED_IN' || event === 'INITIAL_SESSION') {
        if (session?.user) {
          const profile = await fetchProfile(session.user.id)
          setUser(profile)
        }
      } else if (event === 'SIGNED_OUT') {
        setUser(null)
      }

      setLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
  }, [fetchProfile])

  const login = async (email: string, password: string) => {
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    })
    if (error) throw error
  }

  const register = async (
    name: string,
    email: string,
    password: string,
    role: Role
  ) => {
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role } },
    })

    if (error) throw error
    if (!data.user) throw new Error('فشل إنشاء المستخدم')

    const { error: insertError } = await supabase
      .from('profiles')
      .insert([{ id: data.user.id, name, email, role } as any])

    if (insertError) throw insertError
    await login(email, password)
  }

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
