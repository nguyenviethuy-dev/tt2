

import { useState, memo, useCallback, useEffect } from "react";
import { useRouter } from "expo-router";
import AuthModal from "../../home/AuthModal";
import { View, Text, TouchableOpacity, Image, ScrollView, Platform, Alert } from "react-native";
import { User, ShoppingCart, ChevronDown, TrendingUp, Sparkles, Settings, LogOut } from "lucide-react-native";
import Icon from "react-native-vector-icons/AntDesign";
import { Input } from "~/components/ui/input";
import { Button } from "~/components/ui/button";
import { ThemeToggle } from "~/components/ThemeToggle"; // Vẫn import nhưng không dùng
import { useColorScheme } from "~/lib/useColorScheme";
import { useCart } from "~/app/cart/Contexts/cart-context";
import products from "~/app/product-scr/data/products";
import SearchResults from "./SearchResults";
import { auth } from "~/app/services/firebaseConfig1";
import { type User as FirebaseUser, signOut } from "firebase/auth";

const Header = memo(() => {
  const router = useRouter();
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [openMobileDropdown, setOpenMobileDropdown] = useState<string | null>(null);
  const [isSearchVisible, setIsSearchVisible] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [searchResults, setSearchResults] = useState([]);
  const [defaultSuggestions, setDefaultSuggestions] = useState([]);
  const { isDarkColorScheme } = useColorScheme();
  const { state } = useCart();
  const [user, setUser] = useState<FirebaseUser | null>(null);
  const [isUserMenuOpen, setIsUserMenuOpen] = useState(false);
  const [isToggleOn, setIsToggleOn] = useState(false);

  const textColor = isDarkColorScheme ? "text-white" : "text-black";
  const backgroundColor = isDarkColorScheme ? "#1a1a1a" : "#fff";
  const borderColor = isDarkColorScheme ? "#333" : "#ccc";
  const iconColor = isDarkColorScheme ? "#ffffff" : "#000000";

  // Theo dõi trạng thái xác thực
  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((currentUser) => {
      setUser(currentUser);
      if (!currentUser) {
        setIsUserMenuOpen(false); // Đóng menu khi không có user
      }
    });
    return () => unsubscribe();
  }, []);

  useEffect(() => {
    setDefaultSuggestions(
      products.slice(0, 5).map((product, index) => ({
        ...product,
        icon: index < 3 ? TrendingUp : Sparkles,
      })),
    );
  }, []);

  const handleAuthStateChange = useCallback((currentUser: FirebaseUser | null) => {
    setUser(currentUser);
  }, []);

  const handleLogout = useCallback(async () => {
    try {
      console.log("Starting logout...");
      await signOut(auth);
      console.log("Logout successful");
      setUser(null);
      setIsUserMenuOpen(false);
      Alert.alert("Success", "You have been logged out successfully");
    } catch (error) {
      console.error("Logout error: ", error);
      if (error.code === "permission-denied") {
        Alert.alert("Error", "Permission denied. Please check your Firebase configuration.");
      } else {
        Alert.alert("Error", "Failed to log out: " + error.message);
      }
    }
  }, []);

  const handleNavigation = (path: string) => {
    router.push(path);
    setIsMobileMenuOpen(false);
    setOpenMobileDropdown(null);
  };

  const toggleMobileDropdown = (menu: string) => {
    setOpenMobileDropdown(openMobileDropdown === menu ? null : menu);
  };

  const toggleSearch = () => {
    setIsSearchVisible(!isSearchVisible);
    if (!isSearchVisible) {
      setSearchQuery("");
      setSearchResults(defaultSuggestions);
    }
  };

  const handleSearch = useCallback(
    (text) => {
      setSearchQuery(text);
      if (text.length > 0) {
        const filteredProducts = products.filter(
          (product) =>
            product.name.toLowerCase().includes(text.toLowerCase()) ||
            (product.productType && product.productType.toLowerCase().includes(text.toLowerCase())) ||
            (product.occasions &&
              product.occasions.some((occasion) => occasion.toLowerCase().includes(text.toLowerCase()))) ||
            (product.giftFor && product.giftFor.some((gift) => gift.toLowerCase().includes(text.toLowerCase()))),
        );
        setSearchResults(filteredProducts);
      } else {
        setSearchResults(defaultSuggestions);
      }
    },
    [defaultSuggestions],
  );

  const handleSelectProduct = useCallback(
    (productId) => {
      router.push(`/product-scr/${productId}`);
      setIsSearchVisible(false);
      setSearchQuery("");
      setSearchResults([]);
    },
    [router],
  );

  const navigateToHome = () => handleNavigation("/");
  const navigateToProductPage = () => handleNavigation("/productPage");
  const navigateToBestSeller = () => handleNavigation("/best-seller");
  const navigateToCart = () => handleNavigation("/cart");

  return (
    <>
      <View style={{ backgroundColor }}>
        <View className="px-4 py-4">
          {isSearchVisible ? (
            <View className="flex-row items-center space-x-4 px-4 py-2">
              <TouchableOpacity onPress={toggleSearch}>
                <Icon name="close" size={24} color={iconColor} />
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
                  <Icon name={isMobileMenuOpen ? "close" : "menu-fold"} size={24} color={iconColor} />
                </TouchableOpacity>
                <TouchableOpacity onPress={toggleSearch}>
                  <Icon name="search1" size={24} color={iconColor} />
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
                  <Text style={{ fontSize: 20, fontWeight: "bold" }} className="dark:text-white">
                    FamVibe
                  </Text>
                )}
              </TouchableOpacity>

              <View className="flex-row items-center space-x-4 z-10">
                {/* <ThemeToggle /> */}
                {user ? (
                  <View>
                    <TouchableOpacity onPress={() => setIsUserMenuOpen(!isUserMenuOpen)}>
                      <User size={24} color={iconColor} />
                    </TouchableOpacity>
                    {isUserMenuOpen && (
                      <View
                        className={`absolute right-0 mt-2 w-48 rounded-md shadow-lg ${
                          isDarkColorScheme ? "bg-gray-800" : "bg-white"
                        } ring-1 ring-black ring-opacity-5`}
                      >
                        <View className="relative">
                          <TouchableOpacity
                            className="absolute top-2 right-2 z-10"
                            onPress={() => setIsUserMenuOpen(false)}
                          >
                            <Icon name="close" size={16} color={iconColor} />
                          </TouchableOpacity>

                          <TouchableOpacity
                            className={`block px-4 py-2 text-sm ${
                              isDarkColorScheme ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"
                            }`}
                            onPress={() => {
                              handleNavigation("/settings");
                              setIsUserMenuOpen(false);
                            }}
                          >
                            <View className="flex-row items-center">
                              <Settings size={16} color={iconColor} />
                              <Text className={`ml-2 ${textColor}`}>Settings</Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                            className={`block px-4 py-2 text-sm ${
                              isDarkColorScheme ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"
                            }`}
                            onPress={() => {
                              handleNavigation("/cart/OrderList");
                              setIsUserMenuOpen(false);
                            }}
                          >
                            <View className="flex-row items-center">
                              <Icon name="profile" size={16} color={iconColor} />
                              <Text className={`ml-2 ${textColor}`}>Order List</Text>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                            className={`block px-4 py-2 text-sm ${
                              isDarkColorScheme ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"
                            }`}
                            onPress={() => {
                              setIsToggleOn(!isToggleOn);
                              setIsUserMenuOpen(false);
                            }}
                          >
                            <View className="flex-row items-center justify-between">
                              <View className="flex-row items-center">
                                <Icon name="swap" size={16} color={iconColor} />
                                <Text className={`ml-2 ${textColor}`}>Toggle Switch</Text>
                              </View>
                              <View
                                className={`w-10 h-6 ${
                                  isToggleOn ? "bg-green-500" : isDarkColorScheme ? "bg-gray-600" : "bg-gray-300"
                                } rounded-full relative`}
                              >
                                <View
                                  className={`w-5 h-5 rounded-full absolute top-0.5 ${
                                    isToggleOn
                                      ? "right-0.5 bg-white"
                                      : isDarkColorScheme
                                      ? "right-0.5 bg-white"
                                      : "left-0.5 bg-gray-100"
                                  }`}
                                />
                              </View>
                            </View>
                          </TouchableOpacity>

                          <TouchableOpacity
                            className={`block px-4 py-2 text-sm ${
                              isDarkColorScheme ? "text-gray-300 hover:bg-gray-700" : "text-gray-700 hover:bg-gray-100"
                            }`}
                            onPress={handleLogout}
                          >
                            <View className="flex-row items-center">
                              <LogOut size={16} color={iconColor} />
                              <Text className={`ml-2 ${textColor}`}>Logout</Text>
                            </View>
                          </TouchableOpacity>
                        </View>
                      </View>
                    )}
                  </View>
                ) : (
                  <TouchableOpacity
                    onPress={() => {
                      setIsUserMenuOpen(false);
                      setIsAuthModalOpen(true);
                    }}
                  >
                    <User size={24} color={iconColor} />
                  </TouchableOpacity>
                )}
                <TouchableOpacity onPress={navigateToCart}>
                  <View className="relative">
                    <ShoppingCart size={24} color={iconColor} />
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
                <Text className={`${textColor}`}>New Arrival</Text>
              </TouchableOpacity>
              <TouchableOpacity className="py-2 px-4" onPress={navigateToBestSeller}>
                <Text className={`${textColor}`}>Best Seller</Text>
              </TouchableOpacity>

              <View>
                <TouchableOpacity
                  className="flex-row justify-between items-center py-2 px-4"
                  onPress={() => toggleMobileDropdown("occasion")}
                >
                  <Text className={`${textColor}`}>Occasion</Text>
                  <ChevronDown
                    size={20}
                    color={iconColor}
                    style={{
                      transform: [{ rotate: openMobileDropdown === "occasion" ? "180deg" : "0deg" }],
                    }}
                  />
                </TouchableOpacity>
                {openMobileDropdown === "occasion" && (
                  <View style={{ backgroundColor }}>
                    <Text className={`font-bold text-sm mb-2 ${textColor}`}>Upcoming Occasions</Text>
                    <View className="flex-row items-center space-x-2 mb-4">
                      <View className="bg-red-100 rounded px-2 py-1">
                        <Text className="text-xs text-red-600">Feb</Text>
                        <Text className="font-bold text-red-600">14</Text>
                      </View>
                      <Text className={`text-red-600 ${textColor}`}>Valentine</Text>
                    </View>
                    <Text className={`font-bold text-sm mb-2 ${textColor}`}>Everyday Occasions</Text>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/occasion/anniversary")}>
                      <Text className={`${textColor} text-sm`}>Anniversary</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/occasion/baby-gifts")}>
                      <Text className={`${textColor} text-sm`}>Baby Gifts</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/occasion/memorial")}>
                      <Text className={`${textColor} text-sm`}>Memorial</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/occasion/pet-memorial")}>
                      <Text className={`${textColor} text-sm`}>Pet Memorial</Text>
                    </TouchableOpacity>
                    <Text className={`font-bold text-sm mt-4 mb-2 ${textColor}`}>Seasonal Occasions</Text>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/occasion/halloween")}>
                      <Text className={`${textColor} text-sm`}>Halloween</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/occasion/fall-gifts")}>
                      <Text className={`${textColor} text-sm`}>Fall Gifts</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/occasion/christmas-gifts")}>
                      <Text className={`${textColor} text-sm`}>Christmas Gifts</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/occasion/mothers-day")}>
                      <Text className={`${textColor} text-sm`}>Mother's Day</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/occasion/fathers-day")}>
                      <Text className={`${textColor} text-sm`}>Father's Day</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/occasion/graduation")}>
                      <Text className={`${textColor} text-sm`}>Graduation</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View>
                <TouchableOpacity
                  className="flex-row justify-between items-center py-2 px-4"
                  onPress={() => toggleMobileDropdown("recipients")}
                >
                  <Text className={`${textColor}`}>Recipients</Text>
                  <ChevronDown
                    size={20}
                    color={iconColor}
                    style={{
                      transform: [{ rotate: openMobileDropdown === "recipients" ? "180deg" : "0deg" }],
                    }}
                  />
                </TouchableOpacity>
                {openMobileDropdown === "recipients" && (
                  <View style={{ backgroundColor }}>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/recipients/for-her")}>
                      <Text className={`${textColor} text-sm`}>For Her</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/recipients/for-him")}>
                      <Text className={`${textColor} text-sm`}>For Him</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/recipients/for-kids")}>
                      <Text className={`${textColor} text-sm`}>For Kids</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/recipients/for-pets")}>
                      <Text className={`${textColor} text-sm`}>For Pets</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <View>
                <TouchableOpacity
                  className="flex-row justify-between items-center py-2 px-4"
                  onPress={() => toggleMobileDropdown("products")}
                >
                  <Text className={`${textColor}`}>Products</Text>
                  <ChevronDown
                    size={20}
                    color={iconColor}
                    style={{
                      transform: [{ rotate: openMobileDropdown === "products" ? "180deg" : "0deg" }],
                    }}
                  />
                </TouchableOpacity>
                {openMobileDropdown === "products" && (
                  <View style={{ backgroundColor }}>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/products/canvas-prints")}>
                      <Text className={`${textColor} text-sm`}>Canvas Prints</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/products/photo-frames")}>
                      <Text className={`${textColor} text-sm`}>Photo Frames</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/products/mugs")}>
                      <Text className={`${textColor} text-sm`}>Mugs</Text>
                    </TouchableOpacity>
                    <TouchableOpacity className="py-1" onPress={() => handleNavigation("/products/jewelry")}>
                      <Text className={`${textColor} text-sm`}>Jewelry</Text>
                    </TouchableOpacity>
                  </View>
                )}
              </View>

              <TouchableOpacity
                className={`py-2 px-4 ${isDarkColorScheme ? "bg-red-800" : "bg-red-400"}`}
                onPress={() => handleNavigation("/valentine")}
              >
                <Text className="text-white">❄️ Valentine</Text>
              </TouchableOpacity>

              <View className="mt-4 px-4">
                <Button
                  variant="outline"
                  className={`flex-row items-center justify-center space-x-2 border ${
                    isDarkColorScheme ? "border-gray-600" : "border-gray-300"
                  }`}
                  onPress={() => handleNavigation("/tracking")}
                >
                  <Icon name="search1" size={20} color={iconColor} />
                  <Text className={textColor}>Tracking Order</Text>
                </Button>
              </View>
            </View>
          </ScrollView>
        )}
      </View>
      {isAuthModalOpen && (
        <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "transparent" }}>
          <AuthModal
            isOpen={isAuthModalOpen}
            onClose={() => setIsAuthModalOpen(false)}
            isDarkColorScheme={isDarkColorScheme}
            onAuthStateChange={handleAuthStateChange}
          />
        </View>
      )}
    </>
  );
});

export default Header;