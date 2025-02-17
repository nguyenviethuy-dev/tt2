

import React, { createContext, useContext, useReducer, useEffect } from "react"
import AsyncStorage from "@react-native-async-storage/async-storage"
import { Alert, View, Text } from "react-native"
import { Button } from "~/components/ui/button"

// Interfaces & Types
interface Product {
  id: number
  name: string
  price: number
  image?: string
  description?: string
  category?: string
  stock?: number
}

interface CartItem extends Product {
  addedAt: number
  quantity: number
  selectedSize?: string
  selectedColor?: string
}

interface CartState {
  items: CartItem[]
  totalItems: number
  totalAmount: number
  isLoading: boolean
  error: string | null
  lastUpdated: number
}

interface CartContextValue {
  state: CartState
  dispatch: React.Dispatch<CartAction>
  addToCart: (product: Product, quantity?: number, size?: string, color?: string) => Promise<void>
  removeFromCart: (id: number, size?: string, color?: string) => Promise<void>
  updateQuantity: (id: number, quantity: number, size?: string, color?: string) => Promise<void>
  clearCart: () => Promise<void>
  isItemInCart: (id: number, size?: string, color?: string) => boolean
  getCartItemCount: () => number
  getCartTotal: () => number
}

type CartAction =
  | { type: "SET_LOADING"; payload: boolean }
  | { type: "SET_ERROR"; payload: string }
  | { type: "ADD_ITEM"; payload: { product: Product; quantity: number; size?: string; color?: string } }
  | { type: "UPDATE_QUANTITY"; payload: { id: number; quantity: number; size?: string; color?: string } }
  | { type: "REMOVE_ITEM"; payload: { id: number; size?: string; color?: string } }
  | { type: "CLEAR_CART" }
  | { type: "LOAD_CART"; payload: CartState }
  | { type: "SET_LAST_UPDATED"; payload: number }

// Constants
const CART_STORAGE_KEY = "@shopping_cart"
const CART_EXPIRY_TIME = 10 * 60 * 1000 // 10 minutes
const MAX_CART_ITEMS = 50
const MAX_QUANTITY_PER_ITEM = 99

// Initial State
const initialState: CartState = {
  items: [],
  totalItems: 0,
  totalAmount: 0,
  isLoading: true,
  error: null,
  lastUpdated: Date.now(),
}

// Context
const CartContext = createContext<CartContextValue | null>(null)

// Utilities
const validateQuantity = (quantity: number): boolean => {
  return quantity > 0 && quantity <= MAX_QUANTITY_PER_ITEM
}

const showAlert = (title: string, message: string) => {
  Alert.alert(title, message)
}

function isValidCartState(state: unknown): state is CartState {
  const cartState = state as CartState
  return (
    cartState !== null &&
    typeof cartState === "object" &&
    Array.isArray(cartState.items) &&
    typeof cartState.totalItems === "number" &&
    typeof cartState.totalAmount === "number" &&
    typeof cartState.isLoading === "boolean"
  )
}

// Reducer
const cartReducer = (state: CartState, action: CartAction): CartState => {
  let newState: CartState = { ...state }

  switch (action.type) {
    case "SET_LOADING":
      newState = { ...state, isLoading: action.payload }
      break

    case "SET_ERROR":
      newState = { ...state, error: action.payload }
      break

    case "LOAD_CART":
      newState = action.payload
      break

    case "ADD_ITEM": {
      const { product, quantity, size, color } = action.payload

      if (state.items.length >= MAX_CART_ITEMS) {
        showAlert("Cart Full", "You've reached the maximum number of items in cart")
        return state
      }

      if (!validateQuantity(quantity)) {
        showAlert("Invalid Quantity", `Quantity must be between 1 and ${MAX_QUANTITY_PER_ITEM}`)
        return state
      }

      const existingItemIndex = state.items.findIndex(
        (item) => item.id === product.id && item.selectedSize === size && item.selectedColor === color,
      )

      if (existingItemIndex > -1) {
        const newQuantity = state.items[existingItemIndex].quantity + quantity
        if (!validateQuantity(newQuantity)) {
          showAlert("Quantity Limit", `Maximum quantity per item is ${MAX_QUANTITY_PER_ITEM}`)
          return state
        }

        const newItems = [...state.items]
        newItems[existingItemIndex] = {
          ...newItems[existingItemIndex],
          quantity: newQuantity,
        }
        newState = { ...state, items: newItems }
      } else {
        newState = {
          ...state,
          items: [
            ...state.items,
            {
              ...product,
              addedAt: Date.now(),
              quantity,
              selectedSize: size,
              selectedColor: color,
            },
          ],
        }
      }
      break
    }

    case "UPDATE_QUANTITY":
      if (!validateQuantity(action.payload.quantity)) {
        showAlert("Invalid Quantity", `Quantity must be between 1 and ${MAX_QUANTITY_PER_ITEM}`)
        return state
      }

      newState = {
        ...state,
        items: state.items.map((item) =>
          item.id === action.payload.id &&
          item.selectedSize === action.payload.size &&
          item.selectedColor === action.payload.color
            ? { ...item, quantity: action.payload.quantity }
            : item,
        ),
      }
      break

    case "REMOVE_ITEM":
      newState = {
        ...state,
        items: state.items.filter(
          (item) =>
            !(
              item.id === action.payload.id &&
              item.selectedSize === action.payload.size &&
              item.selectedColor === action.payload.color
            ),
        ),
      }
      break

    case "CLEAR_CART":
      newState = { ...initialState, isLoading: false }
      break

    case "SET_LAST_UPDATED":
      newState = { ...state, lastUpdated: action.payload }
      break

    default:
      return state
  }

  // Calculate totals
  newState.totalItems = newState.items.reduce((sum, item) => sum + item.quantity, 0)
  newState.totalAmount = newState.items.reduce((sum, item) => sum + item.price * item.quantity, 0)
  newState.lastUpdated = Date.now()

  return newState
}

