import { View, Text, ScrollView } from "react-native";
import CompanyCard from "@/components/invest/CompanyCard";
import { Company } from "@/constants/mockCompanies";
import { Building } from 'lucide-react-native';

interface LevelBronceProps {
  companies: Company[];
}

export default function LevelBronce({ companies }: LevelBronceProps) {
    return (
        <View className="flex-1 mt-6 mb-4">
            <View className="flex-row justify-between items-center mb-5">
                <View className="flex-col">
                    <Text className="text-lg font-bold dark:text-white text-black">
                        Empresas Destacadas
                    </Text>
                    <Text className="text-lg font-bold text-levels-bronze">
                        Nivel Bronce
                    </Text>
                </View>
                <Text className="dark:text-gray-300 text-black">Ver todas</Text>
            </View>

            <ScrollView horizontal showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 16, paddingRight: 20 }}>
                {companies.length === 0 ? (
                  <View className="flex-1 items-center justify-center py-10 min-w-[200px]">
                    <Building size={32} color="rgba(255,255,255,0.65)" style={{ marginBottom: 12 }} />
                    <Text style={{ color: 'rgba(255,255,255,0.65)', fontSize: 14, textAlign: 'center' }}>
                      No hay empresas disponibles en este nivel
                    </Text>
                  </View>
                ) : (
                  companies.map((company) => (
                    <CompanyCard
                      key={company.id}
                      id={company.id}
                      name={company.name}
                      gems={company.gems}
                      imageUrl={company.imageUrl}
                    />
                  ))
                )}
            </ScrollView>
        </View>
    );
}