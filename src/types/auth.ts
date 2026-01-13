export type Role = 'user' | 'seller' | 'delivery'

export type User = {
  id: string
  name: string
  email: string
  role: Role
}
