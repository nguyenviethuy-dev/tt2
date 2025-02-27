import { View, Text, Modal, TouchableOpacity } from "react-native";
import type { Review } from "./data/reviews";

const formatDate = (date: string) => {
  return new Date(date).toLocaleDateString();
};

interface ReviewDetailModalProps {
  visible: boolean;
  onClose: () => void;
  review: Review | null; // Review giờ có id: string
}

export default function ReviewDetailModal({ visible, onClose, review }: ReviewDetailModalProps) {
  if (!review) return null;

  return (
    <Modal visible={visible} animationType="slide" transparent={true}>
      <View className="flex-1 justify-center bg-black/50">
        <View className="bg-white p-4 m-4 rounded-lg">
          <Text className="text-lg font-bold">{review.name}</Text>
          <Text className="text-sm">{review.text}</Text>
          <Text className="text-xs text-gray-500">{formatDate(review.date)}</Text>
          <TouchableOpacity onPress={onClose}>
            <Text className="text-blue-500 mt-2">Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}