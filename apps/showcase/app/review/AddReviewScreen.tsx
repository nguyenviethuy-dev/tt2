
// import { useState, useEffect } from "react"
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
//   SafeAreaView,
//   Platform,
//   KeyboardAvoidingView,
//   Modal,
//   FlatList,
//   Image,
// } from "react-native"
// import { useColorScheme } from "~/lib/useColorScheme"
// import { router } from "expo-router"
// import { Star, ChevronDown, Camera } from "lucide-react-native"
// import { addReview, getCurrentUTCDateTime } from "./data/reviews"
// import * as ImagePicker from "expo-image-picker"
// import products from "~/app/product-scr/data/products"
// import { auth, db } from "~/app/services/firebaseConfig"
// import { onAuthStateChanged, type User } from "firebase/auth"
// import { collection, query, where, getDocs } from "firebase/firestore"
// import AuthModal from "../(tabs)/components/home/AuthModal"

// // Function to get day name
// const getDayName = () => {
//   const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
//   return days[new Date().getUTCDay()]
// }

// export default function AddReviewScreen() {
//   const { isDarkColorScheme } = useColorScheme()
//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
//   const [user, setUser] = useState<User | null>(null)
//   const [name, setName] = useState("")
//   const [review, setReview] = useState("")
//   const [rating, setRating] = useState(0)
//   const [currentDateTime, setCurrentDateTime] = useState(getCurrentUTCDateTime())
//   const [currentDay, setCurrentDay] = useState(getDayName())
//   const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
//   const [isModalVisible, setModalVisible] = useState(false)
//   const [images, setImages] = useState<string[]>([])
//   const [orderedProductNames, setOrderedProductNames] = useState<string[]>([]) // Lưu danh sách tên sản phẩm từ orders

//   // Update time every second
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentDateTime(getCurrentUTCDateTime())
//       setCurrentDay(getDayName())
//     }, 1000)

//     return () => clearInterval(timer)
//   }, [])

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser)
//       setIsAuthenticated(!!currentUser)
//       if (!currentUser) {
//         Alert.alert(
//           "Login Required",
//           "You need to be logged in to write a review.",
//           [
//             {
//               text: "Cancel",
//               onPress: () => router.back(),
//               style: "cancel"
//             },
//             {
//               text: "Login",
//               onPress: () => setIsAuthModalOpen(true),
//             }
//           ]
//         )
//       } else {
//         fetchOrderedProducts(currentUser.uid)
//       }
//     })
//     return () => unsubscribe()
//   }, [])

//   const fetchOrderedProducts = async (uid: string) => {
//     if (!db) {
//       console.error("Firestore instance 'db' is not initialized. Check firebaseConfig.")
//       Alert.alert("Error", "Firestore is not properly configured. Please contact support.")
//       return
//     }

//     try {
//       const ordersCollection = collection(db, "orders")
//       const q = query(ordersCollection, where("uid", "==", uid))
//       const querySnapshot = await getDocs(q)
//       const productNames: string[] = []

//       querySnapshot.forEach((doc) => {
//         const orderData = doc.data()
//         const items = orderData.items || []
//         items.forEach((item: any) => {
//           productNames.push(item.name) // Lưu tên sản phẩm
//         })
//       })

//       const uniqueProductNames = [...new Set(productNames)] // Loại bỏ trùng lặp
//       setOrderedProductNames(uniqueProductNames)
//     } catch (error) {
//       console.error("Error fetching ordered products:", error)
//       Alert.alert("Error", "Failed to load your ordered products.")
//     }
//   }

//   const handleAuthStateChange = (user: User | null) => {
//     setUser(user)
//     setIsAuthenticated(!!user)
//     if (user) {
//       setIsAuthModalOpen(false)
//       fetchOrderedProducts(user.uid)
//     }
//   }

//   const handleSubmit = () => {
//     if (!name.trim()) {
//       Alert.alert("Error", "Please enter your name")
//       return
//     }
//     if (!review.trim()) {
//       Alert.alert("Error", "Please write your review")
//       return
//     }
//     if (rating === 0) {
//       Alert.alert("Error", "Please select a rating")
//       return
//     }
//     if (!selectedProduct) {
//       Alert.alert("Error", "Please select a product")
//       return
//     }

//     const newReview = {
//       id: Date.now(),
//       name: name.trim(),
//       text: review.trim(),
//       rating,
//       image: images.length > 0 ? images[0] : "default_image_url",
//       images,
//       date: currentDateTime,
//       userLogin: user?.displayName || user?.email || "Anonymous User",
//       productId: selectedProduct.id,
//     }

//     addReview(newReview)
//     Alert.alert("Success", "Your review has been submitted successfully!", [
//       { text: "OK", onPress: () => router.back() },
//     ])
//   }

//   const RatingStars = () => (
//     <View className="flex-row justify-center space-x-2">
//       {[1, 2, 3, 4, 5].map((star) => (
//         <TouchableOpacity key={star} onPress={() => setRating(star)} className="p-2">
//           <Star size={32} color={star <= rating ? "#FFC107" : "#D1D5DB"} fill={star <= rating ? "#FFC107" : "none"} />
//         </TouchableOpacity>
//       ))}
//     </View>
//   )

//   const renderProductItem = ({ item }) => (
//     <TouchableOpacity
//       onPress={() => {
//         setSelectedProduct(item)
//         setModalVisible(false)
//       }}
//       className={`p-4 border-b ${isDarkColorScheme ? "border-gray-700" : "border-gray-200"}`}
//     >
//       <Text className={isDarkColorScheme ? "text-white" : "text-black"}>{item.name}</Text>
//     </TouchableOpacity>
//   )

//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     })

//     if (!result.canceled) {
//       setImages([...images, result.assets[0].uri])
//     }
//   }

//   if (!isAuthenticated) {
//     return (
//       <AuthModal
//         isOpen={isAuthModalOpen}
//         onClose={() => {
//           setIsAuthModalOpen(false)
//           router.back()
//         }}
//         isDarkColorScheme={isDarkColorScheme}
//         onAuthStateChange={handleAuthStateChange}
//       />
//     )
//   }

//   // Lọc products dựa trên tên khớp với orderedProductNames
//   const filteredProducts = products.filter((product) =>
//     orderedProductNames.includes(product.name)
//   )

//   return (
//     <SafeAreaView className={`flex-1 ${isDarkColorScheme ? "bg-gray-900" : "bg-gray-50"}`}>
//       <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
//         <ScrollView className="flex-1">
//           <View className="p-4 space-y-6">
//             {/* Current Date/Time Display */}
//             <View className={`p-4 rounded-lg ${isDarkColorScheme ? "bg-gray-800" : "bg-gray-100"}`}>
//               <Text className={`text-center font-medium ${isDarkColorScheme ? "text-gray-300" : "text-gray-700"}`}>
//                 {currentDay}
//               </Text>
//               <Text className={`text-center text-sm ${isDarkColorScheme ? "text-gray-400" : "text-gray-600"}`}>
//                 {currentDateTime} (UTC)
//               </Text>
//             </View>

