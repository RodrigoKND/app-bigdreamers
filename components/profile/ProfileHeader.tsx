import React from 'react';
import { View, Text, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Calendar } from 'lucide-react-native';
import { User } from '@/types';
import { Colors } from '@/constants/colors';
import { getLevelConfig } from '@/constants/levels';
import LevelBadge from '@/components/shared/LevelBadge';
import GemBadge from '@/components/shared/GemBadge';

interface ProfileHeaderProps {
  user: User;
  className?: string; // Habilitamos la inyección de estilos (ej. mt-4)
}

export default function ProfileHeader({ user, className = '' }: ProfileHeaderProps) {
  const config = getLevelConfig(user.level);
  const joinDate = new Date(user.joinedAt).toLocaleDateString('es-ES', {
    month: 'long',
    year: 'numeric',
  });

  // Lógica de seguridad para iniciales limpias y en mayúscula
  const userInitials = user.name
    .split(' ')
    .map((n) => n[0])
    .join('')
    .slice(0, 2)
    .toUpperCase();

  return (
    <LinearGradient
      colors={[Colors.navy[700], Colors.blue.card]}
      className={`items-center pt-[30px] pb-6 px-4 gap-2.5 ${className}`.trim()}
      
      // Accesibilidad integral para el encabezado
      accessible={true}
      accessibilityLabel={`Perfil de ${user.name}. Nivel ${config.label}. Miembro desde ${joinDate}.`}
    >
      {/* Contenedor del Avatar */}
      <View className="mb-1">
        {user.avatar ? (
          <Image 
            source={{ uri: user.avatar }} 
            className="w-[90px] h-[90px] rounded-full border-[3px]"
            style={{ borderColor: config.color }} 
          />
        ) : (
          <View 
            className="w-[90px] h-[90px] rounded-full border-[3px] bg-navy-600 items-center justify-center"
            style={{ borderColor: config.color }}
          >
            <Text className="text-white font-bold text-[28px]">
              {userInitials}
            </Text>
          </View>
        )}
      </View>

      {/* Información Personal */}
      <Text className="text-white font-bold text-[22px]">
        {user.name}
      </Text>
      <Text className="text-text-muted font-normal text-[13px]">
        {user.email}
      </Text>

      {/* Fila de Insignias (Nivel y Gemas) */}
      <View className="flex-row gap-3 items-center">
        <LevelBadge level={user.level} size="md" />
        <GemBadge count={user.gems} size="md" showLabel />
      </View>

      {/* Metadatos (Fecha de Ingreso) */}
      <View className="flex-row items-center gap-1.5 mt-1">
        <Calendar size={13} color={Colors.text.muted} />
        <Text className="text-text-muted font-normal text-xs">
          Miembro desde {joinDate}
        </Text>
      </View>
    </LinearGradient>
  );
}