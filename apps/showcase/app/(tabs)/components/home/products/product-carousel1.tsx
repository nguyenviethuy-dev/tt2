
import React, { useEffect, useRef, useCallback } from "react"
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions, Animated } from "react-native"
import { ChevronLeft, ChevronRight, Star } from "lucide-react-native"
import { useColorScheme } from "~/lib/useColorScheme"

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
  const scrollViewRef = useRef<ScrollView>(null)
  const scrollX = useRef(new Animated.Value(0)).current
  const { isDarkColorScheme } = useColorScheme()
  const currentIndexRef = useRef(0)

  useEffect(() => {
    const listenerId = scrollX.addListener(({ value }) => {
      currentIndexRef.current = Math.floor(value / (ITEM_WIDTH + ITEM_MARGIN))
    })
    return () => scrollX.removeListener(listenerId)
  }, [scrollX])

  useEffect(() => {
    const timer = setInterval(handleNext, 10000)
    return () => clearInterval(timer)
  }, [])

  const handleNext = useCallback(() => {
    const nextIndex = currentIndexRef.current + 1
    scrollViewRef.current?.scrollTo({
      x: (ITEM_WIDTH + ITEM_MARGIN) * nextIndex,
      animated: true,
    })
  }, [])

  const handlePrevious = useCallback(() => {
    const prevIndex = currentIndexRef.current - 1
    scrollViewRef.current?.scrollTo({
      x: (ITEM_WIDTH + ITEM_MARGIN) * prevIndex,
      animated: true,
    })
  }, [])

  const handleScroll = useCallback((event: any) => {
    const contentOffset = event.nativeEvent.contentOffset.x
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
  ), [isDarkColorScheme])

  if (!products.length) return null

  return (
    <View>
      <Text className={`text-xl font-semibold text-center mb-6 ${isDarkColorScheme ? "text-white" : "text-gray-900"}`}>
        {title}
      </Text>

      <View className="relative">
        <Animated.ScrollView
          ref={scrollViewRef}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{
            paddingHorizontal: (Dimensions.get("window").width - ITEM_WIDTH) / 2 - ITEM_MARGIN / 2,
          }}
          snapToInterval={ITEM_WIDTH + ITEM_MARGIN}
          decelerationRate="fast"
          onScroll={Animated.event(
            [{ nativeEvent: { contentOffset: { x: scrollX } } }],
            { useNativeDriver: false, listener: handleScroll }
          )}
          scrollEventThrottle={16}
        >
          {products.map((product, index) => renderProduct(product, index))}
        </Animated.ScrollView>

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
              currentIndexRef.current % products.length === index
                ? `w-6 ${isDarkColorScheme ? "bg-blue-500" : "bg-black"}`
                : `w-2 ${isDarkColorScheme ? "bg-gray-700" : "bg-gray-300"}`
            }`}
          />
        ))}
      </View>
    </View>
  )
}