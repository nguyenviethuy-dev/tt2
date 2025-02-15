// AuthModal.tsx
import { useState } from "react"
import { View, Text, Image, TouchableOpacity, Modal, ScrollView, Platform } from "react-native"
import { X } from "lucide-react-native"
import { Button } from "~/components/ui/button"
import { Input } from "~/components/ui/input"

interface AuthModalProps {
  isOpen: boolean
  onClose: () => void
}

export function AuthModal({ isOpen, onClose }: AuthModalProps) {
  const [isLogin, setIsLogin] = useState(true)
  const [isForgotPassword, setIsForgotPassword] = useState(false)

  return (
    <Modal
      visible={isOpen}
      animationType="fade"
      transparent={true}
      onRequestClose={onClose}
    >
      <View className="flex-1 bg-black/50">
        <ScrollView contentContainerClassName="flex-grow justify-center p-4">
          <View className="bg-white rounded-lg w-full max-w-[800px] shadow-2xl">
            {/* Close Button */}
            <TouchableOpacity 
              onPress={onClose}
              className="absolute right-4 top-4 z-10"
            >
              <X size={24} color="#6B7280" />
            </TouchableOpacity>

            {/* Logo Section */}
            <View className="p-8 bg-rose-600 rounded-t-lg items-center justify-center">
            {Platform.OS === "web" ? (
              <Image
                source={{ uri: "https://famvibe.com/cdn/shop/t/358/assets/LOGO-allwhite-Rebranding.svg" }}
                className="h-24 w-48 mb-20"
                resizeMode="contain"
              />
            ) : (
              <Text style={{ fontSize: 32, fontWeight: "bold", color: "#fff", marginBottom: 80 }}>FamVibe</Text>
            )}
          </View>

            {/* Form Section */}
            <View className="p-4">
              {!isForgotPassword ? (
                <>
                  {/* Tabs */}
                  <View className="flex-row mb-8">
                    <TouchableOpacity
                      className={`pb-2 px-4 ${isLogin ? "border-b-2 border-rose-600" : ""}`}
                      onPress={() => setIsLogin(true)}
                    >
                      <Text className={`text-lg font-medium ${isLogin ? "text-rose-600" : "text-gray-400"}`}>
                        Login
                      </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                      className={`pb-2 px-4 ${!isLogin ? "border-b-2 border-rose-600" : ""}`}
                      onPress={() => setIsLogin(false)}
                    >
                      <Text className={`text-lg font-medium ${!isLogin ? "text-rose-600" : "text-gray-400"}`}>
                        Signup
                      </Text>
                    </TouchableOpacity>
                  </View>

                  {/* Form */}
                  <View className="space-y-4">
                    {!isLogin && (
                      <>
                        <Input placeholder="First Name" className="w-full py-3 px-2 rounded-lg border border-gray-300" />
                        <Input placeholder="Last Name" className="w-full py-3 px-2 rounded-lg border border-gray-300" />
                      </>
                    )}
                    <Input
                      keyboardType="email-address"
                      placeholder="Email"
                      className="w-full py-3 px-2 rounded-lg border border-gray-300"
                    />
                    <Input
                      secureTextEntry
                      placeholder="Password"
                      className="w-full py-3 px-2 rounded-lg border border-gray-300"
                    />

                    {/* Forgot Password */}
                    {isLogin && (
                      <TouchableOpacity 
                        onPress={() => setIsForgotPassword(true)}
                        className="items-end"
                      >
                        <Text className="text-sm text-gray-600">
                          Forgot your password?
                        </Text>
                      </TouchableOpacity>
                    )}

                    {/* Submit Button */}
                    <Button 
                      variant="default"
                      className="w-full bg-rose-600 py-6"
                      onPress={() => console.log("Login/Signup")}
                    >
                      <Text className="text-white text-base font-medium">
                        {isLogin ? "Log In Now" : "Sign Up"}
                      </Text>
                    </Button>
                  </View>
                </>
              ) : (
                <>
                  <Text className="text-xl font-semibold mb-2">Reset Password</Text>
                  <Text className="text-sm text-gray-600 mb-4">
                    We will send you an email to reset your password.
                  </Text>
                  <Input 
                    keyboardType="email-address"
                    placeholder="Email" 
                    className="w-full rounded-lg border-gray-300 mb-4" 
                  />
                  <Button 
                    variant="default"
                    className="w-full bg-rose-600 py-6"
                    onPress={() => console.log("Reset password")}
                  >
                    <Text className="text-white text-base font-medium">Submit</Text>
                  </Button>
                  <TouchableOpacity 
                    onPress={() => setIsForgotPassword(false)}
                    className="mt-2"
                  >
                    <Text className="text-center text-sm text-gray-600">or Cancel</Text>
                  </TouchableOpacity>
                </>
              )}

              {/* Social Login */}
              <View className="mt-6">
                <View className="relative py-2">
                  <View className="absolute inset-0 items-center justify-center">
                    <View className="w-full h-[1px] bg-gray-300" />
                  </View>
                  <View className="relative items-center">
                    <View className="bg-white px-2">
                      <Text className="text-gray-500">Or log in with</Text>
                    </View>
                  </View>
                </View>

                <View className="mt-6 space-y-4">
                  <TouchableOpacity 
                    className="flex-row items-center justify-center p-3 rounded-lg border border-gray-300 bg-white"
                    onPress={() => console.log("Google login")}
                  >
                    <Image 
                      source={{ uri: "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c1/Google_%22G%22_logo.svg/768px-Google_%22G%22_logo.svg.png" }}
                      className="h-5 w-5 mr-2"
                    />
                    <Text className="text-sm font-medium text-gray-700">Sign in with Google</Text>
                  </TouchableOpacity>
                  
                  <TouchableOpacity 
                    className="flex-row items-center justify-center p-3 rounded-lg bg-[#1877F2]"
                    onPress={() => console.log("Facebook login")}
                  >
                    <Image 
                      source={{ uri: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcRjy-THa1zblXUzAkFaAPo1rdSGlcZAC2jbBg&s" }}
                      className="h-5 w-5 mr-2 rounded-md"
                    />
                    <Text className="text-sm font-medium text-white">Sign in with Facebook</Text>
                  </TouchableOpacity>
                </View>
              </View>
            </View>
          </View>
        </ScrollView>
      </View>
    </Modal>
  )
}