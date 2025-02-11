// // 

// import { ScrollView } from "react-native"
// import BannerSection from "./components/home/banner"
// import ProductsSection from "./components/home/products"
// import ProductsTrending from "./components/home/products-trending"
// import ProductsNewArrivals from "./components/home/products-new-arrivals"
// import GiftForReceptions from "./components/home/gift-for-receptions"
// import VideoTutorial from "./components/home/video-tutorial"
// import CustomerReviews from "./components/home/customer-reviews"

// export default function Homepage() {
//   return (
//     <ScrollView className="flex-1 bg-background">
//       <BannerSection />
//       <ProductsSection />
//       <ProductsTrending />
//       <ProductsNewArrivals />
//       <GiftForReceptions />
//       <VideoTutorial />
//       <CustomerReviews />
//     </ScrollView>
//   )
// }

import { ScrollView } from "react-native"
import { useTheme } from "@react-navigation/native"
import BannerSection from "./components/home/banner"
import ProductsSection from "./components/home/products"
import ProductsTrending from "./components/home/products-trending"
import ProductsNewArrivals from "./components/home/products-new-arrivals"
import GiftForReceptions from "./components/home/gift-for-receptions"
import VideoTutorial from "./components/home/video-tutorial"
import CustomerReviews from "./components/home/customer-reviews"
import Footer from "./components/footer"

export default function Homepage() {
  const theme = useTheme()

  return (
    <ScrollView
      style={{
        flex: 1,
        backgroundColor: theme.colors.background,
      }}
      contentContainerStyle={{
        flexGrow: 1,
      }}
    >
      <BannerSection />
      <ProductsSection />
      <ProductsTrending />
      <ProductsNewArrivals />
      <GiftForReceptions />
      <VideoTutorial />
      <CustomerReviews />
      <Footer />
    </ScrollView>
  )
}


