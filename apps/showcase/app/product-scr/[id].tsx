
import { useState, useEffect } from "react"
import { View, Text, Image, ScrollView, TouchableOpacity } from "react-native"
import { ChevronLeft, Star, Plus, Minus } from "lucide-react-native"
import { useRouter, useLocalSearchParams } from "expo-router"
import products from "./data/products"
import type { Product } from "./data/type/product"
import { Button } from "~/components/ui/button"
import { RadioGroup, RadioGroupItem } from "~/components/ui/radio-group"
import { Alert, AlertDescription } from "~/components/ui/alert"

export default function ProductDetail() {
  const router = useRouter()
  const { id } = useLocalSearchParams()
  const [product, setProduct] = useState<Product | null>(null)
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [error, setError] = useState("")

  const sizes = ["S", "M", "L", "XL", "2XL", "3XL", "4XL"]
  const colors = ["White", "Black", "Navy", "Red", "Gray"]

  useEffect(() => {
    const foundProduct = products.find(p => p.id === Number(id))
    if (foundProduct) {
      setProduct(foundProduct)
      if (foundProduct.colors && foundProduct.colors.length > 0) {
        setSelectedColor(foundProduct.colors[0])
      }
    }
  }, [id])

  const handleBackClick = () => {
    router.back()
  }

  const handleQuantityChange = (delta: number) => {
    setQuantity(prev => Math.max(1, prev + delta))
  }

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError("Please select a size")
      return
    }
    if (!selectedColor) {
      setError("Please select a color")
      return
    }

    if (product) {
      console.log("Adding to cart:", { product, quantity, selectedSize, selectedColor })
      router.push("/cart")
    }
  }

  if (!product) {
    return (
      <View className="flex-1 p-4">
        <View className="h-96 bg-gray-200 rounded-lg mb-4" />
        <View className="h-8 bg-gray-200 rounded w-3/4 mb-4" />
        <View className="h-4 bg-gray-200 rounded w-1/4" />
      </View>
    )
  }

  const images = [product.image, product.image1].filter(Boolean)

  return (
    <ScrollView className="flex-1 bg-background">
      {/* Header with Back Button */}
      <TouchableOpacity 
        onPress={handleBackClick} 
        className="p-4 flex-row items-center"
      >
        <ChevronLeft className="w-6 h-6 text-gray-500" />
        <Text className="text-lg text-gray-700 ml-2">Back</Text>
      </TouchableOpacity>

      {/* Product Images */}
      <View className="w-full">
        <View className="relative">
          <Image 
            source={{ uri: images[currentImageIndex] }} 
            className="w-full h-[300px]"
            resizeMode="cover"
          />
          {images.length > 1 && (
            <View className="absolute bottom-4 w-full flex-row justify-center space-x-2">
              {images.map((_, index) => (
                <TouchableOpacity
                  key={index}
                  onPress={() => setCurrentImageIndex(index)}
                  className={`w-2 h-2 rounded-full ${
                    currentImageIndex === index ? "bg-primary" : "bg-gray-300"
                  }`}
                />
              ))}
            </View>
          )}
        </View>
      </View>

      {/* Product Info */}
      <View className="p-4 space-y-6">
        <Text className="text-2xl font-bold">{product.name}</Text>
        <Text className="text-lg font-bold">${product.price}</Text>

        {error && (
          <Alert icon={Star} variant="destructive">
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Size Selection */}
        <View className="space-y-2">
          <Text className="font-semibold">Size</Text>
          <View className="flex-row flex-wrap gap-2">
            {sizes.map((size) => (
              <TouchableOpacity
                key={size}
                onPress={() => setSelectedSize(size)}
                className={`p-3 rounded-md border ${
                  selectedSize === size ? "bg-primary border-primary" : "border-gray-200"
                }`}
              >
                <Text className="text-gray-700">{size}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Color Selection */}
        <View className="space-y-2">
          <Text className="font-semibold">Color</Text>
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
                <Text className="text-gray-700 ml-2">{color}</Text>
              </TouchableOpacity>
            ))}
          </View>
        </View>

        {/* Add to Cart Button */}
        <Button
          className="w-full bg-[#DC2626] hover:bg-[#DC2626]/90"
          size="lg"
          onPress={handleAddToCart}
        >
          <Text className="text-white font-bold">Add to Cart</Text>
        </Button>
      </View>
    </ScrollView>
  )
}
