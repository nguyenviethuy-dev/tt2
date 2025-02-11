// "use client"

// import { useState } from "react"
// import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions } from "react-native"
// import { ChevronLeft, ChevronRight, Star } from "lucide-react-native"

// interface Product {
//   id: number
//   title: string
//   price: string
//   originalPrice: string
//   rating: number
//   reviews: number
//   imageUrl: string
// }

// interface ProductCarouselProps {
//   title: string
//   products: Product[]
// }

// export default function ProductCarousel({ title, products = [] }: ProductCarouselProps) {
//   const [startIndex, setStartIndex] = useState(0)
//   const [imageError, setImageError] = useState<Record<number, boolean>>({})
//   const windowWidth = Dimensions.get("window").width
//   const itemsPerScreen = windowWidth >= 768 ? 4 : 1

//   // Safety check for products
//   if (!Array.isArray(products) || products.length === 0) {
//     return (
//       <View className="px-4 py-8">
//         <Text className="text-2xl font-bold text-center mb-6">{title}</Text>
//         <Text className="text-center text-gray-500">No products available</Text>
//       </View>
//     )
//   }

//   const handlePrevious = () => {
//     setStartIndex((prev) => Math.max(0, prev - 1))
//   }

//   const handleNext = () => {
//     setStartIndex((prev) => Math.min(products.length - itemsPerScreen, prev + 1))
//   }

//   const handleImageError = (productId: number) => {
//     setImageError((prev) => ({
//       ...prev,
//       [productId]: true,
//     }))
//   }

//   const visibleProducts = products.slice(startIndex, startIndex + itemsPerScreen)

//   return (
//     <View className="px-4">
//       <Text className="text-2xl font-bold text-center mb-6">{title}</Text>

//       <View className="relative">
//         <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
//           {visibleProducts.map((product) => (
//             <TouchableOpacity key={product.id} className="w-[250px] bg-white rounded-lg shadow-md p-4">
//               <View className="aspect-square rounded-lg overflow-hidden mb-4">
//                 <Image
//                   source={{
//                     uri: imageError[product.id]
//                       ? "https://via.placeholder.com/250" // Fallback image
//                       : product.imageUrl,
//                   }}
//                   className="w-full h-full"
//                   resizeMode="cover"
//                   onError={() => handleImageError(product.id)}
//                 />
//               </View>

//               <View className="space-y-2">
//                 <Text className="text-sm text-gray-700" numberOfLines={2}>
//                   {product.title}
//                 </Text>
//                 <View className="flex-row items-center">
//                   {Array.from({ length: 5 }).map((_, i) => (
//                     <Star
//                       key={i}
//                       size={16}
//                       className={i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
//                     />
//                   ))}
//                   <Text className="ml-2 text-sm text-gray-500">({product.reviews})</Text>
//                 </View>
//                 <View className="flex-row items-center space-x-2">
//                   <Text className="text-lg font-bold">{product.price}</Text>
//                   <Text className="text-sm text-gray-500 line-through">{product.originalPrice}</Text>
//                 </View>
//               </View>
//             </TouchableOpacity>
//           ))}
//         </ScrollView>

//         {startIndex > 0 && (
//           <TouchableOpacity
//             onPress={handlePrevious}
//             className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 z-10"
//           >
//             <ChevronLeft size={24} color="#000" />
//           </TouchableOpacity>
//         )}

//         {startIndex < products.length - itemsPerScreen && (
//           <TouchableOpacity
//             onPress={handleNext}
//             className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 z-10"
//           >
//             <ChevronRight size={24} color="#000" />
//           </TouchableOpacity>
//         )}
//       </View>
//     </View>
//   )
// }

"use client"

import { useState } from "react"
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import { ChevronLeft, ChevronRight, Star } from "lucide-react-native"

interface Product {
  id: number
  title: string
  price: string
  originalPrice: string
  rating: number
  reviews: number
  imageUrl: string
}

interface ProductCarouselProps {
  title: string
  products: Product[]
}

export default function ProductCarousel({ title, products = [] }: ProductCarouselProps) {
  const [startIndex, setStartIndex] = useState(0)
  const windowWidth = Dimensions.get("window").width
  const itemsPerScreen = Math.floor(windowWidth / 250)

  const handlePrevious = () => {
    setStartIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setStartIndex((prev) => Math.min(products.length - itemsPerScreen, prev + 1))
  }

  if (!products.length) {
    return (
      <View className="px-4 py-8">
        <Text className="text-2xl font-bold text-center mb-6">{title}</Text>
        <Text className="text-center text-gray-500">No products available</Text>
      </View>
    )
  }

  return (
    <View className="px-4">
      <Text className="text-2xl font-bold text-center mb-6">{title}</Text>

      <View className="relative">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
          {products.map((product) => (
            <TouchableOpacity key={product.id} className="w-[250px] bg-white rounded-lg shadow-md p-4">
              <View className="aspect-square rounded-lg overflow-hidden mb-4">
                <Image
                  source={{ uri: product.imageUrl }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              </View>

              <View className="space-y-2">
                <Text className="text-sm text-gray-700" numberOfLines={2}>
                  {product.title}
                </Text>
                <View className="flex-row items-center">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star
                      key={i}
                      size={16}
                      color={i < Math.floor(product.rating) ? "#FFD700" : "#E0E0E0"}
                      fill={i < Math.floor(product.rating) ? "#FFD700" : "#E0E0E0"}
                    />
                  ))}
                  <Text className="ml-2 text-sm text-gray-500">({product.reviews})</Text>
                </View>
                <View className="flex-row items-center space-x-2">
                  <Text className="text-lg font-bold">{product.price}</Text>
                  <Text className="text-sm text-gray-500 line-through">{product.originalPrice}</Text>
                </View>
              </View>
            </TouchableOpacity>
          ))}
        </ScrollView>

        {startIndex > 0 && (
          <TouchableOpacity
            onPress={handlePrevious}
            className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 z-10"
          >
            <ChevronLeft size={24} color="#000" />
          </TouchableOpacity>
        )}

        {startIndex < products.length - itemsPerScreen && (
          <TouchableOpacity
            onPress={handleNext}
            className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 z-10"
          >
            <ChevronRight size={24} color="#000" />
          </TouchableOpacity>
        )}
      </View>
    </View>
  )
}

