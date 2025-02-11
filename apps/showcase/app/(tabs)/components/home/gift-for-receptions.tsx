import { View, Text, Image, ScrollView } from "react-native"
import { Button } from "~/components/ui/button"

const giftSections = [
  {
    title: "Grandkids",
    description:
      "Embracing the boundless joy of grandparent-grandchild relationships, our gift collection is designed to celebrate the special bond you share with your beloved grandkids",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7idhFXUPclg1CANYmnsES2STe5Au2R55eEw&s",
    color: "#FFE4E1",
  },
  {
    title: "Grandparents",
    description:
      "Grandparents are the pillars of our family, and in celebration of their love and wisdom, we present our special gift collection",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ_En9UHRIVdfNDO-95UbIpt1yjH7_wPmStA&s",
    color: "#FFF8DC",
  },
  {
    title: "Friends",
    description:
      "Friends are the family we choose. Explore our curated gift collection to show your appreciation for those who bring joy and laughter to your life",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMVdt_n1c4i5uEbAdF-lrMub71itIpLW-mnA&s",
    color: "#E0FFE0",
  },
  {
    title: "Family",
    description:
      "Celebrate family love and togetherness with our curated collection of thoughtful gifts, fostering joy and creating lasting memories. Perfect for any occasion!",
    image: "https://gddt.edu.vn/media/6/2023/09/thuyet-trinh-tieng-anh-voi-chu-de-my-family.jpg",
    color: "#E0F0FF",
  },
]

export default function GiftForReceptions() {
  return (
    <View className="px-4 py-8">
      <Text className="text-3xl font-bold mb-8">Gift For Receptions</Text>

      <ScrollView horizontal showsHorizontalScrollIndicator={false}>
        <View className="flex-row space-x-4">
          {giftSections.map((section, index) => (
            <View
              key={index}
              style={{ backgroundColor: section.color }}
              className="rounded-xl p-6 relative overflow-hidden w-80"
            >
              <View className="max-w-[60%]">
                <Text className="text-2xl font-bold mb-3">{section.title}</Text>
                <Text className="text-gray-600 mb-4">{section.description}</Text>
                <Button variant="secondary" className="bg-white">
                  <Text className="text-black">Shop Now</Text>
                </Button>
              </View>
              <Image
                source={{ uri: section.image }}
                style={{ width: 120, height: 120 }}
                className="absolute right-4 bottom-4"
              />
            </View>
          ))}
        </View>
      </ScrollView>
    </View>
  )
}

