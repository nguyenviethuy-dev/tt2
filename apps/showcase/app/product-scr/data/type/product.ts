export interface Product {
  id: number
  name: string
  price: number
  originalPrice?: number
  rating?: number
  reviews?: number
  image: string
  image1?: string
  productType?: string
  occasions?: string[]
  giftFor?: string[]
  description?: string
  colors?: string[]
}

const ProductType = {}

export default ProductType