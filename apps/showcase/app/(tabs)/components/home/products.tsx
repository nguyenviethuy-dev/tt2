import ProductCarousel from "./product-carousel"

const products = [
  {
    id: 1,
    title: "Personalized Family Crossword Art - Perfect Gift",
    price: "$24.99 USD",
    originalPrice: "$39.99 USD",
    rating: 4.5,
    reviews: 184,
    imageUrl:
      "https://cdn.shopify.com/s/files/1/0402/7852/4065/files/36046-278882-primary-mockup.jpg?v=1728092598&width=240",
  },
  // ... other products
]

export default function ProductsSection() {
  return <ProductCarousel title="Products" products={products} />
}

