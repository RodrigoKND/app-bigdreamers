import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Milestone, User } from '@/types';
import { Colors } from '@/constants/colors';
import { getUserMilestones } from '@/services/progressService';
import { getCurrentUser } from '@/services/userService';
import GemHistoryCard from '@/components/progress/GemHistoryCard';
import MilestoneCard from '@/components/progress/MilestoneCard';
import LevelProgressCard from '@/components/home/LevelProgressCard';

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
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.gold[500]} />
      </View>
    );
  }

  const filtered = milestones.filter((m) => {
    if (filter === 'completed') return m.completed;
    if (filter === 'pending') return !m.completed;
    return true;
  });

  const FILTERS = ['all', 'completed', 'pending'] as const;
  const FILTER_LABELS = { all: 'Todos', completed: 'Completados', pending: 'Pendientes' };

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <Text style={styles.title}>Mi Progreso</Text>
        <GemHistoryCard
          currentGems={user.gems}
          totalEarned={user.totalGemsEarned}
          weeklyGrowth={340}
        />
        <LevelProgressCard user={user} />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Hitos</Text>
          <View style={styles.filters}>
            {FILTERS.map((f) => (
              <View
                key={f}
                style={[styles.filterBtn, filter === f && styles.filterActive]}
              >
                <Text
                  style={[styles.filterText, filter === f && styles.filterTextActive]}
                  onPress={() => setFilter(f)}
                >
                  {FILTER_LABELS[f]}
                </Text>
              </View>
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

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.navy[900] },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.navy[900] },
  scroll: { flex: 1 },
  content: { paddingBottom: 30, gap: 16 },
  title: { color: Colors.white, fontFamily: 'Inter-Bold', fontSize: 24, paddingHorizontal: 16, paddingTop: 8 },
  section: { marginHorizontal: 16, gap: 4 },
  sectionTitle: { color: Colors.white, fontFamily: 'Inter-SemiBold', fontSize: 16, marginBottom: 12 },
  filters: { flexDirection: 'row', gap: 8, marginBottom: 12 },
  filterBtn: {
    paddingHorizontal: 14,
    paddingVertical: 7,
    borderRadius: 20,
    backgroundColor: Colors.blue.card,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.08)',
  },
  filterActive: { backgroundColor: Colors.gold[600], borderColor: Colors.gold[500] },
  filterText: { color: Colors.text.muted, fontFamily: 'Inter-Medium', fontSize: 13 },
  filterTextActive: { color: Colors.navy[900] },
});
