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

export default function ProductCarousel({ title, products }: ProductCarouselProps) {
  const [startIndex, setStartIndex] = useState(0)
  const windowWidth = Dimensions.get("window").width
  const itemsPerScreen = windowWidth >= 768 ? 4 : 1

  const handlePrevious = () => {
    setStartIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setStartIndex((prev) => Math.min(products.length - itemsPerScreen, prev + 1))
  }

  return (
    <View className="px-4">
      <Text className="text-2xl font-bold text-center mb-6">{title}</Text>

      <View className="relative">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
          {products.slice(startIndex, startIndex + itemsPerScreen).map((product) => (
            <TouchableOpacity key={product.id} className="w-[250px] bg-white rounded-lg shadow-md p-4">
              <View className="aspect-square rounded-lg overflow-hidden mb-4">
                <Image source={{ uri: product.imageUrl }} className="w-full h-full" resizeMode="cover" />
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
                      className={i < Math.floor(product.rating) ? "text-yellow-400 fill-yellow-400" : "text-gray-300"}
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

        <TouchableOpacity
          onPress={handlePrevious}
          disabled={startIndex === 0}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 z-10"
        >
          <ChevronLeft size={24} color={startIndex === 0 ? "#9CA3AF" : "#000"} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          disabled={startIndex >= products.length - itemsPerScreen}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 z-10"
        >
          <ChevronRight size={24} color={startIndex >= products.length - itemsPerScreen ? "#9CA3AF" : "#000"} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

