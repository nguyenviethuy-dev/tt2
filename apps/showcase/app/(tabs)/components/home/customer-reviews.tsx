"use client"

import { useState } from "react"
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import { Star, ChevronLeft, ChevronRight } from "lucide-react-native"

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
  // ... other reviews
]

export default function CustomerReviews() {
  const [startIndex, setStartIndex] = useState(0)
  const windowWidth = Dimensions.get("window").width
  const itemsPerScreen = windowWidth >= 768 ? 4 : 1

  const handlePrevious = () => {
    setStartIndex((prev) => Math.max(0, prev - 1))
  }

  const handleNext = () => {
    setStartIndex((prev) => Math.min(reviews.length - itemsPerScreen, prev + 1))
  }

  return (
    <View className="px-4 py-8">
      <View className="flex-row justify-between items-center mb-6">
        <Text className="text-2xl font-bold">Our Happy Customers</Text>
        <TouchableOpacity>
          <Text className="text-red-600">See All</Text>
        </TouchableOpacity>
      </View>

      <View className="relative">
        <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={{ gap: 16 }}>
          {reviews.slice(startIndex, startIndex + itemsPerScreen).map((review) => (
            <View key={review.id} className="w-[300px] bg-white rounded-lg shadow-md overflow-hidden">
              <View className="aspect-square">
                <Image source={{ uri: review.image }} className="w-full h-full" resizeMode="cover" />
                <View className="absolute bottom-2 left-2 flex-row gap-1">
                  {Array.from({ length: 5 }).map((_, i) => (
                    <Star key={i} size={20} className="text-yellow-400 fill-yellow-400" />
                  ))}
                </View>
              </View>
              <View className="p-4">
                <Text className="font-semibold mb-2">{review.name}</Text>
                <Text className="text-gray-600 text-sm" numberOfLines={3}>
                  {review.text}
                </Text>
              </View>
            </View>
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
          disabled={startIndex >= reviews.length - itemsPerScreen}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2 z-10"
        >
          <ChevronRight size={24} color={startIndex >= reviews.length - itemsPerScreen ? "#9CA3AF" : "#000"} />
        </TouchableOpacity>
      </View>
    </View>
  )
}

