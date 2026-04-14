import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
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
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.gold[500]} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <View style={styles.header}>
        <Trophy size={22} color={Colors.gold[500]} />
        <Text style={styles.title}>Comunidad</Text>
      </View>
      <View style={styles.tabs}>
        {(['ranking', 'activity'] as const).map((t) => (
          <View key={t} style={[styles.tabBtn, tab === t && styles.tabActive]}>
            <Text
              style={[styles.tabText, tab === t && styles.tabTextActive]}
              onPress={() => setTab(t)}
            >
              {t === 'ranking' ? 'Ranking' : 'Actividad'}
            </Text>
          </View>
        ))}
      </View>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        {tab === 'ranking'
          ? members.map((m) => (
              <MemberCard key={m.id} member={m} isCurrentUser={m.id === CURRENT_USER_ID} />
            ))
          : activities.map((a) => <ActivityItem key={a.id} activity={a} />)}
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  safe: { flex: 1, backgroundColor: Colors.navy[900] },
  loader: { flex: 1, alignItems: 'center', justifyContent: 'center', backgroundColor: Colors.navy[900] },
  header: { flexDirection: 'row', alignItems: 'center', gap: 10, paddingHorizontal: 16, paddingTop: 12, paddingBottom: 8 },
  title: { color: Colors.white, fontFamily: 'Inter-Bold', fontSize: 24 },
  tabs: { flexDirection: 'row', gap: 8, paddingHorizontal: 16, marginBottom: 12 },
  tabBtn: { flex: 1, paddingVertical: 10, borderRadius: 12, backgroundColor: Colors.blue.card, alignItems: 'center', borderWidth: 1, borderColor: 'rgba(255,255,255,0.06)' },
  tabActive: { backgroundColor: Colors.gold[600], borderColor: Colors.gold[500] },
  tabText: { color: Colors.text.muted, fontFamily: 'Inter-SemiBold', fontSize: 14 },
  tabTextActive: { color: Colors.navy[900] },
  scroll: { flex: 1 },
  content: { paddingHorizontal: 16, paddingBottom: 24 },
});
