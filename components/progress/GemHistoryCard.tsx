import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { Gem, TrendingUp } from 'lucide-react-native';
import { Colors } from '@/constants/colors';

interface GemHistoryCardProps {
  totalEarned: number;
  currentGems: number;
  weeklyGrowth: number;
}

export default function GemHistoryCard({
  totalEarned,
  currentGems,
  weeklyGrowth,
}: GemHistoryCardProps) {
  return (
    <View style={styles.container}>
      <View style={styles.item}>
        <Gem size={18} color={Colors.gold[500]} />
        <Text style={styles.value}>{currentGems.toLocaleString()}</Text>
        <Text style={styles.label}>Gemas actuales</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.item}>
        <Gem size={18} color={Colors.text.secondary} />
        <Text style={[styles.value, { color: Colors.text.secondary }]}>
          {totalEarned.toLocaleString()}
        </Text>
        <Text style={styles.label}>Total ganadas</Text>
      </View>
      <View style={styles.divider} />
      <View style={styles.item}>
        <TrendingUp size={18} color={Colors.success} />
        <Text style={[styles.value, { color: Colors.success }]}>+{weeklyGrowth}</Text>
        <Text style={styles.label}>Esta semana</Text>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    backgroundColor: Colors.blue.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
  },
  item: { flex: 1, alignItems: 'center', gap: 6 },
  value: { color: Colors.gold[500], fontFamily: 'Inter-Bold', fontSize: 18 },
  label: { color: Colors.text.muted, fontFamily: 'Inter-Regular', fontSize: 11, textAlign: 'center' },
  divider: { width: 1, backgroundColor: 'rgba(255,255,255,0.08)', marginHorizontal: 8 },
});
