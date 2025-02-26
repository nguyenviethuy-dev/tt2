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
  createdAt?: string;
  id?: string;
}

export default function OrderReceipt() {
  const router = useRouter();
  const params = useLocalSearchParams();
  const viewShotRef = useRef(null);
  const [orderData, setOrderData] = useState<OrderData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    console.log("OrderReceipt mounted. Params received:", params);

    const unsubscribe = auth.onAuthStateChanged((user) => {
      console.log("Auth state:", user ? `UID: ${user.uid}` : "No user");

      if (!user) {
        setError("You must be logged in to view this receipt.");
        setIsLoading(false);
        return;
      }

      if (!params.orderData) {
        setError("No order data provided in params.");
        console.log("No orderData in params");
        setIsLoading(false);
        return;
      }

      try {
        const parsedOrder = JSON.parse(params.orderData as string);
        console.log("Parsed order data:", parsedOrder);
        setOrderData(parsedOrder);
      } catch (error) {
        console.error("Parse error:", error);
        setError(`Could not parse order data: ${error.message}`);
      }
      setIsLoading(false);
    });

    return () => {
      console.log("OrderReceipt unmounted");
      unsubscribe();
    };
  }, [params.orderData]);

  const saveOrderToFirestore = async (data: OrderData) => {
    const user = auth.currentUser;
    if (!user || !data) return;

    const orderPayload = { ...data, uid: user.uid, createdAt: data.createdAt || new Date().toISOString() };
    try {
      const ordersCollection = collection(db, "orders");
      const docRef = await addDoc(ordersCollection, orderPayload);
      console.log("Saved with ID:", docRef.id);
      Alert.alert("Success", "Order saved!");
    } catch (error) {
      console.error("Save error:", error);
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

  if (isLoading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-background">
        <Text>Loading receipt...</Text>
      </SafeAreaView>
    );
  }

  if (error) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-background">
        <Text className="text-lg text-center mb-4">{error}</Text>
        <Button onPress={() => router.push("/")} variant="default">
          <Text className="text-white">Return Home</Text>
        </Button>
      </SafeAreaView>
    );
  }

  if (!orderData) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-background">
        <Text className="text-lg text-center mb-4">No order data available</Text>
        <Button onPress={() => router.back()} variant="outline">
          <Text>Go Back</Text>
        </Button>
      </SafeAreaView>
    );
  }

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
              <CardTitle>
                <Text className="text-2xl font-bold text-center dark:text-white">Order Receipt</Text>
              </CardTitle>
              <Text className="text-sm text-center text-gray-500">
                {new Date(orderData.createdAt || Date.now()).toLocaleString()}
              </Text>
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
        <Button
          className="flex-1 mr-2"
          onPress={async () => {
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
          }}
        >
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
