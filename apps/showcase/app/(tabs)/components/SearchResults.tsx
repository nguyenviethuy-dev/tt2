import type React from "react"
import { View, Text, Image, TouchableOpacity, ScrollView } from "react-native"
import type { TrendingUp, Sparkles } from "lucide-react-native"
import type { Product } from "~/app/product-scr/data/type/product"

interface SearchResultsProps {
  results: (Product & { icon?: typeof TrendingUp | typeof Sparkles })[]
  onSelectProduct: (productId: number) => void
  isDefaultSuggestion: boolean
  isDarkColorScheme: boolean
}

const SearchResults: React.FC<SearchResultsProps> = ({
  results,
  onSelectProduct,
  isDefaultSuggestion,
  isDarkColorScheme,
}) => {
  const textColor = isDarkColorScheme ? "#fff" : "#000"
  const backgroundColor = isDarkColorScheme ? "#1a1a1a" : "#fff"
  const borderColor = isDarkColorScheme ? "#333" : "#ccc"

  const renderItem = (item: Product & { icon?: typeof TrendingUp | typeof Sparkles }) => (
    <TouchableOpacity
      key={item.id.toString()}
      style={{
        flexDirection: "row",
        alignItems: "center",
        padding: 12,
        borderBottomWidth: 1,
        borderBottomColor: borderColor,
        backgroundColor: backgroundColor,
      }}
      onPress={() => onSelectProduct(item.id)}
    >
      {isDefaultSuggestion ? (
        <>
          {item.icon && <item.icon size={20} color={isDarkColorScheme ? "#888" : "#666"} style={{ marginRight: 12 }} />}
          <Text style={{ flex: 1, fontSize: 16, color: textColor }}>{item.name}</Text>
        </>
      ) : (
        <>
          <Image
            source={{ uri: item.image }}
            style={{ width: 50, height: 50, borderRadius: 25, marginRight: 12 }}
            resizeMode="cover"
          />
          <View style={{ flex: 1 }}>
            <Text style={{ fontSize: 16, fontWeight: "bold", color: textColor }}>{item.name}</Text>
            <Text style={{ color: isDarkColorScheme ? "#888" : "#666" }}>${item.price.toFixed(2)}</Text>
          </View>
        </>
      )}
    </TouchableOpacity>
  )

  return <ScrollView style={{ backgroundColor: backgroundColor }}>{results.map(renderItem)}</ScrollView>
}

export default SearchResults

