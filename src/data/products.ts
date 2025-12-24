import { Product } from '../types/product'

export const products: Product[] = [
  {
    id: 1,
    name: 'سمنة بلدي',
    price: 120,
    unit: 'كجم',
    seller: {
      id: 1,
      name: 'أم حسن',
      distance: 2,
      image: '/sellers/samna.jpg',
    },
  },
  {
    id: 2,
    name: 'فطير بلدي',
    price: 40,
    unit: 'قطعة',
    seller: {
      id: 2,
      name: 'أبو علي',
      distance: 5,
      image: '/sellers/feteer.jpg',
    },
  },
  {
    id: 3,
    name: 'جبنة قريش',
    price: 70,
    unit: 'كجم',
    seller: {
      id: 3,
      name: 'أم محمود',
      distance: 3,
      image: '/sellers/cheese.jpg',
    },
  },
  {
    id: 4,
    name: 'عسل نحل',
    price: 180,
    unit: 'كجم',
    seller: {
      id: 4,
      name: 'جمعة ابو جاد',
      distance: 7,
      image: '/sellers/honey.jpg',
    },
  },
]
