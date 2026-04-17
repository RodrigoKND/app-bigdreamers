import React from 'react';
import { View, Image, Text } from 'react-native';

interface AvatarProps {
  uri?: string;
  name: string;
  size?: number;
  // Permite al componente padre inyectar márgenes o posiciones (ej. mt-4)
  className?: string; 
}

function getInitials(name: string): string {
  return name
    .split(' ')
    .slice(0, 2)
    .map((w) => w[0])
    .join('')
    .toUpperCase();
}

export default function Avatar({ uri, name, size = 40, className = '' }: AvatarProps) {
  // ⚠️ EXCEPCIÓN AL ISSUE #11: Valores dinámicos calculados.
  // Mantenemos esto en objeto para no forzar al motor de Tailwind en tiempo real.
  const dynamicSizeStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  return (
    <View
      className={`items-center justify-center overflow-hidden bg-navy-600 ${className}`.trim()}
      style={dynamicSizeStyle}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={dynamicSizeStyle}
          resizeMode="cover"
        />
      ) : (
        <Text
          className="text-white font-bold"
          style={{ fontSize: size * 0.36 }} // Cálculo de fuente dinámico
        >
          {getInitials(name)}
        </Text>
      )}
    </View>
  );
}