
import { Card, CardContent } from "~/components/ui/card"
import { Image, View, Dimensions } from "react-native"

const BannerSection = () => {
  const windowWidth = Dimensions.get("window").width
  const aspectRatio = 1807 / 2000 // Dựa trên kích thước gốc của hình ảnh

  return (
    <View className="flex flex-col space-y-4 p-4">
      {/* Banner Valentine */}
      <Card className="overflow-hidden rounded-2xl">
        <CardContent className="p-0">
          <Image
            source={{
              uri: "https://famvibe.com/cdn/shop/files/banner_1_310d8bb5-a84a-4173-8a4f-83cabdef6501_2000x1757.jpg?v=1738571935",
            }}
            style={{
              width: windowWidth - 32, // Chiều rộng đầy đủ trừ đi padding
              height: (windowWidth - 32) * aspectRatio,
            }}
            resizeMode="cover"
          />
        </CardContent>
      </Card>

      {/* Easter Collection */}
      <Card className="overflow-hidden rounded-2xl">
        <CardContent className="p-0">
          <Image
            source={{
              uri: "https://famvibe.com/cdn/shop/files/banner_2_07613c96-1b4c-48ad-ad88-44fa3539e1ef_2000x1807.jpg?v=1738571996",
            }}
            style={{
              width: windowWidth - 32,
              height: (windowWidth - 32) * aspectRatio,
            }}
            resizeMode="cover"
          />
        </CardContent>
      </Card>

      {/* Gift For Kid */}
      <Card className="overflow-hidden rounded-2xl">
        <CardContent className="p-0">
          <Image
            source={{
              uri: "https://famvibe.com/cdn/shop/files/banner_3_e088746d-8630-4dc1-8a4f-0265a0533cf5_2000x1807.jpg?v=1738572052",
            }}
            style={{
              width: windowWidth - 32,
              height: (windowWidth - 32) * aspectRatio,
            }}
            resizeMode="cover"
          />
        </CardContent>
      </Card>
    </View>
  )
}

export default BannerSection

