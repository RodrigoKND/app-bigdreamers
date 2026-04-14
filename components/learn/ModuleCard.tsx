import React from 'react';
import { View, Text, Image, TouchableOpacity, StyleSheet } from 'react-native';
import { CircleCheck as CheckCircle2, Clock, ChevronRight } from 'lucide-react-native';
import { LearningModule } from '@/types';
import { Colors } from '@/constants/colors';
import GemBadge from '@/components/shared/GemBadge';
import ProgressBar from '@/components/shared/ProgressBar';

const DIFFICULTY_COLORS = {
  beginner: Colors.success,
  intermediate: Colors.warning,
  advanced: Colors.error,
};

const DIFFICULTY_LABELS = {
  beginner: 'Básico',
  intermediate: 'Intermedio',
  advanced: 'Avanzado',
};

interface ModuleCardProps {
  module: LearningModule;
  onPress?: (module: LearningModule) => void;
}

export default function ModuleCard({ module, onPress }: ModuleCardProps) {
  const diffColor = DIFFICULTY_COLORS[module.difficulty];

  return (
    <TouchableOpacity style={styles.container} onPress={() => onPress?.(module)} activeOpacity={0.8}>
      <Image source={{ uri: module.thumbnail }} style={styles.thumbnail} />
      <View style={styles.content}>
        <View style={styles.tags}>
          <Text style={[styles.category]}>{module.category}</Text>
          <Text style={[styles.difficulty, { color: diffColor }]}>
            {DIFFICULTY_LABELS[module.difficulty]}
          </Text>
        </View>
        <Text style={styles.title} numberOfLines={2}>{module.title}</Text>
        {module.progress > 0 && !module.completed && (
          <ProgressBar progress={module.progress} height={6} color={Colors.blue.light} />
        )}
        <View style={styles.footer}>
          <View style={styles.metaRow}>
            <Clock size={12} color={Colors.text.muted} />
            <Text style={styles.duration}>{module.duration}</Text>
          </View>
          <GemBadge count={module.gemsReward} size="sm" />
          {module.completed && <CheckCircle2 size={18} color={Colors.success} />}
          {!module.completed && <ChevronRight size={16} color={Colors.text.muted} />}
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    backgroundColor: Colors.blue.card,
    borderRadius: 16,
    marginBottom: 12,
    overflow: 'hidden',
    borderWidth: 1,
    borderColor: 'rgba(255,255,255,0.06)',
    flexDirection: 'row',
  },
  thumbnail: { width: 100, height: 110 },
  content: { flex: 1, padding: 12, gap: 6, justifyContent: 'space-between' },
  tags: { flexDirection: 'row', gap: 8 },
  category: { color: Colors.text.muted, fontFamily: 'Inter-Regular', fontSize: 11 },
  difficulty: { fontFamily: 'Inter-SemiBold', fontSize: 11 },
  title: { color: Colors.white, fontFamily: 'Inter-SemiBold', fontSize: 14 },
  footer: { flexDirection: 'row', alignItems: 'center', gap: 10 },
  metaRow: { flexDirection: 'row', alignItems: 'center', gap: 4, flex: 1 },
  duration: { color: Colors.text.muted, fontFamily: 'Inter-Regular', fontSize: 11 },
});
