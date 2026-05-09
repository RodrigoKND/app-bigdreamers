import { View, Text, ScrollView } from "react-native";
import CompanyCard from "@/components/invest/CompanyCard";
import { Company } from "@/constants/mockCompanies";

interface LevelSilverProps {
  companies: Company[];
}

export default function LevelSilver({ companies }: LevelSilverProps) {
    return (
        <View className="flex-1 my-6">
            <View className="flex-row justify-between items-center mb-5">
                <View className="flex-column">
                    <Text className="text-lg font-bold dark:text-white text-black">
                        Empresas Destacadas
                    </Text>
                    <Text className="text-lg font-bold dark:text-levels-silver text-gray-700">
                        Nivel Plata
                    </Text>
                </View>
                <Text className="dark:text-gray-300 text-black">Ver todas</Text>
            </View>


            <ScrollView horizontal showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 16, paddingRight: 20 }}>
                {companies.map((company) => (
                  <CompanyCard
                    key={company.id}
                    name={company.name}
                    gems={company.gems}
                    imageUrl={company.imageUrl}
                  />
                ))}
            </ScrollView>
        </View>
    );
}