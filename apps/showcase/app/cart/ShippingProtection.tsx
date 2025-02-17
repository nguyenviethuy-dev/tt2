
import { View, Text } from "react-native"
import { ShieldCheck } from "lucide-react-native"
import { Button } from "~/components/ui/button"

interface ShippingProtectionProps {
  onRemove: () => void
}

export function ShippingProtection({ onRemove }: ShippingProtectionProps) {
  return (
    <View className="flex-row p-4 bg-gray-100 rounded-lg mb-4">
      <ShieldCheck className="w-16 h-16 text-green-500 mr-4" />
      <View className="flex-1">
        <Text className="text-lg font-bold mb-1">Shipping Protection</Text>
        <Text className="text-sm text-gray-600 mb-2">
          Protect your item from damage, loss, or theft during shipping
        </Text>
        <Text className="text-base font-bold mb-2">$2.99 USD</Text>
        <Button variant="outline" onPress={onRemove} className="self-start">
        <Text className="text-red-700 text-lg">Remove</Text>
        </Button>
      </View>
    </View>
  )
}

