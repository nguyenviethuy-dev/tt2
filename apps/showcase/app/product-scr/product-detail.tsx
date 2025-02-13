
import { useState, useEffect } from "react"
import { View, Text, Image, ScrollView, TouchableOpacity, Dimensions } from "react-native"
import { ChevronLeft, ChevronRight, Star, Plus, Minus } from "lucide-react-native"
import { Button } from "~/components/ui/button"
import { RadioGroup } from "~/components/ui/radio-group"
import { Label } from "~/components/ui/label"
import { Alert, AlertDescription } from "~/components/ui/alert"

type Product = {
  id: number
  name: string
  price: number
  originalPrice?: number
  rating?: number
  reviews?: number
  image: string
  image1?: string
  productType?: string
  occasions?: string[]
  giftFor?: string[]
  description?: string
  colors?: string[]
}

type ProductDetailProps = {
  product: Product | null
  onBack: () => void
  onAddToCart: (product: Product, quantity: number, size: string, color: string) => void
}

export default function ProductDetail({ product, onBack, onAddToCart }: ProductDetailProps) {
  const [currentImageIndex, setCurrentImageIndex] = useState(0)
  const [quantity, setQuantity] = useState(1)
  const [selectedSize, setSelectedSize] = useState("")
  const [selectedColor, setSelectedColor] = useState("")
  const [error, setError] = useState("")
  const windowWidth = Dimensions.get("window").width

  const sizes = ["S", "M", "L", "XL", "2XL", "3XL", "4XL"]
  const colors = ["White", "Black", "Navy", "Red", "Gray"]

  useEffect(() => {
    if (product?.colors && product.colors.length > 0) {
      setSelectedColor(product.colors[0])
    }
  }, [product])

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

  const handleAddToCart = () => {
    if (!selectedSize) {
      setError("Please select a size")
      return
    }
    if (!selectedColor) {
      setError("Please select a color")
      return
    }

    onAddToCart(product, quantity, selectedSize, selectedColor)
  }

  return (
    <ScrollView className="flex-1 bg-background">
      <View className="p-4">
        {/* Back Button */}
        <TouchableOpacity onPress={onBack} className="mb-4">
          <ChevronLeft className="w-6 h-6 text-gray-500" />
        </TouchableOpacity>

        {/* Image Gallery */}
        <View className="relative mb-4">
          <Image
            source={{ uri: images[currentImageIndex] }}
            className="w-full aspect-square rounded-lg"
            resizeMode="cover"
          />

          {images.length > 1 && (
            <View className="flex-row justify-between absolute left-2 right-2 top-1/2 -translate-y-1/2">
              <TouchableOpacity
                onPress={() => setCurrentImageIndex((prev) => (prev > 0 ? prev - 1 : images.length - 1))}
                className="bg-black/50 rounded-full p-2"
              >
                <ChevronLeft className="w-6 h-6 text-white" />
              </TouchableOpacity>
              <TouchableOpacity
                onPress={() => setCurrentImageIndex((prev) => (prev < images.length - 1 ? prev + 1 : 0))}
                className="bg-black/50 rounded-full p-2"
              >
                <ChevronRight className="w-6 h-6 text-white" />
              </TouchableOpacity>
            </View>
          )}
        </View>

        {/* Thumbnail Gallery */}
        <ScrollView horizontal showsHorizontalScrollIndicator={false} className="mb-6">
          {images.map((image, index) => (
            <TouchableOpacity
              key={index}
              onPress={() => setCurrentImageIndex(index)}
              className={`mr-2 rounded-lg overflow-hidden border-2 ${
                index === currentImageIndex ? "border-primary" : "border-transparent"
              }`}
            >
              <Image source={{ uri: image }} className="w-20 h-20" resizeMode="cover" />
            </TouchableOpacity>
          ))}
        </ScrollView>

        {/* Product Info */}
        <View className="space-y-4">
          <Text className="text-2xl font-bold">{product.name}</Text>

          {/* Rating */}
          <View className="flex-row items-center">
            {Array.from({ length: 5 }).map((_, i) => (
              <Star
                key={i}
                size={20}
                className={i < (product.rating ?? 0) ? "text-primary fill-primary" : "text-gray-300 fill-gray-300"}
              />
            ))}
            {product.reviews && <Text className="ml-2 text-gray-500">({product.reviews} reviews)</Text>}
          </View>

          {/* Price */}
          <View className="flex-row items-center space-x-2">
            <Text className="text-2xl font-bold">${product.price}</Text>
            {product.originalPrice && <Text className="text-gray-500 line-through">${product.originalPrice}</Text>}
          </View>

          {/* Error Alert */}
          {error && (
            <Alert icon={Star}>
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          {/* Size Selection */}
          <View className="space-y-2">
            <Label>Size</Label>
            <RadioGroup value={selectedSize} onValueChange={setSelectedSize}>
              <View className="flex-row flex-wrap gap-2">
                {sizes.map((size) => (
                  <TouchableOpacity
                    key={size}
                    onPress={() => setSelectedSize(size)}
                    className={`border rounded-md p-3 flex-1 items-center ${
                      selectedSize === size ? "bg-primary border-primary" : "border-gray-200"
                    }`}
                  >
                    <Text className={selectedSize === size ? "text-white" : "text-gray-900"}>{size}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </RadioGroup>
          </View>

          {/* Color Selection */}
          <View className="space-y-2">
            <Label>Color</Label>
            <RadioGroup value={selectedColor} onValueChange={setSelectedColor}>
              <View className="flex-row flex-wrap gap-2">
                {colors.map((color) => (
                  <TouchableOpacity
                    key={color}
                    onPress={() => setSelectedColor(color)}
                    className={`border rounded-md p-3 flex-row items-center space-x-2 ${
                      selectedColor === color ? "bg-primary border-primary" : "border-gray-200"
                    }`}
                  >
                    <View className="w-4 h-4 rounded-full border" style={{ backgroundColor: color.toLowerCase() }} />
                    <Text className={selectedColor === color ? "text-white" : "text-gray-900"}>{color}</Text>
                  </TouchableOpacity>
                ))}
              </View>
            </RadioGroup>
          </View>

          {/* Quantity */}
          <View className="space-y-2">
            <Label>Quantity</Label>
            <View className="flex-row items-center space-x-4">
              <TouchableOpacity
                onPress={() => setQuantity(Math.max(1, quantity - 1))}
                className="border rounded-md p-2"
              >
                <Minus className="w-6 h-6" />
              </TouchableOpacity>
              <Text className="text-lg">{quantity}</Text>
              <TouchableOpacity onPress={() => setQuantity(quantity + 1)} className="border rounded-md p-2">
                <Plus className="w-6 h-6" />
              </TouchableOpacity>
            </View>
          </View>

          {/* Add to Cart Button */}
          <Button className="w-full bg-[#DC2626]" onPress={handleAddToCart}>
            Add to Cart
          </Button>

          {/* Product Details */}
          <View className="space-y-2">
            <Text className="text-lg font-semibold">Product Details</Text>
            <View className="space-y-1">
              {product.productType && <Text className="text-gray-600">Type: {product.productType}</Text>}
              {product.occasions && <Text className="text-gray-600">Perfect for: {product.occasions.join(", ")}</Text>}
              {product.giftFor && <Text className="text-gray-600">Ideal gift for: {product.giftFor.join(", ")}</Text>}
              {product.description && <Text className="text-gray-600">{product.description}</Text>}
            </View>
          </View>
        </View>
      </View>
    </ScrollView>
  )
}

