import React, { useMemo, useState, useCallback } from 'react';
import { Text, View, ScrollView, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useFocusEffect } from 'expo-router';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import SearchBar from '@/components/shared/SearchBar';
import LevelGold from '@/components/invest/levelGold/LevelGold';
import LevelSilver from '@/components/invest/levelSilver/LevelSilver';
import LevelBronce from '@/components/invest/levelBronce/LevelBronce';
import CompanyListModal from '@/components/invest/CompanyListModal';
import { useCompanies } from '@/hooks/company/useCompanies';
import { useUserInvestments } from '@/hooks/investment/useUserInvestments';
import { useAuth } from '@/contexts/AuthContext';
import { invalidateCachePattern, CacheKeys } from '@/services/cache/cacheService';
import { CompanyLevel } from '@/constants/mockCompanies';

const Invest = React.memo(function Invest() {
  const { isDark } = useTheme();
  const { user: authUser } = useAuth();
  const { companies, loading, refetch } = useCompanies();
  const { investments } = useUserInvestments(authUser?.id ?? null);
  const [search, setSearch] = useState('');
  const [refreshing, setRefreshing] = useState(false);
  const [modalLevel, setModalLevel] = useState<CompanyLevel | null>(null);

  const investedCompanyIds = useMemo(
    () => new Set(investments.map((inv) => inv.companyId).filter((id): id is string => !!id)),
    [investments]
  );

  const filtered = companies.filter(c => c.name.toLowerCase().includes(search.toLowerCase()));
  const goldCompanies = useMemo(() => filtered.filter((c) => c.level === 'gold'), [filtered]);
  const silverCompanies = useMemo(() => filtered.filter((c) => c.level === 'silver'), [filtered]);
  const bronzeCompanies = useMemo(() => filtered.filter((c) => c.level === 'bronze'), [filtered]);

  const accentColor = isDark ? Colors.gold[400] : Colors.light.accent;

  useFocusEffect(
    useCallback(() => {
      invalidateCachePattern(CacheKeys.companies);
      refetch();
    }, [refetch])
  );

  const onRefresh = useCallback(async () => {
    setRefreshing(true);
    try { await refetch(); } finally { setRefreshing(false); }
  }, [refetch]);

  const modalCompanies = useMemo(() => {
    if (!modalLevel) return [];
    return filtered.filter(c => c.level === modalLevel);
  }, [modalLevel, filtered]);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: isDark ? Colors.blue.primary : Colors.light.bg }} edges={['top']}>

      <View className="p-6">
        <Text className="text-3xl font-bold" style={{ color: isDark ? '#FFFFFF' : Colors.light.textPrimary }}>
          Empresas disponibles
        </Text>
        <Text className="mt-1" style={{ color: isDark ? '#B0C4DE' : Colors.light.textSecond }}>
          Practica cómo invertir en empresas verificadas
        </Text>
      </View>

      <ScrollView
        showsVerticalScrollIndicator={false}
        contentContainerClassName="pb-2.5"
        refreshControl={
          <RefreshControl
            refreshing={refreshing}
            onRefresh={onRefresh}
            tintColor={accentColor}
            colors={[accentColor]}
          />
        }
      >
        <View className="px-6 mt-6">
          
          <SearchBar value={search} onChangeText={setSearch} />
          {!loading && (
            <>
              <LevelGold companies={goldCompanies} onSeeAll={() => setModalLevel('gold')} investedCompanyIds={investedCompanyIds} />
              <LevelSilver companies={silverCompanies} onSeeAll={() => setModalLevel('silver')} investedCompanyIds={investedCompanyIds} />
              <LevelBronce companies={bronzeCompanies} onSeeAll={() => setModalLevel('bronze')} investedCompanyIds={investedCompanyIds} />
            </>
          )}

        </View>
      </ScrollView>

      <CompanyListModal
        visible={modalLevel !== null}
        level={modalLevel}
        companies={modalCompanies}
        onClose={() => setModalLevel(null)}
        investedCompanyIds={investedCompanyIds}
      />
    </SafeAreaView>
  );
});

export default Invest;
