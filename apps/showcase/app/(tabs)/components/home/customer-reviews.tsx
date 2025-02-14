
import { useColorScheme } from '~/lib/useColorScheme'; 
import { useState } from "react"
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import { Star, ChevronLeft, ChevronRight } from "lucide-react-native"
import { ThemeToggle } from "~/components/ThemeToggle";

interface Review {
  id: number
  image: string
  name: string
  rating: number
  text: string
}

const reviews: Review[] = [
  {
    id: 1,
    image: "https://s3.evgcloud.net/xboostproductreviews/40278524065/20241128/75e5b9e1-f7b2-4579-b641-933f183102ab.jpg",
    name: "Bengfort Shelli",
    rating: 5,
    text: "Absolutely beautiful. Got it framed and hung for everyone to see. I love it !!!",
  },
  {
    id: 2,
    image: "https://s3.evgcloud.net/xboostproductreviews/40278524065/20241127/0d6aa033-a7a2-4c3e-a7cd-5d1775fa65fc.jpg",
    name: "Rios Nidya D",
    rating: 5,
    text: "This item was purchased as a Christmas gift for my daughter -in-law, son and family! Their names start with the letter 'A'. Loved...",
  },
  {
    id: 3,
    image: "https://s3.evgcloud.net/xboostproductreviews/40278524065/20241123/839a4215-23ea-4d48-8772-f9a46a3503cc.jpg",
    name: "Athorn Carolynn",
    rating: 5,
    text: "Absolutely lovely...exactly as I ordered.would definitely recommend",
  },
  {
    id: 4,
    image: "https://s3.evgcloud.net/xboostproductreviews/40278524065/20241122/e4ae1b23-3564-4f62-b55a-eb21080ab978.jpg",
    name: "Curnutte Kelly",
    rating: 5,
    text: "Paps will love this gift on Christmas Day.",
  },
  {
    id: 5,
    image: "https://s3.evgcloud.net/xboostproductreviews/40278524065/20240930/9678e95b-3b7f-470c-8e39-2f5ac556214a.jpg",
    name: "John Smith",
    rating: 5,
    text: "Perfect gift for the family!",
  },
  {
    id: 6,
    image: "https://s3.evgcloud.net/xboostproductreviews/40278524065/20240930/9678e95b-3b7f-470c-8e39-2f5ac556214a.jpg",
    name: "Jane Doe",
    rating: 5,
    text: "Beautiful craftsmanship and quick delivery!",
  },
  // ... other reviews
]

export default function CustomerReviews() {
  const [startIndex, setStartIndex] = useState(0)
  const { isDarkColorScheme } = useColorScheme()
  const windowWidth = Dimensions.get("window").width
  const itemsPerScreen = Math.floor(windowWidth / 300)

  const handlePrevious = () => {
    setStartIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setStartIndex((prev) => Math.min(reviews.length - itemsPerScreen, prev + 1))
  }

  return (
    <View className={`flex-1 px-4 py-8 ${isDarkColorScheme ? 'bg-gray-900' : 'bg-gray-50'}`}>
      {/* Centered Header */}
      <View className="items-center mb-8">
        <Text className={`text-4xl font-bold text-center mb-4 ${
          isDarkColorScheme ? 'text-white' : 'text-gray-900'
        }`}>
          Our Happy Customers
        </Text>
      </View>
        <TouchableOpacity>
          <Text className="text-red-600 font-medium text-right pb-6">See All</Text>
        </TouchableOpacity>

      {/* Centered Reviews Carousel */}
      <View className="relative flex items-center justify-center">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={{ 
            flexGrow: 1,
            justifyContent: 'center',
            gap: 16,
            paddingHorizontal: 16
          }}
        >
          {reviews.slice(startIndex, startIndex + itemsPerScreen).map((review) => (
            <View 
              key={review.id} 
              className={`w-[300px] rounded-lg shadow-md overflow-hidden ${
                isDarkColorScheme ? 'bg-gray-800' : 'bg-white'
              }`}
              style={{
                elevation: 4,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.1,
                shadowRadius: 4,
              }}
            >
              {/* Centered Image Container */}
              <View className="aspect-square relative flex items-center justify-center">
                <Image 
                  source={{ uri: review.image }} 
                  className="w-full h-full" 
                  resizeMode="cover"
                />
                {/* Centered Rating Stars */}
                <View className="absolute bottom-0 left-0 right-0">
                  <View className="bg-black/30 py-2">
                    <View className="flex-row justify-center items-center gap-1">
                      {Array.from({ length: 5 }).map((_, i) => (
                        <Star 
                          key={i} 
                          size={16} 
                          className="text-yellow-400 fill-yellow-400" 
                        />
                      ))}
                    </View>
                  </View>
                </View>
              </View>

              {/* Centered Review Content */}
              <View className="p-4 items-center">
                <Text className={`font-semibold mb-2 text-center ${
                  isDarkColorScheme ? 'text-white' : 'text-gray-900'
                }`}>
                  {review.name}
                </Text>
                <Text 
                  className={`text-sm text-center px-2 ${
                    isDarkColorScheme ? 'text-gray-300' : 'text-gray-600'
                  }`} 
                  numberOfLines={3}
                >
                  {review.text}
                </Text>
              </View>
            </View>
          ))}
        </ScrollView>

        {/* Centered Navigation Buttons */}
        <View className="absolute w-full flex-row justify-between px-2 z-10">
          {startIndex > 0 && (
            <TouchableOpacity
              onPress={handlePrevious}
              className={`rounded-full p-2 ${
                isDarkColorScheme ? 'bg-gray-800' : 'bg-white'
              }`}
              style={{
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
              }}
            >
              <ChevronLeft size={24} color={isDarkColorScheme ? "#fff" : "#000"} />
            </TouchableOpacity>
          )}

          {startIndex < reviews.length - itemsPerScreen && (
            <TouchableOpacity
              onPress={handleNext}
              className={`ml-auto rounded-full p-2 ${
                isDarkColorScheme ? 'bg-gray-800' : 'bg-white'
              }`}
              style={{
                elevation: 5,
                shadowColor: '#000',
                shadowOffset: { width: 0, height: 2 },
                shadowOpacity: 0.25,
                shadowRadius: 3.84,
              }}
            >
              <ChevronRight size={24} color={isDarkColorScheme ? "#fff" : "#000"} />
            </TouchableOpacity>
          )}
        </View>

        {/* Centered Pagination Dots */}
        <View className="flex-row justify-center mt-6 space-x-2">
          {reviews.map((_, index) => (
            <View
              key={index}
              className={`h-2 rounded-full ${
                index === startIndex 
                  ? `w-6 ${isDarkColorScheme ? 'bg-blue-500' : 'bg-black'}`
                  : `w-2 ${isDarkColorScheme ? 'bg-gray-700' : 'bg-gray-300'}`
              }`}
            />
          ))}
        </View>
      </View>
    </View>
  )
}