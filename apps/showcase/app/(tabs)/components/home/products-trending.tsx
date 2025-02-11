import ProductCarousel from "./products/product-carousel"

const products = [
  {
    id: 1,
    title: "Personalized Memorial Gift For Pet Loss Music Fridge Magnet 37832",
    price: "$29.99 USD",
    originalPrice: "$37.99 USD",
    rating: 4.5,
    reviews: 184,
    imageUrl: "https://cdn.shopify.com/s/files/1/0402/7852/4065/files/37832-291690-primary-mockup.jpg?v=1738663966&width=200",
  },
  {
    id: 2,
    title: "Personalized Daily Affirmations Blanket 37797",
    price: "$24.99 USD",
    originalPrice: "$31.99 USD",
    rating: 4.5,
    reviews: 131,
    imageUrl: "https://cdn.shopify.com/s/files/1/0402/7852/4065/files/37797-291627-primary-mockup.jpg?v=1738642929&width=200",
  },
  {
    id: 3,
    title: "Personalized Family Crossword Art Print",
    price: "$24.99 USD",
    originalPrice: "$39.99 USD",
    rating: 4.5,
    reviews: 165,
    imageUrl: "https://cdn.shopify.com/s/files/1/0402/7852/4065/files/36314-280398-primary-mockup.jpg?v=1729267484&width=240",
  },
  {
    id: 4,
    title: "Personalized Baby 1st Christmas Custom",
    price: "$12.99 USD",
    originalPrice: "$25.99 USD",
    rating: 4.5,
    reviews: 80,
    imageUrl: "https://cdn.shopify.com/s/files/1/0402/7852/4065/files/36103-279064-primary-mockup.jpg?v=1728275036&width=240",
  },
  {
    id: 5,
    title: "Personalized Gift For Grandson Name Alphabet Letter Kid T Shirt - Kid Hoodie - Kid Sweatshirt",
    price: "$29.99 USD",
    originalPrice: "$45.99 USD",
    rating: 4.5,
    reviews: 92,
    imageUrl: "https://cdn.shopify.com/s/files/1/0402/7852/4065/files/37792-291470-primary-mockup.jpg?v=1738549969&width=240",
  },
  {
    id: 6,
    title: "Personalized Christmas Ornament",
    price: "$15.99 USD",
    originalPrice: "$27.99 USD",
    rating: 4.5,
    reviews: 73,
    imageUrl: "https://cdn.shopify.com/s/files/1/0402/7852/4065/files/37810-291452-primary-mockup.jpg?v=1737706053&width=240",
  },
]


export default function ProductsSection() {
  return <ProductCarousel title="Products Trending Now" products={products} />
}
