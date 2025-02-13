// import type React from "react"
// import { useState } from "react"
// import { View, Text, TouchableOpacity, ScrollView } from "react-native"
// import { ChevronDown, ChevronRight } from "lucide-react-native"
// import { Checkbox } from "~/components/ui/checkbox"

// export interface FilterState {
//   giftFor: string[]
//   productType: string[]
//   occasions: string[]
//   colors: string[]
//   priceRanges: string[]
// }

// interface FilterSidebarProps {
//   onFilterChange: (filters: FilterState) => void
//   productCounts: {
//     giftFor: Record<string, number>
//     productType: Record<string, number>
//     occasions: Record<string, number>
//     colors: Record<string, number>
//     price: Record<string, number>
//   }
// }

// interface FilterSectionProps {
//   title: string
//   children: React.ReactNode
// }

// const FilterSection: React.FC<FilterSectionProps> = ({ title, children }) => {
//   const [isExpanded, setIsExpanded] = useState(true)

//   return (
//     <View className="mb-4">
//       <TouchableOpacity
//         className="flex-row items-center justify-between mb-2 p-2"
//         onPress={() => setIsExpanded(!isExpanded)}
//       >
//         <Text className="text-lg font-medium">{title}</Text>
//         {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
//       </TouchableOpacity>
//       {isExpanded && <View className="transition-all duration-300">{children}</View>}
//     </View>
//   )
// }

// const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange, productCounts }) => {
//   const [filters, setFilters] = useState<FilterState>({
//     giftFor: [],
//     productType: [],
//     occasions: [],
//     colors: [],
//     priceRanges: [],
//   })

//   const occasions = ["Valentine's day", "Wedding", "Mother's day", "Christmas", "Father's day", "Birthday"]
//   const giftFor = ["Granddaughter", "Grandson", "Friend", "Grandma", "Grandpa", "Dad", "Son", "Mom", "Dog", "Family"]
//   const productTypes = ["T Shirt", "Mug", "Pillow", "Poster", "Fridge Magnet", "3D T Shirts"]
//   const colors = ["black", "white", "navy", "pink", "purple", "lightblue"]

//   const handleFilterChange = (category: keyof FilterState, value: string) => {
//     setFilters((prev) => {
//       const newFilters = { ...prev }
//       if (newFilters[category].includes(value)) {
//         newFilters[category] = newFilters[category].filter((item) => item !== value)
//       } else {
//         newFilters[category] = [...newFilters[category], value]
//       }
//       return newFilters
//     })
//   }

//   return (
//     <View className="p-4 h-full overflow-y-auto">
//       <ScrollView className="space-y-6" showsVerticalScrollIndicator={true}>
//         <FilterSection title="Gift for">
//           <View className="flex flex-col gap-2">
//             {giftFor.map((item) => (
//               <View key={item} className="flex-row items-center space-x-2">
//                 <Checkbox
//                   checked={filters.giftFor.includes(item)}
//                   onCheckedChange={() => handleFilterChange("giftFor", item)}
//                 />
//                 <Text>
//                   {item} ({productCounts.giftFor[item] || 0})
//                 </Text>
//               </View>
//             ))}
//           </View>
//         </FilterSection>

//         <FilterSection title="Product Type">
//           <View className="flex flex-col gap-2">
//             {productTypes.map((type) => (
//               <View key={type} className="flex-row items-center space-x-2">
//                 <Checkbox
//                   checked={filters.productType.includes(type)}
//                   onCheckedChange={() => handleFilterChange("productType", type)}
//                 />
//                 <Text>
//                   {type} ({productCounts.productType[type] || 0})
//                 </Text>
//               </View>
//             ))}
//           </View>
//         </FilterSection>

//         <FilterSection title="Occasion">
//           <View className="flex flex-col gap-2">
//             {occasions.map((occasion) => (
//               <View key={occasion} className="flex-row items-center space-x-2">
//                 <Checkbox
//                   checked={filters.occasions.includes(occasion)}
//                   onCheckedChange={() => handleFilterChange("occasions", occasion)}
//                 />
//                 <Text>
//                   {occasion} ({productCounts.occasions[occasion] || 0})
//                 </Text>
//               </View>
//             ))}
//           </View>
//         </FilterSection>
//       </ScrollView>
//       <TouchableOpacity
//         className="mt-4 bg-red-500 text-white p-4 rounded"
//         onPress={() => {
//           onFilterChange(filters)
//         }}
//       >
//         <Text className="text-center">Apply Filters</Text>
//       </TouchableOpacity>
//     </View>
//   )
// }

// export default FilterSidebar
import type React from "react"
import { useState } from "react"
import { View, Text, TouchableOpacity, ScrollView } from "react-native"
import { ChevronDown, ChevronRight } from "lucide-react-native"
import { Checkbox } from "~/components/ui/checkbox"

export interface FilterState {
  giftFor: string[]
  productType: string[]
  occasions: string[]
  colors: string[]
  priceRanges: string[]
}

interface FilterSidebarProps {
  onFilterChange: (filters: FilterState) => void
  productCounts: {
    giftFor: Record<string, number>
    productType: Record<string, number>
    occasions: Record<string, number>
    colors: Record<string, number>
    price: Record<string, number>
  }
}

