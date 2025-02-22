"use client"

import { useState, memo, useCallback, useEffect } from "react"
import { useRouter } from "expo-router"
import AuthModal from "./home/AuthModal"
import { View, Text, TouchableOpacity, Image, ScrollView, Platform } from "react-native"
import { User, ShoppingCart, ChevronDown, TrendingUp, Sparkles } from "lucide-react-native"
import Icon from "react-native-vector-icons/AntDesign"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { ThemeToggle } from "~/components/ThemeToggle"
import { useColorScheme } from "~/lib/useColorScheme"
import { useCart } from "~/app/cart/Contexts/cart-context"
import products from "~/app/product-scr/data/products"
import SearchResults from "./SearchResults"

const Header = memo(() => {
  const router = useRouter()
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null)
  const [isSearchVisible, setIsSearchVisible] = useState(false)
  const [searchQuery, setSearchQuery] = useState("")
  const [searchResults, setSearchResults] = useState([])
  const [defaultSuggestions, setDefaultSuggestions] = useState([])
  const { isDarkColorScheme } = useColorScheme()
  const { state } = useCart()

  const textColor = isDarkColorScheme ? "#fff" : "#000"
  const backgroundColor = isDarkColorScheme ? "#1a1a1a" : "#fff"
  const borderColor = isDarkColorScheme ? "#333" : "#ccc"

  useEffect(() => {
    setDefaultSuggestions(
      products.slice(0, 5).map((product, index) => ({
        ...product,
        icon: index < 3 ? TrendingUp : Sparkles,
      })),
    )
  }, [])

  const handleNavigation = (path: string) => {
    router.push(path)
    setIsMobileMenuOpen(false)
    setOpenMobileDropdown(null)
  }

  const toggleMobileDropdown = (menu: string) => {
    setOpenMobileDropdown(openMobileDropdown === menu ? null : menu)
  }

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible)
    if (!isSearchVisible) {
      setSearchQuery("")
      setSearchResults(defaultSuggestions)
    }
  }

  const handleSearch = useCallback(
    (text) => {
      setSearchQuery(text)
      if (text.length > 0) {
        const filteredProducts = products.filter(
          (product) =>
            product.name.toLowerCase().includes(text.toLowerCase()) ||
            (product.productType && product.productType.toLowerCase().includes(text.toLowerCase())) ||
            (product.occasions &&
              product.occasions.some((occasion) => occasion.toLowerCase().includes(text.toLowerCase()))) ||
            (product.giftFor && product.giftFor.some((gift) => gift.toLowerCase().includes(text.toLowerCase()))),
        )
        setSearchResults(filteredProducts)
      } else {
        setSearchResults(defaultSuggestions)
      }
    },
    [defaultSuggestions],
  )

  const handleSelectProduct = useCallback(
    (productId) => {
      router.push(`/product-scr/${productId}`)
      setIsSearchVisible(false)
      setSearchQuery("")
      setSearchResults([])
    },
    [router],
  )

  const navigateToHome = () => handleNavigation("/")
  const navigateToProductPage = () => handleNavigation("/productPage")
  const navigateToBestSeller = () => handleNavigation("/best-seller")
  const navigateToCart = () => handleNavigation("/cart")

  return (
    <>
      <View style={{ backgroundColor }}>
        <View className="px-4 py-4">
          {isSearchVisible ? (
            <View className="flex-row items-center space-x-4 px-4 py-2">
              <TouchableOpacity onPress={toggleSearch}>
                <Icon name="close" size={24} color={textColor} />
              </TouchableOpacity>
              <Input
                placeholder="Search"
                className="flex-1 pl-4 pr-4 py-2 rounded-full border"
                style={{ borderColor, color: textColor, backgroundColor }}
                placeholderTextColor={isDarkColorScheme ? "#888" : "#888"}
                autoFocus={true}
                value={searchQuery}
                onChangeText={handleSearch}
              />
              <View className="absolute top-full left-0 right-0 z-50" style={{ maxHeight: 300 }}>
                <SearchResults
                  results={searchQuery.length > 0 ? searchResults : defaultSuggestions}
                  onSelectProduct={handleSelectProduct}
                  isDefaultSuggestion={searchQuery.length === 0}
                  isDarkColorScheme={isDarkColorScheme}
                />
              </View>
            </View>
          ) : (
            <View className="flex-row items-center justify-between px-4 py-2">
              <View className="flex-row items-center space-x-4 z-10">
                <TouchableOpacity onPress={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                  <Icon name={isMobileMenuOpen ? "close" : "menu-fold"} size={24} color={textColor} />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleSearch}>
                  <Icon name="search1" size={24} color={textColor} />
                </TouchableOpacity>
              </View>

              <TouchableOpacity onPress={navigateToHome} className="absolute left-0 right-0 items-center">
                {Platform.OS === "web" ? (
                  <Image
                    source={{
                      uri: isDarkColorScheme
                        ? "https://famvibe.com/cdn/shop/t/358/assets/LOGO-allwhite-Rebranding.svg"
                        : "https://cdn.shopify.com/s/files/1/0402/7852/4065/files/logonentrang2.svg?v=1690601667",
                    }}
                    style={{ width: 96, height: 32 }}
                    resizeMode="contain"
                  />
                ) : (
                  <Text style={{ fontSize: 20, fontWeight: "bold", color: textColor }}>FamVibe</Text>
                )}
              </TouchableOpacity>

              <View className="flex-row items-center space-x-4 z-10">
                <ThemeToggle />
                <TouchableOpacity onPress={() => setIsAuthModalOpen(true)}>
                  <User size={24} color={textColor} />
                </TouchableOpacity>

                <TouchableOpacity onPress={navigateToCart}>
                  <View className="relative">
                    <ShoppingCart size={24} color={textColor} />
                    {state.totalItems > 0 && (
                      <View className="absolute -top-4 -right-4 bg-red-500 rounded-full h-6 w-6 items-center justify-center">
                        <Text className="text-primary-foreground text-sm" style={{ color: "#fff" }}>
                          {state.totalItems.toString()}
                        </Text>
                      </View>
                    )}
                  </View>
                </TouchableOpacity>
              </View>
            </View>
          )}
        </View>

        {isMobileMenuOpen && (
          <ScrollView
            className="border-t"
            style={{ maxHeight: 400, borderColor }}
            showsVerticalScrollIndicator={true}
            persistentScrollbar={true}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <View className="py-4">
              <TouchableOpacity className="py-2 px-4" onPress={navigateToProductPage}>
                <Text style={{ color: textColor }}>New Arrival</Text>
              </TouchableOpacity>
              <TouchableOpacity className="py-2 px-4" onPress={navigateToBestSeller}>
                <Text style={{ color: textColor }}>Best Seller</Text>
              </TouchableOpacity>

              <View>
                <TouchableOpacity
                  className="flex-row justify-between items-center py-2 px-4"
                  onPress={() => toggleMobileDropdown("occasion")}
                >
                  <Text style={{ color: textColor }}>Occasion</Text>
                  <ChevronDown
                    size={20}
                    color={textColor}
                    style={{
                      transform: [{ rotate: openMobileDropdown === "occasion" ? "180deg" : "0deg" }],
                    }}
                  />
                </TouchableOpacity>
                {openMobileDropdown === "occasion" && (
                  <View style={{ backgroundColor }}>
                    <Text className="font-bold text-sm mb-2" style={{ color: textColor }}>
                      Upcoming Occasions
                    </Text>
                    <View className="flex-row items-center space-x-2 mb-4">
                      <View className="bg-red-100 rounded px-2 py-1">
                        <Text className="text-xs text-red-600">Feb</Text>
                        <Text className="font-bold text-red-600">14</Text>
                      </View>
                      <Text className="text-red-600" style={{ color: textColor }}>
                        Valentine
                      </Text>
                    </View>
                    <Text className="font-bold text-sm mb-2" style={{ color: textColor }}>
                      Everyday Occasions
                    </Text>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/occasion/anniversary")}>
                      <Text style={{ color: textColor }} className="text-sm">
                        Anniversary
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/occasion/baby-gifts")}>
                      <Text style={{ color: textColor }} className="text-sm">
                        Baby Gifts
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/occasion/memorial")}>
                      <Text style={{ color: textColor }} className="text-sm">
                        Memorial
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/occasion/pet-memorial")}>
                      <Text style={{ color: textColor }} className="text-sm">
                        Pet Memorial
                      </Text>
                    </TouchableOpacity>
                    <Text className="font-bold text-sm mt-4 mb-2" style={{ color: textColor }}>
                      Seasonal Occasions
                    </Text>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/occasion/halloween")}>
                      <Text style={{ color: textColor }} className="text-sm">
                        Halloween
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/occasion/fall-gifts")}>
                      <Text style={{ color: textColor }} className="text-sm">
                        Fall Gifts
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/occasion/christmas-gifts")}>
                      <Text style={{ color: textColor }} className="text-sm">
                        Christmas Gifts
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/occasion/mothers-day")}>
                      <Text style={{ color: textColor }} className="text-sm">
                        Mother's Day
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/occasion/fathers-day")}>
                      <Text style={{ color: textColor }} className="text-sm">
                        Father's Day
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/occasion/graduation")}>
                      <Text style={{ color: textColor }} className="text-sm">
                        Graduation
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View>
                <TouchableOpacity
                  className="flex-row justify-between items-center py-2 px-4"
                  onPress={() => toggleMobileDropdown("recipients")}
                >
                  <Text style={{ color: textColor }}>Recipients</Text>
                  <ChevronDown
                    size={20}
                    color={textColor}
                    style={{
                      transform: [{ rotate: openMobileDropdown === "recipients" ? "180deg" : "0deg" }],
                    }}
                  />
                </TouchableOpacity>
                {openMobileDropdown === "recipients" && (
                  <View style={{ backgroundColor }}>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/recipients/for-her")}>
                      <Text style={{ color: textColor }} className="text-sm">
                        For Her
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/recipients/for-him")}>
                      <Text style={{ color: textColor }} className="text-sm">
                        For Him
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/recipients/for-kids")}>
                      <Text style={{ color: textColor }} className="text-sm">
                        For Kids
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/recipients/for-pets")}>
                      <Text style={{ color: textColor }} className="text-sm">
                        For Pets
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View>
                <TouchableOpacity
                  className="flex-row justify-between items-center py-2 px-4"
                  onPress={() => toggleMobileDropdown("products")}
                >
                  <Text style={{ color: textColor }}>Products</Text>
                  <ChevronDown
                    size={20}
                    color={textColor}
                    style={{
                      transform: [{ rotate: openMobileDropdown === "products" ? "180deg" : "0deg" }],
                    }}
                  />
                </TouchableOpacity>
                {openMobileDropdown === "products" && (
                  <View style={{ backgroundColor }}>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/products/canvas-prints")}>
                      <Text style={{ color: textColor }} className="text-sm">
                        Canvas Prints
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/products/photo-frames")}>
                      <Text style={{ color: textColor }} className="text-sm">
                        Photo Frames
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/products/mugs")}>
                      <Text style={{ color: textColor }} className="text-sm">
                        Mugs
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/products/jewelry")}>
                      <Text style={{ color: textColor }} className="text-sm">
                        Jewelry
                      </Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <TouchableOpacity className="bg-red-400 py-2 px-4" onPress={() => handleNavigation("/valentine")}>
                <Text style={{ color: "#fff" }}>❄️ Valentine</Text>
              </TouchableOpacity>

              <View className="mt-4 px-4">
                <Button
                  variant="outline"
                  className="flex-row items-center justify-center space-x-2 border"
                  style={{ borderColor }}
                  onPress={() => handleNavigation("/tracking")}
                >
                  <Icon name="search1" size={20} color={textColor} />
                  <Text style={{ color: textColor }}>Tracking Order</Text>
                </Button>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
      {isAuthModalOpen && <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />}
    </>
  )
})

export default Header

