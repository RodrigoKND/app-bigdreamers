import React from 'react';
import { View, Image, Text } from 'react-native';
import { Colors } from '@/constants/colors';
import { useTheme } from '@/context/ThemeContext';

interface AvatarProps {
  uri?: string;
  name: string;
  size?: number;
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

const Avatar = React.memo(function Avatar({ uri, name, size = 40, className = '' }: AvatarProps) {
  const { isDark } = useTheme();
  const dynamicSizeStyle = {
    width: size,
    height: size,
    borderRadius: size / 2,
  };

  return (
    <View
      className={`items-center justify-center overflow-hidden ${className}`.trim()}
      style={[dynamicSizeStyle, { backgroundColor: isDark ? Colors.navy[600] : Colors.light.surface }]}
    >
      {uri ? (
        <Image
          source={{ uri }}
          style={dynamicSizeStyle}
          resizeMode="cover"
        />
      ) : (
        <Text
          className="font-bold"
          style={{ color: isDark ? '#FFFFFF' : Colors.light.textPrimary, fontSize: size * 0.36 }}
        >
          {getInitials(name)}
        </Text>
      )}
    </View>
  );
});

export default Avatar;