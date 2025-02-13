

// import type React from "react"
// import { useState, useEffect, useCallback } from "react"
// import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions, Modal, Button } from "react-native"
// import { useRouter } from "expo-router"
// import products from "./data/products"
// import type { Product } from "./data/type/product"
// import type { FilterState } from "./FilterSidebar"
// import FilterSidebar from "./FilterSidebar"

// const { width } = Dimensions.get("window")

// const ProductPage: React.FC = () => {
//   const router = useRouter()
//   const [sortBy, setSortBy] = useState("trending")
//   const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
//   const [isLoading, setIsLoading] = useState(false)
//   const [isFilterOpen, setIsFilterOpen] = useState(false)
//   const [productCounts, setProductCounts] = useState<{
//     giftFor: Record<string, number>
//     productType: Record<string, number>
//     occasions: Record<string, number>
//     colors: Record<string, number>
//     price: Record<string, number>
//   }>({
//     giftFor: {},
//     productType: {},
//     occasions: {},
//     colors: {},
//     price: {}
//   })

//   useEffect(() => {
//       const counts = {
//         giftFor: {},
//         productType: {},
//         occasions: {},
//         colors: {},
//         price: {}
//       }
//       products.forEach((product) => {
//         Array.isArray(product.productType) && product.productType.forEach((type) => {
//           counts.productType[type] = (counts.productType[type] || 0) + 1
//         })
//       })
//       setProductCounts(counts)
//     }, [])

//   const handleProductPress = useCallback(
//     (productId: number) => {
//       router.push(`/product-details/${productId}`)
//     },
//     [router],
//   )

//   const handleFilterChange = useCallback(
//     async (filters: FilterState) => {
//       setIsLoading(true)
//       await new Promise((resolve) => setTimeout(resolve, 500))
//       let filtered = products

//       if (filters.giftFor.length > 0) {
//         filtered = filtered.filter((product) => product.giftFor?.some((gift) => filters.giftFor.includes(gift)))
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
//     [sortBy],
//   )

//   useEffect(() => {
//     handleFilterChange({
//       giftFor: [],
//       productType: [],
//       occasions: [],
//       colors: [],
//       priceRanges: [],
//     })
//   }, [handleFilterChange])

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Button title="Home" onPress={() => router.push("/")} />
//         <Text style={styles.title}>New Arrivals</Text>
//         <Button title="Filter" onPress={() => setIsFilterOpen(true)} />
//       </View>

//       <FlatList
//         data={filteredProducts}
//         renderItem={({ item }) => (
//           <TouchableOpacity style={styles.productItem} onPress={() => handleProductPress(item.id)}>
//             <Image source={{ uri: item.image || "https://via.placeholder.com/150" }} style={styles.productImage} />
//             <Text style={styles.productName} numberOfLines={2}>{item.name}</Text>
//             <Text style={styles.price}>${item.price}</Text>
//           </TouchableOpacity>
//         )}
//         keyExtractor={(item) => item.id.toString()}
//         numColumns={2}
//         contentContainerStyle={styles.productList}
//       />

//       <Modal visible={isFilterOpen} animationType="slide">
//         <View style={styles.modalContainer}>
//           <FilterSidebar onFilterChange={handleFilterChange} productCounts={productCounts} />
//           <Button title="Close" onPress={() => setIsFilterOpen(false)} />
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
//   price: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginRight: 5,
//   },
//   modalContainer: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "white",
//   },
// })

// export default ProductPage

//2

// "use client"

// import React, { useState, useCallback } from "react"
// import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions } from "react-native"
// import { useRouter } from "expo-router"
// import { Star, Filter } from "lucide-react-native"
// import { Sheet } from "~/components/ui/sheet"
// import { Button } from "~/components/ui/button"
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

//   // Calculate product counts
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
//       // Count gift for
//       product.giftFor?.forEach((gift) => {
//         counts.giftFor[gift] = (counts.giftFor[gift] || 0) + 1
//       })

//       // Count product type
//       if (product.productType) {
//         counts.productType[product.productType] = (counts.productType[product.productType] || 0) + 1
//       }

//       // Count occasions
//       product.occasions?.forEach((occasion) => {
//         counts.occasions[occasion] = (counts.occasions[occasion] || 0) + 1
//       })

//       // Count colors
//       product.colors?.forEach((color) => {
//         counts.colors[color] = (counts.colors[color] || 0) + 1
//       })
//     })

//     return counts
//   }, [])

