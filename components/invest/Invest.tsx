import React, { useMemo, useState } from 'react';
import { Text, View, ScrollView } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import SearchBar from '@/components/shared/SearchBar';
import LevelGold from '@/components/invest/levelGold/LevelGold';
import LevelSilver from '@/components/invest/levelSilver/LevelSilver';
import LevelBronce from '@/components/invest/levelBronce/LevelBronce';
import { useCompanies } from '@/hooks/company/useCompanies';

const Invest = React.memo(function Invest() {
  const { isDark } = useTheme();
  const { companies, loading } = useCompanies();
  const [search, setSearch] = useState('');

  const filtered = companies.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const goldCompanies = useMemo(() => filtered.filter((c) => c.level === 'gold'), [filtered]);
  const silverCompanies = useMemo(() => filtered.filter((c) => c.level === 'silver'), [filtered]);
  const bronzeCompanies = useMemo(() => filtered.filter((c) => c.level === 'bronze'), [filtered]);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: isDark ? Colors.blue.primary : Colors.light.bg }} edges={['top']}>

      <View className="p-6">
        <Text className="text-3xl font-bold" style={{ color: isDark ? '#FFFFFF' : Colors.light.textPrimary }}>
          Empresas disponibles
        </Text>
        <Text className="mt-1" style={{ color: isDark ? '#B0C4DE' : Colors.light.textSecond }}>
          Invierte en empresas reales verificadas
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-2.5"
      >
        <View className="px-6 mt-6">
          
          <SearchBar value={search} onChangeText={setSearch} />
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
});

export default Invest;