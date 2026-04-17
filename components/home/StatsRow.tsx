import React from 'react';
import { View, Text } from 'react-native';
import { Gem, BookOpen, Trophy } from 'lucide-react-native';
import { User } from '@/types';
import { Colors } from '@/constants/colors';

interface StatItemProps {
  icon: React.ReactNode;
  value: string;
  label: string;
  accent: string;
}

// Componente privado: Solo se usa dentro de esta fila
function StatItem({ icon, value, label, accent }: StatItemProps) {
  return (
    <View 
      // Estructura base: Flex-1 para que las 3 cajas midan lo mismo, borde de 1px general y 2px arriba
      className="flex-1 bg-blue-card rounded-[14px] p-3.5 items-center gap-1.5 border border-white/5 border-t-2"
      //  Solo el color del borde superior es dinámico
      style={{ borderTopColor: accent }}
      
      accessible={true}
      accessibilityLabel={`${label}: ${value}`}
    >
      {icon}
      
      <Text 
        className="font-bold text-lg" 
        style={{ color: accent }}
      >
        {value}
      </Text>
      
      <Text className="text-text-muted font-normal text-[11px]">
        {label}
      </Text>
    </View>
  );
}

interface StatsRowProps {
  user: User;
  className?: string; // Para inyectar márgenes superiores/inferiores desde la pantalla Home
}

export default function StatsRow({ user, className = '' }: StatsRowProps) {
  return (
    <View className={`flex-row gap-2.5 mx-4 ${className}`.trim()}>
      <StatItem
        icon={<Gem size={20} color={Colors.gold[500]} />}
        value={user.gems.toLocaleString()}
        label="Gemas"
        accent={Colors.gold[500]}
      />
      <StatItem
        icon={<BookOpen size={20} color={Colors.blue.light} />}
        value={user.completedModules.toString()}
        label="Módulos"
        accent={Colors.blue.light}
      />
      <StatItem
        icon={<Trophy size={20} color={Colors.success} />}
        value={`#${user.communityRank}`}
        label="Ranking"
        accent={Colors.success}
      />
    </View>
  );
}