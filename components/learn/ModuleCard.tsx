import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
import { CircleCheck as CheckCircle2, Clock, ChevronRight } from 'lucide-react-native';
import { LearningModule } from '@/types';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';
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
  className?: string;
}

export default function ModuleCard({ module, onPress, className = '' }: ModuleCardProps) {
  const { isDark } = useTheme();
  const diffColor = DIFFICULTY_COLORS[module.difficulty];

  return (
    <Pressable 
      onPress={() => onPress?.(module)} 
      className={`flex-row rounded-2xl mb-3 overflow-hidden active:opacity-80 border ${className}`.trim()}
      style={{ backgroundColor: isDark ? Colors.blue.card : Colors.light.card, borderColor: isDark ? 'rgba(255,255,255,0.05)' : Colors.light.border }}
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Módulo: ${module.title}. Dificultad: ${DIFFICULTY_LABELS[module.difficulty]}.`}
    >
      <Image 
        source={{ uri: module.thumbnail }} 
        className="w-[100px] h-[110px]" style={{ backgroundColor: isDark ? Colors.navy[800] : Colors.light.surface }}
      />

      <View className="flex-1 p-3 gap-1.5 justify-between">
        
        <View className="flex-row gap-2">
          <Text className="font-normal text-[11px]" style={{ color: isDark ? Colors.text.muted : Colors.light.textMuted }}>
            {module.category}
          </Text>
          <Text 
            className="font-semibold text-[11px]" 
            style={{ color: diffColor }}
          >
            {DIFFICULTY_LABELS[module.difficulty]}
          </Text>
        </View>

        <Text 
          className="font-semibold text-sm" 
          style={{ color: isDark ? '#FFFFFF' : Colors.light.textPrimary }}
          numberOfLines={2}
        >
          {module.title}
        </Text>

        {module.progress > 0 && !module.completed && (
          <ProgressBar 
            progress={module.progress} 
            height={6} 
            color={Colors.blue.light} 
          />
        )}

        <View className="flex-row items-center gap-2.5">
          
          <View className="flex-1 flex-row items-center gap-1">
            <Clock size={12} color={isDark ? Colors.text.muted : Colors.light.textMuted} />
            <Text className="font-normal text-[11px]" style={{ color: isDark ? Colors.text.muted : Colors.light.textMuted }}>
              {module.duration}
            </Text>
          </View>

          <GemBadge count={module.gemsReward} size="sm" />
          
          {module.completed ? (
            <CheckCircle2 size={18} color={isDark ? Colors.success : Colors.light.success} />
          ) : (
            <ChevronRight size={16} color={isDark ? Colors.text.muted : Colors.light.textMuted} />
          )}
          
        </View>
      </View>
    </Pressable>
  );
}