

// import type React from "react"
// import { useState, useCallback, useMemo } from "react"
// import { View, Text, ScrollView, Image, StyleSheet, Pressable } from "react-native"
// import { useNavigation } from "@react-navigation/native"
// import { ShieldCheck } from "lucide-react-native"
// import Animated, { FadeIn, FadeOut } from "react-native-reanimated"
// import { useCart } from "./Contexts/cart-context"
// import { Button } from "~/components/ui/button"
// import { Card } from "~/components/ui/card"
// import { useColorScheme } from "~/lib/useColorScheme"
// import { ThemeToggle } from "~/components/ThemeToggle"
// import { CartItem } from "./CartItem"

// const AnimatedPressable = Animated.createAnimatedComponent(Pressable)

// export const Cart: React.FC = () => {
//   const navigation = useNavigation()
//   const { state, dispatch } = useCart()
//   const [hasShippingProtection, setHasShippingProtection] = useState(true)
//   const { isDarkColorScheme } = useColorScheme()

//   const updateQuantity = useCallback(
//     (id: number, delta: number, size?: string, color?: string) => {
//       dispatch({
//         type: "UPDATE_QUANTITY",
//         payload: { id, quantity: delta, size, color },
//       })
//     },
//     [dispatch],
//   )

//   const removeItem = useCallback(
//     (id: number, size?: string, color?: string) => {
//       dispatch({
//         type: "REMOVE_ITEM",
//         payload: { id, size, color },
//       })
//     },
//     [dispatch],
//   )

//   const subtotal = useMemo(() => {
//     return state.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
//   }, [state.items])

//   const total = useMemo(() => {
//     return subtotal + (hasShippingProtection ? 2.99 : 0)
//   }, [subtotal, hasShippingProtection])

//   if (state.items.length === 0) {
//     return (
//       <View style={[styles.container, isDarkColorScheme && styles.darkContainer]}>
//         <Image
//           source={{
//             uri: "https://static.vecteezy.com/system/resources/previews/035/239/041/non_2x/donation-box-with-clothes-food-and-toys-flat-illustration-vector.jpg",
//           }}
//           style={styles.emptyCartImage}
//         />
//         <Text style={[styles.emptyCartText, isDarkColorScheme && styles.darkText]}>
//           Your cart is ready for you to begin filling it with gifts :)
//         </Text>
//         <Button onPress={() => navigation.goBack()}>Continue Shopping</Button>
//         <ThemeToggle />
//       </View>
//     )
//   }

//   return (
//     <ScrollView style={[styles.container, isDarkColorScheme && styles.darkContainer]}>
//       <View style={styles.content}>
//         <ThemeToggle />
//         {hasShippingProtection && (
//           <Card style={styles.shippingProtectionCard}>
//             <View style={styles.shippingProtectionContent}>
//               <ShieldCheck size={64} color={isDarkColorScheme ? "#fff" : "#000"} />
//               <View style={styles.shippingProtectionInfo}>
//                 <Text style={[styles.shippingProtectionTitle, isDarkColorScheme && styles.darkText]}>
//                   Shipping Protection
//                 </Text>
//                 <Text style={[styles.shippingProtectionDescription, isDarkColorScheme && styles.darkMutedText]}>
//                   Protect your item from damage, loss, or theft during shipping
//                 </Text>
//                 <Text style={[styles.shippingProtectionPrice, isDarkColorScheme && styles.darkText]}>$2.99 USD</Text>
//                 <Button
//                   variant="outline"
//                   size="sm"
//                   onPress={() => setHasShippingProtection(false)}
//                   style={styles.removeButton}
//                 >
//                   Remove
//                 </Button>
//               </View>
//             </View>
//           </Card>
//         )}

//         {state.items.map((item) => (
//           <AnimatedPressable
//             key={`${item.id}-${item.selectedSize}-${item.selectedColor}`}
//             entering={FadeIn}
//             exiting={FadeOut}
//           >
//             <CartItem
//               item={item}
//               updateQuantity={updateQuantity}
//               removeItem={removeItem}
//               isDarkColorScheme={isDarkColorScheme}
//             />
//           </AnimatedPressable>
//         ))}

