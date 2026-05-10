import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import SearchBar from '@/components/shared/SearchBar';
import LevelGold from '@/components/invest/levelGold/LevelGold';
import LevelSilver from '@/components/invest/levelSilver/LevelSilver';
import LevelBronce from '@/components/invest/levelBronce/LevelBronce';
import { useCompanies } from '@/hooks/company/useCompanies';

export default function Invest() {
  const { companies, loading } = useCompanies();

  const goldCompanies = companies.filter((c) => c.level === 'gold');
  const silverCompanies = companies.filter((c) => c.level === 'silver');
  const bronzeCompanies = companies.filter((c) => c.level === 'bronze');

  return (
    <SafeAreaView className="flex-1 bg-blue-primary" edges={['top']}>

      <View className="p-6">
        <Text className="dark:text-white text-black text-3xl font-bold">
          Empresas disponibles
        </Text>
        <Text className="text-indigo-200 mt-1">
          Invierte en empresas reales verificadas
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerStyle={{ paddingBottom: 10 }}
      >
        <View className="px-6 mt-6">
          
          <SearchBar />
          {!loading && (
            <>
              <LevelGold companies={goldCompanies} />
              <LevelSilver companies={silverCompanies} />
              <LevelBronce companies={bronzeCompanies} />
            </>
          )}

        </View>
      </ScrollView>
    </SafeAreaView>
  );
}