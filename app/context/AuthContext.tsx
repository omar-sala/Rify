'use client'

import { createContext, useContext, useEffect, useState } from 'react'
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

const AuthContext = createContext<AuthContextType>({} as AuthContextType)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()
    return error ? null : (data as AppUser)
  }

  useEffect(() => {
    const initAuth = async () => {
      const {
        data: { session },
      } = await supabase.auth.getSession()
      if (session?.user) {
        const profile = await fetchProfile(session.user.id)
        setUser(profile)
      }
      setLoading(false)
    }
    initAuth()

    const { data: listener } = supabase.auth.onAuthStateChange(
      async (event, session) => {
        if (session?.user) {
          const profile = await fetchProfile(session.user.id)
          setUser(profile)
        } else {
          setUser(null)
        }
        setLoading(false)
      }
    )

    return () => listener.subscription.unsubscribe()
  }, [])

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
    // 1. إنشاء الحساب
    const { data: signUpData, error: signUpError } = await supabase.auth.signUp(
      {
        email,
        password,
        options: { data: { name, role } },
      }
    )

    if (signUpError) throw signUpError
    if (!signUpData.user) throw new Error('فشل إنشاء المستخدم')

    // 2. إدخال البيانات في Profiles
    // جربنا نحط البيانات في مصفوفة [] لضمان قبولها
    const { error: insertError } = await supabase
      .from('profiles')
      .insert([{ id: signUpData.user.id, name, email, role }])

    if (insertError) throw insertError

    // 3. محاولة تسجيل الدخول لإنشاء جلسة فورية
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

export const useAuth = () => useContext(AuthContext)