//         <Card style={styles.orderSummaryCard}>
//           <View style={styles.orderSummaryContent}>
//             <Text style={[styles.orderSummaryTitle, isDarkColorScheme && styles.darkText]}>Order Summary</Text>
//             <View style={styles.summaryRow}>
//               <Text style={[styles.summaryText, isDarkColorScheme && styles.darkText]}>Subtotal</Text>
//               <Text style={[styles.summaryText, isDarkColorScheme && styles.darkText]}>${subtotal.toFixed(2)} USD</Text>
//             </View>
//             {hasShippingProtection && (
//               <View style={styles.summaryRow}>
//                 <Text style={[styles.summaryText, isDarkColorScheme && styles.darkText]}>Shipping Protection</Text>
//                 <Text style={[styles.summaryText, isDarkColorScheme && styles.darkText]}>$2.99 USD</Text>
//               </View>
//             )}
//             <View style={styles.divider} />
//             <View style={styles.summaryRow}>
//               <Text style={[styles.totalText, isDarkColorScheme && styles.darkText]}>Total</Text>
//               <Text style={[styles.totalText, isDarkColorScheme && styles.darkText]}>${total.toFixed(2)} USD</Text>
//             </View>
//           </View>
//           <View style={styles.checkoutButtonContainer}>
//             <Button
//               onPress={() => {
//                 /* Handle checkout */
//               }}
//               style={styles.checkoutButton}
//             >
//               Checkout now
//             </Button>
//           </View>
//         </Card>
//       </View>
//     </ScrollView>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//   },
//   darkContainer: {
//     backgroundColor: "#1a1a1a",
//   },
//   content: {
//     padding: 16,
//   },
//   emptyCartImage: {
//     width: 300,
//     height: 300,
//     marginBottom: 32,
//     opacity: 0.4,
//   },
//   emptyCartText: {
//     fontSize: 24,
//     fontWeight: "bold",
//     textAlign: "center",
//     marginBottom: 32,
//   },
//   darkText: {
//     color: "#fff",
//   },
//   darkMutedText: {
//     color: "#aaa",
//   },
//   shippingProtectionCard: {
//     marginBottom: 16,
//   },
//   shippingProtectionContent: {
//     flexDirection: "row",
//     alignItems: "center",
//     padding: 16,
//   },
//   shippingProtectionInfo: {
//     flex: 1,
//     marginLeft: 16,
//   },
//   shippingProtectionTitle: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   shippingProtectionDescription: {
//     fontSize: 14,
//     marginTop: 4,
//   },
//   shippingProtectionPrice: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginTop: 8,
//   },
//   removeButton: {
//     marginTop: 8,
//   },
//   orderSummaryCard: {
//     marginTop: 16,
//   },
//   orderSummaryContent: {
//     padding: 16,
//   },
//   orderSummaryTitle: {
//     fontSize: 20,
//     fontWeight: "bold",
//     marginBottom: 16,
//   },
//   summaryRow: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     marginBottom: 8,
//   },
//   summaryText: {
//     fontSize: 16,
//   },
//   divider: {
//     borderTopWidth: 1,
//     borderColor: "#e0e0e0",
//     marginVertical: 8,
//   },
//   totalText: {
//     fontSize: 18,
//     fontWeight: "bold",
//   },
//   checkoutButtonContainer: {
//     padding: 16,
//     borderTopWidth: 1,
//     borderColor: "#e0e0e0",
//   },
//   checkoutButton: {
//     width: "100%",
//   },
// })


import React from 'react'
import { View, Text, ScrollView, TouchableOpacity, StyleSheet, SafeAreaView } from 'react-native'
import { useCart } from './Contexts/cart-context'
import { Ionicons } from '@expo/vector-icons'
import { useRouter } from 'expo-router'

