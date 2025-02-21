

import { useState, memo, useCallback } from "react"
import { useRouter } from "expo-router"
import AuthModal from "./home/AuthModal"
import { View, Text, TouchableOpacity, Image, ScrollView, Platform } from "react-native"
import { User, ShoppingCart, ChevronDown } from "lucide-react-native"
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
  const { isDarkColorScheme } = useColorScheme()
  const { state } = useCart()

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
  }

  const handleSearch = useCallback((text) => {
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
      setSearchResults([])
    }
  }, [])

  const handleSelectProduct = useCallback(
    (productId) => {
      router.push(`/product-scr/${productId}`)
      setIsSearchVisible(false)
      setSearchQuery("")
      setSearchResults([])
    },
    [router],
  )

  // Các hàm điều hướng khác
  const navigateToHome = () => handleNavigation("/")
  const navigateToProductPage = () => handleNavigation("/productPage")
  const navigateToBestSeller = () => handleNavigation("/best-seller")
  const navigateToCart = () => handleNavigation("/cart")

  return (
    <>
      <View className={`${isDarkColorScheme ? "bg-background" : "bg-background"}`}>
        <View className="px-4 py-4">
          {/* Search Bar when visible */}
          {isSearchVisible ? (
            <View className="flex-row items-center space-x-4 px-4 py-2">
              <TouchableOpacity onPress={toggleSearch}>
                <Icon name="close" size={24} color={isDarkColorScheme ? "#fff" : "#000"} />
              </TouchableOpacity>
              <Input
                placeholder="Search"
                className="flex-1 pl-4 pr-4 py-2 rounded-full border border-input bg-background text-foreground"
                placeholderTextColor={isDarkColorScheme ? "#888" : "#888"}
                autoFocus={true}
                value={searchQuery}
                onChangeText={handleSearch}
              />
              <View className="absolute top-full left-0 right-0 z-50">
                <SearchResults results={searchResults} onSelectProduct={handleSelectProduct} />
              </View>
            </View>
          ) : (
            /* Top Bar */
            <View className="flex-row items-center justify-between px-4 py-2">
              <View className="flex-row items-center space-x-4 z-10">
                <TouchableOpacity onPress={() => setIsMobileMenuOpen(!isMobileMenuOpen)}>
                  <Icon
                    name={isMobileMenuOpen ? "close" : "menu-fold"}
                    size={24}
                    color={isDarkColorScheme ? "#fff" : "#000"}
                  />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleSearch}>
                  <Icon name="search1" size={24} color={isDarkColorScheme ? "#fff" : "#000"} />
                </TouchableOpacity>
              </View>

              {/* Logo - centered on mobile */}
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
                  <Text style={{ fontSize: 20, fontWeight: "bold", color: isDarkColorScheme ? "#fff" : "#000" }}>
                    FamVibe
                  </Text>
                )}
              </TouchableOpacity>

              {/* Right section - Action buttons */}
              <View className="flex-row items-center space-x-4 z-10">
                <ThemeToggle />
                <TouchableOpacity onPress={() => setIsAuthModalOpen(true)}>
                  <User size={24} color={isDarkColorScheme ? "#fff" : "#000"} />
                </TouchableOpacity>

                <TouchableOpacity onPress={navigateToCart}>
                  <View className="relative">
                    <ShoppingCart size={24} color={isDarkColorScheme ? "#fff" : "#000"} />
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

        {/* Navigation */}
        {isMobileMenuOpen && (
          <ScrollView
            className="border-t border-border"
            style={{ maxHeight: 400 }}
            showsVerticalScrollIndicator={true}
            persistentScrollbar={true}
            contentContainerStyle={{ paddingBottom: 20 }}
          >
            <View className="py-4">
              <TouchableOpacity className="py-2 px-4" onPress={navigateToProductPage}>
                <Text className="text-foreground text-base">New Arrival</Text>
              </TouchableOpacity>
              <TouchableOpacity className="py-2 px-4" onPress={navigateToBestSeller}>
                <Text className="text-foreground text-base">Best Seller</Text>
              </TouchableOpacity>

              {/* Occasion Dropdown */}
              <View>
                <TouchableOpacity
                  className="flex-row justify-between items-center py-2 px-4"
                  onPress={() => toggleMobileDropdown("occasion")}
                >
                  <Text className="text-foreground text-base">Occasion</Text>
                  <ChevronDown
                    size={20}
                    color={isDarkColorScheme ? "#fff" : "#000"}
                    style={{
                      transform: [{ rotate: openMobileDropdown === "occasion" ? "180deg" : "0deg" }],
                    }}
                  />
                </TouchableOpacity>
                {openMobileDropdown === "occasion" && (
                  <View className="bg-white p-4">
                    {/* Dropdown content */}
                    <Text className="font-bold text-sm mb-2">Upcoming Occasions</Text>
                    <View className="flex-row items-center space-x-2 mb-4">
                      <View className="bg-red-100 rounded px-2 py-1">
                        <Text className="text-xs text-red-600">Feb</Text>
                        <Text className="font-bold text-red-600">14</Text>
                      </View>
                      <Text className="text-red-600">Valentine</Text>
                    </View>
                    <Text className="font-bold text-sm mb-2">Everyday Occasions</Text>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/occasion/anniversary")}>
                      <Text className="text-sm">Anniversary</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/occasion/baby-gifts")}>
                      <Text className="text-sm">Baby Gifts</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/occasion/memorial")}>
                      <Text className="text-sm">Memorial</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/occasion/pet-memorial")}>
                      <Text className="text-sm">Pet Memorial</Text>
                    </TouchableOpacity>
                    <Text className="font-bold text-sm mt-4 mb-2">Seasonal Occasions</Text>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/occasion/halloween")}>
                      <Text className="text-sm">Halloween</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/occasion/fall-gifts")}>
                      <Text className="text-sm">Fall Gifts</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/occasion/christmas-gifts")}>
                      <Text className="text-sm">Christmas Gifts</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/occasion/mothers-day")}>
                      <Text className="text-sm">Mother's Day</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/occasion/fathers-day")}>
                      <Text className="text-sm">Father's Day</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/occasion/graduation")}>
                      <Text className="text-sm">Graduation</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Recipients Dropdown */}
              <View>
                <TouchableOpacity
                  className="flex-row justify-between items-center py-2 px-4"
                  onPress={() => toggleMobileDropdown("recipients")}
                >
                  <Text className="text-foreground text-base">Recipients</Text>
                  <ChevronDown
                    size={20}
                    color={isDarkColorScheme ? "#fff" : "#000"}
                    style={{
                      transform: [{ rotate: openMobileDropdown === "recipients" ? "180deg" : "0deg" }],
                    }}
                  />
                </TouchableOpacity>
                {openMobileDropdown === "recipients" && (
                  <View className="bg-white p-4">
                    {/* Dropdown content */}
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/recipients/for-her")}>
                      <Text className="text-sm">For Her</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/recipients/for-him")}>
                      <Text className="text-sm">For Him</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/recipients/for-kids")}>
                      <Text className="text-sm">For Kids</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/recipients/for-pets")}>
                      <Text className="text-sm">For Pets</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              {/* Products Dropdown */}
              <View>
                <TouchableOpacity
                  className="flex-row justify-between items-center py-2 px-4"
                  onPress={() => toggleMobileDropdown("products")}
                >
                  <Text className="text-foreground text-base">Products</Text>
                  <ChevronDown
                    size={20}
                    color={isDarkColorScheme ? "#fff" : "#000"}
                    style={{
                      transform: [{ rotate: openMobileDropdown === "products" ? "180deg" : "0deg" }],
                    }}
                  />
                </TouchableOpacity>
                {openMobileDropdown === "products" && (
                  <View className="bg-white p-4">
                    {/* Dropdown content */}
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/products/canvas-prints")}>
                      <Text className="text-sm">Canvas Prints</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/products/photo-frames")}>
                      <Text className="text-sm">Photo Frames</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/products/mugs")}>
                      <Text className="text-sm">Mugs</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/products/jewelry")}>
                      <Text className="text-sm">Jewelry</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <TouchableOpacity className="bg-red-400 py-2 px-4" onPress={() => handleNavigation("/valentine")}>
                <Text className="text-primary text-base">❄️ Valentine</Text>
              </TouchableOpacity>

              <View className="mt-4 px-4">
                <Button
                  variant="outline"
                  className="flex-row items-center justify-center space-x-2 border border-input"
                  onPress={() => handleNavigation("/tracking")}
                >
                  <Icon name="search1" size={20} className="text-foreground" />
                  <Text className="text-foreground text-base">Tracking Order</Text>
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

