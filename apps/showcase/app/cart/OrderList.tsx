import { useEffect, useState } from "react";
import { View, Text, ScrollView, SafeAreaView, Alert, TouchableOpacity } from "react-native";
import { useRouter } from "expo-router";
import { db, auth } from "~/app/services/firebaseConfig";
import { collection, query, where, getDocs, deleteDoc, doc } from "firebase/firestore"; // Thêm deleteDoc và doc
import { Button } from "~/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "~/components/ui/card";
import { Separator } from "~/components/ui/separator";
import { Trash2, RefreshCw } from "lucide-react-native"; // Thêm icon Trash và Refresh

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
  uid: string;
  createdAt: string;
  id?: string;
}

export default function OrderList() {
  const router = useRouter();
  const [orders, setOrders] = useState<OrderData[]>([]);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  const fetchOrders = async () => {
    const user = auth.currentUser;
    if (!user) {
      setError("You must be logged in to view your orders.");
      setLoading(false);
      return;
    }

    try {
      setLoading(true); // Bật loading khi làm mới
      const ordersCollection = collection(db, "orders");
      const q = query(ordersCollection, where("uid", "==", user.uid));
      const querySnapshot = await getDocs(q);
      const userOrders: OrderData[] = [];
      querySnapshot.forEach((doc) => {
        const orderData = doc.data() as OrderData;
        userOrders.push({ ...orderData, id: doc.id });
      });
      setOrders(userOrders);
      setLoading(false);
    } catch (error) {
      console.error("Error fetching orders:", error);
      setError("Failed to load your orders.");
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const handleViewReceipt = (order: OrderData) => {
    router.push({
      pathname: "/OrderReceipt",
      params: { orderData: JSON.stringify(order) },
    });
  };

  const handleDeleteOrder = async (orderId: string | undefined) => {
    if (!orderId) {
      Alert.alert("Error", "Invalid order ID.");
      return;
    }

    Alert.alert(
      "Confirm Delete",
      "Are you sure you want to delete this order?",
      [
        { text: "Cancel", style: "cancel" },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              const orderRef = doc(db, "orders", orderId);
              await deleteDoc(orderRef);
              setOrders(orders.filter((order) => order.id !== orderId)); // Cập nhật UI ngay lập tức
              Alert.alert("Success", "Order deleted successfully!");
            } catch (error) {
              console.error("Error deleting order:", error);
              Alert.alert("Error", "Failed to delete order.");
            }
          },
        },
      ]
    );
  };

  const handleRefresh = () => {
    fetchOrders(); // Gọi lại hàm tải danh sách đơn hàng
  };

  if (loading) {
    return (
      <SafeAreaView className="flex-1 justify-center items-center bg-background">
        <Text>Loading...</Text>
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

  return (
    <SafeAreaView className="flex-1 bg-background">
      <ScrollView className="flex-1 p-4">
        <View className="flex-row justify-between items-center mb-6">
          <Text className="text-2xl font-bold dark:text-white">Your Orders</Text>
          <TouchableOpacity onPress={handleRefresh} className="p-2">
            <RefreshCw size={24} color="#fff" />
          </TouchableOpacity>
        </View>
        {orders.length === 0 ? (
          <Text className="text-lg text-center dark:text-white">You have no orders yet.</Text>
        ) : (
          orders.map((order, index) => (
            <TouchableOpacity key={order.id || index} onPress={() => handleViewReceipt(order)}>
              <Card className="mb-4">
                <CardHeader>
                  <CardTitle>
                    <Text className="text-lg font-semibold dark:text-white">
                      Order #{index + 1} - {new Date(order.createdAt).toLocaleDateString()}
                    </Text>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <View className="space-y-4">
                    <Text className="dark:text-white">Customer: {order.customerInfo.name}</Text>
                    <Text className="dark:text-white">Total: ${order.total.toFixed(2)}</Text>
                    <Text className="dark:text-white">Items: {order.items.length}</Text>
                    <Separator />
                    <View className="flex-row justify-between">
                      <Button variant="outline" onPress={() => handleViewReceipt(order)}>
                        <Text className="dark:text-white">View Receipt</Text>
                      </Button>
                      <Button
                        variant="destructive"
                        onPress={() => handleDeleteOrder(order.id)}
                        className="flex-row items-center"
                      >
                        <Trash2 size={18} color="#fff" className="mr-2" />
                        <Text className="text-white">Delete</Text>
                      </Button>
                    </View>
                  </View>
                </CardContent>
              </Card>
            </TouchableOpacity>
          ))
        )}
      </ScrollView>
      <View className="p-4">
        <Button onPress={() => router.push("/")} variant="outline">
          <Text className="dark:text-white">Back to Home</Text>
        </Button>
      </View>
    </SafeAreaView>
  );
}