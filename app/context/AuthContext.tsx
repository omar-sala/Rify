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

const AuthContext = createContext<AuthContextType | null>(null)

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<AppUser | null>(null)
  const [loading, setLoading] = useState(true)

  const fetchProfile = async (userId: string) => {
    const { data, error } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (error) return null
    return data as AppUser
  }

  useEffect(() => {
    let isMounted = true

    const init = async () => {
      const { data } = await supabase.auth.getSession()

      if (!isMounted) return

      if (data.session?.user) {
        const profile = await fetchProfile(data.session.user.id)
        if (isMounted) setUser(profile)
      }

      if (isMounted) setLoading(false)
    }

    init()

    const {
      data: { subscription },
    } = supabase.auth.onAuthStateChange(async (_, session) => {
      if (!isMounted) return

      if (session?.user) {
        const profile = await fetchProfile(session.user.id)
        setUser(profile)
      } else {
        setUser(null)
      }

      setLoading(false)
    })

    return () => {
      isMounted = false
      subscription.unsubscribe()
    }
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
    const { data, error } = await supabase.auth.signUp({
      email,
      password,
      options: { data: { name, role } },
    })

    if (error) throw error
    if (!data.user) throw new Error('فشل إنشاء المستخدم')

    const { error: insertError } = await supabase
      .from('profiles')
      .insert([{ id: data.user.id, name, email, role }])

    if (insertError) throw insertError

    await login(email, password)
  }

  const logout = async () => {
    await supabase.auth.signOut()
    setUser(null)
  }

  const value: AuthContextType = {
    user,
    loading,
    login,
    register,
    logout,
  }

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) throw new Error('useAuth must be used inside AuthProvider')
  return context
}