interface FilterSectionProps {
  title: string
  children: React.ReactNode
}

const occasions = ["Valentine's day", "Wedding", "Mother's day", "Christmas", "Father's day", "Birthday"]
const giftFor = ["Granddaughter", "Grandson", "Friend", "Grandma", "Grandpa", "Dad", "Son", "Mom", "Dog", "Family"]
const productTypes = ["T Shirt", "Mug", "Pillow", "Poster", "Fridge Magnet", "3D T Shirts"]
const colors = ["black", "white", "navy", "pink", "purple", "lightblue"]

const FilterSection: React.FC<FilterSectionProps> = ({ title, children }) => {
  const [isExpanded, setIsExpanded] = useState(true)

  return (
    <View className="mb-4">
      <TouchableOpacity
        className="flex-row items-center justify-between mb-2 p-2"
        onPress={() => setIsExpanded(!isExpanded)}
      >
        <Text className="text-lg font-medium">{title}</Text>
        {isExpanded ? <ChevronDown size={20} /> : <ChevronRight size={20} />}
      </TouchableOpacity>
      {isExpanded && <View className="transition-all duration-300">{children}</View>}
    </View>
  )
}

const FilterSidebar: React.FC<FilterSidebarProps> = ({ onFilterChange, productCounts }) => {
  const [filters, setFilters] = useState<FilterState>({
    giftFor: [],
    productType: [],
    occasions: [],
    colors: [],
    priceRanges: [],
  })

  const handleFilterChange = (category: keyof FilterState, value: string) => {
    setFilters((prev) => {
      const newFilters = { ...prev }
      if (newFilters[category].includes(value)) {
        newFilters[category] = newFilters[category].filter((item) => item !== value)
      } else {
        newFilters[category] = [...newFilters[category], value]
      }
      return newFilters
    })
  }

  return (
    <View className="p-4 h-full pb-12 overflow-y-auto">
      <ScrollView className="space-y-6" showsVerticalScrollIndicator={true}>
        <FilterSection title="Gift for">
          <View className="flex flex-col gap-2">
            {giftFor.map((item) => (
              <TouchableOpacity key={item} onPress={() => handleFilterChange("giftFor", item)} className="flex-row items-center space-x-2">
                <Checkbox checked={filters.giftFor.includes(item)} onCheckedChange={() => handleFilterChange("giftFor", item)} />
                <Text>
                  {item} ({productCounts.giftFor[item] || 0})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </FilterSection>

        <FilterSection title="Product Type">
          <View className="flex flex-col gap-2">
            {productTypes.map((type) => (
              <TouchableOpacity key={type} onPress={() => handleFilterChange("productType", type)} className="flex-row items-center space-x-2">
                <Checkbox checked={filters.productType.includes(type)} onCheckedChange={() => handleFilterChange("productType", type)} />
                <Text>
                  {type} ({productCounts.productType[type] || 0})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </FilterSection>

        <FilterSection title="Occasion">
          <View className="flex flex-col gap-2">
            {occasions.map((occasion) => (
              <TouchableOpacity key={occasion} onPress={() => handleFilterChange("occasions", occasion)} className="flex-row items-center space-x-2">
                <Checkbox checked={filters.occasions.includes(occasion)} onCheckedChange={() => handleFilterChange("occasions", occasion)} />
                <Text>
                  {occasion} ({productCounts.occasions[occasion] || 0})
                </Text>
              </TouchableOpacity>
            ))}
          </View>
        </FilterSection>

        <FilterSection title="Color">
          <View className="flex flex-wrap gap-2">
            {colors.map((color) => (
              <TouchableOpacity
                key={color}
                className={`w-8 h-8 rounded-full border border-gray-300`}
                style={{ backgroundColor: color }}
                onPress={() => handleFilterChange("colors", color)}
              />
            ))}
          </View>
        </FilterSection>

        <FilterSection title="Price">
          <View className="space-y-2">
            <TouchableOpacity onPress={() => handleFilterChange("priceRanges", "under25")} className="flex-row items-center space-x-2">
              <Checkbox checked={filters.priceRanges.includes("under25")} onCheckedChange={() => handleFilterChange("priceRanges", "under25")} />
              <Text>Under $25 ({productCounts.price.under25 || 0})</Text>
            </TouchableOpacity>
            <TouchableOpacity onPress={() => handleFilterChange("priceRanges", "above25")} className="flex-row items-center space-x-2">
              <Checkbox checked={filters.priceRanges.includes("above25")} onCheckedChange={() => handleFilterChange("priceRanges", "above25")} />
              <Text>Above $25 ({productCounts.price.above25 || 0})</Text>
            </TouchableOpacity>
          </View>
        </FilterSection>
      </ScrollView>
      <TouchableOpacity
        className="mt-4 bg-red-500 text-white p-4 rounded mb-4"
        onPress={() => {
          onFilterChange(filters)
        }}
      >
        <Text className="text-center">Apply Filters</Text>
      </TouchableOpacity>
    </View>
  )
}

export default FilterSidebar