//   const handleProductPress = useCallback(
//     (productId: number) => {
//       router.push({
//         pathname: "/product-detail",
//         params: { id: productId },
//       })
//     },
//     [router],
//   )

//   const handleFilterChange = useCallback(
//     async (filters: FilterState) => {
//       setIsLoading(true)

//       let filtered = [...products]

//       // Apply filters
//       if (filters.giftFor.length > 0) {
//         filtered = filtered.filter((product) => product.giftFor?.some((gift) => filters.giftFor.includes(gift)))
//       }

//       if (filters.productType.length > 0) {
//         filtered = filtered.filter((product) => filters.productType.includes(product.productType || ""))
//       }

//       if (filters.occasions.length > 0) {
//         filtered = filtered.filter((product) =>
//           product.occasions?.some((occasion) => filters.occasions.includes(occasion)),
//         )
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

//       // Apply sorting
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
//     [sortBy],
//   )

//   const renderProduct = ({ item }: { item: Product }) => (
//     <TouchableOpacity style={styles.productItem} onPress={() => handleProductPress(item.id)}>
//       <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="cover" />
//       <Text style={styles.productName} numberOfLines={2}>
//         {item.name}
//       </Text>
//       <View style={styles.ratingContainer}>
//         {[...Array(5)].map((_, i) => (
//           <Star
//             key={i}
//             size={16}
//             color={i < (item.rating ?? 0) ? "#FFD700" : "#E0E0E0"}
//             fill={i < (item.rating ?? 0) ? "#FFD700" : "#E0E0E0"}
//           />
//         ))}
//       </View>
//       <View style={styles.priceContainer}>
//         {item.originalPrice && <Text style={styles.originalPrice}>${item.originalPrice}</Text>}
//         <Text style={styles.price}>${item.price}</Text>
//       </View>
//     </TouchableOpacity>
//   )

//   return (
//     <View style={styles.container}>
//       <View style={styles.header}>
//         <Text style={styles.title}>New Arrivals</Text>
//         {/* <Sheet>
//           <Text>Sheet Content</Text>
//         </Sheet> */}
//         <Button variant="outline" className="gap-2" onPress={() => setIsFilterOpen(true)}>
//           <Filter className="h-4 w-4" />
//           Filter
//         </Button>
//         {isFilterOpen && (
//           <View style={styles.filterContainer}>
//             <FilterSidebar onFilterChange={handleFilterChange} productCounts={productCounts} />
//             <Button variant="outline" onPress={() => setIsFilterOpen(false)}>
//               Close
//             </Button>
//           </View>
//         )}
//       </View>

//       {isLoading ? (
//         <View style={styles.loadingContainer}>
//           <Text>Loading...</Text>
//         </View>
//       ) : (
//         <FlatList
//           data={filteredProducts}
//           renderItem={renderProduct}
//           keyExtractor={(item) => item.id.toString()}
//           numColumns={2}
//           contentContainerStyle={styles.productList}
//           ListEmptyComponent={
//             <View style={styles.emptyContainer}>
//               <Text>No products found</Text>
//             </View>
//           }
//         />
//       )}
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
//   ratingContainer: {
//     flexDirection: "row",
//     marginBottom: 5,
//   },
//   priceContainer: {
//     flexDirection: "row",
//     alignItems: "center",
//   },
//   originalPrice: {
//     textDecorationLine: "line-through",
//     color: "#999",
//     marginRight: 5,
//   },
//   price: {
//     fontSize: 16,
//     fontWeight: "bold",
//     marginRight: 5,
//   },
//   loadingContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//   },
//   filterContainer: {
//     flex: 1,
//     padding: 20,
//     backgroundColor: "white",
//   },
//   emptyContainer: {
//     flex: 1,
//     justifyContent: "center",
//     alignItems: "center",
//     padding: 20,
//   },
// })

// export default ProductPage

//3

"use client"

import React, { useState, useCallback } from "react"
import { View, Text, FlatList, Image, TouchableOpacity, StyleSheet, Dimensions, Modal, Button } from "react-native"
import { useRouter } from "expo-router"
import { Star, Filter } from "lucide-react-native"
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

  // Calculate product counts
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
      router.push({ pathname: "/product-detail", params: { id: productId } })
    },
    [router]
  )

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
      setIsFilterOpen(false) // Close modal after filtering
    },
    [sortBy]
  )

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>New Arrivals</Text>
        <Button title="Filter" onPress={() => setIsFilterOpen(true)} />
      </View>

      <FlatList
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