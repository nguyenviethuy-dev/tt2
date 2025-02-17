

import { useState, useEffect } from "react"
import { View, Text, ScrollView, SafeAreaView, Alert } from "react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"
import { Label } from "~/components/ui/label"
import { useCart } from "./Contexts/cart-context"

interface CartItem {
  id: number
  name: string
  price: number
  quantity: number
  selectedSize?: string
  selectedColor?: string
}

export default function Checkout() {
  const router = useRouter()
  const { clearCart } = useCart()
  const params = useLocalSearchParams()
  const [cartItems, setCartItems] = useState<CartItem[]>([])
  const [total, setTotal] = useState(0)
  const [isLoading, setIsLoading] = useState(true)
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
  })

  const handleInputChange = (name: string, value: string) => {
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }))
  }

  useEffect(() => {
    if (!params.cartItems || !params.total) return; // Chặn lỗi nếu dữ liệu không có
  
    try {
      const items = JSON.parse(params.cartItems as string) as CartItem[]
      const totalAmount = Number.parseFloat(params.total as string)
  
      if (Array.isArray(items)) {
        setCartItems(items)
        setTotal(totalAmount)
      } else {
        throw new Error("Invalid cart items format")
      }
    } catch (error) {
      console.error("Error parsing cart data:", error)
      Alert.alert("Error", "Invalid cart data. Please check your cart and try again.", [
        { text: "OK", onPress: () => router.back() },
      ])
    } finally {
      setIsLoading(false) // Đảm bảo loading được tắt ngay cả khi lỗi
    }
  }, [params.cartItems, params.total])
  
  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.email || !formData.address) {
        Alert.alert("Error", "Please fill in all required fields")
        return
      }

      const orderData = {
        customerInfo: formData,
        items: cartItems,
        total: total,
        hasShippingProtection: params.hasShippingProtection === "true",
      }

      await clearCart()

      router.push({
        pathname: "/cart/OrderReceipt",
        params: {
          orderData: JSON.stringify(orderData),
        },
      })
    } catch (error) {
      console.error("Error submitting order:", error)
      Alert.alert("Error", "There was a problem submitting your order. Please try again.")
    }
  }

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text>Loading...</Text>
      </SafeAreaView>
    )
  }

  if (!cartItems.length) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-white">
        <Text className="text-lg text-center mb-4">Your cart is empty</Text>
        <Button onPress={() => router.push("/")} variant="default">
          <Text className="text-white">Continue Shopping</Text>
        </Button>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1 p-4">
        <Text className="text-2xl font-bold mb-4">Checkout</Text>
        <View className="mb-4">
          <Label htmlFor="name">
            <Text>Full Name</Text>
          </Label>
          <Input
            id="name"
            value={formData.name}
            onChangeText={(text) => handleInputChange("name", text)}
            placeholder="John Doe"
          />
        </View>
        <View className="mb-4">
          <Label htmlFor="email">
            <Text>Email</Text>
          </Label>
          <Input
            id="email"
            value={formData.email}
            onChangeText={(text) => handleInputChange("email", text)}
            placeholder="your.email@example.com"
            keyboardType="email-address"
          />
        </View>
        <View className="mb-4">
          <Label htmlFor="address">
            <Text>Address</Text>
          </Label>
          <Input
            id="address"
            value={formData.address}
            onChangeText={(text) => handleInputChange("address", text)}
            placeholder="123 Main St"
          />
        </View>
        <View className="mb-4">
          <Label htmlFor="city">
            <Text>City</Text>
          </Label>
          <Input
            id="city"
            value={formData.city}
            onChangeText={(text) => handleInputChange("city", text)}
            placeholder="Anytown"
          />
        </View>
        <View className="mb-4">
          <Label htmlFor="country">
            <Text>Country</Text>
          </Label>
          <Input
            id="country"
            value={formData.country}
            onChangeText={(text) => handleInputChange("country", text)}
            placeholder="USA"
          />
        </View>
        <View className="mb-4">
          <Label htmlFor="zipCode">
            <Text>Zip Code</Text>
          </Label>
          <Input
            id="zipCode"
            value={formData.zipCode}
            onChangeText={(text) => handleInputChange("zipCode", text)}
            placeholder="12345"
            keyboardType="number-pad"
          />
        </View>
        <View className="mb-4">
          <Text className="font-bold mb-2">Order Summary</Text>
          {cartItems.map((item, index) => (
            <View key={`${item.id}-${index}`} className="flex-row justify-between mb-2">
              <Text>
                {item.name} x{item.quantity}
              </Text>
              <Text>${(item.price * item.quantity).toFixed(2)}</Text>
            </View>
            ))}

          <View className="flex-row justify-between mt-2">
            <Text className="font-bold">Total</Text>
            <Text className="font-bold">${total.toFixed(2)}</Text>
          </View>
        </View>
        <Button onPress={handleSubmit} className="w-full dark:bg-blue-500">
          <Text className="text-white dark:text-black">Place Order</Text>
        </Button>
      </ScrollView>
    </SafeAreaView>
  )
}

