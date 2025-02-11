import ProductCarousel from "./product-carousel"

const products = [
  {
    id: 1,
    title: "Personalized Memorial Gift For Pet Loss Music Fridge Magnet 37832",
    price: "$29.99 USD",
    originalPrice: "$37.99 USD",
    rating: 4.5,
    reviews: 184,
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0402/7852/4065/files/37832-291690-primary-mockup.jpg?v=1738663966&width=200",
  },
  // ... other products
]

export default function ProductsNewArrivals() {
  return <ProductCarousel title="New Arrivals" products={products} />
}