//             {/* Product Selection */}
//             <View>
//               <Text className={`text-lg font-semibold mb-2 ${isDarkColorScheme ? "text-white" : "text-gray-900"}`}>
//                 Select Product
//               </Text>
//               <TouchableOpacity
//                 onPress={() => setModalVisible(true)}
//                 className={`p-4 rounded-lg flex-row justify-between items-center ${
//                   isDarkColorScheme ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
//                 } border`}
//               >
//                 <Text className={isDarkColorScheme ? "text-white" : "text-black"}>
//                   {selectedProduct ? selectedProduct.name : "Select a product"}
//                 </Text>
//                 <ChevronDown color={isDarkColorScheme ? "#fff" : "#000"} />
//               </TouchableOpacity>
//             </View>

//             {/* Rating Section */}
//             <View>
//               <Text
//                 className={`text-lg font-semibold mb-2 text-center ${
//                   isDarkColorScheme ? "text-white" : "text-gray-900"
//                 }`}
//               >
//                 Tap to Rate
//               </Text>
//               <RatingStars />
//               {rating > 0 && (
//                 <Text className={`text-center mt-2 ${isDarkColorScheme ? "text-gray-400" : "text-gray-600"}`}>
//                   You've selected {rating} star{rating !== 1 ? "s" : ""}
//                 </Text>
//               )}
//             </View>

//             {/* Name Input */}
//             <View>
//               <Text className={`text-lg font-semibold mb-2 ${isDarkColorScheme ? "text-white" : "text-gray-900"}`}>
//                 Your Name
//               </Text>
//               <TextInput
//                 value={name}
//                 onChangeText={setName}
//                 placeholder="Enter your name"
//                 placeholderTextColor={isDarkColorScheme ? "#9CA3AF" : "#6B7280"}
//                 className={`p-4 rounded-lg ${
//                   isDarkColorScheme
//                     ? "bg-gray-800 text-white border-gray-700"
//                     : "bg-white text-gray-900 border-gray-200"
//                 } border`}
//               />
//             </View>

//             {/* Review Input */}
//             <View>
//               <Text className={`text-lg font-semibold mb-2 ${isDarkColorScheme ? "text-white" : "text-gray-900"}`}>
//                 Your Review
//               </Text>
//               <TextInput
//                 value={review}
//                 onChangeText={setReview}
//                 placeholder="What did you like or dislike?"
//                 placeholderTextColor={isDarkColorScheme ? "#9CA3AF" : "#6B7280"}
//                 multiline
//                 numberOfLines={6}
//                 textAlignVertical="top"
//                 className={`p-4 rounded-lg ${
//                   isDarkColorScheme
//                     ? "bg-gray-800 text-white border-gray-700"
//                     : "bg-white text-gray-900 border-gray-200"
//                 } border min-h-[150px]`}
//               />
//             </View>

//             {/* Image Upload Section */}
//             <View>
//               <Text className={`text-lg font-semibold mb-2 ${isDarkColorScheme ? "text-white" : "text-gray-900"}`}>
//                 Add Images
//               </Text>
//               <TouchableOpacity
//                 onPress={pickImage}
//                 className={`p-4 rounded-lg flex-row items-center justify-center ${
//                   isDarkColorScheme ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
//                 } border`}
//               >
//                 <Camera className="mr-2" color={isDarkColorScheme ? "#fff" : "#000"} />
//                 <Text className={isDarkColorScheme ? "text-white" : "text-black"}>Add Image</Text>
//               </TouchableOpacity>
//               {images.length > 0 && (
//                 <ScrollView horizontal className="mt-4">
//                   {images.map((image, index) => (
//                     <Image key={index} source={{ uri: image }} className="w-20 h-20 rounded-lg mr-2" />
//                   ))}
//                 </ScrollView>
//               )}
//             </View>

//             {/* User Info */}
//             <View className={`p-4 rounded-lg ${isDarkColorScheme ? "bg-gray-800" : "bg-gray-100"}`}>
//               <Text className={`text-sm ${isDarkColorScheme ? "text-gray-400" : "text-gray-600"}`}>
//                 Posting as: {user?.displayName || user?.email || "Anonymous User"}
//               </Text>
//             </View>
//           </View>
//         </ScrollView>

//         {/* Submit Button */}
//         <View className={`p-4 border-t ${isDarkColorScheme ? "border-gray-800" : "border-gray-200"}`}>
//           <TouchableOpacity
//             onPress={handleSubmit}
//             className={`p-4 rounded-lg ${
//               rating === 0 || !selectedProduct ? "bg-gray-400" : isDarkColorScheme ? "bg-blue-600" : "bg-blue-500"
//             }`}
//             disabled={rating === 0 || !selectedProduct}
//           >
//             <Text className="text-white font-semibold text-lg text-center">
//               {rating === 0 ? "Please Select Rating" : "Submit Review"}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>

//       {/* Product Selection Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isModalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View className="flex-1 justify-end">
//           <View className={`rounded-t-lg ${isDarkColorScheme ? "bg-gray-800" : "bg-white"}`}>
//             <View className="p-4 border-b border-gray-200">
//               <Text className={`text-lg font-semibold ${isDarkColorScheme ? "text-white" : "text-black"}`}>
//                 Select a Product
//               </Text>
//             </View>
//             <FlatList
//               data={filteredProducts} // Sử dụng danh sách đã lọc
//               renderItem={renderProductItem}
//               keyExtractor={(item) => item.id.toString()}
//               className="max-h-80"
//             />
//             <TouchableOpacity
//               onPress={() => setModalVisible(false)}
//               className={`p-4 ${isDarkColorScheme ? "bg-gray-700" : "bg-gray-200"}`}
//             >
//               <Text className={`text-center ${isDarkColorScheme ? "text-white" : "text-black"}`}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   )
// }

// import { useState, useEffect } from "react"
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
//   SafeAreaView,
//   Platform,
//   KeyboardAvoidingView,
//   Modal,
//   FlatList,
//   Image,
// } from "react-native"
// import { useColorScheme } from "~/lib/useColorScheme"
// import { router } from "expo-router"
// import { Star, ChevronDown, Camera } from "lucide-react-native"
// import { addReview, getCurrentUTCDateTime } from "./data/reviews"
// import * as ImagePicker from "expo-image-picker"
// import products from "~/app/product-scr/data/products"
// import { auth, db } from "~/app/services/firebaseConfig1"
// import { onAuthStateChanged, type User } from "firebase/auth"
// import { collection, query, where, getDocs, addDoc } from "firebase/firestore"
// import axios from "axios"
// import { IDRIVE_ACCESS_KEY_ID, IDRIVE_SECRET_ACCESS_KEY, IDRIVE_ENDPOINT, IDRIVE_BUCKET } from "@env"
// import aws4 from "aws4"
// import AuthModal from "../(tabs)/components/home/AuthModal"

// // Function to get day name
// const getDayName = () => {
//   const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"]
//   return days[new Date().getUTCDay()]
// }

