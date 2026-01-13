'use client'

import { createContext, useContext, useEffect, useState } from 'react'
import { User, Role } from '../../src/types/auth'

type AuthContextType = {
  user: User | null
  login: (email: string) => void
  register: (name: string, email: string, role: Role) => void
  logout: () => void
}

const AuthContext = createContext<AuthContextType | null>(null)

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null)

  useEffect(() => {
    const stored = localStorage.getItem('user')
    if (stored) setUser(JSON.parse(stored))
  }, [])

  const login = (email: string) => {
    const stored = localStorage.getItem('user')
    if (!stored) return
    setUser(JSON.parse(stored))
  }

  const register = (name: string, email: string, role: Role) => {
    const fakeUser: User = {
      id: Date.now().toString(),
      name,
      email,
      role,
    }
    localStorage.setItem('user', JSON.stringify(fakeUser))
    setUser(fakeUser)
  }

  const logout = () => {
    localStorage.removeItem('user')
    setUser(null)
  }

  return (
    <AuthContext.Provider value={{ user, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const ctx = useContext(AuthContext)
  if (!ctx) throw new Error('useAuth must be used inside AuthProvider')
  return ctx
}
