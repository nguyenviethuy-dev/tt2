

// "use client"

// import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
// import { type Theme, ThemeProvider, DefaultTheme, DarkTheme } from "@react-navigation/native"
// import { PortalHost } from "@rn-primitives/portal"
// import { DeprecatedUi } from "@rnr/reusables"
// import { Stack } from "expo-router"
// import { StatusBar } from "expo-status-bar"
// import * as React from "react"
// import { Platform } from "react-native"
// import { GestureHandlerRootView } from "react-native-gesture-handler"
// import { ThemeToggle } from "~/components/ThemeToggle"
// import { Text } from "~/components/ui/text"
// import { setAndroidNavigationBar } from "~/lib/android-navigation-bar"
// import { NAV_THEME } from "~/lib/constants"
// import { useColorScheme } from "~/lib/useColorScheme"

// const { ToastProvider } = DeprecatedUi

// const LIGHT_THEME: Theme = {
//   ...DefaultTheme,
//   colors: NAV_THEME.light,
// }
// const DARK_THEME: Theme = {
//   ...DarkTheme,
//   colors: NAV_THEME.dark,
// }

// export {
//   // Catch any errors thrown by the Layout component.
//   ErrorBoundary,
// } from "expo-router"

// export const unstable_settings = {
//   // Ensure that reloading on `/modal` keeps a back button present.
//   initialRouteName: "(tabs)",
// }

// export default function RootLayout() {
//   const hasMounted = React.useRef(false)
//   const { colorScheme, isDarkColorScheme } = useColorScheme()
//   const [isColorSchemeLoaded, setIsColorSchemeLoaded] = React.useState(false)

//   useIsomorphicLayoutEffect(() => {
//     if (hasMounted.current) {
//       return
//     }

//     if (Platform.OS === "web") {
//       // Adds the background color to the html element to prevent white background on overscroll.
//       document.documentElement.classList.add("bg-background")
//     }
//     setAndroidNavigationBar(colorScheme)
//     setIsColorSchemeLoaded(true)
//     hasMounted.current = true
//   }, [])

//   if (!isColorSchemeLoaded) {
//     return null
//   }

//   return (
//     <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
//       <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
//       <GestureHandlerRootView style={{ flex: 1 }}>
//         <BottomSheetModalProvider>
//           <Stack
//             initialRouteName="(tabs)"
//             screenOptions={{
//               headerBackTitle: "Back",
//               headerTitle(props) {
//                 return <Text className="text-xl font-semibold">{toOptions(props.children)}</Text>
//               },
//               headerRight: () => <ThemeToggle />,
//             }}
//           >
//             <Stack.Screen
//               name="(tabs)"
//               options={{
//                 headerShown: false,
//               }}
//             />
//             <Stack.Screen
//               name="productPage"
//               options={{
//                 title: "New Arrivals",
//               }}
//             />
//             <Stack.Screen
//               name="cart"
//               options={{
//                 title: "Shopping Cart",
//               }}
//             />
//           </Stack>
//         </BottomSheetModalProvider>
//         <PortalHost />
//       </GestureHandlerRootView>
//       <ToastProvider />
//     </ThemeProvider>
//   )
// }

// const useIsomorphicLayoutEffect =
//   Platform.OS === "web" && typeof window === "undefined" ? React.useEffect : React.useLayoutEffect

// function toOptions(name: string) {
//   const title = name
//     .split("-")
//     .map((str: string) => str.replace(/\b\w/g, (char) => char.toUpperCase()))
//     .join(" ")
//   return title
// }

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { type Theme, ThemeProvider, DefaultTheme, DarkTheme } from "@react-navigation/native"
import { PortalHost } from "@rn-primitives/portal"
import { DeprecatedUi } from "@rnr/reusables"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import * as React from "react"
import { Platform } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { ThemeToggle } from "~/components/ThemeToggle"
import { CartProvider } from "./cart/Contexts/cart-context"
import { Text } from "~/components/ui/text"
import { setAndroidNavigationBar } from "~/lib/android-navigation-bar"
import { NAV_THEME } from "~/lib/constants"
import { useColorScheme } from "~/lib/useColorScheme"

const { ToastProvider } = DeprecatedUi

const LIGHT_THEME: Theme = {
  ...DefaultTheme,
  colors: NAV_THEME.light,
}

const DARK_THEME: Theme = {
  ...DarkTheme,
  colors: NAV_THEME.dark,
}

export { ErrorBoundary } from "expo-router"

export const unstable_settings = {
  initialRouteName: "(tabs)",
}

// Custom hook để xử lý khởi tạo theme và các side effects
function useThemeInitialization() {
  const { colorScheme, isDarkColorScheme } = useColorScheme()
  const [isReady, setIsReady] = React.useState(false)

  React.useEffect(() => {
    const initializeTheme = async () => {
      try {
        // Xử lý cho web
        if (Platform.OS === "web") {
          document?.documentElement?.classList?.add("bg-background")
        } 
        // Xử lý cho Android
        else if (Platform.OS === "android") {
          await setAndroidNavigationBar(colorScheme)
        }
      } catch (error) {
        console.error("Theme initialization error:", error)
      } finally {
        setIsReady(true)
      }
    }

    initializeTheme()
  }, [colorScheme])

  return {
    isReady,
    isDarkColorScheme,
    colorScheme,
  }
}

export default function RootLayout() {
  const { isReady, isDarkColorScheme } = useThemeInitialization()

  if (!isReady) {
    return null
  }

  return (
    <CartProvider>
      <ThemeProvider value={isDarkColorScheme ? DARK_THEME : LIGHT_THEME}>
        <StatusBar style={isDarkColorScheme ? "light" : "dark"} />
        <GestureHandlerRootView style={{ flex: 1 }}>
          <BottomSheetModalProvider>
            <Stack
              initialRouteName="(tabs)"
              screenOptions={{
                headerBackTitle: "Back",
                headerTitle: (props) => (
                  <Text className="text-xl font-semibold">
                    {formatScreenTitle(props.children)}
                  </Text>
                ),
                headerRight: () => <ThemeToggle />,
              }}
            >
              <Stack.Screen
                name="(tabs)"
                options={{
                  headerShown: false,
                }}
              />
              <Stack.Screen
                name="productPage"
                options={{
                  title: "New Arrivals",
                }}
              />
              <Stack.Screen
                name="cart"
                options={{
                  title: "Shopping Cart",
                }}
              />
            </Stack>
          </BottomSheetModalProvider>
          <PortalHost />
        </GestureHandlerRootView>
        <ToastProvider />
      </ThemeProvider>
    </CartProvider>
  )
}


// Helper function để format tiêu đề màn hình
function formatScreenTitle(name: string): string {
  return name
    .split("-")
    .map((str: string) => str.replace(/\b\w/g, (char) => char.toUpperCase()))
    .join(" ")
}