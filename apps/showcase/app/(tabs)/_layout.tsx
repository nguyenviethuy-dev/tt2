// import { Tabs } from "expo-router"
// import { View, SafeAreaView, Platform, StatusBar } from "react-native"
// import { useTheme } from "@react-navigation/native"
// import Header from "./components/header"

// export default function TabsLayout() {
//   const theme = useTheme()

//   return (
    
//     <SafeAreaView
//       style={{
//         flex: 1,
//         paddingTop: Platform.OS === "android" ? StatusBar.currentHeight : 0,
//         backgroundColor: theme.colors.background,
//       }}
//     >
//       <View style={{ flex: 1 }}>
//         <Header />
//         <Tabs
//           screenOptions={{
//             headerShown: false,
//             tabBarStyle: { display: "none" },
//           }}
//         >
//           <Tabs.Screen
//             name="index"
//             options={{
//               title: "Home",
//             }}
//           />
//           <Tabs.Screen
//             name="productPage"
//             options={{
//               title: "Products",
//             }}
//           />

//           <Tabs.Screen
//               name="[id]"
//               options={{
//                 title: "Product Detail",
//               }}
//             />
//         </Tabs>
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
          <Tabs.Screen
            name="productPage"
            options={{
              title: "Products",
            }}
          />
          <Tabs.Screen name="productDetail" options={{ title: "Product Detail" }} />
          <Tabs.Screen name="cart"
              options={{
                title: "Shopping Cart",
              }} />
        </Tabs>
      </View>
    </SafeAreaView>
  )
}