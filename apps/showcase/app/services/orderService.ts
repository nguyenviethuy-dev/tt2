import { db, auth } from "./firebaseConfig1"
import { collection, addDoc, doc, getDoc } from "firebase/firestore"

export const saveOrder = async (orderData) => {
  if (!auth.currentUser) {
    throw new Error("User must be authenticated to save an order")
  }

  const ordersCollection = collection(db, "orders")
  const orderWithUserId = {
    ...orderData,
    userId: auth.currentUser.uid,
    createdAt: new Date(),
  }

  try {
    const docRef = await addDoc(ordersCollection, orderWithUserId)
    console.log("Order saved with ID: ", docRef.id)
    return docRef.id
  } catch (error) {
    console.error("Error saving order: ", error)
    throw error
  }
}

export const getOrderById = async (orderId) => {
  if (!auth.currentUser) {
    throw new Error("User must be authenticated to fetch an order")
  }

  const orderRef = doc(db, "orders", orderId)

  try {
    const orderSnap = await getDoc(orderRef)
    if (orderSnap.exists()) {
      const orderData = orderSnap.data()
      if (orderData.userId !== auth.currentUser.uid) {
        throw new Error("You do not have permission to view this order")
      }
      return orderData
    } else {
      throw new Error("Order not found")
    }
  } catch (error) {
    console.error("Error fetching order: ", error)
    throw error
  }
}

