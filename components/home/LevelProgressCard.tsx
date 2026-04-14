import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { User } from '@/types';
import { Colors } from '@/constants/colors';
import { getLevelConfig, getLevelProgress, getGemsToNextLevel } from '@/constants/levels';
import ProgressBar from '@/components/shared/ProgressBar';
import GemBadge from '@/components/shared/GemBadge';

interface LevelProgressCardProps {
  user: User;
}

export default function LevelProgressCard({ user }: LevelProgressCardProps) {
  const config = getLevelConfig(user.level);
  const progress = getLevelProgress(user.gems, user.level);
  const remaining = getGemsToNextLevel(user.gems, user.level);
  const nextConfig = config.nextLevel ? getLevelConfig(config.nextLevel) : null;

  return (
    <View style={[styles.card, { borderColor: `${config.color}30` }]}>
      <View style={styles.header}>
        <View>
          <Text style={styles.label}>Tu Progreso de Nivel</Text>
          <Text style={[styles.levelName, { color: config.color }]}>{config.label}</Text>
        </View>
        <GemBadge count={user.gems} size="md" showLabel />
      </View>
      <ProgressBar progress={progress} color={config.color} height={10} />
      <View style={styles.footer}>
        <Text style={styles.progressText}>{progress}% completado</Text>
        {nextConfig && (
          <View style={styles.nextLevel}>
            <Text style={styles.remainingText}>
              {remaining.toLocaleString()} para
            </Text>
            <ChevronRight size={14} color={Colors.text.muted} />
            <Text style={[styles.nextLevelName, { color: nextConfig.color }]}>
              {nextConfig.label}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: Colors.blue.card,
    borderRadius: 16,
    padding: 16,
    marginHorizontal: 16,
    gap: 12,
    borderWidth: 1,
  },
  header: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'flex-start' },
  label: { color: Colors.text.muted, fontFamily: 'Inter-Regular', fontSize: 12 },
  levelName: { fontFamily: 'Inter-Bold', fontSize: 20, marginTop: 2 },
  footer: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  progressText: { color: Colors.text.secondary, fontFamily: 'Inter-Regular', fontSize: 12 },
  nextLevel: { flexDirection: 'row', alignItems: 'center', gap: 2 },
  remainingText: { color: Colors.text.muted, fontFamily: 'Inter-Regular', fontSize: 12 },
  nextLevelName: { fontFamily: 'Inter-SemiBold', fontSize: 12 },
});
