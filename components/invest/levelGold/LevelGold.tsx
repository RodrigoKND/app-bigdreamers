import { View, Text, ScrollView } from "react-native";
import CompanyCard from "@/components/invest/CompanyCard";

export default function LevelGold() {
    return (
        <>
            <View className="flex-row justify-between items-center mb-4">
                <Text className="text-lg font-bold dark:text-white text-black">
                    Empresas Destacadas Nivel Oro
                </Text>
                <Text className="dark:text-gray-300 text-black">Ver todas</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
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
        </>
    );
}