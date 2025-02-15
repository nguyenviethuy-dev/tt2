

import { useColorScheme } from "~/lib/useColorScheme"
import { useState, useEffect } from "react"
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import { ChevronLeft, ChevronRight, Star } from "lucide-react-native"

type ProductCarouselProps = {
  title: string
  products: {
    id: number
    title: string
    price: string
    originalPrice: string
    rating: number
    reviews: number
    imageUrl: string
  }[]
  isLargeScreen: boolean
  isDarkMode?: boolean
}

export default function ProductCarousel({ title, products = [] }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const windowWidth = Dimensions.get("window").width
  const { isDarkColorScheme } = useColorScheme()

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : products.length - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < products.length - 1 ? prev + 1 : 0))
  }

  useEffect(() => {
    const timer = setInterval(() => {
      handleNext()
    }, 10000) // Change product every 10 seconds

    return () => clearInterval(timer)
  }, [products]); // Added handleNext and products to dependencies

  if (!products.length) {
    return (
      <View className="px-4 py-6">
        <Text className={`text-2xl font-bold justify-center ${isDarkColorScheme ? "text-white" : "text-gray-900"}`}>
          {title}
        </Text>
        <Text className={`text-center ${isDarkColorScheme ? "text-gray-400" : "text-gray-500"}`}>
          No products available
        </Text>
      </View>
    )
  }

  const calculateDiscount = (original: string, current: string) => {
    const originalPrice = Number.parseFloat(original.replace("$", ""))
    const currentPrice = Number.parseFloat(current.replace("$", ""))
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100)
  }

  return (
    <View className={`px-4 py-6 ${isDarkColorScheme ? "bg-gray-900" : "bg-gray-50"}`}>
      <Text className={`text-2xl font-semibold text-center mb-8 ${isDarkColorScheme ? "text-white" : "text-gray-900"}`}>
        {title}
      </Text>

      <View className="relative flex items-center justify-center">
        <ScrollView
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            alignItems: "center",
            justifyContent: "center",
            width: windowWidth,
          }}
          scrollEnabled={false}
        >
          <TouchableOpacity
            key={products[currentIndex].id}
            className={`w-[340px] rounded-3xl shadow-lg p-6 ${isDarkColorScheme ? "bg-gray-800" : "bg-white"}`}
            style={{
              marginHorizontal: (windowWidth - 340) / 2,
              elevation: 6,
            }}
          >
            <View className="relative">
              <View className="aspect-square rounded-2xl overflow-hidden mb-6">
                <Image
                  source={{ uri: products[currentIndex].imageUrl }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              </View>
              <View className="absolute top-3 right-3 bg-red-500 px-4 py-2 rounded-full">
                <Text className="text-white text-sm font-semibold">
                  {calculateDiscount(products[currentIndex].originalPrice, products[currentIndex].price)}% OFF
                </Text>
              </View>
            </View>

            <View className="space-y-4">
              <Text
                className={`text-xl font-medium ${isDarkColorScheme ? "text-gray-100" : "text-gray-800"}`}
                numberOfLines={2}
              >
                {products[currentIndex].title}
              </Text>

              <View className="flex-row items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={20}
                    color={i < Math.floor(products[currentIndex].rating) ? "#FFA500" : "#E0E0E0"}
                    fill={i < Math.floor(products[currentIndex].rating) ? "#FFA500" : "#E0E0E0"}
                  />
                ))}
                <Text className="ml-2 text-base text-gray-600">({products[currentIndex].reviews})</Text>
              </View>

              <View className="flex-row items-center justify-between">
                <Text className={`text-2xl font-bold ${isDarkColorScheme ? "text-white" : "text-gray-900"}`}>
                  {products[currentIndex].price}
                </Text>
                <Text className="text-base text-gray-500 line-through">{products[currentIndex].originalPrice}</Text>
              </View>

              <TouchableOpacity className="mt-4 bg-black py-4 rounded-xl" activeOpacity={0.8}>
                <Text className="text-white text-center font-semibold text-lg">Add to Cart</Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </ScrollView>

        {/* Navigation buttons */}
        <TouchableOpacity
          onPress={handlePrevious}
          className={`absolute left-0 top-1/2 -translate-y-1/2 rounded-full p-3 ${
            isDarkColorScheme ? "bg-gray-800" : "bg-white"
          }`}
          style={{
            left: (windowWidth - 400) / 2,
            elevation: 5,
          }}
        >
          <ChevronLeft size={28} color={isDarkColorScheme ? "#fff" : "#000"} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          className={`absolute right-0 top-1/2 -translate-y-1/2 rounded-full p-3 ${
            isDarkColorScheme ? "bg-gray-800" : "bg-white"
          }`}
          style={{
            right: (windowWidth - 400) / 2,
            elevation: 5,
          }}
        >
          <ChevronRight size={28} color={isDarkColorScheme ? "#fff" : "#000"} />
        </TouchableOpacity>
      </View>

      {/* Pagination dots */}
      <View className="flex-row justify-center mt-8 space-x-2">
        {products.map((_, index) => (
          <View
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentIndex === index
                ? `w-8 ${isDarkColorScheme ? "bg-blue-500" : "bg-black"}`
                : `w-2 ${isDarkColorScheme ? "bg-gray-700" : "bg-gray-300"}`
            }`}
          />
        ))}
      </View>
    </View>
  )
}