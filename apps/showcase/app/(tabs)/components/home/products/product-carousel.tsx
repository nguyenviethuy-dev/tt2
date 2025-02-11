import { useState } from "react"
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import { ChevronLeft, ChevronRight, Star } from "lucide-react-native"

type ProductCarouselProps = {
  title: string;
  products: {
    id: number;
    title: string;
    price: string;
    originalPrice: string;
    rating: number;
    reviews: number;
    imageUrl: string;
  }[];
  isLargeScreen: boolean;
};

export default function ProductCarousel({ title, products = [] }: ProductCarouselProps) {
  const [currentIndex, setCurrentIndex] = useState(0)
  const windowWidth = Dimensions.get("window").width

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : products.length - 1))
  }

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < products.length - 1 ? prev + 1 : 0))
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

      <View className="relative flex items-center justify-center">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ 
            alignItems: 'center',
            justifyContent: 'center',
            width: windowWidth,
          }}
          scrollEnabled={false}
        >
          <TouchableOpacity 
            key={products[currentIndex].id} 
            className="w-[250px] bg-white rounded-lg shadow-md p-4"
            style={{
              marginHorizontal: (windowWidth - 250) / 2,
            }}
          >
            <View className="aspect-square rounded-lg overflow-hidden mb-4">
              <Image
                source={{ uri: products[currentIndex].imageUrl }}
                style={{ width: "100%", height: "100%" }}
                resizeMode="cover"
              />
            </View>

            <View className="space-y-2">
              <Text className="text-sm text-gray-700" numberOfLines={2}>
                {products[currentIndex].title}
              </Text>
              <View className="flex-row items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    color={i < Math.floor(products[currentIndex].rating) ? "#FFD700" : "#E0E0E0"}
                    fill={i < Math.floor(products[currentIndex].rating) ? "#FFD700" : "#E0E0E0"}
                  />
                ))}
                <Text className="ml-2 text-sm text-gray-500">({products[currentIndex].reviews})</Text>
              </View>
              <View className="flex-row items-center space-x-2">
                <Text className="text-lg font-bold">{products[currentIndex].price}</Text>
                <Text className="text-sm text-gray-500 line-through">{products[currentIndex].originalPrice}</Text>
              </View>
            </View>
          </TouchableOpacity>
        </ScrollView>

        <TouchableOpacity
          onPress={handlePrevious}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-3 z-10"
          style={{
            left: (windowWidth - 290) / 2,
            elevation: 3,
          }}
        >
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-3 z-10"
          style={{
            right: (windowWidth - 290) / 2,
            elevation: 3,
          }}
        >
          <ChevronRight size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-center mt-4 space-x-1">
        {products.map((_, index) => (
          <View
            key={index}
            className={`h-2 rounded-full ${
              currentIndex === index ? 'w-6 bg-black' : 'w-2 bg-gray-300'
            }`}
          />
        ))}
      </View>
    </View>
  )
}