export default function Cart() {
  const router = useRouter()
  const cartContext = useCart()
  
  if (!cartContext) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Text>Loading cart...</Text>
      </SafeAreaView>
    )
  }

  const { state, dispatch } = cartContext

  const updateQuantity = (id: number, quantity: number, size?: string, color?: string) => {
    if (quantity === 0) {
      dispatch({
        type: "REMOVE_ITEM",
        payload: { id, size, color }
      })
    } else {
      dispatch({
        type: "UPDATE_QUANTITY",
        payload: { id, quantity, size, color }
      })
    }
  }

  const removeItem = (id: number, size?: string, color?: string) => {
    dispatch({
      type: "REMOVE_ITEM",
      payload: { id, size, color }
    })
  }

  const calculateTotal = () => {
    return state.items.reduce((total, item) => total + (item.price * item.quantity), 0)
  }

  if (state.items.length === 0) {
    return (
      <SafeAreaView style={styles.emptyContainer}>
        <Ionicons name="cart-outline" size={64} color="#ccc" />
        <Text style={styles.emptyText}>Your cart is empty</Text>
        <TouchableOpacity 
          style={styles.continueButton}
          onPress={() => router.push("/")}
        >
          <Text style={styles.continueButtonText}>Continue Shopping</Text>
        </TouchableOpacity>
      </SafeAreaView>
    )
  }

  return (
    <SafeAreaView style={styles.container}>
      <ScrollView style={styles.itemList}>
        {state.items.map((item) => (
          <View key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} style={styles.cartItem}>
            <View style={styles.itemInfo}>
              <Text style={styles.itemName}>{item.name}</Text>
              {item.selectedSize && (
                <Text style={styles.itemDetail}>Size: {item.selectedSize}</Text>
              )}
              {item.selectedColor && (
                <Text style={styles.itemDetail}>Color: {item.selectedColor}</Text>
              )}
                            <Text style={styles.itemPrice}>${item.price}</Text>
            </View>
            <View style={styles.quantityContainer}>
              <TouchableOpacity
                onPress={() => updateQuantity(
                  item.id,
                  item.quantity - 1,
                  item.selectedSize,
                  item.selectedColor
                )}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityButtonText}>-</Text>
              </TouchableOpacity>
              <Text style={styles.quantityText}>{item.quantity}</Text>
              <TouchableOpacity
                onPress={() => updateQuantity(
                  item.id,
                  item.quantity + 1,
                  item.selectedSize,
                  item.selectedColor
                )}
                style={styles.quantityButton}
              >
                <Text style={styles.quantityButtonText}>+</Text>
              </TouchableOpacity>
            </View>
            <TouchableOpacity
              onPress={() => removeItem(item.id, item.selectedSize, item.selectedColor)}
              style={styles.removeButton}
            >
              <Ionicons name="trash-outline" size={24} color="#FF4444" />
            </TouchableOpacity>
          </View>
        ))}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total:</Text>
          <Text style={styles.totalAmount}>${calculateTotal().toFixed(2)}</Text>
        </View>
        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={() => router.push("/checkout")}
        >
          <Text style={styles.checkoutButtonText}>Proceed to Checkout</Text>
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
  },
  itemList: {
    flex: 1,
  },
  cartItem: {
    flexDirection: 'row',
    padding: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#eee',
    alignItems: 'center',
  },
  itemInfo: {
    flex: 1,
    marginLeft: 15,
  },
  itemName: {
    fontSize: 16,
    fontWeight: '600',
  },
  itemDetail: {
    fontSize: 14,
    color: '#666',
    marginTop: 4,
  },
  itemPrice: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000',
    marginTop: 4,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginRight: 15,
  },
  quantityButton: {
    width: 30,
    height: 30,
    borderRadius: 15,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  quantityButtonText: {
    fontSize: 18,
    fontWeight: '600',
  },
  quantityText: {
    marginHorizontal: 15,
    fontSize: 16,
    fontWeight: '500',
  },
  removeButton: {
    padding: 5,
  },
  footer: {
    padding: 15,
    borderTopWidth: 1,
    borderTopColor: '#eee',
    backgroundColor: '#fff',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 18,
    fontWeight: '600',
  },
  totalAmount: {
    fontSize: 20,
    fontWeight: '700',
  },
  checkoutButton: {
    backgroundColor: '#000',
    padding: 15,
    borderRadius: 8,
    alignItems: 'center',
  },
  checkoutButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '600',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyText: {
    fontSize: 18,
    color: '#666',
    marginTop: 10,
    marginBottom: 20,
  },
  continueButton: {
    backgroundColor: '#000',
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
  },
  continueButtonText: {
    color: '#fff',
    fontSize: 16,
    fontWeight: '500',
  },
})