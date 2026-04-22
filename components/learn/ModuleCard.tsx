import React from 'react';
import { View, Text, Image, Pressable } from 'react-native';
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
  className?: string; // Habilitamos la inyeccion de margenes desde el padre
}

export default function ModuleCard({ module, onPress, className = '' }: ModuleCardProps) {
  const diffColor = DIFFICULTY_COLORS[module.difficulty];

  return (
    <Pressable 
      onPress={() => onPress?.(module)} 
      //  TouchableOpacity por Pressable + active:opacity-80
      className={`flex-row bg-blue-card rounded-2xl mb-3 overflow-hidden border border-white/5 active:opacity-80 ${className}`.trim()}
      
      // Accesibilidad 
      accessible={true}
      accessibilityRole="button"
      accessibilityLabel={`Módulo: ${module.title}. Dificultad: ${DIFFICULTY_LABELS[module.difficulty]}.`}
    >
      {/* Miniatura con fallback de fondo mientras carga */}
      <Image 
        source={{ uri: module.thumbnail }} 
        className="w-[100px] h-[110px] bg-navy-800" 
      />

      {/* Contenedor Principal */}
      <View className="flex-1 p-3 gap-1.5 justify-between">
        
        {/* Etiquetas (Categoría y Dificultad) */}
        <View className="flex-row gap-2">
          <Text className="text-text-muted font-normal text-[11px]">
            {module.category}
          </Text>
          <Text 
            className="font-semibold text-[11px]" 
            style={{ color: diffColor }}
          >
            {DIFFICULTY_LABELS[module.difficulty]}
          </Text>
        </View>

        {/* Título del módulo */}
        <Text 
          className="text-white font-semibold text-sm" 
          numberOfLines={2}
        >
          {module.title}
        </Text>

        {/* Barra de Progreso Dinámica */}
        {module.progress > 0 && !module.completed && (
          <ProgressBar 
            progress={module.progress} 
            height={6} 
            color={Colors.blue.light} 
          />
        )}

        {/* Pie de la tarjeta (Duración, Gemas y Estado) */}
        <View className="flex-row items-center gap-2.5">
          
          <View className="flex-1 flex-row items-center gap-1">
            <Clock size={12} color={Colors.text.muted} />
            <Text className="text-text-muted font-normal text-[11px]">
              {module.duration}
            </Text>
          </View>

          <GemBadge count={module.gemsReward} size="sm" />
          
          {module.completed ? (
            <CheckCircle2 size={18} color={Colors.success} />
          ) : (
            <ChevronRight size={16} color={Colors.text.muted} />
          )}
          
        </View>
      </View>
    </Pressable>
  );
}

//ya usamos los cards y todolo definopreviamente