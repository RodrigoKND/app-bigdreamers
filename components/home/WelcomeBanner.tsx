import React from 'react';
import { View, Text, Image } from 'react-native';
import { LinearGradient } from 'expo-linear-gradient';
import { Flame } from 'lucide-react-native';
import { User } from '@/types';
import { Colors } from '@/constants/colors';
import LevelBadge from '@/components/shared/LevelBadge';

interface WelcomeBannerProps {
  user: User;
  className?: string; // Habilitamos inyección de márgenes externos
}

export default function WelcomeBanner({ user, className = '' }: WelcomeBannerProps) {
  // Extraemos solo el primer nombre para un saludo más cercano
  const firstName = user.name.split(' ')[0];

  return (
    <LinearGradient
      // El motor del degradado se mantiene en props nativas para máximo rendimiento
      colors={[Colors.navy[600], Colors.blue.primary]}
      start={{ x: 0, y: 0 }}
      end={{ x: 1, y: 1 }}
      // Toda la estructura de la caja se delega a NativeWind
      className={`mx-4 p-5 rounded-[20px] flex-row items-center justify-between ${className}`.trim()}
      
      // Accesibilidad descriptiva para toda la tarjeta de bienvenida
      accessible={true}
      accessibilityLabel={`Hola ${firstName}. Tienes una racha actual de ${user.streak} días.`}
    >
      {/* Columna Izquierda (Textos y Badges) */}
      <View className="flex-1">
        <Text className="text-white font-bold text-[22px] mb-1">
          Hola, {firstName}
        </Text>
        <Text className="text-text-secondary font-normal text-[13px] mb-3">
          Sigue creciendo con BigDreamers
        </Text>
        
        {/* Fila de Insignias */}
        <View className="flex-row items-center gap-2">
          <LevelBadge level={user.level} size="md" />
          
          {/* Badge de Racha de Días (Streak) */}
          <View className="flex-row items-center gap-1 bg-[#F5C200]/15 px-2.5 py-[5px] rounded-[10px] border border-[#F5C200]/30">
            <Flame size={14} color={Colors.gold[400]} />
            <Text className="text-gold-400 font-semibold text-xs">
              {user.streak} días
            </Text>
          </View>
        </View>
      </View>

      {/* Columna Derecha (Foto de Perfil) */}
      {user.avatar && (
        <Image 
          source={{ uri: user.avatar }} 
          // La imagen mantiene sus proporciones estrictas con utilidades de Tailwind
          className="w-[70px] h-[70px] rounded-full border-2 ml-4"
          // Regla híbrida: El color exacto del borde se inyecta por estilo en línea
          style={{ borderColor: Colors.gold[500] }}
        />
      )}
    </LinearGradient>
  );
}