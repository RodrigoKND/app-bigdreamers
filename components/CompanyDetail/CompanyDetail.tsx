import { ScrollView, View, Text, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import DetailHeader from '@/components/CompanyDetail/DetailHeader';
import InvestmentControls from '@/components/CompanyDetail/InvestmentControls';
import TeamMember from '@/components/CompanyDetail/TeamMember';
import ButtonBackScreen from '@/components/shared/ButtonBackScreen';
import { useCompanyById } from '@/hooks/company/useCompanyById';
import { useCurrentUser } from '@/hooks/user/useCurrentUser';
import { useAuth } from '@/contexts/AuthContext';

export default function CompanyDetail({ companyId }: { companyId: string }) {
  const { company, loading: loadingCompany } = useCompanyById(companyId);
  const { user: authUser } = useAuth();
  const { user, loading: loadingUser } = useCurrentUser(authUser?.id ?? null);

  const loading = loadingCompany || loadingUser;

  return (
    <SafeAreaView className="flex-1 bg-blue-primary" edges={['top']}>
      <View className="absolute -top-20 -right-20 w-64 h-64 bg-blue-600/20 rounded-full blur-[80px]" />
      <View className="absolute top-1/2 -left-20 w-72 h-72 bg-purple-600/10 rounded-full blur-[100px]" />
      <ButtonBackScreen redirectTo="/invest" />

      {loading ? (
        <View className="flex-1 items-center justify-center">
          <ActivityIndicator size="large" color="#FFD740" />
        </View>
      ) : (
        <ScrollView
          showsVerticalScrollIndicator={false}
          contentContainerStyle={{ padding: 20, paddingBottom: 100 }}
        >
          <DetailHeader
            name={company?.name ?? ''}
            description={company?.description ?? ''}
            gems={company?.gems ?? 0}
            imageUrl={company?.imageUrl ?? ''}
          />

          <View className="mb-10">
            <InvestmentControls currentGems={user?.gems ?? 0} description={company?.description ?? ''} />
          </View>

          {company?.teamMembers && company.teamMembers.length > 0 && (
            <View>
              <View className="flex-row items-center justify-between mb-6 px-2">
                <Text className="font-black text-2xl text-white tracking-tight">Representantes</Text>
                <View className="h-[2px] flex-1 bg-white/10 ml-4 rounded-full" />
              </View>

              {company.teamMembers.map((member, index) => (
                <TeamMember key={index} name={member.name} role={member.role} />
              ))}
            </View>
          )}
        </ScrollView>
      )}
    </SafeAreaView>
  );
}