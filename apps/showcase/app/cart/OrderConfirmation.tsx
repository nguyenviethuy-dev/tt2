import { Text, SafeAreaView } from "react-native"
import { useRouter } from "expo-router"
import { Button } from "~/components/ui/button"

export default function OrderConfirmation() {
  const router = useRouter()

  return (
    <SafeAreaView className="flex-1 justify-center items-center bg-white">
      <Text className="text-2xl font-bold mb-4">Thank You for Your Order!</Text>
      <Text className="text-lg text-center mb-8">
        Your order has been received and is being processed. You will receive an email confirmation shortly.
      </Text>
      <Button onPress={() => router.push("/")} className="w-64">
        Continue Shopping
      </Button>
    </SafeAreaView>
  )
}



