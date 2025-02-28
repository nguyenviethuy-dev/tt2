

// import { Alert } from "react-native"

// import React from "react"
// import { View, Text, ScrollView, Image, SafeAreaView } from "react-native"
// import { useCart } from "./Contexts/cart-context"
// import { useRouter } from "expo-router"
// import { Button } from "~/components/ui/button"
// import { CartItem } from "./CartItem"
// import { ShippingProtection } from "./ShippingProtection"

// export default function Cart() {
//   const router = useRouter()
//   const { state, removeFromCart, updateQuantity, clearCart } = useCart()
//   const [hasShippingProtection, setHasShippingProtection] = React.useState(true)

//   const calculateSubtotal = () => {
//     return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
//   }

//   const calculateTotal = () => {
//     let total = calculateSubtotal()
//     if (hasShippingProtection) {
//       total += 2.99
//     }
//     return total
//   }

//   // Show empty cart state
//   if (state.items.length === 0) {
//     return (
//       <SafeAreaView className="flex-1 justify-center items-center p-5">
//         <Image
//           source={{
//             uri: "https://static.vecteezy.com/system/resources/previews/035/239/041/non_2x/donation-box-with-clothes-food-and-toys-flat-illustration-vector.jpg",
//           }}
//           className="w-72 h-72 mb-5"
//         />
//         <Text className="text-lg text-center mb-5  dark:text-white">Your cart is ready for you to begin filling it with gifts :)</Text>
//         <Button onPress={() => router.push("/")} className="dark:bg-blue-500">
//           <Text className="text-white text-lg">Continue Shopping</Text>
//         </Button>
//       </SafeAreaView>
//     )
//   }

//   const handleCheckout = () => {
//     try {
//       // Prepare cart data for checkout
//       const cartItemsForCheckout = state.items.map((item) => ({
//         id: item.id,
//         name: item.name,
//         price: item.price,
//         quantity: item.quantity,
//         selectedSize: item.selectedSize,
//         selectedColor: item.selectedColor,
//       }))

//       // Navigate to checkout with cart data
//       router.push({
//         pathname: "/cart/Checkout",
//         params: {
//           cartItems: JSON.stringify(cartItemsForCheckout),
//           total: calculateTotal().toString(),
//           hasShippingProtection: hasShippingProtection.toString(),
//         },
//       })
//     } catch (error) {
//       console.error("Error navigating to checkout:", error)
//       Alert.alert("Error", "There was a problem processing your cart. Please try again.")
//     }
//   }

//   return (
//     <SafeAreaView className="flex-1 bg-white">
//       <ScrollView className="flex-1">
//         {hasShippingProtection && <ShippingProtection onRemove={() => setHasShippingProtection(false)} />}
//         {state.items.map((item) => (
//           <CartItem
//             key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
//             item={item}
//             onUpdateQuantity={(quantity) => updateQuantity(item.id, quantity, item.selectedSize, item.selectedColor)}
//             onRemove={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
//           />
//         ))}
//       </ScrollView>
//       <View className="p-4 border-t border-gray-200">
//         <Text className="text-xl font-bold mb-4">Order Summary</Text>
//         <View className="flex-row justify-between mb-2">
//           <Text>Subtotal</Text>
//           <Text>${calculateSubtotal().toFixed(2)} USD</Text>
//         </View>
//         {hasShippingProtection && (
//           <View className="flex-row justify-between mb-2">
//             <Text>Shipping Protection</Text>
//             <Text>$2.99 USD</Text>
//           </View>
//         )}
//         <View className="flex-row justify-between mb-4">
//           <Text className="font-bold text-lg">Total</Text>
//           <Text className="font-bold text-lg">${calculateTotal().toFixed(2)} USD</Text>
//         </View>
//         <Button onPress={handleCheckout} className="w-full mb-2 h-16 justify-center items-center dark:bg-blue-500">
//           <Text className="text-red-600 text-lg  dark:text-white">Checkout now</Text>
//         </Button>

//         <Button
//           variant="outline"
//           onPress={() => router.push("/")}
//           className="w-full mb-2 h-16 flex items-center justify-center"
//         >
//           <Text className="text-red-600 text-lg">Continue Shopping</Text>
//         </Button>

//       </View>

//       <View>
//         <View className="flex-row justify-between px-7 py-15">
//           <Button variant="outline" className="flex-1 mr-2 py-15 flex-row justify-center items-center">
//             <Image
//               source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Paypal_2014_logo.png" }}
//               className="w-16 h-12 mr-2"
//             />

//           </Button>
//           <Button variant="outline" className="flex-1 ml-2 py-15 flex-row justify-center items-center">
//             <Image
//               source={{
//                 uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/768px-Google_Pay_Logo.svg.png",
//               }}
//               className="w-16 h-6 mr-2"
//             />

//           </Button>
//         </View>

//         <View className="flex-row justify-center mb-4">
//           <Image
//             source={{ uri: "https://famvibe.com/cdn/shop/t/358/assets/trust-2.svg?v=63322071302514675171738572546" }}
//             className="w-24 h-10"
//           />
//         </View>
//         <View className="border border-gray-200 rounded-lg p-4">
//           <Image
//             source={{
//               uri: "https://famvibe.com/cdn/shop/t/358/assets/buyerprotectionblack.svg?v=106375279658734052501738572257",
//             }}
//             className="w-6 h-6 mb-2"
//           />
//           <Text className="font-bold mb-2">BUYER PROTECTION</Text>
//           <Text className="text-xs mb-1">✓ Full-refund of your purchase. No question asked.</Text>
//           <Text className="text-xs">✓ Famvibe now offers free returns.</Text>
//         </View>
//       </View>
//     </SafeAreaView>
//   )
// }

