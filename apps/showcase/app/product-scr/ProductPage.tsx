
// import React, { useState, useCallback } from "react"
// import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions, Modal } from "react-native"
// import { useRouter } from "expo-router"
// import { Home } from "lucide-react-native"
// import { useColorScheme } from "~/lib/useColorScheme"
// import FilterSidebar from "./FilterSidebar"
// import type { FilterState } from "./FilterSidebar"
// import products from "./data/products"
// import type { Product } from "./data/type/product"

// const { width } = Dimensions.get("window")

// const ProductPage: React.FC = () => {
//   const router = useRouter()
//   const [sortBy, setSortBy] = useState("trending")
//   const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
//   const [isLoading, setIsLoading] = useState(false)
//   const [isFilterOpen, setIsFilterOpen] = useState(false)

//   const productCounts = React.useMemo(() => {
//     const counts = {
//       giftFor: {} as Record<string, number>,
//       productType: {} as Record<string, number>,
//       occasions: {} as Record<string, number>,
//       colors: {} as Record<string, number>,
//       price: {
//         under25: products.filter((p) => p.price <= 25).length,
//         above25: products.filter((p) => p.price > 25).length,
//       },
//     }

//     products.forEach((product) => {
//       product.giftFor?.forEach((gift) => {
//         counts.giftFor[gift] = (counts.giftFor[gift] || 0) + 1
//       })
//       if (product.productType) {
//         counts.productType[product.productType] = (counts.productType[product.productType] || 0) + 1
//       }
//       product.occasions?.forEach((occasion) => {
//         counts.occasions[occasion] = (counts.occasions[occasion] || 0) + 1
//       })
//       product.colors?.forEach((color) => {
//         counts.colors[color] = (counts.colors[color] || 0) + 1
//       })
//     })

//     return counts
//   }, [])

//   const handleProductPress = useCallback(
//     (productId: number) => {
//       router.push(`/product-scr/${productId}`)
//     },
//     [router]
//   )

//   const { isDarkColorScheme } = useColorScheme()

//   const handleFilterChange = useCallback(
//     async (filters: FilterState) => {
//       setIsLoading(true)
//       let filtered = [...products]

//       if (filters.giftFor.length > 0) {
//         filtered = filtered.filter((product) => product.giftFor?.some((gift) => filters.giftFor.includes(gift)))
//       }
//       if (filters.productType.length > 0) {
//         filtered = filtered.filter((product) => filters.productType.includes(product.productType || ""))
//       }
//       if (filters.occasions.length > 0) {
//         filtered = filtered.filter((product) => product.occasions?.some((occasion) => filters.occasions.includes(occasion)))
//       }
//       if (filters.colors.length > 0) {
//         filtered = filtered.filter((product) => product.colors?.some((color) => filters.colors.includes(color)))
//       }
//       if (filters.priceRanges.length > 0) {
//         filtered = filtered.filter((product) => {
//           if (filters.priceRanges.includes("under25") && product.price <= 25) return true
//           if (filters.priceRanges.includes("above25") && product.price > 25) return true
//           return false
//         })
//       }

//       switch (sortBy) {
//         case "price-low":
//           filtered.sort((a, b) => a.price - b.price)
//           break
//         case "price-high":
//           filtered.sort((a, b) => b.price - a.price)
//           break
//         case "newest":
//           filtered.sort((a, b) => b.id - a.id)
//           break
//       }

//       setFilteredProducts(filtered)
//       setIsLoading(false)
//       setIsFilterOpen(false)
//     },
//     [sortBy]
//   )

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <TouchableOpacity onPress={() => router.push("/")}> 
//           <Home size={28} color={isDarkColorScheme ? "#fff" : "#000"} />
//         </TouchableOpacity>
//         <Text style={[styles.title, { color: isDarkColorScheme ? "#fff" : "#000" }]}>New Arrivals</Text>
//         <TouchableOpacity onPress={() => setIsFilterOpen(true)}>
//           <Text style={styles.filterText}>Filter</Text>
//         </TouchableOpacity>
//       </View>

//       <FlatList
//         className="bg-white"
//         data={filteredProducts}
//         renderItem={({ item }) => (
//           <TouchableOpacity style={styles.productItem} onPress={() => handleProductPress(item.id)}>
//             <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="cover" />
//             <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
//           </TouchableOpacity>
//         )}
//         keyExtractor={(item) => item.id.toString()}
//         numColumns={2}
//         contentContainerStyle={styles.productList}
//       />

//       <Modal visible={isFilterOpen} animationType="slide">
//         <View style={styles.modalContainer}>
//           <TouchableOpacity style={styles.closeButton} onPress={() => setIsFilterOpen(false)}>
//             <Text style={styles.closeText}>✕</Text>
//           </TouchableOpacity>
//           <FilterSidebar onFilterChange={handleFilterChange} productCounts={productCounts} />
//         </View>
//       </Modal>
//     </View>
//   )
// }

// const styles = StyleSheet.create({
//   container: {
//     flex: 1,
//     padding: 10,
//   },
//   header: {
//     flexDirection: "row",
//     justifyContent: "space-between",
//     alignItems: "center",
//     marginBottom: 16,
//   },
//   title: {
//     fontSize: 24,
//     fontWeight: "bold",
//   },
//   filterText: {
//     fontSize: 16,
//     color: "blue",
//   },
//   productList: {
//     paddingVertical: 10,
//   },
//   productItem: {
//     width: (width - 30) / 2,
//     marginBottom: 20,
//     marginHorizontal: 5,
//     borderWidth: 1,
//     borderColor: "#ccc",
//     borderRadius: 8,
//     padding: 10,
//   },
//   productImage: {
//     width: "100%",
//     aspectRatio: 1,
//     borderRadius: 4,
//     marginBottom: 10,
//   },
//   productName: {
//     fontSize: 14,
//     fontWeight: "500",
//     marginBottom: 5,
//   },
//   modalContainer: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "white",
//   },
//   closeButton: {
//     position: "absolute",
//     top: 10,
//     right: 10,
//     padding: 10,
//     zIndex: 10,
//   },
//   closeText: {
//     fontSize: 24,
//     fontWeight: "bold",
//     color: "#333",
//   },
// })