// // Cấu hình IDrive e2 từ biến môi trường
// const IDRIVE_CONFIG = {
//   accessKeyId: IDRIVE_ACCESS_KEY_ID || "",
//   secretAccessKey: IDRIVE_SECRET_ACCESS_KEY || "",
//   endpoint: IDRIVE_ENDPOINT || "",
//   bucket: IDRIVE_BUCKET || "images",
//   region: "us-east-1", // Cần xác minh region từ IDrive e2
// }

// export default function AddReviewScreen() {
//   const { isDarkColorScheme } = useColorScheme()
//   const [isAuthenticated, setIsAuthenticated] = useState(false)
//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
//   const [user, setUser] = useState<User | null>(null)
//   const [name, setName] = useState("")
//   const [review, setReview] = useState("")
//   const [rating, setRating] = useState(0)
//   const [currentDateTime, setCurrentDateTime] = useState(getCurrentUTCDateTime())
//   const [currentDay, setCurrentDay] = useState(getDayName())
//   const [selectedProduct, setSelectedProduct] = useState<any | null>(null)
//   const [isModalVisible, setModalVisible] = useState(false)
//   const [images, setImages] = useState<string[]>([])
//   const [orderedProductNames, setOrderedProductNames] = useState<string[]>([])

//   // Update time every second
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentDateTime(getCurrentUTCDateTime())
//       setCurrentDay(getDayName())
//     }, 1000)

//     return () => clearInterval(timer)
//   }, [])

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser)
//       setIsAuthenticated(!!currentUser)
//       if (!currentUser) {
//         Alert.alert(
//           "Login Required",
//           "You need to be logged in to write a review.",
//           [
//             {
//               text: "Cancel",
//               onPress: () => router.back(),
//               style: "cancel"
//             },
//             {
//               text: "Login",
//               onPress: () => setIsAuthModalOpen(true),
//             }
//           ]
//         )
//       } else {
//         fetchOrderedProducts(currentUser.uid)
//       }
//     })
//     return () => unsubscribe()
//   }, [])

//   const fetchOrderedProducts = async (uid: string) => {
//     if (!db) {
//       console.error("Firestore instance 'db' is not initialized. Check firebaseConfig.")
//       Alert.alert("Error", "Firestore is not properly configured. Please contact support.")
//       return
//     }

//     try {
//       const ordersCollection = collection(db, "orders")
//       const q = query(ordersCollection, where("uid", "==", uid))
//       const querySnapshot = await getDocs(q)
//       const productNames: string[] = []

//       querySnapshot.forEach((doc) => {
//         const orderData = doc.data()
//         const items = orderData.items || []
//         items.forEach((item: any) => {
//           productNames.push(item.name)
//         })
//       })

//       const uniqueProductNames = [...new Set(productNames)]
//       setOrderedProductNames(uniqueProductNames)
//     } catch (error) {
//       console.error("Error fetching ordered products:", error)
//       Alert.alert("Error", "Failed to load your ordered products.")
//     }
//   }

//   const handleAuthStateChange = (user: User | null) => {
//     setUser(user)
//     setIsAuthenticated(!!user)
//     if (user) {
//       setIsAuthModalOpen(false)
//       fetchOrderedProducts(user.uid)
//     }
//   }

//   const uploadImageToIDrive = async (imageUri: string, maxRetries = 3) => {
//     let attempt = 0
//     while (attempt < maxRetries) {
//       try {
//         const response = await fetch(imageUri)
//         const blob = await response.blob()
//         const fileName = `reviews/${Date.now()}_${Math.random().toString(36).substring(2)}.jpg`
//         const url = `${IDRIVE_CONFIG.endpoint}/${IDRIVE_CONFIG.bucket}/${fileName}`

//         const signOptions = {
//           host: new URL(IDRIVE_CONFIG.endpoint).host,
//           path: `/${IDRIVE_CONFIG.bucket}/${fileName}`,
//           method: "PUT",
//           headers: {
//             "Content-Type": "image/jpeg",
//           },
//           body: blob,
//           service: "s3",
//           region: IDRIVE_CONFIG.region,
//         }
//         const signedRequest = aws4.sign(signOptions, {
//           accessKeyId: IDRIVE_CONFIG.accessKeyId,
//           secretAccessKey: IDRIVE_CONFIG.secretAccessKey,
//         })

//         const uploadResponse = await axios({
//           method: "PUT",
//           url,
//           data: blob,
//           headers: signedRequest.headers,
//           timeout: 10000, // Timeout 10 giây
//         })

//         if (uploadResponse.status === 200) {
//           console.log("Image uploaded successfully:", url)
//           return url
//         } else {
//           console.error("Upload failed with status:", uploadResponse.status)
//           return null
//         }
//       } catch (error) {
//         attempt++
//         console.error(`Upload attempt ${attempt} failed:`, error)
//         if (attempt === maxRetries) {
//           Alert.alert("Error", "Failed to upload image after multiple attempts. Check network or credentials.")
//           return null
//         }
//         await new Promise(resolve => setTimeout(resolve, 1000 * attempt)) // Delay tăng dần
//       }
//     }
//     return null
//   }

//   const handleSubmit = async () => {
//     if (!auth.currentUser) {
//       Alert.alert("Error", "Please log in to submit a review.")
//       return
//     }

//     if (!name.trim()) {
//       Alert.alert("Error", "Please enter your name")
//       return
//     }
//     if (!review.trim()) {
//       Alert.alert("Error", "Please write your review")
//       return
//     }
//     if (rating === 0) {
//       Alert.alert("Error", "Please select a rating")
//       return
//     }
//     if (!selectedProduct) {
//       Alert.alert("Error", "Please select a product")
//       return
//     }

//     let imageUrl = images.length > 0 ? images[0] : "default_image_url"
//     if (images.length > 0) {
//       const uploadedUrl = await uploadImageToIDrive(images[0])
//       if (uploadedUrl) {
//         imageUrl = uploadedUrl
//       }
//     }

//     // Upload tất cả ảnh và lấy các URL
//     const uploadedImages = await Promise.all(images.map(async (img) => {
//       if (img !== imageUrl) {
//         const url = await uploadImageToIDrive(img)
//         return url || img
//       }
//       return img
//     }))

//     const newReview = {
//       id: Date.now(),
//       name: name.trim(),
//       text: review.trim(),
//       rating,
//       image: imageUrl,
//       images: uploadedImages,
//       date: currentDateTime,
//       userLogin: user?.displayName || user?.email || "Anonymous User",
//       productId: selectedProduct.id,
//     }

//     try {
//       const reviewsCollection = collection(db, "reviews")
//       await addDoc(reviewsCollection, newReview)
//       Alert.alert("Success", "Your review has been submitted successfully!", [
//         { text: "OK", onPress: () => router.back() },
//       ])
//     } catch (error) {
//       console.error("Error saving review to Firestore:", error)
//       Alert.alert("Error", "Failed to submit review. Please try again.")
//     }
//   }

//   const RatingStars = () => (
//     <View className="flex-row justify-center space-x-2">
//       {[1, 2, 3, 4, 5].map((star) => (
//         <TouchableOpacity key={star} onPress={() => setRating(star)} className="p-2">
//           <Star size={32} color={star <= rating ? "#FFC107" : "#D1D5DB"} fill={star <= rating ? "#FFC107" : "none"} />
//         </TouchableOpacity>
//       ))}
//     </View>
//   )

