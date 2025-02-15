"use client"

import { useColorScheme } from "~/lib/useColorScheme"
import { useState, useRef, useCallback } from "react"
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import { ChevronLeft, ChevronRight, Star } from "lucide-react-native"

type Product = {
  id: number
  title: string
  price: string
  originalPrice: string
  rating: number
  reviews: number
  imageUrl: string
}

type ProductCarouselProps = {
  title: string
  products: Product[]
  isLargeScreen: boolean
  isDarkMode?: boolean
}

const ITEM_WIDTH = Dimensions.get("window").width * 0.8
const ITEM_MARGIN = 10

export default function ProductCarousel({ title, products = [] }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const scrollViewRef = useRef<ScrollView>(null)
  const { isDarkColorScheme } = useColorScheme()

  const extendedProducts = [...products, ...products, ...products]

  const handleNext = useCallback(() => {
    const nextIndex = (currentIndex + 1) % products.length
    setCurrentIndex(nextIndex)
    scrollViewRef.current?.scrollTo({
      x: (ITEM_WIDTH + ITEM_MARGIN) * (nextIndex + products.length),
      animated: true,
    })
  }, [currentIndex, products.length])

  const handlePrevious = useCallback(() => {
    const prevIndex = (currentIndex - 1 + products.length) % products.length
    setCurrentIndex(prevIndex)
    scrollViewRef.current?.scrollTo({
      x: (ITEM_WIDTH + ITEM_MARGIN) * (prevIndex + products.length),
      animated: true,
    })
  }, [currentIndex, products.length])

  const handleScroll = useCallback((event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x
    const index = Math.round(contentOffset / (ITEM_WIDTH + ITEM_MARGIN)) % products.length
    setCurrentIndex(index)

    if (contentOffset <= (ITEM_WIDTH + ITEM_MARGIN) * products.length) {
      scrollViewRef.current?.scrollTo({
        x: contentOffset + (ITEM_WIDTH + ITEM_MARGIN) * products.length,
        animated: false,
      })
    } else if (contentOffset >= (ITEM_WIDTH + ITEM_MARGIN) * products.length * 2) {
      scrollViewRef.current?.scrollTo({
        x: contentOffset - (ITEM_WIDTH + ITEM_MARGIN) * products.length,
        animated: false,
      })
    }
  }, [products.length])

  const renderProduct = useCallback((product: Product, index: number) => (
    <View
      key={`${product.id}-${index}`}
      style={{
        width: ITEM_WIDTH,
        marginHorizontal: ITEM_MARGIN / 2,
        opacity: index % products.length === currentIndex ? 1 : 0.7,
        transform: [{ scale: index % products.length === currentIndex ? 1 : 0.9 }],
      }}
    >
      <TouchableOpacity className={`rounded-2xl shadow-lg p-4 ${isDarkColorScheme ? "bg-gray-800" : "bg-white"}`}>
        <View>
          <Image
            source={{ uri: product.imageUrl }}
            style={{ width: "100%", aspectRatio: 1, borderRadius: 12 }}
            resizeMode="cover"
          />
          <View className="absolute top-2 right-2 bg-red-500 px-3 py-1 rounded-full">
            <Text className="text-white text-xs">SALE</Text>
          </View>
        </View>

        <View className="mt-4">
          <Text
            className={`text-base font-medium ${isDarkColorScheme ? "text-gray-100" : "text-gray-800"}`}
            numberOfLines={2}
          >
            {product.title}
          </Text>

          <View className="flex-row items-center mt-2">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={16}
                color={i < Math.floor(product.rating) ? "#FFA500" : "#E0E0E0"}
                fill={i < Math.floor(product.rating) ? "#FFA500" : "#E0E0E0"}
              />
            ))}
            <Text className="ml-2 text-sm text-gray-600">({product.reviews})</Text>
          </View>

          <View className="flex-row items-center justify-between mt-2">
            <Text className={`text-xl font-bold ${isDarkColorScheme ? "text-white" : "text-gray-900"}`}>
              {product.price}
            </Text>
            <Text className="text-sm text-gray-500 line-through">{product.originalPrice}</Text>
          </View>

          <TouchableOpacity className="mt-4 bg-black py-3 rounded-xl" activeOpacity={0.8}>
            <Text className="text-white text-center font-semibold">Add to Cart</Text>
          </TouchableOpacity>
        </View>
      </TouchableOpacity>
    </View>
  ), [currentIndex, products.length, isDarkColorScheme])

  if (!products.length) return null

  return (
    <View>
      <Text className={`text-xl font-semibold text-center mb-6 ${isDarkColorScheme ? "text-white" : "text-gray-900"}`}>
        {title}
      </Text>

      <View className="relative">
        <ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: (Dimensions.get("window").width - ITEM_WIDTH) / 2 - ITEM_MARGIN / 2,
          }}
          snapToInterval={ITEM_WIDTH + ITEM_MARGIN}
          decelerationRate="fast"
          onScroll={handleScroll}
          scrollEventThrottle={16}
        >
          {extendedProducts.map((product, index) => renderProduct(product, index))}
        </ScrollView>

        <TouchableOpacity
          onPress={handlePrevious}
          className={`absolute left-0 top-1/2 -translate-y-1/2 rounded-full p-2 ${
            isDarkColorScheme ? "bg-gray-800" : "bg-white"
          }`}
          style={{ left: 10, elevation: 5 }}
        >
          <ChevronLeft size={24} color={isDarkColorScheme ? "#fff" : "#000"} />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          className={`absolute right-0 top-1/2 -translate-y-1/2 rounded-full p-2 ${
            isDarkColorScheme ? "bg-gray-800" : "bg-white"
          }`}
          style={{ right: 10, elevation: 5 }}
        >
          <ChevronRight size={24} color={isDarkColorScheme ? "#fff" : "#000"} />
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-center mt-6 space-x-2">
        {products.map((_, index) => (
          <View
            key={`dot-${index}`}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentIndex === index
                ? `w-6 ${isDarkColorScheme ? "bg-blue-500" : "bg-black"}`
                : `w-2 ${isDarkColorScheme ? "bg-gray-700" : "bg-gray-300"}`
            }`}
          />
        ))}
      </View>
    </View>
  )
}