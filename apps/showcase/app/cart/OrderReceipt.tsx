
import { useRef, useEffect, useState } from "react";
import { View, Text, ScrollView, SafeAreaView, Alert, TouchableOpacity } from "react-native";
import { useLocalSearchParams, useRouter } from "expo-router";
import ViewShot from "react-native-view-shot";
import * as MediaLibrary from "expo-media-library";
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Plus, ArrowLeft } from "lucide-react-native";
import { db, auth } from "~/app/services/firebaseConfig";
import { collection, addDoc } from "firebase/firestore";
import AuthModal from "../(tabs)/components/home/AuthModal"; // Đảm bảo đường dẫn đúng

interface OrderItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  selectedSize?: string;
  selectedColor?: string;
}

interface OrderData {
  customerInfo: {
    name: string;
    email: string;
    address: string;
    city: string;
    country: string;
    zipCode: string;
  };
  items: OrderItem[];
  total: number;
  hasShippingProtection: boolean;
  uid?: string;
}

export default function OrderReceipt() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const viewShotRef = useRef(null);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isAuthorized, setIsAuthorized] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isAuthModalOpen, setIsAuthModalOpen] = useState(false);

  const sampleOrderData: OrderData = {
    customerInfo: {
      name: "John Doe",
      email: "john.doe@example.com",
      address: "123 Main St",
      city: "New York",
      country: "USA",
      zipCode: "10001",
    },
    items: [
      { id: 1, name: "T-Shirt", price: 19.99, quantity: 2, selectedSize: "M", selectedColor: "Blue" },
      { id: 2, name: "Jeans", price: 49.99, quantity: 1 },
    ],
    total: 89.97,
    hasShippingProtection: true,
  };

  const validateOrderData = (data: OrderData): boolean => {
    const isValid =
      data.customerInfo &&
      typeof data.customerInfo.name === "string" &&
      typeof data.customerInfo.email === "string" &&
      typeof data.total === "number" &&
      Array.isArray(data.items) &&
      data.items.length > 0;
    return isValid;
  };

  useEffect(() => {
    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("Auth state:", user ? `UID: ${user.uid}, Email: ${user.email}` : "No user");

      if (!user) {
        setIsAuthModalOpen(true); // Mở modal nếu chưa đăng nhập
        setIsAuthorized(false);
        setIsLoading(false); // Đặt isLoading thành false để tránh vòng lặp
        return;
      }

      setIsAuthorized(true);
      setIsAuthModalOpen(false); // Đảm bảo modal đóng khi đã đăng nhập
      try {
        let parsedOrder: OrderData;
        if (params.orderData) {
          console.log("Raw params.orderData:", params.orderData);
          parsedOrder = JSON.parse(params.orderData as string);
        } else {
          parsedOrder = sampleOrderData;
          Alert.alert("Info", "Using sample order data.");
        }

        const updatedOrderData = { ...parsedOrder, uid: user.uid };
        console.log("Order data with UID:", updatedOrderData);
        setOrderData(updatedOrderData);
      } catch (error) {
        console.error("Parse error:", error);
        setError(`Could not load order: ${error.message}`);
      }
      setIsLoading(false); // Hoàn tất quá trình tải
    });

    return () => unsubscribe();
  }, [params.orderData]);

  const saveOrderToFirestore = async (data: OrderData) => {
    const user = auth.currentUser;
    console.log("Saving. User:", user ? user.uid : "No user");
    console.log("User details:", user ? { uid: user.uid, email: user.email } : "No user");

    if (!user) {
      setError("No authenticated user.");
      return;
    }

    if (!validateOrderData(data)) {
      setError("Invalid order data.");
      return;
    }

    const orderPayload = { ...data, uid: user.uid, createdAt: new Date().toISOString() };
    console.log("Payload to Firestore:", orderPayload);
    console.log("UID check: Payload UID:", orderPayload.uid, "vs User UID:", user.uid);

    try {
      const ordersCollection = collection(db, "orders");
      const docRef = await addDoc(ordersCollection, orderPayload);
      console.log("Saved with ID:", docRef.id);
      Alert.alert("Success", "Order saved!");
    } catch (error) {
      console.error("Save error:", { message: error.message, code: error.code });
      setError(`Failed to save: ${error.message}`);
    }
  };

  const handleAddReview = () => {
    if (orderData) {
      router.push({
        pathname: "/review/AddReviewScreen",
        params: { products: JSON.stringify(orderData.items) },
      });
    }
  };

  const handleBackToPrevious = () => {
    router.back();
  };

  const handleBackToHome = () => {
    if (orderData) {
      saveOrderToFirestore(orderData);
    }
    router.push("/");
  };

  const handleAuthStateChange = (user: any) => {
    setIsAuthorized(!!user);
    if (user) {
      setIsAuthModalOpen(false); // Đóng modal khi đăng nhập thành công
    }
  };

  // Nếu chưa đăng nhập, chỉ hiển thị AuthModal
  if (!isAuthorized) {
    return (
      <SafeAreaView className="flex-1 bg-background">
        {isAuthModalOpen && (
          <View style={{ position: "absolute", top: 0, left: 0, right: 0, bottom: 0, backgroundColor: "rgba(0,0,0,0.5)" }}>
            <AuthModal
              isOpen={isAuthModalOpen}
              onClose={() => setIsAuthModalOpen(false)}
              onAuthStateChange={handleAuthStateChange}
              isDarkColorScheme={true}
            />
          </View>
        )}
      </SafeAreaView>
    );
  }

  // Nếu đang tải, hiển thị màn hình loading
  if (isLoading) return <SafeAreaView className="flex-1 justify-center items-center bg-background"><Text>Loading...</Text></SafeAreaView>;

  // Nếu có lỗi, hiển thị thông báo lỗi
  if (error) return (
    <SafeAreaView className="flex-1 justify-center items-center bg-background">
      <Text className="text-lg text-center mb-4">{error}</Text>
      <Button onPress={() => router.push("/")} variant="default"><Text className="text-white">Return Home</Text></Button>
    </SafeAreaView>
  );

  // Nếu đã xác thực và có dữ liệu, hiển thị biên lai
  return (
    <SafeAreaView className="flex-1 bg-background">
      <View className="flex-row justify-between items-center p-4">
        <TouchableOpacity onPress={handleBackToPrevious} className="p-2">
          <ArrowLeft size={24} color="#fff" />
        </TouchableOpacity>
      </View>
      <ScrollView className="flex-1 p-4">
        <ViewShot ref={viewShotRef} options={{ format: "jpg", quality: 0.9 }}>
          <Card>
            <CardHeader>
              <CardTitle><Text className="text-2xl font-bold text-center dark:text-white">Order Receipt</Text></CardTitle>
              <Text className="text-sm text-center text-gray-500">{new Date().toLocaleString()}</Text>
            </CardHeader>
            <CardContent>
              <View className="space-y-6">
                <View>
                  <Text className="text-lg font-semibold mb-2 dark:text-white">Customer Information</Text>
                  <Text className="dark:text-white text-md">Name: {orderData.customerInfo.name}</Text>
                  <Text className="dark:text-white text-md">Email: {orderData.customerInfo.email}</Text>
                  <Text className="dark:text-white text-md">Address: {orderData.customerInfo.address}</Text>
                  <Text className="dark:text-white text-md">City: {orderData.customerInfo.city}</Text>
                  <Text className="dark:text-white text-md">Country: {orderData.customerInfo.country}</Text>
                  <Text className="dark:text-white text-md">Zip Code: {orderData.customerInfo.zipCode}</Text>
                </View>
                <Separator />
                <View>
                  <Text className="text-lg font-semibold mb-2 dark:text-white">Order Items</Text>
                  {orderData.items.map((item) => (
                    <View key={`${item.id}-${item.selectedSize}-${item.selectedColor}`} className="mb-4">
                      <Text className="font-medium dark:text-white text-md">{item.name}</Text>
                      <Text className="text-md text-gray-500">Quantity: {item.quantity}</Text>
                      {item.selectedSize && <Text className="text-md text-gray-500">Size: {item.selectedSize}</Text>}
                      {item.selectedColor && <Text className="text-md text-gray-500">Color: {item.selectedColor}</Text>}
                      <Text className="dark:text-white text-md">Price: ${(item.price * item.quantity).toFixed(2)}</Text>
                    </View>
                  ))}
                </View>
                <Separator />
                <View className="flex-row justify-between items-center">
                  <Text className="text-lg font-semibold dark:text-white text-md">Total:</Text>
                  <Text className="text-lg font-semibold dark:text-white text-md">${orderData.total.toFixed(2)}</Text>
                </View>
              </View>
            </CardContent>
          </Card>
        </ViewShot>
      </ScrollView>
      <View className="p-4 flex-row justify-between">
        <Button className="flex-1 mr-2" onPress={async () => {
          try {
            const { status } = await MediaLibrary.requestPermissionsAsync();
            if (status === "granted") {
              const uri = await viewShotRef.current.capture();
              await MediaLibrary.saveToLibraryAsync(uri);
              Alert.alert("Success", "Receipt saved to gallery!");
            } else {
              Alert.alert("Permission Required", "We need permission to save the receipt to your gallery");
            }
          } catch (error) {
            console.error("Error saving receipt:", error);
            Alert.alert("Error", "Failed to save receipt. Please try again.");
          }
        }}>
          <Text className="text-white dark:text-black text-md">Save Receipt</Text>
        </Button>
        <Button className="flex-1 ml-2" variant="default" onPress={handleBackToHome}>
          <Text className="text-white text-md dark:text-black">Back to Home</Text>
        </Button>
      </View>
      <TouchableOpacity className="absolute bottom-20 right-4 bg-blue-500 rounded-full p-4" onPress={handleAddReview}>
        <Plus size={24} color="#fff" />
      </TouchableOpacity>
    </SafeAreaView>
  );
}