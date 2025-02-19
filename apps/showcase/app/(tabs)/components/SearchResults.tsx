import type React from "react"
import { View, Text, Image, TouchableOpacity, FlatList } from "react-native"
import type { Product } from "~/app/product-scr/data/type/product"

interface SearchResultsProps {
  results: Product[]
  onSelectProduct: (productId: number) => void
}

const SearchResults: React.FC<SearchResultsProps> = ({ results, onSelectProduct }) => {
  const renderItem = ({ item }: { item: Product }) => (
    <TouchableOpacity
      className="flex-row items-center p-2 border-b border-gray-200"
      onPress={() => onSelectProduct(item.id)}
    >
      <Image source={{ uri: item.image }} className="w-16 h-16 rounded-md mr-4" resizeMode="cover" />
      <View className="flex-1">
        <Text className="text-foreground font-semibold" numberOfLines={1}>
          {item.name}
        </Text>
        <Text className="text-muted-foreground">${item.price.toFixed(2)}</Text>
        {item.productType && <Text className="text-muted-foreground text-sm">{item.productType}</Text>}
      </View>
    </TouchableOpacity>
  )

  return (
    <FlatList
      data={results}
      renderItem={renderItem}
      keyExtractor={(item) => item.id.toString()}
      className="bg-background"
    />
  )
}

export default SearchResults

