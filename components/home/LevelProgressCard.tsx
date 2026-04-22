import React from 'react';
import { View, Text } from 'react-native';
import { ChevronRight } from 'lucide-react-native';
import { User } from '@/types';
import { Colors } from '@/constants/colors';
import { getLevelConfig, getLevelProgress, getGemsToNextLevel } from '@/constants/levels';
import ProgressBar from '@/components/shared/ProgressBar';
import GemBadge from '@/components/shared/GemBadge';

interface LevelProgressCardProps {
  user: User;
  className?: string; // Permite inyectar margenes externos
}

export default function LevelProgressCard({ user, className = '' }: LevelProgressCardProps) {
  const config = getLevelConfig(user.level);
  const progress = getLevelProgress(user.gems, user.level);
  const remaining = getGemsToNextLevel(user.gems, user.level);
  const nextConfig = config.nextLevel ? getLevelConfig(config.nextLevel) : null;

  return (
    <View 
      className={`bg-blue-card rounded-2xl p-4 mx-4 mb-3 gap-3 border ${className}`.trim()}
      // Regla Hibrida: Inyectamos el color dinamico del borde con su opacidad
      style={{ borderColor: `${config.color}30` }}
      
      // Accesibilidad descriptiva
      accessible={true}
      accessibilityLabel={`Progreso de nivel. Nivel actual: ${config.label}. Progreso: ${progress} por ciento. Faltan ${remaining} gemas para el nivel ${nextConfig?.label || 'maximo'}.`}
    >
      {/* Cabecera (Etiquetas y Badge) */}
      <View className="flex-row justify-between items-start">
        <View>
          <Text className="text-text-muted font-normal text-xs">
            Tu Progreso de Nivel
          </Text>
          <Text 
            className="font-bold text-xl mt-0.5" 
            style={{ color: config.color }}
          >
            {config.label}
          </Text>
        </View>
        
        <GemBadge count={user.gems} size="md" showLabel />
      </View>

      {/* Barra de progreso (Componente Compartido) */}
      <ProgressBar 
        progress={progress} 
        color={config.color} 
        height={10} 
      />

      {/* Pie de tarjeta (Porcentaje y Siguiente Nivel) */}
      <View className="flex-row justify-between items-center">
        <Text className="text-text-secondary font-normal text-xs">
          {progress}% completado
        </Text>
        
        {nextConfig && (
          <View className="flex-row items-center gap-0.5">
            <Text className="text-text-muted font-normal text-xs">
              {remaining.toLocaleString()} para
            </Text>
            
            <ChevronRight size={14} color={Colors.text.muted} />
            
            <Text 
              className="font-semibold text-xs" 
              style={{ color: nextConfig.color }}
            >
              {nextConfig.label}
            </Text>
          </View>
        )}
      </View>
    </View>
  );
}