// export default ProductPage


import React, { useState, useCallback } from "react"
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions, Modal } from "react-native"
import { useRouter } from "expo-router"
import { Home } from "lucide-react-native"
import { useColorScheme } from "~/lib/useColorScheme"
import FilterSidebar from "./FilterSidebar"
import type { FilterState } from "./FilterSidebar"
import products from "./data/products"
import type { Product } from "./data/type/product"

const { width } = Dimensions.get("window")

const ProductPage: React.FC = () => {
  const router = useRouter()
  const [sortBy, setSortBy] = useState("trending")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
  const [isLoading, setIsLoading] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)

  const productCounts = React.useMemo(() => {
    const counts = {
      giftFor: {} as Record<string, number>,
      productType: {} as Record<string, number>,
      occasions: {} as Record<string, number>,
      colors: {} as Record<string, number>,
      price: {
        under25: products.filter((p) => p.price <= 25).length,
        above25: products.filter((p) => p.price > 25).length,
      },
    }

    products.forEach((product) => {
      product.giftFor?.forEach((gift) => {
        counts.giftFor[gift] = (counts.giftFor[gift] || 0) + 1
      })
      if (product.productType) {
        counts.productType[product.productType] = (counts.productType[product.productType] || 0) + 1
      }
      product.occasions?.forEach((occasion) => {
        counts.occasions[occasion] = (counts.occasions[occasion] || 0) + 1
      })
      product.colors?.forEach((color) => {
        counts.colors[color] = (counts.colors[color] || 0) + 1
      })
    })

    return counts
  }, [])

      const handleProductPress = useCallback(
          (productId: number) => {
            router.push(`/product-scr/${productId}`)
          },
          [router]
        )

  const { isDarkColorScheme } = useColorScheme()

  const handleFilterChange = useCallback(
    async (filters: FilterState) => {
      setIsLoading(true)
      let filtered = [...products]

      if (filters.giftFor.length > 0) {
        filtered = filtered.filter((product) => product.giftFor?.some((gift) => filters.giftFor.includes(gift)))
      }
      if (filters.productType.length > 0) {
        filtered = filtered.filter((product) => filters.productType.includes(product.productType || ""))
      }
      if (filters.occasions.length > 0) {
        filtered = filtered.filter((product) => product.occasions?.some((occasion) => filters.occasions.includes(occasion)))
      }
      if (filters.colors.length > 0) {
        filtered = filtered.filter((product) => product.colors?.some((color) => filters.colors.includes(color)))
      }
      if (filters.priceRanges.length > 0) {
        filtered = filtered.filter((product) => {
          if (filters.priceRanges.includes("under25") && product.price <= 25) return true
          if (filters.priceRanges.includes("above25") && product.price > 25) return true
          return false
        })
      }

      switch (sortBy) {
        case "price-low":
          filtered.sort((a, b) => a.price - b.price)
          break
        case "price-high":
          filtered.sort((a, b) => b.price - a.price)
          break
        case "newest":
          filtered.sort((a, b) => b.id - a.id)
          break
      }

      setFilteredProducts(filtered)
      setIsLoading(false)
      setIsFilterOpen(false)
    },
    [sortBy]
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.push("/")}> 
          <Home size={28} color={isDarkColorScheme ? "#fff" : "#000"} />
        </TouchableOpacity>
        <Text style={[styles.title, { color: isDarkColorScheme ? "#fff" : "#000" }]}>New Arrivals</Text>
        <TouchableOpacity onPress={() => setIsFilterOpen(true)}>
          <Text style={styles.filterText}>Filter</Text>
        </TouchableOpacity>
      </View>

      <FlatList
        className="bg-white"
        data={filteredProducts}
        renderItem={({ item }) => (
          <TouchableOpacity style={styles.productItem} onPress={() => handleProductPress(item.id)}>
            <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="cover" />
            <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
          </TouchableOpacity>
        )}
        keyExtractor={(item) => item.id.toString()}
        numColumns={2}
        contentContainerStyle={styles.productList}
      />

      <Modal visible={isFilterOpen} animationType="slide">
        <View style={styles.modalContainer}>
          <TouchableOpacity style={styles.closeButton} onPress={() => setIsFilterOpen(false)}>
            <Text style={styles.closeText}>✕</Text>
          </TouchableOpacity>
          <FilterSidebar onFilterChange={handleFilterChange} productCounts={productCounts} />
        </View>
      </Modal>
    </View>
  )
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 10,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
  },
  filterText: {
    fontSize: 16,
    color: "blue",
  },
  productList: {
    paddingVertical: 10,
  },
  productItem: {
    width: (width - 30) / 2,
    marginBottom: 20,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#ccc",
    borderRadius: 8,
    padding: 10,
  },
  productImage: {
    width: "100%",
    aspectRatio: 1,
    borderRadius: 4,
    marginBottom: 10,
  },
  productName: {
    fontSize: 14,
    fontWeight: "500",
    marginBottom: 5,
  },
  modalContainer: {
    flex: 1,
    padding: 20,
    backgroundColor: "white",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
    zIndex: 10,
  },
  closeText: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
  },
})

export default ProductPage