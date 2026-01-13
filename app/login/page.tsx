'use client'

import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'

export default function LoginPage() {
  const { user, login } = useAuth()
  const router = useRouter()

  const handleLogin = () => {
    login('test@mail.com')
    if (user) router.push(`/dashboard/${user.role}`)
  }

  return (
    <div className="max-w-sm mx-auto mt-20 bg-white p-6 shadow rounded">
      <h2 className="text-xl font-bold mb-4">Login</h2>
      <button onClick={handleLogin} className="w-full bg-black text-white py-2">
        Login
      </button>
    </div>
  )
}