"use client"

import { Alert } from "react-native"

import React from "react"
import { View, Text, ScrollView, Image, SafeAreaView } from "react-native"
import { useCart } from "./Contexts/cart-context"
import { useRouter } from "expo-router"
import { Button } from "~/components/ui/button"
import { CartItem } from "./CartItem"
import { ShippingProtection } from "./ShippingProtection"

export default function Cart() {
  const router = useRouter()
  const { state, removeFromCart, updateQuantity, clearCart } = useCart()
  const [hasShippingProtection, setHasShippingProtection] = React.useState(true)

  const calculateSubtotal = () => {
    return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  }

  const calculateTotal = () => {
    let total = calculateSubtotal()
    if (hasShippingProtection) {
      total += 2.99
    }
    return total
  }

  // Show empty cart state
  if (state.items.length === 0) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center p-5">
        <Image
          source={{
            uri: "https://static.vecteezy.com/system/resources/previews/035/239/041/non_2x/donation-box-with-clothes-food-and-toys-flat-illustration-vector.jpg",
          }}
          className="w-72 h-72 mb-5"
        />
        <Text className="text-lg text-center mb-5  dark:text-white">
          Your cart is ready for you to begin filling it with gifts :)
        </Text>
        <Button onPress={() => router.push("/")} className="dark:bg-blue-500">
          <Text className="text-white text-lg">Continue Shopping</Text>
        </Button>
      </SafeAreaView>
    )
  }

  const handleCheckout = () => {
    try {
      // Prepare cart data for checkout
      const cartItemsForCheckout = state.items.map((item) => ({
        id: item.id,
        name: item.name,
        price: item.price,
        quantity: item.quantity,
        selectedSize: item.selectedSize,
        selectedColor: item.selectedColor,
      }))

      // Navigate to checkout with cart data
      router.push({
        pathname: "/cart/Checkout",
        params: {
          cartItems: JSON.stringify(cartItemsForCheckout),
          total: calculateTotal().toString(),
          hasShippingProtection: hasShippingProtection.toString(),
        },
      })
    } catch (error) {
      console.error("Error navigating to checkout:", error)
      Alert.alert("Error", "There was a problem processing your cart. Please try again.")
    }
  }

  return (
    <SafeAreaView className="flex-1 bg-white">
      <ScrollView className="flex-1">
        {hasShippingProtection && <ShippingProtection onRemove={() => setHasShippingProtection(false)} />}
        {state.items.map((item) => (
          <CartItem
            key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
            item={item}
            onUpdateQuantity={(quantity) => updateQuantity(item.id, quantity, item.selectedSize, item.selectedColor)}
            onRemove={() => removeFromCart(item.id, item.selectedSize, item.selectedColor)}
          />
        ))}
      </ScrollView>
      <View className="p-4 border-t border-gray-200">
        <Text className="text-xl font-bold mb-4">Order Summary</Text>
        <View className="flex-row justify-between mb-2">
          <Text>Subtotal</Text>
          <Text>${calculateSubtotal().toFixed(2)} USD</Text>
        </View>
        {hasShippingProtection && (
          <View className="flex-row justify-between mb-2">
            <Text>Shipping Protection</Text>
            <Text>$2.99 USD</Text>
          </View>
        )}
        <View className="flex-row justify-between mb-4">
          <Text className="font-bold text-lg">Total</Text>
          <Text className="font-bold text-lg">${calculateTotal().toFixed(2)} USD</Text>
        </View>
        <Button onPress={handleCheckout} className="w-full mb-2 h-12 justify-center items-center dark:bg-blue-500">
          <Text className="text-red-600 text-lg dark:text-white" numberOfLines={1}>
            Checkout now
          </Text>
        </Button>

        <Button
          variant="outline"
          onPress={() => router.push("/")}
          className="w-full mb-2 h-12 justify-center items-center"
        >
          <Text className="text-red-600 text-lg" numberOfLines={1}>
            Continue Shopping
          </Text>
        </Button>
      </View>

      <View className="px-4 pb-4">
        <View className="flex-row justify-between py-3">
          <Button variant="outline" className="flex-1 mr-2 justify-center items-center dark:bg-white">
            <Image
              source={{ uri: "https://cdn.pixabay.com/photo/2015/05/26/09/37/paypal-784404_1280.png" }}
              className="w-28 h-12"
            />
          </Button>
          <Button variant="outline" className="flex-1 ml-2 justify-center items-center ">
            <Image
              source={{
                uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f2/Google_Pay_Logo.svg/768px-Google_Pay_Logo.svg.png",
              }}
              className="w-16 h-6"
            />
          </Button>
        </View>

        <View className="flex-row justify-center mb-4">
          <Image
            source={{ uri: "https://famvibe.com/cdn/shop/t/358/assets/trust-2.svg?v=63322071302514675171738572546" }}
            className="w-24 h-10"
          />
        </View>
        <View className="border border-gray-200 rounded-lg p-4">
          <Image
            source={{
              uri: "https://famvibe.com/cdn/shop/t/358/assets/buyerprotectionblack.svg?v=106375279658734052501738572257",
            }}
            className="w-6 h-6 mb-2"
          />
          <Text className="font-bold mb-2">BUYER PROTECTION</Text>
          <Text className="text-xs mb-1">✓ Full-refund of your purchase. No question asked.</Text>
          <Text className="text-xs">✓ Famvibe now offers free returns.</Text>
        </View>
      </View>
    </SafeAreaView>
  )
}