// Provider Component
export function CartProvider({ children }: { children: React.ReactNode }) {
  const [state, dispatch] = useReducer(cartReducer, initialState)
  const [hasError, setHasError] = React.useState(false)

  // Load cart from storage
  useEffect(() => {
    const loadCart = async () => {
      try {
        dispatch({ type: "SET_LOADING", payload: true })
        const savedCart = await AsyncStorage.getItem(CART_STORAGE_KEY)
        if (savedCart) {
          const parsedCart = JSON.parse(savedCart)
          if (isValidCartState(parsedCart)) {
            dispatch({ type: "LOAD_CART", payload: parsedCart })
          } else {
            throw new Error("Invalid cart data structure")
          }
        }
      } catch (error) {
        dispatch({ type: "SET_ERROR", payload: "Failed to load cart" })
        console.error("Error loading cart:", error)
        setHasError(true)
      } finally {
        dispatch({ type: "SET_LOADING", payload: false })
      }
    }
    loadCart()
  }, [])

  // Save cart to storage with debounce
  useEffect(() => {
    const saveCart = async () => {
      try {
        await AsyncStorage.setItem(CART_STORAGE_KEY, JSON.stringify(state))
      } catch (error) {
        console.error("Error saving cart:", error)
        setHasError(true)
      }
    }

    if (!state.isLoading) {
      const timeoutId = setTimeout(saveCart, 1000)
      return () => clearTimeout(timeoutId)
    }
  }, [state])

  // Check for expired items
  useEffect(() => {
    const interval = setInterval(() => {
      const now = Date.now()
      state.items.forEach((item) => {
        if (now - item.addedAt > CART_EXPIRY_TIME) {
          dispatch({
            type: "REMOVE_ITEM",
            payload: { id: item.id, size: item.selectedSize, color: item.selectedColor },
          })
          showAlert("Item Removed", `${item.name} has been removed from cart due to expiration`)
        }
      })
    }, 60000)

    return () => clearInterval(interval)
  }, [state.items])

  // Helper functions
  const addToCart = async (product: Product, quantity = 1, size?: string, color?: string) => {
    try {
      if (!product || typeof product.id !== "number" || !product.name || typeof product.price !== "number") {
        throw new Error("Invalid product data")
      }

      dispatch({
        type: "ADD_ITEM",
        payload: { product, quantity, size, color },
      })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to add item to cart" })
      showAlert("Error", "Failed to add item to cart")
      setHasError(true)
    }
  }

  const removeFromCart = async (id: number, size?: string, color?: string) => {
    try {
      dispatch({
        type: "REMOVE_ITEM",
        payload: { id, size, color },
      })
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to remove item from cart" })
      showAlert("Error", "Failed to remove item from cart")
      setHasError(true)
    }
  }

  const updateQuantity = async (id: number, quantity: number, size?: string, color?: string) => {
    try {
      if (quantity <= 0) {
        await removeFromCart(id, size, color)
      } else {
        dispatch({
          type: "UPDATE_QUANTITY",
          payload: { id, quantity, size, color },
        })
      }
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to update quantity" })
      showAlert("Error", "Failed to update quantity")
      setHasError(true)
    }
  }

  const clearCart = async () => {
    try {
      dispatch({ type: "CLEAR_CART" })
      await AsyncStorage.removeItem(CART_STORAGE_KEY)
    } catch (error) {
      dispatch({ type: "SET_ERROR", payload: "Failed to clear cart" })
      showAlert("Error", "Failed to clear cart")
      setHasError(true)
    }
  }

  const isItemInCart = (id: number, size?: string, color?: string): boolean => {
    return state.items.some((item) => item.id === id && item.selectedSize === size && item.selectedColor === color)
  }

  const getCartItemCount = (): number => {
    return state.totalItems
  }

  const getCartTotal = (): number => {
    return state.totalAmount
  }

  // Error boundary
  if (hasError) {
    return (
      <View style={{ flex: 1, justifyContent: "center", alignItems: "center" }}>
        <Text>Something went wrong with the cart</Text>
        <Button onPress={() => setHasError(false)}>
          <Text>Reset Cart</Text>
        </Button>
      </View>
    )
  }

  const value = React.useMemo(
    () => ({
      state,
      dispatch,
      addToCart,
      removeFromCart,
      updateQuantity,
      clearCart,
      isItemInCart,
      getCartItemCount,
      getCartTotal,
    }),
    [state],
  )

  return <CartContext.Provider value={value}>{children}</CartContext.Provider>
}

// Custom Hooks
export const useCart = () => {
  const context = useContext(CartContext)
  if (!context) {
    throw new Error(
      "useCart must be used within a CartProvider. " + "Make sure you have wrapped your app with CartProvider.",
    )
  }
  return context
}

export const useCartIsReady = () => {
  return useContext(CartContext) !== null
}

