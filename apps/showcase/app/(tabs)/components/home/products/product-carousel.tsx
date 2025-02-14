// import { useState } from "react"
// import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions } from "react-native"
// import { ChevronLeft, ChevronRight, Star } from "lucide-react-native"

// type ProductCarouselProps = {
//   title: string;
//   products: {
//     id: number;
//     title: string;
//     price: string;
//     originalPrice: string;
//     rating: number;
//     reviews: number;
//     imageUrl: string;
//   }[];
//   isLargeScreen: boolean;
// };

// export default function ProductCarousel({ title, products = [] }: ProductCarouselProps) {
//   const [currentIndex, setCurrentIndex] = useState(0)
//   const windowWidth = Dimensions.get("window").width

//   const handlePrevious = () => {
//     setCurrentIndex((prev) => (prev > 0 ? prev - 1 : products.length - 1))
//   }

//   const handleNext = () => {
//     setCurrentIndex((prev) => (prev < products.length - 1 ? prev + 1 : 0))
//   }

//   if (!products.length) {
//     return (
//       <View className="px-4 py-8">
//         <Text className="text-2xl font-bold text-center mb-6">{title}</Text>
//         <Text className="text-center text-gray-500">No products available</Text>
//       </View>
//     )
//   }

//   return (
//     <View className="px-4">
//       <Text className="text-2xl font-bold text-center mb-6">{title}</Text>

//       <View className="relative flex items-center justify-center">
//         <ScrollView 
//           horizontal 
//           showsHorizontalScrollIndicator={false} 
//           contentContainerStyle={{ 
//             alignItems: 'center',
//             justifyContent: 'center',
//             width: windowWidth,
//           }}
//           scrollEnabled={false}
//         >
//           <TouchableOpacity 
//             key={products[currentIndex].id} 
//             className="w-[250px] bg-white rounded-lg shadow-md p-4"
//             style={{
//               marginHorizontal: (windowWidth - 250) / 2,
//             }}
//           >
//             <View className="aspect-square rounded-lg overflow-hidden mb-4">
//               <Image
//                 source={{ uri: products[currentIndex].imageUrl }}
//                 style={{ width: "100%", height: "100%" }}
//                 resizeMode="cover"
//               />
//             </View>

//             <View className="space-y-2">
//               <Text className="text-sm text-gray-700" numberOfLines={2}>
//                 {products[currentIndex].title}
//               </Text>
//               <View className="flex-row items-center">
//                 {Array.from({ length: 5 }).map((_, i) => (
//                   <Star
//                     key={i}
//                     size={16}
//                     color={i < Math.floor(products[currentIndex].rating) ? "#FFD700" : "#E0E0E0"}
//                     fill={i < Math.floor(products[currentIndex].rating) ? "#FFD700" : "#E0E0E0"}
//                   />
//                 ))}
//                 <Text className="ml-2 text-sm text-gray-500">({products[currentIndex].reviews})</Text>
//               </View>
//               <View className="flex-row items-center space-x-2">
//                 <Text className="text-lg font-bold">{products[currentIndex].price}</Text>
//                 <Text className="text-sm text-gray-500 line-through">{products[currentIndex].originalPrice}</Text>
//               </View>
//             </View>
//           </TouchableOpacity>
//         </ScrollView>

//         <TouchableOpacity
//           onPress={handlePrevious}
//           className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-3 z-10"
//           style={{
//             left: (windowWidth - 290) / 2,
//             elevation: 3,
//           }}
//         >
//           <ChevronLeft size={24} color="#000" />
//         </TouchableOpacity>

//         <TouchableOpacity
//           onPress={handleNext}
//           className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-3 z-10"
//           style={{
//             right: (windowWidth - 290) / 2,
//             elevation: 3,
//           }}
//         >
//           <ChevronRight size={24} color="#000" />
//         </TouchableOpacity>
//       </View>

//       <View className="flex-row justify-center mt-4 space-x-1">
//         {products.map((_, index) => (
//           <View
//             key={index}
//             className={`h-2 rounded-full ${
//               currentIndex === index ? 'w-6 bg-black' : 'w-2 bg-gray-300'
//             }`}
//           />
//         ))}
//       </View>
//     </View>
//   )
// }