//   const renderProductItem = ({ item }) => (
//     <TouchableOpacity
//       onPress={() => {
//         setSelectedProduct(item)
//         setModalVisible(false)
//       }}
//       className={`p-4 border-b ${isDarkColorScheme ? "border-gray-700" : "border-gray-200"}`}
//     >
//       <Text className={isDarkColorScheme ? "text-white" : "text-black"}>{item.name}</Text>
//     </TouchableOpacity>
//   )

//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 1,
//     })

//     if (!result.canceled) {
//       setImages([...images, result.assets[0].uri])
//     }
//   }

//   if (!isAuthenticated) {
//     return (
//       <AuthModal
//         isOpen={isAuthModalOpen}
//         onClose={() => {
//           setIsAuthModalOpen(false)
//           router.back()
//         }}
//         isDarkColorScheme={isDarkColorScheme}
//         onAuthStateChange={handleAuthStateChange}
//       />
//     )
//   }

//   const filteredProducts = products.filter((product) =>
//     orderedProductNames.includes(product.name)
//   )

//   return (
//     <SafeAreaView className={`flex-1 ${isDarkColorScheme ? "bg-gray-900" : "bg-gray-50"}`}>
//       <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
//         <ScrollView className="flex-1">
//           <View className="p-4 space-y-6">
//             {/* Current Date/Time Display */}
//             <View className={`p-4 rounded-lg ${isDarkColorScheme ? "bg-gray-800" : "bg-gray-100"}`}>
//               <Text className={`text-center font-medium ${isDarkColorScheme ? "text-gray-300" : "text-gray-700"}`}>
//                 {currentDay}
//               </Text>
//               <Text className={`text-center text-sm ${isDarkColorScheme ? "text-gray-400" : "text-gray-600"}`}>
//                 {currentDateTime} (UTC)
//               </Text>
//             </View>

//             {/* Product Selection */}
//             <View>
//               <Text className={`text-lg font-semibold mb-2 ${isDarkColorScheme ? "text-white" : "text-gray-900"}`}>
//                 Select Product
//               </Text>
//               <TouchableOpacity
//                 onPress={() => setModalVisible(true)}
//                 className={`p-4 rounded-lg flex-row justify-between items-center ${
//                   isDarkColorScheme ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
//                 } border`}
//               >
//                 <Text className={isDarkColorScheme ? "text-white" : "text-black"}>
//                   {selectedProduct ? selectedProduct.name : "Select a product"}
//                 </Text>
//                 <ChevronDown color={isDarkColorScheme ? "#fff" : "#000"} />
//               </TouchableOpacity>
//             </View>

//             {/* Rating Section */}
//             <View>
//               <Text
//                 className={`text-lg font-semibold mb-2 text-center ${
//                   isDarkColorScheme ? "text-white" : "text-gray-900"
//                 }`}
//               >
//                 Tap to Rate
//               </Text>
//               <RatingStars />
//               {rating > 0 && (
//                 <Text className={`text-center mt-2 ${isDarkColorScheme ? "text-gray-400" : "text-gray-600"}`}>
//                   You've selected {rating} star{rating !== 1 ? "s" : ""}
//                 </Text>
//               )}
//             </View>

//             {/* Name Input */}
//             <View>
//               <Text className={`text-lg font-semibold mb-2 ${isDarkColorScheme ? "text-white" : "text-gray-900"}`}>
//                 Your Name
//               </Text>
//               <TextInput
//                 value={name}
//                 onChangeText={setName}
//                 placeholder="Enter your name"
//                 placeholderTextColor={isDarkColorScheme ? "#9CA3AF" : "#6B7280"}
//                 className={`p-4 rounded-lg ${
//                   isDarkColorScheme
//                     ? "bg-gray-800 text-white border-gray-700"
//                     : "bg-white text-gray-900 border-gray-200"
//                 } border`}
//               />
//             </View>

//             {/* Review Input */}
//             <View>
//               <Text className={`text-lg font-semibold mb-2 ${isDarkColorScheme ? "text-white" : "text-gray-900"}`}>
//                 Your Review
//               </Text>
//               <TextInput
//                 value={review}
//                 onChangeText={setReview}
//                 placeholder="What did you like or dislike?"
//                 placeholderTextColor={isDarkColorScheme ? "#9CA3AF" : "#6B7280"}
//                 multiline
//                 numberOfLines={6}
//                 textAlignVertical="top"
//                 className={`p-4 rounded-lg ${
//                   isDarkColorScheme
//                     ? "bg-gray-800 text-white border-gray-700"
//                     : "bg-white text-gray-900 border-gray-200"
//                 } border min-h-[150px]`}
//               />
//             </View>

//             {/* Image Upload Section */}
//             <View>
//               <Text className={`text-lg font-semibold mb-2 ${isDarkColorScheme ? "text-white" : "text-gray-900"}`}>
//                 Add Images
//               </Text>
//               <TouchableOpacity
//                 onPress={pickImage}
//                 className={`p-4 rounded-lg flex-row items-center justify-center ${
//                   isDarkColorScheme ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
//                 } border`}
//               >
//                 <Camera className="mr-2" color={isDarkColorScheme ? "#fff" : "#000"} />
//                 <Text className={isDarkColorScheme ? "text-white" : "text-black"}>Add Image</Text>
//               </TouchableOpacity>
//               {images.length > 0 && (
//                 <ScrollView horizontal className="mt-4">
//                   {images.map((image, index) => (
//                     <Image key={index} source={{ uri: image }} className="w-20 h-20 rounded-lg mr-2" />
//                   ))}
//                 </ScrollView>
//               )}
//             </View>

//             {/* User Info */}
//             <View className={`p-4 rounded-lg ${isDarkColorScheme ? "bg-gray-800" : "bg-gray-100"}`}>
//               <Text className={`text-sm ${isDarkColorScheme ? "text-gray-400" : "text-gray-600"}`}>
//                 Posting as: {user?.displayName || user?.email || "Anonymous User"}
//               </Text>
//             </View>
//           </View>
//         </ScrollView>

//         {/* Submit Button */}
//         <View className={`p-4 border-t ${isDarkColorScheme ? "border-gray-800" : "border-gray-200"}`}>
//           <TouchableOpacity
//             onPress={handleSubmit}
//             className={`p-4 rounded-lg ${
//               rating === 0 || !selectedProduct ? "bg-gray-400" : isDarkColorScheme ? "bg-blue-600" : "bg-blue-500"
//             }`}
//             disabled={rating === 0 || !selectedProduct}
//           >
//             <Text className="text-white font-semibold text-lg text-center">
//               {rating === 0 ? "Please Select Rating" : "Submit Review"}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>

