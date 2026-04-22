import React from 'react';
import { View, Text } from 'react-native';
// Importamos la pieza base que construimos en la Fase 1
import Card from '@/components/shared/Card';

interface StatItem {
  label: string;
  value: string | number;
  accent?: string; // Espera un código hexadecimal para inyectar dinámicamente
}

interface ProfileStatCardProps {
  title: string;
  stats: StatItem[];
  className?: string; // Permite inyectar márgenes desde la pantalla principal
}

export default function ProfileStatCard({ title, stats, className = '' }: ProfileStatCardProps) {
  return (
    // Usamos el Card maestro para heredar fondos, bordes y radios automáticamente
    <Card className={`mx-4 mb-3 p-4 ${className}`.trim()}>
      <Text className="text-text-secondary font-semibold text-[13px] mb-3.5">
        {title}
      </Text>

      {/* Contenedor Grid responsivo */}
      <View className="flex-row flex-wrap gap-4">
        {stats.map((stat) => (
          <View 
            key={stat.label} 
            className="min-w-[40%] flex-col gap-1"
            // Accesibilidad: Agrupa el valor y la etiqueta para el lector de pantalla
            accessible={true}
            accessibilityLabel={`${stat.label}: ${stat.value}`}
          >
            <Text 
              className="text-white font-bold text-xl"
              // Regla Híbrida: El color dinámico va en línea, el resto en NativeWind
              style={stat.accent ? { color: stat.accent } : undefined}
            >
              {stat.value}
            </Text>
            <Text className="text-text-muted text-xs font-normal">
              {stat.label}
            </Text>
          </View>
        ))}
      </View>
    </Card>
  );
}