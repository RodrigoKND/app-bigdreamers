import { View, Text, ScrollView } from "react-native";
import CompanyCard from "@/components/invest/CompanyCard";

export default function LevelGold() {
    return (
        <View className="flex-1 my-6">
            <View className="flex-row justify-between items-center mb-5">
                <View className="flex-column">
                    <Text className="text-lg font-bold dark:text-white text-black">
                        Empresas Destacadas
                    </Text>
                    <Text className="text-lg font-bold text-levels-gold">
                        Nivel Oro
                    </Text>
                </View>
                <Text className="dark:text-gray-300 text-black">Ver todas</Text>
            </View>


            <ScrollView horizontal showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 16, paddingRight: 20 }}>
                <CompanyCard
                    name="Tech Innovate"
                    gems={4500}
                    imageUrl="https://cloudfront-eu-central-1.images.arcpublishing.com/prisaradio/6XQ2V2HNRRMDHDJ55MPMNBJ4E4.jpg"
                />
                <CompanyCard
                    name="Green Earth"
                    gems={2800}
                    imageUrl="https://cloudfront-eu-central-1.images.arcpublishing.com/prisaradio/6XQ2V2HNRRMDHDJ55MPMNBJ4E4.jpg"
                />
            </ScrollView>
        </View>
    );
}