import React, { useEffect, useState } from 'react';
import { View, Text, ScrollView, StyleSheet, ActivityIndicator } from 'react-native';
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
      <View style={styles.loader}>
        <ActivityIndicator size="large" color={Colors.gold[500]} />
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.safe} edges={['top']}>
      <ScrollView style={styles.scroll} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
        <View style={styles.headerBar}>
          <Text style={styles.logo}>BigDreamers</Text>
          <Text style={styles.logoAccent}>.</Text>
        </View>
        <WelcomeBanner user={user} />
        <StatsRow user={user} />
        <LevelProgressCard user={user} />
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Actividad reciente</Text>
          {activities.map((a) => (
            <ActivityItem key={a.id} activity={a} />
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
  headerBar: {
    flexDirection: 'row',
    alignItems: 'baseline',
    paddingHorizontal: 16,
    paddingTop: 8,
    paddingBottom: 4,
  },
  logo: { color: Colors.white, fontFamily: 'Inter-Bold', fontSize: 22 },
  logoAccent: { color: Colors.gold[500], fontFamily: 'Inter-Bold', fontSize: 28 },
  section: {
    marginHorizontal: 16,
    backgroundColor: Colors.blue.card,
    borderRadius: 16,
    padding: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  sectionTitle: {
    color: Colors.white,
    fontFamily: 'Inter-SemiBold',
    fontSize: 16,
    marginBottom: 8,
  },
});
