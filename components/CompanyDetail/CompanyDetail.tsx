import { ScrollView, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DetailHeader from '@/components/CompanyDetail/DetailHeader';
import InvestmentControls from '@/components/CompanyDetail/InvestmentControls';
import TeamMember from '@/components/CompanyDetail/TeamMember';

export default function CompanyDetail() {
  return (
    <SafeAreaView className="flex-1 bg-blue-primary" edges={['top']}>
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 24, paddingBottom: 100 }}
      >
        <DetailHeader 
          name="Lorem Ipsum"
          description="Lorem ipsum dolor sit amet, consectetur."
          gems={35.00}
          imageUrl="https://cdn-icons-png.flaticon.com/512/2611/2611152.png"
        />

        <InvestmentControls currentGems={4500} />

        <View className="bg-white rounded-[35px] border border-gray-100 p-6 shadow-sm">
          <Text className="font-bold text-lg mb-4">Equipo</Text>
          
          <TeamMember 
            name="Juan Mamani" 
            role="CEO & Fundador" 
          />
          <TeamMember 
            name="María Ponce" 
            role="CTO" 
          />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}