import React from 'react';
import { View, Text } from 'react-native';
import { CircleCheck as CheckCircle2, Circle, BookOpen, Users, Flame, TrendingUp } from 'lucide-react-native';
import { Milestone } from '@/types';
import { Colors } from '@/constants/colors';
import GemBadge from '@/components/shared/GemBadge';

// Definimos los tipos estrictos para evitar errores de TypeScript
type MilestoneCategory = 'learning' | 'community' | 'streak' | 'level';

const CATEGORY_ICONS: Record<MilestoneCategory, React.ReactNode> = {
  learning: <BookOpen size={16} color={Colors.blue.light} />,
  community: <Users size={16} color={Colors.success} />,
  streak: <Flame size={16} color={Colors.warning} />,
  level: <TrendingUp size={16} color={Colors.gold[500]} />,
};

interface MilestoneCardProps {
  milestone: Milestone;
  className?: string; // Para inyección de márgenes
}

export default function MilestoneCard({ milestone, className = '' }: MilestoneCardProps) {
  const { completed } = milestone;

  // Lógica de estilos condicionales extraída para mayor limpieza visual
  const containerClass = completed
    ? 'bg-[#22C55E]/[0.06] border-[#22C55E]/20'
    : 'bg-blue-card border-white/5';

  return (
    <View 
      className={`flex-row items-start gap-3 p-[14px] rounded-[14px] border mb-2.5 ${containerClass} ${className}`.trim()}
      
      // Accesibilidad: Narración fluida del estado del logro
      accessible={true}
      accessibilityLabel={`Logro: ${milestone.title}. Estado: ${completed ? 'Completado' : 'Pendiente'}. Recompensa: ${milestone.gemsReward} gemas.`}
    >
      {/* Contenedor del ícono principal de estado */}
      <View className="pt-[2px]">
        {completed ? (
          <CheckCircle2 size={22} color={Colors.success} />
        ) : (
          <Circle size={22} color={Colors.text.muted} />
        )}
      </View>

      {/* Contenido Central */}
      <View className="flex-1 gap-1">
        
        {/* Cabecera: Ícono de categoría y Título */}
        <View className="flex-row items-center gap-1.5">
          {CATEGORY_ICONS[milestone.category as MilestoneCategory] || <BookOpen size={16} color={Colors.text.muted} />}
          <Text 
            className={`font-medium text-sm flex-1 ${completed ? 'text-white' : 'text-text-secondary'}`}
          >
            {milestone.title}
          </Text>
        </View>

        {/* Descripción */}
        <Text 
          className="text-text-muted font-normal text-xs" 
          numberOfLines={2}
        >
          {milestone.description}
        </Text>

        {/* Fecha condicional */}
        {completed && milestone.completedAt && (
          <Text className="text-success font-normal text-[11px] mt-0.5">
            Completado el {new Date(milestone.completedAt).toLocaleDateString('es-ES')}
          </Text>
        )}
      </View>

      {/* Recompensa */}
      <GemBadge count={milestone.gemsReward} size="sm" />
    </View>
  );
}