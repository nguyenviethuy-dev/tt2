// import { View, Text, Image, ScrollView, useWindowDimensions } from "react-native";
// import { Button } from "~/components/ui/button";

// const giftSections = [
//   {
//     title: "Grandkids",
//     description:
//       "Embracing the boundless joy of grandparent-grandchild relationships, our gift collection is designed to celebrate the special bond you share with your beloved grandkids",
//     image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7idhFXUPclg1CANYmnsES2STe5Au2R55eEw&s",
//     color: "#FFE4E1",
//   },
//   {
//     title: "Grandparents",
//     description:
//       "Grandparents are the pillars of our family, and in celebration of their love and wisdom, we present our special gift collection",
//     image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ_En9UHRIVdfNDO-95UbIpt1yjH7_wPmStA&s",
//     color: "#FFF8DC",
//   },
//   {
//     title: "Friends",
//     description:
//       "Friends are the family we choose. Explore our curated gift collection to show your appreciation for those who bring joy and laughter to your life",
//     image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMVdt_n1c4i5uEbAdF-lrMub71itIpLW-mnA&s",
//     color: "#E0FFE0",
//   },
//   {
//     title: "Family",
//     description:
//       "Celebrate family love and togetherness with our curated collection of thoughtful gifts, fostering joy and creating lasting memories. Perfect for any occasion!",
//     image: "https://gddt.edu.vn/media/6/2023/09/thuyet-trinh-tieng-anh-voi-chu-de-my-family.jpg",
//     color: "#E0F0FF",
//   },
// ];

// export default function GiftForReceptions() {
//   const { width } = useWindowDimensions();
//   const isLargeScreen = width >= 1024;

//   return (
//     <View style={{ paddingHorizontal: isLargeScreen ? 32 : 16, paddingVertical: 32 }}>
//       <Text style={{ fontSize: 24, fontWeight: "bold", marginBottom: 32 }}>Gift For Receptions</Text>

//       <ScrollView horizontal showsHorizontalScrollIndicator={false}>
//         <View style={{ flexDirection: "row", justifyContent: isLargeScreen ? "space-between" : "flex-start", flexWrap: isLargeScreen ? "wrap" : "nowrap" }}>
//           {giftSections.map((section, index) => (
//             <View
//               key={index}
//               style={{
//                 backgroundColor: section.color,
//                 borderRadius: 12,
//                 padding: 24,
//                 position: "relative",
//                 overflow: "hidden",
//                 width: isLargeScreen ? "45%" : 320,
//                 marginBottom: isLargeScreen ? 24 : 0,
//                 marginRight: isLargeScreen ? 0 : 16,
//               }}
//             >
//               <View style={{ maxWidth: "60%" }}>
//                 <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>{section.title}</Text>
//                 <Text style={{ color: "#666", marginBottom: 16 }}>{section.description}</Text>
//                 <Button variant="secondary" style={{ backgroundColor: "white" }}>
//                   <Text style={{ color: "black" }}>Shop Now</Text>
//                 </Button>
//               </View>
//               <Image
//                 source={{ uri: section.image }}
//                 style={{ width: 120, height: 120, position: "absolute", right: 16, bottom: 16 }}
//               />
//             </View>
//           ))}
//         </View>
//       </ScrollView>
//     </View>
//   );
// }
import { View, Text, Image, ScrollView, useWindowDimensions } from "react-native";
import { Button } from "~/components/ui/button";

const giftSections = [
  {
    title: "Grandkids",
    description: "Embracing the boundless joy of grandparent-grandchild relationships, our gift collection is designed to celebrate the special bond you share with your beloved grandkids.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcS7idhFXUPclg1CANYmnsES2STe5Au2R55eEw&s",
    color: "#FFE4E1",
  },
  {
    title: "Grandparents",
    description: "Grandparents are the pillars of our family, and in celebration of their love and wisdom, we present our special gift collection.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcQQ_En9UHRIVdfNDO-95UbIpt1yjH7_wPmStA&s",
    color: "#FFF8DC",
  },
  {
    title: "Friends",
    description: "Friends are the family we choose. Explore our curated gift collection to show your appreciation for those who bring joy and laughter to your life.",
    image: "https://encrypted-tbn0.gstatic.com/images?q=tbn:ANd9GcTMVdt_n1c4i5uEbAdF-lrMub71itIpLW-mnA&s",
    color: "#E0FFE0",
  },
  {
    title: "Family",
    description: "Celebrate family love and togetherness with our curated collection of thoughtful gifts, fostering joy and creating lasting memories. Perfect for any occasion!",
    image: "https://gddt.edu.vn/media/6/2023/09/thuyet-trinh-tieng-anh-voi-chu-de-my-family.jpg",
    color: "#E0F0FF",
  },
];

export default function GiftForReceptions() {
  const { width } = useWindowDimensions();
  const isMobile = width < 768;
  const isTablet = width >= 768 && width < 1024;
  const isLargeScreen = width >= 1024;

  return (
    <View style={{ paddingHorizontal: isLargeScreen ? 48 : 16, paddingVertical: 32 }}>
      <Text style={{ fontSize: 28, fontWeight: "bold", textAlign: "center", marginBottom: 32 }}>
        Gift For Receptions
      </Text>

      {isMobile ? (
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          <View style={{ flexDirection: "row" }}>
            {giftSections.map((section, index) => (
              <View
                key={index}
                style={{
                  backgroundColor: section.color,
                  borderRadius: 12,
                  padding: 24,
                  width: 300,
                  marginRight: 16,
                  flexDirection: "row", // Hiển thị nội dung và hình ảnh theo chiều ngang
                  alignItems: "center",
                  justifyContent: "space-between",
                }}
              >
                <View style={{ flex: 1 }}>
                  <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>{section.title}</Text>
                  <Text style={{ color: "#666", marginBottom: 16 }}>{section.description}</Text>
                  <Button variant="secondary" style={{ backgroundColor: "white" }}>
                    <Text style={{ color: "black" }}>Shop Now</Text>
                  </Button>
                </View>
                <Image
                  source={{ uri: section.image }}
                  style={{
                    width: 100,
                    height: 100,
                    resizeMode: "contain",
                  }}
                />
              </View>
            ))}
          </View>
        </ScrollView>
      ) : (
        <View
          style={{
            flexDirection: "row",
            flexWrap: "wrap",
            justifyContent: isLargeScreen ? "space-between" : "center",
          }}
        >
          {giftSections.map((section, index) => (
            <View
              key={index}
              style={{
                backgroundColor: section.color,
                borderRadius: 12,
                padding: 24,
                width: isLargeScreen ? "45%" : isTablet ? "48%" : "90%",
                marginBottom: 24,
                flexDirection: "row",
                alignItems: "center",
                justifyContent: "space-between",
              }}
            >
              <View style={{ flex: 1 }}>
                <Text style={{ fontSize: 20, fontWeight: "bold", marginBottom: 12 }}>{section.title}</Text>
                <Text style={{ color: "#666", marginBottom: 16 }}>{section.description}</Text>
                <Button variant="secondary" style={{ backgroundColor: "white" }}>
                  <Text style={{ color: "black" }}>Shop Now</Text>
                </Button>
              </View>
              <Image
                source={{ uri: section.image }}
                style={{
                  width: 120,
                  height: 120,
                  resizeMode: "contain",
                }}
              />
            </View>
          ))}
        </View>
      )}
    </View>
  );
}
