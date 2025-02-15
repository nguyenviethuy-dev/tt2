
import { useState, useEffect } from "react"
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native"
import { Star, Plus, Minus } from "lucide-react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import { Alert, AlertDescription } from "~/components/ui/alert"
import { useCart } from "../cart/Contexts/cart-context"
import products from "./data/products"
import type { Product } from "./data/type/product"

export default function ProductDetail() {
  const router = useRouter()
  const { id } = useLocalSearchParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [error, setError] = useState("")
  const { dispatch } = useCart()

  const sizes = ["S", "M", "L", "XL", "2XL", "3XL", "4XL"]
  const colors = product?.colors || []

  useEffect(() => {
    const foundProduct = products.find((p) => p.id === Number(id))
    if (foundProduct) {
      setProduct(foundProduct)
      if (foundProduct.colors && foundProduct.colors.length > 0) {
        setSelectedColor(foundProduct.colors[0])
      }
    }
  }, [id])

  const handleQuantityChange = (delta: number) => {
    setQuantity((prev) => Math.max(1, prev + delta))
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError("Please select a size")
      return
    }
    if (colors.length > 0 && !selectedColor) {
      setError("Please select a color")
      return
    }

    if (product) {
      dispatch({
        type: "ADD_ITEM",
        payload: {
          product,
          quantity,
          size: selectedSize,
          color: selectedColor,
        },
      })
      router.push("/cart")
    }
  }

  if (!product) {
    return (
      <View className="flex-1 p-4 bg-white">
        <View className="h-96 bg-gray-200 rounded-lg mb-4" />
        <View className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
        <View className="h-4 bg-gray-200 rounded w-1/4" />
      </View>
    )
  }

  const images = [product.image, product.image1].filter(Boolean)

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Product Images */}
      <View className="w-full">
        <View className="relative">
          <Image source={{ uri: images[currentImageIndex] }} className="w-full h-[300px]" resizeMode="cover" />
          {images.length > 1 && (
            <View className="absolute bottom-4 w-full flex-row justify-center space-x-2">
              {images.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full ${currentImageIndex === index ? "bg-primary" : "bg-gray-300"}`}
                />
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Product Info */}
      <View className="p-4 space-y-6">
        <Text className="text-2xl font-bold text-foreground">{product.name}</Text>
        <Text className="text-lg font-bold text-foreground">${product.price}</Text>

        {error && (
          <Alert icon={Star} variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Size Selection */}
        <View className="space-y-2">
          <Text className="font-semibold text-foreground">Size</Text>
          <View className="flex-row flex-wrap gap-2">
            {sizes.map((size) => (
              <TouchableOpacity
                key={size}
                onPress={() => setSelectedSize(size)}
                className={`p-3 rounded-md border ${
                  selectedSize === size ? "bg-primary border-primary" : "border-gray-200"
                }`}
              >
                <Text className={`${selectedSize === size ? "text-primary-foreground" : "text-foreground"}`}>
                  {size}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Color Selection */}
        <View className="space-y-2">
          <Text className="font-semibold text-foreground">Color</Text>
          <View className="flex-row flex-wrap gap-2">
            {colors.map((color) => (
              <TouchableOpacity
                key={color}
                onPress={() => setSelectedColor(color)}
                className={`p-3 rounded-md border ${
                  selectedColor === color ? "bg-primary border-primary" : "border-gray-200"
                }`}
              >
                <View
                  className="w-4 h-4 rounded-full border border-gray-200"
                  style={{ backgroundColor: color.toLowerCase() }}
                />
                <Text className={`ml-2 ${selectedColor === color ? "text-primary-foreground" : "text-foreground"}`}>
                  {color}
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Quantity Selection */}
        <View className="space-y-2">
          <Text className="font-semibold text-foreground">Quantity</Text>
          <View className="flex-row items-center space-x-4">
            <TouchableOpacity onPress={() => handleQuantityChange(-1)} className="p-2 rounded-md bg-gray-200">
              <Minus size={20} color="#000" />
            </TouchableOpacity>
            <Text className="text-lg font-semibold">{quantity}</Text>
            <TouchableOpacity onPress={() => handleQuantityChange(1)} className="p-2 rounded-md bg-gray-200">
              <Plus size={20} color="#000" />
            </TouchableOpacity>
          </View>
        </View>

        {/* Add to Cart Button */}
        <TouchableOpacity
          onPress={handleAddToCart}
          className="w-full bg-[#DC2626] active:bg-[#DC2626]/90 py-3 rounded-md"
        >
          <Text className="text-white font-bold text-center">Add to Cart</Text>
        </TouchableOpacity>

        {/* Product Details */}
        <View className="space-y-2">
          <Text className="text-lg font-semibold">Product Details</Text>
          <View className="space-y-1">
            {product.productType && <Text className="text-foreground">• Type: {product.productType}</Text>}
            {product.occasions && (
              <Text className="text-foreground">• Perfect for: {product.occasions.join(", ")}</Text>
            )}
            {product.giftFor && <Text className="text-foreground">• Ideal gift for: {product.giftFor.join(", ")}</Text>}
            {product.description && <Text className="text-foreground">• {product.description}</Text>}
          </View>
        </View>
      </View>
    </ScrollView>
  )
}