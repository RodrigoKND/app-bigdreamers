import React from 'react';
import { View } from 'react-native';
import { Colors } from '@/constants/colors';

interface ProgressBarProps {
  progress: number;
  color?: string;
  bgColor?: string;
  height?: number;
  borderRadius?: number;
  className?: string; // para inyectar margenes 
}

export default function ProgressBar({
  progress,
  color = Colors.gold[500],
  bgColor = 'rgba(255,255,255,0.1)',
  height = 8,
  borderRadius = 4,
  className = '',
}: ProgressBarProps) {
  // Aseguramos que el progreso nunca rompa la UI pasándose de 100 o bajando de 0
  const clampedProgress = Math.min(Math.max(progress, 0), 100);

  return (
    <View 
      //  Ocupa todo el ancho y esconde lo que se salga (overflow)
      className={`w-full overflow-hidden ${className}`.trim()} 
      style={{ backgroundColor: bgColor, height, borderRadius }}
      
      // accesibiliadd 
      accessible={true}
      accessibilityRole="progressbar"
      accessibilityValue={{ min: 0, max: 100, now: clampedProgress }}
    >
      <View
        //  Posición absoluta, anclado arriba a la izq, y altura al 100% del padre
        className="absolute left-0 top-0 h-full"
        style={{
          backgroundColor: color,
          width: `${clampedProgress}%`, //  El valor dinamico
          borderRadius,
        }}
      />
    </View>
  );
}