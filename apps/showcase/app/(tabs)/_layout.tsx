// import { Tabs } from "expo-router"
// import { View, SafeAreaView, Platform, StatusBar } from "react-native"
// import Header from "./components/header"
// import Footer from "./components/footer"

// export default function TabsLayout() {
//   return (
//     <SafeAreaView
//       style={{
//         flex: 1,
//         paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
//       }}
//     >
//       <View style={{ flex: 1 }}>
//         <Header />
//         <Tabs>
//           <Tabs.Screen
//             name="index"
//             options={{
//               title: "Home",
//             }}
//           />
//           {/* Add other tab screens here */}
//         </Tabs>
//         <Footer />
//       </View>
//     </SafeAreaView>
//   )
// }
import { Tabs } from "expo-router"
import { View, SafeAreaView, Platform, StatusBar } from "react-native"
import { useTheme } from "@react-navigation/native"
import Header from "./components/header"

export default function TabsLayout() {
  const theme = useTheme()

  return (
    <SafeAreaView
      style={{
        flex: 1,
        paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
        backgroundColor: theme.colors.background,
      }}
    >
      <View style={{ flex: 1 }}>
        <Header />
        <Tabs
          screenOptions={{
            headerShown: false,
            tabBarStyle: { display: "none" },
          }}
        >
          <Tabs.Screen
            name="index"
            options={{
              title: "Home",
            }}
          />
        </Tabs>
      </View>
    </SafeAreaView>
  )
}

