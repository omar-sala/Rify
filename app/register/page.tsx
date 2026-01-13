'use client'

import { useState } from 'react'
import { useAuth } from '../context/AuthContext'
import { useRouter } from 'next/navigation'
import { Role } from '../../src/types/auth'

export default function RegisterPage() {
  const { register } = useAuth()
  const router = useRouter()

  const [name, setName] = useState('')
  const [email, setEmail] = useState('')
  const [role, setRole] = useState<Role>('user')

  const handleRegister = () => {
    register(name, email, role)
    router.push(`/dashboard/${role}`)
  }

  return (
    <div className="max-w-md mx-auto mt-20 bg-white p-6 rounded shadow">
      <h2 className="text-xl font-bold mb-4">Register</h2>

      <input
        className="border p-2 w-full mb-3"
        placeholder="Name"
        onChange={(e) => setName(e.target.value)}
      />

      <input
        className="border p-2 w-full mb-3"
        placeholder="Email"
        onChange={(e) => setEmail(e.target.value)}
      />

      <div className="mb-4">
        <p className="font-medium mb-2">Choose Role</p>
        {['user', 'seller', 'delivery'].map((r) => (
          <label key={r} className="block">
            <input
              type="radio"
              value={r}
              checked={role === r}
              onChange={() => setRole(r as Role)}
              className="mr-2"
            />
            {r}
          </label>
        ))}
      </div>

      <button
        onClick={handleRegister}
        className="w-full bg-black text-white py-2"
      >
        Register
      </button>
    </div>
  )
}
