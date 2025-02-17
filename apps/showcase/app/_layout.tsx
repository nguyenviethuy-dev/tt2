

import { BottomSheetModalProvider } from "@gorhom/bottom-sheet"
import { type Theme, ThemeProvider, DefaultTheme, DarkTheme } from "@react-navigation/native"
import { PortalHost } from "@rn-primitives/portal"
import { DeprecatedUi } from "@rnr/reusables"
import { Stack } from "expo-router"
import { StatusBar } from "expo-status-bar"
import * as React from "react"
import { Platform, Text } from "react-native"
import { GestureHandlerRootView } from "react-native-gesture-handler"
import { ThemeToggle } from "~/components/ThemeToggle"
import { CartProvider } from "./cart/Contexts/cart-context"
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

function useThemeInitialization() {
  const { colorScheme, isDarkColorScheme } = useColorScheme()
  const [isReady, setIsReady] = React.useState(false)

  React.useEffect(() => {
    const initializeTheme = async () => {
      try {
        if (Platform.OS === "web") {
          document?.documentElement?.classList?.add("bg-background")
        } else if (Platform.OS === "android") {
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
                  <Text className="text-xl font-semibold">{formatScreenTitle(props.children)}</Text>
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
              <Stack.Screen name="productDetail" options={{ title: "Product Detail" }} />
              <Stack.Screen
                name="cart"
                options={{
                  title: "Shopping Cart",
                }}
              />
              <Stack.Screen
                name="cart/Checkout"
                options={{
                  title: "Checkout",
                  presentation: "modal",
                }}
              />
              <Stack.Screen
                name="cart/OrderReceipt"
                options={{
                  title: "Order Receipt",
                  presentation: "modal",
                  headerBackVisible: false,
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

function formatScreenTitle(name: string): string {
  return name
    .split("-")
    .map((str: string) => str.replace(/\b\w/g, (char) => char.toUpperCase()))
    .join(" ")
}

