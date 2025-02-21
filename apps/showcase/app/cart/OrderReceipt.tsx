

import { useRef, useEffect, useState } from "react"
import { View, Text, ScrollView, SafeAreaView, Alert, TouchableOpacity } from "react-native"
import { useLocalSearchParams, useRouter } from "expo-router"
import ViewShot from "react-native-view-shot"
import * as MediaLibrary from "expo-media-library"
import { Button } from "~/components/ui/button"
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card"
import { Separator } from "~/components/ui/separator"
import { Plus } from "lucide-react-native"

interface OrderItem {
  id: number
  name: string
  price: number
  quantity: number
  selectedSize?: string
  selectedColor?: string
}

interface OrderData {
  customerInfo: {
    name: string
    email: string
    address: string
    city: string
    country: string
    zipCode: string
  }
  items: OrderItem[]
  total: number
  hasShippingProtection: boolean
}

export default function OrderReceipt() {
  const router = useRouter()
  const params = useLocalSearchParams()
  const viewShotRef = useRef(null)
  const [orderData, setOrderData] = useState<OrderData | null>(null)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    try {
      if (params.orderData) {
        const parsed = JSON.parse(params.orderData as string)
        setOrderData(parsed)
      } else {
        throw new Error("No order data found")
      }
    } catch (error) {
      console.error("Error parsing order data:", error)
      setError("Could not load order details")
    }
  }, [params.orderData])

  const handleAddReview = () => {
    if (orderData) {
      router.push({
        pathname: "/review/AddReviewScreen",
        params: { products: JSON.stringify(orderData.items) },
      })
    }
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-background">
        <Text className="text-lg text-center mb-4">{error}</Text>
        <Button onPress={() => router.push("/")} variant="default">
          <Text className="text-white">Return Home</Text>
        </Button>
      </SafeAreaView>
    )
  }

  if (!orderData) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-background">
        <Text>Loading...</Text>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 p-4">
        <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 0.9 }}>
          <Card>
            <CardHeader>
              <CardTitle>
                <Text className="text-2xl font-bold text-center dark:text-white">Order Receipt</Text>
              </CardTitle>
              <Text className="text-sm text-center text-gray-500">{new Date().toLocaleString()}</Text>
            </CardHeader>
            <CardContent>
              <View className="space-y-6">
                <View>
                  <Text className="text-lg font-semibold mb-2 dark:text-white">Customer Information</Text>
                  <Text className="dark:text-white text-md">Name: {orderData.customerInfo.name}</Text>
                  <Text className="dark:text-white text-md">Email: {orderData.customerInfo.email}</Text>
                  <Text className="dark:text-white text-md">Address: {orderData.customerInfo.address}</Text>
                  <Text className="dark:text-white text-md">City: {orderData.customerInfo.city}</Text>
                  <Text className="dark:text-white text-md">Country: {orderData.customerInfo.country}</Text>
                  <Text className="dark:text-white text-md">Zip Code: {orderData.customerInfo.zipCode}</Text>
                </View>
                <Separator />
                <View>
                  <Text className="text-lg font-semibold mb-2 dark:text-white">Order Items</Text>
                  {orderData.items.map((item) => (
                    <View key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="mb-4">
                      <Text className="font-medium dark:text-white text-md">{item.name}</Text>
                      <Text className="text-md text-gray-500">Quantity: {item.quantity}</Text>
                      {item.selectedSize && <Text className="text-md text-gray-500">Size: {item.selectedSize}</Text>}
                      {item.selectedColor && <Text className="text-md text-gray-500">Color: {item.selectedColor}</Text>}
                      <Text className=" dark:text-white text-md">
                        Price: ${(item.price * item.quantity).toFixed(2)}
                      </Text>
                    </View>
                  ))}
                </View>
                <Separator />
                <View className="flex-row justify-between items-center">
                  <Text className="text-lg font-semibold  dark:text-white text-md">Total:</Text>
                  <Text className="text-lg font-semibold  dark:text-white text-md">${orderData.total.toFixed(2)}</Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </ViewShot>
      </ScrollView>
      <View className="p-4 flex-row justify-between">
        <Button
          className="flex-1 mr-2"
          onPress={async () => {
            try {
              const { status } = await MediaLibrary.requestPermissionsAsync()
              if (status === "granted") {
                const uri = await viewShotRef.current.capture()
                await MediaLibrary.saveToLibraryAsync(uri)
                Alert.alert("Success", "Receipt saved to gallery!")
              } else {
                Alert.alert("Permission Required", "We need permission to save the receipt to your gallery")
              }
            } catch (error) {
              console.error("Error saving receipt:", error)
              Alert.alert("Error", "Failed to save receipt. Please try again.")
            }
          }}
        >
          <Text className="text-white  dark:text-black text-md">Save Receipt</Text>
        </Button>
        <Button className="flex-1 ml-2" variant="outline" onPress={() => router.push("/")}>
          <Text className="dark:text-white text-md">Back to Home</Text>
        </Button>
      </View>
      <TouchableOpacity className="absolute bottom-20 right-4 bg-blue-500 rounded-full p-4" onPress={handleAddReview}>
        <Plus size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  )
}

