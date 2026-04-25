import { ScrollView, View, Text } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DetailHeader from '@/components/CompanyDetail/DetailHeader';
import InvestmentControls from '@/components/CompanyDetail/InvestmentControls';
import TeamMember from '@/components/CompanyDetail/TeamMember';
import ButtonBackScreen from '@/components/shared/ButtonBackScreen';

export default function CompanyDetail({ companyId }: { companyId: string }) {
  return (
    <SafeAreaView className="flex-1 bg-blue-primary" edges={['top']}>
      <View className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px]" />
      <View className="absolute top-1/2 -left-20 w-72 h-72 bg-purple-600/10 rounded-full blur-[100px]" />
      <ButtonBackScreen redirectTo="invest" />
      <ScrollView 
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
      >
        <DetailHeader 
          name={companyId.toUpperCase()}
          description="Transformando el turismo urbano con tecnología blockchain"
          gems={125000}
          imageUrl="https://cdn-icons-png.flaticon.com/512/2611/2611152.png"
        />

        <View className="mb-10">
            <InvestmentControls currentGems={4500} />
        </View>

        <View>
          <View className="flex-row items-center justify-between mb-6 px-2">
            <Text className="font-black text-2xl text-white tracking-tight">Representantes</Text>
            <View className="h-[2px] flex-1 bg-white/10 ml-4 rounded-full" />
          </View>
          
          <TeamMember name="Juan Fernandez" role="CEO & Fundador" />
          <TeamMember name="María Ponce" role="CTO" />
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}