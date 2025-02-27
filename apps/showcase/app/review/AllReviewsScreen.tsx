
import { useState, useEffect } from "react";
import { View, Text, TouchableOpacity, FlatList, Image } from "react-native";
import { useColorScheme } from "~/lib/useColorScheme";
import ReviewDetailModal from "./ReviewDetailModal";
import type { Review } from "./data/reviews"; // Giữ type Review
import { sortReviews, formatDate } from "./data/reviews"; // Giữ hàm sortReviews và formatDate
import { Star, Plus } from "lucide-react-native";
import { router } from "expo-router";
import { db } from "~/app/services/firebaseConfig1"; // Đảm bảo đường dẫn đúng
import { collection, getDocs } from "firebase/firestore";

export default function AllReviewsScreen() {
  const [sortBy, setSortBy] = useState<"date" | "rating">("date");
  const [detailModalVisible, setDetailModalVisible] = useState(false);
  const [selectedReview, setSelectedReview] = useState<Review | null>(null);
  const [allReviews, setAllReviews] = useState<Review[]>([]);
  const { isDarkColorScheme } = useColorScheme();

  // Lấy tất cả review từ Firestore
  useEffect(() => {
    const fetchReviewsFromFirestore = async () => {
      try {
        const reviewsCollection = collection(db, "reviews");
        const querySnapshot = await getDocs(reviewsCollection);
        const firestoreReviews: Review[] = querySnapshot.docs.map((doc) => {
          const data = doc.data();
          return {
            id: doc.id, // Dùng doc.id làm chuỗi
            image: data.image as string,
            name: data.name as string,
            rating: data.rating as number,
            text: data.text as string,
            date: data.date as string,
            userLogin: data.userLogin as string,
            productId: data.productId as number, // Thêm productId nếu có
          };
        });
        setAllReviews(sortReviews(firestoreReviews, sortBy));
      } catch (error) {
        console.error("Error fetching reviews from Firestore:", error);
      }
    };

    fetchReviewsFromFirestore();
  }, [sortBy]);

  const openDetailModal = (review: Review) => {
    setSelectedReview(review);
    setDetailModalVisible(true);
  };

  const renderReviewItem = ({ item }: { item: Review }) => (
    <TouchableOpacity onPress={() => openDetailModal(item)}>
      <View className={`p-4 border-b ${isDarkColorScheme ? "border-gray-700" : "border-gray-200"}`}>
        <View className="flex-row items-center mb-2">
          <Image source={{ uri: item.image }} className="w-10 h-10 rounded-full mr-3" />
          <View>
            <Text className={`font-semibold ${isDarkColorScheme ? "text-white" : "text-gray-900"}`}>{item.name}</Text>
            <Text className={`text-xs ${isDarkColorScheme ? "text-gray-400" : "text-gray-500"}`}>
              {formatDate(item.date)}
            </Text>
          </View>
        </View>
        <View className="flex-row mb-2">
          {Array.from({ length: 5 }).map((_, index) => (
            <Star
              key={index}
              size={16}
              color={index < item.rating ? "#FFC107" : "#D1D5DB"}
              fill={index < item.rating ? "#FFC107" : "none"}
            />
          ))}
        </View>
        <Text className={`text-sm ${isDarkColorScheme ? "text-gray-300" : "text-gray-600"}`} numberOfLines={3}>
          {item.text}
        </Text>
      </View>
    </TouchableOpacity>
  );

  return (
    <View className={`flex-1 ${isDarkColorScheme ? "bg-gray-900" : "bg-white"}`}>
      <View className="flex-row justify-between items-center p-4">
        <Text className={`text-xl font-bold ${isDarkColorScheme ? "text-white" : "text-gray-900"}`}>All Reviews</Text>
        <TouchableOpacity onPress={() => setSortBy(sortBy === "date" ? "rating" : "date")}>
          <Text className={`font-medium ${isDarkColorScheme ? "text-blue-400" : "text-blue-600"}`}>
            Sort by: {sortBy === "date" ? "Date" : "Rating"}
          </Text>
        </TouchableOpacity>
      </View>
      <FlatList data={allReviews} renderItem={renderReviewItem} keyExtractor={(item) => item.id} />
      <ReviewDetailModal
        visible={detailModalVisible}
        onClose={() => setDetailModalVisible(false)}
        review={selectedReview}
      />
      <TouchableOpacity
        className={`absolute bottom-8 right-8 rounded-full p-4 ${isDarkColorScheme ? "bg-blue-600" : "bg-blue-500"}`}
        onPress={() => router.push("/review/AddReviewScreen")}
      >
        <Plus size={24} color="#fff" />
      </TouchableOpacity>
    </View>
  );
}