//       {/* Product Selection Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isModalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View className="flex-1 justify-end">
//           <View className={`rounded-t-lg ${isDarkColorScheme ? "bg-gray-800" : "bg-white"}`}>
//             <View className="p-4 border-b border-gray-200">
//               <Text className={`text-lg font-semibold ${isDarkColorScheme ? "text-white" : "text-black"}`}>
//                 Select a Product
//               </Text>
//             </View>
//             <FlatList
//               data={filteredProducts}
//               renderItem={renderProductItem}
//               keyExtractor={(item) => item.id.toString()}
//               className="max-h-80"
//             />
//             <TouchableOpacity
//               onPress={() => setModalVisible(false)}
//               className={`p-4 ${isDarkColorScheme ? "bg-gray-700" : "bg-gray-200"}`}
//             >
//               <Text className={`text-center ${isDarkColorScheme ? "text-white" : "text-black"}`}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   )
// }
/////////////////////////
import { useState, useEffect } from "react";
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
} from "react-native";
import { useColorScheme } from "~/lib/useColorScheme";
import { router } from "expo-router";
import { Star, ChevronDown, Camera } from "lucide-react-native";
import { addReview, getCurrentUTCDateTime } from "./data/reviews";
import * as ImagePicker from "expo-image-picker";
import products from "~/app/product-scr/data/products";
import { auth, db } from "~/app/services/firebaseConfig1";
import { onAuthStateChanged, type User } from "firebase/auth";
import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
import axios from "axios";
import AuthModal from "../(tabs)/components/home/AuthModal";

// Định nghĩa kiểu cho phản hồi từ Cloudinary API
type CloudinaryResponse = {
  secure_url?: string; // Có thể undefined nếu pending
  public_id?: string;
  batch_id?: string;
  resource_type?: string;
  status?: string;
  type?: string;
};

type CloudinaryError = {
  error: {
    message: string;
  };
};

// Function to get day name
const getDayName = () => {
  const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
  return days[new Date().getUTCDay()];
};

