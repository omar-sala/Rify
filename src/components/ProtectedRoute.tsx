'use client'

import { useAuth } from '../../app/context/AuthContext'
import { useRouter } from 'next/navigation'
import { useEffect } from 'react'
import { Role } from '../types/auth'

export default function ProtectedRoute({
  children,
  allowed,
}: {
  children: React.ReactNode
  allowed: Role[]
}) {
  const { user } = useAuth()
  const router = useRouter()

  useEffect(() => {
    if (!user) router.push('/login')
    else if (!allowed.includes(user.role)) router.push('/login')
  }, [user])

  if (!user || !allowed.includes(user.role)) return null

  return <>{children}</>
}
