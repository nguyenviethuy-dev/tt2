
import { View, Text, Image, TouchableOpacity, type ImageSourcePropType } from "react-native"
import Icon from "react-native-vector-icons/Feather"
import { Button } from "~/components/ui/button"

interface CartItemProps {
  item: {
    id: number
    name: string
    price: number
    quantity: number
    image?: string
    selectedSize?: string
    selectedColor?: string
  }
  onUpdateQuantity: (quantity: number) => void
  onRemove: () => void
}

export function CartItem({ item, onUpdateQuantity, onRemove }: CartItemProps) {
  // Handle image source type properly
  const imageSource: ImageSourcePropType = item.image
    ? { uri: item.image }
    : require("../../assets/images/placeholder.png")

  return (
    <View className="flex-row p-4 border-b border-gray-200">
      <Image source={imageSource} className="w-20 h-20 mr-4 rounded-lg" />

      <View className="flex-1">
        <Text className="text-base font-bold mb-1">{item.name}</Text>
        {item.selectedSize && <Text className="text-md text-gray-600 mb-1">Size: {item.selectedSize}</Text>}
        {item.selectedColor && <Text className="text-md text-gray-600 mb-1">Color: {item.selectedColor}</Text>}
        <Text className="text-base font-bold mb-2">${item.price} USD</Text>

        <View className="flex-row items-center">
          <Button
            variant="outline"
            size="icon"
            onPress={() => onUpdateQuantity(item.quantity - 1)}
            className="h-8 w-8 rounded-full bg-pink-600"
          >
            <Text className="text-lg">-</Text>
          </Button>

          <Text className="mx-4 text-base">{item.quantity}</Text>

          <Button
            variant="outline"
            size="icon"
            onPress={() => onUpdateQuantity(item.quantity + 1)}
            className="h-8 w-8 rounded-full bg-cyan-600"
          >
            <Text className="text-lg">+</Text>
          </Button>
        </View>
      </View>

      <TouchableOpacity onPress={onRemove} className="p-2">
        <Icon name="trash-2" size={24} className="h-8 w-6 text-red-500" />
      </TouchableOpacity>
    </View>
  )
}

