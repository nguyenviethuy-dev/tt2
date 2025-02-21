import React from 'react';
import { View, Text, Image, TouchableOpacity, Modal } from 'react-native';
import { useColorScheme } from '~/lib/useColorScheme';

interface Review {
  id: number;
  image: string;
  name: string;
  rating: number;
  text: string;
  date: string;
}

interface ReviewDetailModalProps {
  visible: boolean;
  onClose: () => void;
  review: Review | null;
}

export default function ReviewDetailModal({ visible, onClose, review }: ReviewDetailModalProps) {
  const { isDarkColorScheme } = useColorScheme();

  if (!review) return null;

  return (
    <Modal
      animationType="fade"
      transparent={true}
      visible={visible}
      onRequestClose={onClose}
    >
      <View className={`flex-1 justify-center items-center ${isDarkColorScheme ? 'bg-black/80' : 'bg-gray-500/80'}`}>
        <View className={`w-4/5 rounded-lg p-4 ${isDarkColorScheme ? 'bg-gray-800' : 'bg-white'}`}>
          <Image 
            source={{ uri: review.image }} 
            className="w-full h-40 rounded-lg mb-4" 
            resizeMode="cover"
          />
          <Text className={`text-lg font-bold mb-2 ${isDarkColorScheme ? 'text-white' : 'text-gray-900'}`}>
            {review.name}
          </Text>
          <Text className={`mb-2 ${isDarkColorScheme ? 'text-gray-300' : 'text-gray-600'}`}>
            {review.text}
          </Text>
          <Text className={`text-sm ${isDarkColorScheme ? 'text-gray-400' : 'text-gray-500'}`}>
            {review.date}
          </Text>
          <TouchableOpacity 
            onPress={onClose}
            className="mt-4 self-end"
          >
            <Text className={`font-medium ${isDarkColorScheme ? 'text-blue-400' : 'text-blue-600'}`}>Close</Text>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );
}