

import React, { useState, useCallback, useRef } from "react"
import {
  View,
  Text,
  Image,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  StatusBar,
  SafeAreaView,
  ActivityIndicator,
  RefreshControl,
  Animated,
} from "react-native"
import { useRouter } from "expo-router"
import Icon from "react-native-vector-icons/MaterialIcons"
import { useColorScheme } from "~/lib/useColorScheme"
import FilterSidebar from "./FilterSidebar"
import type { FilterState } from "./FilterSidebar"
import products from "./data/products"
import type { Product } from "./data/type/product"

const { width } = Dimensions.get("window")

const BANNER_HEIGHT = 120
const BUTTON_ROW_HEIGHT = 50

const ProductPage: React.FC = () => {
  const router = useRouter()
  const [sortBy, setSortBy] = useState("trending")
  const [filteredProducts, setFilteredProducts] = useState<Product[]>(products)
  const [isLoading, setIsLoading] = useState(false)
  const [isRefreshing, setIsRefreshing] = useState(false)
  const [isFilterOpen, setIsFilterOpen] = useState(false)
  const scrollY = useRef(new Animated.Value(0)).current

  const { isDarkColorScheme } = useColorScheme()

  const productCounts = React.useMemo(() => {
    const counts = {
      giftFor: {} as Record<string, number>,
      productType: {} as Record<string, number>,
      occasions: {} as Record<string, number>,
      colors: {} as Record<string, number>,
      price: {
        under25: 0,
        above25: 0,
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
      if (product.price <= 25) {
        counts.price.under25++
      } else {
        counts.price.above25++
      }
    })

    return counts
  }, [])

  const handleProductPress = useCallback(
    (productId: number) => {
      router.push(`/product-scr/${productId}`)
    },
    [router],
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
        filtered = filtered.filter((product) =>
          product.occasions?.some((occasion) => filters.occasions.includes(occasion)),
        )
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
    [sortBy],
  )

  const handleRefresh = useCallback(async () => {
    setIsRefreshing(true)
    // Giả lập một yêu cầu mạng
    await new Promise((resolve) => setTimeout(resolve, 1000))
    setFilteredProducts([...products])
    setIsRefreshing(false)
  }, [])

  const renderProductItem = ({ item }: { item: Product }) => (
    <TouchableOpacity style={styles.productItem} onPress={() => handleProductPress(item.id)}>
      <Image source={{ uri: item.image }} style={styles.productImage} resizeMode="cover" />
      <Text style={styles.productName} numberOfLines={2}>
        {item.name}
      </Text>
      <Text style={styles.productPrice}>${item.price.toFixed(2)}</Text>
    </TouchableOpacity>
  )

  const renderHeader = () => (
    <>
      <View style={[styles.banner, isDarkColorScheme && styles.darkBanner]}>
        <Text style={[styles.bannerTitle, isDarkColorScheme && styles.darkText]}>New Arrival</Text>
        <View style={styles.bannerSubtitle}>
          <Text style={styles.bannerEmoji}>🔥</Text>
          <Text style={[styles.bannerText, isDarkColorScheme && styles.darkText]}>
            Valentine Sale From Feb 1st - Feb 14th Only
          </Text>
        </View>
      </View>

      <View style={[styles.buttonRow, isDarkColorScheme && styles.darkButtonRow]}>
        <TouchableOpacity onPress={() => router.back()} style={styles.iconButton}>
          <Icon name="arrow-back" size={24} color={isDarkColorScheme ? "#fff" : "#000"} />
        </TouchableOpacity>
        <Text style={[styles.title, isDarkColorScheme && styles.darkText]}>New Arrivals</Text>
        <TouchableOpacity onPress={() => setIsFilterOpen(true)} style={styles.iconButton}>
          <Icon name="filter-list" size={24} color={isDarkColorScheme ? "#fff" : "#000"} />
        </TouchableOpacity>
      </View>
    </>
  )

  return (
    <SafeAreaView style={[styles.safeArea, isDarkColorScheme && styles.darkBackground]}>
      <StatusBar barStyle={isDarkColorScheme ? "light-content" : "dark-content"} />
      <View style={styles.container}>
        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={isDarkColorScheme ? "#fff" : "#000"} />
          </View>
        ) : (
          <Animated.FlatList
            data={filteredProducts}
            renderItem={renderProductItem}
            keyExtractor={(item) => item.id.toString()}
            numColumns={2}
            contentContainerStyle={styles.productList}
            refreshControl={<RefreshControl refreshing={isRefreshing} onRefresh={handleRefresh} />}
            ListHeaderComponent={renderHeader}
            ListEmptyComponent={
              <Text style={[styles.emptyText, isDarkColorScheme && styles.darkText]}>No products found</Text>
            }
            onScroll={Animated.event([{ nativeEvent: { contentOffset: { y: scrollY } } }], { useNativeDriver: true })}
            scrollEventThrottle={16}
          />
        )}

        {isFilterOpen && (
          <View style={[styles.modalContainer, isDarkColorScheme && styles.darkModalContainer]}>
            <TouchableOpacity style={styles.closeButton} onPress={() => setIsFilterOpen(false)}>
              <Icon name="close" size={24} color={isDarkColorScheme ? "#fff" : "#333"} />
            </TouchableOpacity>
            <FilterSidebar onFilterChange={handleFilterChange} productCounts={productCounts} />
          </View>
        )}
      </View>
    </SafeAreaView>
  )
}

const styles = StyleSheet.create({
  safeArea: {
    flex: 1,
    backgroundColor: "#fff",
  },
  darkBackground: {
    backgroundColor: "#121212",
  },
  container: {
    flex: 1,
  },
  banner: {
    height: BANNER_HEIGHT,
    backgroundColor: "#F9FAFB",
    justifyContent: "center",
    alignItems: "center",
    paddingHorizontal: 20,
  },
  darkBanner: {
    backgroundColor: "#1E1E1E",
  },
  bannerTitle: {
    fontFamily: "serif",
    fontSize: 32,
    marginBottom: 8,
    color: "#111827",
  },
  bannerSubtitle: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
  },
  bannerEmoji: {
    fontSize: 20,
    marginRight: 8,
  },
  bannerText: {
    color: "#DC2626",
    fontSize: 16,
  },
  buttonRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    paddingHorizontal: 10,
    height: BUTTON_ROW_HEIGHT,
    backgroundColor: "white",
  },
  darkButtonRow: {
    backgroundColor: "#1E1E1E",
  },
  iconButton: {
    padding: 10,
  },
  title: {
    fontSize: 20,
    fontWeight: "bold",
  },
  productList: {
    paddingHorizontal: 10,
  },
  productItem: {
    width: (width - 30) / 2,
    marginBottom: 20,
    marginHorizontal: 5,
    borderWidth: 1,
    borderColor: "#e0e0e0",
    borderRadius: 8,
    padding: 10,
    backgroundColor: "#fff",
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
  productPrice: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#e53e3e",
  },
  modalContainer: {
    ...StyleSheet.absoluteFillObject,
    backgroundColor: "white",
    zIndex: 2,
  },
  darkModalContainer: {
    backgroundColor: "#121212",
  },
  closeButton: {
    position: "absolute",
    top: 10,
    right: 10,
    padding: 10,
    zIndex: 10,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
  },
  emptyText: {
    textAlign: "center",
    marginTop: 20,
    fontSize: 16,
  },
  darkText: {
    color: "#fff",
  },
})

export default ProductPage

