

import { useState } from "react";
import { View, Text, TouchableOpacity, Image, ScrollView, Modal, Dimensions } from "react-native";
import { X } from "lucide-react-native";
import { WebView } from "react-native-webview";
import { useWindowDimensions } from "react-native";

export default function VideoTutorial() {
  const [isModalOpen, setIsModalOpen] = useState(false);
  const { width } = useWindowDimensions();
  const isLargeScreen = width > 768;

  return (
    <View className="bg-[#B21E4B] p-4 flex-1 justify-center items-center">
      <Text className="text-3xl font-bold text-white mb-8 text-center">How To Make Personalized Gift</Text>

      {/* Video Tutorial Button */}
      <TouchableOpacity
        onPress={() => setIsModalOpen(true)}
        className="bg-white rounded-full px-6 py-3 flex-row items-center justify-center mb-8"
      >
        <View className="w-8 h-8 rounded-full bg-[#B21E4B] items-center justify-center mr-2">
          <View className="w-0 h-0 border-t-[6px] border-t-transparent border-l-[10px] border-l-white border-b-[6px] border-b-transparent ml-1" />
        </View>
        <Text className="text-[#B21E4B] font-bold">Watch video tutorial</Text>
      </TouchableOpacity>

      {/* Modal */}
      <Modal
        animationType="slide"
        transparent={true}
        visible={isModalOpen}
        onRequestClose={() => setIsModalOpen(false)}
      >
        <View className="flex-1 bg-black bg-opacity-50 justify-center items-center p-4">
          <View className="bg-white rounded-lg w-full max-w-4xl p-4 relative">
            <TouchableOpacity onPress={() => setIsModalOpen(false)} className="absolute top-2 right-2 z-10">
              <X size={24} color="#000" />
            </TouchableOpacity>
            <View className="aspect-video w-full">
              <WebView source={{ uri: "https://www.youtube.com/embed/QYTzrl3QMxU" }} style={{ flex: 1 }} />
            </View>
          </View>
        </View>
      </Modal>

      {/* Steps */}
      <ScrollView horizontal={!isLargeScreen} showsHorizontalScrollIndicator={false} className="mt-8">
        <View className={`flex-row ${isLargeScreen ? "flex-wrap justify-center" : "space-x-4"}`}>
          {[
            {
              image: "https://famvibe.com/cdn/shop/t/358/assets/step_guide-01.png?v=123855289959281191601738572532",
              title: "1. Pick your gift",
              description: "Choose your gift you want then pick your gift size.",
            },
            {
              image: "https://famvibe.com/cdn/shop/t/358/assets/step_guide-02.png?v=27460856485986172691738572533",
              title: "2. Personalize your design",
              description: "Customize your design with various options to best your message.",
            },
            {
              image: "https://famvibe.com/cdn/shop/t/358/assets/step_guide-03.png?v=173020055011260738211738572533",
              title: "3. Buy It Now",
              description: "Fill your contact information and wait to enjoy meaningful gift with beloved ones.",
            },
          ].map((step, index) => (
            <View key={index} className="bg-white bg-opacity-95 rounded-lg p-6 w-64 m-2">
              <Image source={{ uri: step.image }} className="w-full h-40 mb-4" resizeMode="contain" />
              <Text className="text-xl font-semibold text-[#B21E4B] mb-2">{step.title}</Text>
              <Text className="text-gray-600">{step.description}</Text>
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  );
}
