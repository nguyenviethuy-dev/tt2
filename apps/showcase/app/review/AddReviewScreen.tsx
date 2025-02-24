
import { useState, useEffect } from "react"
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  ScrollView,
  Alert,
  SafeAreaView,
  Platform,
  KeyboardAvoidingView,
  Modal,
  FlatList,
  Image,
} from "react-native"
import { useColorScheme } from "~/lib/useColorScheme"
import { router } from "expo-router"
import { Star, ChevronDown, Camera } from "lucide-react-native"
import { addReview, getCurrentUTCDateTime } from "./data/reviews"
import * as ImagePicker from "expo-image-picker"
import products from "~/app/product-scr/data/products"
import { auth } from "~/app/services/firebaseConfig"
import { onAuthStateChanged, type User } from "firebase/auth"
import AuthModal from "../(tabs)/components/home/AuthModal"

// Function to get day name
const getDayName = () => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
  return days[new Date().getUTCDay()]
}

export default function AddReviewScreen() {
  const { isDarkColorScheme } = useColorScheme()
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [user, setUser] = useState<User | null>(null)
  const [name, setName] = useState("")
  const [review, setReview] = useState("")
  const [rating, setRating] = useState(0)
  const [currentDateTime, setCurrentDateTime] = useState(getCurrentUTCDateTime())
  const [currentDay, setCurrentDay] = useState(getDayName())
  const [selectedProduct, setSelectedProduct] = useState(null)
  const [isModalVisible, setModalVisible] = useState(false)
  const [images, setImages] = useState([])

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(getCurrentUTCDateTime())
      setCurrentDay(getDayName())
    }, 1000)

    return () => clearInterval(timer)
  }, [])

  useEffect(() => {
    // Check authentication status when component mounts
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser)
      setIsAuthenticated(!!currentUser)
      if (!currentUser) {
        // Show alert before opening auth modal
        Alert.alert(
          "Login Required",
          "You need to be logged in to write a review.",
          [
            {
              text: "Cancel",
              onPress: () => router.back(),
              style: "cancel"
            },
            {
              text: "Login",
              onPress: () => setIsAuthModalOpen(true),
            }
          ]
        );
      }
    })
      return () => unsubscribe()
    }, [])

  const handleAuthStateChange = (user: User | null) => {
    setUser(user)
    setIsAuthenticated(!!user)
    if (user) {
      setIsAuthModalOpen(false)
    }
  }

  const handleSubmit = () => {
    if (!name.trim()) {
      Alert.alert("Error", "Please enter your name")
      return
    }
    if (!review.trim()) {
      Alert.alert("Error", "Please write your review")
      return
    }
    if (rating === 0) {
      Alert.alert("Error", "Please select a rating")
      return
    }
    if (!selectedProduct) {
      Alert.alert("Error", "Please select a product")
      return
    }

    const newReview = {
      id: Date.now(),
      name: name.trim(),
      text: review.trim(),
      rating,
      image: images.length > 0 ? images[0] : "default_image_url",
      images: images,
      date: currentDateTime,
      userLogin: "nguyenviethuy-dev",
      productId: selectedProduct.id,
    }

    addReview(newReview)
    Alert.alert("Success", "Your review has been submitted successfully!", [
      { text: "OK", onPress: () => router.back() },
    ])
  }

  const RatingStars = () => (
    <View className="flex-row justify-center space-x-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => setRating(star)} className="p-2">
          <Star size={32} color={star <= rating ? "#FFC107" : "#D1D5DB"} fill={star <= rating ? "#FFC107" : "none"} />
        </TouchableOpacity>
      ))}
    </View>
  )

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedProduct(item)
        setModalVisible(false)
      }}
      className={`p-4 border-b ${isDarkColorScheme ? "border-gray-700" : "border-gray-200"}`}
    >
      <Text className={isDarkColorScheme ? "text-white" : "text-black"}>{item.name}</Text>
    </TouchableOpacity>
  )

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 1,
    })

    if (!result.canceled) {
      setImages([...images, result.assets[0].uri])
    }
  }

  if (!isAuthenticated) {
    return (
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false)
          router.back() // Go back if the user closes the modal without authenticating
        }}
        isDarkColorScheme={isDarkColorScheme}
        onAuthStateChange={handleAuthStateChange}
      />
    )
  }

  return (
    <SafeAreaView className={`flex-1 ${isDarkColorScheme ? "bg-gray-900" : "bg-gray-50"}`}>
      <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
        <ScrollView className="flex-1">
          <View className="p-4 space-y-6">
            {/* Current Date/Time Display */}
            <View className={`p-4 rounded-lg ${isDarkColorScheme ? "bg-gray-800" : "bg-gray-100"}`}>
              <Text className={`text-center font-medium ${isDarkColorScheme ? "text-gray-300" : "text-gray-700"}`}>
                {currentDay}
              </Text>
              <Text className={`text-center text-sm ${isDarkColorScheme ? "text-gray-400" : "text-gray-600"}`}>
                {currentDateTime} (UTC)
              </Text>
            </View>

            {/* Product Selection */}
            <View>
              <Text className={`text-lg font-semibold mb-2 ${isDarkColorScheme ? "text-white" : "text-gray-900"}`}>
                Select Product
              </Text>
              <TouchableOpacity
                onPress={() => setModalVisible(true)}
                className={`p-4 rounded-lg flex-row justify-between items-center ${
                  isDarkColorScheme ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                } border`}
              >
                <Text className={isDarkColorScheme ? "text-white" : "text-black"}>
                  {selectedProduct ? selectedProduct.name : "Select a product"}
                </Text>
                <ChevronDown color={isDarkColorScheme ? "#fff" : "#000"} />
              </TouchableOpacity>
            </View>

            {/* Rating Section */}
            <View>
              <Text
                className={`text-lg font-semibold mb-2 text-center ${
                  isDarkColorScheme ? "text-white" : "text-gray-900"
                }`}
              >
                Tap to Rate
              </Text>
              <RatingStars />
              {rating > 0 && (
                <Text className={`text-center mt-2 ${isDarkColorScheme ? "text-gray-400" : "text-gray-600"}`}>
                  You've selected {rating} star{rating !== 1 ? "s" : ""}
                </Text>
              )}
            </View>

            {/* Name Input */}
            <View>
              <Text className={`text-lg font-semibold mb-2 ${isDarkColorScheme ? "text-white" : "text-gray-900"}`}>
                Your Name
              </Text>
              <TextInput
                value={name}
                onChangeText={setName}
                placeholder="Enter your name"
                placeholderTextColor={isDarkColorScheme ? "#9CA3AF" : "#6B7280"}
                className={`p-4 rounded-lg ${
                  isDarkColorScheme
                    ? "bg-gray-800 text-white border-gray-700"
                    : "bg-white text-gray-900 border-gray-200"
                } border`}
              />
            </View>

            {/* Review Input */}
            <View>
              <Text className={`text-lg font-semibold mb-2 ${isDarkColorScheme ? "text-white" : "text-gray-900"}`}>
                Your Review
              </Text>
              <TextInput
                value={review}
                onChangeText={setReview}
                placeholder="What did you like or dislike?"
                placeholderTextColor={isDarkColorScheme ? "#9CA3AF" : "#6B7280"}
                multiline
                numberOfLines={6}
                textAlignVertical="top"
                className={`p-4 rounded-lg ${
                  isDarkColorScheme
                    ? "bg-gray-800 text-white border-gray-700"
                    : "bg-white text-gray-900 border-gray-200"
                } border min-h-[150px]`}
              />
            </View>

            {/* Image Upload Section */}
            <View>
              <Text className={`text-lg font-semibold mb-2 ${isDarkColorScheme ? "text-white" : "text-gray-900"}`}>
                Add Images
              </Text>
              <TouchableOpacity
                onPress={pickImage}
                className={`p-4 rounded-lg flex-row items-center justify-center ${
                  isDarkColorScheme ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
                } border`}
              >
                <Camera className="mr-2" color={isDarkColorScheme ? "#fff" : "#000"} />
                <Text className={isDarkColorScheme ? "text-white" : "text-black"}>Add Image</Text>
              </TouchableOpacity>
              {images.length > 0 && (
                <ScrollView horizontal className="mt-4">
                  {images.map((image, index) => (
                    <Image key={index} source={{ uri: image }} className="w-20 h-20 rounded-lg mr-2" />
                  ))}
                </ScrollView>
              )}
            </View>

            {/* User Info */}
            <View className={`p-4 rounded-lg ${isDarkColorScheme ? "bg-gray-800" : "bg-gray-100"}`}>
              <Text className={`text-sm ${isDarkColorScheme ? "text-gray-400" : "text-gray-600"}`}>
                {/* Posting as: nguyenviethuy-dev */}
                Posting as: {user?.displayName || user?.email || "Anonymous User"}
              </Text>
            </View>
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View className={`p-4 border-t ${isDarkColorScheme ? "border-gray-800" : "border-gray-200"}`}>
          <TouchableOpacity
            onPress={handleSubmit}
            className={`p-4 rounded-lg ${
              rating === 0 || !selectedProduct ? "bg-gray-400" : isDarkColorScheme ? "bg-blue-600" : "bg-blue-500"
            }`}
            disabled={rating === 0 || !selectedProduct}
          >
            <Text className="text-white font-semibold text-lg text-center">
              {rating === 0 ? "Please Select Rating" : "Submit Review"}
            </Text>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>

      {/* Product Selection Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalVisible}
        onRequestClose={() => setModalVisible(false)}
      >
        <View className="flex-1 justify-end">
          <View className={`rounded-t-lg ${isDarkColorScheme ? "bg-gray-800" : "bg-white"}`}>
            <View className="p-4 border-b border-gray-200">
              <Text className={`text-lg font-semibold ${isDarkColorScheme ? "text-white" : "text-black"}`}>
                Select a Product
              </Text>
            </View>
            <FlatList
              data={products}
              renderItem={renderProductItem}
              keyExtractor={(item) => item.id.toString()}
              className="max-h-80"
            />
            <TouchableOpacity
              onPress={() => setModalVisible(false)}
              className={`p-4 ${isDarkColorScheme ? "bg-gray-700" : "bg-gray-200"}`}
            >
              <Text className={`text-center ${isDarkColorScheme ? "text-white" : "text-black"}`}>Cancel</Text>
            </TouchableOpacity>
          </View>
        </View>
      </Modal>
    </SafeAreaView>
  )
}

