import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, Pressable, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Milestone, User } from '@/types';
import { Colors } from '@/constants/colors';
import { getUserMilestones } from '@/services/progressService';
import { getCurrentUser } from '@/services/userService';
import GemHistoryCard from '@/components/progress/GemHistoryCard';
import MilestoneCard from '@/components/progress/MilestoneCard';
import LevelProgressCard from '@/components/home/LevelProgressCard';

const FILTERS = ['all', 'completed', 'pending'] as const;
const FILTER_LABELS = { all: 'Todos', completed: 'Completados', pending: 'Pendientes' };

export default function ProgressScreen() {
  const [user, setUser] = useState<User | null>(null);
  const [milestones, setMilestones] = useState<Milestone[]>([]);
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<'all' | 'completed' | 'pending'>('all');

  useEffect(() => {
    async function load() {
      const [u, m] = await Promise.all([getCurrentUser(), getUserMilestones('1')]);
      setUser(u);
      setMilestones(m);
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

  const filtered = milestones.filter((m) => {
    if (filter === 'completed') return m.completed;
    if (filter === 'pending') return !m.completed;
    return true;
  });

  return (
    <SafeAreaView className="flex-1 bg-navy-900" edges={['top']}>
      <ScrollView
        className="flex-1"
        contentContainerClassName="pb-8 gap-4"
        showsVerticalScrollIndicator={false}
      >

        <Text className="text-white font-bold text-2xl px-4 pt-2">
          Mi Progreso
        </Text>

        <GemHistoryCard
          currentGems={user.gems}
          totalEarned={user.totalGemsEarned}
          weeklyGrowth={340}
        />

        <LevelProgressCard user={user} />

        <View className="mx-4 gap-1">
          <Text className="text-white font-semibold text-base mb-3">
            Hitos
          </Text>

          <View className="flex-row gap-2 mb-3">
            {FILTERS.map((f) => (
              <Pressable
                key={f}
                className="px-[14px] py-[7px] rounded-full border active:opacity-70"
                style={{
                  backgroundColor: filter === f ? Colors.gold[600] : Colors.blue.card,
                  borderColor: filter === f ? Colors.gold[500] : 'rgba(255,255,255,0.08)',
                }}
                onPress={() => setFilter(f)}
              >
                <Text
                  className="font-medium text-[13px]"
                  style={{ color: filter === f ? Colors.navy[900] : Colors.text.muted }}
                >
                  {FILTER_LABELS[f]}
                </Text>
              </Pressable>
            ))}
          </View>

          {filtered.map((m) => (
            <MilestoneCard key={m.id} milestone={m} />
          ))}
        </View>

      </ScrollView>
    </SafeAreaView>
  );
}