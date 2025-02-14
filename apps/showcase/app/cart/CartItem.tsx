// import { memo } from "react"
// import { View, Text, Image, Pressable, StyleSheet } from "react-native"
// import { Minus, Plus, X } from "lucide-react-native"
// import { Card } from "~/components/ui/card"

// interface CartItemProps {
//   item: {
//     id: number
//     name: string
//     price: number
//     image: string
//     quantity: number
//     selectedSize?: string
//     selectedColor?: string
//   }
//   updateQuantity: (id: number, delta: number, size?: string, color?: string) => void
//   removeItem: (id: number, size?: string, color?: string) => void
//   isDarkColorScheme: boolean
// }

// export const CartItem = memo<CartItemProps>(({ item, updateQuantity, removeItem, isDarkColorScheme }) => {
//   return (
//     <Card style={styles.card}>
//       <View style={styles.content}>
//         <Image source={{ uri: item.image }} style={styles.image} />
//         <View style={styles.details}>
//           <Text style={[styles.name, isDarkColorScheme && styles.darkText]}>{item.name}</Text>
//           {item.selectedSize && (
//             <Text style={[styles.variant, isDarkColorScheme && styles.darkMutedText]}>Size: {item.selectedSize}</Text>
//           )}
//           {item.selectedColor && (
//             <Text style={[styles.variant, isDarkColorScheme && styles.darkMutedText]}>Color: {item.selectedColor}</Text>
//           )}
//           <Text style={[styles.price, isDarkColorScheme && styles.darkText]}>${item.price} USD</Text>
//           <View style={styles.actions}>
//             <View style={styles.quantity}>
//               <Pressable
//                 onPress={() => updateQuantity(item.id, -1, item.selectedSize, item.selectedColor)}
//                 style={styles.quantityButton}
//               >
//                 <Minus size={16} color={isDarkColorScheme ? "#fff" : "#000"} />
//               </Pressable>
//               <Text style={[styles.quantityText, isDarkColorScheme && styles.darkText]}>{item.quantity}</Text>
//               <Pressable
//                 onPress={() => updateQuantity(item.id, 1, item.selectedSize, item.selectedColor)}
//                 style={styles.quantityButton}
//               >
//                 <Plus size={16} color={isDarkColorScheme ? "#fff" : "#000"} />
//               </Pressable>
//             </View>
//             <Pressable
//               onPress={() => removeItem(item.id, item.selectedSize, item.selectedColor)}
//               style={styles.removeButton}
//             >
//               <X size={16} color="#fff" />
//             </Pressable>
//           </View>
//         </View>
//       </View>
//     </Card>
//   )
// })

// const styles = StyleSheet.create({
//   card: {
//     marginBottom: 16,
//   },
//   content: {
//     flexDirection: "row",
//     padding: 16,
//   },
//   image: {
//     width: 100,
//     height: 100,
//     borderRadius: 8,
//   },
//   details: {
//     flex: 1,
//     marginLeft: 16,
//   },
//   name: {
//     fontSize: 16,
//     fontWeight: "bold",
//   },
//   variant: {
//     fontSize: 14,
//     marginTop: 4,
//   },
//   price: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginTop: 8,
//   },
//   actions: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginTop: 16,
//   },
//   quantity: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   quantityButton: {
//     borderWidth: 1,
//     borderColor: "#e0e0e0",
//     borderRadius: 4,
//     padding: 8,
//   },
//   quantityText: {
//     marginHorizontal: 16,
//   },
//   removeButton: {
//     backgroundColor: "#ef4444",
//     borderRadius: 4,
//     padding: 8,
//   },
//   darkText: {
//     color: "#fff",
//   },
//   darkMutedText: {
//     color: "#aaa",
//   },
// })

import { memo } from "react"
import { View, Text, Image, Pressable, StyleSheet } from "react-native"
import { Minus, Plus, X } from "lucide-react-native"
import { Card } from "~/components/ui/card"

interface CartItemProps {
  item: {
    id: number
    name: string
    price: number
    image: string
    quantity: number
    selectedSize?: string
    selectedColor?: string
  }
  updateQuantity: (id: number, delta: number, size?: string, color?: string) => void
  removeItem: (id: number, size?: string, color?: string) => void
  isDarkColorScheme: boolean
}

export const CartItem = memo<CartItemProps>(({ item, updateQuantity, removeItem, isDarkColorScheme }) => {
  return (
    <Card style={styles.card}>
      <View style={styles.content}>
        <Image source={{ uri: item.image }} style={styles.image} />
        <View style={styles.details}>
          <Text style={[styles.name, isDarkColorScheme && styles.darkText]}>{item.name}</Text>
          {item.selectedSize && (
            <Text style={[styles.variant, isDarkColorScheme && styles.darkMutedText]}>Size: {item.selectedSize}</Text>
          )}
          {item.selectedColor && (
            <Text style={[styles.variant, isDarkColorScheme && styles.darkMutedText]}>Color: {item.selectedColor}</Text>
          )}
          <Text style={[styles.price, isDarkColorScheme && styles.darkText]}>${item.price} USD</Text>
          <View style={styles.actions}>
            <View style={styles.quantity}>
              <Pressable
                onPress={() => updateQuantity(item.id, -1, item.selectedSize, item.selectedColor)}
                style={styles.quantityButton}
              >
                <Minus size={16} color={isDarkColorScheme ? "#fff" : "#000"} />
              </Pressable>
              <Text style={[styles.quantityText, isDarkColorScheme && styles.darkText]}>{item.quantity}</Text>
              <Pressable
                onPress={() => updateQuantity(item.id, 1, item.selectedSize, item.selectedColor)}
                style={styles.quantityButton}
              >
                <Plus size={16} color={isDarkColorScheme ? "#fff" : "#000"} />
              </Pressable>
            </View>
            <Pressable
              onPress={() => removeItem(item.id, item.selectedSize, item.selectedColor)}
              style={styles.removeButton}
            >
              <X size={16} color="#fff" />
            </Pressable>
          </View>
        </View>
      </View>
    </Card>
  )
})

const styles = StyleSheet.create({
  card: {
    marginBottom: 16,
  },
  content: {
    flexDirection: "row",
    padding: 16,
  },
  image: {
    width: 100,
    height: 100,
    borderRadius: 8,
  },
  details: {
    flex: 1,
    marginLeft: 16,
  },
  name: {
    fontSize: 16,
    fontWeight: "bold",
  },
  variant: {
    fontSize: 14,
    marginTop: 4,
  },
  price: {
    fontSize: 16,
    fontWeight: "bold",
    marginTop: 8,
  },
  actions: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 16,
  },
  quantity: {
    flexDirection: "row",
    alignItems: "center",
  },
  quantityButton: {
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 4,
    padding: 8,
  },
  quantityText: {
    marginHorizontal: 16,
  },
  removeButton: {
    backgroundColor: "#ef4444",
    borderRadius: 4,
    padding: 8,
  },
  darkText: {
    color: "#fff",
  },
  darkMutedText: {
    color: "#aaa",
  },
})

