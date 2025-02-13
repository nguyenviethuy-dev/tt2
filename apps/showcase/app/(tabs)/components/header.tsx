

import { useState } from "react"
import { useRouter } from "expo-router";
import { GestureResponderEvent } from "react-native"
import { AuthModal } from "./home/AuthModal"
import { View, Text, TouchableOpacity, Image, ScrollView, Platform } from "react-native"
import { Search, User, ShoppingCart, ChevronDown, Menu, X } from "lucide-react-native"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { ThemeToggle } from "~/components/ThemeToggle"
import { useColorScheme } from "~/lib/useColorScheme"

export default function Header() {
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null)
  const { isDarkColorScheme } = useColorScheme()

  const toggleMobileDropdown = (menu: string) => {
    setOpenMobileDropdown(openMobileDropdown === menu ? null : menu)
  }

  function navigateToHome(): void {
    router.push("/");  // Điều hướng trong expo-router
  }

  function navigateToProductPage(): void {
    router.push("/productPage");
  }

  return (
    <>
    <View className={`${isDarkColorScheme ? "bg-background" : "bg-background"}`}>
      <View className="px-4 py-4">
        {/* Top Bar */}
        <View className="flex-row items-center justify-between px-4 py-2">
          <TouchableOpacity onPress={() => setIsMobileMenuOpen(!isMobileMenuOpen)} className="z-10">
            {isMobileMenuOpen ? (
              <X size={24} color={isDarkColorScheme ? "#fff" : "#000"} />
            ) : (
              <Menu size={24} color={isDarkColorScheme ? "#fff" : "#000"} />
            )}
          </TouchableOpacity>

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
            <TouchableOpacity>
              <View className="relative">
                <ShoppingCart size={24} color={isDarkColorScheme ? "#fff" : "#000"} />
                <View className="absolute -top-2 -right-2 bg-primary rounded-full h-4 w-4 items-center justify-center">
                  <Text className="text-primary-foreground text-xs">0</Text>
                </View>
              </View>
            </TouchableOpacity>
          </View>
        </View>

        {/* Search Bar */}
        <View className="relative mt-4">
          <View className="absolute left-4 top-3 z-10">
            <Search size={20} className="text-muted-foreground" />
          </View>
          <Input
            placeholder="Search"
            className="pl-12 pr-4 py-2.5 rounded-full border border-input bg-background text-foreground"
            placeholderTextColor={isDarkColorScheme ? "text-muted-foreground" : "text-muted-foreground"}
          />
        </View>
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
            <TouchableOpacity className="py-2 px-4">
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
                    <TouchableOpacity className="py-1">
                      <Text className="text-sm">Anniversary</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1">
                      <Text className="text-sm">Baby Gifts</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1">
                      <Text className="text-sm">Memorial</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1">
                      <Text className="text-sm">Pet Memorial</Text>
                    </TouchableOpacity>
                    <Text className="font-bold text-sm mt-4 mb-2">Seasonal Occasions</Text>
                    <TouchableOpacity className="py-1">
                      <Text className="text-sm">Halloween</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1">
                      <Text className="text-sm">Fall Gifts</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1">
                      <Text className="text-sm">Christmas Gifts</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1">
                      <Text className="text-sm">Mother's Day</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1">
                      <Text className="text-sm">Father's Day</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1">
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
                    <TouchableOpacity className="py-1">
                      <Text className="text-sm" >For Her</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1">
                      <Text className="text-sm">For Him</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1">
                      <Text className="text-sm">For Kids</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1">
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
                    <TouchableOpacity className="py-1">
                      <Text className="text-sm">Canvas Prints</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1">
                      <Text className="text-sm">Photo Frames</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1">
                      <Text className="text-sm">Mugs</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1">
                      <Text className="text-sm">Jewelry</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>
  
              <TouchableOpacity className="bg-red-400 py-2 px-4">
                <Text className="text-primary text-base">❄️ Valentine</Text>
              </TouchableOpacity>
  
              <View className="mt-4 px-4">
                <Button
                  variant="outline"
                  className="flex-row items-center justify-center space-x-2 border border-input"
                  onPress={() => console.log("Navigate to tracking")}
                >
                  <Search size={20} className="text-foreground" />
                  <Text className="text-foreground text-base">Tracking Order</Text>
                </Button>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
      <AuthModal isOpen={isAuthModalOpen} onClose={() => setIsAuthModalOpen(false)} />
      
  </>
  )
}

