"use client"

import { useState } from "react"
import { View, Text, TouchableOpacity, ScrollView, Image, Platform } from "react-native"
import { Input } from "~/components/ui/input"
import { Button } from "~/components/ui/button"
import { Facebook, Twitter, ChevronDown } from "lucide-react-native"

export default function Footer() {
  const [isOpen, setIsOpen] = useState(false)
  const [currency, setCurrency] = useState("USD")
  const currencies = [
    { code: "USD", flag: "https://upload.wikimedia.org/wikipedia/commons/a/a4/Flag_of_the_United_States.svg" },
    { code: "EUR", flag: "https://upload.wikimedia.org/wikipedia/commons/b/b7/Flag_of_Europe.svg" },
    { code: "VND", flag: "https://upload.wikimedia.org/wikipedia/commons/2/21/Flag_of_Vietnam.svg" },
  ]

  return (
    <View className="bg-black">
      <ScrollView
        className="pb-16"
        contentContainerStyle={{
          paddingBottom: Platform.OS === "ios" ? 20 : 16,
        }}
      >
        <View className="px-4 py-6">
          {/* Newsletter Section */}
          <View className="items-center mb-6">
            <Text className="text-xl font-bold text-white mb-2 text-center">Unlock 10% OFF Your First Order!</Text>
            <Text className="text-gray-300 mb-4 text-center px-4">
              As soon as you join, we'll send you a sweet 10% OFF deal for your first order.
            </Text>
            <View className="w-full space-y-3 px-4">
              <Input placeholder="First Name" className="bg-white text-black rounded-lg px-4 py-2.5 w-full" />
              <Input
                placeholder="Enter your email address..."
                className="bg-white text-black rounded-lg px-4 py-2.5 w-full"
              />
              <Button className="w-full bg-red-500 text-white font-bold py-2.5 rounded-lg">
                <Text className="text-white font-bold uppercase">Unlock Your 10% OFF NOW</Text>
              </Button>
            </View>
          </View>

          {/* Footer Grid - Simplified for mobile */}
          <View className="border-t border-gray-800 pt-4 space-y-4">
            {/* Company Section */}
            <View>
              <Text className="text-lg font-semibold text-white mb-2">COMPANY</Text>
              <View className="space-y-2">
                <TouchableOpacity>
                  <Text className="text-gray-300">About us</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text className="text-gray-300">Happy Customer</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text className="text-gray-300">Privacy Policy</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text className="text-gray-300">Terms of Service</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Help Section */}
            <View>
              <Text className="text-lg font-semibold text-white mb-2">HELP</Text>
              <View className="space-y-2">
                <TouchableOpacity>
                  <Text className="text-gray-300">Contact us</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text className="text-gray-300">Shipping Information</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text className="text-gray-300">Return & Refund</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text className="text-gray-300">Track Your Order</Text>
                </TouchableOpacity>
                <TouchableOpacity>
                  <Text className="text-gray-300">Help Center</Text>
                </TouchableOpacity>
              </View>
            </View>

            {/* Address Section */}
            <View>
              <Text className="text-lg font-semibold text-white mb-2">FAMVIBE</Text>
              <Text className="text-gray-300">US Warehouse</Text>
              <Text className="text-gray-300 mb-1">14801 Able Ln, Ste 102 Huntington Beach, CA 92647</Text>
              <Text className="text-gray-300 mb-3">(Storage point)</Text>

              {/* Currency and Social */}
              <View className="flex-row items-center space-x-4">
                <TouchableOpacity
                  onPress={() => setIsOpen(!isOpen)}
                  className="flex-row items-center bg-white rounded-lg px-3 py-2"
                >
                  <Image
                    source={{ uri: currencies.find((c) => c.code === currency)?.flag }}
                    style={{ width: 20, height: 14, marginRight: 8 }}
                    resizeMode="contain"
                  />
                  <Text className="text-black mr-2">{currency}</Text>
                  <ChevronDown size={16} color="#000" />
                </TouchableOpacity>

                <View className="flex-row space-x-4">
                  <TouchableOpacity>
                    <Facebook size={24} color="#fff" />
                  </TouchableOpacity>
                  <TouchableOpacity>
                    <Twitter size={24} color="#fff" />
                  </TouchableOpacity>
                </View>
              </View>

              {isOpen && (
                <View className="absolute left-0 top-12 w-28 bg-white rounded-lg shadow-lg">
                  {currencies.map((item) => (
                    <TouchableOpacity
                      key={item.code}
                      onPress={() => {
                        setCurrency(item.code)
                        setIsOpen(false)
                      }}
                      className="flex-row items-center p-2"
                    >
                      <Image
                        source={{ uri: item.flag }}
                        style={{ width: 20, height: 14, marginRight: 8 }}
                        resizeMode="contain"
                      />
                      <Text className="text-black">{item.code}</Text>
                    </TouchableOpacity>
                  ))}
                </View>
              )}
            </View>
          </View>
        </View>
      </ScrollView>

      {/* Copyright Section */}
      <View className="bg-red-700 py-3">
        <Text className="text-white text-center text-sm">© 2023 Famvibe Store. Powered by Shopify</Text>
      </View>
    </View>
  )
}

