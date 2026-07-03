import React from 'react';
import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
import DetailHeader from '@/components/CompanyDetail/DetailHeader';
import InvestmentControls from '@/components/CompanyDetail/InvestmentControls';
import InvestmentInsights from '@/components/CompanyDetail/InvestmentInsights';
import TeamMember from '@/components/CompanyDetail/TeamMember';
import ButtonBackScreen from '@/components/shared/ButtonBackScreen';
import { useCompanyById } from '@/hooks/company/useCompanyById';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { useAuth } from '@/contexts/AuthContext';

export default function CompanyDetail({ companyId }: { companyId: string }) {
  const { isDark } = useTheme();
  const { company, loading: loadingCompany } = useCompanyById(companyId);
  const { user: authUser } = useAuth();
  const { user, loading: loadingUser, refetch: refetchUser } = useCurrentUser(authUser?.id ?? null);

  const initialLoading = loadingCompany || (loadingUser && !user);

  return (
    <SafeAreaView className="flex-1" style={{ backgroundColor: isDark ? Colors.blue.primary : Colors.light.bg }} edges={['top']}>
      <View className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px]" />
      <View className="absolute top-1/2 -left-20 w-72 h-72 bg-purple-600/10 rounded-full blur-[100px]" />
      <ButtonBackScreen redirectTo="/invest" />

      {initialLoading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color={Colors.gold[400]} />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerClassName="p-5 pb-[100px]"
        >
          <DetailHeader
            name={company?.name ?? ''}
            description={company?.description ?? ''}
            gems={company?.gems ?? 0}
            imageUrl={company?.imageUrl ?? ''}
          />

          <View className="mb-10">
            <InvestmentControls
              currentGems={user?.gems ?? 0}
              cost={company?.gems ?? 0}
              companyName={company?.name ?? 'esta empresa'}
              userId={authUser?.id ?? null}
              onInvested={refetchUser}
            />
            <InvestmentInsights />
          </View>

          {company?.teamMembers && company.teamMembers.length > 0 && (
            <View>
              <View className="flex-row items-center justify-between mb-6 px-2">
                <Text className="font-black text-2xl tracking-tight" style={{ color: isDark ? '#FFFFFF' : Colors.light.textPrimary }}>Representantes</Text>
                <View className="h-[2px] flex-1 ml-4 rounded-full" style={{ backgroundColor: isDark ? 'rgba(255,255,255,0.1)' : Colors.light.border }} />
              </View>

              {company.teamMembers.map((member, index) => (
                <TeamMember key={index} name={member.name} role={member.role} contact={member.contact} />
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}