export default function AddReviewScreen() {
  // Sử dụng giá trị cứng trực tiếp (sửa lỗi chính tả cloud name)
  const CLOUDINARY_CLOUD_NAME = "dmin0zvdl"; // Sửa từ dmin0zvdl thành dmin0zvd1
  const CLOUDINARY_API_KEY = "732836829564585"; // Từ log của bạn
  const CLOUDINARY_UPLOAD_PRESET = "123456"; // Preset unsigned từ Dashboard, sửa lại nếu dùng 123456

  // Debug giá trị cứng
  console.log("Hardcoded environment variables:", {
    CLOUDINARY_CLOUD_NAME,
    CLOUDINARY_API_KEY,
    CLOUDINARY_UPLOAD_PRESET,
  });

  const { isDarkColorScheme } = useColorScheme();
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const [name, setName] = useState("");
  const [review, setReview] = useState("");
  const [rating, setRating] = useState(0);
  const [currentDateTime, setCurrentDateTime] = useState(getCurrentUTCDateTime());
  const [currentDay, setCurrentDay] = useState(getDayName());
  const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
  const [isModalVisible, setModalVisible] = useState(false);
  const [images, setImages] = useState<string[]>([]);
  const [orderedProductNames, setOrderedProductNames] = useState<string[]>([]);

  // Update time every second
  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentDateTime(getCurrentUTCDateTime());
      setCurrentDay(getDayName());
    }, 1000);

    return () => clearInterval(timer);
  }, []);

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
      setUser(currentUser);
      setIsAuthenticated(!!currentUser);
      if (!currentUser) {
        Alert.alert(
          "Login Required",
          "You need to be logged in to write a review.",
          [
            {
              text: "Cancel",
              onPress: () => router.back(),
              style: "cancel",
            },
            {
              text: "Login",
              onPress: () => setIsAuthModalOpen(true),
            },
          ]
        );
      } else {
        fetchOrderedProducts(currentUser.uid);
      }
    });
    return () => unsubscribe();
  }, []);

  const fetchOrderedProducts = async (uid: string) => {
    if (!db) {
      console.error("Firestore instance 'db' is not initialized. Check firebaseConfig.");
      Alert.alert("Error", "Firestore is not properly configured. Please contact support.");
      return;
    }

    try {
      const ordersCollection = collection(db, "orders");
      const q = query(ordersCollection, where("uid", "==", uid));
      const querySnapshot = await getDocs(q);
      const productNames: string[] = [];

      querySnapshot.forEach((doc) => {
        const orderData = doc.data();
        const items = orderData.items || [];
        items.forEach((item: any) => {
          productNames.push(item.name);
        });
      });

      const uniqueProductNames = [...new Set(productNames)];
      setOrderedProductNames(uniqueProductNames);
    } catch (error) {
      console.error("Error fetching ordered products:", error);
      Alert.alert("Error", "Failed to load your ordered products.");
    }
  };

  const handleAuthStateChange = (user: User | null) => {
    setUser(user);
    setIsAuthenticated(!!user);
    if (user) {
      setIsAuthModalOpen(false);
      fetchOrderedProducts(user.uid);
    }
  };

  const uploadImageToCloudinary = async (imageUri: string): Promise<string | null> => {
    try {
      const response = await fetch(imageUri);
      const blob = await response.blob();
      const contentType = blob.type || "image/jpeg";
      const fileExtension = contentType.split("/")[1] || "jpg";

      const formData = new FormData();
      formData.append("file", {
        uri: imageUri,
        type: contentType,
        name: `review_${Date.now()}.${fileExtension}`,
      } as any);
      formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

      console.log("Uploading image with config:", {
        cloudName: CLOUDINARY_CLOUD_NAME,
        apiKey: CLOUDINARY_API_KEY,
        uploadPreset: CLOUDINARY_UPLOAD_PRESET,
        imageUri,
        contentType,
        fileExtension,
      });

      const axiosResponse = await axios.post(
        `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
        formData,
        {
          headers: {
            "Content-Type": "multipart/form-data",
          },
          timeout: 10000,
          maxContentLength: Infinity,
          maxBodyLength: Infinity,
        }
      );

      const data = axiosResponse.data as CloudinaryResponse;
      console.log("Full response from Cloudinary:", data);

      if (axiosResponse.status === 200 && data.secure_url) {
        console.log("Image uploaded successfully with secure URL:", data.secure_url);
        return data.secure_url;
      } else if (data.status === "pending" && data.batch_id) {
        console.log("Upload is pending, batch ID:", data.batch_id);
        // Fallback sang URI cục bộ nếu pending (tạm thời)
        return null;
      } else {
        console.error("Upload failed with status:", axiosResponse.status, data);
        return null;
      }
    } catch (error) {
      if (axios.isAxiosError(error)) {
        const axiosError = error as any;
        console.error("Axios error uploading image to Cloudinary:", {
          message: axiosError.message,
          status: axiosError.response?.status,
          data: axiosError.response?.data,
          headers: axiosError.response?.headers,
        });
        return null;
      } else {
        console.error("Unexpected error uploading image to Cloudinary:", error);
        return null;
      }
    }
  };

  const handleSubmit = async () => {
    if (!auth.currentUser) {
      Alert.alert("Error", "Please log in to submit a review.");
      return;
    }

    if (!name.trim()) {
      Alert.alert("Error", "Please enter your name");
      return;
    }
    if (!review.trim()) {
      Alert.alert("Error", "Please write your review");
      return;
    }
    if (rating === 0) {
      Alert.alert("Error", "Please select a rating");
      return;
    }
    if (!selectedProduct) {
      Alert.alert("Error", "Please select a product");
      return;
    }

    let imageUrl = images.length > 0 ? images[0] : "default_image_url"; // Sử dụng URI cục bộ nếu upload pending
    if (images.length > 0) {
      const uploadedUrl = await uploadImageToCloudinary(images[0]);
      if (uploadedUrl) {
        imageUrl = uploadedUrl;
        setImages([uploadedUrl]); // Cập nhật state với URL mới
      } else {
        console.log("Image upload failed or pending, keeping local URI:", images[0]);
      }
    }

    const newReview = {
      id: Date.now(),
      name: name.trim(),
      text: review.trim(),
      rating,
      image: imageUrl,
      images: images,
      date: currentDateTime,
      userLogin: user?.displayName || user?.email || "Anonymous User",
      productId: selectedProduct.id,
      uid: user.uid,
    };

    try {
      const reviewsCollection = collection(db, "reviews");
      await addDoc(reviewsCollection, newReview);
      Alert.alert("Success", "Your review has been submitted successfully!", [
        { text: "OK", onPress: () => router.back() },
      ]);
      setImages([]); // Reset images
      setName(""); // Reset name
      setReview(""); // Reset review
      setRating(0); // Reset rating
      setSelectedProduct(null); // Reset selected product
    } catch (error) {
      console.error("Error saving review to Firestore:", error);
      Alert.alert("Error", "Failed to submit review. Please try again.");
    }
  };

  const RatingStars = () => (
    <View className="flex-row justify-center space-x-2">
      {[1, 2, 3, 4, 5].map((star) => (
        <TouchableOpacity key={star} onPress={() => setRating(star)} className="p-2">
          <Star size={32} color={star <= rating ? "#FFC107" : "#D1D5DB"} fill={star <= rating ? "#FFC107" : "none"} />
        </TouchableOpacity>
      ))}
    </View>
  );

  const renderProductItem = ({ item }) => (
    <TouchableOpacity
      onPress={() => {
        setSelectedProduct(item);
        setModalVisible(false);
      }}
      className={`p-4 border-b ${isDarkColorScheme ? "border-gray-700" : "border-gray-200"}`}
    >
      <Text className={isDarkColorScheme ? "text-white" : "text-black"}>{item.name}</Text>
    </TouchableOpacity>
  );

  const pickImage = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({
      mediaTypes: ImagePicker.MediaTypeOptions.Images,
      allowsEditing: true,
      aspect: [4, 3],
      quality: 0.5,
    });

    if (!result.canceled) {
      const imageUri = result.assets[0].uri;
      console.log("Selected image URI:", imageUri);
      setImages([imageUri]); // Lưu URI tạm thời
      const uploadedUrl = await uploadImageToCloudinary(imageUri);
      if (uploadedUrl) {
        setImages([uploadedUrl]); // Cập nhật với URL từ Cloudinary
      } else {
        console.log("Image upload failed or pending, falling back to local URI:", imageUri);
      }
    }
  };

  if (!isAuthenticated) {
    return (
      <AuthModal
        isOpen={isAuthModalOpen}
        onClose={() => {
          setIsAuthModalOpen(false);
          router.back();
        }}
        isDarkColorScheme={isDarkColorScheme}
        onAuthStateChange={handleAuthStateChange}
      />
    );
  }

  const filteredProducts = products.filter((product) => orderedProductNames.includes(product.name));

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
                className={`text-lg font-semibold mb-2 text-center ${isDarkColorScheme ? "text-white" : "text-gray-900"}`}
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
                  isDarkColorScheme ? "bg-gray-800 text-white border-gray-700" : "bg-white text-gray-900 border-gray-200"
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
                  isDarkColorScheme ? "bg-gray-800 text-white border-gray-700" : "bg-white text-gray-900 border-gray-200"
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
              data={filteredProducts}
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
  );
}

// import { useState, useEffect } from "react";
// import {
//   View,
//   Text,
//   TextInput,
//   TouchableOpacity,
//   ScrollView,
//   Alert,
//   SafeAreaView,
//   Platform,
//   KeyboardAvoidingView,
//   Modal,
//   FlatList,
//   Image,
// } from "react-native";
// import { useColorScheme } from "~/lib/useColorScheme";
// import { router } from "expo-router";
// import { Star, ChevronDown, Camera } from "lucide-react-native";
// import { addReview, getCurrentUTCDateTime } from "./data/reviews";
// import * as ImagePicker from "expo-image-picker";
// import products from "~/app/product-scr/data/products";
// import { auth, db } from "~/app/services/firebaseConfig1";
// import { onAuthStateChanged, type User } from "firebase/auth";
// import { collection, query, where, getDocs, addDoc } from "firebase/firestore";
// import axios from "axios";
// import { CLOUDINARY_CLOUD_NAME, CLOUDINARY_API_KEY, CLOUDINARY_UPLOAD_PRESET } from "@env";
// import AuthModal from "../(tabs)/components/home/AuthModal";

// // Định nghĩa kiểu cho phản hồi từ Cloudinary API
// type CloudinaryResponse = {
//   secure_url: string;
//   public_id: string;
// };

// type CloudinaryError = {
//   error: {
//     message: string;
//   };
// };

// // Function to get day name
// const getDayName = () => {
//   const days = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
//   return days[new Date().getUTCDay()];
// };

// export default function AddReviewScreen() {
//   const { isDarkColorScheme } = useColorScheme();
//   const [isAuthenticated, setIsAuthenticated] = useState(false);
//   const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
//   const [user, setUser] = useState<User | null>(null);
//   const [name, setName] = useState("");
//   const [review, setReview] = useState("");
//   const [rating, setRating] = useState(0);
//   const [currentDateTime, setCurrentDateTime] = useState(getCurrentUTCDateTime());
//   const [currentDay, setCurrentDay] = useState(getDayName());
//   const [selectedProduct, setSelectedProduct] = useState<any | null>(null);
//   const [isModalVisible, setModalVisible] = useState(false);
//   const [images, setImages] = useState<string[]>([]);
//   const [orderedProductNames, setOrderedProductNames] = useState<string[]>([]);

//   // Update time every second
//   useEffect(() => {
//     const timer = setInterval(() => {
//       setCurrentDateTime(getCurrentUTCDateTime());
//       setCurrentDay(getDayName());
//     }, 1000);

//     return () => clearInterval(timer);
//   }, []);

//   useEffect(() => {
//     const unsubscribe = onAuthStateChanged(auth, (currentUser) => {
//       setUser(currentUser);
//       setIsAuthenticated(!!currentUser);
//       if (!currentUser) {
//         Alert.alert(
//           "Login Required",
//           "You need to be logged in to write a review.",
//           [
//             {
//               text: "Cancel",
//               onPress: () => router.back(),
//               style: "cancel",
//             },
//             {
//               text: "Login",
//               onPress: () => setIsAuthModalOpen(true),
//             },
//           ]
//         );
//       } else {
//         fetchOrderedProducts(currentUser.uid);
//       }
//     });
//     return () => unsubscribe();
//   }, []);

//   const fetchOrderedProducts = async (uid: string) => {
//     if (!db) {
//       console.error("Firestore instance 'db' is not initialized. Check firebaseConfig.");
//       Alert.alert("Error", "Firestore is not properly configured. Please contact support.");
//       return;
//     }

//     try {
//       const ordersCollection = collection(db, "orders");
//       const q = query(ordersCollection, where("uid", "==", uid));
//       const querySnapshot = await getDocs(q);
//       const productNames: string[] = [];

//       querySnapshot.forEach((doc) => {
//         const orderData = doc.data();
//         const items = orderData.items || [];
//         items.forEach((item: any) => {
//           productNames.push(item.name);
//         });
//       });

//       const uniqueProductNames = [...new Set(productNames)];
//       setOrderedProductNames(uniqueProductNames);
//     } catch (error) {
//       console.error("Error fetching ordered products:", error);
//       Alert.alert("Error", "Failed to load your ordered products.");
//     }
//   };

//   const handleAuthStateChange = (user: User | null) => {
//     setUser(user);
//     setIsAuthenticated(!!user);
//     if (user) {
//       setIsAuthModalOpen(false);
//       fetchOrderedProducts(user.uid);
//     }
//   };

//   const uploadImageToCloudinary = async (imageUri: string): Promise<string | null> => {
//     try {
//       const response = await fetch(imageUri);
//       const blob = await response.blob();
//       const contentType = blob.type || "image/jpeg";
//       const fileExtension = contentType.split("/")[1] || "jpg";

//       const formData = new FormData();
//       formData.append("file", {
//         uri: imageUri,
//         type: contentType,
//         name: `review_${Date.now()}.${fileExtension}`,
//       } as any);
//       formData.append("upload_preset", CLOUDINARY_UPLOAD_PRESET);

//       console.log("Uploading image with config:", {
//         cloudName: CLOUDINARY_CLOUD_NAME,
//         apiKey: CLOUDINARY_API_KEY,
//         uploadPreset: CLOUDINARY_UPLOAD_PRESET,
//         imageUri,
//         contentType,
//         fileExtension,
//       });

//       const axiosResponse = await axios.post(
//         `https://api.cloudinary.com/v1_1/${CLOUDINARY_CLOUD_NAME}/image/upload`,
//         formData,
//         {
//           headers: {
//             "Content-Type": "multipart/form-data",
//           },
//           timeout: 10000,
//           maxContentLength: Infinity,
//           maxBodyLength: Infinity,
//         }
//       );

//       if (axiosResponse.status === 200) {
//         console.log("Image uploaded successfully. Response:", axiosResponse.data);
//         return axiosResponse.data.secure_url;
//       } else {
//         console.error("Upload failed with status:", axiosResponse.status, axiosResponse.data);
//         return null;
//       }
//     } catch (error) {
//       if (axios.isAxiosError(error)) {
//         console.error("Axios error uploading image to Cloudinary:", {
//           message: error.message,
//           status: error.response?.status,
//           data: error.response?.data,
//           headers: error.response?.headers,
//         });
//       } else {
//         console.error("Unexpected error uploading image to Cloudinary:", error);
//       }
//       return null;
//     }
//   };

//   const handleSubmit = async () => {
//     if (!auth.currentUser) {
//       Alert.alert("Error", "Please log in to submit a review.");
//       return;
//     }

//     if (!name.trim()) {
//       Alert.alert("Error", "Please enter your name");
//       return;
//     }
//     if (!review.trim()) {
//       Alert.alert("Error", "Please write your review");
//       return;
//     }
//     if (rating === 0) {
//       Alert.alert("Error", "Please select a rating");
//       return;
//     }
//     if (!selectedProduct) {
//       Alert.alert("Error", "Please select a product");
//       return;
//     }

//     let imageUrl = "default_image_url";
//     if (images.length > 0) {
//       const uploadedUrl = await uploadImageToCloudinary(images[0]);
//       if (uploadedUrl) {
//         imageUrl = uploadedUrl;
//         setImages([uploadedUrl]); // Cập nhật state với URL mới
//       }
//     }

//     const newReview = {
//       id: Date.now(),
//       name: name.trim(),
//       text: review.trim(),
//       rating,
//       image: imageUrl,
//       images: images,
//       date: currentDateTime,
//       userLogin: user?.displayName || user?.email || "Anonymous User",
//       productId: selectedProduct.id,
//       uid: user.uid,
//     };

//     try {
//       const reviewsCollection = collection(db, "reviews");
//       await addDoc(reviewsCollection, newReview);
//       Alert.alert("Success", "Your review has been submitted successfully!", [
//         { text: "OK", onPress: () => router.back() },
//       ]);
//       setImages([]); // Reset images
//       setName(""); // Reset name
//       setReview(""); // Reset review
//       setRating(0); // Reset rating
//       setSelectedProduct(null); // Reset selected product
//     } catch (error) {
//       console.error("Error saving review to Firestore:", error);
//       Alert.alert("Error", "Failed to submit review. Please try again.");
//     }
//   };

//   const RatingStars = () => (
//     <View className="flex-row justify-center space-x-2">
//       {[1, 2, 3, 4, 5].map((star) => (
//         <TouchableOpacity key={star} onPress={() => setRating(star)} className="p-2">
//           <Star size={32} color={star <= rating ? "#FFC107" : "#D1D5DB"} fill={star <= rating ? "#FFC107" : "none"} />
//         </TouchableOpacity>
//       ))}
//     </View>
//   );

//   const renderProductItem = ({ item }) => (
//     <TouchableOpacity
//       onPress={() => {
//         setSelectedProduct(item);
//         setModalVisible(false);
//       }}
//       className={`p-4 border-b ${isDarkColorScheme ? "border-gray-700" : "border-gray-200"}`}
//     >
//       <Text className={isDarkColorScheme ? "text-white" : "text-black"}>{item.name}</Text>
//     </TouchableOpacity>
//   );

//   const pickImage = async () => {
//     const result = await ImagePicker.launchImageLibraryAsync({
//       mediaTypes: ImagePicker.MediaTypeOptions.Images,
//       allowsEditing: true,
//       aspect: [4, 3],
//       quality: 0.5, // Giảm chất lượng để file nhỏ hơn
//     });

//     if (!result.canceled) {
//       const imageUri = result.assets[0].uri;
//       setImages([imageUri]); // Lưu URI tạm thời
//       const uploadedUrl = await uploadImageToCloudinary(imageUri);
//       if (uploadedUrl) {
//         setImages([uploadedUrl]); // Cập nhật với URL từ Cloudinary
//       } else {
//         console.log("Image upload failed, using local URI:", imageUri);
//       }
//     }
//   };

//   if (!isAuthenticated) {
//     return (
//       <AuthModal
//         isOpen={isAuthModalOpen}
//         onClose={() => {
//           setIsAuthModalOpen(false);
//           router.back();
//         }}
//         isDarkColorScheme={isDarkColorScheme}
//         onAuthStateChange={handleAuthStateChange}
//       />
//     );
//   }

//   const filteredProducts = products.filter((product) => orderedProductNames.includes(product.name));

//   return (
//     <SafeAreaView className={`flex-1 ${isDarkColorScheme ? "bg-gray-900" : "bg-gray-50"}`}>
//       <KeyboardAvoidingView behavior={Platform.OS === "ios" ? "padding" : "height"} className="flex-1">
//         <ScrollView className="flex-1">
//           <View className="p-4 space-y-6">
//             {/* Current Date/Time Display */}
//             <View className={`p-4 rounded-lg ${isDarkColorScheme ? "bg-gray-800" : "bg-gray-100"}`}>
//               <Text className={`text-center font-medium ${isDarkColorScheme ? "text-gray-300" : "text-gray-700"}`}>
//                 {currentDay}
//               </Text>
//               <Text className={`text-center text-sm ${isDarkColorScheme ? "text-gray-400" : "text-gray-600"}`}>
//                 {currentDateTime} (UTC)
//               </Text>
//             </View>

//             {/* Product Selection */}
//             <View>
//               <Text className={`text-lg font-semibold mb-2 ${isDarkColorScheme ? "text-white" : "text-gray-900"}`}>
//                 Select Product
//               </Text>
//               <TouchableOpacity
//                 onPress={() => setModalVisible(true)}
//                 className={`p-4 rounded-lg flex-row justify-between items-center ${
//                   isDarkColorScheme ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
//                 } border`}
//               >
//                 <Text className={isDarkColorScheme ? "text-white" : "text-black"}>
//                   {selectedProduct ? selectedProduct.name : "Select a product"}
//                 </Text>
//                 <ChevronDown color={isDarkColorScheme ? "#fff" : "#000"} />
//               </TouchableOpacity>
//             </View>

//             {/* Rating Section */}
//             <View>
//               <Text
//                 className={`text-lg font-semibold mb-2 text-center ${isDarkColorScheme ? "text-white" : "text-gray-900"}`}
//               >
//                 Tap to Rate
//               </Text>
//               <RatingStars />
//               {rating > 0 && (
//                 <Text className={`text-center mt-2 ${isDarkColorScheme ? "text-gray-400" : "text-gray-600"}`}>
//                   You've selected {rating} star{rating !== 1 ? "s" : ""}
//                 </Text>
//               )}
//             </View>

//             {/* Name Input */}
//             <View>
//               <Text className={`text-lg font-semibold mb-2 ${isDarkColorScheme ? "text-white" : "text-gray-900"}`}>
//                 Your Name
//               </Text>
//               <TextInput
//                 value={name}
//                 onChangeText={setName}
//                 placeholder="Enter your name"
//                 placeholderTextColor={isDarkColorScheme ? "#9CA3AF" : "#6B7280"}
//                 className={`p-4 rounded-lg ${
//                   isDarkColorScheme ? "bg-gray-800 text-white border-gray-700" : "bg-white text-gray-900 border-gray-200"
//                 } border`}
//               />
//             </View>

//             {/* Review Input */}
//             <View>
//               <Text className={`text-lg font-semibold mb-2 ${isDarkColorScheme ? "text-white" : "text-gray-900"}`}>
//                 Your Review
//               </Text>
//               <TextInput
//                 value={review}
//                 onChangeText={setReview}
//                 placeholder="What did you like or dislike?"
//                 placeholderTextColor={isDarkColorScheme ? "#9CA3AF" : "#6B7280"}
//                 multiline
//                 numberOfLines={6}
//                 textAlignVertical="top"
//                 className={`p-4 rounded-lg ${
//                   isDarkColorScheme ? "bg-gray-800 text-white border-gray-700" : "bg-white text-gray-900 border-gray-200"
//                 } border min-h-[150px]`}
//               />
//             </View>

//             {/* Image Upload Section */}
//             <View>
//               <Text className={`text-lg font-semibold mb-2 ${isDarkColorScheme ? "text-white" : "text-gray-900"}`}>
//                 Add Images
//               </Text>
//               <TouchableOpacity
//                 onPress={pickImage}
//                 className={`p-4 rounded-lg flex-row items-center justify-center ${
//                   isDarkColorScheme ? "bg-gray-800 border-gray-700" : "bg-white border-gray-200"
//                 } border`}
//               >
//                 <Camera className="mr-2" color={isDarkColorScheme ? "#fff" : "#000"} />
//                 <Text className={isDarkColorScheme ? "text-white" : "text-black"}>Add Image</Text>
//               </TouchableOpacity>
//               {images.length > 0 && (
//                 <ScrollView horizontal className="mt-4">
//                   {images.map((image, index) => (
//                     <Image key={index} source={{ uri: image }} className="w-20 h-20 rounded-lg mr-2" />
//                   ))}
//                 </ScrollView>
//               )}
//             </View>

//             {/* User Info */}
//             <View className={`p-4 rounded-lg ${isDarkColorScheme ? "bg-gray-800" : "bg-gray-100"}`}>
//               <Text className={`text-sm ${isDarkColorScheme ? "text-gray-400" : "text-gray-600"}`}>
//                 Posting as: {user?.displayName || user?.email || "Anonymous User"}
//               </Text>
//             </View>
//           </View>
//         </ScrollView>

//         {/* Submit Button */}
//         <View className={`p-4 border-t ${isDarkColorScheme ? "border-gray-800" : "border-gray-200"}`}>
//           <TouchableOpacity
//             onPress={handleSubmit}
//             className={`p-4 rounded-lg ${
//               rating === 0 || !selectedProduct ? "bg-gray-400" : isDarkColorScheme ? "bg-blue-600" : "bg-blue-500"
//             }`}
//             disabled={rating === 0 || !selectedProduct}
//           >
//             <Text className="text-white font-semibold text-lg text-center">
//               {rating === 0 ? "Please Select Rating" : "Submit Review"}
//             </Text>
//           </TouchableOpacity>
//         </View>
//       </KeyboardAvoidingView>

//       {/* Product Selection Modal */}
//       <Modal
//         animationType="slide"
//         transparent={true}
//         visible={isModalVisible}
//         onRequestClose={() => setModalVisible(false)}
//       >
//         <View className="flex-1 justify-end">
//           <View className={`rounded-t-lg ${isDarkColorScheme ? "bg-gray-800" : "bg-white"}`}>
//             <View className="p-4 border-b border-gray-200">
//               <Text className={`text-lg font-semibold ${isDarkColorScheme ? "text-white" : "text-black"}`}>
//                 Select a Product
//               </Text>
//             </View>
//             <FlatList
//               data={filteredProducts}
//               renderItem={renderProductItem}
//               keyExtractor={(item) => item.id.toString()}
//               className="max-h-80"
//             />
//             <TouchableOpacity
//               onPress={() => setModalVisible(false)}
//               className={`p-4 ${isDarkColorScheme ? "bg-gray-700" : "bg-gray-200"}`}
//             >
//               <Text className={`text-center ${isDarkColorScheme ? "text-white" : "text-black"}`}>Cancel</Text>
//             </TouchableOpacity>
//           </View>
//         </View>
//       </Modal>
//     </SafeAreaView>
//   );
// }