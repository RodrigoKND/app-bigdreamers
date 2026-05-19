import React from 'react';
import { View, Text, ScrollView } from "react-native";
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import CompanyCard from "@/components/invest/CompanyCard";
import { Company } from "@/constants/mockCompanies";
import { Building } from 'lucide-react-native';

interface LevelSilverProps {
  companies: Company[];
}

export default function LevelSilver({ companies }: LevelSilverProps) {
    const { isDark } = useTheme();

    return (
        <View className="flex-1 my-6">
            <View className="flex-row justify-between items-center mb-5">
                <View className="flex-col">
                    <Text className="text-lg font-bold" style={{ color: isDark ? '#FFFFFF' : Colors.light.textPrimary }}>
                        Empresas Destacadas
                    </Text>
                    <Text className="text-lg font-bold" style={{ color: isDark ? Colors.levels.silver : Colors.light.lvlSilver }}>
                        Nivel Plata
                    </Text>
                </View>
                <Text style={{ color: isDark ? '#D1D5DB' : Colors.light.textSecond }}>Ver todas</Text>
            </View>


            <ScrollView horizontal showsHorizontalScrollIndicator={false}
                contentContainerStyle={{ gap: 16, paddingRight: 20 }}>
                {companies.length === 0 ? (
                  <View className="flex-1 items-center justify-center py-10 min-w-[200px]">
                    <Building size={32} color={isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted} className="mb-3" />
                    <Text className="text-sm text-center" style={{ color: isDark ? 'rgba(255,255,255,0.65)' : Colors.light.textMuted }}>
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