import { Seller } from './seller'

export interface Product {
  id: number
  name: string
  price: number
  unit: string
  seller: Seller
  quantity?: number
}