import { useState } from "react";
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions } from "react-native";
import { ChevronLeft, ChevronRight, Star } from "lucide-react-native";

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
  const [currentIndex, setCurrentIndex] = useState(0);
  const windowWidth = Dimensions.get("window").width;

  const handlePrevious = () => {
    setCurrentIndex((prev) => (prev > 0 ? prev - 1 : products.length - 1));
  };

  const handleNext = () => {
    setCurrentIndex((prev) => (prev < products.length - 1 ? prev + 1 : 0));
  };

  if (!products.length) {
    return (
      <View className="px-4 py-6">
        <Text className="text-xl font-semibold text-center mb-4">{title}</Text>
        <Text className="text-center text-gray-500">No products available</Text>
      </View>
    );
  }

  const calculateDiscount = (original: string, current: string) => {
    const originalPrice = parseFloat(original.replace("$", ""));
    const currentPrice = parseFloat(current.replace("$", ""));
    return Math.round(((originalPrice - currentPrice) / originalPrice) * 100);
  };

  return (
    <View className="px-4">
      <Text className="text-xl font-semibold text-center mb-6">{title}</Text>

      <View className="relative flex items-center justify-center">
        <ScrollView 
          horizontal 
          showsHorizontalScrollIndicator={false} 
          contentContainerStyle={{ 
            alignItems: "center",
            justifyContent: "center",
            width: windowWidth,
          }}
          scrollEnabled={false}
        >
          <TouchableOpacity 
            key={products[currentIndex].id} 
            className="w-[280px] bg-white rounded-2xl shadow-lg p-4"
            style={{
              marginHorizontal: (windowWidth - 280) / 2,
              elevation: 4,
            }}
          >
            <View className="relative">
              <View className="aspect-square rounded-xl overflow-hidden mb-4">
                <Image
                  source={{ uri: products[currentIndex].imageUrl }}
                  style={{ width: "100%", height: "100%" }}
                  resizeMode="cover"
                />
              </View>
              <View className="absolute top-2 right-2 bg-red-500 px-3 py-1 rounded-full">
                <Text className="text-white text-xs font-semibold">
                  {calculateDiscount(
                    products[currentIndex].originalPrice,
                    products[currentIndex].price
                  )}% OFF
                </Text>
              </View>
            </View>

            <View className="space-y-3">
              <Text 
                className="text-base font-medium text-gray-800" 
                numberOfLines={2}
              >
                {products[currentIndex].title}
              </Text>
              
              <View className="flex-row items-center">
                {Array.from({ length: 5 }).map((_, i) => (
                  <Star
                    key={i}
                    size={16}
                    color={i < Math.floor(products[currentIndex].rating) ? "#FFA500" : "#E0E0E0"}
                    fill={i < Math.floor(products[currentIndex].rating) ? "#FFA500" : "#E0E0E0"}
                  />
                ))}
                <Text className="ml-2 text-sm text-gray-600">
                  ({products[currentIndex].reviews})
                </Text>
              </View>

              <View className="flex-row items-center space-x-2">
                <Text className="text-xl font-bold text-gray-900">
                  {products[currentIndex].price}
                </Text>
                <Text className="text-sm text-gray-500 line-through">
                  {products[currentIndex].originalPrice}
                </Text>
              </View>

              <TouchableOpacity 
                className="mt-2 bg-black py-3 rounded-xl"
                activeOpacity={0.8}
              >
                <Text className="text-white text-center font-semibold">
                  Add to Cart
                </Text>
              </TouchableOpacity>
            </View>
          </TouchableOpacity>
        </ScrollView>

        <TouchableOpacity
          onPress={handlePrevious}
          className="absolute left-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2"
          style={{
            left: (windowWidth - 340) / 2,
            elevation: 5,
          }}
        >
          <ChevronLeft size={24} color="#000" />
        </TouchableOpacity>

        <TouchableOpacity
          onPress={handleNext}
          className="absolute right-0 top-1/2 -translate-y-1/2 bg-white shadow-lg rounded-full p-2"
          style={{
            right: (windowWidth - 340) / 2,
            elevation: 5,
          }}
        >
          <ChevronRight size={24} color="#000" />
        </TouchableOpacity>
      </View>

      <View className="flex-row justify-center mt-6 space-x-2">
        {products.map((_, index) => (
          <View
            key={index}
            className={`h-2 rounded-full transition-all duration-300 ${
              currentIndex === index ? "w-6 bg-black" : "w-2 bg-gray-300"
            }`}
          />
        ))}
      </View>
    </View>
  );
}