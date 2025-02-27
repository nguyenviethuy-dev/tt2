

import { ScrollView } from "react-native"
import { useTheme } from "@react-navigation/native"
import BannerSection from "../home/banner"
import ProductsSection from "../home/products"
import ProductsTrending from "../home/products-trending"
import ProductsNewArrivals from "../home/products-new-arrivals"
import GiftForReceptions from "../home/gift-for-receptions"
import VideoTutorial from "../home/video-tutorial"
import CustomerReviews from "../review/customer-reviews"
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


