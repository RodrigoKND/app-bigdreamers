import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { User, Activity } from '@/types';
import { Colors } from '@/constants/colors';
import { getCurrentUser } from '@/services/userService';
import { getRecentActivities } from '@/services/communityService';
import WelcomeBanner from '@/components/home/WelcomeBanner';
import StatsRow from '@/components/home/StatsRow';
import LevelProgressCard from '@/components/home/LevelProgressCard';
import ActivityItem from '@/components/home/ActivityItem';

export default function HomeScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [activities, setActivities] = useState<Activity[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function load() {
      const [u, a] = await Promise.all([getCurrentUser(), getRecentActivities(4)]);
      setUser(u);
      setActivities(a);
      setLoading(false);
    }
    load();
  }, []);

  if (loading || !user) {
    return (
      <View className="flex-1 items-center justify-center bg-navy-900">
        <ActivityIndicator size="large" color={Colors.gold[500]} />
      </View>
    );
  }

  return (
    <SafeAreaView className="flex-1 bg-navy-900" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-8 gap-4"
        showsVerticalScrollIndicator={false}
      >
        <View className="flex-row items-baseline px-4 pt-2 pb-1">
          <Text className="text-white font-bold text-2xl">BigDreamers</Text>
          <Text className="text-gold-500 font-bold text-3xl">.</Text>
        </View>

        <WelcomeBanner user={user} />
        <StatsRow user={user} />
        <LevelProgressCard user={user} />

        <View className="mx-4 bg-blue-card rounded-2xl p-4 border border-white/[0.06]">
          <Text className="text-white font-semibold text-base mb-2">
            Actividad reciente
          </Text>
          {activities.map((a) => (
            <ActivityItem key={a.id} activity={a} />
          ))}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}