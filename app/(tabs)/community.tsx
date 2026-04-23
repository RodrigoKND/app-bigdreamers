import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Trophy } from 'lucide-react-native';
import { CommunityMember, Activity } from '@/types';
import { Colors } from '@/constants/colors';
import { getCommunityRanking, getRecentActivities } from '@/services/communityService';
import MemberCard from '@/components/community/MemberCard';
import ActivityItem from '@/components/home/ActivityItem';


const CURRENT_USER_ID = '1';

export default function CommunityScreen() {
  const [members, setMembers] = useState<CommunityMember[]>([]);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);
  const [tab, setTab] = useState<'ranking' | 'activity'>('ranking');

  useEffect(() => {
    async function load() {
      const [m, a] = await Promise.all([getCommunityRanking(), getRecentActivities()]);
      setMembers(m);
      setActivities(a);
      setLoading(false);
    }
    load();
  }, []);

  if (loading) {
    return (
      <View className="flex-1 items-center justify-center bg-navy-900">
        <ActivityIndicator size="large" color={Colors.gold[500]} />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-navy-900" edges={['top']}>

      <View className="flex-row items-center gap-[10px] px-4 pt-3 pb-2">
        <Trophy size={22} color={Colors.gold[500]} />
        <Text className="text-white font-bold text-2xl">Comunidad</Text>
      </View>

      <View className="flex-row gap-2 px-4 mb-3">
        {(['ranking', 'activity'] as const).map((t) => (
          <Pressable
            key={t}
            className="flex-1 py-[10px] rounded-xl items-center border active:opacity-70"
            style={{
              backgroundColor: tab === t ? Colors.gold[600] : Colors.blue.card,
              borderColor: tab === t ? Colors.gold[500] : 'rgba(255,255,255,0.06)',
            }}
            onPress={() => setTab(t)}
          >
            <Text
              className="font-semibold text-sm"
              style={{ color: tab === t ? Colors.navy[900] : Colors.text.muted }}
            >
              {t === 'ranking' ? 'Ranking' : 'Actividad'}
            </Text>
          </Pressable>
        ))}
      </View>

      <ScrollView
        className="flex-1"
        contentContainerClassName="px-4 pb-6"
        showsVerticalScrollIndicator={false}
      >
        {tab === 'ranking'
          ? members.map((m) => (
              <MemberCard key={m.id} member={m} isCurrentUser={m.id === CURRENT_USER_ID} />
            ))
          : activities.map((a) => <ActivityItem key={a.id} activity={a} />)}
      </ScrollView>

    </SafeAreaView>
  );
}