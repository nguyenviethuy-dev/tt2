import { useState, useEffect } from "react";
import { View, Text, ScrollView, SafeAreaView, Alert, StyleSheet } from "react-native";
import { useRouter, useLocalSearchParams } from "expo-router";
import { Button } from "~/components/ui/button";
import { Input } from "~/components/ui/input";
import { Label } from "~/components/ui/label";
import { useCart } from "./Contexts/cart-context";
import { useColorScheme } from "~/lib/useColorScheme";
import { auth } from "~/app/services/firebaseConfig1";
import AuthModal from "../home/AuthModal"; // Import AuthModal tương tự Header

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

export default function Checkout() {
  const router = useRouter();
  const { clearCart } = useCart();
  const params = useLocalSearchParams();
  const [cartItems, setCartItems] = useState<CartItem[]>([]);
  const [total, setTotal] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthenticated, setIsAuthenticated] = useState<boolean | null>(null);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false); // State cho AuthModal
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    address: "",
    city: "",
    country: "",
    zipCode: "",
  });
  const { isDarkColorScheme } = useColorScheme();

  const styles = StyleSheet.create({
    text: {
      color: isDarkColorScheme ? "#ffffff" : "#000000",
    },
    input: {
      backgroundColor: isDarkColorScheme ? "#1a1a1a" : "#ffffff",
      color: isDarkColorScheme ? "#ffffff" : "#000000",
      borderColor: isDarkColorScheme ? "#333333" : "#e5e5e5",
      borderWidth: 1,
      borderRadius: 6,
      padding: 8,
    },
    container: {
      backgroundColor: isDarkColorScheme ? "#000000" : "#ffffff",
    },
  });

  const handleInputChange = (name: string, value: string) => {
    setFormData((prevFormData) => ({ ...prevFormData, [name]: value }));
  };

  // Xử lý khi trạng thái đăng nhập thay đổi từ AuthModal
  const handleAuthStateChange = (user: any) => {
    setIsAuthenticated(!!user);
    if (user) {
      setIsAuthModalOpen(false); // Đóng modal khi đăng nhập thành công
    }
  };

  useEffect(() => {
    if (!auth) {
      console.error("Firebase auth is not initialized. Check firebaseConfig1.");
      setIsLoading(false);
      return;
    }

    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("Auth state in Checkout:", user ? `UID: ${user.uid}` : "No user");
      setIsAuthenticated(!!user);
      if (!user) {
        setIsAuthModalOpen(true); // Mở AuthModal nếu chưa đăng nhập
      }
      setIsLoading(false);
    }, (error) => {
      console.error("Auth state error:", error);
      setIsLoading(false);
    });

    return () => {
      console.log("Checkout unmounted, unsubscribing auth listener");
      unsubscribe();
    };
  }, []);

  useEffect(() => {
    if (!params.cartItems || !params.total || isAuthenticated === null) return;

    try {
      const items = JSON.parse(params.cartItems as string) as CartItem[];
      const totalAmount = Number.parseFloat(params.total as string);

      if (Array.isArray(items)) {
        setCartItems(items);
        setTotal(totalAmount);
      } else {
        throw new Error("Invalid cart items format");
      }
    } catch (error) {
      console.error("Error parsing cart data:", error);
      Alert.alert("Error", "Invalid cart data. Please check your cart and try again.", [
        { text: "OK", onPress: () => router.back() },
      ]);
    }
  }, [params.cartItems, params.total, router, isAuthenticated]);

  const handleSubmit = async () => {
    try {
      if (!formData.name || !formData.email || !formData.address) {
        Alert.alert("Error", "Please fill in all required fields");
        return;
      }

      const orderData = {
        customerInfo: formData,
        items: cartItems,
        total: total,
        hasShippingProtection: params.hasShippingProtection === "true",
      };

      await clearCart();

      router.push({
        pathname: "/cart/OrderReceipt",
        params: {
          orderData: JSON.stringify(orderData),
        },
      });
    } catch (error) {
      console.error("Error submitting order:", error);
      Alert.alert("Error", "There was a problem submitting your order. Please try again.");
    }
  };

  if (isLoading) {
    return (
      <SafeAreaView style={styles.container} className="flex-1 justify-center items-center">
        <Text style={styles.text}>Checking authentication...</Text>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} className="flex-1">
      <ScrollView className="flex-1 p-4">
        <Text style={styles.text} className="text-2xl font-bold mb-4">
          Checkout
        </Text>
        {isAuthenticated ? (
          <>
            <View className="mb-4">
              <Label htmlFor="name">
                <Text style={styles.text}>Full Name</Text>
              </Label>
              <Input
                id="name"
                value={formData.name}
                onChangeText={(text) => handleInputChange("name", text)}
                placeholder="John Doe"
                placeholderTextColor={isDarkColorScheme ? "#666666" : "#999999"}
                style={styles.input}
              />
            </View>
            <View className="mb-4">
              <Label htmlFor="email">
                <Text style={styles.text}>Email</Text>
              </Label>
              <Input
                id="email"
                value={formData.email}
                onChangeText={(text) => handleInputChange("email", text)}
                placeholder="your.email@example.com"
                placeholderTextColor={isDarkColorScheme ? "#666666" : "#999999"}
                style={styles.input}
                keyboardType="email-address"
              />
            </View>
            <View className="mb-4">
              <Label htmlFor="address">
                <Text style={styles.text}>Address</Text>
              </Label>
              <Input
                id="address"
                value={formData.address}
                onChangeText={(text) => handleInputChange("address", text)}
                placeholder="123 Main St"
                placeholderTextColor={isDarkColorScheme ? "#666666" : "#999999"}
                style={styles.input}
              />
            </View>
            <View className="mb-4">
              <Label htmlFor="city">
                <Text style={styles.text}>City</Text>
              </Label>
              <Input
                id="city"
                value={formData.city}
                onChangeText={(text) => handleInputChange("city", text)}
                placeholder="Anytown"
                placeholderTextColor={isDarkColorScheme ? "#666666" : "#999999"}
                style={styles.input}
              />
            </View>
            <View className="mb-4">
              <Label htmlFor="country">
                <Text style={styles.text}>Country</Text>
              </Label>
              <Input
                id="country"
                value={formData.country}
                onChangeText={(text) => handleInputChange("country", text)}
                placeholder="USA"
                placeholderTextColor={isDarkColorScheme ? "#666666" : "#999999"}
                style={styles.input}
              />
            </View>
            <View className="mb-4">
              <Label htmlFor="zipCode">
                <Text style={styles.text}>Zip Code</Text>
              </Label>
              <Input
                id="zipCode"
                value={formData.zipCode}
                onChangeText={(text) => handleInputChange("zipCode", text)}
                placeholder="12345"
                placeholderTextColor={isDarkColorScheme ? "#666666" : "#999999"}
                style={styles.input}
                keyboardType="number-pad"
              />
            </View>
            <View className="mb-4">
              <Text style={styles.text} className="font-bold mb-2">
                Order Summary
              </Text>
              {cartItems.map((item, index) => (
                <View key={`${item.id}-${index}`} className="flex-row justify-between mb-2">
                  <Text style={styles.text}>
                    {item.name} x{item.quantity}
                  </Text>
                  <Text style={styles.text}>${(item.price * item.quantity).toFixed(2)}</Text>
                </View>
              ))}
              <View className="flex-row justify-between mt-2">
                <Text style={styles.text} className="font-bold">
                  Total
                </Text>
                <Text style={styles.text} className="font-bold">
                  ${total.toFixed(2)}
                </Text>
              </View>
            </View>
            <Button
              onPress={handleSubmit}
              className="w-full"
              style={{ backgroundColor: isDarkColorScheme ? "#3b82f6" : "#2563eb" }}
            >
              <Text style={{ color: "#ffffff" }}>Place Order</Text>
            </Button>
          </>
        ) : (
          <View className="flex-1 justify-center items-center">
            <Text style={styles.text} className="text-lg text-center mb-4">
              You need to log in to checkout
            </Text>
            <Button
              onPress={() => setIsAuthModalOpen(true)}
              style={{ backgroundColor: isDarkColorScheme ? "#3b82f6" : "#2563eb" }}
            >
              <Text style={{ color: "#ffffff" }}>Login</Text>
            </Button>
            <Button
              onPress={() => router.back()}
              variant="outline"
              style={{ marginTop: 10 }}
            >
              <Text style={styles.text}>Back</Text>
            </Button>
          </View>
        )}
      </ScrollView>

      {/* Hiển thị AuthModal khi chưa đăng nhập */}
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
    </SafeAreaView>
  );
}